export const BASE_URL = __ENV.BASE_URL || 'https://demo2.cybersoft.edu.vn';
export const API_BASE_URL = __ENV.API_BASE_URL || 'https://elearningnew.cybersoft.edu.vn';
export const TOKEN_CYBERSOFT = __ENV.TOKEN_CYBERSOFT || '';
export const DEFAULT_GROUP = __ENV.DEFAULT_GROUP || 'GP01';

// Mặc định "/" để test UI/base page.
// Nếu muốn test API thật, truyền K6_TARGET_PATH khi chạy.
export const K6_TARGET_PATH = __ENV.K6_TARGET_PATH || '/';
