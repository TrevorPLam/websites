/**
 * @file packages/core/value-objects/TenantId.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { err, ok, type Result } from '../shared/Result';

export type TenantId = string & { readonly __brand: 'TenantId' };

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * export function createTenantId(value: string): Result<TenantId, Error>.
 */
export function createTenantId(value: string): Result<TenantId, Error> {
  if (!UUID_REGEX.test(value)) {
    return err(new Error('TenantId must be a valid UUID.'));
  }

  return ok(value as TenantId);
}
