import js from '@eslint/js';
import { boundaryRules } from './boundaries.js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      ...boundaryRules,
    },
  },
];
