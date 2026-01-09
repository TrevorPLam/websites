/**
 * Server actions for contact form submission with rate limiting and email delivery.
 *
 * @module lib/actions
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Core server action for contact form. Single entry point for
 * all form submissions. Handles validation → rate-limiting → persistence/email.
 *
 * **ARCHITECTURE PATTERN**: Server Action (Next.js 14+ pattern)
 * - Called directly from ContactForm.tsx via `submitContactForm(data)`
 * - Runs server-side only (no API route needed)
 * - Returns { success, message, errors? } response object
 *
 * **CURRENT STATE**: Email-based. Tracked in TODO: T-080, T-081, T-082
 * - RESEND_API_KEY present → sends email
 * - RESEND_API_KEY absent → logs only (dev mode)
 *
 * **KEY DEPENDENCIES**:
 * - `./sanitize.ts` — XSS prevention (escapeHtml, sanitizeEmailSubject)
 * - `./env.ts` — Server-only env validation (validatedEnv)
 * - `./contact-form-schema.ts` — Zod schema (contactFormSchema)
 * - `@upstash/ratelimit` — Distributed rate limiting (optional)
 *
 * **RATE LIMIT DESIGN**:
 * - Dual limiting: per-email AND per-IP (both must pass)
 * - 3 requests/hour per identifier
 * - IP hashed with SHA-256 before storage (privacy)
 * - Falls back to in-memory Map when Upstash not configured
 *
 * **AI ITERATION HINTS**:
 * 1. To add Supabase: Insert between rate-limit check and email send (line ~320)
 * 2. To add HubSpot: After Supabase insert, wrap in try/catch for best-effort
 * 3. Schema changes: Update contact-form-schema.ts first, then this file
 * 4. New fields: Add to safeName/safeEmail pattern (sanitize ALL inputs)
 * 5. Testing: See __tests__/lib/actions.rate-limit.test.ts for mocking pattern
 *
 * **SECURITY CHECKLIST** (verify after any changes):
 * - [ ] All user inputs pass through escapeHtml() before HTML context
 * - [ ] Email subject uses sanitizeEmailSubject()
 * - [ ] No raw IP addresses logged (use hashedIp)
 * - [ ] Errors return generic messages (no internal details)
 *
 * **KNOWN ISSUES / TECH DEBT**:
 * - [ ] T-080/T-081/T-082: Email flow to be replaced with Supabase+HubSpot
 * - [ ] In-memory rate limiter not suitable for multi-instance production
 * - [ ] No retry logic for email delivery failures
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Distributed rate limiting via Upstash Redis (production) or in-memory fallback (development)
 * - Input sanitization to prevent XSS and email header injection attacks
 * - IP address hashing for privacy (SHA-256)
 * - Email delivery via Resend API with graceful fallback
 *
 * **Security:**
 * - All user inputs sanitized with escapeHtml() before use
 * - Email subjects sanitized to prevent header injection
 * - IP addresses hashed before storage (never logged in plain text)
 * - Rate limits enforced per email address AND per IP address
 * - Payload size limited by middleware (1MB max)
 *
 * **Error Handling:**
 * - Validation errors return user-friendly messages
 * - Rate limit errors return "try again later" message
 * - Network/API errors logged to Sentry, return generic error message
 */

'use server'
import { createHash } from 'crypto'
import { headers } from 'next/headers'
import { z } from 'zod'
import { logError, logWarn, logInfo } from './logger'
import { escapeHtml, sanitizeEmailSubject, textToHtmlParagraphs } from './sanitize'
import { validatedEnv } from './env'
import { contactFormSchema, type ContactFormData } from '@/lib/contact-form-schema'

/**
 * Rate limiting configuration.
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 */
const RATE_LIMIT_MAX_REQUESTS = 3
const RATE_LIMIT_WINDOW = '1 h' // 1 hour

/**
 * Rate limiter interface for distributed (Upstash) rate limiting.
 */
type RateLimiter = {
  limit: (identifier: string) => Promise<{ success: boolean }>
}

/**
 * Rate limiter instance (null = not initialized, false = fallback to in-memory).
 */
let rateLimiter: RateLimiter | null | false = null

/**
 * In-memory rate limit tracking (fallback when Upstash is not configured).
 * Maps identifier to request count and reset timestamp.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

/**
 * Salts for hashing to prevent rainbow table attacks.
 */
const IP_HASH_SALT = 'contact_form_ip'
const EMAIL_HASH_SALT = 'contact_form_email'

