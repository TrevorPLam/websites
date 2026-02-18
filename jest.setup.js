/**
 * @file jest.setup.js
 * @role test
 * @summary Global Jest setup for matchers and console noise suppression.
 *
 * @entrypoints
 * - Loaded via jest.config.js setupFilesAfterEnv
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - External: @testing-library/jest-dom
 *
 * @used_by
 * - All Jest test suites
 *
 * @runtime
 * - environment: test
 * - side_effects: overrides console.warn/error during tests
 *
 * @data_flow
 * - inputs: console messages from tests
 * - outputs: suppressed or forwarded logs
 *
 * @invariants
 * - Overrides must be restored in afterAll
 *
 * @gotchas
 * - Filtering by string match may hide unexpected warnings
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Consider narrowing filters or surfacing suppressed messages in debug mode
 *
 * @verification
 * - Run: pnpm test and confirm known warnings are suppressed
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

require('@testing-library/jest-dom');
const { toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

// jsdom does not provide ResizeObserver (required by Radix Slider and similar components)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Suppress console output in tests (unless test explicitly checks for it)
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
