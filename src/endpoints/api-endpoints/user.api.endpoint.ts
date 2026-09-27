export const UserEndpoint = {
  getUserList: '/api/QuanLyNguoiDung/LayDanhSachNguoiDung',
  getUserListPaging: '/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang',
  updateUserInfo: '/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung',
  deleteUser: '/api/QuanLyNguoiDung/XoaNguoiDung',
  getUserTypeList: '/api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung',
  findUserAccount: '/api/QuanLyNguoiDung/TimKiemNguoiDung',
  cancelCourseRegistration: '/api/QuanLyKhoaHoc/HuyGhiDanh',
  register: '/api/QuanLyNguoiDung/DangKy',
  addUser: '/api/QuanLyNguoiDung/ThemNguoiDung'
} as const;
