/**
 * Middleware factory tests
 * Covers createMiddleware: header stripping (CVE-2025-29927), allowedOrigins, CSP and security headers
 */

import type { NextRequest } from 'next/server';
import { createMiddleware } from '../middleware/create-middleware';

/** Build a minimal NextRequest-like object (middleware only reads .headers). */
function createMockRequest(init?: { headers?: Record<string, string> }): NextRequest {
  const headers = new Headers(init?.headers ?? {});
  return { headers } as unknown as NextRequest;
}

describe('createMiddleware', () => {
  const env = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  describe('CVE-2025-29927 — x-middleware-subrequest strip', () => {
    it('returns 200 with CSP and security headers when request has x-middleware-subrequest', () => {
      const middleware = createMiddleware({});
      const request = createMockRequest({
        headers: { 'x-middleware-subrequest': 'middleware|' },
      });
      const response = middleware(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('applies CSP with nonce and security headers on normal request', () => {
      const middleware = createMiddleware({});
      const request = createMockRequest({});
      const response = middleware(request);
      expect(response.status).toBe(200);
      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toContain("'self'");
      expect(csp).toMatch(/'nonce-[A-Za-z0-9+/]+={0,2}'/);
      expect(response.headers.get('Referrer-Policy')).toBeTruthy();
      expect(response.headers.get('Permissions-Policy')).toBeTruthy();
    });
  });

  describe('allowedOrigins (CSRF)', () => {
    it('returns 403 when allowedOrigins is set and Origin is not in list', async () => {
      const middleware = createMiddleware({
        allowedOrigins: ['https://example.com', 'https://app.example.com'],
      });
      const request = createMockRequest({
        headers: { origin: 'https://evil.com' },
      });
      const response = middleware(request);
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data).toEqual({ error: 'Forbidden' });
    });

    it('returns 200 when allowedOrigins is set and Origin is in list', () => {
      const middleware = createMiddleware({
        allowedOrigins: ['https://example.com'],
      });
      const request = createMockRequest({
        headers: { origin: 'https://example.com' },
      });
      const response = middleware(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
    });

    it('returns 200 when request has no Origin and allowedOrigins is set', () => {
      const middleware = createMiddleware({
        allowedOrigins: ['https://example.com'],
      });
      const request = createMockRequest({});
      const response = middleware(request);
      expect(response.status).toBe(200);
    });

    it('returns 403 when Origin is invalid URL and allowedOrigins is set', () => {
      const middleware = createMiddleware({
        allowedOrigins: ['https://example.com'],
      });
      const request = createMockRequest({
        headers: { origin: 'not-a-valid-origin' },
      });
      const response = middleware(request);
      expect(response.status).toBe(403);
    });
  });

  describe('factory behavior', () => {
    it('returns a function', () => {
      const middleware = createMiddleware({});
      expect(typeof middleware).toBe('function');
    });

    it('works with empty options', () => {
      const middleware = createMiddleware({});
      const request = createMockRequest({});
      const response = middleware(request);
      expect(response.status).toBe(200);
    });
  });
});
