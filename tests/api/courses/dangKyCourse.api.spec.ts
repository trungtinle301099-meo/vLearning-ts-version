import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import {
  cleanupCourseRegistration,
  cleanupCreatedCourse,
  cleanupRegisteredAccounts
} from '../../../src/helpers/cleanup.helper';
import { setupCourseRegistrationPreconditionForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { CreateCourseRequest, RegisterCourseRequest } from '../../../src/types/course.type';
import type { RegisterUserRequest } from '../../../src/types/user.type';
import { feature, epic, severity, description } from 'allure-js-commons';

let accessToken = '';
let registeredUser: RegisterUserRequest;
let createdCourse: CreateCourseRequest;
let accountsToCleanup: string[] = [];

let isCourseDeleted = false;
let isCourseRegistered = false;

test.describe('Dang Ky Course API', () => {
  test.beforeEach(async ({ authService, userService, courseService }, testInfo) => {
    accountsToCleanup = [];
    isCourseDeleted = false;
    isCourseRegistered = false;

    const precondition = await setupCourseRegistrationPreconditionForTest({
      authService,
      userService,
      courseService,
      testInfo
    });

    accessToken = precondition.accessToken;
    registeredUser = precondition.registeredUser;
    createdCourse = precondition.createdCourse;
    accountsToCleanup = precondition.accountsToCleanup;
  });

  test.afterEach(async ({ authService, userService, courseService }) => {
    // Cleanup 1: Cancel course registration first.
    const isCanceled = await cleanupCourseRegistration({
      courseService,
      courseId: createdCourse?.maKhoaHoc,
      username: registeredUser?.taiKhoan,
      accessToken,
      shouldCancel: isCourseRegistered
    });

    if (isCanceled) {
      isCourseRegistered = false;
    }

    // Cleanup 2: Delete registered student account.
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });

    // Cleanup 3: Delete created course.
    const courseDeleted = await cleanupCreatedCourse({
      courseService,
      courseId: createdCourse?.maKhoaHoc,
      accessToken,
      shouldDelete: !isCourseDeleted
    });

    if (courseDeleted) {
      isCourseDeleted = true;
    }
  });

  test('DANG_KY_COURSE_API_001 - should register course successfully', async ({
    courseService
  }) => {
    await feature('dang ky course');
    await epic('api-course');
    await severity('critical');
    await description('This test verifies that a user can register for a course successfully using the API.');
    // Arrange
    const registerCourseData: RegisterCourseRequest = {
      maKhoaHoc: createdCourse.maKhoaHoc,
      taiKhoan: registeredUser.taiKhoan
    };

    // Act
    const response = await courseService.dangKyCourse(registerCourseData, accessToken);

    if (response.status() === 200) {
      isCourseRegistered = true;
    }

    // Report
    const responseText = await attachApiRequestResponse(
      test.info(),
      'dang-ky-course-success',
      registerCourseData,
      response
    );

    // Assert
    expectStatus(response, 200);
    expectJsonContentType(response);

    expect(JSON.parse(responseText)).toBe('Ghi danh thành công!');

    logger.pass(
      `Dang Ky Course API passed for course: ${createdCourse.maKhoaHoc}, account: ${registeredUser.taiKhoan}`
    );
  });
});