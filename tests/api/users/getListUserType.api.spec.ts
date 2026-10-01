import { test, expect } from '../../../src/fixtures/api.fixture';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { getUserTypeListResponseSchema } from '../../../src/schemas/user.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { logger } from '../../../src/helpers/logger.helper';
import { feature, epic, severity, description } from 'allure-js-commons';
test.describe('Get User Type List API', () => {
  test('getListUserType_API_001 - should get user type list successfully', async ({
    userService
  }) => {
    await feature('get user type list');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API can retrieve a list of user types successfully.'
    );
    const response = await userService.getUserTypeList();

    const responseText = await attachApiRequestResponse(
      test.info(),
      'get-user-type-list-success',
      {
        method: 'GET',
        body: null,
        query: null
      },
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = getUserTypeListResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.length).toBeGreaterThan(0);

    expect(parsed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          maLoaiNguoiDung: 'GV',
          tenLoaiNguoiDung: 'Giáo vụ'
        }),
        expect.objectContaining({
          maLoaiNguoiDung: 'HV',
          tenLoaiNguoiDung: 'Học viên'
        })
      ])
    );

    logger.pass('Get User Type List API returned GV and HV successfully.');
  });
});
