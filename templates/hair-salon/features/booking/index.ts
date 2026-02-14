// File: features/booking/index.ts  [TRACE:FILE=features.booking.index]
// Purpose: Booking feature barrel export providing clean imports for booking components,
//          schemas, actions, and providers. Centralizes booking functionality for
//          appointment scheduling across the application.
//
// Exports / Entry: BookingForm component, booking schemas, actions, and providers
// Used by: Booking page (/book), contact forms, and any appointment scheduling features
//
// Invariants:
// - Must export all public booking utilities with consistent naming
// - Component exports must be default exports for React patterns
// - Library exports (schemas, actions, providers) must be named exports
// - Export structure must remain stable to avoid breaking booking functionality
//
// Status: @public
// Features:
// - [FEAT:BOOKING] Appointment scheduling components and utilities
// - [FEAT:FORMS] Booking form validation and submission
// - [FEAT:INTEGRATION] External booking system connections
// - [FEAT:ARCHITECTURE] Clean barrel export pattern

// Component exports
export { default as BookingForm } from './components/BookingForm';

// Library exports
export * from './lib/booking-schema';
export * from './lib/booking-actions';
export * from './lib/booking-providers';
