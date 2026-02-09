import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { buildContentSecurityPolicy, CSP_NONCE_HEADER, createCspNonce } from '@/lib/csp';
import { getSecurityHeaders } from '@/lib/security-headers';

export function middleware(request: NextRequest) {
  const nonce = createCspNonce();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const csp = buildContentSecurityPolicy({ nonce, isDevelopment });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', csp);

  const securityHeaders = getSecurityHeaders(isDevelopment ? 'development' : 'production');
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|apple-touch-icon.png).*)',
  ],
};
