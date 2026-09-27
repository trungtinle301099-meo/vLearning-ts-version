const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'reports/**',
      'public-report/**',
      'logs/**',
      'dist/**',
      'performance/k6/**'
    ]
  },

  ...tseslint.configs.recommended,

  // eslint.config.js uses CommonJS
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },

  {
    files: ['tests/**/*.ts'],
    plugins: {
      playwright
    },
    rules: {
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/expect-expect': 'warn'
    }
  },

  eslintConfigPrettier
];
