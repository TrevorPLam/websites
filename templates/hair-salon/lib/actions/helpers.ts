// File: lib/actions/helpers.ts  [TRACE:FILE=lib.actions.helpers]
// Purpose: Security and utility helpers for form submission handling, providing hashing,
//          correlation tracking, and data sanitization. Implements privacy-preserving
//          identifier hashing and request context management for secure form processing.
//
// Exports / Entry: Hash functions, correlation helpers, and data sanitization utilities
// Used by: Contact form submission, booking actions, and any form processing features
//
// Invariants:
// - All identifiers must be hashed with unique salts before storage
// - IP addresses must NEVER be stored or logged in plain text
// - Correlation IDs must be preserved across request lifecycle
// - Data sanitization must prevent XSS and injection attacks
// - Hash salts must be unique per identifier type
//
// Status: @internal
// Features:
// - [FEAT:SECURITY] Privacy-preserving identifier hashing
// - [FEAT:MONITORING] Request correlation and tracking
// - [FEAT:SANITIZATION] XSS prevention and data cleaning
// - [FEAT:PRIVACY] GDPR-compliant data handling
// - [FEAT:VALIDATION] Request origin validation

import { createHash } from 'crypto';
import type { ContactFormData } from '@/features/contact/lib/contact-form-schema';
import { escapeHtml, sanitizeEmail, sanitizeName, logError, logWarn } from '@repo/infra';
import { validateOrigin, createValidationConfig } from '@repo/infra/security/request-validation';
import { validatedEnv } from '../env';
import type { SanitizedContactData } from './types';
import type { SpanAttributes } from '@repo/infra';

/**
 * Salts for hashing to prevent rainbow table attacks.
 */
// [TRACE:CONST=lib.actions.hashSalts]
// [FEAT:SECURITY] [FEAT:PRIVACY]
// NOTE: Unique salts - prevents rainbow table attacks and ensures hash uniqueness per identifier type.
const IP_HASH_SALT = 'contact_form_ip';
const EMAIL_HASH_SALT = 'contact_form_email';
const SPAN_HASH_SALT = 'contact_form_span';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

// [TRACE:FUNC=lib.actions.getCorrelationIdFromHeaders]
// [FEAT:MONITORING] [FEAT:VALIDATION]
// NOTE: Correlation extraction - retrieves request correlation ID for distributed tracing and debugging.
export function getCorrelationIdFromHeaders(requestHeaders: Headers): string | undefined {
  return requestHeaders.get(CORRELATION_ID_HEADER) ?? undefined;
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
// [TRACE:FUNC=lib.actions.hashIdentifier]
// [FEAT:SECURITY] [FEAT:PRIVACY]
// NOTE: Core hashing function - implements salted SHA-256 hashing for privacy-preserving identifier storage.
export function hashIdentifier(value: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

// [TRACE:FUNC=lib.actions.hashIp]
// [FEAT:SECURITY] [FEAT:PRIVACY]
// NOTE: IP hashing wrapper - prevents accidental salt mix-ups for IP address hashing.
export function hashIp(value: string): string {
  // WHY: Explicit helper prevents accidental salt mix-ups for IP hashing.
  return hashIdentifier(value, IP_HASH_SALT);
}

// [TRACE:FUNC=lib.actions.hashEmail]
// [FEAT:SECURITY] [FEAT:PRIVACY]
// NOTE: Email hashing wrapper - provides consistent email hashing across the application.
export function hashEmail(value: string): string {
  return hashIdentifier(value, EMAIL_HASH_SALT);
}

// [TRACE:FUNC=lib.actions.hashSpanValue]
// [FEAT:MONITORING] [FEAT:PRIVACY]
// NOTE: Span hashing wrapper - enables privacy-preserving correlation tracking in monitoring systems.
export function hashSpanValue(value: string): string {
  return hashIdentifier(value, SPAN_HASH_SALT);
}

// [TRACE:FUNC=lib.actions.buildContactSpanAttributes]
// [FEAT:MONITORING] [FEAT:PRIVACY]
// NOTE: Span attributes builder - creates privacy-preserving monitoring attributes with hashed identifiers.
export function buildContactSpanAttributes(emailHash: string, ipHash: string): SpanAttributes {
  return {
    email_hash: emailHash,
    ip_hash: ipHash,
  };
}

export function buildLeadSpanAttributes(leadId: string, emailHash: string): SpanAttributes {
  return {
    lead_id_hash: hashSpanValue(leadId),
    email_hash: emailHash,
  };
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || fullName;
  const lastName = parts.join(' ');

  return {
    firstName,
    lastName: lastName || undefined,
  };
}

export function buildHubSpotIdempotencyKey(leadId: string, emailHash: string) {
  return hashSpanValue(`${leadId}:${emailHash}`);
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Unknown HubSpot sync error');
}

export function getBlockedSubmissionResponse(requestHeaders: Headers, data: ContactFormData) {
  const config = createValidationConfig(validatedEnv.NEXT_PUBLIC_SITE_URL, { warn: logWarn });
  if (!validateOrigin(requestHeaders, config).isValid) {
    logError('CSRF: Invalid origin detected');
    return {
      success: false,
      message: 'Invalid request. Please refresh the page and try again.',
    };
  }

  if (data.website) {
    logWarn('Honeypot field triggered for contact form submission');
    return {
      success: false,
      message: 'Unable to submit your message. Please try again.',
    };
  }

  return null;
}

export function buildSanitizedContactData(
  validatedData: ContactFormData,
  clientIp: string
): SanitizedContactData {
  const hashedIp = hashIp(clientIp);
  const safeEmail = sanitizeEmail(validatedData.email);
  const safeName = sanitizeName(validatedData.name);
  const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : '';
  const safeMessage = escapeHtml(validatedData.message);
  const emailHash = hashEmail(safeEmail);

  return {
    safeEmail,
    safeName,
    safePhone,
    safeMessage,
    emailHash,
    hashedIp,
    contactSpanAttributes: buildContactSpanAttributes(emailHash, hashedIp),
  };
}