/**
 * Hash an identifier (email or IP) for privacy and storage.
 * 
 * Uses SHA-256 with salt to prevent rainbow table attacks.
 * IP addresses are NEVER stored or logged in plain text.
 * 
 * @param value - The value to hash (email or IP address)
 * @returns Hex-encoded SHA-256 hash
 */
function hashIdentifier(value: string, salt = IP_HASH_SALT): string {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex')
}

function hashEmail(value: string): string {
  return hashIdentifier(value, EMAIL_HASH_SALT)
}

/**
 * Get client IP address from request headers.
 * 
 * Checks multiple headers in order of preference:
 * 1. x-forwarded-for (standard proxy header)
 * 2. x-vercel-forwarded-for (Vercel-specific)
 * 3. x-real-ip (nginx)
 * 4. cf-connecting-ip (Cloudflare)
 * 
 * If multiple IPs are present (comma-separated), returns the first one.
 * 
 * @returns Client IP address or 'unknown' if not available
 */
async function getClientIp(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor =
    requestHeaders.get('x-forwarded-for') ||
    requestHeaders.get('x-vercel-forwarded-for') ||
    requestHeaders.get('x-real-ip') ||
    requestHeaders.get('cf-connecting-ip')

  if (!forwardedFor) {
    return 'unknown'
  }

  return forwardedFor.split(',')[0]?.trim() || 'unknown'
}

/**
 * Initialize rate limiter with Upstash Redis (distributed) or fallback to in-memory.
 * 
 * **Distributed (Production):**
 * - Uses Upstash Redis for multi-instance rate limiting
 * - Sliding window algorithm (3 requests per hour)
 * - Analytics enabled for monitoring
 * 
 * **In-Memory (Development/Fallback):**
 * - Uses Map for single-instance rate limiting
 * - Not suitable for production (does not sync across instances)
 * - Used when UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set
 * 
 * @returns RateLimiter instance or null for in-memory fallback
 */
async function getRateLimiter() {
  if (rateLimiter !== null) {
    return rateLimiter
  }

  // Check if Upstash credentials are configured
  if (validatedEnv.UPSTASH_REDIS_REST_URL && validatedEnv.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: validatedEnv.UPSTASH_REDIS_REST_URL,
        token: validatedEnv.UPSTASH_REDIS_REST_TOKEN,
      })

      rateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW),
        analytics: true,
        prefix: 'contact_form',
      })

      logInfo('Initialized distributed rate limiting with Upstash Redis')
      return rateLimiter
    } catch (error) {
      logError('Failed to initialize Upstash rate limiter, falling back to in-memory', error)
    }
  } else {
    logWarn(
      'Upstash Redis not configured, using in-memory rate limiting (not suitable for production)'
    )
  }

  // Return null to indicate fallback to in-memory
  rateLimiter = false // Sentinel value to prevent re-initialization attempts
  return null
}

/**
 * Check rate limit using in-memory storage (fallback when Upstash unavailable).
 * 
 * **Algorithm:**
 * - Fixed window: 1 hour sliding
 * - Automatically cleans up expired entries
 * - Stores count and reset timestamp per identifier
 * 
 * **Limitations:**
 * - NOT suitable for production (single-instance only)
 * - Does not sync across multiple server instances
 * - Memory usage grows with unique identifiers (auto-cleaned on expiry)
 * 
 * @param identifier - Unique identifier (email:xxx or ip:hash)
 * @returns true if request allowed, false if rate limit exceeded
 */
function checkRateLimitInMemory(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (limit && now > limit.resetAt) {
    rateLimitMap.delete(identifier)
  }

  const existing = rateLimitMap.get(identifier)
  if (!existing) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour
    return true
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  existing.count++
  return true
}

/**
 * Check rate limits for both email and IP address.
 * 
 * **Dual Rate Limiting:**
 * - Enforces limits per email address (prevents single user spam)
 * - Enforces limits per IP address (prevents distributed attacks)
 * - BOTH limits must pass for request to be allowed
 * 
 * **Implementation:**
 * - Uses Upstash Redis if configured (production)
 * - Falls back to in-memory if not configured (development)
 * 
 * @param email - User's email address (not hashed for email-based limiting)
 * @param clientIp - Client IP address (hashed before storage)
 * @returns true if both limits pass, false if either limit exceeded
 */
