/**
 * @file packages/infra/src/auth/__tests__/tenant-context.test.ts
 * Purpose: Unit tests for tenant context security (Task 0-3).
 * Verifies AsyncLocalStorage scoping, JWT extraction, validation,
 * and that deprecated header-based resolution always returns null.
 */

// tenant-context uses 'server-only' — mocked via jest.config.js moduleNameMapper
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  runWithTenantId,
  getRequestTenantId,
  resolveTenantId,
  extractTenantIdFromJwt,
  isValidTenantId,
  getTenantIdFromSiteId,
  createTenantScopedClient,
  getTenantIdFromHeaders,
} from '../tenant-context';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const ANOTHER_UUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

describe('runWithTenantId / getRequestTenantId', () => {
  it('returns null outside any scope', () => {
    expect(getRequestTenantId()).toBeNull();
  });

  it('provides tenant ID within scope', () => {
    let captured: string | null = null;
    runWithTenantId('tenant-a', () => {
      captured = getRequestTenantId();
    });
    expect(captured).toBe('tenant-a');
  });

  it('restores null after scope exits', () => {
    runWithTenantId('tenant-b', () => {});
    expect(getRequestTenantId()).toBeNull();
  });

  it('supports nested scopes (inner wins)', () => {
    let inner: string | null = null;
    let outer: string | null = null;
    runWithTenantId('outer', () => {
      outer = getRequestTenantId();
      runWithTenantId('inner', () => {
        inner = getRequestTenantId();
      });
    });
    expect(outer).toBe('outer');
    expect(inner).toBe('inner');
  });

  it('returns the callback return value', () => {
    const result = runWithTenantId('t', () => 42);
    expect(result).toBe(42);
  });

  it('is isolated between concurrent async operations', async () => {
    const results: string[] = [];
    await Promise.all([
      new Promise<void>((resolve) => {
        runWithTenantId('tenant-x', async () => {
          // Use vi.useFakeTimers for deterministic timing
          vi.useFakeTimers();
          await vi.advanceTimersByTimeAsync(10);
          results.push(getRequestTenantId() ?? 'null');
          vi.useRealTimers();
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        runWithTenantId('tenant-y', async () => {
          vi.useFakeTimers();
          await vi.advanceTimersByTimeAsync(5);
          results.push(getRequestTenantId() ?? 'null');
          vi.useRealTimers();
          resolve();
        });
      }),
    ]);
    // Each async context gets its own tenant ID
    expect(results).toContain('tenant-x');
    expect(results).toContain('tenant-y');
  });
});

describe('resolveTenantId', () => {
  it('returns siteId fallback when no scope is active', () => {
    expect(resolveTenantId('my-site')).toBe('my-site');
  });

  it("returns 'default' when no scope and no siteId", () => {
    expect(resolveTenantId()).toBe('default');
  });

  it('returns scope tenant ID when set, ignoring siteId', () => {
    let resolved: string | null = null;
    runWithTenantId(VALID_UUID, () => {
      resolved = resolveTenantId('my-site');
    });
    expect(resolved).toBe(VALID_UUID);
  });
});

describe('extractTenantIdFromJwt', () => {
  it('returns null for empty jwt', () => {
    expect(extractTenantIdFromJwt({})).toBeNull();
  });

  it('returns null when tenant_id is missing', () => {
    expect(extractTenantIdFromJwt({ app_metadata: {} })).toBeNull();
  });

  it('returns null for invalid UUID format', () => {
    expect(extractTenantIdFromJwt({ app_metadata: { tenant_id: 'not-a-uuid' } })).toBeNull();
  });

  it('returns validated tenant UUID from jwt', () => {
    expect(extractTenantIdFromJwt({ app_metadata: { tenant_id: VALID_UUID } })).toBe(VALID_UUID);
  });

  it('accepts variant UUID formats (case-insensitive)', () => {
    expect(extractTenantIdFromJwt({ app_metadata: { tenant_id: VALID_UUID.toUpperCase() } })).toBe(
      VALID_UUID.toUpperCase()
    );
  });
});

describe('isValidTenantId', () => {
  it('returns false for null', () => expect(isValidTenantId(null)).toBe(false));
  it('returns false for undefined', () => expect(isValidTenantId(undefined)).toBe(false));
  it('returns false for empty string', () => expect(isValidTenantId('')).toBe(false));
  it('returns false for non-UUID string', () => expect(isValidTenantId('my-site')).toBe(false));
  it('returns false for malformed UUID', () =>
    expect(isValidTenantId('123e4567-e89b-12d3-a456')).toBe(false));
  it('returns true for valid UUID v4', () => expect(isValidTenantId(VALID_UUID)).toBe(true));
  it('returns true for valid UUID v1', () => expect(isValidTenantId(ANOTHER_UUID)).toBe(true));
});

describe('getTenantIdFromSiteId', () => {
  it('returns the siteId as-is', () => {
    expect(getTenantIdFromSiteId('salon-abc')).toBe('salon-abc');
  });
});

describe('createTenantScopedClient', () => {
  it('throws generic error for invalid tenant ID (enumeration prevention)', () => {
    expect(() => createTenantScopedClient('not-a-uuid', 'https://x.supabase.co', 'key')).toThrow(
      'Resource not found'
    );
  });

  it('throws for empty tenant ID', () => {
    expect(() => createTenantScopedClient('', 'https://x.supabase.co', 'key')).toThrow(
      'Resource not found'
    );
  });

  it('returns config with valid UUID tenant', () => {
    const config = createTenantScopedClient(VALID_UUID, 'https://x.supabase.co', 'anon-key');
    expect(config.tenantId).toBe(VALID_UUID);
    expect(config.url).toBe('https://x.supabase.co');
    expect(config.headers).toHaveProperty('apikey', 'anon-key');
  });
});

describe('getTenantIdFromHeaders (deprecated)', () => {
  it('always returns null regardless of header value', () => {
    const headers = new Headers();
    headers.set('x-tenant-id', VALID_UUID);
    expect(getTenantIdFromHeaders(headers)).toBeNull();
  });

  it('returns null for empty headers', () => {
    const headers = new Headers();
    expect(getTenantIdFromHeaders(headers)).toBeNull();
  });
});
