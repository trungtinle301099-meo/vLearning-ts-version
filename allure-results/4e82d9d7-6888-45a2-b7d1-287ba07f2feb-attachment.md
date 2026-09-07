# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/auth/login.ui.spec.ts >> Login UI >> LOGIN_UI_002 - placeholder for real login flow
- Location: tests/ui/auth/login.ui.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('body')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('body')
    14 × locator resolved to <body>…</body>
       - unexpected value "hidden"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { logger } from '../../../src/helpers/logger.helper';
  3  | 
  4  | test.describe('Login UI', () => {
  5  |   test('LOGIN_UI_001 - should open vLearning home page', async ({ page }) => {
  6  |     await page.goto('/');
  7  | 
  8  |     await expect(page.locator('body')).toBeVisible();
  9  | 
  10 |     logger.pass('vLearning home page opened successfully.');
  11 |   });
  12 | 
  13 |   test('LOGIN_UI_002 - placeholder for real login flow', async ({ page }) => {
  14 |     await page.goto('/');
  15 | 
  16 |     // Cần thay locator theo UI thật của project:
  17 |     // await page.getByRole('link', { name: /đăng nhập/i }).click();
  18 |     // await page.getByPlaceholder('Tài khoản').fill(process.env.USERNAME ?? '');
  19 |     // await page.getByPlaceholder('Mật khẩu').fill(process.env.PASSWORD ?? '');
  20 |     // await page.getByRole('button', { name: /đăng nhập/i }).click();
  21 | 
> 22 |     await expect(page.locator('body')).toBeVisible();
     |                                        ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | });
  25 | 
```