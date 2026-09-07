import { expect, Page } from '@playwright/test';
import { DanhMucHomePageButton } from './danhMucHomePage.button';
import { CourseCategory } from '../homeHeaderHomePage/homeHeaderHomePage.type';

export class DanhMucHomePage {
  readonly button: DanhMucHomePageButton;

  constructor(private readonly page: Page) {
    this.button = new DanhMucHomePageButton(page);
  }

  async expectCategoryHeadingVisible(): Promise<void> {
    await expect(this.button.categoryHeading).toBeVisible();
  }

  async expectSelectedCategoryButtonVisible(category: CourseCategory): Promise<void> {
    await expect(this.button.selectedCategoryButton(category)).toBeVisible();
  }
}