// File: features/services/index.ts  [TRACE:FILE=features.services.index]
// Purpose: Services feature barrel export providing clean imports for all service-related
//          components and utilities. Centralizes service feature exports for consistent
//          import patterns across the application.
//
// Exports / Entry: ServicesOverview, ServiceDetailLayout components
// Used by: Homepage (app/page.tsx), service pages, and any components needing service features
//
// Invariants:
// - Must export all public service components with consistent naming
// - Component exports must match their file names for predictability
// - No internal utilities should be exported (only public components)
// - Export structure must remain stable to avoid breaking imports
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Service component exports
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:MAINTAINABILITY] Centralized export management

export { default as ServicesOverview } from './components/ServicesOverview';
export { default as ServiceDetailLayout } from './components/ServiceDetailLayout';
