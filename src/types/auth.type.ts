export type LoginRequest = {
  taiKhoan: string;
  matKhau: string;
};

export type LoginResponse = {
  taiKhoan: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  hoTen: string;
  accessToken: string;
};
