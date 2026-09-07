# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users/updateInfoUser.spec.ts >> Update User Info API >> USER_API_008 - should update soDT successfully
- Location: tests/api/users/updateInfoUser.spec.ts:83:7

# Error details

```
ZodError: [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [
      "soDT"
    ],
    "message": "Invalid input: expected string, received undefined"
  }
]
```

# Test source

```ts
  1   | import { test, expect } from '../../../src/fixtures/api.fixture';
  2   | import { env } from '../../../src/config/env.config';
  3   | import { createUpdateUserInfoData } from '../../../src/data/user.data';
  4   | import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
  5   | import { updateUserInfoResponseSchema } from '../../../src/schemas/user.schema';
  6   | import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
  7   | import { cleanupRegisteredAccounts } from '../../../src/helpers/cleanup.helper';
  8   | import { loginAsAdminForTest, registerRandomUserForTest } from '../../../src/helpers/common.helper';
  9   | import { logger } from '../../../src/helpers/logger.helper';
  10  | import { randomHelper } from '../../../src/helpers/random.helper';
  11  | import type { RegisterUserRequest } from '../../../src/types/user.type';
  12  | 
  13  | let registeredUser: RegisterUserRequest;
  14  | let accessToken = '';
  15  | let accountsToCleanup: string[] = [];
  16  | 
  17  | test.describe('Update User Info API', () => {
  18  |   test.beforeEach(async ({ authService, userService }, testInfo) => {
  19  |     accountsToCleanup = [];
  20  | 
  21  |     registeredUser = await registerRandomUserForTest(userService, testInfo);
  22  |     accountsToCleanup.push(registeredUser.taiKhoan);
  23  | 
  24  |     accessToken = await loginAsAdminForTest(authService);
  25  |   });
  26  | 
  27  |   test.afterEach(async ({ authService, userService }) => {
  28  |     await cleanupRegisteredAccounts({
  29  |       authService,
  30  |       userService,
  31  |       usernames: accountsToCleanup
  32  |     });
  33  |   });
  34  | 
  35  |   test('USER_API_006 - should update matKhau successfully', async ({ userService }) => {
  36  |     const updateData = createUpdateUserInfoData(registeredUser, {
  37  |       matKhau: randomHelper.password()
  38  |     });
  39  | 
  40  |     const response = await userService.updateUserInfo(updateData, accessToken);
  41  |     const responseText = await attachApiRequestResponse(
  42  |       test.info(),
  43  |       'update-user-password-success',
  44  |       updateData,
  45  |       response
  46  |     );
  47  | 
  48  |     expectStatus(response, 200);
  49  |     expectJsonContentType(response);
  50  | 
  51  |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
  52  | 
  53  |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  54  |     expect(parsed.matKhau).toBe(updateData.matKhau);
  55  | 
  56  |     logger.pass(`Update matKhau passed for account: ${registeredUser.taiKhoan}`);
  57  |   });
  58  | 
  59  |   test('USER_API_007 - should update hoTen successfully', async ({ userService }) => {
  60  |     const updateData = createUpdateUserInfoData(registeredUser, {
  61  |       hoTen: randomHelper.fullName('Updated User')
  62  |     });
  63  | 
  64  |     const response = await userService.updateUserInfo(updateData, accessToken);
  65  |     const responseText = await attachApiRequestResponse(
  66  |       test.info(),
  67  |       'update-user-fullname-success',
  68  |       updateData,
  69  |       response
  70  |     );
  71  | 
  72  |     expectStatus(response, 200);
  73  |     expectJsonContentType(response);
  74  | 
  75  |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
  76  | 
  77  |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  78  |     expect(parsed.hoTen).toBe(updateData.hoTen);
  79  | 
  80  |     logger.pass(`Update hoTen passed for account: ${registeredUser.taiKhoan}`);
  81  |   });
  82  | 
  83  |   test('USER_API_008 - should update soDT successfully', async ({ userService }) => {
  84  |     const updateData = createUpdateUserInfoData(registeredUser, {
  85  |       soDT: randomHelper.phoneVN()
  86  |     });
  87  | 
  88  |     const response = await userService.updateUserInfo(updateData, accessToken);
  89  |     const responseText = await attachApiRequestResponse(
  90  |       test.info(),
  91  |       'update-user-phone-success',
  92  |       updateData,
  93  |       response
  94  |     );
  95  | 
  96  |     expectStatus(response, 200);
  97  |     expectJsonContentType(response);
  98  | 
> 99  |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
      |                                                 ^ ZodError: [
  100 | 
  101 |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  102 |     expect(parsed.soDT).toBe(updateData.soDT);
  103 | 
  104 |     logger.pass(`Update soDT passed for account: ${registeredUser.taiKhoan}`);
  105 |   });
  106 | 
  107 |   test('USER_API_009 - should update maLoaiNguoiDung successfully', async ({ userService }) => {
  108 |     const updateData = createUpdateUserInfoData(registeredUser, {
  109 |       maLoaiNguoiDung: 'GV'
  110 |     });
  111 | 
  112 |     const response = await userService.updateUserInfo(updateData, accessToken);
  113 |     const responseText = await attachApiRequestResponse(
  114 |       test.info(),
  115 |       'update-user-type-success',
  116 |       updateData,
  117 |       response
  118 |     );
  119 | 
  120 |     expectStatus(response, 200);
  121 |     expectJsonContentType(response);
  122 | 
  123 |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
  124 | 
  125 |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  126 |     expect(parsed.maLoaiNguoiDung).toBe(updateData.maLoaiNguoiDung);
  127 | 
  128 |     logger.pass(`Update maLoaiNguoiDung passed for account: ${registeredUser.taiKhoan}`);
  129 |   });
  130 | 
  131 |   test('USER_API_010 - should update maNhom successfully', async ({ userService }) => {
  132 |     const nextGroup = env.defaultGroup === 'GP01' ? 'GP02' : 'GP01';
  133 | 
  134 |     const updateData = createUpdateUserInfoData(registeredUser, {
  135 |       maNhom: nextGroup
  136 |     });
  137 | 
  138 |     const response = await userService.updateUserInfo(updateData, accessToken);
  139 |     const responseText = await attachApiRequestResponse(
  140 |       test.info(),
  141 |       'update-user-group-success',
  142 |       updateData,
  143 |       response
  144 |     );
  145 | 
  146 |     expectStatus(response, 200);
  147 |     expectJsonContentType(response);
  148 | 
  149 |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
  150 | 
  151 |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  152 |     expect(parsed.maNhom).toBeTruthy();
  153 | 
  154 |     if (parsed.maNhom !== updateData.maNhom) {
  155 |       logger.warn(
  156 |         `maNhom response khác request. Request: ${updateData.maNhom}, Response: ${parsed.maNhom}`
  157 |       );
  158 |     }
  159 | 
  160 |     logger.pass(`Update maNhom API returned success for account: ${registeredUser.taiKhoan}`);
  161 |   });
  162 | 
  163 |   test('USER_API_011 - should update email successfully', async ({ userService }) => {
  164 |     const updateData = createUpdateUserInfoData(registeredUser, {
  165 |       email: randomHelper.email(registeredUser.taiKhoan)
  166 |     });
  167 | 
  168 |     const response = await userService.updateUserInfo(updateData, accessToken);
  169 |     const responseText = await attachApiRequestResponse(
  170 |       test.info(),
  171 |       'update-user-email-success',
  172 |       updateData,
  173 |       response
  174 |     );
  175 | 
  176 |     expectStatus(response, 200);
  177 |     expectJsonContentType(response);
  178 | 
  179 |     const parsed = updateUserInfoResponseSchema.parse(JSON.parse(responseText));
  180 | 
  181 |     expect(parsed.taiKhoan).toBe(registeredUser.taiKhoan);
  182 |     expect(parsed.email).toBe(updateData.email);
  183 | 
  184 |     logger.pass(`Update email passed for account: ${registeredUser.taiKhoan}`);
  185 |   });
  186 | });
  187 | 
```