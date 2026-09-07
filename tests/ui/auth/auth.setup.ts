import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { expect, test as setup } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { createValidLoginAuthCredential } from '../../../src/data/user.data';
import { logger } from '../../../src/helpers/logger.helper';


setup('Authenticate: Login with existing test account from .env', async ({
  page,
  loginAuthPage
}) => {
  // Setup: Validate required env variables.
  if (!env.username || !env.password) {
    throw new Error('USERNAME or PASSWORD is missing in .env');
  }

  // Setup: Create auth state folder if it does not exist.
  mkdirSync(dirname(env.authStatePath), { recursive: true });

  // Arrange: Prepare valid login credential from .env.
  const authCredential = createValidLoginAuthCredential();

  logger.step('Navigate to login page');

  // Act: Navigate to login page.
  await loginAuthPage.gotoLoginPage();

  // Assert: Login page should be visible before login.
  await loginAuthPage.expectLoginPageLoaded();

  logger.step(`Login with username: ${authCredential.username}`);

  // Act: Login with existing test account.
  await loginAuthPage.login(authCredential);

  logger.step('Verify login success');

  // Assert: Login successfully and navigate to user management page.
  await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

  // Setup: Save authenticated storage state for tests that need login session.
  await page.context().storageState({
    path: env.authStatePath
  });

  logger.pass(`Auth state saved at: ${env.authStatePath}`);
});