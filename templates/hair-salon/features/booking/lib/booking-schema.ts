// File: features/booking/lib/booking-schema.ts  [TRACE:FILE=features.booking.bookingSchema]
// Purpose: Comprehensive booking form validation with security patterns and fraud detection.
//          Implements Zod-based schema validation for customer information, service selection,
//          and scheduling with 2026 security best practices.
//
// Exports / Entry: bookingFormSchema, BookingFormData type, validateBookingSecurity, sanitizeNotes
// Used by: BookingForm component, booking actions, API endpoints
//
// Invariants:
// - All user input must be validated against security patterns
// - Phone numbers must support international formats
// - Dates must be within reasonable booking window (90 days)
// - HTML content must be sanitized to prevent XSS attacks
// - Honeypot fields must detect bot submissions
// - PII must be handled securely with proper validation
//
// Status: @internal
// Features:
// - [FEAT:BOOKING] Comprehensive booking form validation
// - [FEAT:SECURITY] XSS protection and input sanitization
// - [FEAT:FRAUD_DETECTION] Bot detection with honeypot fields
// - [FEAT:UX] User-friendly validation messages
// - [FEAT:INTERNATIONAL] Support for international phone formats

import { z } from 'zod';
import { addDays, isBefore, isAfter, startOfDay } from 'date-fns';

// [TRACE:CONST=features.booking.phoneRegex]
// [FEAT:SECURITY] [FEAT:INTERNATIONAL]
// NOTE: International phone regex - supports formats like +1 (555) 123-4567, 555.123.4567, etc.
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// [TRACE:CONST=features.booking.serviceTypes]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Available service categories - maps to business offerings and pricing structure.
export const SERVICE_TYPES = [
  'haircut-style',
  'color-highlights',
  'treatment',
  'special-occasion',
  'consultation',
] as const;

// [TRACE:CONST=features.booking.timeSlots]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Time slot categories - provides user-friendly booking time preferences.
export const TIME_SLOTS = ['morning', 'afternoon', 'evening'] as const;

/**
 * Zod schema for booking form validation
 * Implements 2026 security patterns with comprehensive validation
 */
// [TRACE:SCHEMA=features.booking.bookingFormSchema]
// [FEAT:BOOKING] [FEAT:SECURITY] [FEAT:FRAUD_DETECTION]
// NOTE: Core validation schema - enforces security patterns, business rules, and UX requirements.
export const bookingFormSchema = z.object({
  // Customer information
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

  // Service details
  serviceType: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: 'Please select a service type' }),
  }),

  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((dateStr) => {
      try {
        const date = new Date(dateStr);
        const today = startOfDay(new Date());
        // [Task 9.2.3] Named constant for max booking window
        const MAX_BOOKING_DAYS_AHEAD = 90;
        const maxDate = addDays(today, MAX_BOOKING_DAYS_AHEAD);

        return (
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          isAfter(date, today) &&
          isBefore(date, maxDate)
        );
      } catch {
        return false;
      }
    }, 'Date must be within the allowed booking window'),

  timeSlot: z.enum(TIME_SLOTS, {
    errorMap: () => ({ message: 'Please select a preferred time slot' }),
  }),

  // Optional notes with security validation
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .regex(/^[^<>]*$/, 'Notes cannot contain HTML tags')
    .trim()
    .optional(),

  // Security fields (hidden from user)
  honeypot: z.string().max(0).optional(), // Bot detection field
  timestamp: z.string().optional(), // Form submission timestamp
});

/**
 * Type inference from the booking schema
 */
// [TRACE:TYPE=features.booking.BookingFormData]
// [FEAT:BOOKING] [FEAT:SECURITY]
// NOTE: Type-safe form data - ensures frontend and backend use identical data structures.
export type BookingFormData = z.infer<typeof bookingFormSchema>;

/**
 * Default values for the booking form
 */
// [TRACE:CONST=features.booking.bookingFormDefaults]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Smart defaults - improves UX by pre-selecting common options and setting security fields.
export const bookingFormDefaults: Partial<BookingFormData> = {
  serviceType: 'consultation',
  timeSlot: 'afternoon',
  notes: '',
  honeypot: '',
  timestamp: new Date().toISOString(),
};

/**
 * Service type display labels
 */
// [TRACE:CONST=features.booking.serviceLabels]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: User-friendly labels - maps internal service types to customer-facing descriptions.
export const SERVICE_LABELS = {
  'haircut-style': 'Haircut & Style',
  'color-highlights': 'Color & Highlights',
  treatment: 'Treatment',
  'special-occasion': 'Special Occasion',
  consultation: 'Consultation',
} as const;

/**
 * Time slot display labels with descriptions
 */
// [TRACE:CONST=features.booking.timeSlotLabels]
// [FEAT:BOOKING] [FEAT:UX]
// NOTE: Time descriptions - provides clear time ranges for user selection and expectation management.
export const TIME_SLOT_LABELS = {
  morning: 'Morning (9am - 12pm)',
  afternoon: 'Afternoon (12pm - 4pm)',
  evening: 'Evening (4pm - 8pm)',
} as const;

/**
 * Validates booking data against security patterns
 * Implements 2026 fraud detection patterns
 */
// [TRACE:FUNC=features.booking.validateBookingSecurity]
// [FEAT:SECURITY] [FEAT:FRAUD_DETECTION] [FEAT:BOOKING]
// NOTE: Security validation - enforces schema rules and logs validation failures for security monitoring.
export function validateBookingSecurity(data: unknown): BookingFormData {
  try {
    return bookingFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log validation errors for security monitoring
      console.error('Booking validation error:', {
        errors: error.errors,
        timestamp: new Date().toISOString(),
        ip: 'unknown', // Will be populated in server context
      });
    }
    throw error;
  }
}

/**
 * Sanitizes booking notes to prevent XSS attacks
 */
// [TRACE:FUNC=features.booking.sanitizeNotes]
// [FEAT:SECURITY] [FEAT:BOOKING]
// NOTE: XSS protection - removes scripts and HTML tags, enforces length limits for security.
export function sanitizeNotes(notes: string): string {
  return notes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim()
    .substring(0, 500); // Enforce length limit
}
