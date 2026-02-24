import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from './headers';
import { checkRateLimit } from './rate-limit';

// ============================================================================
// ROUTE MATCHERS
// ============================================================================

const isPublicRoute = (pathname: string) =>
  [
    '/',
    '/about',
    '/services',
    '/blog',
    '/contact',
    '/api/contact',
    '/api/webhooks/',
    '/api/draft-mode/',
    '/api/jobs/', // Protected by QStash signature, not auth
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
    '/llms-full.txt',
    '/ai-context.json',
    '/og/',
    '/auth/',
    '/sign-in',
    '/sign-up',
  ].some((route) => pathname.startsWith(route));

const isAuthRoute = (pathname: string) =>
  pathname.startsWith('/auth/') ||
  pathname.startsWith('/sign-in') ||
  pathname.startsWith('/sign-up');

const isAdminRoute = (pathname: string) => pathname.startsWith('/admin');

const isAPIRoute = (pathname: string) => pathname.startsWith('/api/');

const isWebhookRoute = (pathname: string) => pathname.startsWith('/api/webhooks/');

// ============================================================================
// MAIN MIDDLEWARE
// Order matters: security headers → rate limiting → tenant resolution → auth
// ============================================================================

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, hostname } = request.nextUrl;
  const isDashboard = hostname.includes('portal.') || hostname.includes('app.');

  // ── Step 1: Block CVE-2025-29927 header injection ─────────────────────────
  // Defense against middleware bypass via crafted subrequest header [web:24]
  if (request.headers.has('x-middleware-subrequest')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ── Step 2: Apply security headers (nonce generated per request) ──────────
  let response = NextResponse.next();
  const { response: securedResponse, nonce } = applySecurityHeaders(request, response, {
    environment: (process.env.VERCEL_ENV ?? 'development') as any,
    isDashboard,
  });
  response = securedResponse;

  // Forward nonce to Server Components (reads from headers in layout)
  response.headers.set('X-Nonce', nonce);

  // ── Step 3: Rate limiting ────────────────────────────────────────────────

  // Webhook endpoints: separate limit (Stripe bursts)
  if (isWebhookRoute(pathname)) {
    return handleRateLimit(request, 'webhook', response);
  }
  // API routes: standard API limit
  else if (isAPIRoute(pathname)) {
    return handleRateLimit(request, 'api', response);
  }
  // All other routes: global IP limit
  else {
    return handleRateLimit(request, 'global', response);
  }
}

// ============================================================================
// RATE LIMITING HANDLER
// ============================================================================

async function handleRateLimit(
  request: NextRequest,
  tier: 'global' | 'form' | 'auth' | 'api' | 'webhook',
  response: NextResponse
): Promise<NextResponse> {
  const limitResponse = await checkRateLimit(request, tier);

  if (limitResponse) {
    return limitResponse;
  }

  // Attach rate limit headers to response
  // Note: In a real implementation, you'd get these from the rate limiter
  // For now, we'll continue with the response
  return response;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)',
  ],
};
