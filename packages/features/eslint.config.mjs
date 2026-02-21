// [TRACE:FILE=packages.features.eslint-config]
// Purpose: Extend shared ESLint rules for feature modules.
//          Adds integration-type boundary warnings (evol-1) — features must use
//          canonical @repo/types instead of importing integration-specific types directly.
//          See docs/architecture/module-boundaries.md and ADR-012.
import config from '@repo/eslint-config';
import { integrationBoundaryRules } from '@repo/eslint-config/boundaries';

export default [
  ...config,
  // evol-1: Warn when integration-specific types leak into feature modules.
  // Features should use canonical types from @repo/types (e.g. CanonicalLead)
  // rather than importing directly from @repo/integrations-* packages.
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...integrationBoundaryRules,
    },
  },
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
