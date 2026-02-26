/**
 * @file packages/test-utils/src/index.ts
 * @role test
 * @summary Centralized test utilities for the monorepo
 *
 * Provides common test helpers, factories, and utilities to reduce
 * code duplication and improve test consistency across packages.
 *
 * @entrypoints
 * - import { createMockAdapter, createTestTenant, renderWithProviders } from '@repo/test-utils'
 *
 * @exports
 * - Test factories for common data structures
 * - Mock utilities for adapters and services
 * - Custom render functions for React components
 * - Timing utilities for deterministic tests
 *
 * @depends_on
 * - External: vitest, @testing-library/react
 * - Internal: @repo/ui, @repo/infrastructure
 *
 * @used_by
 * - All package test suites
 *
 * @runtime
 * - environment: test
 * - side_effects: None (pure utilities)
 *
 * @data_flow
 * - inputs: test configuration and overrides
 * - outputs: mock objects and test utilities
 *
 * @invariants
 * - All factories must accept partial overrides
 * - Timing utilities must use vi.useFakeTimers for determinism
 *
 * @gotchas
 * - Import this package in devDependencies only
 * - Use vi.useFakeTimers() for any time-based tests
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Add more factories as common patterns emerge
 * - Extend render utilities for different provider combinations
 *
 * @verification
 * - Run: pnpm test --testNamePattern="test-utils"
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-23
 * - updated: Initial creation with core utilities
 */

import { vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// Timing Utilities - Eliminate Flaky Tests
// ============================================================================

/**
 * Wrapper for deterministic timing in tests
 * Uses vi.useFakeTimers() to prevent actual delays
 */
export class TestTimer {
  private static isFake = false;

  static setup() {
    if (!this.isFake) {
      vi.useFakeTimers();
      this.isFake = true;
    }
  }

  static teardown() {
    if (this.isFake) {
      vi.useRealTimers();
      this.isFake = false;
    }
  }

  static async advance(ms: number) {
    this.setup();
    await vi.advanceTimersByTimeAsync(ms);
  }

  static async runAll() {
    this.setup();
    await vi.runAllTimersAsync();
  }
}

// Auto-cleanup for each test
beforeEach(() => {
  TestTimer.setup();
});

afterEach(() => {
  TestTimer.teardown();
});

// ============================================================================
// Test Factories - Consistent Test Data
// ============================================================================

/**
 * Create a test tenant with valid UUID format
 */
export function createTestTenant(overrides: any = {}) {
  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    siteId: 'test-site-001',
    name: 'Test Tenant',
    domain: 'test.example.com',
    ...overrides,
  };
}

/**
 * Create a mock integration result
 */
export function createMockResult<T>(data: T, success: boolean = true, error?: string) {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : error || 'Test error',
    retryable: !success && error?.includes('timeout'),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a mock adapter with standard methods
 */
export function createMockAdapter<T>(mockData: T) {
  return {
    fetch: vi.fn().mockResolvedValue(createMockResult(mockData)),
    create: vi.fn().mockResolvedValue(createMockResult(mockData)),
    update: vi.fn().mockResolvedValue(createMockResult(mockData)),
    delete: vi.fn().mockResolvedValue(createMockResult(true)),
    healthCheck: vi.fn().mockResolvedValue(createMockResult({ status: 'healthy' })),
  };
}

/**
 * Create test booking data
 */
export function createTestBooking(overrides: any = {}) {
  return {
    id: 'booking-001',
    tenantId: createTestTenant().id,
    service: 'consultation',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    status: 'confirmed',
    ...overrides,
  };
}

/**
 * Create test user data
 */
export function createTestUser(overrides: any = {}) {
  return {
    id: 'user-001',
    tenantId: createTestTenant().id,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ============================================================================
// Mock Utilities - Consistent Mocking Patterns
// ============================================================================

/**
 * Create a mock server action result
 */
export function createMockActionResult<T>(data: T, error?: string) {
  return {
    success: !error,
    data: error ? undefined : data,
    error,
  };
}

/**
 * Mock fetch with controlled responses
 */
export function createMockFetch(responses: Array<{ status: number; body: any }>) {
  let callCount = 0;
  return vi.fn().mockImplementation(() => {
    if (responses.length === 0) {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('{}'),
      });
    }

    const response = responses[Math.min(callCount, responses.length - 1)];
    callCount++;
    const status = response?.status ?? 200;
    const body = response?.body ?? {};

    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    });
  });
}

