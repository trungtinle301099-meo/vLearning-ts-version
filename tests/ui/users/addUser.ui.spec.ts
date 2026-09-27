import { expect, test } from '../../../src/fixtures/ui.fixture';
import { createRandomAddUserData } from '../../../src/data/user.data';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';

test.describe('Admin - Quản lý người dùng', () => {
  let userData: ReturnType<typeof createRandomAddUserData>;
  let isUserCreated = false;

  test.beforeEach(() => {
    userData = createRandomAddUserData();
    isUserCreated = false;
  });

  test.afterEach(async ({ adminPage }) => {
    // Cleanup: Xóa user nếu TC tạo thành công
    if (isUserCreated) {
      await adminPage.button.getXoaButtonByTaiKhoan(userData.taiKhoan).click();

      isUserCreated = false;
    }
  });

  test('TC1 - Thêm người dùng thành công', async ({ adminPage, page }) => {
    await page.goto(HomePageUiEndpoint.userManagement);

    // Step 1 → Step 6: Thực hiện flow thêm người dùng
    await adminPage.addUser(userData);

    // Step 7: Verify toast "Thêm thành công"
    await expect(adminPage.button.getToastifyByMessage('Thêm thành công')).toBeVisible();

    // Mark user đã được tạo thành công để cleanup
    isUserCreated = true;
  });
});
