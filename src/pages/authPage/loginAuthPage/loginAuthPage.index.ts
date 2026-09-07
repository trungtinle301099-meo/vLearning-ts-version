import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { AuthUiEndpoint } from '../../../endpoints/ui-endpoints/auth.ui.endpoint';
import { HomePageUiEndpoint } from '../../../endpoints/ui-endpoints/homePage.ui.endpoint';
import { LoginAuthPageButton } from './loginAuthPage.button';
import type { LoginAuthCredential, LoginAuthExpectedUrl } from './loginAuthPage.type';

export class LoginAuthPage extends BasePage {
  readonly button: LoginAuthPageButton;

  constructor(page: Page) {
    super(page);

    this.button = new LoginAuthPageButton(page);
  }

  async gotoLoginPage(): Promise<void> {
    await this.goto(AuthUiEndpoint.login);
  }

  async expectLoginPageLoaded(
    expected: Pick<LoginAuthExpectedUrl, 'loginUrl'> = {
      loginUrl: AuthUiEndpoint.login
    }
  ): Promise<void> {
    await this.waitForPageLoaded();
    await this.waitForUrl(expected.loginUrl);

    await expect(this.button.usernameInput).toBeVisible();
    await expect(this.button.passwordInput).toBeVisible();
    await expect(this.button.loginButton).toBeVisible();
  }

  async fillUsername(username: string): Promise<void> {
    await this.clearAndFill(this.button.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.clearAndFill(this.button.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.button.loginButton);
  }

  async login(credential: LoginAuthCredential): Promise<void> {
    await this.fillUsername(credential.username);
    await this.fillPassword(credential.password);
    await this.clickLoginButton();
  }

  async expectLoginSubmitted(): Promise<void> {
    await expect(this.button.loginButton).toBeEnabled();
  }

  async expectLoginSuccess(
    expected: Pick<LoginAuthExpectedUrl, 'successUrl'> = {
      successUrl: HomePageUiEndpoint.userManagement
    }
  ): Promise<void> {
    await this.waitForUrl(expected.successUrl);
    await expect(this.page).toHaveURL(expected.successUrl);
  }
}