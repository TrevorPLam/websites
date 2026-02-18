/**
 * @file templates/hair-salon/middleware.ts
 * Purpose: Next.js middleware — CSP nonce, security headers, CVE-2025-29927 strip. No custom options.
 * Relationship: Uses @repo/infra createMiddleware. Runs before every request (see config.matcher).
 * Assumptions: config.matcher excludes static assets; middleware sets CSP nonce header for layout.
 */
import { createMiddleware } from '@repo/infra';

export const middleware = createMiddleware({});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|apple-touch-icon.png).*)',
  ],
};
