import { expect, test } from '../../../src/fixtures/ui.fixture';
import {
  createInvalidEmailRegisterFooterHomePageData,
  createInvalidFullNameRegisterFooterHomePageData,
  createInvalidPhoneRegisterFooterHomePageData,
  createValidRegisterFooterHomePageData
} from '../../../src/data/registerFooterHomePage.data';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('Register Footer Home Page UI', () => {
  test('REGISTER_FOOTER_HOME_PAGE_UI_001 - should register consultation successfully', async ({
    page,
    registerFooterHomePage
  }) => {
    // Arrange: Prepare valid consultation data.
    const registerData = createValidRegisterFooterHomePageData();

    // Act: Navigate to home page.
    await registerFooterHomePage.gotoHomePage();

    // Assert: Home page should be loaded successfully.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Act: Submit register consultation form with valid data.
    await registerFooterHomePage.registerConsultation(registerData);

    // Assert: Success message should be displayed.
    await expect(
      registerFooterHomePage.button.getMessageByText('Đăng ký thành công')
    ).toBeVisible({ timeout: 200 });

    logger.pass(`Register consultation successfully with email: ${registerData.email}`);
  });

  test('REGISTER_FOOTER_HOME_PAGE_UI_002 - should not register consultation with invalid phone', async ({
    page,
    registerFooterHomePage
  }) => {
    // Arrange: Prepare invalid phone consultation data.
    const registerData = createInvalidPhoneRegisterFooterHomePageData();

    // Act: Navigate to home page.
    await registerFooterHomePage.gotoHomePage();

    // Assert: Home page should be loaded successfully.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Act: Submit register consultation form with invalid phone.
    await registerFooterHomePage.registerConsultation(registerData);

    // Assert: Invalid phone message should be displayed.
    await expect(
      registerFooterHomePage.button.getMessageByText('Số điện thoại không hợp lệ')
    ).toBeVisible({ timeout: 200 });

    logger.pass(`Register consultation rejected invalid phone: ${registerData.phone}`);
  });

  test('REGISTER_FOOTER_HOME_PAGE_UI_003 - should not register consultation with invalid full name', async ({
    page,
    registerFooterHomePage
  }) => {
    // Arrange: Prepare invalid full name consultation data.
    const registerData = createInvalidFullNameRegisterFooterHomePageData();

    // Act: Navigate to home page.
    await registerFooterHomePage.gotoHomePage();

    // Assert: Home page should be loaded successfully.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Act: Submit register consultation form with invalid full name.
    await registerFooterHomePage.registerConsultation(registerData);

    // Assert: Invalid full name message should be displayed.
    await expect(
      registerFooterHomePage.button.getMessageByText('Họ và tên không hợp lệ')
    ).toBeVisible({ timeout: 200 });

    logger.pass(`Register consultation rejected invalid full name: ${registerData.fullName}`);
  });

  test('REGISTER_FOOTER_HOME_PAGE_UI_004 - should not register consultation with invalid email', async ({
    page,
    registerFooterHomePage
  }) => {
    // Arrange: Prepare invalid email consultation data.
    const registerData = createInvalidEmailRegisterFooterHomePageData();

    // Act: Navigate to home page.
    await registerFooterHomePage.gotoHomePage();

    // Assert: Home page should be loaded successfully.
    await expect(page).toHaveURL(HomePageUiEndpoint.homePage);

    // Act: Submit register consultation form with invalid email.
    await registerFooterHomePage.registerConsultation(registerData);

    // Assert: Invalid email message should be displayed.
    await expect(
      registerFooterHomePage.button.getMessageByText('Email không hợp lệ')
    ).toBeVisible({ timeout: 200 });

    logger.pass(`Register consultation rejected invalid email: ${registerData.email}`);
  });
});