/**
 * Next.js middleware for security headers and request validation.
 *
 * @module middleware
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Security middleware. Runs on EVERY request except static assets.
 * Applies security headers + validates request sizes. CRITICAL for production.
 *
 * **RUNS ON**: All routes except:
 * - /_next/static/* (JS/CSS bundles)
 * - /_next/image/* (optimized images)
 * - /favicon.ico
 * See `matcher` config at bottom of file.
 *
 * **SECURITY LAYERS**:
 * 1. **DoS prevention**: Blocks POST > 1MB before parsing
 * 2. **CSP**: Restricts script/style/image sources
 * 3. **Clickjacking**: X-Frame-Options: DENY
 * 4. **MIME sniffing**: X-Content-Type-Options: nosniff
 * 5. **XSS filter**: X-XSS-Protection (legacy browsers)
 * 6. **HTTPS**: HSTS in production
 * 7. **Referrer**: Controlled leak prevention
 *
 * **CSP NOTES** (Content Security Policy):
 * - CSP uses per-request nonces for inline scripts (JSON-LD, GA4 init)
 * - 'unsafe-eval' in dev only: Next.js Fast Refresh/HMR
 * - Production removes 'unsafe-eval' for better security
 * - Tailwind still requires 'unsafe-inline' for styles
 *
   * **AI ITERATION HINTS**:
   * - GA4 is enabled; keep Google Analytics domains in script-src/connect-src
   * - Adding external script? Add domain to script-src
   * - Adding external image? Add domain to img-src
   * - Adding external API? Add domain to connect-src
   * - Test CSP changes in browser console for violations
 *
 * **ENV DIFFERENCES**:
 * | Header | Dev | Prod |
 * |--------|-----|------|
 * | CSP script-src | includes 'unsafe-eval' | no 'unsafe-eval' |
 * | HSTS | not set | max-age=31536000 |
 *
 * **PAYLOAD SIZE LIMIT**: 1MB (MAX_BODY_SIZE_BYTES)
 * - Contact form is ~1KB typical
 * - Prevents memory exhaustion attacks
 * - Returns 413 early (before body parse)
 *
 * **POTENTIAL ISSUES**:
 * - [ ] CSP may break third-party embeds (add domains as needed)
 * - [ ] No rate limiting at middleware level (handled in actions.ts)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Apply security headers to all responses
 * - Block oversized payloads to prevent DoS
 * - Enforce HTTPS in production
 * - Prevent common web vulnerabilities
 *
 * **Security Layers:**
 * 1. Payload size limiting (DoS prevention)
 * 2. Content Security Policy (XSS prevention)
 * 3. Clickjacking prevention (X-Frame-Options)
 * 4. MIME sniffing prevention (X-Content-Type-Options)
 * 5. HTTPS enforcement (Strict-Transport-Security)
 * 6. Feature policy (Permissions-Policy)
 *
 * **Runs on:** All routes except _next/static, _next/image, favicon.ico
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware Next.js Middleware}
 * @see {@link https://owasp.org/www-project-secure-headers/ OWASP Secure Headers}
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  buildContentSecurityPolicy,
  createCspNonce,
  CSP_NONCE_HEADER,
} from '@/lib/csp'

const CORRELATION_ID_HEADER = 'x-correlation-id'
/**
 * Strict-Transport-Security (HSTS)
 *
 * **Purpose:** Force HTTPS in production without breaking local development.
 */
const HSTS_MAX_AGE_SECONDS = 31_536_000
const HSTS_HEADER_VALUE = `max-age=${HSTS_MAX_AGE_SECONDS}; includeSubDomains; preload`

/**
 * Permissions-Policy
 *
 * **Purpose:** Disable unnecessary browser features.
 * **Benefit:** Reduce attack surface and prevent privacy-unfriendly APIs.
 */
const PERMISSIONS_POLICY_VALUE =
  'camera=(), microphone=(), geolocation=(), interest-cohort=()'

