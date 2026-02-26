import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import { boundaryRules } from './boundaries.js';

export default [
  // Base JavaScript rules
  js.configs.recommended,
  // TypeScript configuration
  ...tseslint.configs.recommended,
  // Base configuration for all files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      'no-console': 'off',
      // Boundary rules for monorepo architecture
      ...boundaryRules,
      // React hooks rules (off by default)
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      // Complexity and size thresholds
      complexity: ['warn', { max: 15 }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      // Accessibility rules
      ...jsxA11y.configs.recommended.rules,
    },
  },
];
