import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const typeUnsafeRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
};

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      '.vercel/**',
      'node_modules/**',
      'coverage/**',
      'out/**',
      '.typescript-build-info',
      'next-env.d.ts',
      'scripts/**',
      '.repo/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir,
      },
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Type Safety: Block unsafe type usage (Issue #001, #002, #003)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      // React Safety: Block array index keys (Issue #024)
      'react/no-array-index-key': 'error',
    },
  },
  {
    files: [
      '__tests__/**/*.{ts,tsx,js,jsx}',
      '**/*.test.{ts,tsx,js,jsx}',
      'vitest.setup.tsx',
    ],
    rules: {
      ...typeUnsafeRules,
    },
  },
  {
    files: [
      'next.config.mjs',
      'sentry.client.config.ts',
      'sentry.edge.config.ts',
      'sentry.server.config.ts',
      'playwright.config.ts',
      'vitest.config.ts',
    ],
    rules: {
      ...typeUnsafeRules,
    },
  },
);
