import { defineConfig } from 'vitest/config';
import { sharedConfig } from '@repo/vitest-config';

/**
 * UI package specific Vitest configuration
 * Extends shared config with UI-specific settings
 */
export default defineConfig({
  ...sharedConfig,
  test: {
    ...sharedConfig.test,
    // UI-specific test configuration
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'], // React component tests
      ['**/*.test.ts', 'jsdom'],  // TypeScript tests
    ],
  },
});
