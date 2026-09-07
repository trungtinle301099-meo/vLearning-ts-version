export type LoginAuthCredential = {
  username: string;
  password: string;
};

export type LoginAuthExpectedUrl = {
  loginUrl: string | RegExp;
  successUrl: string | RegExp;
};


export type Message =
  | 'Tài khoản hoặc mật khẩu không đúng!'
  | 'đăng nhập thành công';
