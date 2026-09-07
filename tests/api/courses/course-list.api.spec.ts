import { test, expect } from '../../../src/fixtures/api.fixture';
import { env, isConfigured } from '../../../src/config/env.config';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('Course API', () => {
  test('COURSE_API_001 - should get course list by group', async ({ courseService }) => {
    test.skip(
      !isConfigured(env.tokenCybersoft),
      'Cần cấu hình TOKEN_CYBERSOFT trong .env để gọi API khóa học thật.'
    );

    const response = await courseService.getCourseListByGroup(env.defaultGroup);

    expectStatus(response, 200);
    expectJsonContentType(response);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();

    logger.pass(`Course list API returned array for group ${env.defaultGroup}.`);
  });
});
