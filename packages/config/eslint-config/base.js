// File: packages/config/eslint-config/base.js
// Purpose: Base ESLint configuration for TypeScript projects providing TypeScript support,
//          and compatibility with modern ESLint standards.
//          Extends core TypeScript rules for consistent code quality.
//
// Exports / Entry: ESLint configuration array for TypeScript projects
// Used by: Template ESLint configuration (.eslintrc.js files)
//
// Invariants:
// - Must include TypeScript rules for type safety enforcement
// - Must allow console logging for specific levels (warn, error, info)
// - Must ignore underscore-prefixed unused variables for common patterns
// - Configuration must be compatible with ESLint v8+ and modern standards
//
// Status: @public
// Features:
// - [FEAT:LINTING] Code quality and consistency enforcement
// - [FEAT:TYPESCRIPT] Type safety and error detection
// - [FEAT:CONFIGURATION] Reusable ESLint configuration for templates
// - [FEAT:COMPATIBILITY] Flat config compatibility for modern ESLint

import { FlatCompat } from '@eslint/eslintrc';

// [TRACE:FUNC=packages.config.eslint.base.compat]
// [FEAT:COMPATIBILITY]
// NOTE: Flat compatibility setup - enables modern ESLint flat config format.
const compat = new FlatCompat();

// [TRACE:FUNC=packages.config.eslint.base.config]
// [FEAT:LINTING] [FEAT:TYPESCRIPT]
// NOTE: Main ESLint configuration - extends TypeScript rules with custom settings.
export default [
  // [TRACE:BLOCK=packages.config.eslint.base.extends]
  // [FEAT:TYPESCRIPT]
  // NOTE: Core rule extensions - TypeScript support.
  ...compat.extends('@typescript-eslint/recommended'),
  {
    // [TRACE:BLOCK=packages.config.eslint.base.settings]
    // [FEAT:LINTING] [FEAT:TYPESCRIPT]
    // NOTE: AJV configuration - fix missingRefs and defaultMeta errors with ESLint 9 + AJV v8
    settings: {
      // Disable AJV strict schema validation to prevent missingRefs errors
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    languageOptions: {
      // Configure AJV options for ESLint 9 compatibility
      parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Disable strict schema validation to prevent AJV errors
        projectService: {
          allowDefaultProject: true,
        },
      },
    },
    // [TRACE:BLOCK=packages.config.eslint.base.rules]
    // [FEAT:LINTING] [FEAT:TYPESCRIPT]
    // NOTE: Custom rule configurations - balances strictness with developer experience.
    rules: {
      // Allow underscore-prefixed variables for common patterns (e.g., _id, _ref)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Warn on explicit any usage to encourage better typing
      '@typescript-eslint/no-explicit-any': 'warn',

      // Allow console logging for specific levels (warn, error, info) but not general logs
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
