import type { Locator, Page } from '@playwright/test';
import { RegisterFooterHomePageMessage } from '../homePage/registerFooterHomePage/registerFooterHomePage.type';

export class ThongTinCaNhanPageButton {
  readonly thongTinCaNhanLink: Locator;

  //locator type 1
  constructor(private readonly page: Page) {
    this.thongTinCaNhanLink = page.locator('a[href="/thongtincanhan"]');
  }
}
