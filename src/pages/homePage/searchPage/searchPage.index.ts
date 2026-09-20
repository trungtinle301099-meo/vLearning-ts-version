import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../basePage/basePage.index';
import { HomePageUiEndpoint } from '../../../endpoints/ui-endpoints/homePage.ui.endpoint';
import { SearchPageButton } from './searchPage.button';

export class SearchPage extends BasePage {
  readonly button: SearchPageButton;

  constructor(page: Page) {
    super(page);

    this.button = new SearchPageButton(page);
  }

  // Mở trang chủ, nơi có thanh tìm kiếm (searchForm) trên header.
  async gotoHomePage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.homePage);
  }

  // Gõ từ khóa vào ô search nhưng CHƯA submit (dùng để test riêng ô input).
  async typeSearchKeyword(keyword: string): Promise<void> {
    await this.fill(this.button.searchInput, keyword);
  }

  // Gõ từ khóa rồi nhấn Enter để search.
  // Cố ý dùng Enter, không click icon Search, vì search bằng icon đang có bug đã mở (TC-SRCH-003 / CV-92).
  async searchByKeyword(keyword: string): Promise<void> {
    await this.typeSearchKeyword(keyword);
    await this.button.searchInput.press('Enter');
  }

  // Kiểm tra ô search đang chứa ĐÚNG giá trị đã gõ.
  async expectSearchInputValue(expectedValue: string): Promise<void> {
    await expect(this.button.searchInput).toHaveValue(expectedValue);
  }

  // Kiểm tra đã chuyển sang trang kết quả tìm kiếm (expectedUrl là string hoặc RegExp).
  async expectSearchResultPageLoaded(expectedUrl: string | RegExp): Promise<void> {
    await this.waitForUrl(expectedUrl);
    await expect(this.page).toHaveURL(expectedUrl);
  }

  // Kiểm tra trang kết quả đã hiển thị: có dòng h6 "Hiển thị n kết quả".
  // Chỉ kiểm tra dòng này, không kiểm tra danh sách, vì keyword không có kết quả thì danh sách rỗng.
  async expectSearchResultDisplayed(): Promise<void> {
    await expect(this.button.resultCountText).toBeVisible();
  }

  // Kiểm tra UI không bị crash hoặc trắng trang: header vẫn hiển thị.
  // Không dùng icon Home (#sidebarCollapse) vì icon này không có trên trang kết quả.
  async expectUiNotCrashed(): Promise<void> {
    await expect(this.button.header).toBeVisible();
  }

  // Lấy tên tất cả khóa học trong kết quả. Phải đợi khóa học đầu tiên hiện ra,
  // nếu không allTextContents() có thể chạy khi trang chưa tải xong và trả về mảng rỗng.
  async getSearchResultTitles(): Promise<string[]> {
    await expect(this.button.courseTitle.first()).toBeVisible();
    return this.button.courseTitle.allTextContents();
  }

  // Kiểm tra có ít nhất 1 kết quả và tên khóa học nào cũng chứa từ khóa (không phân biệt hoa/thường).
  async expectSearchResultsContainKeyword(keyword: string): Promise<void> {
    const titles = await this.getSearchResultTitles();

    // Phải có kết quả, tránh mảng rỗng làm vòng for không chạy mà test vẫn pass.
    expect(titles.length).toBeGreaterThan(0);

    for (const title of titles) {
      expect(title.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }
}