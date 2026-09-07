import type { RegisterUserRequest } from '../../../types/user.type';

export type RegisterAuthFormData = RegisterUserRequest;

export type RegisterAuthExpectedUrl = {
  registerUrl: string | RegExp;
};

export type RegisterAuthMessage =
  | 'Đăng kí thành công'
  | 'Tài khoản đã tồn tại!'
  | 'Email đã tồn tại!';