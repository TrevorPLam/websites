/**
 * @file packages/config/vitest-config/src/index.ts
 * @summary Shared Vitest configuration for all packages in the monorepo.
 * @description Follows 2026 best practices for performance and maintainability.
 * @security No security concerns; configuration file only.
 * @adr none
 * @requirements CONFIG-TEST-001, vitest-config
 */

import { defineConfig } from 'vitest/config';

/**
 * Shared Vitest configuration for all packages in the monorepo
 * Follows 2026 best practices for performance and maintainability
 */

export const sharedConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup.ts'],
    // 2026 optimization: Pool configuration for parallel test execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 2,
        maxThreads: 4,
        isolate: false, // Fixed: Match top-level isolate setting
      },
    },
    // Improved flaky test detection - reduced to force fixes
    retry: process.env.CI ? 1 : 0,
    sequence: {
      concurrent: true,
      shuffle:
        process.env.NODE_ENV === 'development' || process.env.CI
          ? true
          : { files: false, tests: false },
    },
    // Enhanced coverage with 2026 standards
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
        '**/types/**',
      ],
      thresholds: {
        global: {
          branches: 20, // Phase 1: Start with 20% coverage
          functions: 20,
          lines: 20,
          statements: 20,
        },
      },
      // 2026: All files coverage reporting
      all: true,
      clean: true,
      cleanOnRerun: true,
    },
    // Performance optimizations
    logHeapUsage: process.env.NODE_ENV === 'development',
    isolate: false,
    passWithNoTests: false,
    // 2026: Test timeout configuration
    testTimeout: process.env.CI ? 30000 : 10000,
    hookTimeout: 10000,
  },
};

export const nodeConfig = {
  test: {
    ...sharedConfig.test,
    environment: 'node',
  },
};

export const jsdomConfig = {
  test: {
    ...sharedConfig.test,
    environment: 'jsdom',
  },
};

// Re-export utilities for easy access
export { createEnvTest, withEnv } from './env-helpers';
export {
  createMockFn,
  createMockModule,
  mockNextCache,
  mockNextCookies,
  mockNextHeaders,
} from './mocks';

export default defineConfig(sharedConfig);
