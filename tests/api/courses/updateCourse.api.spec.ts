import { test, expect } from '../../../src/fixtures/api.fixture';
import { createRandomCourseData } from '../../../src/data/course.data';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { updateCourseResponseSchema } from '../../../src/schemas/course.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { setupCreatedCoursePreconditionForTest } from '../../../src/helpers/common.helper';
import { cleanupCreatedCourse } from '../../../src/helpers/cleanup.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { CreateCourseRequest } from '../../../src/types/course.type';

let accessToken = '';
let createdCourse: CreateCourseRequest;


test.describe('Update Course API', () => {
  test.beforeEach(async ({ authService, courseService }, testInfo) => {
  // Precondition: Prepare created course for update course API test.
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
  await cleanupCreatedCourse({
    courseService,
    courseId: createdCourse?.maKhoaHoc,
    accessToken,
    shouldDelete: true
  });
});

  test('UPDATE_COURSE_API_001 - should update course successfully', async ({ courseService }) => {
    // Arrange: Generate new random update data but keep maKhoaHoc of created course.
    const updateData = createRandomCourseData({
      maKhoaHoc: createdCourse.maKhoaHoc
    });

    // Act: Send update course request.
    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.biDanh).toBe(updateData.biDanh);
    expect(parsed.tenKhoaHoc).toBe(updateData.tenKhoaHoc);
    expect(parsed.moTa).toBe(updateData.moTa);
    expect(parsed.luotXem).toBe(updateData.luotXem);
    expect(parsed.danhGia).toBe(updateData.danhGia);
    expect(parsed.ngayTao).toBe(updateData.ngayTao);

    logger.pass(`Update Course API passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_002 - should update biDanh successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random biDanh for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      biDanh: randomData.biDanh
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-alias-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.biDanh).toBe(updateData.biDanh);

    logger.pass(`Update biDanh passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_003 - should update tenKhoaHoc successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random tenKhoaHoc for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      tenKhoaHoc: randomData.tenKhoaHoc
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-name-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.tenKhoaHoc).toBe(updateData.tenKhoaHoc);

    logger.pass(`Update tenKhoaHoc passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_004 - should update moTa successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random moTa for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      moTa: randomData.moTa
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-description-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.moTa).toBe(updateData.moTa);

    logger.pass(`Update moTa passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_005 - should update luotXem successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random luotXem for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      luotXem: randomData.luotXem
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-view-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.luotXem).toBe(updateData.luotXem);

    logger.pass(`Update luotXem passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_006 - should update danhGia successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random danhGia for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      danhGia: randomData.danhGia
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-rating-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.danhGia).toBe(updateData.danhGia);

    logger.pass(`Update danhGia passed for course: ${createdCourse.maKhoaHoc}`);
  });

  test('UPDATE_COURSE_API_007 - should update ngayTao successfully', async ({ courseService }) => {
    // Arrange: Generate random data, only use random ngayTao for update.
    const randomData = createRandomCourseData();

    const updateData: CreateCourseRequest = {
      ...createdCourse,
      ngayTao: randomData.ngayTao
    };

    const response = await courseService.updateCourse(updateData);

    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-course-created-date-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateCourseResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
    expect(parsed.ngayTao).toBe(updateData.ngayTao);

    logger.pass(`Update ngayTao passed for course: ${createdCourse.maKhoaHoc}`);
  });
});
