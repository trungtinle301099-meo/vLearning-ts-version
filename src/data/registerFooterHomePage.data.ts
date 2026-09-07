import { randomHelper } from '../helpers/random.helper';
import type { RegisterFooterHomePageFormData } from '../pages/homePage/registerFooterHomePage/registerFooterHomePage.type';

export function createValidRegisterFooterHomePageData(): RegisterFooterHomePageFormData {
  const username = randomHelper.username('consult_');

  return {
    fullName: 'Auto Test User',
    email: randomHelper.email(username),
    phone: randomHelper.phoneVN()
  };
}

export function createInvalidPhoneRegisterFooterHomePageData(): RegisterFooterHomePageFormData {
  const username = randomHelper.username('consult_');

  return {
    fullName: 'Auto Test User',
    email: randomHelper.email(username),
    phone: 'abc123'
  };
}

export function createInvalidFullNameRegisterFooterHomePageData(): RegisterFooterHomePageFormData {
  const username = randomHelper.username('consult_');

  return {
    fullName: '123456@#$',
    email: randomHelper.email(username),
    phone: randomHelper.phoneVN()
  };
}

export function createInvalidEmailRegisterFooterHomePageData(): RegisterFooterHomePageFormData {
  return {
    fullName: 'Auto Test User',
    email: 'invalid-email',
    phone: randomHelper.phoneVN()
  };
}