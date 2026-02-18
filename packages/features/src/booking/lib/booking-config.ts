// File: packages/features/src/booking/lib/booking-config.ts  [TRACE:FILE=packages.features.booking.bookingConfig]
// Purpose: Configuration interface for booking feature, enabling template-agnostic booking forms
//          that derive service categories and time slots from site configuration.
//
// Exports / Entry: BookingFeatureConfig interface, createBookingConfig helper
// Used by: BookingForm component, booking schema factory, booking actions
//
// Invariants:
// - Service categories must match site.config.ts conversionFlow.serviceCategories
// - Time slots must match site.config.ts conversionFlow.timeSlots
// - Max advance days must match site.config.ts conversionFlow.maxAdvanceDays
// - Service labels must be provided for all service categories
// - Time slot labels must be provided for all time slots
//
// Status: @public
// Features:
// - [FEAT:BOOKING] Configuration-driven booking feature
// - [FEAT:CONFIGURATION] Template-agnostic booking setup
// - [FEAT:TYPES] Type-safe booking configuration

import type { BookingFlowConfig } from '@repo/types';

/**
 * Service configuration with display label
 */
// [TRACE:INTERFACE=packages.features.booking.ServiceConfig]
// [FEAT:BOOKING] [FEAT:CONFIGURATION]
// NOTE: Service configuration - defines service category with display label for UI.
export interface ServiceConfig {
  /** Service category ID (matches serviceCategories from site.config.ts) */
  id: string;
  /** Display label for the service */
  label: string;
}

/**
 * Time slot configuration with display label
 */
// [TRACE:INTERFACE=packages.features.booking.TimeSlotConfig]
// [FEAT:BOOKING] [FEAT:CONFIGURATION]
// NOTE: Time slot configuration - defines time slot with display label for UI.
export interface TimeSlotConfig {
  /** Time slot value (matches timeSlots[].value from site.config.ts) */
  value: string;
  /** Display label for the time slot */
  label: string;
}

/**
 * Booking feature configuration
 * Derives from site.config.ts conversionFlow (BookingFlowConfig)
 */
// [TRACE:INTERFACE=packages.features.booking.BookingFeatureConfig]
// [FEAT:BOOKING] [FEAT:CONFIGURATION]
// NOTE: Feature configuration - provides all configurable aspects of booking feature.
export interface BookingFeatureConfig {
  /** Service categories available for booking */
  services: ServiceConfig[];
  /** Available time slots */
  timeSlots: TimeSlotConfig[];
  /** Maximum days in advance bookings can be made */
  maxAdvanceDays: number;
  /** Optional: Custom notes placeholder text */
  notesPlaceholder?: string;
  /** Optional: Custom notes label */
  notesLabel?: string;
}

/**
 * Creates booking feature configuration from BookingFlowConfig
 * Extracts service categories and time slots from site configuration
 */
// [TRACE:FUNC=packages.features.booking.createBookingConfig]
// [FEAT:BOOKING] [FEAT:CONFIGURATION]
// NOTE: Config factory - converts site config to feature config with proper typing.
export function createBookingConfig(
  flowConfig: BookingFlowConfig
): BookingFeatureConfig {
  if (flowConfig.type !== 'booking') {
    throw new Error('Conversion flow must be of type "booking"');
  }

  return {
    services: flowConfig.serviceCategories.map((id) => ({
      id,
      // Default label uses capitalized ID; can be overridden
      label: id
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    })),
    timeSlots: flowConfig.timeSlots,
    maxAdvanceDays: flowConfig.maxAdvanceDays,
  };
}
