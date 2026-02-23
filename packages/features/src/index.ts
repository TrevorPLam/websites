/**
 * [TRACE:FILE=packages.features.index]
 * Purpose: Barrel export for shared feature modules (booking, contact, blog, services, search).
 *
 * Relationship: Depends on @repo/types, @repo/ui, @repo/infra. Consumed by templates (e.g. hair-salon).
 * System role: Feature layer; template-agnostic components and lib; templates wire config and actions.
 * Assumptions: Each feature exports components and lib; templates may re-export or wrap with local config.
 */
import 'server-only';

// Consolidated feature exports for better organization
export * from './core';
export * from './content';
export * from './business';
export * from './advanced';
export * from './utilities';

// Individual exports for commonly used features
export * from './blog';
export * from './content-management';
export * from './notification';
