/**
 * [TRACE:FILE=packages.features.index]
 * Purpose: Barrel export for shared feature modules (booking, contact, blog, services, search).
 *
 * Relationship: Depends on @repo/types, @repo/ui, @repo/infra. Consumed by templates (e.g. hair-salon).
 * System role: Feature layer; template-agnostic components and lib; templates wire config and actions.
 * Assumptions: Each feature exports components and lib; templates may re-export or wrap with local config.
 */
export * from './booking';
export * from './contact';
export * from './blog';
export * from './services';
export * from './search';
export * from './localization';
export * from './team';
export * from './testimonials';
export * from './gallery';
export * from './pricing';
export * from './newsletter';
export * from './social-media';
export * from './reviews';
export * from './analytics';
export * from './ab-testing';
export * from './chat';
export * from './ecommerce';
export * from './authentication';
export * from './payment';
export * from './content-management';
export * from './notification';
