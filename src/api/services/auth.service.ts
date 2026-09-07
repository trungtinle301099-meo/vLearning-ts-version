import type { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { AuthEndpoint } from '../../endpoints/api-endpoints/auth.api.endpoint';
import type { LoginRequest } from '../../types/auth.type';

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  async login(username: string, password: string): Promise<APIResponse> {
    const body: LoginRequest = {
      taiKhoan: username,
      matKhau: password
    };

    return this.apiClient.post(AuthEndpoint.login, {
      data: body,
      failOnStatusCode: false
    });
  }
}
