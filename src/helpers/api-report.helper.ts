import type { APIResponse, TestInfo } from '@playwright/test';
import { logger } from './logger.helper';

export async function attachApiRequestResponse(
  testInfo: TestInfo,
  name: string,
  requestBody: unknown,
  response: APIResponse
): Promise<string> {
  const responseText = await response.text();

  logger.info(`${name} status: ${response.status()}`);

  if (response.status() >= 400) {
    logger.info(`${name} error response: ${responseText}`);
  }

  await testInfo.attach(`${name}-request`, {
    body: JSON.stringify(requestBody, null, 2),
    contentType: 'application/json'
  });

  await testInfo.attach(`${name}-response`, {
    body: responseText,
    contentType: 'text/plain'
  });

  return responseText;
}
