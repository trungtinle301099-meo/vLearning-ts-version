import { expect, test } from '../../../src/fixtures/ui.fixture';
import { env } from '../../../src/config/env.config';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { setupCreatedCoursePreconditionForTest } from '../../../src/helpers/common.helper';
import { cleanupCreatedCourse } from '../../../src/helpers/cleanup.helper';
import { logger } from '../../../src/helpers/logger.helper';
import type { SearchCourseCardAction } from '../../../src/pages/homePage/searchCourseHomePage/searchCourseHomePage.type';
import type { CreateCourseRequest } from '../../../src/types/course.type';
import { feature, epic, severity, description } from 'allure-js-commons';

test.describe('Home - Search Course UI', () => {
  // Biến dùng chung giữa beforeEach, test và afterEach để cô lập dữ liệu khóa học theo từng lần chạy
  let accessToken = '';
  let createdCourse: CreateCourseRequest;

  test.beforeEach(async ({ authService, courseService }, testInfo) => {
    // Khởi tạo khóa học độc lập qua API để tránh phụ thuộc dữ liệu sẵn có trên môi trường
    const precondition = await setupCreatedCoursePreconditionForTest({
      authService,
      courseService,
      testInfo
    });

    accessToken = precondition.accessToken;
    createdCourse = precondition.createdCourse;
  });

  test.afterEach(async ({ courseService }) => {
    // Dọn dẹp khóa học đã tạo trong beforeEach sau khi test kết thúc, kể cả khi assertion thất bại
    await cleanupCreatedCourse({
      courseService,
      courseId: createdCourse?.maKhoaHoc,
      accessToken,
      shouldDelete: true
    });
  });

  test('HOME_SEARCH_UI_001 - should search course by name and navigate to course detail page', async ({
    page,
    homeHeaderHomePage,
    searchCourseHomePage
  }) => {
    await feature('search course from home header and navigate to course detail');
    await epic('ui-homePage');
    await severity('critical');
    await description(
      'Kiểm tra luồng tìm kiếm khóa học theo tên từ thanh tìm kiếm trang chủ sang trang /timkiem và điều hướng tới trang /chitiet/ khi nhấn Xem chi tiết.'
    );

    // Chuẩn hóa baseUrl (bỏ dấu / cuối nếu có), mã hóa tên khóa học và xác định loại nút hành động từ POM type
    const normalizedBaseUrl = env.baseUrl.replace(/\/$/, '');
    const expectedSearchPath = `${HomePageUiEndpoint.searchCourse}/${encodeURIComponent(createdCourse.tenKhoaHoc)}`;
    const expectedDetailPath = `${HomePageUiEndpoint.courseDetail}/${createdCourse.maKhoaHoc}`;
    const detailAction: SearchCourseCardAction = 'Xem chi tiết';

    // Bước 1: Mở trang chủ ở đường dẫn gốc
    logger.step(
      `Bước 1: Truy cập trang chủ để tìm kiếm khóa học ${createdCourse.maKhoaHoc} (${createdCourse.tenKhoaHoc})`
    );
    await homeHeaderHomePage.gotoBaseUrl();

    // Chứng minh trang chủ đã điều hướng đúng về baseUrl gốc
    await expect(page).toHaveURL('/');
    // Chứng minh thanh tìm kiếm desktop trên header đã hiển thị sẵn sàng nhập liệu
    await expect(homeHeaderHomePage.button.searchInput).toBeVisible();

    // Bước 2: Điền tên khóa học đã tạo vào thanh tìm kiếm và nhấn Enter
    logger.step(
      `Bước 2: Nhập tên khóa học "${createdCourse.tenKhoaHoc}" vào thanh tìm kiếm và nhấn Enter`
    );
    await homeHeaderHomePage.searchCourseByName(createdCourse.tenKhoaHoc);

    // Bước 3: Xác minh URL đổi sang /timkiem/<tenKhoaHoc> và hiển thị đúng card khóa học
    // Chứng minh trình duyệt đã chuyển sang đúng URL tìm kiếm theo tên khóa học đã mã hóa
    await expect(page).toHaveURL(expectedSearchPath);
    // Chứng minh danh sách kết quả tìm kiếm .courseSearchResult đã hiển thị trên giao diện
    await expect(searchCourseHomePage.button.searchResultContainer).toBeVisible();
    // Chứng minh tiêu đề h6 của đúng khóa học vừa tạo xuất hiện trong kết quả tìm kiếm
    await expect(
      searchCourseHomePage.button.courseTitleByName(createdCourse.tenKhoaHoc)
    ).toBeVisible();
    // Chứng minh liên kết Xem chi tiết của đúng card khóa học hiển thị và trỏ đúng /chitiet/<maKhoaHoc>
    await expect(
      searchCourseHomePage.button.courseActionLink(createdCourse.tenKhoaHoc, detailAction)
    ).toBeVisible();
    await expect(
      searchCourseHomePage.button.courseActionLink(createdCourse.tenKhoaHoc, detailAction)
    ).toHaveAttribute('href', expectedDetailPath);
    logger.pass(
      `Đã điều hướng tới trang tìm kiếm và hiển thị đúng khóa học: ${createdCourse.tenKhoaHoc}`
    );

    // Bước 4: Nhấn Xem chi tiết trên đúng card khóa học vừa tìm thấy
    logger.step(`Bước 4: Click ${detailAction} của khóa học ${createdCourse.maKhoaHoc}`);
    await searchCourseHomePage.clickCourseActionLink(createdCourse.tenKhoaHoc, detailAction);

    // Bước 5: Xác minh URL trang chi tiết chứa <baseUrl>/chitiet/ và khớp /chitiet/<maKhoaHoc>
    // Chứng minh sau khi click Xem chi tiết, trình duyệt đã điều hướng sang đúng trang chi tiết của khóa học
    await expect(page).toHaveURL(expectedDetailPath);
    // Chứng minh đường link hiện tại chứa <baseUrl>/chitiet/ đúng theo yêu cầu nghiệp vụ
    expect(page.url()).toContain(`${normalizedBaseUrl}${HomePageUiEndpoint.courseDetail}/`);
    logger.pass(`Đã điều hướng thành công tới trang chi tiết khóa học: ${page.url()}`);
  });
});
