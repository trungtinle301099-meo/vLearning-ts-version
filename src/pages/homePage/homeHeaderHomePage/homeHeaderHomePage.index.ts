import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { HomePageUiEndpoint } from '../../../endpoints/ui-endpoints/homePage.ui.endpoint';
import { HomeHeaderHomePageButton } from './homeHeaderHomePage.button';
import type { CourseCategory, Header, HomeHeaderExpectedUrl } from './homeHeaderHomePage.type';

export class HomeHeaderHomePage extends BasePage {
  readonly button: HomeHeaderHomePageButton;

  constructor(page: Page) {
    super(page);

    this.button = new HomeHeaderHomePageButton(page);
  }

  async gotoBaseUrl(): Promise<void> {
    await this.goto('/');
  }

  async gotoHomePage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.homePage);
  }

  async gotoUserManagementPage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.userManagement);
  }

  async clickHomeIcon(): Promise<void> {
    await this.click(this.button.homeIcon);
  }

  async clickHeaderLink(header: Header): Promise<void> {
    await this.click(this.button.headerLink(header));
  }

  async hoverHeaderLink(header: Header): Promise<void> {
    await this.hover(this.button.headerLink(header));
  }

  async hoverAvatarIcon(): Promise<void> {
  await this.hover(this.button.avatarIcon);

  await expect(this.button.logoutButton).toBeVisible();

  await expect
    .poll(
      async () => {
        const avatarBox = await this.button.avatarIcon.boundingBox();
        const logoutBox = await this.button.logoutButton.boundingBox();

        if (!avatarBox || !logoutBox) {
          return false;
        }

        const isOverlapping =
          logoutBox.x < avatarBox.x + avatarBox.width &&
          logoutBox.x + logoutBox.width > avatarBox.x &&
          logoutBox.y < avatarBox.y + avatarBox.height &&
          logoutBox.y + logoutBox.height > avatarBox.y;

        return !isOverlapping;
      },
      {
        timeout: 10000,
        message: 'Wait until logout button is not overlapped with avatar icon'
      }
    )
    .toBe(true);
}

  async clickLogoutButton(): Promise<void> {
    await this.click(this.button.logoutButton);
  }

  async clickCourseCategoryLink(category: CourseCategory): Promise<void> {
    await this.click(this.button.courseCategoryLink(category));
  }

  async expectHomePageLoaded(
    expected: HomeHeaderExpectedUrl = {
      homePageUrl: HomePageUiEndpoint.homePage
    }
  ): Promise<void> {
    await this.waitForUrl(expected.homePageUrl);
    await expect(this.page).toHaveURL(expected.homePageUrl);
  }
}