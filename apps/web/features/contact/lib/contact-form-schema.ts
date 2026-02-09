/**
 * Contact form validation schema using Zod.
 *
 * @module contact-form-schema
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Contact form validation with security features.
 * Defines schema for contact form data validation and type safety.
 *
 * **SECURITY FEATURES**:
 * - Honeypot field (website) with max length 0 to catch bots
 * - Input sanitization and length limits
 * - Email format validation
 *
 * **VALIDATION RULES**:
 * - name: 2-50 characters, required
 * - email: Valid email format, max 254 characters
 * - company: Optional, max 100 characters
 * - phone: Required, trimmed, max 50 characters
 * - servicesInterested: Optional, max 50 characters
 * - preferredAppointment: Optional, max 50 characters
 * - website: Honeypot, must be empty (max 0)
 * - message: 10-1000 characters, required
 * - hearAboutUs: Optional, max 100 characters
 *
 * **USAGE**:
 * ```tsx
 * import { contactFormSchema, type ContactFormData } from './contact-form-schema'
 *
 * // Validate form data
 * const result = contactFormSchema.safeParse(formData)
 * if (result.success) {
 *   // Type-safe data access
 *   const { name, email } = result.data
 * }
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding new field? Add to schema with appropriate validation
 * - Changing validation rules? Update FORM_VALIDATION constants
 * - Honeypot field must remain for bot protection
 *
 * **DEPENDENCIES**:
 * - zod: Schema validation and type inference
 * - ./constants: FORM_VALIDATION configuration
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Define validation schema for contact form submissions
 * - Provide type safety for form data
 * - Implement security measures against spam bots
 *
 * **Security Features:**
 * - Honeypot field (website) to detect automated submissions
 * - Input length limits to prevent abuse
 * - Email format validation
 *
 * **Validation Rules:**
 * - Required fields: name, email, message
 * - Optional fields: company, servicesInterested, preferredAppointment, hearAboutUs
 * - Honeypot field: website (must be empty)
 *
 * **Usage:**
 * ```tsx
 * import { contactFormSchema, type ContactFormData } from './contact-form-schema'
 *
 * // Parse and validate form data
 * const result = contactFormSchema.parse(formData)
 * // or with safeParse for error handling
 * const result = contactFormSchema.safeParse(formData)
 * ```
 *
 * **Type Safety:**
 * - ContactFormData type inferred from schema
 * - Provides autocomplete and compile-time checks
 */

import { z } from 'zod';
import { FORM_VALIDATION } from '@/lib/constants';

// Contact form schema with enhanced validation
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
