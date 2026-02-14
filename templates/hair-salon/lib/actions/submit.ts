// File: lib/actions/submit.ts  [TRACE:FILE=lib.actions.submit]
// Purpose: Contact form submission handler with comprehensive security, validation, and lead
//          management. Implements rate limiting, input sanitization, fraud detection, and
//          integration with Supabase and HubSpot for customer relationship management.
//
// Exports / Entry: submitContactForm function
// Used by: ContactForm component, API endpoints, and any contact submission features
//
// Invariants:
// - All submissions must be validated against security schemas
// - Rate limiting must be enforced per email and IP address
// - PII must be sanitized and hashed before storage
// - Lead insertion to Supabase is required (must not fail silently)
// - HubSpot sync is best-effort (failures must be logged but not block)
// - IP addresses must be validated against trusted proxy headers
//
// Status: @internal
// Features:
// - [FEAT:CONTACT] Contact form submission and validation
// - [FEAT:SECURITY] Rate limiting, sanitization, and fraud detection
// - [FEAT:INTEGRATION] Supabase lead storage and HubSpot CRM sync
// - [FEAT:MONITORING] Error logging and correlation tracking
// - [FEAT:PERFORMANCE] Distributed rate limiting with Redis fallback

'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  contactFormSchema,
  type ContactFormData,
} from '@/features/contact/lib/contact-form-schema';
import { logError, checkRateLimit, withServerSpan } from '@repo/infra';
import { runWithRequestId } from '@repo/infra/context/request-context.server';
import { getValidatedClientIp } from '@repo/infra/security/request-validation';
import {
  getCorrelationIdFromHeaders,
  hashSpanValue,
  hashIp,
  getBlockedSubmissionResponse,
  buildSanitizedContactData,
} from './helpers';
import { insertLeadWithSpan, syncHubSpotLead } from './supabase';

/**
 * Get validated client IP address from request headers (Issue #011 fixed).
 *
 * In production, only trusts headers from known proxies (Cloudflare/Vercel).
 * Prevents IP spoofing attacks that bypass rate limiting.
 *
 * @returns Client IP address or 'unknown' if not available
 */
// [TRACE:FUNC=lib.actions.getClientIp]
// [FEAT:SECURITY] [FEAT:MONITORING]
// NOTE: IP validation - prevents spoofing attacks and ensures accurate rate limiting.
async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  return getValidatedClientIp(requestHeaders, { environment: process.env.NODE_ENV as any });
}

// [TRACE:FUNC=lib.actions.handleContactFormSubmission]
// [FEAT:CONTACT] [FEAT:SECURITY] [FEAT:INTEGRATION]
// NOTE: Core submission handler - orchestrates validation, rate limiting, sanitization, and lead capture.
async function handleContactFormSubmission(data: ContactFormData, requestHeaders: Headers) {
  const blockedResponse = getBlockedSubmissionResponse(requestHeaders, data);
  if (blockedResponse) {
    return blockedResponse;
  }

  const validatedData = contactFormSchema.parse(data);
  const clientIp = await getClientIp();
  const sanitized = buildSanitizedContactData(validatedData, clientIp);

  const rateLimitPassed = await checkRateLimit({
    email: sanitized.safeEmail,
    clientIp,
    hashIp,
  });
  const isSuspicious = !rateLimitPassed;

  const lead = await insertLeadWithSpan(sanitized, isSuspicious);
  await syncHubSpotLead(lead.id, sanitized);

  if (!rateLimitPassed) {
    return {
      success: false,
      message: 'Too many submissions. Please try again later.',
    };
  }

  return { success: true, message: "Thank you for your message! We'll be in touch soon." };
}

/**
 * Submit contact form with validation, rate limiting, sanitization, and lead capture.
 *
 * **Flow:**
 * 1. Validate input with Zod schema (contactFormSchema)
 * 2. Check rate limits (email + IP)
 * 3. Sanitize inputs for storage and CRM sync
 * 4. Insert lead into Supabase (required)
 * 5. Attempt HubSpot sync (best-effort)
 * 6. Log result to Sentry (errors) and logger (info/warn)
 *
 * **Rate Limiting:**
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 * - Uses Upstash Redis (distributed) or in-memory fallback
 * - Returns "Too many submissions" message on limit exceeded
 *
 * **Security:**
 * - All inputs sanitized with escapeHtml() to prevent XSS
 * - IP addresses hashed before storage (SHA-256 with salt)
 * - Payload size limited by middleware (1MB max)
 * - Contact data stored in Supabase (server-only access)
 *
 * **Lead Capture:**
 * - Supabase insert is required (fails if not configured)
 * - HubSpot sync is best-effort (failures marked for retry)
 *
 * **Error Handling:**
 * - Validation errors (Zod): Returns field-specific error messages
 * - Rate limit errors: Returns "try again later" message
 * - Network/API errors: Returns generic error, logs to Sentry
 * - Never exposes internal error details to users
 *
 * @param data - Contact form data (validated against contactFormSchema)
 * @returns Success response with message or error response with details
 *
 * @throws Never throws - all errors caught and returned as response objects
 *
 * @example
 * ```typescript
 * const result = await submitContactForm({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'I need help with SEO',
 *   company: 'Acme Corp', // optional
 * });
 *
 * if (result.success) {
 *   console.log(result.message); // "Thank you for your message!"
 * } else {
 *   console.error(result.message); // User-friendly error message
 *   if (result.errors) {
 *     // Zod validation errors
 *     result.errors.forEach(err => console.error(err.message));
 *   }
 * }
 * ```
 */
// [TRACE:FUNC=lib.actions.submitContactForm]
// [FEAT:CONTACT] [FEAT:SECURITY] [FEAT:INTEGRATION] [FEAT:MONITORING]
// NOTE: Public API endpoint - handles complete submission flow with comprehensive error handling.
export async function submitContactForm(data: ContactFormData) {
  const requestHeaders = await headers();
  const correlationId = getCorrelationIdFromHeaders(requestHeaders);
  const correlationIdHash = correlationId ? hashSpanValue(correlationId) : undefined;

  return runWithRequestId(correlationId, async () => {
    return withServerSpan(
      {
        name: 'contact_form.submit',
        op: 'action',
        attributes: {
          request_id_hash: correlationIdHash,
        },
      },
      async () => {
        try {
          return await handleContactFormSubmission(data, requestHeaders);
        } catch (error) {
          logError('Contact form submission error', error);

          if (error instanceof z.ZodError) {
            return {
              success: false,
              message: 'Please check your form inputs and try again.',
              errors: error.issues,
            };
          }

          return {
            success: false,
            message: 'Something went wrong. Please try again or email us directly.',
          };
        }
      }
    );
  });
}
