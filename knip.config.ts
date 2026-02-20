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
 * - Root + scoped workspace coverage for packages/clients/tooling
 * - ignoreDependencies: tooling used by config loaders (eslint, jest)
 * - ignoreExportsUsedInFile: interfaces/types used only in-file
 *
 * @see https://knip.dev/reference/configuration
 * @see https://knip.dev/features/monorepos-and-workspaces
 */
export default {
  // Workspaces: Explicit roots reduce false positives in large monorepos
  workspaces: {
    '.': {
      entry: [
        'scripts/**/*.{ts,js}',
        'tooling/**/src/**/*.{ts,tsx,js,jsx,mjs}',
        '*.config.{ts,js,mjs}',
        'eslint.config.mjs',
      ],
      project: ['**/*.{ts,tsx,js,jsx,mjs}', '!**/node_modules/**'],
    },
    'packages/*': {
      entry: ['src/index.ts', 'src/index.tsx', 'eslint.config.mjs'],
      project: ['src/**/*.{ts,tsx,js,jsx,mjs}'],
    },
    'packages/**': {
      entry: ['src/index.ts', 'src/index.tsx', 'eslint.config.mjs'],
      project: ['src/**/*.{ts,tsx,js,jsx,mjs}'],
    },
    'clients/*': {
      entry: ['app/**/*.{ts,tsx}', 'site.config.ts', 'next.config.{js,mjs,ts}'],
      project: ['**/*.{ts,tsx,js,jsx,mjs}'],
    },
    'tooling/*': {
      entry: ['src/**/*.{ts,tsx,js,jsx,mjs}'],
      project: ['src/**/*.{ts,tsx,js,jsx,mjs}'],
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
    // Config files and documentation templates not part of app bundle
    '**/tailwind-preset.js',
    'docs/templates/**',
  ],

  // Public API exports — intentionally exported for consumers
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },

  // JSDoc @type {import('tailwindcss').Config} in tailwind-preset.js — type-only, not runtime
  ignoreUnresolved: ['tailwindcss'],
};
