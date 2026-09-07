# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/auth/login.ui.spec.ts >> Login UI >> LOGIN_UI_001 - should display login page successfully
- Location: tests/ui/auth/login.ui.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form').filter({ has: locator('form').filter({ hasText: 'Đăng nhậphoặc sử dụng tài kho' }) }).getByPlaceholder('Mật khẩu')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('form').filter({ has: locator('form').filter({ hasText: 'Đăng nhậphoặc sử dụng tài kho' }) }).getByPlaceholder('Mật khẩu')

```

```yaml
- heading "ĐĂNG KÝ" [level=2]
- textbox "Tài khoản"
- textbox "Họ tên"
- textbox "Mật khẩu"
- textbox "Email"
- textbox "Số điện thoại"
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
  1  | import { expect, type Page } from '@playwright/test';
  2  | import { BasePage } from '../../basePage/basePage.index';
  3  | import { LoginAuthPageButton } from './loginAuthPage.button';
  4  | import type { LoginAuthCredential, LoginAuthExpectedUrl } from './loginAuthPage.type';
  5  | 
  6  | export class LoginAuthPage extends BasePage {
  7  |   readonly button: LoginAuthPageButton;
  8  | 
  9  |   constructor(page: Page) {
  10 |     super(page);
  11 |     this.button = new LoginAuthPageButton(page);
  12 |   }
  13 | 
  14 |   async gotoLoginPage(): Promise<void> {
  15 |     await this.goto('/login');
  16 |   }
  17 | 
  18 |   async expectLoginPageLoaded(
  19 |     expected: LoginAuthExpectedUrl = { loginUrl: /\/login/ }
  20 |   ): Promise<void> {
  21 |     await this.waitForPageLoaded();
  22 |     await this.waitForUrl(expected.loginUrl);
  23 |     await expect(this.button.usernameInput).toBeVisible();
> 24 |     await expect(this.button.passwordInput).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  25 |     await expect(this.button.loginButton).toBeVisible();
  26 |   }
  27 | 
  28 |   async fillUsername(username: string): Promise<void> {
  29 |     await this.clearAndFill(this.button.usernameInput, username);
  30 |   }
  31 | 
  32 |   async fillPassword(password: string): Promise<void> {
  33 |     await this.clearAndFill(this.button.passwordInput, password);
  34 |   }
  35 | 
  36 |   async clickLoginButton(): Promise<void> {
  37 |     await this.click(this.button.loginButton);
  38 |   }
  39 | 
  40 |   async login(credential: LoginAuthCredential): Promise<void> {
  41 |     await this.fillUsername(credential.username);
  42 |     await this.fillPassword(credential.password);
  43 |     await this.clickLoginButton();
  44 |   }
  45 | 
  46 |   async expectLoginSubmitted(): Promise<void> {
  47 |     await expect(this.button.loginButton).toBeEnabled();
  48 |   }
  49 | }
  50 | 
```