import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { logger } from '../../../src/helpers/logger.helper';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { loginAsAdminForTest, registerRandomUserForTest } from '../../../src/helpers/common.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import type { RegisterUserRequest } from '../../../src/types/user.type';

let registeredUser: RegisterUserRequest;
let accessToken = '';
let isDeleted = false;

test.describe('Delete User API', () => {
  test.beforeEach(async ({ authService, userService }, testInfo) => {
  // Setup: Reset delete flag before each test.
  isDeleted = false;

  // Precondition: Register a new user account used for delete user API test.
  registeredUser = await registerRandomUserForTest(userService, testInfo);

  // Precondition: Login as admin to get accessToken for delete user API.
  accessToken = await loginAsAdminForTest(authService);
  });

  test.afterEach(async ({ authService, userService }) => {
    // Cleanup: If test failed before deleting user, delete it here.
    if (isDeleted || !registeredUser?.taiKhoan) {
      return;
    }

    await cleanupRegisteredAccounts({
        authService,
        userService,
        usernames: [registeredUser.taiKhoan]
    });
  });

  test('DELETE_API_001 - should delete user successfully', async ({ userService }) => {
    const response = await userService.deleteUser(registeredUser.taiKhoan, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'delete-user-success',
      { TaiKhoan: registeredUser.taiKhoan },
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);
    expect(JSON.parse(responseText)).toBe('Xóa thành công!');

    isDeleted = true;

    logger.pass(`Delete User API passed for account: ${registeredUser.taiKhoan}`);
  });
});
