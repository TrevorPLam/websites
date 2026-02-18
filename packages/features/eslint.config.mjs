// [TRACE:FILE=packages.features.eslint-config]
// Purpose: Extend shared ESLint rules for feature modules scaffold.
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
