import type { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { UserEndpoint } from '../../endpoints/api-endpoints/user.api.endpoint';
import type { RegisterUserRequest, UpdateUserInfoRequest } from '../../types/user.type';

export class UserService {
  constructor(private readonly apiClient: ApiClient) {}

  register(data: RegisterUserRequest): Promise<APIResponse> {
    return this.apiClient.post(UserEndpoint.register, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  getUserList(groupCode: string, keyword = ''): Promise<APIResponse> {
    return this.apiClient.get(UserEndpoint.getUserList, {
      params: {
        MaNhom: groupCode,
        tuKhoa: keyword
      },
      failOnStatusCode: false
    });
  }


  getUserTypeList(): Promise<APIResponse> {
    return this.apiClient.get(UserEndpoint.getUserTypeList, {
      failOnStatusCode: false
    });
  }

  updateUserInfo(data: UpdateUserInfoRequest, accessToken: string): Promise<APIResponse> {
    return this.apiClient.put(UserEndpoint.updateUserInfo, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  getUserListPaging(
    groupCode: string,
    keyword: string,
    page: number,
    pageSize: number
  ): Promise<APIResponse> {
    return this.apiClient.get(UserEndpoint.getUserListPaging, {
      params: {
        MaNhom: groupCode,
        tuKhoa: keyword,
        page,
        pageSize
      },
      failOnStatusCode: false
    });
  }

  findUserAccount(groupCode: string, keyword: string): Promise<APIResponse> {
    return this.apiClient.get(UserEndpoint.findUserAccount, {
      params: {
        MaNhom: groupCode,
        tuKhoa: keyword
      },
      failOnStatusCode: false
    });
  }

  deleteUser(username: string, accessToken: string): Promise<APIResponse> {
    return this.apiClient.delete(UserEndpoint.deleteUser, {
      headers: {
        Authorization: `bearer ${accessToken}`
      },
      params: {
        TaiKhoan: username
      },
      failOnStatusCode: false
    });
  }
}
