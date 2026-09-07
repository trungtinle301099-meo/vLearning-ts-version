export const CourseEndpoint = {
  getCourseList: '/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc',
  getCourseInfo: '/api/QuanLyKhoaHoc/LayThongTinKhoaHoc',
  createCourse: '/api/QuanLyKhoaHoc/ThemKhoaHoc',
  deleteCourse: '/api/QuanLyKhoaHoc/XoaKhoaHoc',
  updateCourse: '/api/QuanLyKhoaHoc/CapNhatKhoaHoc',
  registerCourse: '/api/QuanLyKhoaHoc/GhiDanhKhoaHoc',
  cancelCourseRegistration: '/api/QuanLyKhoaHoc/HuyGhiDanh',
  getCourseStudents: '/api/QuanLyKhoaHoc/LayThongTinHocVienKhoaHoc'
} as const;
