import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';
import { feature, epic, severity, description } from 'allure-js-commons';

// Use authenticated session from auth.setup.ts
test.use({ storageState: env.authStatePath });

test.describe('Logout UI', () => {
  test('LOGOUT_UI_001 - should logout successfully after hovering avatar icon', async ({
    page,
    homeHeaderHomePage
  }) => {
    await feature('logout successfully after hovering avatar icon');
    await epic('ui-logOut');
    await severity('critical');
    await description('This test verifies that the UI can logout successfully after hovering over the avatar icon and clicking the logout button.');
    // Act: Navigate to home page with authenticated session.
    await homeHeaderHomePage.gotoHomePage();

    // Assert: User should be on home page after login session is loaded.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Assert: Avatar icon should be visible before logout.
    await expect(homeHeaderHomePage.button.avatarIcon).toBeVisible();

    // Assert: Login button should not be visible before logout.
    await expect(homeHeaderHomePage.button.loginButton).not.toBeVisible();

    // Act: Hover avatar icon to show logout button.
    await homeHeaderHomePage.hoverAvatarIcon();

    // Assert: Logout button should be visible after hovering avatar icon.
    await expect(homeHeaderHomePage.button.logoutButton).toBeVisible();

    // Act: Click logout button.
    await homeHeaderHomePage.clickLogoutButton();

    // Assert: Login button should be visible after logout.
    await expect(homeHeaderHomePage.button.loginButton).toBeVisible();

    // Assert: Avatar icon should not be visible after logout.
    await expect(homeHeaderHomePage.button.avatarIcon).not.toBeVisible();

    logger.pass('Logout successfully after hovering avatar icon and clicking logout button.');
  });
});