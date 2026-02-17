// File: packages/features/src/booking/lib/booking-schema.ts  [TRACE:FILE=packages.features.booking.bookingSchema]
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

import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';
import type { ZodError } from 'zod';

const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export const SERVICE_TYPES = [
  'haircut-style',
  'color-highlights',
  'treatment',
  'special-occasion',
  'consultation',
] as const;

export const TIME_SLOTS = ['morning', 'afternoon', 'evening'] as const;

export const bookingFormSchema = z.object({
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

  serviceType: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: 'Please select a service type' }),
  }),

  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((dateStr: string) => {
      try {
        const date = new Date(dateStr);
        const today = startOfDay(new Date());
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

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .regex(/^[^<>]*$/, 'Notes cannot contain HTML tags')
    .trim()
    .optional(),

  honeypot: z.string().max(0).optional(),
  timestamp: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const bookingFormDefaults: Partial<BookingFormData> = {
  serviceType: 'consultation',
  timeSlot: 'afternoon',
  notes: '',
  honeypot: '',
  timestamp: new Date().toISOString(),
};

export const SERVICE_LABELS = {
  'haircut-style': 'Haircut & Style',
  'color-highlights': 'Color & Highlights',
  treatment: 'Treatment',
  'special-occasion': 'Special Occasion',
  consultation: 'Consultation',
} as const;

export const TIME_SLOT_LABELS = {
  morning: 'Morning (9am - 12pm)',
  afternoon: 'Afternoon (12pm - 4pm)',
  evening: 'Evening (4pm - 8pm)',
} as const;

export function validateBookingSecurity(data: unknown): BookingFormData {
  try {
    return bookingFormSchema.parse(data);
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

export function sanitizeNotes(notes: string): string {
  return notes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 500);
}
