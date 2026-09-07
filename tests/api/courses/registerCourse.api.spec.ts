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

let accessToken = '';
let registeredUser: RegisterUserRequest;
let createdCourse: CreateCourseRequest;
let accountsToCleanup: string[] = [];
let isCourseDeleted = false;
let isCourseRegistered = false;

test.describe('Register Course API', () => {
  test.beforeEach(async ({ authService, userService, courseService }, testInfo) => {
  // Setup: Reset cleanup tracking before each test.
  accountsToCleanup = [];
  isCourseDeleted = false;
  isCourseRegistered = false;

  // Precondition: Prepare registered user and created course for register course API tests.
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
  // Cleanup 1: Cancel course registration first if registration was successful.
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

  // Cleanup 2: Delete user account registered in beforeEach.
  await cleanupRegisteredAccounts({
    authService,
    userService,
    usernames: accountsToCleanup
  });

  // Cleanup 3: Delete course created in beforeEach.
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

  test('REGISTER_COURSE_API_001 - should register course successfully', async ({ courseService }) => {
    // Arrange: Build valid register course request body.
    const registerCourseData: RegisterCourseRequest = {
      maKhoaHoc: createdCourse.maKhoaHoc,
      taiKhoan: registeredUser.taiKhoan
    };

    // Act: Send register course request with valid maKhoaHoc and valid taiKhoan.
    const response = await courseService.registerCourse(registerCourseData, accessToken);
    if (response.status() === 200) {
      isCourseRegistered = true;
    }

    // Report: Attach register course request and response to Playwright report.
    const responseText = await attachApiRequestResponse(
      test.info(),
      'register-course-success',
      registerCourseData,
      response
    );

    // Assert: Register course API should return status 200 and JSON content type.
    expectStatus(response, 200);
    expectJsonContentType(response);

    // Assert: Register course API should return success message.
    expect(JSON.parse(responseText)).toBe('Ghi danh thành công!');

    logger.pass(
      `Register Course API passed for course: ${createdCourse.maKhoaHoc}, account: ${registeredUser.taiKhoan}`
    );
  });

  test('REGISTER_COURSE_API_002 - should not register course with non-existing account', async ({
    courseService
  }) => {
    // Arrange: Build register course request body with non-existing account.
    const registerCourseData: RegisterCourseRequest = {
      maKhoaHoc: createdCourse.maKhoaHoc,
      taiKhoan: `not_exist_${Date.now()}`
    };

    // Act: Send register course request with non-existing taiKhoan.
    const response = await courseService.registerCourse(registerCourseData, accessToken);

    // Report: Attach invalid account request and response to Playwright report.
    await attachApiRequestResponse(
      test.info(),
      'register-course-non-existing-account',
      registerCourseData,
      response
    );

    // Assert: Register course API should reject non-existing account.
    expect(response.status()).not.toBe(200);

    logger.pass(`Register Course API rejected non-existing account: ${registerCourseData.taiKhoan}`);
  });

  test('REGISTER_COURSE_API_003 - should not register course with non-existing course id', async ({
    courseService
  }) => {
    // Arrange: Build register course request body with non-existing maKhoaHoc.
    const registerCourseData: RegisterCourseRequest = {
      maKhoaHoc: `${createdCourse.maKhoaHoc}_NOT_EXIST`,
      taiKhoan: registeredUser.taiKhoan
    };

    // Act: Send register course request with non-existing maKhoaHoc.
    const response = await courseService.registerCourse(registerCourseData, accessToken);

    // Report: Attach invalid course id request and response to Playwright report.
    await attachApiRequestResponse(
      test.info(),
      'register-course-non-existing-course-id',
      registerCourseData,
      response
    );

    // Assert: Register course API should reject non-existing maKhoaHoc.
    expect(response.status()).not.toBe(200);

    logger.pass(
      `Register Course API rejected non-existing course id: ${registerCourseData.maKhoaHoc}`
    );
  });
});
