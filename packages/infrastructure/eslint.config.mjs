// [Task 2.5.6] ESLint config for @repo/infra — extends shared library rules
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.ts'],
    rules: {
      // Infrastructure code may need console for structured logging internals
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Enforce type safety; use unknown over any for intentional type bypass (e.g. in tests)
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
