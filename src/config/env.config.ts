import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getEnv(key: string, defaultValue = ''): string {
  return (process.env[key] ?? defaultValue).trim();
}

export const env = {
  baseUrl: getEnv('BASE_URL', 'https://demo2.cybersoft.edu.vn'),
  apiBaseUrl: getEnv('API_BASE_URL', 'https://elearningnew.cybersoft.edu.vn'),
  tokenCybersoft: getEnv('TOKEN_CYBERSOFT'),
  username: getEnv('USERNAME'),
  password: getEnv('PASSWORD'),
  defaultGroup: getEnv('DEFAULT_GROUP', 'GP01'),
  defaultCourseId: getEnv('DEFAULT_COURSE_ID', '000'),
  isCI: process.env.CI === 'true',
  authStatePath: process.env.AUTH_STATE_PATH ?? 'playwright/.auth/admin.json'
};

export function isConfigured(value: string): boolean {
  return value.trim().length > 0;
}
