/**
 * @file tests/integration/tenant-isolation.spec.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { describe, expect, it } from 'vitest';

import { createTenantId } from '../../packages/core/value-objects/TenantId';

describe('tenant isolation contracts', () => {
  it('accepts valid tenant UUIDs for context propagation', () => {
    const result = createTenantId('6af30f12-a0f5-4ce8-b8bc-f236f0dd3719');
    expect(result.ok).toBe(true);
  });

  it('rejects non-UUID tenant identifiers', () => {
    const result = createTenantId('tenant-acme');
    expect(result.ok).toBe(false);
  });
});
