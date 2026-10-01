import { test, expect } from '../../../src/fixtures/api.fixture';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { findUserAccountResponseSchema } from '../../../src/schemas/user.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import { registerRandomUserForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { RegisterUserRequest } from '../../../src/types/user.type';
import { feature, epic, severity, description } from 'allure-js-commons';

let registeredUser: RegisterUserRequest;
let accountsToCleanup: string[] = [];

test.describe('Find User Account API', () => {
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

  test('FIND_USER_ACCOUNT_API_001 - should find registered account successfully', async ({
    userService
  }) => {
    await feature('find user account');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API can find a registered user account successfully when provided with valid group code and username.'
    );
    const response = await userService.findUserAccount(
      registeredUser.maNhom,
      registeredUser.taiKhoan
    );

    const responseText = await attachApiRequestResponse(
      test.info(),
      'find-user-account-success',
      {
        method: 'GET',
        query: {
          MaNhom: registeredUser.maNhom,
          tuKhoa: registeredUser.taiKhoan
        }
      },
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = findUserAccountResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.length).toBeGreaterThan(0);

    const foundUser = parsed.find((user) => user.taiKhoan === registeredUser.taiKhoan);

    expect(foundUser).toBeTruthy();
    expect(foundUser?.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(foundUser?.hoTen).toBe(registeredUser.hoTen);
    expect(foundUser?.email).toBe(registeredUser.email);

    const responsePhone = foundUser?.soDT ?? foundUser?.soDt;
    expect(responsePhone).toBe(registeredUser.soDT);

    logger.pass(`Find User Account API found registered account: ${registeredUser.taiKhoan}`);
  });
});
