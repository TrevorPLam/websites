// File: features/booking/index.ts  [TRACE:FILE=features.booking.index]
// Purpose: Backward-compatible barrel export for booking feature.
//          Re-exports from extracted @repo/features/booking while maintaining
//          template-specific compatibility for existing usage.
//
// Exports / Entry: BookingForm, createBookingConfig, schemas, actions, providers
// Used by: Booking page (/book), contact forms, and any appointment scheduling features
//
// Invariants:
// - Must maintain backward compatibility with existing template imports
// - Must re-export all public components, config helpers, and types
//
// Status: @public (template-specific compatibility layer)
// Features:
// - [FEAT:BOOKING] Appointment scheduling components and utilities
// - [FEAT:ARCHITECTURE] Backward-compatible re-export pattern

export {
  BookingForm,
  createBookingConfig,
  createBookingFormSchema,
  createBookingFormDefaults,
  submitBookingRequest,
  getBookingProviders,
} from '@repo/features/booking';
export type {
  BookingFormProps,
  BookingFeatureConfig,
  BookingFormData,
  BookingSubmissionResult,
  ServiceConfig,
  TimeSlotConfig,
  BookingProvider,
  BookingProviderResponse,
  ProviderConfig,
  BookingProviderAdapter,
} from '@repo/features/booking';
