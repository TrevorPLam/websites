/**
 * @file packages/core/index.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

export * from './shared/Result';
export * from './shared/Option';
export * from './value-objects/Email';
export * from './value-objects/TenantId';
export * from './entities/tenant/Tenant';
export * from './entities/tenant/errors';
export * from './entities/lead/Lead';
