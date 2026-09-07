import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../../config/env.config';

type QueryValue = string | number | boolean;

export type ApiRequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, QueryValue>;
  data?: unknown;
  failOnStatusCode?: boolean;
};

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private buildHeaders(headers?: Record<string, string>): Record<string, string> {
    return {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(env.tokenCybersoft ? { TokenCybersoft: env.tokenCybersoft } : {}),
      ...(headers ?? {})
    };
  }

  async get(endpoint: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.get(endpoint, {
      headers: this.buildHeaders(options.headers),
      params: options.params,
      failOnStatusCode: options.failOnStatusCode
    });
  }

  async post(endpoint: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.post(endpoint, {
      headers: this.buildHeaders(options.headers),
      params: options.params,
      data: options.data,
      failOnStatusCode: options.failOnStatusCode
    });
  }

  async put(endpoint: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.put(endpoint, {
      headers: this.buildHeaders(options.headers),
      params: options.params,
      data: options.data,
      failOnStatusCode: options.failOnStatusCode
    });
  }

  async delete(endpoint: string, options: ApiRequestOptions = {}): Promise<APIResponse> {
    return this.request.delete(endpoint, {
      headers: this.buildHeaders(options.headers),
      params: options.params,
      data: options.data,
      failOnStatusCode: options.failOnStatusCode
    });
  }
}
