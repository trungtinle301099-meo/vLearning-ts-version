import { test, expect } from '../../../src/fixtures/api.fixture';
import { createRandomCourseData } from '../../../src/data/course.data';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { createCourseResponseSchema } from '../../../src/schemas/course.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { loginAsAdminForTest } from '../../../src/helpers/common.helper';
import { cleanupCreatedCourses } from '../../../src/helpers/cleanup.helper';
import { logger } from '../../../src/helpers/logger.helper';

let accessToken = '';
let createdCourseIds: string[] = [];

test.describe('Create Course API', () => {
  test.beforeEach(async ({ authService }) => {
    // Setup: Reset cleanup list before each test.
    createdCourseIds = [];

    // Precondition: Login as admin to get accessToken for create course API.
    accessToken = await loginAsAdminForTest(authService);
  });

  test.afterEach(async ({ courseService }) => {
  // Cleanup: Delete all courses that were created during the test.
  await cleanupCreatedCourses({
    courseService,
    courseIds: createdCourseIds,
    accessToken
  });
});

  test('CREATE_COURSE_API_001 - should create course successfully', async ({ courseService }) => {
    // Arrange: Generate valid random course data to avoid duplicate maKhoaHoc.
    const courseData = createRandomCourseData();

    // Act: Send create course request with valid data and valid accessToken.
    const response = await courseService.createCourse(courseData, accessToken);

    // Cleanup tracking: Delete course after test if create API returned success.
    if (response.status() === 200) {
      createdCourseIds.push(courseData.maKhoaHoc);
    }

    // Report: Attach create course request and response to Playwright report.
    const responseText = await attachApiRequestResponse(
      test.info(),
      'create-course-success',
      courseData,
      response
    );

    // Assert: Create course API should return status 200 and JSON content type.
    expectStatus(response, 200);
    expectJsonContentType(response);

    // Schema: Validate create course response contract.
    const parsed = createCourseResponseSchema.parse(JSON.parse(responseText));

    // Assert: Response should match created course data.
    expect(parsed.maKhoaHoc).toBe(courseData.maKhoaHoc);
    expect(parsed.biDanh).toBe(courseData.biDanh);
    expect(parsed.tenKhoaHoc).toBe(courseData.tenKhoaHoc);
    expect(parsed.moTa).toBe(courseData.moTa);
    expect(parsed.luotXem).toBe(courseData.luotXem);
    expect(parsed.danhGia).toBe(courseData.danhGia);
    expect(parsed.hinhAnh).toBe(courseData.hinhAnh);
    expect(parsed.maNhom).toBe(courseData.maNhom);
    expect(parsed.ngayTao).toBe(courseData.ngayTao);
    expect(parsed.maDanhMucKhoaHoc).toBe(courseData.maDanhMucKhoaHoc);
    expect(parsed.taiKhoanNguoiTao).toBe(courseData.taiKhoanNguoiTao);

    logger.pass(`Create Course API passed for course: ${courseData.maKhoaHoc}`);
  });

  test('CREATE_COURSE_API_002 - should not create course with invalid maDanhMucKhoaHoc', async ({
    courseService
  }) => {
    // Arrange: Generate course data with invalid course category.
    const courseData = createRandomCourseData({
      maDanhMucKhoaHoc: 'INVALID_CATEGORY'
    });

    // Act: Send create course request with invalid maDanhMucKhoaHoc.
    const response = await courseService.createCourse(courseData, accessToken);

    // Cleanup tracking: If backend unexpectedly creates course, delete it after test.
    if (response.status() === 200) {
      createdCourseIds.push(courseData.maKhoaHoc);
    }

    // Report: Attach invalid category request and response to Playwright report.
    await attachApiRequestResponse(
      test.info(),
      'create-course-invalid-category',
      courseData,
      response
    );

    // Assert: Create course API should reject invalid maDanhMucKhoaHoc.
    expect(response.status()).not.toBe(200);

    logger.pass(
      `Create Course API rejected invalid maDanhMucKhoaHoc: ${courseData.maDanhMucKhoaHoc}`
    );
  });

  test('CREATE_COURSE_API_003 - should not create course with HV creator account', async ({
    courseService
  }) => {
    // Arrange: Generate course data with HV account as creator.
    const courseData = createRandomCourseData({
      taiKhoanNguoiTao: 'hocvien01'
    });

    // Act: Send create course request with taiKhoanNguoiTao as HV account.
    const response = await courseService.createCourse(courseData, accessToken);

    // Cleanup tracking: If backend unexpectedly creates course, delete it after test.
    if (response.status() === 200) {
      createdCourseIds.push(courseData.maKhoaHoc);
    }

    // Report: Attach HV creator request and response to Playwright report.
    await attachApiRequestResponse(
      test.info(),
      'create-course-hv-creator',
      courseData,
      response
    );

    // Assert: Create course API should reject HV account as course creator.
    expect(response.status()).not.toBe(200);

    logger.pass(`Create Course API rejected HV creator account: ${courseData.taiKhoanNguoiTao}`);
  });
});
