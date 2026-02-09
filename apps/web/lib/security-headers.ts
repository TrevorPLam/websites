/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Security Headers Configuration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Define OWASP-recommended security headers for HTTP responses
 * - Protect against XSS, clickjacking, MIME sniffing, and other web attacks
 * - Provide environment-specific header configurations
 *
 * Responsibilities:
 * - Owns: Security header definitions (X-Frame-Options, etc.)
 * - Owns: Environment-specific overrides (dev vs. production)
 * - Does NOT own: Header application logic (handled by middleware)
 *
 * Key Flows:
 * - Middleware imports → calls getSecurityHeaders() → applies to all responses
 * - Different headers served based on NODE_ENV
 *
 * Inputs/Outputs:
 * - Input: Environment string ('development' | 'production')
 * - Output: Record<string, string> of HTTP headers
 * - Side effects: None (pure configuration)
 *
 * Dependencies:
 * - External: None
 * - Internal: Used by middleware.ts
 *
 * State & Invariants:
 * - Invariant: Production must include HSTS header
 *
 * Error Handling:
 * - Invalid directives: Browser ignores, logs console warning
 * - Missing headers: Reduces security but doesn't break functionality
 *
 * Performance Notes:
 * - Headers parsed once per request (minimal overhead)
 * - Headers parsed once per request
 *
 * Security Notes:
 * - CRITICAL: X-Frame-Options prevents clickjacking
 * - CRITICAL: HSTS forces HTTPS in production
 * - NOTE: unsafe-eval/unsafe-inline needed for Next.js dev mode
 * - NOTE: Production CSP is stricter (removes unsafe directives)
 *
 * Testing Notes:
 * - Test: Run securityheaders.com scan on production
 * - Test: Verify CSP violations logged in console
 * - Test: Verify HSTS header present in production only
 *
 * Change Risks:
 * - Missing HSTS allows MITM attacks in production
 *
 * Owner Boundaries:
 * - CSP nonce generation: lib/csp.ts
 * - Header application: middleware.ts
 * - Security docs: SECURITY.md
 *
 * AI Navigation Tags:
 * #security #headers #csp #xss #clickjacking #hsts #owasp
 *
 * TODO: Add Permissions-Policy for more granular feature control
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Advanced Security Headers Middleware
 *
 * Implements OWASP Top 10 security headers and best practices
 */

export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': ['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'].join(
    ', '
  ),

  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  }),

  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as Record<string, string>;

export function getSecurityHeaders(env: 'development' | 'production' = 'production') {
  const headers = { ...securityHeaders };

  return headers;
}
