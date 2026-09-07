import type { Locator, Page } from '@playwright/test';
import type { Message } from './loginAuthPage.type';

export class LoginAuthPageButton {
  readonly loginContainer: Locator;
  readonly loginForm: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  

  //locator type 1
  constructor(private readonly page: Page) {
    this.loginContainer = page.locator('div.sign-in-container');
    this.loginForm = this.loginContainer.locator('form.formLoginUser');
    this.usernameInput = this.loginForm.locator(
      'input[name="taiKhoan"][placeholder="Tài khoản"]'
    );
    this.passwordInput = this.loginForm.locator(
      'input[name="matKhau"][placeholder="Mật khẩu"]'
    );
    this.loginButton = this.loginForm.getByRole('button');
  }


  //locator type 2
    getToastifyByMessage(message: Message): Locator {
    return this.page.getByText(message, { exact: true });
  }
}
  