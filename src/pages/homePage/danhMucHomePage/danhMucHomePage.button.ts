import { Locator, Page } from '@playwright/test';
import { CourseCategory } from '../homeHeaderHomePage/homeHeaderHomePage.type';

export class DanhMucHomePageButton {
  readonly categoryHeading: Locator;

  constructor(private readonly page: Page) {
    this.categoryHeading = this.page.getByRole('heading', {
      name: 'Khóa học theo danh mục',
      exact: true,
    });
  }

  selectedCategoryButton(category: CourseCategory): Locator {
    return this.page.locator('btn').getByText(category, { exact: true });
  }
}