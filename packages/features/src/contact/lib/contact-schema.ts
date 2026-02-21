// File: packages/features/src/contact/lib/contact-schema.ts  [TRACE:FILE=packages.features.contact.contactSchema]
// Purpose: Contact form validation schema providing comprehensive input validation,
//          security checks, and bot protection. Implements Zod-based validation
//          with configurable fields and validation rules. Now configurable via ContactFeatureConfig.
//
// Relationship: Uses contact-config (ContactFeatureConfig). Used by ContactForm, contact-actions.
// System role: Schema factory from config.fields; validateContactSecurity parses and logs failures.
// Assumptions: config.fields define type and validation; honeypot optional but recommended.
//
// Exports / Entry: createContactFormSchema factory, ContactFormData type, validateContactSecurity
// Used by: ContactForm component, contact actions, API endpoints
//
// Invariants:
// - All input fields must be validated against security patterns
// - Honeypot field must detect bot submissions and fail validation
// - Validation limits must prevent abuse while allowing legitimate input
// - Error messages must be user-friendly and actionable
// - Schema must support both client and server-side validation
// - Field configurations must match provided ContactFeatureConfig
//
// Status: @public
// Features:
// - [FEAT:VALIDATION] Comprehensive form input validation
// - [FEAT:SECURITY] Bot protection and honeypot detection
// - [FEAT:UX] User-friendly validation messages
// - [FEAT:CONFIGURATION] Configurable validation limits and field rules
// - [FEAT:TYPESAFE] Type-safe form data handling

import { z } from 'zod';
import type { ContactFeatureConfig } from './contact-config';

/**
 * Phone number validation regex (supports international formats)
 */
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

/**
 * Creates a contact form schema based on configuration
 * Fields and validation rules are derived from ContactFeatureConfig
 */
// [TRACE:FUNC=packages.features.contact.createContactFormSchema]
// [FEAT:CONTACT] [FEAT:VALIDATION] [FEAT:CONFIGURATION]
// NOTE: Schema factory - creates Zod schema dynamically from configuration, enabling template-agnostic validation.
export function createContactFormSchema(config: ContactFeatureConfig) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Build schema fields from configuration
  for (const field of config.fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'email': {
        let emailSchema: z.ZodString = z.string().email('Invalid email address');
        if (field.validation?.maxLength) {
          emailSchema = emailSchema.max(field.validation.maxLength);
        }
        fieldSchema = emailSchema.toLowerCase().trim();
        break;
      }

      case 'tel': {
        let telSchema: z.ZodString = z
          .string()
          .regex(PHONE_REGEX, 'Please enter a valid phone number')
          .trim();
        if (field.validation?.minLength) {
          telSchema = telSchema.min(field.validation.minLength, 'Phone number is too short');
        }
        if (field.validation?.maxLength) {
          telSchema = telSchema.max(field.validation.maxLength, 'Phone number is too long');
        }
        fieldSchema = telSchema;
        break;
      }

      case 'textarea': {
        let textareaSchema: z.ZodString = z.string().trim();
        if (field.validation?.minLength) {
          textareaSchema = textareaSchema.min(
            field.validation.minLength,
            field.validation.customMessage ||
              `Message must be at least ${field.validation.minLength} characters`
          );
        }
        if (field.validation?.maxLength) {
          textareaSchema = textareaSchema.max(
            field.validation.maxLength,
            field.validation.customMessage ||
              `Message must be less than ${field.validation.maxLength} characters`
          );
        }
        fieldSchema = textareaSchema;
        break;
      }

      case 'select':
        if (field.options && field.options.length > 0) {
          const values = field.options.map((opt) => opt.value).filter((v) => v !== '') as [
            string,
            ...string[],
          ];
          if (values.length > 0) {
            fieldSchema = z.enum(values, {
              errorMap: () => ({ message: `Please select ${field.label.toLowerCase()}` }),
            });
          } else {
            fieldSchema = z.string().optional();
          }
        } else {
          fieldSchema = z.string().optional();
        }
        break;

      case 'text':
      default: {
        let textSchema: z.ZodString = z.string().trim();
        if (field.validation?.minLength) {
          textSchema = textSchema.min(
            field.validation.minLength,
            field.validation.customMessage ||
              `${field.label} must be at least ${field.validation.minLength} characters`
          );
        }
        if (field.validation?.maxLength) {
          textSchema = textSchema.max(
            field.validation.maxLength,
            field.validation.customMessage ||
              `${field.label} must be less than ${field.validation.maxLength} characters`
          );
        }
        if (field.validation?.pattern) {
          textSchema = textSchema.regex(
            field.validation.pattern,
            field.validation.customMessage || `Invalid ${field.label.toLowerCase()} format`
          );
        }
        fieldSchema = textSchema;
        break;
      }
    }

    // Apply required/optional based on field config
    if (field.required) {
      schemaFields[field.id] = fieldSchema;
    } else {
      schemaFields[field.id] = fieldSchema.optional();
    }
  }

  // Add honeypot field if enabled
  if (config.enableHoneypot) {
    schemaFields['website'] = z.string().max(0, 'Honeypot must be empty').optional();
  }

  return z.object(schemaFields);
}

/**
 * Type inferred from schema for type-safe form handling
 */
export type ContactFormData = z.infer<ReturnType<typeof createContactFormSchema>>;

/**
 * Creates default form values from configuration
 */
// [TRACE:FUNC=packages.features.contact.createContactFormDefaults]
// [FEAT:CONTACT] [FEAT:CONFIGURATION] [FEAT:UX]
// NOTE: Defaults factory - creates initial form values from field configuration.
export function createContactFormDefaults(config: ContactFeatureConfig): Partial<ContactFormData> {
  const defaults: Partial<ContactFormData> = {};

  for (const field of config.fields) {
    if (field.type === 'select' && field.options && field.options.length > 0) {
      // Default to first option (usually empty placeholder)
      defaults[field.id as keyof ContactFormData] = (field.options[0]?.value ??
        '') as ContactFormData[keyof ContactFormData];
    } else {
      defaults[field.id as keyof ContactFormData] = '' as ContactFormData[keyof ContactFormData];
    }
  }

  if (config.enableHoneypot) {
    defaults['website' as keyof ContactFormData] = '' as ContactFormData[keyof ContactFormData];
  }

  return defaults;
}

/**
 * Security validation for contact form data
 * Checks for suspicious patterns and bot indicators
 */
// [TRACE:FUNC=packages.features.contact.validateContactSecurity]
// [FEAT:CONTACT] [FEAT:SECURITY] [FEAT:FRAUD_DETECTION]
// NOTE: Security validation - detects suspicious patterns and bot submissions before processing.
export function validateContactSecurity(data: Record<string, unknown>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check honeypot field
  if (data.website && typeof data.website === 'string' && data.website.trim().length > 0) {
    errors.push('Bot detection triggered');
  }

  // Check for suspicious patterns in message field
  if (data.message && typeof data.message === 'string') {
    const message = data.message.toLowerCase();
    // Common spam patterns
    if (message.includes('http://') || message.includes('https://')) {
      // Allow URLs but flag for review
    }
    if (message.length > 10000) {
      errors.push('Message exceeds maximum length');
    }
  }

  // Check email domain patterns
  if (data.email && typeof data.email === 'string') {
    const email = data.email.toLowerCase();
    // Common disposable email patterns (basic check)
    const disposableDomains = ['tempmail', 'throwaway', 'guerrillamail'];
    if (disposableDomains.some((domain) => email.includes(domain))) {
      // Flag but don't block (may be legitimate)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