/**
 * Referrer-Policy: strict-origin-when-cross-origin
 *
 * **Purpose:** Limit referrer leakage on cross-origin requests.
 */
const REFERRER_POLICY_VALUE = 'strict-origin-when-cross-origin'

/**
 * X-Frame-Options: DENY
 *
 * **Purpose:** Prevent clickjacking in legacy browsers.
 */
const X_FRAME_OPTIONS_VALUE = 'DENY'

/**
 * X-Content-Type-Options: nosniff
 *
 * **Purpose:** Prevent MIME sniffing attacks.
 */
const X_CONTENT_TYPE_OPTIONS_VALUE = 'nosniff'

/**
 * X-XSS-Protection: 1; mode=block
 *
 * **Purpose:** Defense-in-depth for legacy browsers.
 */
const X_XSS_PROTECTION_VALUE = '1; mode=block'

const BASE_SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': X_FRAME_OPTIONS_VALUE,
  'X-Content-Type-Options': X_CONTENT_TYPE_OPTIONS_VALUE,
  'X-XSS-Protection': X_XSS_PROTECTION_VALUE,
  'Referrer-Policy': REFERRER_POLICY_VALUE,
  'Permissions-Policy': PERMISSIONS_POLICY_VALUE,
}

/**
 * Maximum allowed payload size for POST requests (1MB).
 * 
 * **Rationale:**
 * - Contact form submissions should be < 10KB typically
 * - 1MB provides plenty of headroom for edge cases
 * - Prevents memory exhaustion attacks
 * - Returns 413 early before parsing body
 * 
 * **Attack Prevention:**
 * - DoS via large JSON payloads
 * - Memory exhaustion attacks
 * - Zip bomb attacks (if file uploads added later)
 */
const BYTES_PER_MEGABYTE = 1024 * 1024
const MAX_BODY_SIZE_BYTES = BYTES_PER_MEGABYTE // 1MB payload limit for POST requests

function getCorrelationId(request: NextRequest): string {
  const existingId = request.headers.get(CORRELATION_ID_HEADER)
  return existingId || crypto.randomUUID()
}

export function parseContentLength(headerValue: string | null): number | null {
  if (!headerValue) {
    // Missing header: skip size checks rather than guessing at length.
    return null
  }

  const parsed = parseInt(headerValue, 10)
  if (!Number.isFinite(parsed) || parsed < 0) {
    // Invalid header: treat as oversized to avoid bypassing size checks.
    return MAX_BODY_SIZE_BYTES + 1
  }

  return parsed
}

export function isPayloadTooLarge(contentLength: number | null): boolean {
  // Explicit null handling keeps the call site simple and predictable.
  return contentLength !== null && contentLength > MAX_BODY_SIZE_BYTES
}

function buildRequestHeaders(
  request: NextRequest,
  correlationId: string,
  cspNonce: string
): Headers {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId)
  requestHeaders.set(CSP_NONCE_HEADER, cspNonce)
  return requestHeaders
}

interface SecurityHeaderOptions {
  cspNonce: string
  isDevelopment: boolean
  isProduction: boolean
}

function applySecurityHeaders(
  headers: Headers,
  { cspNonce, isDevelopment, isProduction }: SecurityHeaderOptions
) {
  headers.set(
    'Content-Security-Policy',
    buildContentSecurityPolicy({
      nonce: cspNonce,
      isDevelopment,
    })
  )

  // Base headers are centralized to avoid drift and magic string repetition.
  for (const [header, value] of Object.entries(BASE_SECURITY_HEADERS)) {
    headers.set(header, value)
  }

  if (isProduction) {
    headers.set('Strict-Transport-Security', HSTS_HEADER_VALUE)
  }
}

function buildPayloadTooLargeResponse(correlationId: string) {
  return new NextResponse('Payload too large', {
    status: 413,
    headers: new Headers({ [CORRELATION_ID_HEADER]: correlationId }),
  })
}

