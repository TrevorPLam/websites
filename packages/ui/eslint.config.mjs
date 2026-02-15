// [Task 2.2.1] ESLint config for @repo/ui — extends shared library rules
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.tsx', '**/*.ts'],
    rules: {
      // UI components may use explicit any for flexible prop forwarding
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
