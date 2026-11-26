import type { Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { SearchCourseHomePageButton } from './searchCourseHomePage.button';
import type { SearchCourseCardAction } from './searchCourseHomePage.type';

export class SearchCourseHomePage extends BasePage {
  readonly button: SearchCourseHomePageButton;

  constructor(page: Page) {
    super(page);
    this.button = new SearchCourseHomePageButton(page);
  }

  // Nhấn vào liên kết hành động (ví dụ "Xem chi tiết") của đúng khóa học trên trang kết quả tìm kiếm
  async clickCourseActionLink(
    courseName: string,
    action: SearchCourseCardAction = 'Xem chi tiết'
  ): Promise<void> {
    await this.waitForVisible(this.button.courseActionLink(courseName, action));
    await this.click(this.button.courseActionLink(courseName, action));
  }
}
