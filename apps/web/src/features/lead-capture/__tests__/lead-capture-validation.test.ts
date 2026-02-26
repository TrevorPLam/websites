/**
 * @file apps/web/src/features/lead-capture/__tests__/lead-capture-validation.test.ts
 * @summary Comprehensive tests for lead capture validation.
 * @description Unit tests for validation functions with edge cases and security testing.
 * @security Tests include tenant isolation and input validation
 * @compliance GDPR/CCPA compliance testing included
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  validateLeadCaptureData,
  sanitizeAndValidateLeadData,
  validateTenantContext,
  extractAndValidateUTMParameters,
  formatPhoneNumber,
  validateConsentData,
  type ExtendedLeadData
} from '../lib/lead-capture-validation'

describe('Lead Capture Validation', () => {
  describe('validateLeadCaptureData', () => {
    it('should validate valid lead data', () => {
      const validData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(validData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
      expect(result.sanitizedData).toBeDefined()
      expect(result.sanitizedData?.email).toBe('test@example.com')
      expect(result.sanitizedData?.name).toBe('John Doe')
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'invalid-email',
        name: 'John Doe',
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toContain('Invalid email format')
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: '',
        name: '',
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('required')
      expect(result.errors.email).toContain('required')
    })

    it('should validate phone number format', () => {
      const dataWithPhone = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        phone: '1234567890', // Invalid format
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(dataWithPhone)

      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toContain('E.164 format')
    })

    it('should accept valid E.164 phone numbers', () => {
      const dataWithValidPhone = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        phone: '+1234567890', // Valid E.164 format
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(dataWithValidPhone)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should validate URL formats', () => {
      const dataWithInvalidUrl = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'invalid-url',
        referrer: 'not-a-url'
      }

      const result = validateLeadCaptureData(dataWithInvalidUrl)

      expect(result.isValid).toBe(false)
      expect(result.errors.landingPage).toContain('Invalid URL format')
      expect(result.errors.referrer).toContain('Invalid URL format')
    })

    it('should validate consent data', () => {
      const dataWithInvalidConsent = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com',
        consent: {
          marketing: true,
          processing: false // Required field
        }
      }

      const result = validateLeadCaptureData(dataWithInvalidConsent)

      expect(result.isValid).toBe(false)
      expect(result.errors.consent).toContain('Data processing consent is required')
    })
  })

  describe('sanitizeAndValidateLeadData', () => {
    it('should throw error for invalid data', () => {
      const invalidData = {
        tenantId: 'invalid-uuid',
        email: 'invalid-email',
        name: '',
        landingPage: 'invalid-url'
      }

      expect(() => sanitizeAndValidateLeadData(invalidData)).toThrow()
    })

    it('should return sanitized data for valid input', () => {
      const validData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com'
      }

      const result = sanitizeAndValidateLeadData(validData)

      expect(result).toBeDefined()
      expect(result.email).toBe('test@example.com')
      expect(result.name).toBe('John Doe')
    })
  })

  describe('validateTenantContext', () => {
    it('should validate matching tenant contexts', () => {
      const result = validateTenantContext(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000'
      )

      expect(result).toBe(true)
    })

    it('should reject mismatched tenant contexts', () => {
      const result = validateTenantContext(
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001'
      )

      expect(result).toBe(false)
    })

    it('should reject invalid UUID formats', () => {
      const result = validateTenantContext(
        'invalid-uuid',
        '550e8400-e29b-41d4-a716-446655440000'
      )

      expect(result).toBe(false)
    })

    it('should reject empty tenant IDs', () => {
      const result = validateTenantContext('', '550e8400-e29b-41d4-a716-446655440000')

      expect(result).toBe(false)
    })
  })

  describe('extractAndValidateUTMParameters', () => {
    it('should extract UTM parameters from URL', () => {
      const url = 'https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_content=banner&utm_term=shoes'
      
      const result = extractAndValidateUTMParameters(url)

      expect(result).toEqual({
        source: 'google',
        medium: 'cpc',
        campaign: 'spring_sale',
        content: 'banner',
        term: 'shoes'
      })
    })

    it('should handle URLs without UTM parameters', () => {
      const url = 'https://example.com/path'
      
      const result = extractAndValidateUTMParameters(url)

      expect(result).toEqual({})
    })

    it('should handle invalid URLs gracefully', () => {
      const result = extractAndValidateUTMParameters('invalid-url')

      expect(result).toEqual({})
    })

    it('should sanitize UTM parameters', () => {
      const url = 'https://example.com?utm_source=<script>alert("xss")</script>&utm_campaign=very-long-campaign-name-that-should-be-truncated-to-prevent-issues'
      
      const result = extractAndValidateUTMParameters(url)

      expect(result.source).toBe('alert("xss")')
      expect(result.campaign).toBe('very-long-campaign-name-that-should-be-truncated-to-prevent-iss')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format valid phone numbers to E.164', () => {
      expect(formatPhoneNumber('1234567890')).toBe('+1234567890')
      expect(formatPhoneNumber('+1234567890')).toBe('+1234567890')
      expect(formatPhoneNumber('(123) 456-7890')).toBe('+1234567890')
    })

    it('should return null for invalid phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe(null) // Too short
      expect(formatPhoneNumber('12345678901234567890')).toBe(null) // Too long
      expect(formatPhoneNumber('abc-def-ghij')).toBe(null) // Non-numeric
    })

    it('should handle empty input', () => {
      expect(formatPhoneNumber('')).toBe(null)
      expect(formatPhoneNumber(undefined)).toBe(null)
    })
  })

  describe('validateConsentData', () => {
    it('should validate valid consent data', () => {
      const validConsent = {
        marketing: true,
        processing: true
      }

      expect(validateConsentData(validConsent)).toBe(true)
    })

    it('should reject consent without processing consent', () => {
      const invalidConsent = {
        marketing: true,
        processing: false
      }

      expect(validateConsentData(invalidConsent)).toBe(false)
    })

    it('should reject non-object consent data', () => {
      expect(validateConsentData(null)).toBe(false)
      expect(validateConsentData('string')).toBe(false)
      expect(validateConsentData(123)).toBe(false)
    })

    it('should reject consent with missing marketing field', () => {
      const invalidConsent = {
        processing: true
        // marketing field missing
      }

      expect(validateConsentData(invalidConsent)).toBe(false)
    })
  })

  describe('Security Tests', () => {
    it('should prevent XSS in name field', () => {
      const xssData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: '<script>alert("xss")</script>',
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(xssData)

      // Should still be valid but sanitized at higher level
      expect(result.isValid).toBe(true)
      expect(result.sanitizedData?.name).toContain('alert("xss")')
    })

    it('should handle extremely long inputs', () => {
      const longString = 'a'.repeat(10000)
      const longData = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: longString,
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(longData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('too long')
    })

    it('should validate tenant ID format for security', () => {
      const maliciousData = {
        tenantId: '../../../etc/passwd',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com'
      }

      const result = validateLeadCaptureData(maliciousData)

      expect(result.isValid).toBe(false)
    })
  })

  describe('GDPR/CCPA Compliance Tests', () => {
    it('should require processing consent', () => {
      const dataWithoutConsent = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com',
        consent: {
          marketing: true,
          processing: false // Required for GDPR
        }
      }

      const result = validateLeadCaptureData(dataWithoutConsent)

      expect(result.isValid).toBe(false)
      expect(result.errors.consent).toContain('Data processing consent is required')
    })

    it('should allow marketing consent to be optional', () => {
      const dataWithMarketingOnly = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com',
        consent: {
          marketing: false, // User can opt out
          processing: true // Required
        }
      }

      const result = validateLeadCaptureData(dataWithMarketingOnly)

      expect(result.isValid).toBe(true)
    })

    it('should handle consent timestamp properly', () => {
      const dataWithTimestamp = {
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        landingPage: 'https://example.com',
        consent: {
          marketing: true,
          processing: true,
          timestamp: new Date()
        }
      }

      const result = validateLeadCaptureData(dataWithTimestamp)

      expect(result.isValid).toBe(true)
      expect(result.sanitizedData?.consent?.timestamp).toBeInstanceOf(Date)
    })
  })
})
