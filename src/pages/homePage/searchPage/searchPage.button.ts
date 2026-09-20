import type { Locator, Page } from '@playwright/test';

// Locator của chức năng tìm kiếm khóa học.
export class SearchPageButton {
  // Header của web (đã thấy class này trong log lỗi của danhMuc). Dùng để xác nhận UI không bị crash.
  readonly header: Locator;

  // Ô nhập từ khóa nằm trong thanh tìm kiếm (class searchForm) trên header.
  readonly searchInput: Locator;

  // Dòng chữ h6 "Hiển thị n kết quả" trên trang kết quả tìm kiếm.
  readonly resultCountText: Locator;

  // Danh sách khóa học của trang kết quả (class courseSearchResult).
  readonly courseSearchResult: Locator;

  // Tên (h6) của từng khóa học trong danh sách kết quả.
  readonly courseTitle: Locator;

  constructor(private readonly page: Page) {
    this.header = this.page.locator('section.header').first();

    // .first() để tránh lỗi "strict mode violation" nếu trong searchForm có nhiều thẻ input.
    this.searchInput = this.page.locator('.searchForm').first();

    // Trang kết quả không có tiêu đề riêng, chỉ có 1 dòng h6 dạng "Hiển thị n kết quả".
    this.resultCountText = this.page.locator('h6').filter({ hasText: /Hiển thị\s*\d+\s*kết quả/i });

    this.courseSearchResult = this.page.locator('.courseSearchResult');

    // Tên khóa học là h6 nằm trong danh sách. Loại dòng "Hiển thị n kết quả" ra
    // phòng trường hợp nó cũng nằm trong khối .courseSearchResult.
    this.courseTitle = this.courseSearchResult
      .locator('h6')
      .filter({ hasNotText: /Hiển thị\s*\d+\s*kết quả/i });
  }
}