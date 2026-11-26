import type { APIResponse } from '@playwright/test';
import { test, expect } from '../../../src/fixtures/api.fixture';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { createRandomRegisterUserData } from '../../../src/data/user.data';
import { createRandomCourseData } from '../../../src/data/course.data';
import { loginAsAdminForTest } from '../../../src/helpers/common.helper';
import { pendingCoursesResponseSchema } from '../../../src/schemas/user.schema';
import type { RegisterUserRequest } from '../../../src/types/user.type';
import type { CreateCourseRequest, RegisterCourseRequest } from '../../../src/types/course.type';

test.describe('Danh sách khóa học chờ xét duyệt', () => {
  let adminToken: string;
  let studentA: RegisterUserRequest;
  let studentB: RegisterUserRequest;
  let courseK1: CreateCourseRequest;
  let courseK2: CreateCourseRequest;
  let cleanup: Array<() => Promise<APIResponse>>;

  test.beforeEach(async ({ authService, userService, courseService }) => {
    cleanup = [];
    adminToken = await loginAsAdminForTest(authService);
    studentA = createRandomRegisterUserData();
    studentB = createRandomRegisterUserData();
    courseK1 = createRandomCourseData();
    courseK2 = createRandomCourseData();

    for (const student of [studentA, studentB]) {
      expectStatus(await userService.register(student), 200);
      cleanup.push(() => userService.deleteUser(student.taiKhoan, adminToken));
    }

    for (const course of [courseK1, courseK2]) {
      expectStatus(await courseService.createCourse(course, adminToken), 200);
      cleanup.push(() => courseService.deleteCourse(course.maKhoaHoc, adminToken));
    }
  });

  test('PENDING_COURSES_API_001 - lọc đúng học viên và trạng thái chờ', async ({
    userService,
    courseService
  }) => {
    async function pending(username: string) {
      const response = await userService.getPendingCourses(username, adminToken);
      expectStatus(response, 200);
      expectJsonContentType(response);
      return pendingCoursesResponseSchema.parse(await response.json());
    }

    const requestA: RegisterCourseRequest = {
      taiKhoan: studentA.taiKhoan,
      maKhoaHoc: courseK1.maKhoaHoc
    };
    const requestB: RegisterCourseRequest = {
      taiKhoan: studentB.taiKhoan,
      maKhoaHoc: courseK2.maKhoaHoc
    };

    const expectedK1 = { maKhoaHoc: courseK1.maKhoaHoc, tenKhoaHoc: courseK1.tenKhoaHoc };
    const expectedK2 = { maKhoaHoc: courseK2.maKhoaHoc, tenKhoaHoc: courseK2.tenKhoaHoc };

    // Hai học viên mới đều chưa có yêu cầu chờ duyệt.
    expect(await pending(studentA.taiKhoan)).toEqual([]);
    expect(await pending(studentB.taiKhoan)).toEqual([]);

    // Đăng ký A vào K1 và B vào K2: cả hai yêu cầu chuyển sang chờ duyệt.
    for (const request of [requestA, requestB]) {
      expectStatus(await courseService.dangKyCourse(request, adminToken), 200);
      cleanup.push(() => courseService.cancelCourseRegistration(request, adminToken));
    }

    // Mỗi học viên chỉ thấy đúng mã và tên khóa học mình đã đăng ký.
    expect(await pending(studentA.taiKhoan)).toEqual([expectedK1]);
    expect(await pending(studentB.taiKhoan)).toEqual([expectedK2]);

    // Ghi danh riêng A vào K1: yêu cầu A–K1 đã được duyệt.
    expectStatus(await courseService.registerCourse(requestA, adminToken), 200);

    // K1 rời danh sách chờ của A. Yêu cầu B–K2 vẫn còn nguyên.
    expect(await pending(studentA.taiKhoan)).toEqual([]);
    expect(await pending(studentB.taiKhoan)).toEqual([expectedK2]);
  });

  test.afterEach(async () => {
    for (const undo of cleanup.reverse()) {
      await expect.soft(undo().then((response) => response.status())).resolves.toBe(200);
    }
  });
});