import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { loginResponseSchema } from '../../../src/schemas/auth.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import { registerRandomUserForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { RegisterUserRequest } from '../../../src/types/user.type';

let registeredUser: RegisterUserRequest;
let accountsToCleanup: string[] = [];

test.describe('Login API', () => {
  test.beforeEach(async ({ userService }, testInfo) => {
    accountsToCleanup = [];

    registeredUser = await registerRandomUserForTest(userService, testInfo);
    accountsToCleanup.push(registeredUser.taiKhoan);
  });

  test.afterEach(async ({ authService, userService }) => {
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });
  });

  test('USER_LOGIN_API_001 - should login successfully with registered account', async ({
    authService
  }) => {
    const response = await authService.login(registeredUser.taiKhoan, registeredUser.matKhau);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'login-success',
      {
        taiKhoan: registeredUser.taiKhoan,
        matKhau: '***'
      },
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = loginResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.email).toBe(registeredUser.email);
    expect(parsed.maNhom).toBe(registeredUser.maNhom);
    expect(parsed.accessToken).toBeTruthy();

    logger.pass(`Login API passed for account: ${registeredUser.taiKhoan}`);
  });

  test('USER_LOGIN_API_002 - should not login with invalid username', async ({ authService }) => {
    const invalidUsername = `${registeredUser.taiKhoan}_invalid`;

    const response = await authService.login(invalidUsername, registeredUser.matKhau);

    await attachApiRequestResponse(
      test.info(),
      'login-invalid-username',
      {
        taiKhoan: invalidUsername,
        matKhau: '***'
      },
      response
    );

    expect(response.status()).not.toBe(200);

    logger.pass(`Login API rejected invalid username: ${invalidUsername}`);
  });

  test('USER_LOGIN_API_003 - should not login with invalid password', async ({ authService }) => {
    const invalidPassword = `${registeredUser.matKhau}_invalid`;

    const response = await authService.login(registeredUser.taiKhoan, invalidPassword);

    await attachApiRequestResponse(
      test.info(),
      'login-invalid-password',
      {
        taiKhoan: registeredUser.taiKhoan,
        matKhau: '***'
      },
      response
    );

    expect(response.status()).not.toBe(200);

    logger.pass(`Login API rejected invalid password for account: ${registeredUser.taiKhoan}`);
  });
});
