import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { HomePageUiEndpoint } from '../../../endpoints/ui-endpoints/homePage.ui.endpoint';
import { RegisterFooterHomePageButton } from './registerFooterHomePage.button';
import type { RegisterFooterHomePageFormData } from './registerFooterHomePage.type';

export class RegisterFooterHomePage extends BasePage {
  readonly button: RegisterFooterHomePageButton;

  constructor(page: Page) {
    super(page);

    this.button = new RegisterFooterHomePageButton(page);
  }

  async gotoHomePage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.homePage);
  }

  async expectHomePageLoaded(): Promise<void> {
    await this.waitForUrl(HomePageUiEndpoint.homePage);
    await expect(this.page).toHaveURL(HomePageUiEndpoint.homePage);
  }

  async scrollToRegisterFooterForm(): Promise<void> {
    await this.scrollToElement(this.button.fullNameInput);
  }

  async fillFullName(fullName: string): Promise<void> {
    await this.clearAndFill(this.button.fullNameInput, fullName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.clearAndFill(this.button.emailInput, email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.clearAndFill(this.button.phoneInput, phone);
  }

  async clickRegisterButton(): Promise<void> {
    await this.click(this.button.registerButton);
  }

  async registerConsultation(data: RegisterFooterHomePageFormData): Promise<void> {
    await this.scrollToRegisterFooterForm();
    await this.fillFullName(data.fullName);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.clickRegisterButton();
  }
}