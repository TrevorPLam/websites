/**
 * @file packages/ui/vitest.setup.ts
 * @summary Vitest configuration setup for UI package testing with React Testing Library.
 * @description Configures test environment, globals, and matchers for consistent testing.
 * @security No security concerns - test configuration file.
 * @adr none
 * @requirements DOMAIN-3-1
 */

/**
 * UI package Vitest setup file
 * Local setup to avoid module resolution issues
 */

// Import Vitest globals
import { beforeAll, afterAll, expect, describe, it, vi } from 'vitest';

// Import jest-dom matchers for React Testing Library compatibility
import '@testing-library/jest-dom';

// Set critical environment variables BEFORE any module imports
process.env.JWT_SECRET = 'test-secret';
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
