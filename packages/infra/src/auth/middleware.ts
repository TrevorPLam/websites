/**
 * @file packages/infra/src/auth/middleware.ts
 * @summary Next.js middleware implementing 2026 defense-in-depth authentication
 *
 * Implements CVE-2025-29927 mitigation by never relying solely on middleware.
 * Provides tenant context setup and initial authentication checks.
 *
 * Features:
 * - OAuth 2.1 compliant session validation
 * - Multi-tenant context propagation
 * - Rate limiting
 * - Security headers
 * - Request correlation
 *
 * Used by: Next.js middleware.ts
 *
 * Security Invariants:
 * - Never trusts client headers for tenant ID
 * - Always validates JWT cryptographically
 * - Sets tenant context from verified JWT claims
 * - Implements defense-in-depth (middleware + data access validation)
 *
 * Status: @public
 */

import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { runWithTenantId } from './tenant-context';
import { auditLogger } from '../../security/audit-logger';

// ─── Configuration ─────────────────────────────────────────────────────────────

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    (() => {
      throw new Error('JWT_SECRET environment variable is required');
    })()
);

const PUBLIC_PATHS = ['/login', '/register', '/api/auth', '/_next', '/favicon.ico', '/robots.txt'];

// ─── JWT Validation ───────────────────────────────────────────────────────────

/**
 * Validates JWT token from cookie
 *
 * @param request - Next.js request object
 * @returns Validated JWT payload or null
 */
async function validateJWTFromRequest(request: NextRequest): Promise<any | null> {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return null;

    const { payload } = await jwtVerify(sessionCookie, JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'marketing-websites',
      audience: process.env.JWT_AUDIENCE || 'marketing-websites',
    });

    return payload;
  } catch (error) {
    // Invalid token - clear cookie
    const response = NextResponse.next();
    response.cookies.delete('session');
    return null;
  }
}

// ─── Tenant Context Setup ─────────────────────────────────────────────────────

/**
 * Sets up tenant context from validated JWT
 *
 * @param payload - Validated JWT payload
 * @returns Tenant ID or null
 */
function setupTenantContext(payload: any): string | null {
  // Extract tenant ID from JWT claims (OAuth 2.1 compliant)
  const tenantId = payload.org_id || payload.app_metadata?.tenant_id;

  if (!tenantId) {
    return null;
  }

  // Validate tenant ID format
  const tenantIdPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!tenantIdPattern.test(tenantId)) {
    return null;
  }

  return tenantId;
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

/**
 * Simple in-memory rate limiting for middleware
 * In production, use Redis or similar for distributed rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks rate limit for a client IP
 *
 * @param clientId - Client identifier (IP address)
 * @returns True if rate limit is exceeded
 */
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // 100 requests per 15 minutes

  const client = rateLimitStore.get(clientId);

  if (!client || now > client.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (client.count >= maxRequests) {
    return true;
  }

  client.count++;
  return false;
}

// ─── Security Headers ─────────────────────────────────────────────────────────

/**
 * Adds security headers to response
 *
 * @param response - Next.js response object
 * @returns Response with security headers
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (basic version)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
  );

  // HSTS (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

// ─── Main Middleware Function ─────────────────────────────────────────────────

/**
 * Next.js middleware implementing 2026 defense-in-depth authentication
 *
 * @param request - Next.js request object
 * @returns Next.js response or continues to route
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const correlationId = crypto.randomUUID();
  const clientIP = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown';
  const pathname = request.nextUrl.pathname;

  // Log request start
  auditLogger.log({
    level: 'info',
    action: 'middleware_request',
    correlationId,
    status: 'started',
    metadata: { pathname, clientIP },
  });

  // ── 1. Rate limiting check ──────────────────────────────────────────────────
  if (checkRateLimit(clientIP)) {
    auditLogger.log({
      level: 'warn',
      action: 'middleware_rate_limit',
      correlationId,
      status: 'rate_limited',
      metadata: { clientIP, pathname },
    });

    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // ── 2. Public path bypass ───────────────────────────────────────────────────
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // ── 3. JWT validation ────────────────────────────────────────────────────────
  const payload = await validateJWTFromRequest(request);
  if (!payload) {
    auditLogger.log({
      level: 'warn',
      action: 'middleware_unauthorized',
      correlationId,
      status: 'unauthorized',
      metadata: { pathname, clientIP },
    });

    // Redirect to login for protected routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Tenant context setup ─────────────────────────────────────────────────
  const tenantId = setupTenantContext(payload);
  if (!tenantId) {
    auditLogger.log({
      level: 'warn',
      action: 'middleware_tenant_missing',
      correlationId,
      userId: payload.sub,
      status: 'forbidden',
      metadata: { pathname },
    });

    return new NextResponse('Tenant context required', { status: 403 });
  }

  // ── 5. Continue with tenant context ───────────────────────────────────────────
  const response = NextResponse.next({
    headers: {
      'x-tenant-id': tenantId,
      'x-correlation-id': correlationId,
      'x-user-id': payload.sub,
    },
  });

  // Add security headers
  addSecurityHeaders(response);

  auditLogger.log({
    level: 'info',
    action: 'middleware_success',
    correlationId,
    userId: payload.sub,
    tenantId,
    status: 'success',
    metadata: { pathname },
  });

  return response;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Creates a middleware function that runs within tenant context
 *
 * @param handler - Async function to run with tenant context
 * @returns Middleware function
 */
export function withTenantContext(
  handler: (request: NextRequest, tenantId: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const payload = await validateJWTFromRequest(request);
    const tenantId = setupTenantContext(payload);

    if (!tenantId) {
      return new NextResponse('Tenant context required', { status: 403 });
    }

    return runWithTenantId(tenantId, () => handler(request, tenantId));
  };
}

/**
 * Middleware for API routes requiring authentication
 *
 * @param request - Next.js request object
 * @param options - Authentication options
 * @returns Auth context or error response
 */
export async function requireAuthForAPI(
  request: NextRequest,
  options: { requireMFA?: boolean; requireRoles?: string[] } = {}
): Promise<{ auth: any; response: NextResponse | null }> {
  const payload = await validateJWTFromRequest(request);

  if (!payload) {
    return {
      auth: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  // Check MFA requirement
  if (options.requireMFA && !payload.mfa_verified) {
    return {
      auth: null,
      response: NextResponse.json({ error: 'MFA verification required' }, { status: 403 }),
    };
  }

  // Check role requirements
  if (options.requireRoles) {
    const hasRequiredRole = options.requireRoles.some((role) => payload.roles?.includes(role));

    if (!hasRequiredRole) {
      return {
        auth: null,
        response: NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }),
      };
    }
  }

  const tenantId = setupTenantContext(payload);

  return {
    auth: {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      tenantId,
      mfaVerified: payload.mfa_verified || false,
    },
    response: null,
  };
}
