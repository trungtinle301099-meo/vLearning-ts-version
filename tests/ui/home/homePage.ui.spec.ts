import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';

// Use authenticated session from auth.setup.ts
test.use({ storageState: env.authStatePath });

test.describe('Home Page UI', () => {
  test('HOME_PAGE_UI_001 - should navigate to home page after clicking home icon', async ({
    page,
    homeHeaderHomePage
  }) => {
    // Act: Navigate to user management page with saved storage state.
    await homeHeaderHomePage.gotoUserManagementPage();

    // Assert: User should be on user management page before clicking home icon.
    await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

    // Act: Click home icon from authenticated page.
    await homeHeaderHomePage.clickHomeIcon();

    // Assert: User should navigate back to home page.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Assert: Login button should not be displayed after logged in.
    await expect(homeHeaderHomePage.button.loginButton).not.toBeVisible();

    // Assert: Avatar icon should be displayed after logged in.
    await expect(homeHeaderHomePage.button.avatarIcon).toBeVisible();

    logger.pass('Home page opened successfully after clicking home icon.');
  });

  test('HOME_PAGE_UI_002 - should navigate to home page after clicking Danh mục link', async ({
    page,
    homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Act: Click Danh mục link.
    await homeHeaderHomePage.clickHeaderLink('Danh mục');

    // Assert: User should navigate to home page.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    logger.pass('Home page opened successfully after clicking Danh mục link.');
  });

  test('HOME_PAGE_UI_003 - should navigate to blog page after clicking Blog link', async ({
    page,
    homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Act: Click Blog link.
    await homeHeaderHomePage.clickHeaderLink('Blog');

    // Assert: User should navigate to blog page.
    await expect(page).toHaveURL(HomePageUiEndpoint.blog);

    logger.pass('Blog page opened successfully after clicking Blog link.');
  });

  test('HOME_PAGE_UI_004 - should navigate to information page after clicking Thông tin link', async ({
    page,
    homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Act: Click Thông tin link.
    await homeHeaderHomePage.clickHeaderLink('Thông tin');

    // Assert: User should navigate to information page.
    await expect(page).toHaveURL(HomePageUiEndpoint.information);

    logger.pass('Information page opened successfully after clicking Thông tin link.');
  });

  test('HOME_PAGE_UI_005 - should navigate to course page after clicking Khoá học link', async ({
  page,
  homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Act: Click Khoá học link.
    await homeHeaderHomePage.clickHeaderLink('Khóa học');

    // Assert: User should navigate to course page.
    await expect(page).toHaveURL(HomePageUiEndpoint.course);

    logger.pass('Course page opened successfully after clicking Khoá học link.');
  });

  test('HOME_PAGE_UI_006 - should navigate to event page after clicking Sự kiện link', async ({
  page,
  homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Act: Click Sự kiện link.
    await homeHeaderHomePage.clickHeaderLink('Sự kiện');

    // Assert: User should navigate to event page.
    await expect(page).toHaveURL(HomePageUiEndpoint.event);

    logger.pass('Event page opened successfully after clicking Sự kiện link.');
  });

  test('HOME_PAGE_UI_007 - should display course category links when hovering Danh mục link', async ({
  page,
  homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Assert: Danh mục link should be visible before hover.
    await expect(homeHeaderHomePage.button.headerLink('Danh mục')).toBeVisible();

    // Act: Hover Danh mục link.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Assert: Course category links should be displayed.
    await expect(homeHeaderHomePage.button.courseCategoryLink('Thiết kế Web')).toBeVisible();
    await expect(homeHeaderHomePage.button.courseCategoryLink('Lập trình Backend')).toBeVisible();
    await expect(homeHeaderHomePage.button.courseCategoryLink('Lập trình di động')).toBeVisible();
    await expect(homeHeaderHomePage.button.courseCategoryLink('Lập trình Front end')).toBeVisible();
    await expect(homeHeaderHomePage.button.courseCategoryLink('Lập trình Full Stack')).toBeVisible();
    await expect(homeHeaderHomePage.button.courseCategoryLink('Tư duy lập trình')).toBeVisible();

    logger.pass('Course category links are displayed after hovering Danh mục link.');
  });

  test('HOME_PAGE_UI_008 - should display event links when hovering Sự kiện link', async ({
  page,
  homeHeaderHomePage
  }) => {
    // Act: Navigate to base URL.
    await homeHeaderHomePage.gotoBaseUrl();

    // Assert: Base URL should be opened successfully.
    await expect(page).toHaveURL('/');

    // Assert: Sự kiện link should be visible before hover.
    await expect(homeHeaderHomePage.button.headerLink('Sự kiện')).toBeVisible();

    // Act: Hover Sự kiện link.
    await homeHeaderHomePage.hoverHeaderLink('Sự kiện');

    // Assert: Event links should be displayed.
    await expect(homeHeaderHomePage.button.eventCategoryLink('Sự kiện Sale Cuối Năm')).toBeVisible();
    await expect(homeHeaderHomePage.button.eventCategoryLink('Sự kiện Giáng sinh')).toBeVisible();
    await expect(homeHeaderHomePage.button.eventCategoryLink('Sự kiện Noel')).toBeVisible();

    logger.pass('Event links are displayed after hovering Sự kiện link.');
  });
});