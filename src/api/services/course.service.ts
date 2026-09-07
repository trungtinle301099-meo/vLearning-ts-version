import type { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { CourseEndpoint } from '../../endpoints/api-endpoints/course.api.endpoint';
import type { CreateCourseRequest, RegisterCourseRequest } from '../../types/course.type';

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
