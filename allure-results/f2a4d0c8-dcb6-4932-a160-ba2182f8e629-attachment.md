# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/register/register.ui.spec.ts >> Register UI >> REGISTER_UI_001 - should register successfully with valid random input
- Location: tests/ui/register/register.ui.spec.ts:29:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Đăng ký thành công', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Đăng ký thành công', { exact: true })

```

```yaml
- heading "ĐĂNG KÝ" [level=2]
- textbox "Tài khoản": taikmrcl3bdd788
- textbox "Họ tên": Auto Test Margi
- textbox "Mật khẩu": "@Vhtff1957"
- textbox "Email": taikmrcl3bdd788_6879@gmail.com
- textbox "Số điện thoại": "0909515077"
- combobox:
  - option "GP01" [selected]
  - option "GP02"
  - option "GP03"
  - option "GP04"
  - option "GP05"
  - option "GP06"
  - option "GP07"
  - option "GP08"
  - option "GP09"
  - option "GP010"
- button "Đăng ký"
- heading "Đăng nhập" [level=1]
- text: hoặc sử dụng tài khoản đã đăng ký của bạn
- textbox "Tài khoản"
- textbox "Mật khẩu"
- link "Quên mật khẩu?":
  - /url: "#"
- button "Đăng nhập"
- heading "Chào mừng bạn đã trở lại!" [level=1]
- paragraph: Vui lòng đăng nhập để kết nối với tài khoản của bạn
- button "Đăng nhập"
- heading "Xin chào!" [level=1]
- paragraph: Vui lòng nhấn đăng ký để thiết lập thông tin tài khoản của bạn!
- button "Đăng ký"
```

# Test source

```ts
  1   | import { expect, test } from '../../../src/fixtures/ui.fixture';
  2   | import {
  3   |   createExistingEmailRegisterTestData,
  4   |   createExistingUsernameRegisterTestData,
  5   |   createRandomRegisterUserData
  6   | } from '../../../src/data/user.data';
  7   | import { expectStatus } from '../../../src/api/assertions/response.assertion';
  8   | import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
  9   | import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
  10  | import { logger } from '../../../src/helpers/logger.helper';
  11  | 
  12  | let accountsToCleanup: string[] = [];
  13  | 
  14  | test.describe('Register UI', () => {
  15  |   test.beforeEach(() => {
  16  |     // Setup: Reset cleanup data before each test.
  17  |     accountsToCleanup = [];
  18  |   });
  19  | 
  20  |   test.afterEach(async ({ authService, userService }) => {
  21  |     // Cleanup: Delete accounts created by UI/API during test.
  22  |     await cleanupRegisteredAccounts({
  23  |       authService,
  24  |       userService,
  25  |       usernames: accountsToCleanup
  26  |     });
  27  |   });
  28  | 
  29  |   test('REGISTER_UI_001 - should register successfully with valid random input', async ({
  30  |     page,
  31  |     registerAuthPage
  32  |   }) => {
  33  |     // Arrange: Prepare valid random register data.
  34  |     const registerData = createRandomRegisterUserData();
  35  | 
  36  |     // Cleanup: Track account in case UI register succeeds.
  37  |     accountsToCleanup.push(registerData.taiKhoan);
  38  | 
  39  |     // Act: Navigate to register page.
  40  |     await registerAuthPage.gotoRegisterPage();
  41  | 
  42  |     // Assert: Register page should be loaded successfully.
  43  |     await registerAuthPage.expectRegisterPageLoaded();
  44  | 
  45  |     // Act: Submit register form with valid random input.
  46  |     await registerAuthPage.register(registerData);
  47  | 
  48  |     // Assert: Register success message should be displayed.
> 49  |     await expect(registerAuthPage.button.getToastifyByMessage('Đăng ký thành công')).toBeVisible();
      |                                                                                      ^ Error: expect(locator).toBeVisible() failed
  50  | 
  51  |     // Assert: User should stay on register page or auth page after register.
  52  |     await expect(page).toHaveURL(/\/register|\/login/);
  53  | 
  54  |     logger.pass(`Register UI passed for account: ${registerData.taiKhoan}`);
  55  |   });
  56  | 
  57  |   test('REGISTER_UI_002 - should not register with existing username', async ({
  58  |     page,
  59  |     userService,
  60  |     registerAuthPage
  61  |   }) => {
  62  |     // Arrange: Prepare existing username test data.
  63  |     const { existingUser, duplicateUsernameUser } = createExistingUsernameRegisterTestData();
  64  | 
  65  |     // Precondition: Create existing user by API.
  66  |     const preconditionResponse = await userService.register(existingUser);
  67  | 
  68  |     if (preconditionResponse.status() === 200) {
  69  |       accountsToCleanup.push(existingUser.taiKhoan);
  70  |     }
  71  | 
  72  |     await attachApiRequestResponse(
  73  |       test.info(),
  74  |       'precondition-existing-username',
  75  |       existingUser,
  76  |       preconditionResponse
  77  |     );
  78  | 
  79  |     expectStatus(preconditionResponse, 200);
  80  | 
  81  |     // Act: Navigate to register page.
  82  |     await registerAuthPage.gotoRegisterPage();
  83  | 
  84  |     // Assert: Register page should be loaded successfully.
  85  |     await registerAuthPage.expectRegisterPageLoaded();
  86  | 
  87  |     // Act: Submit register form with existing username.
  88  |     await registerAuthPage.register(duplicateUsernameUser);
  89  | 
  90  |     // Assert: Existing username message should be displayed.
  91  |     await expect(registerAuthPage.button.getToastifyByMessage('Tài khoản đã tồn tại!')).toBeVisible();
  92  | 
  93  |     // Assert: User should still stay on register page.
  94  |     await expect(page).toHaveURL(/\/register|\/login/);
  95  | 
  96  |     logger.pass(`Register UI rejected existing username: ${duplicateUsernameUser.taiKhoan}`);
  97  |   });
  98  | 
  99  |   test('REGISTER_UI_003 - should not register with existing email', async ({
  100 |     page,
  101 |     userService,
  102 |     registerAuthPage
  103 |   }) => {
  104 |     // Arrange: Prepare existing email test data.
  105 |     const { existingUser, duplicateEmailUser } = createExistingEmailRegisterTestData();
  106 | 
  107 |     // Cleanup: Track duplicate account in case UI unexpectedly registers successfully.
  108 |     accountsToCleanup.push(duplicateEmailUser.taiKhoan);
  109 | 
  110 |     // Precondition: Create existing user by API.
  111 |     const preconditionResponse = await userService.register(existingUser);
  112 | 
  113 |     if (preconditionResponse.status() === 200) {
  114 |       accountsToCleanup.push(existingUser.taiKhoan);
  115 |     }
  116 | 
  117 |     await attachApiRequestResponse(
  118 |       test.info(),
  119 |       'precondition-existing-email',
  120 |       existingUser,
  121 |       preconditionResponse
  122 |     );
  123 | 
  124 |     expectStatus(preconditionResponse, 200);
  125 | 
  126 |     // Act: Navigate to register page.
  127 |     await registerAuthPage.gotoRegisterPage();
  128 | 
  129 |     // Assert: Register page should be loaded successfully.
  130 |     await registerAuthPage.expectRegisterPageLoaded();
  131 | 
  132 |     // Act: Submit register form with existing email.
  133 |     await registerAuthPage.register(duplicateEmailUser);
  134 | 
  135 |     // Assert: Existing email message should be displayed.
  136 |     await expect(registerAuthPage.button.getToastifyByMessage('Email đã tồn tại!')).toBeVisible();
  137 | 
  138 |     // Assert: User should still stay on register page.
  139 |     await expect(page).toHaveURL(/\/register|\/login/);
  140 | 
  141 |     logger.pass(`Register UI rejected existing email: ${duplicateEmailUser.email}`);
  142 |   });
  143 | });
```