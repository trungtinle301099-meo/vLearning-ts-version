import { faker } from '@faker-js/faker';

function formatDateVN(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const randomHelper = {
  username(prefix = 'taikhoan'): string {
    const maxLength = 15;
    const timestamp = Date.now().toString(36);
    const randomNumber = faker.string.numeric(3);

    const availablePrefixLength = maxLength - timestamp.length - randomNumber.length;
    const safePrefix = prefix.slice(0, availablePrefixLength);

    return `${safePrefix}${timestamp}${randomNumber}`;
  },

  password(): string {
    const upper = faker.string.alpha({ length: 1, casing: 'upper' });
    const lower = faker.string.alpha({ length: 4, casing: 'lower' });
    const number = faker.string.numeric(4);

    return `@${upper}${lower}${number}`;
  },

  fullName(prefix = 'Auto Test'): string {
    const maxLength = 15;

    const rawFullName = `${prefix} ${faker.person.firstName()} ${faker.person.lastName()}`;

    return rawFullName
      .replace(/[^a-zA-Z\s]/g, '') // chỉ giữ chữ và khoảng trắng
      .replace(/\s+/g, ' ')        // gom nhiều khoảng trắng thành 1
      .trim()
      .slice(0, maxLength);
  },

  phoneVN(): string {
    return `09${faker.string.numeric(8)}`;
  },

  email(username: string): string {
    return `${username}_${faker.string.numeric(4)}@gmail.com`;
  },

  courseId(prefix = 'MKH'): string {
    return `${prefix}${Date.now()}${faker.string.numeric(3)}`;
  },

  courseAlias(courseId: string): string {
    return `bi-danh-${courseId.toLowerCase()}`;
  },

  courseName(prefix = 'Auto Course'): string {
    return `${prefix} ${faker.commerce.productName()}`;
  },

  courseDescription(): string {
    return faker.lorem.sentence();
  },

  number(min = 1, max = 100): number {
    return faker.number.int({ min, max });
  },

  futureDateVN(): string {
    return formatDateVN(faker.date.future());
  }
};