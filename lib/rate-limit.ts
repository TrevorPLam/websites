/**
 * Rate limiting helpers for contact form submissions.
 *
 * @module lib/rate-limit
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralize rate limiter initialization and checks so the
 * contact form action can stay focused on orchestration.
 *
 * **ARCHITECTURE PATTERN**: Helper module (server-only utility)
 * - Called by lib/actions.ts during contact submissions
 * - Returns boolean allow/deny outcome
 *
 * **CURRENT STATE**: Supports Upstash Redis (production) and in-memory fallback.
 *
 * **KEY DEPENDENCIES**:
 * - `./env.ts` — environment validation for Upstash credentials
 * - `./logger.ts` — safe logging (no raw PII)
 *
 * **AI ITERATION HINTS**:
 * 1. Keep limits aligned with BESTPR.md (3 requests per hour).
 * 2. Avoid logging raw identifiers; use boolean flags only.
 * 3. Reset state in tests using resetRateLimiterState().
 *
 * **SECURITY CHECKLIST**:
 * - [x] No raw emails/IPs logged
 * - [x] Hashing performed before IP identifiers are stored
 * - [x] Fallback is in-memory only when Upstash is missing
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { logError, logInfo, logWarn } from './logger'
import { validatedEnv } from './env'
import { RATE_LIMIT } from './constants'

/**
 * Rate limiting configuration.
 * - 3 requests per hour per email address
 * - 3 requests per hour per IP address
 */
const RATE_LIMIT_MAX_REQUESTS = RATE_LIMIT.MAX_REQUESTS
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

function buildIdentifier(type: 'email' | 'ip', value: string): string {
  return `${type}:${value}`
}

/**
 * Initialize rate limiter with Upstash Redis (distributed) or fallback to in-memory.
 */
async function getRateLimiter() {
  if (rateLimiter !== null) {
    return rateLimiter
  }

  // Check if Upstash credentials are configured before attempting dynamic imports.
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
      { missingKeys: missingUpstashKeys },
    )
  }

  // WHY: Sentinel prevents repeated initialization attempts when Upstash is missing.
  rateLimiter = false
  return null
}

/**
 * Check rate limit using in-memory storage (fallback when Upstash unavailable).
 */
function checkRateLimitInMemory(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  if (limit && now > limit.resetAt) {
    // WHY: Cleaning expired entries keeps memory use bounded.
    rateLimitMap.delete(identifier)
  }

  const existing = rateLimitMap.get(identifier)
  if (!existing) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS })
    return true
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  existing.count += 1
  return true
}

export function resetRateLimiterState() {
  rateLimiter = null
  rateLimitMap.clear()
}

/**
 * Check rate limits for both email and IP address.
 */
export async function checkRateLimit(params: {
  email: string
  clientIp: string
  hashIp: (value: string) => string
}): Promise<boolean> {
  const { email, clientIp, hashIp } = params

  if (!email.trim() || !clientIp.trim()) {
    // WHY: Missing identifiers should fail closed to avoid bypassing limits.
    logError('Rate limit check missing identifiers', {
      hasEmail: Boolean(email.trim()),
      hasClientIp: Boolean(clientIp.trim()),
    })
    return false
  }

  let hashedIp: string
  try {
    hashedIp = hashIp(clientIp)
  } catch (error) {
    logError('Rate limit hashing failed', error)
    return false
  }

  const emailIdentifier = buildIdentifier('email', email)
  const ipIdentifier = buildIdentifier('ip', hashedIp)
  const limiter = await getRateLimiter()

  try {
    if (limiter) {
      const emailLimit = await limiter.limit(emailIdentifier)
      if (!emailLimit.success) {
        return false
      }

      const ipLimit = await limiter.limit(ipIdentifier)
      return ipLimit.success
    }

    const emailAllowed = checkRateLimitInMemory(emailIdentifier)
    if (!emailAllowed) {
      return false
    }

    return checkRateLimitInMemory(ipIdentifier)
  } catch (error) {
    logError('Rate limit check failed', error)
    return false
  }
}
