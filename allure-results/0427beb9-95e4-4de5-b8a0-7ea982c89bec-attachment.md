# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/users/addUser.ui.spec.ts >> Admin - Quản lý người dùng >> TC1 - Thêm người dùng thành công
- Location: tests/ui/users/addUser.ui.spec.ts:26:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('.modal-content').locator('.modal-body').locator('form').locator('select#chucvu').locator('option[value="HV"]') resolved to 3 elements:
    1) <option value="HV">Học viên</option> aka locator('#userUpdateInfo').getByText('Học viên')
    2) <option value="HV">Học viên</option> aka getByRole('combobox')
    3) <option value="HV">Học viên</option> aka locator('#userUpdate').getByText('Học viên')

Call log:
  - waiting for locator('.modal-content').locator('.modal-body').locator('form').locator('select#chucvu').locator('option[value="HV"]')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - navigation [ref=e5]:
    - link "" [ref=e7] [cursor=pointer]:
      - /url: /trangchu
      - generic [ref=e9]: 
    - list [ref=e10]:
      - listitem [ref=e11]:
        - link " Quản lý người dùng" [ref=e12] [cursor=pointer]:
          - /url: /admin/quanlynguoidung
          - generic [ref=e13]: 
          - text: Quản lý người dùng
      - listitem [ref=e14]:
        - link " Quản lý khóa học" [ref=e15] [cursor=pointer]:
          - /url: /admin/quanlykhoahoc
          - generic [ref=e16]: 
          - text: Quản lý khóa học
  - generic [ref=e17]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - text: 
        - button "Thêm người dùng" [ref=e21] [cursor=pointer]
      - generic [ref=e22]:
        - textbox "Nhập vào tài khoản hoặc họ tên người dùng" [ref=e25]
        - generic [ref=e27]:
          - generic [ref=e28]: Chào ,
          - button [ref=e30] [cursor=pointer]
          - text:      
    - table [ref=e32]:
      - rowgroup [ref=e33]:
        - row "STT Tài khoản Người dùng Họ và tên Email Số điện thoại " [ref=e34]:
          - columnheader "STT" [ref=e35]
          - columnheader "Tài khoản" [ref=e36]
          - columnheader "Người dùng" [ref=e37]
          - columnheader "Họ và tên" [ref=e38]
          - columnheader "Email" [ref=e39]
          - columnheader "Số điện thoại" [ref=e40]
          - columnheader "" [ref=e41]:
            - emphasis [ref=e42]: 
      - rowgroup [ref=e43]:
        - row "1 a a a a a HV Test edit 10_02_2026 aa1@gmail.com 0912345678 Ghi danh Sửa Xóa" [ref=e44]:
          - cell "1" [ref=e45]
          - cell "a a a a a" [ref=e46]
          - cell "HV" [ref=e47]
          - cell "Test edit 10_02_2026" [ref=e48]
          - cell "aa1@gmail.com" [ref=e49]
          - cell "0912345678" [ref=e50]
          - cell "Ghi danh Sửa Xóa" [ref=e51]:
            - button "Ghi danh" [ref=e52] [cursor=pointer]
            - button "Sửa" [ref=e53] [cursor=pointer]
            - button "Xóa" [ref=e54] [cursor=pointer]
        - row "2 User 123 HV Tester 4 VOVANHUY@GMAIL.COM 0987654321 Ghi danh Sửa Xóa" [ref=e55]:
          - cell "2" [ref=e56]
          - cell "User 123" [ref=e57]
          - cell "HV" [ref=e58]
          - cell "Tester 4" [ref=e59]
          - cell "VOVANHUY@GMAIL.COM" [ref=e60]
          - cell "0987654321" [ref=e61]
          - cell "Ghi danh Sửa Xóa" [ref=e62]:
            - button "Ghi danh" [ref=e63] [cursor=pointer]
            - button "Sửa" [ref=e64] [cursor=pointer]
            - button "Xóa" [ref=e65] [cursor=pointer]
        - row "3 .1 HV qtan qtan@rmit.edu.vn 0379109025 Ghi danh Sửa Xóa" [ref=e66]:
          - cell "3" [ref=e67]
          - cell ".1" [ref=e68]
          - cell "HV" [ref=e69]
          - cell "qtan" [ref=e70]
          - cell "qtan@rmit.edu.vn" [ref=e71]
          - cell "0379109025" [ref=e72]
          - cell "Ghi danh Sửa Xóa" [ref=e73]:
            - button "Ghi danh" [ref=e74] [cursor=pointer]
            - button "Sửa" [ref=e75] [cursor=pointer]
            - button "Xóa" [ref=e76] [cursor=pointer]
        - row "4 .100 GV .100 tuananh812000@gmail.com 8765456789o0 Ghi danh Sửa Xóa" [ref=e77]:
          - cell "4" [ref=e78]
          - cell ".100" [ref=e79]
          - cell "GV" [ref=e80]
          - cell ".100" [ref=e81]
          - cell "tuananh812000@gmail.com" [ref=e82]
          - cell "8765456789o0" [ref=e83]
          - cell "Ghi danh Sửa Xóa" [ref=e84]:
            - button "Ghi danh" [ref=e85] [cursor=pointer]
            - button "Sửa" [ref=e86] [cursor=pointer]
            - button "Xóa" [ref=e87] [cursor=pointer]
        - row "5 .5 GV .5 s.5@rmit.edu.vn .5 Ghi danh Sửa Xóa" [ref=e88]:
          - cell "5" [ref=e89]
          - cell ".5" [ref=e90]
          - cell "GV" [ref=e91]
          - cell ".5" [ref=e92]
          - cell "s.5@rmit.edu.vn" [ref=e93]
          - cell ".5" [ref=e94]
          - cell "Ghi danh Sửa Xóa" [ref=e95]:
            - button "Ghi danh" [ref=e96] [cursor=pointer]
            - button "Sửa" [ref=e97] [cursor=pointer]
            - button "Xóa" [ref=e98] [cursor=pointer]
    - dialog [ref=e99]:
      - generic [ref=e100]:
        - banner [ref=e101]:
          - heading "THÔNG TIN NGƯỜI DÙNG" [level=3] [ref=e102]
        - form [ref=e104]:
          - generic [ref=e106]:
            - generic [ref=e109]: 
            - textbox "Tài khoản" [ref=e110]: taikmujwclpi756
          - generic [ref=e112]:
            - generic [ref=e115]: 
            - textbox "Họ và tên" [ref=e116]: Auto Test Vivia
          - generic [ref=e118]:
            - generic [ref=e121]: 
            - textbox "Email" [ref=e122]: taikmujwclpi756_7935@gmail.com
          - generic [ref=e124]:
            - generic [ref=e127]: 
            - textbox "Mật khẩu" [ref=e128]
          - generic [ref=e130]:
            - generic [ref=e133]: 
            - textbox "Số điện thoại" [ref=e134]: "0978126833"
          - generic [ref=e136]:
            - generic [ref=e139]: 
            - combobox [active] [ref=e140]:
              - option "Loại người dùng" [selected]
              - option "Giáo vụ"
              - option "Học viên"
          - generic [ref=e141]:
            - button "Thêm người dùng" [ref=e142] [cursor=pointer]
            - button "Đóng" [ref=e143] [cursor=pointer]
    - text:      
    - list [ref=e144]:
      - listitem [ref=e145]:
        - button "Previous page" [disabled] [ref=e146] [cursor=pointer]: < Trước
      - listitem [ref=e147]:
        - button "Page 1 is your current page" [ref=e148] [cursor=pointer]: "1"
      - listitem [ref=e149]:
        - button "Page 2" [ref=e150] [cursor=pointer]: "2"
      - listitem [ref=e151]:
        - button "Page 3" [ref=e152] [cursor=pointer]: "3"
      - listitem [ref=e153]:
        - button "..." [ref=e154] [cursor=pointer]
      - listitem [ref=e155]:
        - button "Page 690" [ref=e156] [cursor=pointer]: "690"
      - listitem [ref=e157]:
        - button "Page 691" [ref=e158] [cursor=pointer]: "691"
      - listitem [ref=e159]:
        - button "Page 692" [ref=e160] [cursor=pointer]: "692"
      - listitem [ref=e161]:
        - button "Next page" [ref=e162] [cursor=pointer]: Sau >
