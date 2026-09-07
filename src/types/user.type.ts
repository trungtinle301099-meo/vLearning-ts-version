export type RegisterUserRequest = {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
};

export type UpdateUserInfoRequest = RegisterUserRequest & {
  maLoaiNguoiDung: string;
};
