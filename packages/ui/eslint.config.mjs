// [Task 2.2.1] ESLint config for @repo/ui — extends shared library rules
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.tsx', '**/*.ts'],
    rules: {
      // Enforce type safety (no any in UI components)
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
