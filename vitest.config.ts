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
    projects: [
      // Node environment: Server code, utilities, infra, integrations
      {
        test: {
          environment: 'node',
          include: [
            'packages/utils/**/*.test.ts',
            'packages/types/**/*.test.ts',
            'packages/infra/**/__tests__/**/*.test.ts',
            'packages/features/**/lib/**/*.test.ts',
            'packages/integrations/**/__tests__/**/*.test.ts',
            'packages/industry-schemas/**/*.test.ts',
            'packages/page-templates/**/*.test.ts',
            'tooling/validation/**/*.test.ts',
          ],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/*.config.*',
            'packages/infra/composition/**', // React HOC tests run in jsdom
          ],
          setupFiles: ['./packages/config/vitest-config/src/setup.ts'],
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
            'packages/infra/composition/**/*.test.ts',
          ],
          exclude: ['**/node_modules/**', '**/dist/**', '**/*.config.*'],
          setupFiles: ['./packages/config/vitest-config/src/setup.ts'],
        },
      },
    ],
    // Global test patterns
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.config.*', '**/coverage/**'],
  },
});
