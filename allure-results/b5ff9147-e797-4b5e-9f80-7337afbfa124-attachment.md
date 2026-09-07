# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/courses/getListCourseInfo.api.spec.ts >> Get Course Info API >> GET_COURSE_INFO_API_001 - should get course info successfully
- Location: tests/api/courses/getListCourseInfo.api.spec.ts:71:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "26/12/2026"
Received: "05/07/2026"
```

# Test source

```ts
  3   | import { expectJsonContentType, expectStatus } from '../../../src/api/assertions/response.assertion';
  4   | import {
  5   |   courseInfoResponseSchema,
  6   |   createCourseResponseSchema
  7   | } from '../../../src/schemas/course.schema';
  8   | import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
  9   | import { loginAsAdminForTest } from '../../../src/helpers/common.helper';
  10  | import { logger } from '../../../src/helpers/logger.helper';
  11  | import type { CreateCourseRequest } from '../../../src/types/course.type';
  12  | 
  13  | let accessToken = '';
  14  | let createdCourse: CreateCourseRequest;
  15  | let isDeleted = false;
  16  | 
  17  | test.describe('Get Course Info API', () => {
  18  |   test.beforeEach(async ({ authService, courseService }, testInfo) => {
  19  |     // Precondition: Login as admin to get accessToken for create/delete course API.
  20  |     accessToken = await loginAsAdminForTest(authService);
  21  | 
  22  |     // Setup: Reset delete flag before each test.
  23  |     isDeleted = false;
  24  | 
  25  |     // Arrange: Generate random course data to avoid duplicate maKhoaHoc.
  26  |     createdCourse = createRandomCourseData();
  27  | 
  28  |     // Precondition: Create a course successfully before testing get course info API.
  29  |     const createResponse = await courseService.createCourse(createdCourse, accessToken);
  30  | 
  31  |     // Report: Attach precondition create course request and response.
  32  |     const createResponseText = await attachApiRequestResponse(
  33  |       testInfo,
  34  |       'precondition-create-course',
  35  |       createdCourse,
  36  |       createResponse
  37  |     );
  38  | 
  39  |     // Assert: Precondition create course API should be successful.
  40  |     expectStatus(createResponse, 200);
  41  |     expectJsonContentType(createResponse);
  42  | 
  43  |     // Schema: Validate create course response contract.
  44  |     const parsedCreateResponse = createCourseResponseSchema.parse(JSON.parse(createResponseText));
  45  | 
  46  |     // Assert: Created course should match generated test data.
  47  |     expect(parsedCreateResponse.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
  48  |     expect(parsedCreateResponse.tenKhoaHoc).toBe(createdCourse.tenKhoaHoc);
  49  | 
  50  |     logger.info(`Precondition created course: ${createdCourse.maKhoaHoc}`);
  51  |   });
  52  | 
  53  |   test.afterEach(async ({ courseService }) => {
  54  |     // Cleanup: Delete course created in beforeEach.
  55  |     if (isDeleted || !createdCourse?.maKhoaHoc || !accessToken) {
  56  |       return;
  57  |     }
  58  | 
  59  |     const cleanupResponse = await courseService.deleteCourse(createdCourse.maKhoaHoc, accessToken);
  60  |     const cleanupText = await cleanupResponse.text();
  61  | 
  62  |     if (cleanupResponse.status() === 200) {
  63  |       isDeleted = true;
  64  |       logger.info(`Cleanup deleted course: ${createdCourse.maKhoaHoc}`);
  65  |     } else {
  66  |       logger.warn(`Cleanup delete course failed: ${createdCourse.maKhoaHoc}`);
  67  |       logger.warn(`Cleanup response: ${cleanupText}`);
  68  |     }
  69  |   });
  70  | 
  71  |   test('GET_COURSE_INFO_API_001 - should get course info successfully', async ({
  72  |     courseService
  73  |   }) => {
  74  |     // Act: Get course info by maKhoaHoc created in beforeEach.
  75  |     const response = await courseService.getCourseInfo(createdCourse.maKhoaHoc);
  76  | 
  77  |     // Report: Attach get course info request and response to Playwright report.
  78  |     const responseText = await attachApiRequestResponse(
  79  |       test.info(),
  80  |       'get-course-info-success',
  81  |       {
  82  |         method: 'GET',
  83  |         query: {
  84  |           maKhoaHoc: createdCourse.maKhoaHoc
  85  |         }
  86  |       },
  87  |       response
  88  |     );
  89  | 
  90  |     // Assert: Get course info API should return status 200 and JSON content type.
  91  |     expectStatus(response, 200);
  92  |     expectJsonContentType(response);
  93  | 
  94  |     // Schema: Validate get course info response contract.
  95  |     const parsed = courseInfoResponseSchema.parse(JSON.parse(responseText));
  96  | 
  97  |     // Assert: Response should return the exact course created in beforeEach.
  98  |     expect(parsed.maKhoaHoc).toBe(createdCourse.maKhoaHoc);
  99  |     expect(parsed.tenKhoaHoc).toBe(createdCourse.tenKhoaHoc);
  100 |     expect(parsed.moTa).toBe(createdCourse.moTa);
  101 |     expect(parsed.luotXem).toBe(createdCourse.luotXem);
  102 |     expect(parsed.maNhom).toBe(createdCourse.maNhom);
> 103 |     expect(parsed.ngayTao).toBe(createdCourse.ngayTao);
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  104 | 
  105 |     // Assert: Response should contain creator information.
  106 |     expect(parsed.nguoiTao).toBeTruthy();
  107 | 
  108 |     if (parsed.nguoiTao?.taiKhoan) {
  109 |       expect(parsed.nguoiTao.taiKhoan).toBe(createdCourse.taiKhoanNguoiTao);
  110 |     }
  111 | 
  112 |     // Assert: Response should contain course category information when backend returns it.
  113 |     if (parsed.danhMucKhoaHoc) {
  114 |       const responseCategoryId =
  115 |         parsed.danhMucKhoaHoc.maDanhMucKhoaHoc ?? parsed.danhMucKhoaHoc.maDanhMucKhoahoc;
  116 | 
  117 |       expect(responseCategoryId).toBe(createdCourse.maDanhMucKhoaHoc);
  118 |     }
  119 | 
  120 |     logger.pass(`Get Course Info API passed for course: ${createdCourse.maKhoaHoc}`);
  121 |   });
  122 | });
  123 | 
```