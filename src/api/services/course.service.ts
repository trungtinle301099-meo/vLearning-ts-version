import type { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { CourseEndpoint } from '../../endpoints/api-endpoints/course.api.endpoint';
import type {
  CourseListPagingParams,
  CreateCourseRequest,
  RegisterCourseRequest
} from '../../types/course.type';

export class CourseService {
  constructor(private readonly apiClient: ApiClient) {}

  getCourseListByGroup(groupCode: string, courseName = ''): Promise<APIResponse> {
    const params: Record<string, string> = {
      MaNhom: groupCode
    };

    if (courseName) {
      params.tenKhoaHoc = courseName;
    }

    return this.apiClient.get(CourseEndpoint.getCourseList, {
      params,
      failOnStatusCode: false
    });
  }

  // Lấy danh sách khóa học phân trang; chỉ truyền query param có giá trị xác định để hỗ trợ test mặc định
  getCourseListPaging(query: CourseListPagingParams = {}): Promise<APIResponse> {
    const params: Record<string, string | number> = {};

    if (query.tenKhoaHoc !== undefined) {
      params.tenKhoaHoc = query.tenKhoaHoc;
    }

    if (query.page !== undefined) {
      params.page = query.page;
    }

    if (query.pageSize !== undefined) {
      params.pageSize = query.pageSize;
    }

    if (query.MaNhom !== undefined) {
      params.MaNhom = query.MaNhom;
    }

    return this.apiClient.get(CourseEndpoint.getCourseListPaging, {
      ...(Object.keys(params).length > 0 ? { params } : {}),
      failOnStatusCode: false
    });
  }

  getCourseInfo(courseId: string): Promise<APIResponse> {
    return this.apiClient.get(CourseEndpoint.getCourseInfo, {
      params: {
        maKhoaHoc: courseId
      },
      failOnStatusCode: false
    });
  }

  createCourse(data: CreateCourseRequest, accessToken: string): Promise<APIResponse> {
    return this.apiClient.post(CourseEndpoint.createCourse, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  updateCourse(data: CreateCourseRequest): Promise<APIResponse> {
    return this.apiClient.put(CourseEndpoint.updateCourse, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  registerCourse(data: RegisterCourseRequest, accessToken: string): Promise<APIResponse> {
    return this.apiClient.post(CourseEndpoint.registerCourse, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  dangKyCourse(data: RegisterCourseRequest, accessToken: string): Promise<APIResponse> {
    return this.apiClient.post(CourseEndpoint.dangKyCourse, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  cancelCourseRegistration(data: RegisterCourseRequest, accessToken: string): Promise<APIResponse> {
    return this.apiClient.post(CourseEndpoint.cancelCourseRegistration, {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json-patch+json'
      },
      data,
      failOnStatusCode: false
    });
  }

  deleteCourse(courseId: string, accessToken: string): Promise<APIResponse> {
    return this.apiClient.delete(CourseEndpoint.deleteCourse, {
      headers: {
        Authorization: `bearer ${accessToken}`
      },
      params: {
        MaKhoaHoc: courseId
      },
      failOnStatusCode: false
    });
  }
}
