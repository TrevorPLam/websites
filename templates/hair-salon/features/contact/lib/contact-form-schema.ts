// File: features/contact/lib/contact-form-schema.ts  [TRACE:FILE=features.contact.contactFormSchema]
// Purpose: Contact form validation schema providing comprehensive input validation,
//          security checks, and bot protection. Implements Zod-based validation
//          with configurable limits and honeypot field for spam prevention.
//
// Exports / Entry: contactFormSchema, ContactFormData type
// Used by: ContactForm component, contact submission actions, and any contact validation features
//
// Invariants:
// - All input fields must be validated against security patterns
// - Honeypot field must detect bot submissions and fail validation
// - Validation limits must prevent abuse while allowing legitimate input
// - Error messages must be user-friendly and actionable
// - Schema must support both client and server-side validation
//
// Status: @public
// Features:
// - [FEAT:VALIDATION] Comprehensive form input validation
// - [FEAT:SECURITY] Bot protection and honeypot detection
// - [FEAT:UX] User-friendly validation messages
// - [FEAT:CONFIGURATION] Configurable validation limits
// - [FEAT:TYPESAFE] Type-safe form data handling

import { z } from 'zod';
import { FORM_VALIDATION } from '@/lib/constants';

// [TRACE:SCHEMA=features.contact.contactFormSchema]
// [FEAT:VALIDATION] [FEAT:SECURITY] [FEAT:UX] [FEAT:CONFIGURATION]
// NOTE: Contact form validation - implements comprehensive input validation with bot protection and security checks.
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(FORM_VALIDATION.NAME_MIN_LENGTH, 'Name must be at least 2 characters')
    .max(FORM_VALIDATION.NAME_MAX_LENGTH),
  email: z.string().email('Invalid email address').max(FORM_VALIDATION.EMAIL_MAX_LENGTH),
  company: z.string().max(FORM_VALIDATION.COMPANY_MAX_LENGTH).optional(),
  phone: z.string().trim().min(1, 'Phone number is required').max(FORM_VALIDATION.PHONE_MAX_LENGTH),
  servicesInterested: z
    .string()
    .max(
      FORM_VALIDATION.SERVICES_INTERESTED_MAX_LENGTH,
      "Please select services you're interested in"
    )
    .optional(),
  preferredAppointment: z
    .string()
    .max(
      FORM_VALIDATION.PREFERRED_APPOINTMENT_MAX_LENGTH,
      'Please select preferred appointment time'
    )
    .optional(),
  // Honeypot field - must be empty to pass validation (bot protection)
  website: z.string().max(0, 'Honeypot must be empty').optional(),
  message: z
    .string()
    .min(FORM_VALIDATION.MESSAGE_MIN_LENGTH, 'Message must be at least 10 characters')
    .max(FORM_VALIDATION.MESSAGE_MAX_LENGTH),
  hearAboutUs: z.string().max(FORM_VALIDATION.HEAR_ABOUT_US_MAX_LENGTH).optional(),
});

// Type inferred from schema for type-safe form handling
export type ContactFormData = z.infer<typeof contactFormSchema>;
