/**
 * Environment Variable Testing Helpers
 * Provides utilities for testing with environment variables in Vitest
 */

import { afterEach, beforeEach } from 'vitest';

/**
 * Runs a function with temporary environment variables
 * Automatically restores original environment after execution
 */
export const withEnv = <T>(env: Record<string, string | undefined>, fn: () => T): T => {
  const originalEnv = process.env;
  try {
    process.env = { ...originalEnv, ...env };
    return fn();
  } finally {
    process.env = originalEnv;
  }
};

/**
 * Creates a test helper for environment variable testing
 */
export const createEnvTest = (
  _testName: string,
  env: Record<string, string | undefined>,
  testFn: () => void
) => {
  return () => {
    withEnv(env, testFn);
  };
};

/**
 * Mocks process.env for testing
 */
export const mockProcessEnv = (env: Record<string, string | undefined>) => {
  const originalEnv = process.env;
  process.env = { ...originalEnv, ...env };

  return {
    restore: () => {
      process.env = originalEnv;
    },
  };
};

/**
 * Creates a beforeEach/afterEach pair for environment testing
 * Fixed: Use afterEach instead of afterAll to prevent env pollution between tests
 */
export const setupEnvTests = (env: Record<string, string | undefined>) => {
  let originalEnv: typeof process.env;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, ...env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });
};
