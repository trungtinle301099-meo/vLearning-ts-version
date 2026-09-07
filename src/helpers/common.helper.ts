import { expect, type TestInfo } from '@playwright/test';
import { createRandomRegisterUserData } from '../data/user.data';
import { expectJsonContentType, expectStatus } from '../api/assertions/response.assertion';
import { registerUserResponseSchema } from '../schemas/user.schema';
import { attachApiRequestResponse } from './api-report.helper';
import { logger } from './logger.helper';
import type { UserService } from '../api/services/user.service';
import type { RegisterUserRequest } from '../types/user.type';
import { loginResponseSchema } from '../schemas/auth.schema';
import { env } from '../config/env.config';
import { AuthService } from '../api/services/auth.service';
import { createRandomCourseData } from '../data/course.data';
import { createCourseResponseSchema } from '../schemas/course.schema';
import type { CourseService } from '../api/services/course.service';
import type { CreateCourseRequest } from '../types/course.type';


type CourseRegistrationPreconditionResult = {
  accessToken: string;
  registeredUser: RegisterUserRequest;
  createdCourse: CreateCourseRequest;
  accountsToCleanup: string[];
};

type CreatedCoursePreconditionResult = {
  accessToken: string;
  createdCourse: CreateCourseRequest;
};



export async function setupCreatedCoursePreconditionForTest({
  authService,
  courseService,
  testInfo
}: {
  authService: AuthService;
  courseService: CourseService;
  testInfo: TestInfo;
}): Promise<CreatedCoursePreconditionResult> {
  // Precondition: Login as admin to get accessToken for create/delete course API.
  const accessToken = await loginAsAdminForTest(authService);

  // Arrange: Generate random course data to avoid duplicate maKhoaHoc.
  const createdCourse = createRandomCourseData();

  // Precondition: Create a course successfully before testing course API.
  const createResponse = await courseService.createCourse(createdCourse, accessToken);

  // Report: Attach precondition create course request and response.
  const createResponseText = await attachApiRequestResponse(
    testInfo,
    'precondition-create-course',
    createdCourse,
    createResponse
  );

  // Assert: Course must be created successfully before test.
  expectStatus(createResponse, 200);
  expectJsonContentType(createResponse);

  // Schema: Validate create course response contract.
  const parsed = createCourseResponseSchema.parse(JSON.parse(createResponseText));

  // Assert: Created course should match test data.
  expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
  expect(parsed.tenKhoaHoc).toBe(createdCourse.tenKhoaHoc);

  logger.info(`Precondition created course: ${createdCourse.maKhoaHoc}`);

  return {
    accessToken,
    createdCourse
  };
}

export async function setupCourseRegistrationPreconditionForTest({
  authService,
  userService,
  courseService,
  testInfo
}: {
  authService: AuthService;
  userService: UserService;
  courseService: CourseService;
  testInfo: TestInfo;
}): Promise<CourseRegistrationPreconditionResult> {
  // Precondition: Login as admin to get accessToken.
  const accessToken = await loginAsAdminForTest(authService);

  // Precondition: Register a new user account used for course registration test data.
  const registeredUser = await registerRandomUserForTest(userService, testInfo);

  // Arrange: Generate random course data to avoid duplicate maKhoaHoc.
  const createdCourse = createRandomCourseData();

  // Precondition: Create a course successfully before testing register course API.
  const createResponse = await courseService.createCourse(createdCourse, accessToken);

  // Report: Attach precondition create course request and response.
  const createResponseText = await attachApiRequestResponse(
    testInfo,
    'precondition-create-course',
    createdCourse,
    createResponse
  );

  // Assert: Precondition create course API should be successful.
  expectStatus(createResponse, 200);
  expectJsonContentType(createResponse);

  // Schema: Validate create course response contract.
  const parsedCreateResponse = createCourseResponseSchema.parse(JSON.parse(createResponseText));

  // Assert: Created course should match generated test data.
  expect(parsedCreateResponse.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
  expect(parsedCreateResponse.tenKhoaHoc).toBe(createdCourse.tenKhoaHoc);

  logger.info(`Precondition registered account: ${registeredUser.taiKhoan}`);
  logger.info(`Precondition created course: ${createdCourse.maKhoaHoc}`);

  return {
    accessToken,
    registeredUser,
    createdCourse,
    accountsToCleanup: [registeredUser.taiKhoan]
  };
}

export async function registerRandomUserForTest(
  userService: UserService,
  testInfo: TestInfo
): Promise<RegisterUserRequest> {
  const registerData = createRandomRegisterUserData();

  const response = await userService.register(registerData);
  const responseText = await attachApiRequestResponse(
    testInfo,
    'precondition-register-user',
    registerData,
    response
  );

  expectStatus(response, 200);
  expectJsonContentType(response);

  const parsed = registerUserResponseSchema.parse(JSON.parse(responseText));

  expect(parsed.taiKhoan).toBe(registerData.taiKhoan);
  expect(parsed.email).toBe(registerData.email);

  logger.info(`Precondition registered account: ${registerData.taiKhoan}`);

  return registerData;
}

export async function loginAsAdminForTest(authService: AuthService): Promise<string> {
  const response = await authService.login(env.username, env.password);

  logger.info(`Precondition login status: ${response.status()}`);

  expectStatus(response, 200);
  expectJsonContentType(response);

  const parsed = loginResponseSchema.parse(await response.json());

  expect(parsed.accessToken).toBeTruthy();

  return parsed.accessToken;
}
