import { test, expect } from '../../../src/fixtures/api.fixture';
import { env, isConfigured } from '../../../src/config/env.config';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { logger } from '../../../src/helpers/logger.helper';
import { feature, epic, severity, description } from 'allure-js-commons';

test.describe('Course API', () => {
  test('COURSE_API_001 - should get course list by group', async ({ courseService }) => {
    await feature('get course list by group');
    await epic('api-course');
    await severity('critical');
    await description('This test verifies that the API can retrieve a list of courses for a specified group.');
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
