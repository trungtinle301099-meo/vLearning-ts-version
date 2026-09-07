import { z } from 'zod';

export const courseCreatorSchema = z.object({
  taiKhoan: z.string(),
  hoTen: z.string(),
  maLoaiNguoiDung: z.string(),
  tenLoaiNguoiDung: z.string()
});

export const courseCategorySchema = z
  .object({
    maDanhMucKhoaHoc: z.string().optional(),
    maDanhMucKhoahoc: z.string().optional(),
    tenDanhMucKhoaHoc: z.string().optional()
  })
  .passthrough();

export const courseSchema = z.object({
  maKhoaHoc: z.string(),
  biDanh: z.string().nullable().optional(),
  tenKhoaHoc: z.string(),
  moTa: z.string().nullable().optional(),
  luotXem: z.number(),
  hinhAnh: z.string(),
  maNhom: z.string(),
  ngayTao: z.string(),
  soLuongHocVien: z.number(),
  nguoiTao: courseCreatorSchema,
  danhMucKhoaHoc: courseCategorySchema
});

export const courseListResponseSchema = z.array(courseSchema);

export const createCourseResponseSchema = z.object({
  maKhoaHoc: z.string(),
  biDanh: z.string(),
  tenKhoaHoc: z.string(),
  moTa: z.string(),
  luotXem: z.number(),
  danhGia: z.number(),
  hinhAnh: z.string(),
  maNhom: z.string(),
  ngayTao: z.string(),
  maDanhMucKhoaHoc: z.string(),
  taiKhoanNguoiTao: z.string()
});

export const updateCourseResponseSchema = createCourseResponseSchema;


export const courseInfoResponseSchema = z
  .object({
    maKhoaHoc: z.string(),
    biDanh: z.string(),
    tenKhoaHoc: z.string(),
    moTa: z.string(),
    luotXem: z.number(),
    hinhAnh: z.string(),
    maNhom: z.string(),
    ngayTao: z.string(),
    soLuongHocVien: z.number().optional(),
    nguoiTao: courseCreatorSchema.nullable().optional(),
    danhMucKhoaHoc: courseCategorySchema.nullable().optional()
  })
  .passthrough();
