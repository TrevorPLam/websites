// ESLint config for the hair salon template — extends shared Next.js rules
import config from '@repo/eslint-config/next';

export default [
  ...config,
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