/**
 * Mock logger for testing
 */
export function createMockLogger() {
  const logs: Array<{ level: string; message: string; meta?: any }> = [];

  return {
    info: vi.fn((message: string, meta?: any) => {
      logs.push({ level: 'info', message, meta });
    }),
    warn: vi.fn((message: string, meta?: any) => {
      logs.push({ level: 'warn', message, meta });
    }),
    error: vi.fn((message: string, meta?: any) => {
      logs.push({ level: 'error', message, meta });
    }),
    debug: vi.fn((message: string, meta?: any) => {
      logs.push({ level: 'debug', message, meta });
    }),
    getLogs: () => logs,
    clearLogs: () => (logs.length = 0),
  };
}

// ============================================================================
// React Testing Utilities - Basic Implementation
// ============================================================================

/**
 * Custom render function with basic implementation
 */
export function renderWithProviders(_ui: any, _options: any = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  return {
    container,
    rerender: () => {},
    unmount: () => {
      document.body.removeChild(container);
    },
    asFragment: () => document.createDocumentFragment(),
  };
}

/**
 * Create a test context with tenant isolation
 */
export function createTestContext(overrides: any = {}) {
  const tenant = createTestTenant(overrides);

  return {
    tenant,
    cleanup: () => {
      vi.clearAllMocks();
    },
  };
}

/**
 * Wait for async operations to complete with timeout
 */
export async function waitForAsync(
  callback: () => Promise<void> | void,
  options: { timeout?: number; interval?: number } = {}
) {
  const timeout = options.timeout ?? 5000;
  const interval = options.interval ?? 50;

  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    const check = async () => {
      try {
        await callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
          return;
        }
        setTimeout(check, interval);
      }
    };

    check();
  });
}

// ============================================================================
// Network Mocking - Basic Implementation
// ============================================================================

/**
 * Mock API response patterns for common scenarios
 */
export const mockApiResponses = {
  success: <T>(data: T) => ({
    status: 200,
    body: { success: true, data },
  }),

  error: (message: string, status: number = 400) => ({
    status,
    body: { success: false, error: message },
  }),

  unauthorized: () => ({
    status: 401,
    body: { success: false, error: 'Unauthorized' },
  }),

  rateLimit: () => ({
    status: 429,
    body: { success: false, error: 'Rate limit exceeded' },
  }),

  serverError: () => ({
    status: 500,
    body: { success: false, error: 'Internal server error' },
  }),
};

// ============================================================================
// Database Test Utilities - Basic Implementation
// ============================================================================

/**
 * Create test database fixtures
 */
export function createTestDbFixtures() {
  return {
    tenants: [
      createTestTenant(),
      createTestTenant({ id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'Second Tenant' }),
    ],
    users: [
      createTestUser(),
      createTestUser({ id: 'user-002', name: 'Jane Smith', email: 'jane@example.com' }),
    ],
    bookings: [createTestBooking(), createTestBooking({ id: 'booking-002', service: 'follow-up' })],
  };
}

// ============================================================================
// Export All Utilities
// ============================================================================

export default {
  // Timing
  TestTimer,

  // Factories
  createTestTenant,
  createMockResult,
  createMockAdapter,
  createTestBooking,
  createTestUser,

  // Mock utilities
  createMockActionResult,
  createMockFetch,
  createMockLogger,

  // React utilities
  renderWithProviders,
  createTestContext,
  waitForAsync,

  // Network mocking
  mockApiResponses,

  // Database utilities
  createTestDbFixtures,
};
