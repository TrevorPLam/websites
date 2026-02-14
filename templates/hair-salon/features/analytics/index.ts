// File: features/analytics/index.ts  [TRACE:FILE=features.analytics.index]
// Purpose: Analytics feature barrel export providing clean imports for analytics
//          consent management and tracking utilities. Centralizes analytics functionality
//          for GDPR/CCPA compliant tracking across the application.
//
// Exports / Entry: Analytics utilities, consent management functions, types
// Used by: AnalyticsConsentBanner, layout components, and any analytics features
//
// Invariants:
// - Must export all public analytics utilities with consistent naming
// - Consent management functions must be available globally
// - Analytics functions must respect consent state before tracking
// - Export structure must remain stable to avoid breaking analytics
// - No internal implementation details should be exposed
//
// Status: @public
// Features:
// - [FEAT:ANALYTICS] Google Analytics integration and tracking
// - [FEAT:PRIVACY] GDPR/CCPA consent management
// - [FEAT:MONITORING] Analytics event tracking and reporting
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:COMPLIANCE] Privacy-by-design analytics implementation

// Library exports
export * from './lib/analytics';
export * from './lib/analytics-consent';
