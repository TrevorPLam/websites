/**
 * Main submission handler for contact form.
 *
 * @module lib/actions/submit
 */

'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { contactFormSchema, type ContactFormData } from '@/lib/contact-form-schema'
import { logError } from '../logger'
import { runWithRequestId } from '../request-context.server'
import { withServerSpan } from '../sentry-server'
import { checkRateLimit } from '../rate-limit'
import { getValidatedClientIp } from '../request-validation'
import {
  getCorrelationIdFromHeaders,
  hashSpanValue,
  hashIp,
  getBlockedSubmissionResponse,
  buildSanitizedContactData,
} from './helpers'
import { insertLeadWithSpan, syncHubSpotLead } from './supabase'

/**
 * Get validated client IP address from request headers (Issue #011 fixed).
 * 
 * In production, only trusts headers from known proxies (Cloudflare/Vercel).
 * Prevents IP spoofing attacks that bypass rate limiting.
 * 
 * @returns Client IP address or 'unknown' if not available
 */
async function getClientIp(): Promise<string> {
  const requestHeaders = await headers()
  return getValidatedClientIp(requestHeaders)
}

async function handleContactFormSubmission(data: ContactFormData, requestHeaders: Headers) {
  const blockedResponse = getBlockedSubmissionResponse(requestHeaders, data)
  if (blockedResponse) {
    return blockedResponse
  }

  const validatedData = contactFormSchema.parse(data)
  const clientIp = await getClientIp()
  const sanitized = buildSanitizedContactData(validatedData, clientIp)

  const rateLimitPassed = await checkRateLimit({
    email: sanitized.safeEmail,
    clientIp,
    hashIp,
  })
  const isSuspicious = !rateLimitPassed

  const lead = await insertLeadWithSpan(sanitized, isSuspicious)
  await syncHubSpotLead(lead.id, sanitized)

  if (!rateLimitPassed) {
    return {
      success: false,
      message: 'Too many submissions. Please try again later.',
    }
  }

  return { success: true, message: "Thank you for your message! We'll be in touch soon." }
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
export async function submitContactForm(data: ContactFormData) {
  const requestHeaders = await headers()
  const correlationId = getCorrelationIdFromHeaders(requestHeaders)
  const correlationIdHash = correlationId ? hashSpanValue(correlationId) : undefined

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
          return await handleContactFormSubmission(data, requestHeaders)
        } catch (error) {
          logError('Contact form submission error', error)

          if (error instanceof z.ZodError) {
            return {
              success: false,
              message: 'Please check your form inputs and try again.',
              errors: error.issues,
            }
          }

          return {
            success: false,
            message: 'Something went wrong. Please try again or email us directly.',
          }
        }
      },
    )
  })
}
