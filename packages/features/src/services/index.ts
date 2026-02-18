// File: packages/features/src/services/index.ts  [TRACE:FILE=packages.features.services.index]
// Purpose: Services feature barrel export providing clean imports for service components
//          and types. Centralizes services functionality for homepage and detail pages.
//
// Exports / Entry: ServicesOverview, ServiceDetailLayout, service types
// Used by: Homepage, service detail pages (/services/*), marketing sections
//
// Invariants:
// - Must export all public service components and types
// - No internal utilities exported unless explicitly public
// - Export structure stable for import consistency
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Service component exports
// - [FEAT:ARCHITECTURE] Barrel export pattern
// - [FEAT:CONFIGURATION] Type exports for template config

// Component exports
export { default as ServicesOverview } from './components/ServicesOverview';
export { default as ServiceDetailLayout } from './components/ServiceDetailLayout';

// Type exports
export type {
  ServiceOverviewItem,
  ServicesOverviewProps,
  ServiceDetailProps,
  ProcessStep,
  ServicePricingTier,
} from './types';
