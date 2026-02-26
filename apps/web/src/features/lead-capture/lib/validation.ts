/**
 * @file apps/web/src/features/lead-capture/lib/validation.ts
 * @summary Lead data validation.
 * @description Validation functions for lead capture forms.
 */

export interface LeadData {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateLeadData(data: Partial<LeadData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim()) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
  }

  // Message validation (optional)
  if (data.message && data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
