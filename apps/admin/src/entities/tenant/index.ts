/**
 * @file admin/src/entities/tenant/index.ts
 * @summary tenant entity definitions and schemas.
 * @description Core data structures and validation for tenant management.
 * @security none
 * @requirements none
 */
export { TenantAvatar } from './ui/TenantAvatar';
export { TenantSchema, TenantMetricsSchema, type Tenant, type TenantMetrics } from './model/tenant.schema';
