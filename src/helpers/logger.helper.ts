import dayjs from 'dayjs';

type LogLevel = 'INFO' | 'STEP' | 'PASS' | 'WARN' | 'ERROR';

const color = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const levelColor: Record<LogLevel, string> = {
  INFO: color.cyan,
  STEP: color.magenta,
  PASS: color.green,
  WARN: color.yellow,
  ERROR: color.red
};

function log(level: LogLevel, message: string): void {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const currentColor = levelColor[level];

  console.log(
    `${color.gray}[${timestamp}]${color.reset} ${currentColor}[${level}]${color.reset} ${message}`
  );
}

export const logger = {
  info: (message: string) => log('INFO', message),
  step: (message: string) => log('STEP', message),
  pass: (message: string) => log('PASS', message),
  warn: (message: string) => log('WARN', message),
  error: (message: string) => log('ERROR', message)
};
