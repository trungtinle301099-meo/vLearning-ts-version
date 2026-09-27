// ============================================================
// 1. INTERFACE GỐC - CHỨA TOÀN BỘ FIELD
// ============================================================

export interface CourseData {
  // Course
  maKhoaHoc: string;
  biDanh: string | null;
  tenKhoaHoc: string;
  moTa: string | null;
  luotXem: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  soLuongHocVien: number;

  // Course Creator
  taiKhoan: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  tenLoaiNguoiDung: string;

  // Course Category
  maDanhMucKhoaHoc: string;
  tenDanhMucKhoaHoc: string | null;

  // Create Course
  danhGia: number;
  taiKhoanNguoiTao: string;
}

// ============================================================
// 2. COURSE RESPONSE
// ============================================================

export type CourseResponse = Pick<
  CourseData,
  | 'maKhoaHoc'
  | 'biDanh'
  | 'tenKhoaHoc'
  | 'moTa'
  | 'luotXem'
  | 'hinhAnh'
  | 'maNhom'
  | 'ngayTao'
  | 'soLuongHocVien'
  | 'taiKhoan'
  | 'hoTen'
  | 'maLoaiNguoiDung'
  | 'tenLoaiNguoiDung'
  | 'maDanhMucKhoaHoc'
  | 'tenDanhMucKhoaHoc'
>;

// ============================================================
// 3. CREATE COURSE REQUEST
// ============================================================

export type CreateCourseRequest = Pick<
  CourseData,
  | 'maKhoaHoc'
  | 'biDanh'
  | 'tenKhoaHoc'
  | 'moTa'
  | 'luotXem'
  | 'danhGia'
  | 'hinhAnh'
  | 'maNhom'
  | 'ngayTao'
  | 'maDanhMucKhoaHoc'
  | 'taiKhoanNguoiTao'
>;

// ============================================================
// 4. REGISTER COURSE REQUEST
// ============================================================

export type RegisterCourseRequest = Pick<CourseData, 'maKhoaHoc' | 'taiKhoan'>;

// ============================================================
// 5. COURSE DETAIL RESPONSE
//    Lấy toàn bộ field, bỏ một số field không cần
// ============================================================

export type CourseDetailResponse = Omit<CourseData, 'danhGia' | 'taiKhoanNguoiTao'>;

// ============================================================
// 6. COURSE SUMMARY RESPONSE
//    Chỉ lấy những field cần thiết
// ============================================================

export type CourseSummaryResponse = Pick<CourseData, 'maKhoaHoc' | 'tenKhoaHoc' | 'hinhAnh'>;

// ============================================================
// 7. COURSE LIST RESPONSE
// ============================================================

export type CourseListResponse = Pick<
  CourseData,
  'maKhoaHoc' | 'tenKhoaHoc' | 'hinhAnh' | 'luotXem' | 'soLuongHocVien'
>;

// ============================================================
// 8. COURSE CREATOR RESPONSE
// ============================================================

export type CourseCreatorResponse = Pick<
  CourseData,
  'taiKhoan' | 'hoTen' | 'maLoaiNguoiDung' | 'tenLoaiNguoiDung'
>;

// ============================================================
// 9. COURSE CATEGORY RESPONSE
// ============================================================

export type CourseCategoryResponse = Pick<CourseData, 'maDanhMucKhoaHoc' | 'tenDanhMucKhoaHoc'>;
