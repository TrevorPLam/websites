// File: packages/features/src/booking/lib/booking-schema.ts  [TRACE:FILE=packages.features.booking.bookingSchema]
// Purpose: Comprehensive booking form validation with security patterns and fraud detection.
//          Implements Zod-based schema validation for customer information, service selection,
//          and scheduling with 2026 security best practices. Now configurable via BookingFeatureConfig.
//
// Exports / Entry: createBookingFormSchema factory, BookingFormData type, validateBookingSecurity, sanitizeNotes
// Used by: BookingForm component, booking actions, API endpoints
//
// Invariants:
// - All user input must be validated against security patterns
// - Phone numbers must support international formats
// - Dates must be within configurable booking window (maxAdvanceDays)
// - HTML content must be sanitized to prevent XSS attacks
// - Honeypot fields must detect bot submissions
// - PII must be handled securely with proper validation
// - Service types and time slots must match provided configuration
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Comprehensive booking form validation
// - [FEAT:SECURITY] XSS protection and input sanitization
// - [FEAT:FRAUD_DETECTION] Bot detection with honeypot fields
// - [FEAT:UX] User-friendly validation messages
// - [FEAT:INTERNATIONAL] Support for international phone formats
// - [FEAT:CONFIGURATION] Configurable service types and time slots

import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';
import type { ZodError } from 'zod';
import type { BookingFeatureConfig } from './booking-config';

const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

/**
 * Creates a booking form schema based on configuration
 * Service types and time slots are derived from BookingFeatureConfig
 */
// [TRACE:FUNC=packages.features.booking.createBookingFormSchema]
// [FEAT:BOOKING] [FEAT:VALIDATION] [FEAT:CONFIGURATION]
// NOTE: Schema factory - creates Zod schema dynamically from configuration, enabling template-agnostic validation.
export function createBookingFormSchema(config: BookingFeatureConfig) {
  const serviceTypes = config.services.map((s) => s.id) as [string, ...string[]];
  const timeSlotValues = config.timeSlots.map((t) => t.value) as [string, ...string[]];

  return z.object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s\-']+$/,
        'First name can only contain letters, spaces, hyphens, and apostrophes'
      )
      .trim(),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s\-']+$/,
        'Last name can only contain letters, spaces, hyphens, and apostrophes'
      )
      .trim(),

    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),

    phone: z
      .string()
      .regex(PHONE_REGEX, 'Please enter a valid phone number')
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number must be less than 20 digits')
      .trim(),

    serviceType: z.enum(serviceTypes, {
      errorMap: () => ({ message: 'Please select a service type' }),
    }),

    preferredDate: z
      .string()
      .min(1, 'Please select a preferred date')
      .refine(
        (dateStr: string) => {
          try {
            const date = new Date(dateStr);
            const today = startOfDay(new Date());
            const maxDate = addDays(today, config.maxAdvanceDays);

            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              isAfter(date, today) &&
              isBefore(date, maxDate)
            );
          } catch {
            return false;
          }
        },
        `Date must be within the allowed booking window (up to ${config.maxAdvanceDays} days in advance)`
      ),

    timeSlot: z.enum(timeSlotValues, {
      errorMap: () => ({ message: 'Please select a preferred time slot' }),
    }),

    notes: z
      .string()
      .max(500, 'Notes must be less than 500 characters')
      .regex(/^[^<>]*$/, 'Notes cannot contain HTML tags')
      .trim()
      .optional(),

    honeypot: z.string().max(0).optional(),
    timestamp: z.string().optional(),
  });
}

/**
 * Type inference from booking schema (requires config to be provided)
 */
// [TRACE:TYPE=packages.features.booking.BookingFormData]
// [FEAT:BOOKING] [FEAT:SECURITY]
// NOTE: Type-safe form data - ensures frontend and backend use identical data structures.
export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  honeypot?: string;
  timestamp?: string;
};

/**
 * Creates default values for booking form based on configuration
 */
// [TRACE:FUNC=packages.features.booking.createBookingFormDefaults]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Defaults factory - provides sensible defaults based on configuration.
export function createBookingFormDefaults(
  config: BookingFeatureConfig
): Partial<BookingFormData> {
  return {
    serviceType: config.services[0]?.id ?? '',
    timeSlot: config.timeSlots[0]?.value ?? '',
    notes: '',
    honeypot: '',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates service labels map from configuration
 */
// [TRACE:FUNC=packages.features.booking.createServiceLabels]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Labels factory - creates label mapping for UI display.
export function createServiceLabels(
  config: BookingFeatureConfig
): Record<string, string> {
  return Object.fromEntries(config.services.map((s) => [s.id, s.label]));
}

/**
 * Creates time slot labels map from configuration
 */
// [TRACE:FUNC=packages.features.booking.createTimeSlotLabels]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Labels factory - creates time slot label mapping for UI display.
export function createTimeSlotLabels(
  config: BookingFeatureConfig
): Record<string, string> {
  return Object.fromEntries(config.timeSlots.map((t) => [t.value, t.label]));
}

/**
 * Validates booking data against security patterns
 * Implements 2026 fraud detection patterns
 */
// [TRACE:FUNC=packages.features.booking.validateBookingSecurity]
// [FEAT:SECURITY] [FEAT:FRAUD_DETECTION] [FEAT:BOOKING]
// NOTE: Security validation - enforces schema rules and logs validation failures for security monitoring.
export function validateBookingSecurity(
  data: unknown,
  schema: ReturnType<typeof createBookingFormSchema>
): BookingFormData {
  try {
    return schema.parse(data) as BookingFormData;
  } catch (error) {
    if (error && typeof error === 'object' && 'errors' in (error as ZodError)) {
      console.error('Booking validation error:', {
        errors: (error as ZodError).errors,
        timestamp: new Date().toISOString(),
        ip: 'unknown',
      });
    }
    throw error;
  }
}

/**
 * Sanitizes booking notes to prevent XSS attacks
 */
// [TRACE:FUNC=packages.features.booking.sanitizeNotes]
// [FEAT:SECURITY] [FEAT:BOOKING]
// NOTE: XSS protection - removes scripts and HTML tags, enforces length limits for security.
export function sanitizeNotes(notes: string): string {
  return notes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 500);
}
