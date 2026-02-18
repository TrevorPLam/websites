/**
 * @file packages/infra/middleware/create-middleware.ts
 * Next.js middleware factory — CSP, security headers, CVE mitigation, and optional CSRF allowlist.
 *
 * Purpose: Single factory for app middleware: nonce, CSP, security headers, strip x-middleware-subrequest, optional allowedOrigins.
 * Relationship: Used by template middleware.ts. Depends on security/csp and security/security-headers.
 * System role: createMiddleware(options) returns (request) => NextResponse; templates set config.matcher.
 * Assumptions: Middleware runs before layout; nonce in header so layout can inject into script/style.
 */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
  createCspNonce,
} from '../security/csp';
import { getSecurityHeaders } from '../security/security-headers';

/** Header that must be stripped to mitigate CVE-2025-29927 (middleware bypass). */
const X_MIDDLEWARE_SUBREQUEST = 'x-middleware-subrequest';

/**
 * Builds allowedOrigins from NEXT_PUBLIC_SITE_URL for CSRF defense.
 * In development, also allows common localhost origins.
 */
export function getAllowedOriginsFromEnv(): string[] | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || typeof url !== 'string') return undefined;
  try {
    const origin = new URL(url).origin;
    const origins: string[] = [origin];
    if (process.env.NODE_ENV === 'development') {
      origins.push('http://localhost:3000', 'http://localhost:3101', 'http://localhost:3102');
    }
    return origins;
  } catch {
    return undefined;
  }
}

export interface CreateMiddlewareOptions {
  /** Optional CSP violation report endpoint (report-uri / report-to). */
  cspReportEndpoint?: string;
  /** Optional list of allowed origins for CSRF; when set, requests with Origin must match. */
  allowedOrigins?: string[];
  /** Override strict-dynamic in CSP (default: true in production, false in development). */
  enableStrictDynamic?: boolean;
}

/**
 * Normalizes an Origin header value to a canonical origin (scheme + host, no path).
 * Returns null if the value is not a valid URL.
 */
function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Creates a Next.js middleware that applies CSP, security headers, strips
 * x-middleware-subrequest (CVE-2025-29927), and optionally enforces allowedOrigins for CSRF.
 *
 * @param options - Optional configuration (cspReportEndpoint, allowedOrigins, enableStrictDynamic)
 * @returns Middleware function compatible with Next.js middleware
 */
export function createMiddleware(
  options: CreateMiddlewareOptions = {}
): (request: NextRequest) => NextResponse {
  const {
    cspReportEndpoint,
    allowedOrigins,
    enableStrictDynamic,
  } = options;

  return function middleware(request: NextRequest): NextResponse {
    // CVE-2025-29927: Strip x-middleware-subrequest so clients cannot bypass middleware
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete(X_MIDDLEWARE_SUBREQUEST);

    // allowedOrigins: edge CSRF allowlist — reject if Origin present and not in list
    if (allowedOrigins && allowedOrigins.length > 0) {
      const originHeader = requestHeaders.get('origin');
      if (originHeader) {
        const normalized = normalizeOrigin(originHeader);
        const allowedSet = new Set(
          allowedOrigins.map((o) => normalizeOrigin(o)).filter((o): o is string => o !== null)
        );
        if (normalized === null || !allowedSet.has(normalized)) {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          );
        }
      }
    }

    const nonce = createCspNonce();
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const csp = buildContentSecurityPolicy({
      nonce,
      isDevelopment,
      reportEndpoint: cspReportEndpoint,
      enableStrictDynamic,
    });

    requestHeaders.set(CSP_NONCE_HEADER, nonce);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('Content-Security-Policy', csp);

    const securityHeaders = getSecurityHeaders({
      environment: isDevelopment ? 'development' : 'production',
    });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
