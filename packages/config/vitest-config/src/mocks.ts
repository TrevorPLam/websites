/**
 * Vitest Mock Utilities
 * Provides standardized mock patterns for migrating from Jest to Vitest
 */

import { vi } from 'vitest';

/**
 * Creates a mock function with optional implementation
 */
export const createMockFn = <T extends (...args: any[]) => any>(implementation?: T) => {
  return vi.fn(implementation);
};

/**
 * Creates a mock module with implementation
 */
export const createMockModule = <T extends Record<string, any>>(
  moduleName: string,
  mockImplementation: T
) => {
  vi.mock(moduleName, () => mockImplementation);
  return mockImplementation;
};

/**
 * Resets all mocks and modules
 */
export const resetAllMocks = () => {
  vi.clearAllMocks();
  vi.resetModules();
};

/**
 * Isolates modules for testing - alternative to jest.isolateModules
 */
export const isolateModules = (fn: () => void | Promise<void>) => {
  // Clear module cache and run function
  vi.resetModules();
  return fn();
};

/**
 * Creates a mock object with predefined methods
 */
export const createMockObject = <T extends Record<string, any>>(methods: Partial<T>): T => {
  const mock = {} as T;
  for (const [key, value] of Object.entries(methods)) {
    (mock as any)[key] = typeof value === 'function' ? vi.fn(value) : value;
  }
  return mock;
};

/**
 * Mocks global fetch with implementation
 */
export const mockFetch = (implementation: any) => {
  const mockFn = vi.fn(implementation);
  global.fetch = mockFn;
  return mockFn;
};

/**
 * Creates a mock for Next.js headers
 */
export const createMockHeaders = () => {
  return createMockObject({
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
    delete: vi.fn(),
    entries: vi.fn(),
  });
};

/**
 * Creates a mock for Next.js cookies
 */
export const createMockCookies = () => {
  return createMockObject({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
  });
};

/**
 * Mocks Next.js headers module
 */
export const mockNextHeaders = () => {
  const mockHeaders = createMockHeaders();
  vi.mock('next/headers', () => ({
    headers: vi.fn(() => mockHeaders),
  }));
  return mockHeaders;
};

/**
 * Mocks Next.js cookies module
 */
export const mockNextCookies = () => {
  const mockCookies = createMockCookies();
  vi.mock('next/headers', () => ({
    cookies: vi.fn(() => mockCookies),
  }));
  return mockCookies;
};

/**
 * Mocks Next.js cache
 */
export const mockNextCache = () => {
  vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  }));
};
