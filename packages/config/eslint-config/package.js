// [Task 2.2.1] Shared ESLint config for packages with similar patterns
import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Common rules for most packages
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
