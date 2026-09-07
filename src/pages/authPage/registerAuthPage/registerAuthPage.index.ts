import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { AuthUiEndpoint } from '../../../endpoints/ui-endpoints/auth.ui.endpoint';
import { RegisterAuthPageButton } from './registerAuthPage.button';
import type { RegisterAuthExpectedUrl, RegisterAuthFormData } from './registerAuthPage.type';

export class RegisterAuthPage extends BasePage {
  readonly button: RegisterAuthPageButton;

  constructor(page: Page) {
    super(page);

    this.button = new RegisterAuthPageButton(page);
  }

  async gotoRegisterPage(): Promise<void> {
    await this.goto(AuthUiEndpoint.register);
  }

  async expectRegisterPageLoaded(
    expected: RegisterAuthExpectedUrl = {
      registerUrl: AuthUiEndpoint.register
    }
  ): Promise<void> {
    await this.waitForPageLoaded();
    await this.waitForUrl(expected.registerUrl);

    await expect(this.button.usernameInput).toBeVisible();
    await expect(this.button.passwordInput).toBeVisible();
    await expect(this.button.fullNameInput).toBeVisible();
    await expect(this.button.phoneInput).toBeVisible();
    await expect(this.button.emailInput).toBeVisible();
    await expect(this.button.registerButton).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.clearAndFill(this.button.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.clearAndFill(this.button.passwordInput, password);
  }

  async fillFullName(fullName: string): Promise<void> {
    await this.clearAndFill(this.button.fullNameInput, fullName);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.clearAndFill(this.button.phoneInput, phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndFill(this.button.emailInput, email);
  }

  async clickRegisterButton(): Promise<void> {
    await this.click(this.button.registerButton);
  }

  async clickSwitchRegisterButton(): Promise<void> {
    await this.click(this.button.switchRegisterButton);
  }

  async register(data: RegisterAuthFormData): Promise<void> {
    await this.clickSwitchRegisterButton();
    await this.fillUsername(data.taiKhoan);
    await this.fillPassword(data.matKhau);
    await this.fillFullName(data.hoTen);
    await this.fillPhone(data.soDT);
    await this.fillEmail(data.email);
    await this.clickRegisterButton();
  }
}