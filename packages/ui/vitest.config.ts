import { defineConfig } from 'vitest/config';

/**
 * UI package specific Vitest configuration
 * Standalone configuration to avoid module resolution issues
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
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
