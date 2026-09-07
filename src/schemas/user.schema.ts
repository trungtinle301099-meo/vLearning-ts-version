import { z } from 'zod';

export const registerUserResponseSchema = z.object({
  taiKhoan: z.string(),
  matKhau: z.string(),
  hoTen: z.string(),
  soDT: z.string(),
  maNhom: z.string(),
  email: z.string().email()
});

export const userTypeSchema = z.object({
  maLoaiNguoiDung: z.string(),
  tenLoaiNguoiDung: z.string()
});

export const getUserTypeListResponseSchema = z.array(userTypeSchema);

export const updateUserInfoResponseSchema = z.object({
  taiKhoan: z.string(),
  matKhau: z.string(),
  hoTen: z.string(),
  soDt: z.string(),
  maLoaiNguoiDung: z.string(),
  maNhom: z.string(),
  email: z.string().email(),
  biDanh: z.union([z.string(), z.null()]).optional(),
  maLoaiNguoiDungNavigation: z.unknown().nullable().optional(),
  hocVienKhoaHoc: z.array(z.unknown()).optional(),
  khoaHoc: z.array(z.unknown()).optional()
});

export const findUserAccountItemSchema = z
  .object({
    taiKhoan: z.string().optional(),
    hoTen: z.string().optional(),
    email: z.string().optional(),
    soDT: z.string().optional(),
    soDt: z.string().optional(),
    maNhom: z.union([z.string(), z.null()]).optional(),
    maLoaiNguoiDung: z.string().optional(),
    tenLoaiNguoiDung: z.string().optional()
  })
  .passthrough();

export const findUserAccountResponseSchema = z.array(findUserAccountItemSchema);