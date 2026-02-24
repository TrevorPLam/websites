/**
 * @file packages/entities/src/tenant/index.ts
 * @summary Entity definition for index in FSD architecture.
 * @description Core business entity with type definitions and business logic.
 * @security Tenant isolation enforced via explicit tenantId boundaries.
 * @adr none
 * @requirements DOMAIN-4-003
 */

export * from './Tenant';
export * from './errors';
