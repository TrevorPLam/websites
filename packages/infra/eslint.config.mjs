// [Task 2.5.6] ESLint config for @repo/infra — extends shared library rules
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.ts'],
    rules: {
      // Infrastructure code may need console for structured logging internals
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
