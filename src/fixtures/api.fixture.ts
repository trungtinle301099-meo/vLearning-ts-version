import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api/clients/api-client';
import { AuthService } from '../api/services/auth.service';
import { CourseService } from '../api/services/course.service';
import { UserService } from '../api/services/user.service';
import { env } from '../config/env.config';

type ApiFixtures = {
  apiClient: ApiClient;
  authService: AuthService;
  courseService: CourseService;
  userService: UserService;
};


export const test = base.extend<ApiFixtures>({
  apiClient: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: env.apiBaseUrl
    });

    await use(new ApiClient(apiContext));

    await apiContext.dispose();
  },


  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },

  courseService: async ({ apiClient }, use) => {
    await use(new CourseService(apiClient));
  },

  userService: async ({ apiClient }, use) => {
    await use(new UserService(apiClient));
  }
});



export { expect };
