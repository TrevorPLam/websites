/**
 * @file packages/core/entities/tenant/errors.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

/**
 * export class TenantDomainError extends Error.
 */
export class TenantDomainError extends Error {}

/**
 * export class TenantSlugConflictError extends TenantDomainError.
 */
export class TenantSlugConflictError extends TenantDomainError {}

/**
 * export class TenantDomainConflictError extends TenantDomainError.
 */
export class TenantDomainConflictError extends TenantDomainError {}
