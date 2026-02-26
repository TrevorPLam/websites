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
        isolate: true,
      },
    },
    // Improved flaky test detection
    retry: process.env.CI ? 2 : 0,
    sequence: {
      concurrent: true,
      shuffle: process.env.NODE_ENV === 'development',
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
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
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
export {
  createMockFn,
  createMockModule,
  mockNextHeaders,
  mockNextCookies,
  mockNextCache,
} from './mocks';
export { withEnv, createEnvTest } from './env-helpers';

export default defineConfig(sharedConfig);
