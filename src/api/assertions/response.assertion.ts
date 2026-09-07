import { expect, type APIResponse } from '@playwright/test';

export function expectStatus(response: APIResponse, expectedStatus: number): void {
  expect(response.status(), `Expected status ${expectedStatus}`).toBe(expectedStatus);
}

export function expectJsonContentType(response: APIResponse): void {
  const contentType = response.headers()['content-type'] ?? '';
  expect(contentType).toContain('application/json');
}

export async function expectResponseHasFields(
  response: APIResponse,
  fields: string[]
): Promise<Record<string, unknown>> {
  const body = (await response.json()) as Record<string, unknown>;

  for (const field of fields) {
    expect(body, `Expected response body to contain field: ${field}`).toHaveProperty(field);
  }

  return body;
}
