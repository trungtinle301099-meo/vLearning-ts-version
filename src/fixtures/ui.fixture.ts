import { test as apiTest, expect } from './api.fixture';
import { BasePage } from '../pages/basePage/basePage.index';
import { LoginAuthPage } from '../pages/authPage/loginAuthPage/loginAuthPage.index';
import { RegisterAuthPage } from '../pages/authPage/registerAuthPage/registerAuthPage.index';
import { HomeHeaderHomePage } from '../pages/homePage/homeHeaderHomePage/homeHeaderHomePage.index';
import { RegisterFooterHomePage } from '../pages/homePage/registerFooterHomePage/registerFooterHomePage.index';
import { DanhMucHomePage } from '../pages/homePage/danhMucHomePage/danhMucHomePage.index';

type UiFixtures = {
  basePage: BasePage;
  loginAuthPage: LoginAuthPage;
  registerAuthPage: RegisterAuthPage;
  homeHeaderHomePage: HomeHeaderHomePage;
  registerFooterHomePage: RegisterFooterHomePage;
  danhMucHomePage: DanhMucHomePage;
};

export const test = apiTest.extend<UiFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },

  loginAuthPage: async ({ page }, use) => {
    await use(new LoginAuthPage(page));
  },

  registerAuthPage: async ({ page }, use) => {
    await use(new RegisterAuthPage(page));
  },

  homeHeaderHomePage: async ({ page }, use) => {
    await use(new HomeHeaderHomePage(page));
  },

  registerFooterHomePage: async ({ page }, use) => {
    await use(new RegisterFooterHomePage(page));
  },

  danhMucHomePage: async ({ page }, use) => {
    await use(new DanhMucHomePage(page));
  },
});

export { expect };