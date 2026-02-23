# security-middleware-implementation.md

> **Reference Documentation — February 2026**

## Overview

Security middleware provides defense-in-depth protection for Next.js applications by implementing security headers, rate limiting, request validation, and audit logging at the edge. This middleware follows 2026 security standards including OAuth 2.1, defense-in-depth patterns, and GDPR compliance requirements. [nextjs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## Core Security Middleware Implementation

```typescript
// packages/security/src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTenantResolution } from './tenant-resolution';
import { rateLimitMiddleware } from './rate-limiting';
import { securityHeadersMiddleware } from './security-headers';
import { auditLogger } from './audit-logger';

export async function securityMiddleware(request: NextRequest): Promise<NextResponse> {
  // 1. Early audit logging
  const requestId = crypto.randomUUID();
  auditLogger.info('request_start', {
    requestId,
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    ip: request.ip,
  });

  try {
    // 2. Security headers (always first)
    const response = securityHeadersMiddleware(request);

    // 3. Rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (!rateLimitResult.allowed) {
      auditLogger.warn('rate_limit_exceeded', {
        requestId,
        ip: request.ip,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
      });

      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: response.headers,
        }
      );
    }

    // 4. Tenant resolution (for multi-tenant routes)
    const tenantResult = await verifyTenantResolution(request);
    if (!tenantResult.valid) {
      auditLogger.warn('tenant_resolution_failed', {
        requestId,
        reason: tenantResult.reason,
        hostname: request.headers.get('host'),
      });

      return NextResponse.json(
        { error: 'Invalid tenant' },
        {
          status: 404,
          headers: response.headers,
        }
      );
    }

    // 5. Request validation
    const validationResult = await validateRequest(request);
    if (!validationResult.valid) {
      auditLogger.warn('request_validation_failed', {
        requestId,
        reason: validationResult.reason,
      });

      return NextResponse.json(
        { error: 'Invalid request' },
        {
          status: 400,
          headers: response.headers,
        }
      );
    }

    // 6. Add security context to headers for downstream use
    response.headers.set('x-request-id', requestId);
    response.headers.set('x-tenant-id', tenantResult.tenantId);
    response.headers.set('x-rate-limit-remaining', rateLimitResult.remaining.toString());

    auditLogger.info('request_processed', {
      requestId,
      tenantId: tenantResult.tenantId,
      rateLimitRemaining: rateLimitResult.remaining,
    });

    return response;
  } catch (error) {
    auditLogger.error('middleware_error', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function validateRequest(request: NextRequest): Promise<{ valid: boolean; reason?: string }> {
  const url = new URL(request.url);

  // Validate hostname
  const allowedHosts = process.env.ALLOWED_HOSTS?.split(',') || [];
  const host = request.headers.get('host');

  if (!host || !allowedHosts.includes(host)) {
    return { valid: false, reason: 'Invalid host' };
  }

  // Validate content-type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (
      !contentType?.startsWith('application/json') &&
      !contentType?.startsWith('multipart/form-data')
    ) {
      return { valid: false, reason: 'Invalid content-type' };
    }
  }

  // Validate URL length (prevent DoS)
  if (url.pathname.length > 2048) {
    return { valid: false, reason: 'URL too long' };
  }

  return { valid: true };
}
```

---

## Security Headers Implementation

```typescript
// packages/security/src/security-headers.ts
import { NextRequest, NextResponse } from 'next/server';

export function securityHeadersMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Content Security Policy (CSP)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live", // Vercel analytics
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://api.supabase.co",
    "frame-src 'self' https://js.stripe.com https://cal.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (HTTPS only)
  if (request.url.startsWith('https://')) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Remove server information
  response.headers.set('Server', '');

  return response;
}
```

---

## Rate Limiting Implementation

```typescript
// packages/security/src/rate-limiting.ts
import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

export async function rateLimitMiddleware(request: NextRequest): Promise<RateLimitResult> {
  const ip = request.ip || 'unknown';
  const key = `rate_limit:${ip}`;

  // Rate limits by endpoint type
  const limits = {
    default: { requests: 100, window: 60000 }, // 100 requests per minute
    api: { requests: 1000, window: 60000 }, // 1000 requests per minute for API
    auth: { requests: 10, window: 60000 }, // 10 requests per minute for auth
    webhook: { requests: 50, window: 60000 }, // 50 requests per minute for webhooks
  };

  const url = new URL(request.url);
  const limitType = url.pathname.startsWith('/api/')
    ? url.pathname.includes('/auth/')
      ? 'auth'
      : url.pathname.includes('/webhook/')
        ? 'webhook'
        : 'api'
    : 'default';

  const limit = limits[limitType as keyof typeof limits];

  try {
    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;
    const remaining = Math.max(0, limit.requests - count - 1);
    const resetTime = Date.now() + limit.window;

    if (count >= limit.requests) {
      return {
        allowed: false,
        limit: limit.requests,
        remaining: 0,
        resetTime,
      };
    }

    // Increment counter with expiration
    await redis.set(key, (count + 1).toString(), { ex: limit.window / 1000 });

    return {
      allowed: true,
      limit: limit.requests,
      remaining,
      resetTime,
    };
  } catch (error) {
    // Fail open - allow request if Redis is down
    console.error('Rate limiting error:', error);
    return {
      allowed: true,
      limit: limit.requests,
      remaining: limit.requests - 1,
      resetTime: Date.now() + limit.window,
    };
  }
}
```

---

## Tenant Resolution Implementation

```typescript
// packages/security/src/tenant-resolution.ts
import { NextRequest } from 'next/server';

interface TenantResult {
  valid: boolean;
  tenantId?: string;
  reason?: string;
}

export async function verifyTenantResolution(request: NextRequest): Promise<TenantResult> {
  const hostname = request.headers.get('host');

  if (!hostname) {
    return { valid: false, reason: 'Missing hostname' };
  }

  // Extract tenant from subdomain or custom domain
  const tenantId = extractTenantFromHostname(hostname);

  if (!tenantId) {
    return { valid: false, reason: 'Invalid tenant format' };
  }

  // Validate tenant exists and is active
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/tenants/${tenantId}/validate`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.TENANT_VALIDATION_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return { valid: false, reason: 'Tenant not found or inactive' };
    }

    const data = await response.json();
    return { valid: true, tenantId: data.tenantId };
  } catch (error) {
    return { valid: false, reason: 'Tenant validation failed' };
  }
}

