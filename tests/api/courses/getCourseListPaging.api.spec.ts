import { test, expect } from '../../../src/fixtures/api.fixture';
import { env, isConfigured } from '../../../src/config/env.config';
import {
  expectJsonContentType,
  expectStatus
} from '../../../src/api/assertions/response.assertion';
import { CourseEndpoint } from '../../../src/endpoints/api-endpoints/course.api.endpoint';
import { courseListPagingResponseSchema } from '../../../src/schemas/course.schema';
import type { CreateCourseRequest } from '../../../src/types/course.type';
import { attachApiRequestResponse } from '../../../src/helpers/api-report.helper';
import { cleanupCreatedCourses } from '../../../src/helpers/cleanup.helper';
import { setupIsolatedCoursesPreconditionForTest } from '../../../src/helpers/common.helper';
import { logger } from '../../../src/helpers/logger.helper';
import { randomHelper } from '../../../src/helpers/random.helper';
import { feature, epic, severity, description } from 'allure-js-commons';

test.describe('Get Course List Paging API', () => {
  test.describe('Isolated Course Filter And Pagination', () => {
    let accessToken = '';
    let createdCourseIds: string[] = [];
    let createdCourses: CreateCourseRequest[] = [];
    let sharedCoursePrefix = '';

    test.beforeEach(async ({ authService, courseService }, testInfo) => {
      // Setup: Đặt lại state và sinh tiền tố tenKhoaHoc duy nhất trước mỗi test để cô lập khi chạy song song
      accessToken = '';
      createdCourseIds = [];
      createdCourses = [];
      sharedCoursePrefix = `AutoPaginate_${randomHelper.courseId('PG')}`;

      // Precondition: Tạo 2 khóa học cô lập cùng tiền tố, cập nhật ngay accessToken và từng maKhoaHoc vào createdCourseIds
      const precondition = await setupIsolatedCoursesPreconditionForTest({
        authService,
        courseService,
        testInfo,
        courseNames: [`${sharedCoursePrefix}_01`, `${sharedCoursePrefix}_02`],
        createdCourseIds,
        onAccessTokenReady: (token) => {
          accessToken = token;
        }
      });

      accessToken = precondition.accessToken;
      createdCourses = precondition.createdCourses;
    });

    test.afterEach(async ({ courseService }) => {
      // Cleanup: Xóa toàn bộ khóa học đã tạo thành công, kể cả khi test hoặc bước tạo khóa học thứ 2 bị lỗi
      await cleanupCreatedCourses({
        courseService,
        courseIds: createdCourseIds,
        accessToken
      });
    });

    test('PAGINATE_COURSE_API_001 - should get paginated course list with full valid query params', async ({
      courseService
    }, testInfo) => {
      await feature('get course list paging');
      await epic('api-course');
      await severity('critical');
      await description(
        'Xác minh API LayDanhSachKhoaHoc_PhanTrang trả về HTTP 200, đúng schema phân trang và khớp khóa học cô lập khi truyền đầy đủ tenKhoaHoc, page=1, pageSize=10, MaNhom=GP01.'
      );

      // Arrange: Lấy tên khóa học cô lập thứ nhất để lọc chính xác 1 bản ghi trong nhóm GP01
      const targetCourse = createdCourses[0];
      const query = {
        tenKhoaHoc: targetCourse.tenKhoaHoc,
        page: 1,
        pageSize: 10,
        MaNhom: env.defaultGroup
      };

      // Act: Gọi API phân trang với đầy đủ query param hợp lệ
      const response = await courseService.getCourseListPaging(query);

      // Report: Đính kèm request/response trước assertion đầu tiên để giữ bằng chứng khi status hoặc schema lỗi
      const responseText = await attachApiRequestResponse(
        testInfo,
        'get-course-list-paging-full-params',
        {
          method: 'GET',
          endpoint: CourseEndpoint.getCourseListPaging,
          query
        },
        response
      );

      // Assert: Chứng minh API trả về HTTP 200 và Content-Type application/json
      expectStatus(response, 200);
      expectJsonContentType(response);

      // Schema: Chứng minh body response khớp hợp đồng phân trang và courseSchema
      const parsed = courseListPagingResponseSchema.parse(JSON.parse(responseText));

      // Assert: Chứng minh các chỉ số phân trang nhất quán cho trang 1 với pageSize=10
      expect(parsed.currentPage).toBe(1);
      expect(parsed.count).toBe(parsed.items.length);
      expect(parsed.count).toBeGreaterThanOrEqual(1);
      expect(parsed.totalCount).toBeGreaterThanOrEqual(parsed.count);
      expect(parsed.totalPages).toBe(Math.ceil(parsed.totalCount / 10));

      // Assert: Chứng minh khóa học cô lập vừa tạo xuất hiện trong danh sách, khớp đúng tenKhoaHoc và nhóm GP01 (không phân biệt hoa/thường)
      const matchedCourse = parsed.items.find((item) => item.maKhoaHoc === targetCourse.maKhoaHoc);
      expect(matchedCourse).toBeDefined();
      expect(matchedCourse?.tenKhoaHoc).toBe(targetCourse.tenKhoaHoc);
      expect(matchedCourse?.maNhom.toUpperCase()).toBe(env.defaultGroup.toUpperCase());

      // Assert: Chứng minh toàn bộ item trả về đều thuộc nhóm GP01 (không phân biệt hoa/thường) và chứa từ khóa tenKhoaHoc
      const mismatchedItems = parsed.items.filter(
        (item) =>
          item.maNhom.toUpperCase() !== env.defaultGroup.toUpperCase() ||
          !item.tenKhoaHoc.toLowerCase().includes(targetCourse.tenKhoaHoc.toLowerCase())
      );
      expect(mismatchedItems).toEqual([]);

      logger.pass(
        `PAGINATE_COURSE_API_001 passed for isolated course: ${targetCourse.maKhoaHoc}`
      );
    });

    test('PAGINATE_COURSE_API_003 - should return first page with page=1 and pageSize=1 boundary', async ({
      courseService
    }, testInfo) => {
      await feature('get course list paging');
      await epic('api-course');
      await severity('critical');
      await description(
        'Xác minh biên dưới page=1, pageSize=1 trên tập 2 khóa học cô lập cùng tiền tố tenKhoaHoc trả về đúng 1 item và totalPages === totalCount.'
      );

      // Arrange: Chuẩn bị query biên dưới page=1, pageSize=1 lọc theo tiền tố 2 khóa học cô lập
      const query = {
        tenKhoaHoc: sharedCoursePrefix,
        page: 1,
        pageSize: 1,
        MaNhom: env.defaultGroup
      };

      // Act: Gọi API phân trang với biên dưới page=1, pageSize=1
      const response = await courseService.getCourseListPaging(query);

      // Report: Đính kèm request/response trước assertion đầu tiên để lưu bằng chứng khi status hoặc schema lỗi
      const responseText = await attachApiRequestResponse(
        testInfo,
        'get-course-list-paging-page1-size1',
        {
          method: 'GET',
          endpoint: CourseEndpoint.getCourseListPaging,
          query
        },
        response
      );

      // Assert: Chứng minh API trả về HTTP 200 và Content-Type application/json
      expectStatus(response, 200);
      expectJsonContentType(response);

      // Schema: Chứng minh body response khớp hợp đồng phân trang và courseSchema
      const parsed = courseListPagingResponseSchema.parse(JSON.parse(responseText));

      // Assert: Chứng minh ở biên page=1, pageSize=1 API trả về đúng 1 phần tử trên tổng 2 bản ghi và totalPages === totalCount
      expect(parsed.currentPage).toBe(1);
      expect(parsed.count).toBe(1);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.totalCount).toBe(2);
      expect(parsed.totalPages).toBe(parsed.totalCount);

      // Assert: Chứng minh phần tử trang 1 thuộc tập 2 khóa học cô lập, chứa tiền tố tìm kiếm và đúng nhóm GP01 (không phân biệt hoa/thường)
      expect(createdCourseIds).toContain(parsed.items[0].maKhoaHoc);
      expect(parsed.items[0].tenKhoaHoc).toContain(sharedCoursePrefix);
      expect(parsed.items[0].maNhom.toUpperCase()).toBe(env.defaultGroup.toUpperCase());

      logger.pass(
        `PAGINATE_COURSE_API_003 passed: page1 item=${parsed.items[0].maKhoaHoc}, totalPages=${parsed.totalPages}`
      );
    });

    test('PAGINATE_COURSE_API_004 - should return second distinct page with page=2 and pageSize=1', async ({
      courseService
    }, testInfo) => {
      await feature('get course list paging');
      await epic('api-course');
      await severity('critical');
      await description(
        'Xác minh cận dưới page=2, pageSize=1 trên tập 2 khóa học cô lập trả về currentPage=2, bản ghi khác trang 1 và nhất quán totalCount/totalPages.'
      );

      // Arrange: Chuẩn bị query trang 1 để lấy bản ghi trang 1 làm mốc đối chiếu độc lập với PAGINATE_COURSE_API_003
      const page1Query = {
        tenKhoaHoc: sharedCoursePrefix,
        page: 1,
        pageSize: 1,
        MaNhom: env.defaultGroup
      };

      // Act (mốc đối chiếu): Gọi API trang 1 trước khi kiểm tra trang 2
      const page1Response = await courseService.getCourseListPaging(page1Query);

      // Report: Đính kèm bằng chứng trang 1 trước assertion của bước đối chiếu
      const page1ResponseText = await attachApiRequestResponse(
        testInfo,
        'get-course-list-paging-page1-reference',
        {
          method: 'GET',
          endpoint: CourseEndpoint.getCourseListPaging,
          query: page1Query
        },
        page1Response
      );

      // Assert: Chứng minh request trang 1 làm mốc trả về HTTP 200 và Content-Type application/json
      expectStatus(page1Response, 200);
      expectJsonContentType(page1Response);

      // Schema: Chứng minh body trang 1 khớp hợp đồng phân trang và courseSchema
      const page1Parsed = courseListPagingResponseSchema.parse(JSON.parse(page1ResponseText));

      // Assert: Chứng minh trang 1 có đủ 1 item, totalCount=2 và totalPages=2 làm mốc đối chiếu tin cậy
      expect(page1Parsed.currentPage).toBe(1);
      expect(page1Parsed.count).toBe(1);
      expect(page1Parsed.items).toHaveLength(1);
      expect(page1Parsed.totalCount).toBe(2);
      expect(page1Parsed.totalPages).toBe(2);

      // Arrange: Chuẩn bị query trang 2 với page=2, pageSize=1 trên cùng tập 2 khóa học cô lập
      const page2Query = {
        tenKhoaHoc: sharedCoursePrefix,
        page: 2,
        pageSize: 1,
        MaNhom: env.defaultGroup
      };

      // Act: Gọi API phân trang cho trang kế tiếp page=2, pageSize=1
      const page2Response = await courseService.getCourseListPaging(page2Query);

      // Report: Đính kèm request/response trang 2 trước assertion đầu tiên
      const page2ResponseText = await attachApiRequestResponse(
        testInfo,
        'get-course-list-paging-page2-size1',
        {
          method: 'GET',
          endpoint: CourseEndpoint.getCourseListPaging,
          query: page2Query
        },
        page2Response
      );

      // Assert: Chứng minh API trang 2 trả về HTTP 200 và Content-Type application/json
      expectStatus(page2Response, 200);
      expectJsonContentType(page2Response);

      // Schema: Chứng minh body trang 2 khớp hợp đồng phân trang và courseSchema
      const page2Parsed = courseListPagingResponseSchema.parse(JSON.parse(page2ResponseText));

      // Assert: Chứng minh trang 2 trả về currentPage=2, count=1, totalCount=2, totalPages=2 và nhất quán với trang 1
      expect(page2Parsed.currentPage).toBe(2);
      expect(page2Parsed.count).toBe(1);
      expect(page2Parsed.items).toHaveLength(1);
      expect(page2Parsed.totalCount).toBe(2);
      expect(page2Parsed.totalPages).toBe(2);
      expect(page2Parsed.totalCount).toBe(page1Parsed.totalCount);
      expect(page2Parsed.totalPages).toBe(page1Parsed.totalPages);

      // Assert: Chứng minh bản ghi trang 2 khác bản ghi trang 1, thuộc tập 2 khóa học cô lập và đúng nhóm GP01 (không phân biệt hoa/thường)
      expect(page2Parsed.items[0].maKhoaHoc).not.toBe(page1Parsed.items[0].maKhoaHoc);
      expect(createdCourseIds).toContain(page2Parsed.items[0].maKhoaHoc);
      expect(page2Parsed.items[0].tenKhoaHoc).toContain(sharedCoursePrefix);
      expect(page2Parsed.items[0].maNhom.toUpperCase()).toBe(env.defaultGroup.toUpperCase());

      logger.pass(
        `PAGINATE_COURSE_API_004 passed: page1=${page1Parsed.items[0].maKhoaHoc}, page2=${page2Parsed.items[0].maKhoaHoc}`
      );
    });
  });

  test.describe('Default Query Params', () => {
    test('PAGINATE_COURSE_API_002 - should get paginated course list with default query params', async ({
      courseService
    }, testInfo) => {
      await feature('get course list paging');
      await epic('api-course');
      await severity('normal');
      await description(
        'Xác minh API LayDanhSachKhoaHoc_PhanTrang áp dụng đúng giá trị mặc định Swagger (page=1, pageSize=10, MaNhom=GP01) khi không truyền query param tùy chọn.'
      );

      // Precondition: Bỏ qua test nếu chưa cấu hình TOKEN_CYBERSOFT trong .env
      test.skip(
        !isConfigured(env.tokenCybersoft),
        'Cần cấu hình TOKEN_CYBERSOFT trong .env để gọi API khóa học thật.'
      );

      // Act: Gọi API phân trang không truyền bất kỳ query param tùy chọn nào
      const response = await courseService.getCourseListPaging();

      // Report: Đính kèm request/response trước assertion đầu tiên
      const responseText = await attachApiRequestResponse(
        testInfo,
        'get-course-list-paging-default',
        {
          method: 'GET',
          endpoint: CourseEndpoint.getCourseListPaging,
          query: {}
        },
        response
      );

      // Assert: Chứng minh API trả về HTTP 200 và JSON hợp lệ
      expectStatus(response, 200);
      expectJsonContentType(response);

      // Schema: Chứng minh response khớp hợp đồng phân trang và courseSchema
      const parsed = courseListPagingResponseSchema.parse(JSON.parse(responseText));

      // Assert: Chứng minh mặc định page=1 và pageSize=10, đồng thời count/totalCount/totalPages nhất quán
      expect(parsed.currentPage).toBe(1);
      expect(parsed.count).toBe(parsed.items.length);
      expect(parsed.items.length).toBeLessThanOrEqual(10);
      expect(parsed.totalCount).toBeGreaterThanOrEqual(parsed.items.length);

      const expectedTotalPages = parsed.totalCount === 0 ? 0 : Math.ceil(parsed.totalCount / 10);
      expect(parsed.totalPages).toBe(expectedTotalPages);

      // Assert: Chứng minh mặc định MaNhom=GP01 cho toàn bộ khóa học trả về (so sánh không phân biệt hoa/thường theo mẫu Swagger trả "maNhom": "gp01")
      const invalidGroupItems = parsed.items.filter(
        (item) => item.maNhom.toUpperCase() !== env.defaultGroup.toUpperCase()
      );
      expect(invalidGroupItems).toEqual([]);

      logger.pass(
        `PAGINATE_COURSE_API_002 passed: currentPage=${parsed.currentPage}, count=${parsed.count}, totalCount=${parsed.totalCount}`
      );
    });
  });
});
