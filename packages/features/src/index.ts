/**
 * [TRACE:FILE=packages.features.index]
 * Purpose: Barrel export for shared feature modules (booking, contact, blog, services, search).
 *
 * Relationship: Depends on @repo/types, @repo/ui, @repo/infrastructure. Consumed by templates (e.g. hair-salon).
 * System role: Feature layer; template-agnostic components and lib; templates wire config and actions.
 * Assumptions: Each feature exports components and lib; templates may re-export or wrap with local config.
 */
import 'server-only';

// Consolidated barrel exports (optimized for 2026 standards)
/**
 * @file packages/features/src/index.ts
 * @summary Feature exports for business logic and domain operations.
 * @description Provides centralized exports for all feature modules with client/server separation.
 * @security Multi-tenant isolation enforced in all exported functions.
 * @adr none
 * @requirements ARCH-005-multi-tenant-isolation
 */

export * from './advanced';
export * from './auth';
export * from './blog';
export * from './business';
export * from './content';
export * from './content-management';
export * from './notification';
export * from './utilities';
