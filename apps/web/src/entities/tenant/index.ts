/**
 * @file apps/web/src/entities/tenant/index.ts
 * @summary Tenant entity public API.
 * @description Provides tenant-related models and utilities.
 * @security Enforces tenant isolation in all operations.
 * @adr none
 * @requirements DOMAIN-7-1
 */

export { TenantSchema, createTenant } from './model/tenant.schema';
export type { Tenant } from './model/tenant.schema';
