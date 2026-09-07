import { test, expect } from '../../../src/fixtures/api.fixture';
import { createRandomCourseData } from '../../../src/data/course.data';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { setupCreatedCoursePreconditionForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { CreateCourseRequest } from '../../../src/types/course.type';
import { cleanupCreatedCourse } from '../../../src/helpers/cleanup.helper';


let accessToken = '';
let createdCourse: CreateCourseRequest;
let isDeleted = false;

test.describe('Delete Course API', () => {
  test.beforeEach(async ({ authService, courseService }, testInfo) => {
  // Setup: Reset delete flag before each test.
  isDeleted = false;

  // Precondition: Prepare created course for delete course API test.
  const precondition = await setupCreatedCoursePreconditionForTest({
    authService,
    courseService,
    testInfo
  });

  accessToken = precondition.accessToken;
  createdCourse = precondition.createdCourse;
});

  test.afterEach(async ({ courseService }) => {
  // Cleanup: If test failed before deleting course, delete it here.
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

  test('DELETE_COURSE_API_001 - should delete course successfully', async ({ courseService }) => {
    // Act: Delete the course created in beforeEach.
    const response = await courseService.deleteCourse(createdCourse.maKhoaHoc, accessToken);

    // Report: Attach delete course request and response to Playwright report.
    const responseText = await attachApiRequestResponse(
      test.info(),
      'delete-course-success',
      {
        method: 'DELETE',
        query: {
          MaKhoaHoc: createdCourse.maKhoaHoc
        }
      },
      response
    );

    // Assert: Delete course API should return status 200 and JSON content type.
    expectStatus(response, 200);
    expectJsonContentType(response);

    // Assert: Delete course API should return success message.
    expect(JSON.parse(responseText)).toBe('Xóa thành công');

    // Mark: Avoid duplicate cleanup because test already deleted the course.
    isDeleted = true;

    logger.pass(`Delete Course API passed for course: ${createdCourse.maKhoaHoc}`);
  });
});
