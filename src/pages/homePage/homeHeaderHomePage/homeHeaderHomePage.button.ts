import type { Locator, Page } from '@playwright/test';
import type { CourseCategory, EventCategory, Header } from './homeHeaderHomePage.type';

export class HomeHeaderHomePageButton {
  readonly homeIcon: Locator;
  readonly loginButton: Locator;
  readonly avatarIcon: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;

  //locator type 1
  constructor(private readonly page: Page) {
    this.homeIcon = this.page.locator('#sidebarCollapse');
    this.loginButton = this.page.getByRole('button', { name: 'Đăng nhập' });
    this.avatarIcon = this.page.locator('a.infoHeader[href="/thongtincanhan"]');
    this.logoutButton = this.page.locator('i.fas.fa-power-off');
    // Ô tìm kiếm khóa học trên thanh header phiên bản desktop
    this.searchInput = this.page.locator('input.searchForm[placeholder="Tìm kiếm"]');
  }

  //locator type 2
  headerLink(header: Header): Locator {
    return this.page.getByRole('link', { name: header, exact: true });
  }

  courseCategoryLink(category: CourseCategory): Locator {
    return this.page.getByRole('link', { name: category, exact: true });
  }

  eventCategoryLink(event: EventCategory): Locator {
    return this.page.getByRole('link', { name: event, exact: true });
  }
}
