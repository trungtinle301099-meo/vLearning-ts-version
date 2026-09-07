import type { Locator, Page } from '@playwright/test';
import type { RegisterFooterHomePageMessage } from './registerFooterHomePage.type';

export class RegisterFooterHomePageButton {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly registerButton: Locator;

  //locator type 1
  constructor(private readonly page: Page) {
    this.fullNameInput = this.page.getByRole('textbox', { name: 'Họ và tên' });
    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = this.page.getByRole('textbox', { name: 'Số điện thoại' });
    this.registerButton = this.page.getByRole('button', { name: 'Đăng kí' });
  }

  //locator type 2
  getMessageByText(message: RegisterFooterHomePageMessage): Locator {
    return this.page.getByText(message, { exact: false });
  }
}