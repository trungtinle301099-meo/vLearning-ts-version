import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';

// Use authenticated session from auth.setup.ts
test.use({ storageState: env.authStatePath });

test.describe('User Management UI', () => {
  test('USER_MANAGEMENT_UI_001 - should open user management page with authenticated session', async ({
    page
  }) => {
    // Act: Navigate to user management page with saved storage state.
    await page.goto(HomePageUiEndpoint.userManagement);

    // Assert: User management page URL should be correct.
    await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

    logger.pass('User management page opened successfully with authenticated session.');
  });
});