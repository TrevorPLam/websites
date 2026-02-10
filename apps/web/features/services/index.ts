/**
 * @file apps/web/features/services/index.ts
 * @role runtime
 * @summary Services feature public exports.
 *
 * @entrypoints
 * - Module barrel
 *
 * @exports
 * - ServicesOverview
 * - ServiceDetailLayout
 *
 * @depends_on
 * - Internal: ./components/ServicesOverview
 * - Internal: ./components/ServiceDetailLayout
 *
 * @used_by
 * - Services routes
 *
 * @runtime
 * - environment: server
 * - side_effects: none
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

export { default as ServicesOverview } from './components/ServicesOverview';
export { default as ServiceDetailLayout } from './components/ServiceDetailLayout';