function extractTenantFromHostname(hostname: string): string | null {
  // Handle subdomain format: tenant.agency.com
  if (hostname.includes('.')) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts[0];
    }
  }

  // Handle custom domain format
  // This would require database lookup for custom domain mapping
  return null;
}
```

---

## Audit Logger Implementation

```typescript
// packages/security/src/audit-logger.ts
interface AuditLogEntry {
  event: string;
  timestamp: string;
  requestId?: string;
  tenantId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 1000; // In-memory buffer

  info(event: string, metadata?: Record<string, any>) {
    this.log('info', event, metadata);
  }

  warn(event: string, metadata?: Record<string, any>) {
    this.log('warn', event, metadata);
  }

  error(event: string, metadata?: Record<string, any>) {
    this.log('error', event, metadata);
  }

  private log(level: string, event: string, metadata?: Record<string, any>) {
    const entry: AuditLogEntry = {
      event,
      timestamp: new Date().toISOString(),
      level,
      ...metadata,
    };

    this.logs.push(entry);

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to external logging service (optional)
    if (process.env.AUDIT_WEBHOOK_URL) {
      this.sendToWebhook(entry);
    }
  }

  private async sendToWebhook(entry: AuditLogEntry) {
    try {
      await fetch(process.env.AUDIT_WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AUDIT_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send audit log to webhook:', error);
    }
  }

  getRecentLogs(count = 100): AuditLogEntry[] {
    return this.logs.slice(-count);
  }
}

export const auditLogger = new AuditLogger();
```

---

## Integration with Next.js

```typescript
// apps/*/src/middleware.ts
import { securityMiddleware } from '@repo/security/middleware';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export default securityMiddleware;
```

---

## Testing Security Middleware

```typescript
// packages/security/__tests__/middleware.test.ts
import { NextRequest } from 'next/server';
import { securityMiddleware } from '../middleware';

describe('Security Middleware', () => {
  it('should allow valid requests', async () => {
    const request = new NextRequest('https://test.agency.com/api/test', {
      method: 'GET',
      headers: {
        host: 'test.agency.com',
        'user-agent': 'test-agent',
      },
    });

    const response = await securityMiddleware(request);
    expect(response.status).toBe(200);
  });

  it('should block requests without host header', async () => {
    const request = new NextRequest('https://localhost/api/test', {
      method: 'GET',
    });

    const response = await securityMiddleware(request);
    expect(response.status).toBe(400);
  });

  it('should set security headers', async () => {
    const request = new NextRequest('https://test.agency.com/api/test', {
      method: 'GET',
      headers: {
        host: 'test.agency.com',
      },
    });

    const response = await securityMiddleware(request);

    expect(response.headers.get('Content-Security-Policy')).toBeDefined();
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });
});
```

---

## References

- Next.js Middleware Documentation — https://nextjs.org/docs/app/building-your-application/routing/middleware
- OWASP Security Headers — https://owasp.org/www-project-secure-headers/
- Rate Limiting Best Practices — https://owasp.org/www-project-rate-limiting/
- Content Security Policy Guide — https://web.dev/csp/
- Next.js Security Best Practices — https://nextjs.org/docs/app/building-your-application/deploying#security-considerations

---
