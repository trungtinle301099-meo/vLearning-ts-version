import type { Locator, Page } from '@playwright/test';


export class AdminPageButton {

  readonly settingButton: Locator;  
  readonly quanLyNguoiDungButton: Locator;
  readonly quanLyKhoaHocButton: Locator;
  readonly homeButton: Locator;
  readonly themKhoaHocButton: Locator;
  readonly themKhoaHocPopup: Locator;
  readonly searchKhoaHocInput: Locator;
  readonly ghiDanhPopup: Locator;
  readonly xoaButton: Locator;
  readonly searchTaiKhoanInput: Locator;
  readonly themNguoiDungButton: Locator;
  readonly chucvuCombobox: Locator;
  readonly thongTinNguoiDungPopup: Locator;
  readonly themNguoiDungButtonInPopup: Locator;
  readonly taiKhoanInputInThongTinNguoiDungPopup: Locator;
  
  
  //locator type 1
  constructor(private readonly page: Page) {
    this.settingButton = page.locator('span.headerSet a[href="/admin/quanlynguoidung"]');
    this.quanLyNguoiDungButton = page.getByRole('link', { name: ' Quản lý người dùng' });
    this.quanLyKhoaHocButton = page.getByRole('link', { name: ' Quản lý khóa học' });
    this.homeButton = page.locator('#sidebarCollapse');
    this.themKhoaHocButton = page.getByRole('button', { name: 'Thêm khóa học' });
    this.themKhoaHocPopup = page.getByText('THÊM KHÓA HỌCDanh mục khóa họ');
    this.searchKhoaHocInput = page.getByRole('textbox', { name: 'Nhập vào khóa học cần tìm' });
    this.ghiDanhPopup = page.locator('#courseReg > .modal-dialog > .modal-content');
    this.xoaButton = page.getByRole('button', { name: 'Xóa' });
    this.searchTaiKhoanInput = page.getByRole('textbox', { name: 'Nhập vào tài khoản hoặc họ tên' });
    this.themNguoiDungButton = page.getByRole('button', {name: 'Thêm người dùng',});
    this.thongTinNguoiDungPopup = page.getByText('THÔNG TIN NGƯỜI DÙNGLoại ngườ')
    this.chucvuCombobox = this.page.locator('.modal-content').locator('.modal-body').locator('form').locator('select#chucvu').nth(1);
    this.themNguoiDungButtonInPopup = page.locator('#modal-footer').locator('#btnThem');
    this.taiKhoanInputInThongTinNguoiDungPopup = page.getByRole('textbox', { name: 'Tài khoản', exact: true });
  }

  //locator type 2
  getCourseInformationByName(courseInformation: string): Locator {
    return this.page.getByText(courseInformation, { exact: true })
  }

  getUserNameDangKyKhoaHocRowInGhiDanhPopup(taiKhoan: string): Locator {
    return this.page.locator('.modal-body table tbody tr')
    .filter({ hasText: taiKhoan })
    .getByRole('button', { name: 'Xác thực', exact: true });
  }

  getGhiDanhButtonByCourseName(courseName: string): Locator {
    return this.page.getByRole('row', { name: courseName }).locator('#btnThem')
  }

  getToastifyByMessage(message: string): Locator {
    return this.page.getByText(message, { exact: true });
  }

  getXoaButtonByTaiKhoan(taiKhoan: string): Locator {
  return this.page.locator('tr').filter({
    hasText: taiKhoan
  }).getByRole('button', {
    name: 'Xóa',
    exact: true
  });
  }

  getXacThucButtonByTaiKhoan(taiKhoan: string): Locator {
  return this.page.locator('tr').filter({
    hasText: taiKhoan
  }).getByRole('button', {
    name: 'Xác thực',
    exact: true
  });
  }

  getUserRow(taiKhoan: string) {
  return this.page.locator('#tableDanhSach tr').filter({
    hasText: taiKhoan,
  });
  }

  getThongTinNguoiDungInput(fieldName: string): Locator {
    return this.page.getByRole('textbox', { name: fieldName });
  }

  getChucVuSelect(UserType: string): Locator {
  return this.page
    .locator('.modal-content')
    .locator('.modal-body')
    .locator('form')
    .locator('select#chucvu')
    .locator(`option[value="${UserType}"]`);
  }
}