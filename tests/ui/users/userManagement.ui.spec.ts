import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { logger } from '../../../src/helpers/logger.helper';

import {
  setupCourseRegistrationPreconditionForTest,
  registerCourseForTest
} from '../../../src/helpers/common.helper';

import {
  cleanupCourseRegistration,
  cleanupRegisteredAccounts,
  cleanupCreatedCourse
} from '../../../src/helpers/cleanup.helper';

import type { RegisterUserRequest } from '../../../src/types/user.type';

test.use({ storageState: env.authStatePath });

let createdCourseName = '';
let createdCourseId = '';

let registeredUser: RegisterUserRequest;
let accessToken = '';

let accountsToCleanup: string[] = [];
let isCourseRegistered = false;

test.describe('User Management UI', () => {
  // ============================================================
  // BEFORE EACH
  // ============================================================
  test.beforeEach(async ({ authService, userService, courseService }, testInfo) => {
    accountsToCleanup = [];
    isCourseRegistered = false;

    // 1. Register student + Create course
    const precondition = await setupCourseRegistrationPreconditionForTest({
      authService,
      userService,
      courseService,
      testInfo
    });

    accessToken = precondition.accessToken;

    registeredUser = precondition.registeredUser;

    createdCourseId = precondition.createdCourse.maKhoaHoc;

    createdCourseName = precondition.createdCourse.tenKhoaHoc;

    accountsToCleanup = precondition.accountsToCleanup;

    // 2. Register student to course
    await registerCourseForTest({
      courseService,
      courseId: createdCourseId,
      username: registeredUser.taiKhoan,
      accessToken
    });

    isCourseRegistered = true;
  });

  // ============================================================
  // AFTER EACH
  // ============================================================
  test.afterEach(async ({ authService, userService, courseService }) => {
    // 1. Cancel course registration
    const isCanceled = await cleanupCourseRegistration({
      courseService,
      courseId: createdCourseId,
      username: registeredUser?.taiKhoan,
      accessToken,
      shouldCancel: isCourseRegistered
    });

    if (isCanceled) {
      isCourseRegistered = false;
    }

    // 2. Delete student
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });

    // 3. Delete course
    await cleanupCreatedCourse({
      courseService,
      courseId: createdCourseId,
      accessToken,
      shouldDelete: true
    });
  });

  // ============================================================
  // TEST CASE 001
  // ============================================================
  test('USER_MANAGEMENT_UI_001 - should open user management page with authenticated session', async ({
    page
  }) => {
    await page.goto(HomePageUiEndpoint.userManagement);

    await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

    logger.pass('User management page opened successfully with authenticated session.');
  });

  // ============================================================
  // TEST CASE 002
  // ============================================================
  test('USER_MANAGEMENT_UI_002 - should navigate to Admin page after clicking setting button', async ({
    page,
    adminPage
  }) => {
    await adminPage.gotoHomePage();

    await adminPage.clickSettingButton();

    await expect(page).toHaveURL(HomePageUiEndpoint.userManagement);

    logger.pass('Admin page opened successfully after clicking setting button.');
  });

  // ============================================================
  // TEST CASE 003
  // ============================================================
  test('USER_MANAGEMENT_UI_003 - should navigate to course Information page after clicking course management button', async ({
    page,
    adminPage
  }) => {
    await page.goto(HomePageUiEndpoint.userManagement);

    await adminPage.clickQuanLyKhoaHocButton();

    await expect(page).toHaveURL(HomePageUiEndpoint.coursManagement);

    logger.pass(
      'Course information page opened successfully after clicking course management button.'
    );
  });

  // ============================================================
  // TEST CASE 004
  // ============================================================
  test('USER_MANAGEMENT_UI_004 - click them khoa hoc button hiển thị popup', async ({
    page,
    adminPage
  }) => {
    await page.goto(HomePageUiEndpoint.userManagement);

    await adminPage.clickQuanLyKhoaHocButton();

    await expect(page).toHaveURL(HomePageUiEndpoint.coursManagement);

    await adminPage.clickThemKhoaHocButton();

    await expect(adminPage.button.themKhoaHocPopup).toBeVisible();

    logger.pass('Popup opened successfully after clicking "Thêm khóa học" button.');
  });

  // ============================================================
  // TEST CASE 005
  // ============================================================
  test('USER_MANAGEMENT_UI_005 - should search for a course successfully', async ({
    page,
    adminPage
  }) => {
    await page.goto(HomePageUiEndpoint.userManagement);

    await adminPage.clickQuanLyKhoaHocButton();

    await expect(page).toHaveURL(HomePageUiEndpoint.coursManagement);

    await adminPage.fillsearchInput(createdCourseName);

    await expect(adminPage.button.getCourseInformationByName(createdCourseName)).toBeVisible();

    await expect(adminPage.button.getCourseInformationByName(createdCourseId)).toBeVisible();

    logger.pass('Course searched successfully with the created course name.');
  });

  test('USER_MANAGEMENT_UI_006 - should display course registration popup after clicking Ghi danh button', async ({
    adminPage
  }) => {
    // 1. Search course
    await adminPage.searchCourseSuccessfully(createdCourseName, createdCourseId);

    // 2. Click Ghi danh button
    await adminPage.clickGhiDanhButtonByCourseName(createdCourseName);

    // 3. Verify Ghi danh popup is displayed
    await expect(adminPage.button.ghiDanhPopup).toBeVisible();

    logger.pass('Ghi danh popup displayed successfully after clicking Ghi danh button.');
  });

  test('USER_MANAGEMENT_UI_007 - should display course registration popup with correct username', async ({
    adminPage
  }) => {
    // 1. Search course
    await adminPage.searchCourseSuccessfully(createdCourseName, createdCourseId);

    // 2. Click Ghi danh button
    await adminPage.clickGhiDanhButtonByCourseName(createdCourseName);

    // 3. Verify Ghi danh popup is displayed
    await expect(adminPage.button.ghiDanhPopup).toBeVisible();

    // 4. Verify correct username is displayed in Ghi danh popup
    await expect(
      adminPage.button.getUserNameDangKyKhoaHocRowInGhiDanhPopup(registeredUser.taiKhoan)
    ).toBeVisible();

    logger.pass(
      `Ghi danh popup displayed successfully with correct username: ${registeredUser.taiKhoan}`
    );
  });

  test('USER_MANAGEMENT_UI_008 - should display successful registration toast after clicking Xác thực', async ({
    adminPage
  }) => {
    await adminPage.verifyGhiDanhPopupByCourse(
      createdCourseName,
      createdCourseId,
      registeredUser.taiKhoan
    );

    // 1. Click Xác thực button
    await adminPage.clickXacThucButtonByTaiKhoan(registeredUser.taiKhoan);

    // 2. Verify successful registration toast is displayed
    await expect(adminPage.button.getToastifyByMessage('Ghi danh thành công!')).toBeVisible();

    logger.pass(
      `Course registration successfully verified for account: ${registeredUser.taiKhoan}`
    );
  });

  test('USER_MANAGEMENT_UI_009 - should cancel course registration successfully', async ({
    adminPage
  }) => {
    await adminPage.verifyGhiDanhPopupByCourse(
      createdCourseName,
      createdCourseId,
      registeredUser.taiKhoan
    );

    // 1. Click Xóa button
    await adminPage.clickXoaButtonByTaiKhoan(registeredUser.taiKhoan);

    // 2. Verify successful cancellation toast is displayed
    await expect(adminPage.button.getToastifyByMessage('Hủy ghi danh thành công!')).toBeVisible();

    logger.pass(
      `Course registration cancelled successfully for account: ${registeredUser.taiKhoan}`
    );
  });

  test('USER_MANAGEMENT_UI_010 - should cancel course registration successfully after clicking Xác thực and then Xóa', async ({
    adminPage
  }) => {
    await adminPage.verifyGhiDanhPopupByCourse(
      createdCourseName,
      createdCourseId,
      registeredUser.taiKhoan
    );

    // 1. Click Xác thực button
    await adminPage.clickXacThucButtonByTaiKhoan(registeredUser.taiKhoan);

    // 2. Verify successful registration toast is displayed
    await expect(adminPage.button.getToastifyByMessage('Ghi danh thành công!')).toBeVisible();

    // 3. Click Xóa button
    await adminPage.clickXoaButtonByTaiKhoan(registeredUser.taiKhoan);

    // 4. Verify successful cancellation toast is displayed
    await expect(adminPage.button.getToastifyByMessage('Hủy ghi danh thành công!')).toBeVisible();

    logger.pass(
      `Course registration cancelled successfully for account: ${registeredUser.taiKhoan}`
    );
  });

  test('USER_MANAGEMENT_UI_011 - should search user account successfully', async ({
    page,
    adminPage
  }) => {
    await page.goto(HomePageUiEndpoint.userManagement);
    await adminPage.fillSearchTaiKhoanInput(registeredUser.taiKhoan);

    await expect(adminPage.button.getUserRow(registeredUser.taiKhoan)).toBeVisible();

    logger.pass(`User account searched successfully: ${registeredUser.taiKhoan}`);
  });
});