```

# Test source

```ts
  47  |     await expect(this.page).toHaveURL(
  48  |       HomePageUiEndpoint.coursManagement,
  49  |     );
  50  | 
  51  |     // 4. Search course
  52  |     await this.fillsearchInput(courseName);
  53  | 
  54  |     // 5. Verify course name
  55  |     await expect(
  56  |       this.button.getCourseInformationByName(courseName),
  57  |     ).toBeVisible();
  58  | 
  59  |     // 6. Verify course ID
  60  |     await expect(
  61  |       this.button.getCourseInformationByName(courseId),
  62  |     ).toBeVisible();
  63  |     }
  64  | 
  65  |     async clickGhiDanhButtonByCourseName(
  66  |     courseName: string,
  67  |     ): Promise<void> {
  68  |     await this.button
  69  |       .getGhiDanhButtonByCourseName(courseName)
  70  |       .click();
  71  |     }
  72  | 
  73  |     async clickXacThucButtonByTaiKhoan(
  74  |     taiKhoan: string,
  75  |     ): Promise<void> {
  76  |     await this.button
  77  |       .getXacThucButtonByTaiKhoan(taiKhoan)
  78  |       .click();
  79  |     }
  80  | 
  81  |     async verifyGhiDanhPopupByCourse(
  82  |     courseName: string,
  83  |     courseId: string,
  84  |     taiKhoan: string,
  85  |     ): Promise<void> {
  86  |     await this.searchCourseSuccessfully(courseName, courseId);
  87  | 
  88  |     await this.clickGhiDanhButtonByCourseName(courseName);
  89  | 
  90  |     await expect(this.button.ghiDanhPopup).toBeVisible();
  91  | 
  92  |     await expect(
  93  |       this.button.getUserNameDangKyKhoaHocRowInGhiDanhPopup(taiKhoan),
  94  |     ).toBeVisible();
  95  |     }
  96  | 
  97  |     async clickXoaButtonByTaiKhoan(
  98  |     taiKhoan: string,
  99  |     ): Promise<void> {
  100 |     await this.button
  101 |       .getXoaButtonByTaiKhoan(taiKhoan)
  102 |       .click();
  103 |     }
  104 | 
  105 |     async clickXoabutton(): Promise<void> {
  106 |     await this.button.xoaButton.click();
  107 |     }
  108 | 
  109 |     async fillSearchTaiKhoanInput(taiKhoan: string): Promise<void> {
  110 |     await this.button.searchTaiKhoanInput.fill(taiKhoan);
  111 |     }
  112 | 
  113 |     async addUser(data: AddUserRequest) {
  114 | 
  115 |     // Step 1: Click button "Thêm người dùng"
  116 |     await this.button.themNguoiDungButton.click();
  117 | 
  118 |     // Step 2: Verify popup "THÔNG TIN NGƯỜI DÙNG" hiển thị
  119 |     await this.button.thongTinNguoiDungPopup.waitFor({
  120 |       state: 'visible',
  121 |     });
  122 | 
  123 |     // Step 3: Điền thông tin tài khoản
  124 |     await this.button
  125 |       .taiKhoanInputInThongTinNguoiDungPopup
  126 |       .fill(data.taiKhoan);
  127 | 
  128 |     // Step 3: Điền họ và tên
  129 |     await this.button
  130 |       .getThongTinNguoiDungInput('Họ và tên')
  131 |       .fill(data.hoTen);
  132 | 
  133 |     // Step 3: Điền email
  134 |     await this.button
  135 |       .getThongTinNguoiDungInput('Email')
  136 |       .fill(data.email);
  137 | 
  138 |     // Step 3: Điền số điện thoại
  139 |     await this.button
  140 |       .getThongTinNguoiDungInput('Số điện thoại')
  141 |       .fill(data.soDT);
  142 | 
  143 |     // Step 4: Click combobox "Loại người dùng"
  144 |     await this.button.chucvuCombobox.click();
  145 | 
  146 |     // Step 5: Chọn loại người dùng
> 147 |     await this.button.getChucVuSelect('HV').click();
      |                                             ^ Error: locator.click: Error: strict mode violation: locator('.modal-content').locator('.modal-body').locator('form').locator('select#chucvu').locator('option[value="HV"]') resolved to 3 elements:
  148 | 
  149 |     // Step 6: Click button "Thêm người dùng" trong popup
  150 |     await this.button.themNguoiDungButtonInPopup.click();
  151 |   }
  152 | }
```