/**
 * @file packages/config/vitest-config/src/setup.ts
 * @summary Shared Vitest setup including matcher wiring and unhandled rejection guards.
 * @security Test-only behavior; does not expose runtime secrets.
 * @requirements PROD-TEST-002
 */

/**
 * Global Vitest setup file
 * Replaces jest.setup.js with modern Vitest equivalents
 */

// Import Vitest globals
import { beforeAll, afterAll, expect, describe, it, vi } from 'vitest';

// Import jest-dom matchers for React Testing Library compatibility
import '@testing-library/jest-dom';

// Import jest-axe for accessibility testing
import { toHaveNoViolations } from 'jest-axe';

// Extend Vitest's expect with jest-axe matchers
expect.extend({ toHaveNoViolations } as any);

// Set critical environment variables BEFORE any module imports
process.env.NODE_ENV = 'test';

function failOnUnhandledRejection(reason: unknown) {
  throw reason instanceof Error ? reason : new Error(String(reason));
}

process.on('unhandledRejection', failOnUnhandledRejection);

// Mock server-only module for tests
vi.mock('server-only', () => ({}));

// Mock ResizeObserver for jsdom environment (required by Radix components)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Suppress console output in tests unless explicitly checking for it
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  process.off('unhandledRejection', failOnUnhandledRejection);
});

// Export globals for use in test files
export { expect, beforeAll, afterAll, describe, it, vi };
