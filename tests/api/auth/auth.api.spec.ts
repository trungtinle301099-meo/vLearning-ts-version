import { test, expect } from '../../../src/fixtures/api.fixture';
import { env, isConfigured } from '../../../src/config/env.config';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { loginResponseSchema } from '../../../src/schemas/auth.schema';
import { logger } from '../../../src/helpers/logger.helper';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import * as allure from 'allure-js-commons';

test.describe('Auth API', () => {
  test('AUTH_API_000 - should have API base URL configured', async () => {
    await allure.feature('login successful');
    await allure.epic('api-login');
    await allure.severity('critical');
    await allure.description(
      'This test verifies that the API base URL is configured correctly in the environment.'
    );
    expect(isConfigured(env.apiBaseUrl)).toBeTruthy();
    expect(env.apiBaseUrl).toMatch(/^https?:\/\//);

    logger.pass(`API base URL is configured: ${env.apiBaseUrl}`);
  });

  test('AUTH_API_001 - should login successfully with valid credential', async ({
    authService
  }) => {
    await allure.feature('login successful');
    await allure.epic('api-login');
    await allure.severity('critical');
    await allure.description(
      'This test verifies that a user can login successfully with valid credentials and receive an access token.'
    );
    const response = await authService.login(env.username, env.password);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'login-success',
      {
        taiKhoan: env.username,
        matKhau: '***'
      },
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const body = JSON.parse(responseText) as Record<string, unknown>;

    expect(body).toHaveProperty('taiKhoan');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('soDT');
    expect(body).toHaveProperty('maNhom');
    expect(body).toHaveProperty('maLoaiNguoiDung');
    expect(body).toHaveProperty('hoTen');
    expect(body).toHaveProperty('accessToken');

    const parsed = loginResponseSchema.parse(body);

    expect(parsed.accessToken).toBeTruthy();

    logger.pass('Login API returned accessToken successfully.');
  });
});
