import { z } from 'zod';

export const loginResponseSchema = z.object({
  taiKhoan: z.string(),
  email: z.string(),
  soDT: z.string(),
  maNhom: z.string(),
  maLoaiNguoiDung: z.string(),
  hoTen: z.string(),
  accessToken: z.string().min(1)
});
