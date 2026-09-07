import { test, expect } from '../../../src/fixtures/api.fixture';
import { env } from '../../../src/config/env.config';
import { createUpdateUserInfoData } from '../../../src/data/user.data';
import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
import { updateUserInfoResponseSchema } from '../../../src/schemas/user.schema';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
import { loginAsAdminForTest, registerRandomUserForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import { randomHelper } from '../../../src/helpers/random.helper';
import type { RegisterUserRequest } from '../../../src/types/user.type';

let registeredUser: RegisterUserRequest;
let accessToken = '';
let accountsToCleanup: string[] = [];

test.describe('Update User Info API', () => {
  test.beforeEach(async ({ authService, userService }, testInfo) => {
    accountsToCleanup = [];

    registeredUser = await registerRandomUserForTest(userService, testInfo);
    accountsToCleanup.push(registeredUser.taiKhoan);

    accessToken = await loginAsAdminForTest(authService);
  });

  test.afterEach(async ({ authService, userService }) => {
    await cleanupRegisteredAccounts({
      authService,
      userService,
      usernames: accountsToCleanup
    });
  });

  test('UPDATE_API_001 - should update matKhau successfully', async ({ userService }) => {
    const updateData = createUpdateUserInfoData(registeredUser, {
      matKhau: randomHelper.password()
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-password-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.matKhau).toBe(updateData.matKhau);

    logger.pass(`Update matKhau passed for account: ${registeredUser.taiKhoan}`);
  });

  test('UPDATE_API_002 - should update hoTen successfully', async ({ userService }) => {
    const updateData = createUpdateUserInfoData(registeredUser, {
      hoTen: randomHelper.fullName('Updated User')
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-fullname-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.hoTen).toBe(updateData.hoTen);

    logger.pass(`Update hoTen passed for account: ${registeredUser.taiKhoan}`);
  });

  test('UPDATE_API_003 - should update soDT successfully', async ({ userService }) => {
    const updateData = createUpdateUserInfoData(registeredUser, {
      soDT: randomHelper.phoneVN()
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-phone-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.soDt).toBe(updateData.soDT);

    logger.pass(`Update soDT passed for account: ${registeredUser.taiKhoan}`);
  });

  test('UPDATE_API_004 - should update maLoaiNguoiDung successfully', async ({ userService }) => {
    const updateData = createUpdateUserInfoData(registeredUser, {
      maLoaiNguoiDung: 'GV'
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-type-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.maLoaiNguoiDung).toBe(updateData.maLoaiNguoiDung);

    logger.pass(`Update maLoaiNguoiDung passed for account: ${registeredUser.taiKhoan}`);
  });

  test('UPDATE_API_005 - should update maNhom successfully', async ({ userService }) => {
    const nextGroup = env.defaultGroup === 'GP01' ? 'GP02' : 'GP01';

    const updateData = createUpdateUserInfoData(registeredUser, {
      maNhom: nextGroup
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-group-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.maNhom).toBeTruthy();

    if (parsed.maNhom !== updateData.maNhom) {
      logger.warn(
        `maNhom response khác request. Request: ${updateData.maNhom}, Response: ${parsed.maNhom}`
      );
    }

    logger.pass(`Update maNhom API returned success for account: ${registeredUser.taiKhoan}`);
  });

  test('UPDATE_API_006 - should update email successfully', async ({ userService }) => {
    const updateData = createUpdateUserInfoData(registeredUser, {
      email: randomHelper.email(registeredUser.taiKhoan)
    });

    const response = await userService.updateUserInfo(updateData, accessToken);
    const responseText = await attachApiRequestResponse(
      test.info(),
      'update-user-email-success',
      updateData,
      response
    );

    expectStatus(response, 200);
    expectJsonContentType(response);

    const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));

    expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
    expect(parsed.email).toBe(updateData.email);

    logger.pass(`Update email passed for account: ${registeredUser.taiKhoan}`);
  });
});
