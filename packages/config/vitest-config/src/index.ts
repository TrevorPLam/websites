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
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.*',
        '**/*.test.*',
        '**/__tests__/**',
      ],
      thresholds: {
        global: {
          branches: 20,
          functions: 10,
          lines: 14,
          statements: 14,
        },
      },
    },
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
export * from './mocks';
export * from './env-helpers';

export default defineConfig(sharedConfig);
