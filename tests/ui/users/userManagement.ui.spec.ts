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

import { feature, epic, severity, description } from 'allure-js-commons';

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
    await feature('open user management page');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the user management page can be opened successfully with an authenticated session.'
    );
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
    await feature('navigate to Admin page after clicking setting button');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can navigate to the Admin page after clicking on the setting button from the user management page.'
    );
    await page.goto(HomePageUiEndpoint.userManagement);
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
    await feature('navigate to course Information page after clicking course management button');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can navigate to the course information page after clicking on the course management button from the Admin page.'
    );
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
    await feature('click them khoa hoc button hiển thị popup');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI displays a popup after clicking on the "Thêm khóa học" button from the course management page.'
    );
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
    await feature('search for a course successfully');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can search for a course successfully by entering the course name in the search input field on the course management page.'
    );
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
    await feature('display course registration popup after clicking Ghi danh button');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI displays a course registration popup after clicking on the "Ghi danh" button for a specific course on the course management page.'
    );
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
    await feature('display course registration popup with correct username');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI displays the correct username in the course registration popup after clicking on the "Ghi danh" button for a specific course on the course management page.'
    );
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
    await feature('display successful registration toast after clicking Xác thực');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI displays a successful registration toast after clicking on the "Xác thực" button for a specific user in the course registration popup.'
    );
    // 1. Search course
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
    await feature('cancel course registration successfully');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can cancel a course registration successfully after clicking on the "Xóa" button for a specific user in the course registration popup.'
    );
    // 1. Search course
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
    await feature('cancel course registration successfully after clicking Xác thực and then Xóa');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can cancel a course registration successfully after clicking on the "Xác thực" button and then the "Xóa" button for a specific user in the course registration popup.'
    );
    // 1. Search course
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
    await feature('search user account successfully');
    await epic('ui-user-management');
    await severity('critical');
    await description(
      'This test verifies that the UI can search for a user account successfully by entering the username in the search input field on the user management page.'
    );

    await page.goto(HomePageUiEndpoint.userManagement);
    await adminPage.fillSearchTaiKhoanInput(registeredUser.taiKhoan);

    await expect(adminPage.button.getUserRow(registeredUser.taiKhoan)).toBeVisible();

    logger.pass(`User account searched successfully: ${registeredUser.taiKhoan}`);
  });
});
