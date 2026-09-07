export type CourseCreator = {
  taiKhoan: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  tenLoaiNguoiDung: string;
};

export type CourseCategory = {
  maDanhMucKhoaHoc: string;
  tenDanhMucKhoaHoc: string;
} | null;

export type Course = {
  maKhoaHoc: string;
  biDanh?: string | null;
  tenKhoaHoc: string;
  moTa?: string | null;
  luotXem: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  soLuongHocVien: number;
  nguoiTao: CourseCreator;
  danhMucKhoaHoc: CourseCategory;
};

export type CreateCourseRequest = {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
};

export type RegisterCourseRequest = {
  maKhoaHoc: string;
  taiKhoan: string;
};


