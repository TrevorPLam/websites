// File: features/services/index.ts  [TRACE:FILE=features.services.index]
// Purpose: Backward-compatible barrel export for services feature.
//          Re-exports from extracted @repo/features/services while maintaining
//          template-specific compatibility for existing usage.
//
// Exports / Entry: ServicesOverview, ServiceDetailLayout, service types
// Used by: Homepage (app/page.tsx), service pages (/services/*)
//
// Invariants:
// - Must maintain backward compatibility with existing template imports
// - Must re-export all public components and types
//
// Status: @public (template-specific compatibility layer)
// Features:
// - [FEAT:SERVICES] Service component exports
// - [FEAT:ARCHITECTURE] Backward-compatible re-export pattern

export {
  ServicesOverview,
  ServiceDetailLayout,
  type ServiceOverviewItem,
  type ServicesOverviewProps,
  type ServiceDetailProps,
  type ProcessStep,
  type ServicePricingTier,
} from '@repo/features/services';
