/**
 * Next.js middleware for security headers and request validation.
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
 * @module middleware
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware Next.js Middleware}
 * @see {@link https://owasp.org/www-project-secure-headers/ OWASP Secure Headers}
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
const MAX_BODY_SIZE_BYTES = 1024 * 1024 // 1MB payload limit for POST requests

/**
 * Apply security headers and validate requests.
 * 
 * **Flow:**
 * 1. Check payload size for POST requests (block if > 1MB)
 * 2. Clone response for header modification
 * 3. Apply security headers (CSP, X-Frame-Options, etc.)
 * 4. Return response with security headers
 * 
 * @param request - Next.js request object
 * @returns Response with security headers applied
 */
export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next()

  // Block oversized payloads early to reduce DoS risk.
  if (request.method === 'POST') {
    const contentLength = request.headers.get('content-length')
    if (contentLength && Number(contentLength) > MAX_BODY_SIZE_BYTES) {
      return new NextResponse('Payload too large', { status: 413 })
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
   * - `script-src 'self' 'unsafe-inline'` - Allow inline scripts (required for Next.js)
   * - `script-src ... 'unsafe-eval'` - Allow eval in dev (Next.js Fast Refresh/HMR)
   * - `style-src 'self' 'unsafe-inline'` - Allow inline styles (required for Tailwind)
   * - `img-src 'self' data: https:` - Allow images from same origin, data URIs, HTTPS
   * - `font-src 'self' data:` - Allow fonts from same origin and data URIs
   * - `connect-src 'self'` - Block external API calls (prevents data exfiltration)
   * - `frame-ancestors 'none'` - Prevent embedding in iframes (clickjacking)
   * 
   * **Why 'unsafe-inline' and 'unsafe-eval':**
   * - Next.js injects inline scripts for hydration and routing
   * - Tailwind injects inline styles at runtime
   * - 'unsafe-eval' needed in development for Fast Refresh (HMR)
   * - Production avoids 'unsafe-eval' for better security
   * 
   * **Future Hardening (v2):**
   * - Use nonce-based CSP for inline scripts (requires SSR changes)
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
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      process.env.NODE_ENV === 'development'
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" // Next.js runtime + dev tooling in development
        : "script-src 'self' 'unsafe-inline'", // Avoid unsafe-eval in production
      "style-src 'self' 'unsafe-inline'", // Tailwind injects styles at runtime
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'", // Block external data exfiltration by default
      "frame-ancestors 'none'", // Disallow clickjacking via iframes
    ].join('; ')
  )

  /**
   * X-Frame-Options: DENY
   * 
   * **Purpose:** Prevent clickjacking attacks in legacy browsers.
   * 
   * Modern browsers use CSP `frame-ancestors` directive instead.
   * This header provides defense-in-depth for older browsers.
   * 
   * **Attack Prevention:**
   * - Clickjacking (tricking users to click hidden iframes)
   * - UI redressing attacks
   * 
   * @see {@link https://owasp.org/www-community/attacks/Clickjacking OWASP Clickjacking}
   */
  headers.set('X-Frame-Options', 'DENY')

  /**
   * X-Content-Type-Options: nosniff
   * 
   * **Purpose:** Prevent MIME type sniffing attacks.
   * 
   * Forces browsers to respect declared Content-Type headers.
   * Prevents execution of scripts disguised as images, etc.
   * 
   * **Attack Prevention:**
   * - XSS via polyglot files (files that are both image and script)
   * - MIME confusion attacks
   */
  headers.set('X-Content-Type-Options', 'nosniff')

  /**
   * X-XSS-Protection: 1; mode=block
   * 
   * **Purpose:** Enable XSS filter in legacy browsers (IE, old Safari).
   * 
   * Modern browsers (Chrome, Firefox, Edge) have removed this feature.
   * Included for defense-in-depth on older browser versions.
   * 
   * **Mode:** block - Stop page rendering if XSS detected
   * 
   * @deprecated Modern browsers don't use this (rely on CSP instead)
   */
  headers.set('X-XSS-Protection', '1; mode=block')

  /**
   * Referrer-Policy: strict-origin-when-cross-origin
   * 
   * **Purpose:** Control how much referrer information is sent.
   * 
   * - Same-origin: Full URL sent
   * - Cross-origin HTTPS→HTTPS: Only origin sent (no path/query)
   * - Cross-origin HTTPS→HTTP: No referrer sent (downgrade)
   * 
   * **Privacy Benefit:**
   * - Prevents leaking sensitive URL parameters to third parties
   * - Prevents leaking internal URL structure
   */
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  /**
   * Permissions-Policy
   * 
   * **Purpose:** Disable unnecessary browser features.
   * 
   * - `camera=()` - Disable camera access
   * - `microphone=()` - Disable microphone access
   * - `geolocation=()` - Disable geolocation
   * - `interest-cohort=()` - Disable FLoC tracking (privacy)
   * 
   * **Benefit:**
   * - Reduces attack surface (can't request camera/mic)
   * - Privacy protection (no FLoC tracking)
   * - Clear signal that these features aren't used
   */
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  /**
   * Strict-Transport-Security (HSTS)
   * 
   * **Purpose:** Force HTTPS for all future requests.
   * 
   * - `max-age=31536000` - Remember for 1 year
   * - `includeSubDomains` - Apply to all subdomains
   * - `preload` - Eligible for browser HSTS preload list
   * 
   * **Security Benefit:**
   * - Prevents SSL stripping attacks
   * - Ensures all traffic is encrypted
   * - Even if user types http://, browser upgrades to https://
   * 
   * **Production Only:**
   * - Not set in development (localhost uses HTTP)
   * - Would break local development if enabled
   * 
   * @see {@link https://hstspreload.org/ HSTS Preload List}
   */
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

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
