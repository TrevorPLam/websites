/**
 * Helper functions for contact form actions.
 *
 * @module lib/actions/helpers
 */

import { createHash } from 'crypto'
import type { ContactFormData } from '@/lib/contact-form-schema'
import { escapeHtml, sanitizeEmail, sanitizeName } from '../sanitize'
import { logError, logWarn } from '../logger'
import { validateOrigin } from '../request-validation'
import type { SanitizedContactData } from './types'
import type { SpanAttributes } from '../sentry-server'

/**
 * Salts for hashing to prevent rainbow table attacks.
 */
const IP_HASH_SALT = 'contact_form_ip'
const EMAIL_HASH_SALT = 'contact_form_email'
const SPAN_HASH_SALT = 'contact_form_span'

export const CORRELATION_ID_HEADER = 'x-correlation-id'

export function getCorrelationIdFromHeaders(requestHeaders: Headers): string | undefined {
  return requestHeaders.get(CORRELATION_ID_HEADER) ?? undefined
}

/**
 * Hash an identifier (email or IP) for privacy and storage.
 * 
 * Uses SHA-256 with salt to prevent rainbow table attacks.
 * IP addresses are NEVER stored or logged in plain text.
 * 
 * @param value - The value to hash (email or IP address)
 * @returns Hex-encoded SHA-256 hash
 */
export function hashIdentifier(value: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex')
}

export function hashIp(value: string): string {
  // WHY: Explicit helper prevents accidental salt mix-ups for IP hashing.
  return hashIdentifier(value, IP_HASH_SALT)
}

export function hashEmail(value: string): string {
  return hashIdentifier(value, EMAIL_HASH_SALT)
}

export function hashSpanValue(value: string): string {
  return hashIdentifier(value, SPAN_HASH_SALT)
}

export function buildContactSpanAttributes(emailHash: string, ipHash: string): SpanAttributes {
  return {
    email_hash: emailHash,
    ip_hash: ipHash,
  }
}

export function buildLeadSpanAttributes(leadId: string, emailHash: string): SpanAttributes {
  return {
    lead_id_hash: hashSpanValue(leadId),
    email_hash: emailHash,
  }
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || undefined,
  }
}

export function buildHubSpotIdempotencyKey(leadId: string, emailHash: string) {
  return hashSpanValue(`${leadId}:${emailHash}`)
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown HubSpot sync error')
}

export function getBlockedSubmissionResponse(requestHeaders: Headers, data: ContactFormData) {
  if (!validateOrigin(requestHeaders)) {
    logError('CSRF: Invalid origin detected')
    return {
      success: false,
      message: 'Invalid request. Please refresh the page and try again.',
    }
  }

  if (data.website) {
    logWarn('Honeypot field triggered for contact form submission')
    return {
      success: false,
      message: 'Unable to submit your message. Please try again.',
    }
  }

  return null
}

export function buildSanitizedContactData(
  validatedData: ContactFormData,
  clientIp: string,
): SanitizedContactData {
  const hashedIp = hashIp(clientIp)
  const safeEmail = sanitizeEmail(validatedData.email)
  const safeName = sanitizeName(validatedData.name)
  const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : ''
  const safeMessage = escapeHtml(validatedData.message)
  const emailHash = hashEmail(safeEmail)

  return {
    safeEmail,
    safeName,
    safePhone,
    safeMessage,
    emailHash,
    hashedIp,
    contactSpanAttributes: buildContactSpanAttributes(emailHash, hashedIp),
  }
}
