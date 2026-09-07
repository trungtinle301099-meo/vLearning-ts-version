import { expect, test } from '../../../src/fixtures/ui.fixture';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import {
  createEmptyPasswordLoginAuthCredential,
  createEmptyUsernameLoginAuthCredential,
  createInvalidEmailLoginAuthCredential,
  createInvalidUsernameLoginAuthCredential,
  createValidLoginAuthCredential
} from '../../../src/data/user.data';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('Login UI', () => {
  test('LOGIN_UI_001 - should display login page successfully', async ({ page, loginAuthPage }) => {
    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded successfully.
    await loginAuthPage.expectLoginPageLoaded();

    // Assert: Login page URL should be correct.
    await expect(page).toHaveURL(/\/login/);

    logger.pass('Login page loaded successfully.');
  });

  test('LOGIN_UI_002 - should submit login form with valid credentials', async ({
    page,
    loginAuthPage
  }) => {
    // Arrange: Prepare valid login credential from user data.
    const authCredential = createValidLoginAuthCredential();

    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded before input credential.
    await loginAuthPage.expectLoginPageLoaded();

    // Act: Submit login form with valid credential.
    await loginAuthPage.login(authCredential);

    // Assert: Login successfully and navigate to user management page.
    await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

    logger.pass(`Login successfully with account: ${authCredential.username}`);
  });

  test('LOGIN_UI_003 - should show error message when username does not exist', async ({
    page,
    loginAuthPage
  }) => {
    // Arrange: Prepare invalid username credential from user data.
    const invalidUsernameCredential = createInvalidUsernameLoginAuthCredential();

    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded before input credential.
    await loginAuthPage.expectLoginPageLoaded();

    // Act: Submit login form with random username that does not exist.
    await loginAuthPage.login(invalidUsernameCredential);

    // Assert: Error message should be displayed.
    await expect(
      loginAuthPage.button.getToastifyByMessage('Tài khoản hoặc mật khẩu không đúng!')
    ).toBeVisible();

    // Assert: User should still stay on login page.
    await expect(page).toHaveURL(/\/login/);

    logger.pass(
      `Login failed correctly with non-existing username: ${invalidUsernameCredential.username}`
    );
  });

   test('LOGIN_UI_004 - should show error message when email is incorrect', async ({
    page,
    loginAuthPage
  }) => {
    // Arrange: Prepare invalid email credential from user data.
    const invalidEmailCredential = createInvalidEmailLoginAuthCredential();

    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded before input credential.
    await loginAuthPage.expectLoginPageLoaded();

    // Act: Submit login form with random email that does not exist.
    await loginAuthPage.login(invalidEmailCredential);

    // Assert: Error message should be displayed.
    await expect(
      loginAuthPage.button.getToastifyByMessage('Tài khoản hoặc mật khẩu không đúng!')
    ).toBeVisible();

    // Assert: User should still stay on login page.
    await expect(page).toHaveURL(/\/login/);

    logger.pass(`Login failed correctly with invalid email: ${invalidEmailCredential.username}`);
  });

  test('LOGIN_UI_005 - should show error message when username is empty', async ({
    page,
    loginAuthPage
  }) => {
    // Arrange: Prepare empty username credential from user data.
    const emptyUsernameCredential = createEmptyUsernameLoginAuthCredential();

    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded before input credential.
    await loginAuthPage.expectLoginPageLoaded();

    // Act: Submit login form with empty username.
    await loginAuthPage.login(emptyUsernameCredential);

    // Assert: Error message should be displayed.
    await expect(
      loginAuthPage.button.getToastifyByMessage('Tài khoản hoặc mật khẩu không đúng!')
    ).toBeVisible();

    // Assert: User should still stay on login page.
    await expect(page).toHaveURL(/\/login/);

    logger.pass('Login failed correctly when username is empty.');
  });

  test('LOGIN_UI_006 - should show error message when password is empty', async ({
    page,
    loginAuthPage
  }) => {
    // Arrange: Prepare empty password credential from user data.
    const emptyPasswordCredential = createEmptyPasswordLoginAuthCredential();

    // Act: Navigate to login page.
    await loginAuthPage.gotoLoginPage();

    // Assert: Login page should be loaded before input credential.
    await loginAuthPage.expectLoginPageLoaded();

    // Act: Submit login form with empty password.
    await loginAuthPage.login(emptyPasswordCredential);

    // Assert: Error message should be displayed.
    await expect(
      loginAuthPage.button.getToastifyByMessage('Tài khoản hoặc mật khẩu không đúng!')
    ).toBeVisible();

    // Assert: User should still stay on login page.
    await expect(page).toHaveURL(/\/login/);

    logger.pass('Login failed correctly when password is empty.');
  });
});