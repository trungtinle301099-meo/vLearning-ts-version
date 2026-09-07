# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/auth/auth.api.spec.ts >> Auth API >> AUTH_API_001 - login successfully
- Location: tests/api/auth/auth.api.spec.ts:8:7

# Error details

```
SyntaxError: Unexpected token 'T', "Tài khoản "... is not valid JSON
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/fixtures/api.fixture';
  2  | import { env, isConfigured } from '../../../src/config/env.config';
  3  | import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
  4  | import { loginResponseSchema } from '../../../src/schemas/auth.schema';
  5  | import { logger } from '../../../src/helpers/logger.helper';
  6  | 
  7  | test.describe('Auth API', () => {
  8  |   test('AUTH_API_001 - login successfully', async ({ authService }) => {
  9  |     test.skip(
  10 |       !isConfigured(env.tokenCybersoft) || !isConfigured(env.username) || !isConfigured(env.password),
  11 |       'Missing TOKEN_CYBERSOFT, USERNAME or PASSWORD in .env'
  12 |     );
  13 | 
  14 |     const response = await authService.login(env.username, env.password);
> 15 |     const body = await response.json();
     |                  ^ SyntaxError: Unexpected token 'T', "Tài khoản "... is not valid JSON
  16 | 
  17 |     logger.info(`Login status: ${response.status()}`);
  18 |     logger.info(`Login response: ${JSON.stringify(body)}`);
  19 | 
  20 |     expectStatus(response, 200);
  21 |     expectJsonContentType(response);
  22 | 
  23 |     expect(body.taiKhoan).toBe(env.username);
  24 |     expect(body.accessToken).toBeTruthy();
  25 | 
  26 |     loginResponseSchema.parse(body);
  27 | 
  28 |     logger.pass('Login API passed.');
  29 |   });
  30 | });
  31 | 
```