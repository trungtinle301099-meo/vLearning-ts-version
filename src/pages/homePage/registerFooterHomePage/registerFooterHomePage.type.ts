export type RegisterFooterHomePageFormData = {
  fullName: string;
  email: string;
  phone: string;
};

export type RegisterFooterHomePageMessage =
  | 'Đăng ký thành công'
  | 'Số điện thoại không hợp lệ'
  | 'Họ và tên không hợp lệ'
  | 'Email không hợp lệ';