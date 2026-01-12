/**
 * Server actions for contact form submission with rate limiting and lead capture.
 *
 * @module lib/actions
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Core server action for contact form. Single entry point for
 * all form submissions. Handles validation → rate-limiting → persistence/sync.
 *
 * **ARCHITECTURE PATTERN**: Server Action (Next.js 14+ pattern)
 * - Called directly from ContactForm.tsx via `submitContactForm(data)`
 * - Runs server-side only (no API route needed)
 * - Returns { success, message, errors? } response object
 *
 * **CURRENT STATE**: Supabase + HubSpot lead pipeline (v1).
 *
 * **KEY DEPENDENCIES**:
 * - `./sanitize.ts` — XSS prevention (escapeHtml, sanitizeEmail, sanitizeName)
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
 * 1. Schema changes: Update contact-form-schema.ts first, then this file
 * 2. New fields: Add to sanitized payload before storage and sync
 * 3. Testing: See __tests__/lib/actions.rate-limit.test.ts for mocking pattern
 *
 * **SECURITY CHECKLIST** (verify after any changes):
 * - [ ] All user inputs pass through escapeHtml() before HTML context
 * - [ ] CRM payload uses sanitizeName() / sanitizeEmail()
 * - [ ] No raw IP addresses logged (use hashedIp)
 * - [ ] Errors return generic messages (no internal details)
 *
 * **KNOWN ISSUES / TECH DEBT**:
 * - [ ] In-memory rate limiter not suitable for multi-instance production
 * - [ ] No retry logic for HubSpot sync failures
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Distributed rate limiting via Upstash Redis (production) or in-memory fallback (development)
 * - Input sanitization to prevent XSS and injection attacks
 * - IP address hashing for privacy (SHA-256)
 * - Lead storage in Supabase and CRM sync to HubSpot
 *
 * **Security:**
 * - All user inputs sanitized with escapeHtml() before use
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
import { escapeHtml, sanitizeEmail, sanitizeName } from './sanitize'
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

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com'

type SupabaseLeadRow = {
  id: string
}

type HubSpotSearchResponse = {
  total: number
  results: Array<{ id: string }>
}

type HubSpotContactResponse = {
  id: string
}

function getSupabaseRestUrl() {
  return `${validatedEnv.SUPABASE_URL}/rest/v1/leads`
}

function getSupabaseHeaders() {
  return {
    apikey: validatedEnv.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${validatedEnv.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  }
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName
  const lastName = parts.join(' ')

  return {
    firstName,
    lastName: lastName || undefined,
  }
}

async function insertLead(payload: Record<string, unknown>): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseRestUrl(), {
    method: 'POST',
    headers: {
      ...getSupabaseHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([payload]),
  })

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert failed with status ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as SupabaseLeadRow[]
  if (!Array.isArray(data) || data.length === 0 || !data[0]?.id) {
    throw new Error('Supabase insert returned no lead ID')
  }

  return data[0]
}

async function updateLead(leadId: string, updates: Record<string, unknown>) {
  const response = await fetch(`${getSupabaseRestUrl()}?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: getSupabaseHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error(`Supabase update failed with status ${response.status}`)
  }
}

async function upsertHubSpotContact(properties: Record<string, string>) {
  const searchResponse = await fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: properties.email,
            },
          ],
        },
      ],
      properties: ['email'],
      limit: 1,
    }),
  })

  if (!searchResponse.ok) {
    throw new Error(`HubSpot search failed with status ${searchResponse.status}`)
  }

  const searchData = (await searchResponse.json()) as HubSpotSearchResponse
  const existingId = searchData.results[0]?.id
  const url = existingId
    ? `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`
    : `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`;
  const method = existingId ? 'PATCH' : 'POST';

  const contactResponse = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  });

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text();
    throw new Error(`HubSpot upsert failed with status ${contactResponse.status}: ${errorText}`)
  }

  return (await contactResponse.json()) as HubSpotContactResponse
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

    const safeEmail = sanitizeEmail(validatedData.email)
    const safeName = sanitizeName(validatedData.name)
    const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : ''
    const safeMessage = escapeHtml(validatedData.message)

    // Rate limiting check
    const rateLimitPassed = await checkRateLimit(safeEmail, clientIp)
    const isSuspicious = !rateLimitPassed

    const lead = await insertLead({
      name: safeName,
      email: safeEmail,
      phone: safePhone,
      message: safeMessage,
      is_suspicious: isSuspicious,
      suspicion_reason: isSuspicious ? 'rate_limit' : null,
      hubspot_sync_status: 'pending',
    })

    if (isSuspicious) {
      logWarn('Rate limit exceeded for contact form', {
        emailHash: hashEmail(safeEmail),
        ip: hashedIp,
      })
    }

    const { firstName, lastName } = splitName(safeName)
    const hubspotProperties: Record<string, string> = {
      email: safeEmail,
      firstname: firstName,
    }

    if (lastName) {
      hubspotProperties.lastname = lastName
    }

    if (safePhone) {
      hubspotProperties.phone = safePhone
    }

    const syncAttemptedAt = new Date().toISOString()

    try {
      const contact = await upsertHubSpotContact(hubspotProperties)
      await updateLead(lead.id, {
        hubspot_contact_id: contact.id,
        hubspot_sync_status: 'synced',
        hubspot_last_sync_attempt: syncAttemptedAt,
      })
      logInfo('HubSpot contact synced', { leadId: lead.id, emailHash: hashEmail(safeEmail) })
    } catch (syncError) {
      logError('HubSpot sync failed', syncError)
      try {
        await updateLead(lead.id, {
          hubspot_sync_status: 'needs_sync',
          hubspot_last_sync_attempt: syncAttemptedAt,
        })
      } catch (updateError) {
        logError('Failed to update HubSpot sync status', updateError)
      }
    }

    if (!rateLimitPassed) {
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
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
