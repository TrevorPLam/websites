/**
 * @file steiger.config.ts
 * @summary Steiger FSD rule configuration for monorepo layer and public API boundaries.
 * @description Sets include/exclude globs and strict FSD validation defaults for CI/local linting.
 * @security Architectural guardrails reduce accidental cross-layer coupling and unsafe imports.
 * @adr none
 * @requirements Wave-0 Task-1 (Steiger FSD enforcement)
 */

import { defineConfig } from 'steiger';

export default defineConfig({
  projectRoot: '.',
  include: ['packages/**/*.ts', 'packages/**/*.tsx', 'clients/**/*.ts', 'clients/**/*.tsx'],
  exclude: ['**/*.config.*', '**/node_modules/**', '**/.next/**', '**/dist/**'],
  rules: {
    // Domain-3 architectural baseline rules
    'fsd/layer-imports': 'error',
    'fsd/public-api': 'error',
    'fsd/no-cross-slice-direct-import': 'error',
    'fsd/no-segmentless-slices': 'warn',
  },
});
