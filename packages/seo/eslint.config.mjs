import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  ...compat.extends('@repo/eslint-config/base.js'),
  {
    // Disable AJV strict schema validation to prevent missingRefs errors
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: true,
        },
      },
    },
    languageOptions: {
      parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // SEO-specific rules can go here
    },
  },
];
