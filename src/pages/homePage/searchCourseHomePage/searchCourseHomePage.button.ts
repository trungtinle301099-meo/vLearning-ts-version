import type { Locator, Page } from '@playwright/test';
import type { SearchCourseCardAction } from './searchCourseHomePage.type';

export class SearchCourseHomePageButton {
  readonly searchResultContainer: Locator;

  //locator type 1
  constructor(private readonly page: Page) {
    // Khối danh sách kết quả tìm kiếm khóa học trên trang /timkiem
    this.searchResultContainer = this.page.locator('.courseSearchResult');
  }

  //locator type 2
  // Định vị card kết quả khóa học trong .courseSearchResult có thẻ h6 khớp chính xác tên khóa học
  courseResultCardByName(courseName: string): Locator {
    return this.searchResultContainer.locator('.myCourseItem').filter({
      has: this.page.getByRole('heading', { level: 6, name: courseName, exact: true })
    });
  }

  // Định vị tiêu đề h6 của khóa học bên trong card kết quả tìm kiếm
  courseTitleByName(courseName: string): Locator {
    return this.courseResultCardByName(courseName).getByRole('heading', {
      level: 6,
      name: courseName,
      exact: true
    });
  }

  // Định vị động liên kết hành động trong card khóa học theo type SearchCourseCardAction
  courseActionLink(courseName: string, action: SearchCourseCardAction): Locator {
    return this.courseResultCardByName(courseName).getByRole('link', {
      name: action,
      exact: true
    });
  }
}
