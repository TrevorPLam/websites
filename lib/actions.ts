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
 * - Falls back to in-memory Map when Upstash not configured (logged with missing keys)
 *
 * **AI ITERATION HINTS**:
 * 1. Schema changes: Update contact-form-schema.ts first, then this file
 * 2. New fields: Add to sanitized payload before storage and sync
 * 3. Testing: See __tests__/lib/actions.rate-limit.test.ts for mocking pattern
 *
 * **SECURITY CHECKLIST** (verify after any changes):
 * - [x] All user inputs pass through escapeHtml() before HTML context
 * - [x] CRM payload uses sanitizeName() / sanitizeEmail()
 * - [x] No raw IP addresses logged (use hashedIp)
 * - [x] Errors return generic messages (no internal details)
 * - [x] CSRF protection validates origin/referer headers
 * - [x] IP validation only trusts known proxy headers
 *
 * **RESOLVED ISSUES** (completed in transformation):
 * - [x] ~~In-memory rate limiter not suitable for multi-instance production~~ (FIXED: Issue #005)
 *       Production now enforces Upstash Redis at startup (lib/env.ts)
 * - [x] ~~No CSRF protection~~ (FIXED: Issue #010)
 *       Origin validation added with defense-in-depth approach
 * - [x] ~~IP header spoofing possible~~ (FIXED: Issue #011)
 *       Only trusted proxy headers accepted in production
 *
 * **REMAINING TECH DEBT**:
 * - [ ] No retry logic for HubSpot sync failures (tracked in Phase 5)
 *       Workaround: Failed syncs marked as `needs_sync` in database
 * - [ ] No performance monitoring for server action timing (tracked in Phase 4)
 *       Workaround: Sentry captures errors with context
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
import { validatedEnv, isProduction } from './env'
import { contactFormSchema, type ContactFormData } from '@/lib/contact-form-schema'
import { runWithRequestId } from './request-context.server'
import { withServerSpan, type SpanAttributes } from './sentry-server'

const CORRELATION_ID_HEADER = 'x-correlation-id'

/**
 * Extract expected host from headers or fallback to configured site URL.
 * 
 * Helper function to centralize host extraction logic.
 * 
 * @param host - Host header value
 * @returns Expected hostname without protocol
 * 
 * @example
 * ```typescript
 * getExpectedHost('example.com') // => 'example.com'
 * getExpectedHost(null) // => 'yourdedicatedmarketer.com' (from env)
 * ```
 */
function getExpectedHost(host: string | null): string {
  return host || validatedEnv.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')
}

/**
 * Validate a single header URL against expected host.
 * 
 * Extracted helper to reduce duplication in validateOrigin().
 * 
 * @param headerValue - URL from origin or referer header
 * @param expectedHost - Expected hostname
 * @param headerName - Name of header for logging (origin/referer)
 * @returns true if valid, false otherwise
 * 
 * @throws Never throws - catches and logs URL parsing errors
 */
function validateHeaderUrl(
  headerValue: string,
  expectedHost: string,
  headerName: 'origin' | 'referer'
): boolean {
  try {
    const url = new URL(headerValue)
    if (url.host !== expectedHost) {
      logWarn(`CSRF: ${headerName} mismatch`, { [headerName]: headerValue, expectedHost })
      return false
    }
    return true
  } catch {
    logWarn(`CSRF: Invalid ${headerName} URL`, { [headerName]: headerValue })
    return false
  }
}

/**
 * Validate request origin to prevent CSRF attacks (Issue #010 - Fixed).
 * 
 * **Security:** Checks that the request comes from our own domain.
 * Requires at least one of origin/referer to be present.
 * If both are present, BOTH must match (defense in depth).
 * 
 * **Why This Matters:**
 * - Prevents cross-site form submissions
 * - Blocks automated attacks from external domains
 * - Complements rate limiting (different attack vector)
 * 
 * @param requestHeaders - Request headers from Next.js headers()
 * @returns true if origin is valid, false if potentially malicious
 * 
 * @example
 * ```typescript
 * // Valid request from same domain
 * validateOrigin(headers) // => true
 * 
 * // Attack from external site
 * validateOrigin(headers) // => false, logs warning
 * ```
 */
function validateOrigin(requestHeaders: Headers): boolean {
  const origin = requestHeaders.get('origin')
  const referer = requestHeaders.get('referer')
  const host = requestHeaders.get('host')
  
  // If no origin/referer (direct API call), reject
  if (!origin && !referer) {
    logWarn('CSRF: No origin or referer header')
    return false
  }
  
  const expectedHost = getExpectedHost(host)
  
  // Check origin if present
  if (origin && !validateHeaderUrl(origin, expectedHost, 'origin')) {
    return false
  }
  
  // Check referer if present (defense in depth)
  if (referer && !validateHeaderUrl(referer, expectedHost, 'referer')) {
    return false
  }
  
  return true
}

function getCorrelationIdFromHeaders(requestHeaders: Headers): string | undefined {
  return requestHeaders.get(CORRELATION_ID_HEADER) ?? undefined
}

/**
 * Trusted proxy header configuration.
 * 
 * Maps environment to trusted headers in priority order.
 * Production only trusts headers from known CDN/hosting providers.
 */
const TRUSTED_IP_HEADERS = {
  production: [
    'cf-connecting-ip',        // Cloudflare (most trustworthy)
    'x-vercel-forwarded-for',  // Vercel Edge Network
  ],
  development: [
    'x-forwarded-for',  // Standard proxy header
    'x-real-ip',        // Nginx/other proxies
  ],
} as const

/**
 * Extract IP address from comma-separated header value.
 * 
 * Many proxies append IPs in chain: "client, proxy1, proxy2"
 * We want the leftmost (original client) IP.
 * 
 * @param headerValue - Raw header value
 * @returns First IP in chain, trimmed
 * 
 * @example
 * ```typescript
 * extractFirstIp('192.168.1.1, 10.0.0.1') // => '192.168.1.1'
 * extractFirstIp('  192.168.1.1  ') // => '192.168.1.1'
 * ```
 */
function extractFirstIp(headerValue: string): string {
  return headerValue.split(',')[0]?.trim() || 'unknown'
}

/**
 * Validate IP address from headers to prevent spoofing (Issue #011 - Enhanced).
 * 
 * **Security:** In production, only trusts headers from known proxies (Cloudflare/Vercel).
 * In development, accepts standard proxy headers but still validates.
 * 
 * **Why This Matters:**
 * - Prevents attackers from spoofing IP addresses
 * - Ensures rate limiting works correctly
 * - Different trust model per environment
 * 
 * **Trust Model:**
 * - Production: Only CDN-set headers (cf-connecting-ip, x-vercel-forwarded-for)
 * - Development: Standard proxy headers (x-forwarded-for, x-real-ip)
 * 
 * @param requestHeaders - Request headers from Next.js headers()
 * @returns Validated client IP or 'unknown' if cannot determine
 * 
 * @example
 * ```typescript
 * // Production with Cloudflare
 * getValidatedClientIp(headers) // => '203.0.113.1' (from CF-Connecting-IP)
 * 
 * // Development with nginx proxy
 * getValidatedClientIp(headers) // => '192.168.1.1' (from X-Forwarded-For)
 * 
 * // No trusted headers present
 * getValidatedClientIp(headers) // => 'unknown'
 * ```
 */
function getValidatedClientIp(requestHeaders: Headers): string {
  const environment = isProduction() ? 'production' : 'development'
  const trustedHeaders = TRUSTED_IP_HEADERS[environment]
  
  // Check headers in priority order
  for (const headerName of trustedHeaders) {
    const headerValue = requestHeaders.get(headerName)
    if (headerValue) {
      return extractFirstIp(headerValue)
    }
  }
  
  // No trusted headers found
  return 'unknown'
}

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
const SPAN_HASH_SALT = 'contact_form_span'

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

function hashSpanValue(value: string): string {
  return hashIdentifier(value, SPAN_HASH_SALT)
}

function buildContactSpanAttributes(emailHash: string, ipHash: string): SpanAttributes {
  return {
    email_hash: emailHash,
    ip_hash: ipHash,
  }
}

function buildLeadSpanAttributes(leadId: string, emailHash: string): SpanAttributes {
  return {
    lead_id_hash: hashSpanValue(leadId),
    email_hash: emailHash,
  }
}

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com'
const HUBSPOT_MAX_RETRIES = 3
const HUBSPOT_RETRY_BASE_DELAY_MS = 250
const HUBSPOT_RETRY_MAX_DELAY_MS = 2000

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

type SanitizedContactData = {
  safeEmail: string
  safeName: string
  safePhone: string
  safeMessage: string
  emailHash: string
  hashedIp: string
  contactSpanAttributes: SpanAttributes
}

type HubSpotUpsertTarget = {
  url: string
  method: 'PATCH' | 'POST'
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

function getHubSpotHeaders() {
  return {
    Authorization: `Bearer ${validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

function getHubSpotHeadersWithIdempotency(idempotencyKey: string | undefined) {
  if (!idempotencyKey) {
    return getHubSpotHeaders()
  }

  return {
    ...getHubSpotHeaders(),
    'Idempotency-Key': idempotencyKey,
  }
}

function buildHubSpotSearchPayload(email: string) {
  return {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          },
        ],
      },
    ],
    properties: ['email'],
    limit: 1,
  }
}

async function searchHubSpotContact(email: string, emailHash: string): Promise<string | undefined> {
  const response = await withServerSpan(
    {
      name: 'hubspot.search',
      op: 'http.client',
      attributes: { email_hash: emailHash },
    },
    () =>
      fetch(`${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: getHubSpotHeaders(),
        body: JSON.stringify(buildHubSpotSearchPayload(email)),
      }),
  )

  if (!response.ok) {
    throw new Error(`HubSpot search failed with status ${response.status}`)
  }

  const searchData = (await response.json()) as HubSpotSearchResponse
  return searchData.results[0]?.id
}

function buildHubSpotIdempotencyKey(leadId: string, emailHash: string) {
  return hashSpanValue(`${leadId}:${emailHash}`)
}

function getHubSpotUpsertTarget(existingId?: string): HubSpotUpsertTarget {
  if (existingId) {
    return {
      url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${existingId}`,
      method: 'PATCH',
    }
  }

  return {
    url: `${HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`,
    method: 'POST',
  }
}

function getRetryDelayMs(attempt: number) {
  return Math.min(HUBSPOT_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1), HUBSPOT_RETRY_MAX_DELAY_MS)
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown HubSpot sync error')
}

function waitForRetry(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
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

function getBlockedSubmissionResponse(requestHeaders: Headers, data: ContactFormData) {
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

function buildSanitizedContactData(
  validatedData: ContactFormData,
  clientIp: string,
): SanitizedContactData {
  const hashedIp = hashIdentifier(clientIp)
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

async function insertLeadWithSpan(
  sanitized: SanitizedContactData,
  isSuspicious: boolean,
): Promise<SupabaseLeadRow> {
  const lead = await withServerSpan(
    {
      name: 'supabase.insert',
      op: 'db.supabase',
      attributes: {
        ...sanitized.contactSpanAttributes,
        is_suspicious: isSuspicious,
      },
    },
    () =>
      insertLead({
        name: sanitized.safeName,
        email: sanitized.safeEmail,
        phone: sanitized.safePhone,
        message: sanitized.safeMessage,
        is_suspicious: isSuspicious,
        suspicion_reason: isSuspicious ? 'rate_limit' : null,
        hubspot_sync_status: 'pending',
        hubspot_retry_count: 0,
        hubspot_idempotency_key: null,
      }),
  )

  if (isSuspicious) {
    logWarn('Rate limit exceeded for contact form', {
      emailHash: sanitized.emailHash,
      ip: sanitized.hashedIp,
    })
  }

  return lead
}

function buildHubSpotProperties(sanitized: SanitizedContactData): Record<string, string> {
  const { firstName, lastName } = splitName(sanitized.safeName)
  const hubspotProperties: Record<string, string> = {
    email: sanitized.safeEmail,
    firstname: firstName,
  }

  if (lastName) {
    hubspotProperties.lastname = lastName
  }

  if (sanitized.safePhone) {
    hubspotProperties.phone = sanitized.safePhone
  }

  return hubspotProperties
}

async function updateLeadWithSpan(leadId: string, emailHash: string, updates: Record<string, unknown>) {
  return withServerSpan(
    {
      name: 'supabase.update',
      op: 'db.supabase',
      attributes: buildLeadSpanAttributes(leadId, emailHash),
    },
    () => updateLead(leadId, updates),
  )
}

async function syncHubSpotLead(leadId: string, sanitized: SanitizedContactData) {
  const hubspotProperties = buildHubSpotProperties(sanitized)
  const syncAttemptedAt = new Date().toISOString()
  const idempotencyKey = buildHubSpotIdempotencyKey(leadId, sanitized.emailHash)
  const retryResult = await retryHubSpotUpsert(hubspotProperties, idempotencyKey, sanitized.emailHash)

  if (retryResult.contact) {
    try {
      await updateLeadWithSpan(leadId, sanitized.emailHash, {
        hubspot_contact_id: retryResult.contact.id,
        hubspot_sync_status: 'synced',
        hubspot_last_sync_attempt: syncAttemptedAt,
        hubspot_retry_count: retryResult.attempts,
        hubspot_idempotency_key: idempotencyKey,
      })
      logInfo('HubSpot contact synced', { leadId, emailHash: sanitized.emailHash })
    } catch (updateError) {
      logError('Failed to update HubSpot sync status', updateError)
    }
    return
  }

  logError('HubSpot sync failed', normalizeError(retryResult.error))
  try {
    await updateLeadWithSpan(leadId, sanitized.emailHash, {
      hubspot_sync_status: 'needs_sync',
      hubspot_last_sync_attempt: syncAttemptedAt,
      hubspot_retry_count: retryResult.attempts,
      hubspot_idempotency_key: idempotencyKey,
    })
  } catch (updateError) {
    logError('Failed to update HubSpot sync status', updateError)
  }
}

async function retryHubSpotUpsert(
  properties: Record<string, string>,
  idempotencyKey: string,
  emailHash: string,
) {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= HUBSPOT_MAX_RETRIES; attempt++) {
    try {
      const contact = await upsertHubSpotContact(properties, idempotencyKey, emailHash)
      return { contact, attempts: attempt }
    } catch (error) {
      lastError = normalizeError(error)
      if (attempt < HUBSPOT_MAX_RETRIES) {
        logWarn('HubSpot sync retry scheduled', { attempt, emailHash })
        await waitForRetry(getRetryDelayMs(attempt))
      }
    }
  }

  return { attempts: HUBSPOT_MAX_RETRIES, error: lastError }
}

async function upsertHubSpotContact(
  properties: Record<string, string>,
  idempotencyKey: string,
  emailHash: string,
) {
  const existingId = await searchHubSpotContact(properties.email, emailHash)
  const { url, method } = getHubSpotUpsertTarget(existingId)

  const contactResponse = await withServerSpan(
    {
      name: 'hubspot.upsert',
      op: 'http.client',
      attributes: {
        email_hash: emailHash,
        hubspot_contact_id_hash: existingId ? hashSpanValue(existingId) : undefined,
      },
    },
    () =>
      fetch(url, {
        method,
        headers: getHubSpotHeadersWithIdempotency(idempotencyKey),
        body: JSON.stringify({ properties }),
      }),
  )

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text();
    throw new Error(`HubSpot upsert failed with status ${contactResponse.status}: ${errorText}`)
  }

  return (await contactResponse.json()) as HubSpotContactResponse
}

async function handleContactFormSubmission(data: ContactFormData, requestHeaders: Headers) {
  const blockedResponse = getBlockedSubmissionResponse(requestHeaders, data)
  if (blockedResponse) {
    return blockedResponse
  }

  const validatedData = contactFormSchema.parse(data)
  const clientIp = await getClientIp()
  const sanitized = buildSanitizedContactData(validatedData, clientIp)

  const rateLimitPassed = await checkRateLimit(sanitized.safeEmail, clientIp)
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
  const redisUrl = validatedEnv.UPSTASH_REDIS_REST_URL
  const redisToken = validatedEnv.UPSTASH_REDIS_REST_TOKEN
  const missingUpstashKeys: string[] = []

  if (!redisUrl) {
    missingUpstashKeys.push('UPSTASH_REDIS_REST_URL')
  }

  if (!redisToken) {
    missingUpstashKeys.push('UPSTASH_REDIS_REST_TOKEN')
  }

  if (missingUpstashKeys.length === 0) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
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
      'Upstash Redis not configured, using in-memory rate limiting (not suitable for production)',
      { missingKeys: missingUpstashKeys }
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
