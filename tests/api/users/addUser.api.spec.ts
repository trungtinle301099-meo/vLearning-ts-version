import { test, expect } from '../../../src/fixtures/api.fixture';

import { createRandomAddUserData } from '../../../src/data/user.data';

import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';

import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';

import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';

import { loginAsAdminForTest } from '../../../src/helpers/common.helper';

import { logger } from '../../../src/helpers/logger.helper';

import { feature, epic, severity, description } from 'allure-js-commons';

let accountsToCleanup: string[] = [];
let accessToken = '';

test.describe('User Add API', () => {
  test.beforeEach(async ({ authService }) => {
    accountsToCleanup = [];

    accessToken = await loginAsAdminForTest(authService);
  });

  test.afterEach(async ({ authService, userService }) => {
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });
  });

  test('ADD_USER_API_001 - should add user successfully with valid random input', async ({
    userService
  }) => {
    await feature('add user');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API can add a new user successfully when provided with valid random input data.'
    );

    const addUserData = createRandomAddUserData();

    const response = await userService.addUser(addUserData, accessToken);

    if (response.status() === 200) {
      accountsToCleanup.push(addUserData.taiKhoan);
    }

    const responseText = await attachApiRequestResponse(
      test.info(),
      'add-user-success',
      addUserData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const responseBody = JSON.parse(responseText);

    expect(responseBody).toMatchObject(addUserData);

    expect(responseBody.taiKhoan).toBe(addUserData.taiKhoan);
    expect(responseBody.email).toBe(addUserData.email);
    expect(responseBody.maNhom).toBe(addUserData.maNhom);
    expect(responseBody.maLoaiNguoiDung).toBe(addUserData.maLoaiNguoiDung);

    logger.pass(`Add User API passed for account: ${responseBody.taiKhoan}`);
  });

  test('ADD_USER_API_002 - should not add user with existing username', async ({ userService }) => {
    await feature('add user');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API does not allow adding a user with an existing username.'
    );

    const existingUserData = createRandomAddUserData();

    const firstResponse = await userService.addUser(existingUserData, accessToken);

    if (firstResponse.status() === 200) {
      accountsToCleanup.push(existingUserData.taiKhoan);
    }

    expectStatus(firstResponse, 200);
    expectJsonContentType(firstResponse);

    const duplicateUserData = createRandomAddUserData();

    duplicateUserData.taiKhoan = existingUserData.taiKhoan;

    const duplicateResponse = await userService.addUser(duplicateUserData, accessToken);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'add-user-duplicate-username',
      duplicateUserData,
      duplicateResponse
    );

    expect(duplicateResponse.status()).not.toBe(200);

    expect(responseText).toBeTruthy();

    logger.pass(`Duplicate username validation passed for account: ${existingUserData.taiKhoan}`);
  });

  test('ADD_USER_API_003 - should not add user with existing email', async ({ userService }) => {
    await feature('add user');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API does not allow adding a user with an existing email.'
    );

    const existingUserData = createRandomAddUserData();

    const firstResponse = await userService.addUser(existingUserData, accessToken);

    if (firstResponse.status() === 200) {
      accountsToCleanup.push(existingUserData.taiKhoan);
    }

    expectStatus(firstResponse, 200);
    expectJsonContentType(firstResponse);

    const duplicateUserData = createRandomAddUserData();

    duplicateUserData.email = existingUserData.email;

    const duplicateResponse = await userService.addUser(duplicateUserData, accessToken);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'add-user-duplicate-email',
      duplicateUserData,
      duplicateResponse
    );

    expect(duplicateResponse.status()).not.toBe(200);

    expect(responseText).toBeTruthy();

    logger.pass(`Duplicate email validation passed for email: ${existingUserData.email}`);
  });
});
