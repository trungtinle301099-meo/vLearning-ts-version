import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';
import { feature, severity, description } from 'allure-js-commons';

// Use authenticated session from auth.setup.ts
test.use({ storageState: env.authStatePath });

test.describe('User Information', () => {
  test('should navigate to User Information page', async ({
    thongTinCaNhanPage,
    page,
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await severity('critical');
    await description('This test verifies that a user can navigate to the User Information page from the home page.');

    // Act: Navigate to home page with authenticated session.
    await thongTinCaNhanPage.gotoHomePage();
    // Act: Click on the "Thông tin cá nhân" link to navigate to the User Information page.
    await thongTinCaNhanPage.clickThongTinCaNhanLink();
    // Assert: User should be on the User Information page.
    await expect(page).toHaveURL(HomePageUiEndpoint.thongTinCaNhan);

    logger.pass('User Information page opened successfully with authenticated session.');
  });
});