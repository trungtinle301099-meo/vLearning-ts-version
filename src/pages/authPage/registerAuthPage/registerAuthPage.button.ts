import type { Locator, Page } from '@playwright/test';
import type { RegisterAuthMessage } from './registerAuthPage.type';

export class RegisterAuthPageButton {
  readonly registerContainer: Locator;
  readonly registerForm: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly registerButton: Locator;
  readonly groupSelect: Locator;
  readonly switchRegisterButton: Locator;

  //locator type 1
  constructor(private readonly page: Page) {
    this.registerContainer = page.locator('div.form-container.sign-up-container');
    this.registerForm = this.registerContainer.locator('form');

    this.usernameInput = this.registerForm.locator(
      'input[name="taiKhoan"][placeholder="Tài khoản"]'
    );

    this.fullNameInput = this.registerForm.locator(
      'input[name="hoTen"][placeholder="Họ tên"]'
    );

    this.passwordInput = this.registerForm.locator(
      'input[name="matKhau"][placeholder="Mật khẩu"]'
    );

    this.emailInput = this.registerForm.locator(
      'input[name="email"][placeholder="Email"]'
    );

    this.phoneInput = this.registerForm.locator(
      'input[name="soDT"][placeholder="Số điện thoại"]'
    );

    this.groupSelect = this.registerForm.locator('select[name="maNhom"]');

    this.registerButton = this.registerForm.locator('button[type="submit"]', {
      hasText: 'Đăng ký',
    });
    this.switchRegisterButton = this.page.locator('#signUp');
  }

    //locator type 2
  getToastifyByMessage(message: RegisterAuthMessage): Locator {
    return this.page.getByText(message, { exact: true });
  }
}