import { expect, type Page } from '@playwright/test';
import { BasePage } from '../basePage/basePage.index';
import { AdminPageButton } from './adminPage.button';
import type { AddUserRequest } from '../../types/user.type';

import { HomePageUiEndpoint } from '../../endpoints/ui-endpoints/homePage.ui.endpoint';

export class AdminPage extends BasePage {
  readonly button: AdminPageButton;

  constructor(page: Page) {
    super(page);

    this.button = new AdminPageButton(page);
  }

  async clickSettingButton(): Promise<void> {
    await this.button.settingButton.click();
  }
  async clickQuanLyNguoiDungButton(): Promise<void> {
    await this.button.quanLyNguoiDungButton.click();
  }
  async clickQuanLyKhoaHocButton(): Promise<void> {
    await this.button.quanLyKhoaHocButton.click();
  }
  async clickThemKhoaHocButton(): Promise<void> {
    await this.button.themKhoaHocButton.click();
  }
  async gotoHomePage(): Promise<void> {
    await this.goto(HomePageUiEndpoint.homePage);
  }
  async fillsearchInput(text: string): Promise<void> {
    await this.button.searchKhoaHocInput.fill(text);
  }

  async searchCourseSuccessfully(courseName: string, courseId: string): Promise<void> {
    // 1. Go to User Management page
    await this.goto(HomePageUiEndpoint.userManagement);

    // 2. Click Course Management
    await this.clickQuanLyKhoaHocButton();

    // 3. Verify Course Management page
    await expect(this.page).toHaveURL(HomePageUiEndpoint.coursManagement);

    // 4. Search course
    await this.fillsearchInput(courseName);

    // 5. Verify course name
    await expect(this.button.getCourseInformationByName(courseName)).toBeVisible();

    // 6. Verify course ID
    await expect(this.button.getCourseInformationByName(courseId)).toBeVisible();
  }

  async clickGhiDanhButtonByCourseName(courseName: string): Promise<void> {
    await this.button.getGhiDanhButtonByCourseName(courseName).click();
  }

  async clickXacThucButtonByTaiKhoan(taiKhoan: string): Promise<void> {
    await this.button.getXacThucButtonByTaiKhoan(taiKhoan).click();
  }

  async verifyGhiDanhPopupByCourse(
    courseName: string,
    courseId: string,
    taiKhoan: string
  ): Promise<void> {
    await this.searchCourseSuccessfully(courseName, courseId);

    await this.clickGhiDanhButtonByCourseName(courseName);

    await expect(this.button.ghiDanhPopup).toBeVisible();

    await expect(this.button.getUserNameDangKyKhoaHocRowInGhiDanhPopup(taiKhoan)).toBeVisible();
  }

  async clickXoaButtonByTaiKhoan(taiKhoan: string): Promise<void> {
    await this.button.getXoaButtonByTaiKhoan(taiKhoan).click();
  }

  async clickXoabutton(): Promise<void> {
    await this.button.xoaButton.click();
  }

  async fillSearchTaiKhoanInput(taiKhoan: string): Promise<void> {
    await this.button.searchTaiKhoanInput.fill(taiKhoan);
  }

  async addUser(data: AddUserRequest) {
    // Step 1: Click button "Thêm người dùng"
    await this.button.themNguoiDungButton.click();

    // Step 2: Verify popup "THÔNG TIN NGƯỜI DÙNG" hiển thị
    await this.button.thongTinNguoiDungPopup.waitFor({
      state: 'visible'
    });

    // Step 3: Điền thông tin tài khoản
    await this.button.taiKhoanInputInThongTinNguoiDungPopup.fill(data.taiKhoan);

    // Step 3: Điền họ và tên
    await this.button.getThongTinNguoiDungInput('Họ và tên').fill(data.hoTen);

    // Step 3: Điền email
    await this.button.getThongTinNguoiDungInput('Email').fill(data.email);

    // Step 3: Điền số điện thoại
    await this.button.getThongTinNguoiDungInput('Số điện thoại').fill(data.soDT);

    // Step 4: Click combobox "Loại người dùng"
    await this.button.chucvuCombobox.click();

    // Step 5: Chọn loại người dùng
    await this.button.getChucVuSelect('HV').click();

    // Step 6: Click button "Thêm người dùng" trong popup
    await this.button.themNguoiDungButtonInPopup.click();
  }
}