/**
 * Apply security headers and validate requests.
 * 
 * **Flow:**
 * 1. Check payload size for POST requests (block if > 1MB)
 * 2. Clone response for header modification
 * 3. Apply security headers (CSP, X-Frame-Options, etc.)
 * 4. Return response with security headers
 * 
 * **Environment Differences:**
 * - Development: CSP allows `unsafe-eval` for Fast Refresh
 * - Production: CSP removes `unsafe-eval` and enables HSTS
 * 
 * @param request - Next.js request object
 * @returns Response with security headers applied
 */
export function middleware(request: NextRequest) {
  const startTime = performance.now()
  const correlationId = getCorrelationId(request)
  const cspNonce = createCspNonce()
  const requestHeaders = buildRequestHeaders(request, correlationId, cspNonce)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set(CORRELATION_ID_HEADER, correlationId)
  response.headers.set(CSP_NONCE_HEADER, cspNonce)

  // Block oversized payloads early to reduce DoS risk.
  if (request.method === 'POST') {
    const contentLength = parseContentLength(
      request.headers.get('content-length')
    )
    if (isPayloadTooLarge(contentLength)) {
      return buildPayloadTooLargeResponse(correlationId)
    }
  }

  // Security Headers
  const headers = response.headers

  /**
   * Content Security Policy (CSP)
   * 
   * **Purpose:** Prevent XSS attacks by controlling resource loading.
   * 
   * **Directives:**
   * - `default-src 'self'` - Only load resources from same origin by default
   * - `script-src 'self' 'nonce-<value>'` - Allow inline scripts with nonce
   * - `script-src ... 'unsafe-eval'` - Allow eval in dev (Next.js Fast Refresh/HMR)
   * - `style-src 'self' 'unsafe-inline'` - Allow inline styles (required for Tailwind)
   * - `img-src 'self' data: https:` - Allow images from same origin, data URIs, HTTPS
   * - `font-src 'self' data:` - Allow fonts from same origin and data URIs
   * - `connect-src 'self'` - Block external API calls (prevents data exfiltration)
   * - `frame-ancestors 'none'` - Prevent embedding in iframes (clickjacking)
   * 
   * **Why nonces and 'unsafe-eval':**
   * - Nonces allow trusted inline scripts (JSON-LD + GA4 init)
   * - Tailwind injects inline styles at runtime (style-src keeps 'unsafe-inline')
   * - 'unsafe-eval' needed in development for Fast Refresh (HMR)
   * - Production avoids 'unsafe-eval' for better security
   * 
   * **Future Hardening (v2):**
   * - Extract Tailwind styles to static CSS (build-time)
   * - See SECURITY.md for hardening roadmap
   * 
   * **Security Trade-off:**
   * - Current: Allows inline scripts/styles (reduces XSS protection slightly)
   * - Benefit: Compatible with Next.js + Tailwind (no major refactoring needed)
   * - Mitigation: All user input escaped with escapeHtml() before rendering
   * 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP MDN CSP Guide}
   */
  applySecurityHeaders(headers, {
    cspNonce,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  })

  // Add performance timing header for monitoring
  const duration = performance.now() - startTime
  response.headers.set('Server-Timing', `middleware;dur=${duration.toFixed(2)}`)

  return response
}

/**
 * Configure which routes the middleware runs on.
 * 
 * **Matcher Pattern:**
 * - Runs on ALL routes EXCEPT:
 *   - `_next/static/*` - Static assets (already cached, no headers needed)
 *   - `_next/image/*` - Image optimization (handled by Next.js)
 *   - `favicon.ico` - Favicon (static, no headers needed)
 * 
 * **Rationale:**
 * - Security headers needed on all HTML pages and API routes
 * - Static assets don't need security headers (already immutable)
 * - Reduces overhead for high-traffic static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
