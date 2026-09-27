import { expect, type Page } from '@playwright/test';
import { BasePage } from '../basePage/basePage.index';
import { ThongTinCaNhanPageButton } from './thongTinCaNhanPage.button';
import { HomePageUiEndpoint } from '../../endpoints/ui-endpoints/homePage.ui.endpoint';

export class ThongTinCaNhanPage extends BasePage {
  readonly button: ThongTinCaNhanPageButton;

  constructor(page: Page) {
    super(page);

    this.button = new ThongTinCaNhanPageButton(page);
  }

  async gotoHomePage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.homePage);
  }

  async clickThongTinCaNhanLink(): Promise<void> {
    await this.click(this.button.thongTinCaNhanLink);
  }
}
