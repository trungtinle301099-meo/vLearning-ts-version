import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { setupCreatedCoursePreconditionForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { CreateCourseRequest } from '../../../src/types/course.type';
import { cleanupCreatedCourse } from '../../../src/helpers/cleanup.helper';
import { courseInfoResponseSchema } from '../../../src/schemas/course.schema';

let accessToken = '';
let createdCourse: CreateCourseRequest;
let isDeleted = false;

test.describe('Get Course Info API', () => {
  test.beforeEach(async ({ authService, courseService }, testInfo) => {
  // Setup: Reset delete flag before each test.
  isDeleted = false;

  // Precondition: Prepare created course for get course info API test.
  const precondition = await setupCreatedCoursePreconditionForTest({
    authService,
    courseService,
    testInfo
  });

  accessToken = precondition.accessToken;
  createdCourse = precondition.createdCourse;
});

  test.afterEach(async ({ courseService }) => {
  // Cleanup: Delete course created in beforeEach.
  const courseDeleted = await cleanupCreatedCourse({
    courseService,
    courseId: createdCourse?.maKhoaHoc,
    accessToken,
    shouldDelete: !isDeleted
  });

  if (courseDeleted) {
    isDeleted = true;
  }
});

  test('GET_COURSE_INFO_API_001 - should get course info successfully', async ({
    courseService
  }) => {
    // Act: Get course info by maKhoaHoc created in beforeEach.
    const response = await courseService.getCourseInfo(createdCourse.maKhoaHoc);

    // Report: Attach get course info request and response to Playwright report.
    const responseText = await attachApiRequestResponse(
      test.info(),
      'get-course-info-success',
      {
        method: 'GET',
        query: {
          maKhoaHoc: createdCourse.maKhoaHoc
        }
      },
      response
    );

    // Assert: Get course info API should return status 200 and JSON content type.
    expectStatus(response, 200);
    expectJsonContentType(response);

    // Schema: Validate get course info response contract.
    const parsed = courseInfoResponseSchema.parse(JSON.parse(responseText));

    // Assert: Response should return the exact course created in beforeEach.
    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.tenKhoaHoc).toBe(createdCourse.tenKhoaHoc);
    expect(parsed.moTa).toBe(createdCourse.moTa);
    expect(parsed.luotXem).toBe(createdCourse.luotXem);
    expect(parsed.maNhom).toBe(createdCourse.maNhom);

    // Assert: Response should contain creator information.
    expect(parsed.nguoiTao).toBeTruthy();

    if (parsed.nguoiTao?.taiKhoan) {
      expect(parsed.nguoiTao.taiKhoan).toBe(createdCourse.taiKhoanNguoiTao);
    }

    // Assert: Response should contain course category information when backend returns it.
    if (parsed.danhMucKhoaHoc) {
      const responseCategoryId =
        parsed.danhMucKhoaHoc.maDanhMucKhoaHoc ?? parsed.danhMucKhoaHoc.maDanhMucKhoahoc;

      expect(responseCategoryId).toBe(createdCourse.maDanhMucKhoaHoc);
    }

    logger.pass(`Get Course Info API passed for course: ${createdCourse.maKhoaHoc}`);
  });
});
