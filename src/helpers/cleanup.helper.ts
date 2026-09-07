import { env } from '../config/env.config';
import { loginResponseSchema } from '../schemas/auth.schema';
import type { AuthService } from '../api/services/auth.service';
import type { UserService } from '../api/services/user.service';
import { logger } from './logger.helper';
import { CourseService } from '../api/services/course.service';
import { RegisterCourseRequest } from '../types/course.type';

type CleanupParams = {
  authService: AuthService;
  userService: UserService;
  usernames: string[];
};

type CancelCourseRegistrationCleanupParams = {
  courseService: CourseService;
  courseId?: string;
  username?: string;
  accessToken?: string;
  shouldCancel: boolean;
};

type CleanupCreatedCourseParams = {
  courseService: CourseService;
  courseId?: string;
  accessToken?: string;
  shouldDelete: boolean;
};

type CleanupCreatedCoursesParams = {
  courseService: CourseService;
  courseIds: string[];
  accessToken?: string;
};

export async function cleanupCreatedCourses({
  courseService,
  courseIds,
  accessToken
}: CleanupCreatedCoursesParams): Promise<string[]> {
  // Cleanup: Remove duplicate and empty course ids.
  const uniqueCourseIds = [...new Set(courseIds)].filter(Boolean);

  if (uniqueCourseIds.length === 0 || !accessToken) {
    return [];
  }

  const deletedCourseIds: string[] = [];

  for (const courseId of uniqueCourseIds.reverse()) {
    const isDeleted = await cleanupCreatedCourse({
      courseService,
      courseId,
      accessToken,
      shouldDelete: true
    });

    if (isDeleted) {
      deletedCourseIds.push(courseId);
    }
  }

  return deletedCourseIds;
}

export async function cleanupRegisteredAccounts({
  authService,
  userService,
  usernames
}: CleanupParams): Promise<void> {
  const uniqueUsernames = [...new Set(usernames)].filter(Boolean);

  if (uniqueUsernames.length === 0) {
    return;
  }

  const loginResponse = await authService.login(env.username, env.password);
  const loginText = await loginResponse.text();

  logger.info(`Cleanup login status: ${loginResponse.status()}`);

  if (loginResponse.status() !== 200) {
    logger.info('Cleanup skipped because login failed.');
    return;
  }

  const loginBody = loginResponseSchema.parse(JSON.parse(loginText));

  for (const username of uniqueUsernames.reverse()) {
    const deleteResponse = await userService.deleteUser(username, loginBody.accessToken);
    const deleteText = await deleteResponse.text();

    if (deleteResponse.status() === 200) {
      logger.info(`Cleanup deleted account: ${username}`);
    } else {
      logger.info(`Cleanup delete failed for ${username}. Status: ${deleteResponse.status()}`);
      logger.info(`Cleanup delete response: ${deleteText}`);
    }
  }
}

export async function cleanupCourseRegistration({
  courseService,
  courseId,
  username,
  accessToken,
  shouldCancel
}: CancelCourseRegistrationCleanupParams): Promise<boolean> {
  // Cleanup: Skip cancel course registration if course was not registered successfully.
  if (!shouldCancel || !courseId || !username || !accessToken) {
    return false;
  }

  const cancelRegisterData: RegisterCourseRequest = {
    maKhoaHoc: courseId,
    taiKhoan: username
  };

  const cancelResponse = await courseService.cancelCourseRegistration(
    cancelRegisterData,
    accessToken
  );
  const cancelText = await cancelResponse.text();

  if (cancelResponse.status() === 200) {
    logger.info(`Cleanup canceled course registration: ${courseId} - ${username}`);
    return true;
  }

  logger.warn(`Cleanup cancel course registration failed: ${courseId} - ${username}`);
  logger.warn(`Cleanup cancel registration response: ${cancelText}`);

  return false;
}

export async function cleanupCreatedCourse({
  courseService,
  courseId,
  accessToken,
  shouldDelete
}: CleanupCreatedCourseParams): Promise<boolean> {
  // Cleanup: Skip delete course if course was already deleted or missing required data.
  if (!shouldDelete || !courseId || !accessToken) {
    return false;
  }

  const deleteResponse = await courseService.deleteCourse(courseId, accessToken);
  const deleteText = await deleteResponse.text();

  if (deleteResponse.status() === 200) {
    logger.info(`Cleanup deleted course: ${courseId}`);
    return true;
  }

  logger.warn(`Cleanup delete course failed: ${courseId}`);
  logger.warn(`Cleanup course response: ${deleteText}`);

  return false;
}