async function checkRateLimit(email: string, clientIp: string): Promise<boolean> {
  const limiter = await getRateLimiter()
  const emailIdentifier = `email:${email}`
  const ipIdentifier = `ip:${hashIdentifier(clientIp)}`

  if (limiter) {
    // Use Upstash distributed rate limiting
    const emailLimit = await limiter.limit(emailIdentifier)
    if (!emailLimit.success) {
      return false
    }

    const ipLimit = await limiter.limit(ipIdentifier)
    return ipLimit.success
  } else {
    // Fall back to in-memory rate limiting
    const emailAllowed = checkRateLimitInMemory(emailIdentifier)
    if (!emailAllowed) {
      return false
    }

    return checkRateLimitInMemory(ipIdentifier)
  }
}

/**
 * Submit contact form with validation, rate limiting, sanitization, and email delivery.
 * 
 * **Flow:**
 * 1. Validate input with Zod schema (contactFormSchema)
 * 2. Check rate limits (email + IP)
 * 3. Sanitize all inputs to prevent XSS
 * 4. Send email via Resend API (if configured)
 * 5. Log result to Sentry (errors) and logger (info/warn)
 * 
 * **Rate Limiting:**
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 * - Uses Upstash Redis (distributed) or in-memory fallback
 * - Returns "Too many submissions" message on limit exceeded
 * 
 * **Security:**
 * - All inputs sanitized with escapeHtml() to prevent XSS
 * - Email subject sanitized to prevent header injection
 * - IP addresses hashed before storage (SHA-256 with salt)
 * - Payload size limited by middleware (1MB max)
 * - No user data stored (immediately forwarded via email)
 * 
 * **Email Delivery:**
 * - Sends via Resend API if RESEND_API_KEY configured
 * - Falls back to logging in development (no email sent)
 * - HTML email with inline styles for broad client compatibility
 * - Errors logged to Sentry in production
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
  try {
    if (data.website) {
      logWarn('Honeypot field triggered for contact form submission')
      return {
        success: false,
        message: 'Unable to submit your message. Please try again.',
      }
    }

    // Validate the data
    const validatedData = contactFormSchema.parse(data)
    const clientIp = await getClientIp()
    const hashedIp = hashIdentifier(clientIp)

    // Rate limiting check
    const rateLimitPassed = await checkRateLimit(validatedData.email, clientIp)
    if (!rateLimitPassed) {
      logWarn('Rate limit exceeded for contact form', {
        emailHash: hashEmail(validatedData.email),
        ip: hashedIp,
      })
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
    }

    // Send email via Resend API
    if (validatedEnv.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(validatedEnv.RESEND_API_KEY)

      // Sanitize all inputs to prevent XSS and injection
      const safeName = escapeHtml(validatedData.name)
      const safeEmail = escapeHtml(validatedData.email)
      const safeCompany = validatedData.company ? escapeHtml(validatedData.company) : null
      const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : null
      const safeMarketingSpend = validatedData.marketingSpend
        ? escapeHtml(validatedData.marketingSpend)
        : null
      const safeHearAboutUs = validatedData.hearAboutUs
        ? escapeHtml(validatedData.hearAboutUs)
        : null
      const safeMessage = textToHtmlParagraphs(validatedData.message)

      // Sanitize subject to prevent email header injection
      const safeSubject = sanitizeEmailSubject(
        `New Contact Form Submission from ${validatedData.name}`
      )

      await resend.emails.send({
        from: 'onboarding@resend.dev', // Use Resend's test domain or your verified domain
        to: validatedEnv.CONTACT_EMAIL,
        subject: safeSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              .field { margin: 15px 0; }
              .field strong { color: #555; }
              .message { background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Contact Form Submission</h2>
              <div class="field"><strong>Name:</strong> ${safeName}</div>
              <div class="field"><strong>Email:</strong> ${safeEmail}</div>
              ${safeCompany ? `<div class="field"><strong>Company:</strong> ${safeCompany}</div>` : ''}
              ${safePhone ? `<div class="field"><strong>Phone:</strong> ${safePhone}</div>` : ''}
              ${safeMarketingSpend ? `<div class="field"><strong>Marketing Spend:</strong> ${safeMarketingSpend}</div>` : ''}
              ${safeHearAboutUs ? `<div class="field"><strong>How they heard about us:</strong> ${safeHearAboutUs}</div>` : ''}
              <div class="message">
                <strong>Message:</strong>
                ${safeMessage}
              </div>
            </div>
          </body>
          </html>
        `,
      })

      logInfo('Contact form submitted successfully', { email: validatedData.email })
    } else {
      logWarn('RESEND_API_KEY not set - email not sent in development mode')
    }

    return { success: true, message: "Thank you for your message! We'll be in touch soon." }
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
}
