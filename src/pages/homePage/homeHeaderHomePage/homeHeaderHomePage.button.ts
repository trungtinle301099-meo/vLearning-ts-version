import type { Locator, Page } from '@playwright/test';
import type { CourseCategory, EventCategory, Header } from './homeHeaderHomePage.type';

export class HomeHeaderHomePageButton {
  readonly homeIcon: Locator;
  readonly loginButton: Locator;
  readonly avatarIcon: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.homeIcon = this.page.locator('#sidebarCollapse');
    this.loginButton = this.page.getByRole('button', { name: 'Đăng nhập' });
    this.avatarIcon = this.page.locator('a.infoHeader[href="/thongtincanhan"]');
    this.logoutButton = this.page.locator('i.fas.fa-power-off');
  }

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