import { test, expect } from '../../../src/fixtures/api.fixture';
import {
  createExistingEmailRegisterTestData,
  createExistingUsernameRegisterTestData,
  createRandomRegisterUserData
} from '../../../src/data/user.data';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { registerUserResponseSchema } from '../../../src/schemas/user.schema';
import { logger } from '../../../src/helpers/logger.helper';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import { feature, epic, severity, description } from 'allure-js-commons';

let accountsToCleanup: string[] = [];

test.describe('User Register API', () => {
  test.beforeEach(() => {
    accountsToCleanup = [];
  });

  test.afterEach(async ({ authService, userService }) => {
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });
  });

  test('REGISTER_API_001 - should register successfully with valid random input', async ({
    userService
  }) => {
    await feature('register successfully');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API can register a new user successfully with valid random input.'
    );
    const registerData = createRandomRegisterUserData();
    const response = await userService.register(registerData);

    if (response.status() === 200) {
      accountsToCleanup.push(registerData.taiKhoan);
    }

    const responseText = await attachApiRequestResponse(
      test.info(),
      'register-success',
      registerData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = registerUserResponseSchema.parse(JSON.parse(responseText));

    expect(parsed).toMatchObject(registerData);
    expect(parsed.taiKhoan).toBe(registerData.taiKhoan);
    expect(parsed.email).toBe(registerData.email);
    expect(parsed.maNhom).toBe(registerData.maNhom);

    logger.pass(`Register API passed for account: ${parsed.taiKhoan}`);
  });

  test('REGISTER_API_002 - should not register with existing username', async ({ userService }) => {
    await feature('register with existing username');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API does not allow registration with an existing username.'
    );
    const { existingUser, duplicateUsernameUser } = createExistingUsernameRegisterTestData();

    const preconditionResponse = await userService.register(existingUser);

    if (preconditionResponse.status() === 200) {
      accountsToCleanup.push(existingUser.taiKhoan);
    }

    await attachApiRequestResponse(
      test.info(),
      'precondition-existing-username',
      existingUser,
      preconditionResponse
    );

    expectStatus(preconditionResponse, 200);

    const response = await userService.register(duplicateUsernameUser);

    await attachApiRequestResponse(
      test.info(),
      'register-existing-username',
      duplicateUsernameUser,
      response
    );

    expect(response.status()).not.toBe(200);

    logger.pass(`Register API rejected existing username: ${duplicateUsernameUser.taiKhoan}`);
  });

  test('REGISTER_API_003 - should not register with existing email', async ({ userService }) => {
    await feature('register with existing email');
    await epic('api-user');
    await severity('critical');
    await description(
      'This test verifies that the API does not allow registration with an existing email.'
    );
    const { existingUser, duplicateEmailUser } = createExistingEmailRegisterTestData();

    const preconditionResponse = await userService.register(existingUser);

    if (preconditionResponse.status() === 200) {
      accountsToCleanup.push(existingUser.taiKhoan);
    }

    await attachApiRequestResponse(
      test.info(),
      'precondition-existing-email',
      existingUser,
      preconditionResponse
    );

    expectStatus(preconditionResponse, 200);

    const response = await userService.register(duplicateEmailUser);

    if (response.status() === 200) {
      accountsToCleanup.push(duplicateEmailUser.taiKhoan);
    }

    await attachApiRequestResponse(
      test.info(),
      'register-existing-email',
      duplicateEmailUser,
      response
    );

    expect(response.status()).not.toBe(200);

    logger.pass(`Register API rejected existing email: ${duplicateEmailUser.email}`);
  });
});
