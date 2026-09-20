import { expect, test } from '../../../src/fixtures/ui.fixture';
import { logger } from '../../../src/helpers/logger.helper';
import { feature, story, severity, description } from 'allure-js-commons';
import {
  SEARCH_KEYWORD,
  SEARCH_RESULT_URL,
  createKeywordWithSpaces
} from '../../../src/data/search.data';
 
test.describe('Search Function', () => {
  // Chạy trước MỖI test: mở trang chủ, nơi có thanh tìm kiếm (searchForm) trên header.
  // Nhờ vậy từng test không phải lặp lại bước mở trang (Pre-condition: user đang ở homepage).
  test.beforeEach(async ({ searchPage }) => {
    // Arrange: Navigate to home page.
    await searchPage.gotoHomePage();
  });
 
  // Chạy sau MỖI test (kể cả khi test fail): dọn những gì test để lại.
  test.afterEach(async ({ page }) => {
    // để không ảnh hưởng đến test khác.
    await page.unrouteAll({ behavior: 'ignoreErrors' });
 
    // TODO (dữ liệu test): nếu tạo khóa học trong beforeEach thì xóa nó ở đây
    // bằng hàm trong helper/cleanup. Ví dụ (tên hàm chỉ là minh họa):
    //   if (createdCourseId) { await deleteCourse(createdCourseId); }
  });
 
  // Cover: SEARCH_UI_001
  // Mục tiêu: search keyword hợp lệ thì mở trang kết quả và UI không lỗi.
  test('SEARCH_UI_001 - should open search result page when searching with valid keyword', async ({
    searchPage
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await story('User should be able to search courses with a valid keyword.');
    await severity('critical');
    await description(
      'SEARCH_UI_001: This test verifies that searching with a valid keyword opens the search result page without UI crash.'
    );
 
    // Act: Search with a valid keyword.
    await searchPage.searchByKeyword(SEARCH_KEYWORD.valid);
 
    // Assert: Search result page should be opened.
    await searchPage.expectSearchResultPageLoaded(SEARCH_RESULT_URL);
 
    // Assert: Result count text "Hiển thị n kết quả" should be displayed.
    await searchPage.expectSearchResultDisplayed();
 
    // Assert: UI should not crash after searching.
    await searchPage.expectUiNotCrashed();
 
    logger.pass(`Search result page opened for keyword: ${SEARCH_KEYWORD.valid}`);
  });
 
  // Cover:SEARCH_UI_002
  // Mục tiêu: nhấn Enter kích hoạt search và kết quả khớp keyword.
  test('SEARCH_UI_002 - should return matching courses when searching by Enter key', async ({
    searchPage
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await story('User should be able to search courses by pressing Enter.');
    await severity('critical');
    await description(
      'SEARCH_UI_002: This test verifies that pressing Enter triggers the search and returns courses matching the keyword.'
    );
 
    // Act: Search with keyword and press Enter.
    await searchPage.searchByKeyword(SEARCH_KEYWORD.javascript);
 
    // Assert: All displayed courses should contain the keyword.
    await searchPage.expectSearchResultsContainKeyword(SEARCH_KEYWORD.javascript);
 
    logger.pass(`Search by Enter works with keyword: ${SEARCH_KEYWORD.javascript}`);
  });
 
  // Cover: SEARCH_UI_003
  // Mục tiêu: khoảng trắng đầu/cuối keyword được trim trước khi search.
  test('SEARCH_UI_003 - should trim leading and trailing spaces in keyword', async ({
    searchPage
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await story('Search keyword should be trimmed before searching.');
    await severity('minor');
    await description(
      'SEARCH_UI_003: This test verifies that leading and trailing spaces in the keyword are trimmed and do not affect the result.'
    );
 
    // Arrange: Prepare keyword with spaces at the beginning and the end.
    const keywordWithSpaces = createKeywordWithSpaces(SEARCH_KEYWORD.javascript);
 
    // Act: Search with keyword that has extra spaces.
    await searchPage.searchByKeyword(keywordWithSpaces);
 
    // Assert: Result should match the trimmed keyword.
    await searchPage.expectSearchResultsContainKeyword(SEARCH_KEYWORD.javascript);
 
    logger.pass('Keyword was trimmed correctly before searching.');
  });

  // Cover: SEARCH_UI_004
  // Mục tiêu: "JAVASCRIPT" và "javascript" phải ra cùng một kết quả.
  test('SEARCH_UI_004 - should return the same result for upper and lower case keyword', async ({
    searchPage
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await story('Search should not be affected by upper or lower case.');
    await severity('minor');
    await description(
      'SEARCH_UI_004: This test verifies that searching with upper case and lower case keyword returns the same courses.'
    );
 
    // Act: Navigate to home page.
    await searchPage.gotoHomePage();
 
    // Act: Search with upper case keyword and record the result.
    await searchPage.searchByKeyword(SEARCH_KEYWORD.javascript.toUpperCase());
    const upperCaseTitles = await searchPage.getSearchResultTitles();
 
    // Act: Go back to home page, search with lower case keyword and record the result.
    await searchPage.gotoHomePage();
    await searchPage.searchByKeyword(SEARCH_KEYWORD.javascript.toLowerCase());
    const lowerCaseTitles = await searchPage.getSearchResultTitles();
 
    // Assert: Result should not be empty.
    expect(upperCaseTitles.length).toBeGreaterThan(0);
 
    // Assert: Both searches should return the same courses.
    expect(upperCaseTitles).toEqual(lowerCaseTitles);
 
    logger.pass(
      `Search is case-insensitive: ${upperCaseTitles.length} courses found for both keywords.`
    );
  });
 
  // Cover: SEARCH_UI_005
  // Mục tiêu: ký tự đặc biệt và thẻ script không crash UI và không chạy được script.
  // Nếu script chạy, trình duyệt bật hộp thoại (dialog) nên ta lắng nghe sự kiện này.
  test('SEARCH_UI_005 - should not crash or run script when keyword has special characters', async ({
    page,
    searchPage
  }) => {
    // Allure metadata for the test
    await feature('Search function');
    await story('Search should handle special characters safely.');
    await severity('critical');
    await description(
      'SEARCH_UI_005: This test verifies that special characters and script tag do not crash the UI or execute any script.'
    );
 
    // Arrange: Listen to any dialog that a script could trigger.
    let hasDialog = false;
    page.on('dialog', async (dialog) => {
      hasDialog = true;
      await dialog.dismiss();
    });
 
    // Act: Navigate to home page.
    await searchPage.gotoHomePage();
 
    // Act: Search with special characters and script tag.
    await searchPage.searchByKeyword(SEARCH_KEYWORD.specialCharacters);
 
    // Assert: UI should not crash.
    await searchPage.expectUiNotCrashed();
 
    // Assert: No script should be executed.
    expect(hasDialog).toBe(false);
 
    logger.pass('Special characters were handled safely, no script executed.');
  });
})