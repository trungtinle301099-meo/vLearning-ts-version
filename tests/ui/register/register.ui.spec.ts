import { expect, test } from '../../../src/fixtures/ui.fixture';
import {
  createExistingEmailRegisterTestData,
  createExistingUsernameRegisterTestData,
  createRandomRegisterUserData
} from '../../../src/data/user.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import { logger } from '../../../src/helpers/logger.helper';

let accountsToCleanup: string[] = [];

test.describe('Register UI', () => {
  test.beforeEach(() => {
    // Setup: Reset cleanup data before each test.
    accountsToCleanup = [];
  });

  test.afterEach(async ({ authService, userService }) => {
    // Cleanup: Delete accounts created by UI/API during test.
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });
  });

  test('REGISTER_UI_001 - should register successfully with valid random input', async ({
    page,
    registerAuthPage
  }) => {
    // Arrange: Prepare valid random register data.
    const registerData = createRandomRegisterUserData();

    // Cleanup: Track account in case UI register succeeds.
    accountsToCleanup.push(registerData.taiKhoan);

    // Act: Navigate to register page.
    await registerAuthPage.gotoRegisterPage();

    // Assert: Register page should be loaded successfully.
    await registerAuthPage.expectRegisterPageLoaded();

    // Act: Submit register form with valid random input.
    await registerAuthPage.register(registerData);

    // Assert: Register success message should be displayed.
    await expect(registerAuthPage.button.getToastifyByMessage('Đăng kí thành công')).toBeVisible();

    // Assert: User should stay on register page or auth page after register.
    await expect(page).toHaveURL(/\/register|\/login/);

    logger.pass(`Register UI passed for account: ${registerData.taiKhoan}`);
  });

  test('REGISTER_UI_002 - should not register with existing username', async ({
    page,
    userService,
    registerAuthPage
  }) => {
    // Arrange: Prepare existing username test data.
    const { existingUser, duplicateUsernameUser } = createExistingUsernameRegisterTestData();

    // Precondition: Create existing user by API.
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

    // Act: Navigate to register page.
    await registerAuthPage.gotoRegisterPage();

    // Assert: Register page should be loaded successfully.
    await registerAuthPage.expectRegisterPageLoaded();

    // Act: Submit register form with existing username.
    await registerAuthPage.register(duplicateUsernameUser);

    // Assert: Existing username message should be displayed.
    await expect(registerAuthPage.button.getToastifyByMessage('Tài khoản đã tồn tại!')).toBeVisible();

    // Assert: User should still stay on register page.
    await expect(page).toHaveURL(/\/register|\/login/);

    logger.pass(`Register UI rejected existing username: ${duplicateUsernameUser.taiKhoan}`);
  });

  test('REGISTER_UI_003 - should not register with existing email', async ({
    page,
    userService,
    registerAuthPage
  }) => {
    // Arrange: Prepare existing email test data.
    const { existingUser, duplicateEmailUser } = createExistingEmailRegisterTestData();

    // Cleanup: Track duplicate account in case UI unexpectedly registers successfully.
    accountsToCleanup.push(duplicateEmailUser.taiKhoan);

    // Precondition: Create existing user by API.
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

    // Act: Navigate to register page.
    await registerAuthPage.gotoRegisterPage();

    // Assert: Register page should be loaded successfully.
    await registerAuthPage.expectRegisterPageLoaded();

    // Act: Submit register form with existing email.
    await registerAuthPage.register(duplicateEmailUser);

    // Assert: Existing email message should be displayed.
    await expect(registerAuthPage.button.getToastifyByMessage('Email đã tồn tại!')).toBeVisible();

    // Assert: User should still stay on register page.
    await expect(page).toHaveURL(/\/register|\/login/);

    logger.pass(`Register UI rejected existing email: ${duplicateEmailUser.email}`);
  });
});