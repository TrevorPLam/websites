import { defineConfig } from 'vitest/config';

/**
 * Integration Shared package Vitest configuration
 * Standalone configuration for integration testing
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
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
});
