/**
 * @file packages/core/index.ts
 * @summary Core utilities and shared types for the marketing websites monorepo.
 * @description Exports foundational types, utilities, and constants used across packages.
 * @security none
 * @adr none
 * @requirements none
 */

/**"core" index file - now acts as aggregation layer for FSD packages */
export * from '@repo/entities';
export * from '@repo/shared';
export * from './value-objects/Email';
export * from './value-objects/TenantId';
