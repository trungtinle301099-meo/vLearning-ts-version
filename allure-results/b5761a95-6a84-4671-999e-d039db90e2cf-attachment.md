# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/auth/auth.api.spec.ts >> Auth API >> AUTH_API_001 - should login successfully with valid credential
- Location: tests/api/auth/auth.api.spec.ts:17:7

# Error details

```
Error: Expected status 200

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  1  | import { expect, type APIResponse } from '@playwright/test';
  2  | 
  3  | export function expectStatus(response: APIResponse, expectedStatus: number): void {
> 4  |   expect(response.status(), `Expected status ${expectedStatus}`).toBe(expectedStatus);
     |                                                                  ^ Error: Expected status 200
  5  | }
  6  | 
  7  | export function expectJsonContentType(response: APIResponse): void {
  8  |   const contentType = response.headers()['content-type'] ?? '';
  9  |   expect(contentType).toContain('application/json');
  10 | }
  11 | 
  12 | export async function expectResponseHasFields(
  13 |   response: APIResponse,
  14 |   fields: string[]
  15 | ): Promise<Record<string, unknown>> {
  16 |   const body = (await response.json()) as Record<string, unknown>;
  17 | 
  18 |   for (const field of fields) {
  19 |     expect(body, `Expected response body to contain field: ${field}`).toHaveProperty(field);
  20 |   }
  21 | 
  22 |   return body;
  23 | }
  24 | 
```