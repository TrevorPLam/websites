/**
 * @file vitest.config.ts
 * @summary Root Vitest configuration with resilient timeout and timer defaults.
 * @security Test-only configuration; no secrets are read or emitted.
 * @requirements PROD-TEST-001
 */

import { defineConfig } from 'vitest/config';

/**
 * Root Vitest configuration for the monorepo
 * Uses Projects feature for multi-environment testing
 * Follows 2026 best practices for performance and maintainability
 */

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./packages/config/vitest-config/src/setup.ts'],
    pool: 'threads',
    isolate: true, // Isolate tests for better reliability
    bail: 1, // Stop on first failure in CI
    retry: process.env.CI ? 1 : 0, // Retry once in CI for flaky tests
    fakeTimers: {
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
      shouldClearNativeTimers: true,
    },
    testTimeout: 15000, // 15 second timeout per test
    hookTimeout: 15000, // 15 second timeout for hooks
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.*',
        '**/*.test.*',
        '**/__tests__/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/index.ts',
        '**/index.tsx',
      ],
      thresholds: {
        global: {
          branches: 35,
          functions: 35,
          lines: 35,
          statements: 35,
        },
      },
      cleanOnRerun: true,
      clean: true,
    },
    projects: [
      // Node environment: Server code, utilities, infrastructure, integrations
      {
        test: {
          environment: 'node',
          include: [
            'packages/utils/**/*.test.ts',
            'packages/types/**/*.test.ts',
            'packages/infrastructure/**/__tests__/**/*.test.ts',
            'packages/features/**/lib/**/*.test.ts',
            'packages/integrations/**/__tests__/**/*.test.ts',
            'packages/industry-schemas/**/*.test.ts',
            'packages/page-templates/**/*.test.ts',
            'packages/feature-flags/**/*.test.ts',
            'tooling/validation/**/*.test.ts',
          ],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.config.*',
            'packages/infrastructure/composition/**', // React HOC tests run in jsdom
            '**/coverage/**',
          ],
          setupFiles: ['./packages/config/vitest-config/src/setup.ts'],
          globals: true,
          isolate: true,
        },
      },
      // jsdom environment: React components, UI library
      {
        test: {
          environment: 'jsdom',
          include: [
            'packages/ui/**/*.test.ts',
            'packages/ui/**/*.test.tsx',
            'packages/features/**/components/**/*.test.ts',
            'packages/features/**/components/**/*.test.tsx',
            'packages/marketing-components/**/*.test.ts',
            'packages/marketing-components/**/*.test.tsx',
            'packages/infrastructure/ui/**/*.test.ts',
            'packages/infrastructure/layout/**/*.test.ts',
            'packages/infrastructure/composition/**/*.test.ts',
          ],
          exclude: ['**/node_modules/**', '**/dist/**', '**/*.config.*', '**/coverage/**'],
          setupFiles: ['./packages/config/vitest-config/src/setup.ts'],
          globals: true,
          isolate: true,
          testTimeout: 15000, // Longer timeout for DOM tests
        },
      },
    ],
    // Global test patterns
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.config.*', '**/coverage/**'],
  },
});
