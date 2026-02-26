/**
 * @file apps/web/src/features/lead-capture/lib/lead-capture-validation.ts
 * @summary Comprehensive lead capture validation with 2026 standards.
 * @description Complete validation functions for lead capture with multi-tenant security.
 * @security Validates tenant context and data integrity
 * @compliance GDPR/CCPA compliant validation with consent tracking
 */

import { validateCreateLead, type CreateLeadData } from '@/entities/lead/model/lead.schema'

// Extended lead data type that includes server-side fields
export type ExtendedLeadData = CreateLeadData & {
  userAgent?: string
  ipAddress?: string
}

/**
 * Validates lead capture form data with comprehensive error handling
 * @param data - Raw form data to validate
 * @returns Validation result with success status and detailed errors
 */
export function validateLeadCaptureData(data: unknown): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: CreateLeadData
} {
  const errors: Record<string, string> = {}

  try {
    // Validate against comprehensive schema
    const validatedData = validateCreateLead(data)

    // Additional business logic validations
    if (validatedData.email && validatedData.email.toLowerCase() === validatedData.email) {
      // Email is already lowercase (good practice)
    }

    // Phone number format validation (if provided)
    if (validatedData.phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!phoneRegex.test(validatedData.phone)) {
        errors.phone = 'Phone number must be in E.164 format (e.g., +1234567890)'
      }
    }

    // URL validation for landing page
    if (validatedData.landingPage) {
      try {
        new URL(validatedData.landingPage)
      } catch {
        errors.landingPage = 'Invalid landing page URL format'
      }
    }

    // Referrer URL validation (if provided)
    if (validatedData.referrer) {
      try {
        new URL(validatedData.referrer)
      } catch {
        errors.referrer = 'Invalid referrer URL format'
      }
    }

    // Consent validation for GDPR/CCPA compliance
    if (validatedData.consent) {
      if (!validatedData.consent.processing) {
        errors.consent = 'Data processing consent is required'
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return {
        isValid: false,
        errors
      }
    }

    return {
      isValid: true,
      errors: {},
      sanitizedData: validatedData
    }

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error) {
      if (error.name === 'CreateLeadValidationError') {
        // Parse the error message to extract field-level errors
        const errorMessage = error.message
        const fieldErrors = errorMessage.split(', ').map(err => {
          const [field, ...messageParts] = err.split(': ')
          return {
            field: field.replace('Create lead validation failed: ', ''),
            message: messageParts.join(': ')
          }
        })

        fieldErrors.forEach(({ field, message }) => {
          if (field && message) {
            errors[field] = message
          }
        })
      } else {
        errors.general = error.message
      }
    } else {
      errors.general = 'Unknown validation error occurred'
    }

    return {
      isValid: false,
      errors
    }
  }
}

/**
 * Sanitizes and validates lead data for server-side processing
 * @param data - Raw lead data from client
 * @returns Sanitized and validated lead data
 * @throws {Error} If validation fails
 */
export function sanitizeAndValidateLeadData(data: unknown): CreateLeadData {
  const result = validateLeadCaptureData(data)

  if (!result.isValid || !result.sanitizedData) {
    const errorMessages = Object.values(result.errors).join('; ')
    throw new Error(`Lead validation failed: ${errorMessages}`)
  }

  return result.sanitizedData
}

/**
 * Validates tenant context for multi-tenant security
 * @param tenantId - Tenant ID to validate
 * @param userTenantId - User's tenant ID from context
 * @returns True if tenant context is valid
 */
export function validateTenantContext(tenantId: string, userTenantId: string): boolean {
  if (!tenantId || !userTenantId) {
    return false
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(tenantId) || !uuidRegex.test(userTenantId)) {
    return false
  }

  // Ensure tenant context matches (security check)
  return tenantId === userTenantId
}

/**
 * Extracts and validates UTM parameters from URL
 * @param url - URL to extract UTM parameters from
 * @returns Sanitized UTM parameters object
 */
export function extractAndValidateUTMParameters(url?: string): {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
} {
  if (!url) {
    return {}
  }

  try {
    const urlObj = new URL(url)
    const params: Record<string, string | undefined> = {}

    params.source = urlObj.searchParams.get('utm_source') || undefined
    params.medium = urlObj.searchParams.get('utm_medium') || undefined
    params.campaign = urlObj.searchParams.get('utm_campaign') || undefined
    params.content = urlObj.searchParams.get('utm_content') || undefined
    params.term = urlObj.searchParams.get('utm_term') || undefined

    // Sanitize UTM parameters
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (value) {
        // Remove any HTML tags and limit length
        params[key] = value.replace(/<[^>]*>/g, '').substring(0, 100)
      }
    })

    return params
  } catch {
    return {}
  }
}

/**
 * Validates and formats phone number to E.164 format
 * @param phone - Raw phone number input
 * @returns Formatted phone number in E.164 format or null if invalid
 */
export function formatPhoneNumber(phone?: string): string | null {
  if (!phone) {
    return null
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')

  // Basic validation for E.164 format
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return null
  }

  // Format as E.164 (add + if not present)
  return `+${digitsOnly}`
}

/**
 * Validates consent data for GDPR/CCPA compliance
 * @param consent - Consent data object
 * @returns True if consent is valid
 */
export function validateConsentData(consent: any): boolean {
  if (!consent || typeof consent !== 'object') {
    return false
  }

  // Processing consent is required
  if (consent.processing !== true) {
    return false
  }

  // Marketing consent should be explicitly set
  if (typeof consent.marketing !== 'boolean') {
    return false
  }

  return true
}
