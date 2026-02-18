// File: packages/features/src/booking/index.ts  [TRACE:FILE=packages.features.booking.index]
// Purpose: Booking feature barrel export providing clean imports for booking components,
//          schemas, actions, providers, and configuration. Centralizes booking functionality for
//          appointment scheduling across the application.
//
// Exports / Entry: BookingForm component, booking schemas, actions, providers, and config utilities
// Used by: Booking page (/book), contact forms, and any appointment scheduling features
//
// Invariants:
// - Must export all public booking utilities with consistent naming
// - Component exports must be default exports for React patterns
// - Library exports (schemas, actions, providers, config) must be named exports
// - Export structure must remain stable to avoid breaking booking functionality
//
// Status: @public
// Features:
// - [FEAT:BOOKING] Appointment scheduling components and utilities
// - [FEAT:FORMS] Booking form validation and submission
// - [FEAT:INTEGRATION] External booking system connections
// - [FEAT:ARCHITECTURE] Clean barrel export pattern
// - [FEAT:CONFIGURATION] Configurable booking feature setup

// Component exports
export { default as BookingForm } from './components/BookingForm';
export type { BookingFormProps } from './components/BookingForm';

// Configuration exports
export * from './lib/booking-config';
export type { BookingFeatureConfig } from './lib/booking-config';

// Schema exports
export * from './lib/booking-schema';
export type { BookingFormData } from './lib/booking-schema';

// Action exports
export * from './lib/booking-actions';
export type { BookingSubmissionResult } from './lib/booking-actions';

// Provider exports
export * from './lib/booking-providers';
export type { BookingProvider, BookingProviderResponse, ProviderConfig } from './lib/booking-provider-adapter';
export type { BookingProviderAdapter } from './lib/booking-provider-adapter';
