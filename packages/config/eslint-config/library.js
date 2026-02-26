// File: packages/config/eslint-config/next.js  [TRACE:FILE=packages.config.eslint.next]
// Purpose: ESLint configuration for Next.js projects providing TypeScript support,
//          Next.js specific rules, and compatibility with modern ESLint standards.
//          Extends core web vitals and TypeScript rules for consistent code quality.
//
// Exports / Entry: ESLint configuration array for Next.js projects
// Used by: Template ESLint configuration (.eslintrc.js files)
//
// Invariants:
// - Must extend Next.js core web vitals for performance optimization
// - Must include TypeScript rules for type safety enforcement
// - Must allow console logging for specific levels (warn, error, info)
// - Must ignore underscore-prefixed unused variables for common patterns
// - Configuration must be compatible with ESLint v8+ and Next.js standards
//
// Status: @public
// Features:
// - [FEAT:LINTING] Code quality and consistency enforcement
// - [FEAT:TYPESCRIPT] Type safety and error detection
// - [FEAT:NEXTJS] Next.js specific optimizations and best practices
// - [FEAT:CONFIGURATION] Reusable ESLint configuration for templates
// - [FEAT:COMPATIBILITY] Flat config compatibility for modern ESLint

import { FlatCompat } from '@eslint/eslintrc';
import { boundaryRules } from './boundaries.js';

// [TRACE:FUNC=packages.config.eslint.next.compat]
// [FEAT:COMPATIBILITY]
// NOTE: Flat compatibility setup - enables modern ESLint flat config format.
const compat = new FlatCompat();

// [TRACE:FUNC=packages.config.eslint.next.config]
// [FEAT:LINTING] [FEAT:TYPESCRIPT] [FEAT:NEXTJS]
// NOTE: Main ESLint configuration - extends Next.js and TypeScript rules with custom settings.
export default [
  // [TRACE:BLOCK=packages.config.eslint.next.extends]
  // [FEAT:NEXTJS] [FEAT:TYPESCRIPT]
  // NOTE: Core rule extensions - Next.js performance and TypeScript support.
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // [TRACE:BLOCK=packages.config.eslint.next.rules]
    // [FEAT:LINTING] [FEAT:TYPESCRIPT]
    // NOTE: Custom rule configurations - balances strictness with developer experience.
    rules: {
      // Allow underscore-prefixed variables for common patterns (e.g., _id, _ref)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Warn on explicit any usage to encourage better typing
      '@typescript-eslint/no-explicit-any': 'warn',

      // Allow console logging for specific levels (warn, error, info) but not general logs
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // [Task 0.11] Monorepo boundary enforcement — block deep imports and cross-package relative paths
      ...boundaryRules,
    },
  },
];
