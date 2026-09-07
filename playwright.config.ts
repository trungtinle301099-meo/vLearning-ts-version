import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const baseURL = (process.env.BASE_URL ?? 'https://demo2.cybersoft.edu.vn').trim();
const apiBaseURL = (process.env.API_BASE_URL ?? 'https://elearningnew.cybersoft.edu.vn').trim();
const tokenCybersoft = (process.env.TOKEN_CYBERSOFT ?? '').trim();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,

  expect: {
    timeout: 5_000
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  outputDir: 'reports/playwright/test-results',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright/html', open: 'never' }],
    ['junit', { outputFile: 'reports/playwright/junit/results.xml' }],
    ['allure-playwright', { outputFolder: 'reports/playwright/allure-results' }]
  ],

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
          accept: 'application/json',
          ...(tokenCybersoft ? { TokenCybersoft: tokenCybersoft } : {})
        }
      }
    },

    {
      name: 'auth-setup',
      testDir: './tests/ui/auth',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL
      }
    },

    {
      name: 'ui',
      testDir: './tests/ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL
      }
    }
  ]
});