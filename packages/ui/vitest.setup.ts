/**
 * UI package Vitest setup file
 * Local setup to avoid module resolution issues
 */

// Import Vitest globals
import { beforeAll, afterAll, expect, describe, it, vi } from 'vitest';

// Import jest-dom matchers for React Testing Library compatibility
import '@testing-library/jest-dom';

// Import jest-axe for accessibility testing
import { axe } from 'jest-axe';

// Mock the toHaveNoViolations matcher for now
expect.extend({
  toHaveNoViolations: async (received: any) => {
    const results = await axe(received);
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? 'No accessibility violations found'
          : `Found ${results.violations.length} accessibility violations`,
    };
  },
});

// Set critical environment variables BEFORE any module imports
process.env.JWT_SECRET = 'test-secret-for-vitest';
process.env.NODE_ENV = 'test';

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
});

// Export globals for use in test files
export { expect, beforeAll, afterAll, describe, it, vi };
