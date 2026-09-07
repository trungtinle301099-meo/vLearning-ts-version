import { env } from '../config/env.config';
import { randomHelper } from '../helpers/random.helper';
import type { RegisterUserRequest, UpdateUserInfoRequest } from '../types/user.type';
import type { LoginAuthCredential } from '../pages/authPage/loginAuthPage/loginAuthPage.type';


export function createRandomRegisterUserData(): RegisterUserRequest {
  const username = randomHelper.username();

  return {
    taiKhoan: username,
    matKhau: randomHelper.password(),
    hoTen: randomHelper.fullName(),
    soDT: randomHelper.phoneVN(),
    maNhom: env.defaultGroup,
    email: randomHelper.email(username)
  };
}

export function createExistingUsernameRegisterTestData(): {
  existingUser: RegisterUserRequest;
  duplicateUsernameUser: RegisterUserRequest;
} {
  const existingUser = createRandomRegisterUserData();

  return {
    existingUser,
    duplicateUsernameUser: {
      ...createRandomRegisterUserData(),
      taiKhoan: existingUser.taiKhoan
    }
  };
}

export function createExistingEmailRegisterTestData(): {
  existingUser: RegisterUserRequest;
  duplicateEmailUser: RegisterUserRequest;
} {
  const existingUser = createRandomRegisterUserData();

  return {
    existingUser,
    duplicateEmailUser: {
      ...createRandomRegisterUserData(),
      email: existingUser.email
    }
  };
}

export function createUpdateUserInfoData(
  registeredUser: RegisterUserRequest,
  override: Partial<UpdateUserInfoRequest> = {}
): UpdateUserInfoRequest {
  return {
    taiKhoan: registeredUser.taiKhoan,
    matKhau: registeredUser.matKhau,
    hoTen: registeredUser.hoTen,
    soDT: registeredUser.soDT,
    maLoaiNguoiDung: 'HV',
    maNhom: registeredUser.maNhom,
    email: registeredUser.email,
    ...override
  };
}

export function createValidLoginAuthCredential(): LoginAuthCredential {
  return {
    username: env.username,
    password: env.password
  };
}

export function createInvalidUsernameLoginAuthCredential(): LoginAuthCredential {
  return {
    username: randomHelper.username('not_exist_user_'),
    password: env.password
  };
}

export function createInvalidEmailLoginAuthCredential(): LoginAuthCredential {
  const randomUsername = randomHelper.username('not_exist_email_');

  return {
    username: randomHelper.email(randomUsername),
    password: env.password
  };
}

export function createEmptyUsernameLoginAuthCredential(): LoginAuthCredential {
  return {
    username: '',
    password: env.password
  };
}

export function createEmptyPasswordLoginAuthCredential(): LoginAuthCredential {
  return {
    username: env.username,
    password: ''
  };
}
