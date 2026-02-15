/**
 * File: knip.config.ts  [TRACE:FILE=knip.config]
 * Purpose: Knip configuration for marketing-websites monorepo — dead code,
 *          unused exports, and dependency detection. Would have detected
 *          duplicate cn(), broken export paths, and version drift.
 *
 * Task: 0.17 Add knip for Dead Code/Dependency Detection
 * Status: @complete | See docs/tooling/knip.md for usage
 *
 * Invariants:
 * - Workspaces auto-detected from pnpm-workspace.yaml
 * - ignoreDependencies: tooling used by config loaders (eslint, jest)
 * - ignoreExportsUsedInFile: interfaces/types used only in-file
 *
 * @see https://knip.dev/reference/configuration
 * @see https://knip.dev/features/monorepos-and-workspaces
 */
export default {
  // Workspaces: Auto-detected from pnpm-workspace.yaml
  // Root workspace: Scripts and config files
  workspaces: {
    '.': {
      entry: ['scripts/**/*.{ts,js}', '*.config.{ts,js}'],
      project: ['**/*.{ts,tsx,js,jsx,mjs}', '!node_modules/**'],
    },
  },

  // Monorepo-wide rules
  rules: {
    // Class members and types used for reflection/DTOs — allow unused exports
    classMembers: 'warn',
    types: 'warn',
  },

  // Ignore known patterns
  ignoreDependencies: [
    // Build tooling and config — used by tooling, not imports
    'eslint',
    'eslint-config-next',
    '@eslint/eslintrc',
    // Jest/Testing — used by test runner
    '@testing-library/react',
    '@testing-library/user-event',
    'jest-environment-jsdom',
    // Type-only or peer-like
    '@types/react-dom',
    'zod', // Used in infra env schemas (dynamic import)
  ],

  ignoreIssues: {
    // Entry/config files that export for tooling consumption
    '**/tailwind-preset.js': ['exports'],
    '**/jest.config.*': ['exports'],
    '**/*.config.{js,mjs,ts}': ['exports'],
  },

  ignoreFiles: [
    // Config files not part of app bundle
    '**/tailwind-preset.js',
    '**/.eslintrc*',
    '**/jest.setup.*',
  ],

  // Public API exports — intentionally exported for consumers
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },

  // JSDoc @type {import('tailwindcss').Config} in tailwind-preset.js — type-only, not runtime
  ignoreUnresolved: ['tailwindcss'],
};
