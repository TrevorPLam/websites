// File: packages/config/eslint-config/boundaries.js  [TRACE:FILE=packages.config.eslint.boundaries]
// Purpose: Enforces monorepo module boundaries via no-restricted-imports. Prevents deep internal
//          imports (@repo/*/src/*), cross-client imports, and package-to-template dependencies.
//          Also warns when integration-specific types leak into @repo/features (task evol-1).
//
// Exports / Entry: boundaryRules, integrationBoundaryRules
// Used by: All workspace packages and templates via @repo/eslint-config
//
// Invariants:
// - Must block @repo/*/src/* (deep internal paths)                    [ERROR]
// - Must block relative imports that escape package boundaries         [ERROR]
// - Must block cross-client imports (@clients/* and @repo/clients-*)   [ERROR]
// - Must warn when @repo/integrations-* types leak into @repo/features [WARN]
// - Aligned with docs/architecture/module-boundaries.md
//
// Status: @public
// Related Tasks: 0.11, evol-1
// Last Updated: 2026-02-20

/**
 * ESLint no-restricted-imports configuration for monorepo boundary enforcement (error-level).
 * Blocks imports that bypass package public APIs or violate the dependency matrix.
 *
 * Rules:
 * 1. No deep internal imports — always use public package API
 * 2. No relative paths escaping package boundaries — use @repo/* aliases
 * 3. No cross-client imports — clients must be fully isolated
 *
 * @see docs/architecture/module-boundaries.md
 */
export const boundaryRules = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        // Rule 1: No deep internal imports — always use public package API
        {
          group: ['@repo/*/src', '@repo/*/src/*', '@repo/*/src/**'],
          message:
            'Use package public API (e.g. @repo/ui, @repo/utils) instead of deep /src/ imports. See docs/architecture/module-boundaries.md.',
        },
        // Rule 2: No relative paths escaping package boundaries
        {
          group: ['**/packages/**', '**/templates/**'],
          message:
            'Use @repo/* workspace packages instead of relative paths across package boundaries. See docs/architecture/module-boundaries.md.',
        },
        // Rule 3: No cross-client imports — each client is an isolated deployment unit
        {
          group: ['@clients/*', '@repo/clients-*'],
          message:
            'Cross-client imports are forbidden. Each client must be isolated. If you need shared code, move it to an @repo/* package. See docs/architecture/module-boundaries.md.',
        },
      ],
    },
  ],
};

/**
 * Integration type boundary rules (warn-level).
 * Warns when @repo/integrations-* types are imported directly into @repo/features.
 * Features should use canonical types from @repo/types instead.
 *
 * Usage: Add to the features package ESLint config alongside boundaryRules.
 *
 * @example
 * // packages/features/eslint.config.mjs
 * import { boundaryRules, integrationBoundaryRules } from '@repo/eslint-config/boundaries.js';
 */
export const integrationBoundaryRules = {
  'no-restricted-imports': [
    'warn',
    {
      patterns: [
        // Warn: integration types leaking into features — use @repo/types canonical types
        {
          group: ['@repo/integrations-*', '@repo/integrations-*/src', '@repo/integrations-*/src/*'],
          message:
            'Use canonical types from @repo/types instead of importing integration-specific types into @repo/features. ' +
            'Integration types couple features to external providers. See docs/architecture/module-boundaries.md.',
        },
      ],
    },
  ],
};
