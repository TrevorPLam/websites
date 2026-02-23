# Multi-Layer Rate Limiting

> **2026 Standards Reference** | Last Updated: 2026-02-23  
> **Purpose:** Defense-in-depth rate limiting for multi-tenant SaaS with sliding window algorithms and per-tier protection

## Overview

Multi-layer rate limiting provides comprehensive DDoS protection and abuse prevention across multiple enforcement points. Following 2026 security standards, this implementation uses sliding window algorithms, Redis-based storage, and per-tenant tier management to prevent both sophisticated attacks and noisy neighbor problems in multi-tenant environments. [owasp-rate-limiting](https://owasp.org/www-project-rate-limiting/)

## 2026 Standards Compliance

- **OAuth 2.1 with PKCE**: Integration with modern authentication patterns
- **Core Web Vitals**: Rate limiting overhead < 5ms (INP budget)
- **Zero-Trust Architecture**: Per-request validation, no trusted internal traffic
- **Multi-Tenant Isolation**: Tenant-specific rate limits with leakage prevention
- **GDPR/CCPA**: Rate limit data retention policies and anonymization

---

## Architecture Overview

```
Edge Middleware (Vercel/Cloudflare)
    │  • Global IP-based limits (first line of defense)
    ▼
Next.js Middleware (App Router)
    │  • Tenant-aware limits (subdomain/custom domain)
    ▼
API Route Middleware
    │  • User-specific limits (authenticated via JWT)
    ▼
Service Action Layer
    │  • Endpoint-specific limits (critical operations)
    ▼
Upstash Redis (Shared State)
    │  • Sliding window algorithms
    │  • Distributed consistency
    ▼
Monitoring & Alerting
    │  • Real-time violation tracking
    │  • Automated escalation
```

---

## Core Implementation

### 1. Rate Limiting Configuration Types

```typescript
// packages/security/src/rate-limit/types.ts
export interface RateLimitConfig {
  // Global limits (apply to all requests)
  global: {
    windowMs: number; // Sliding window in milliseconds
    maxRequests: number; // Max requests per window
    blockDurationMs: number; // How long to block after violation
  };

  // Per-tenant limits (multi-tenant isolation)
  perTenant: {
    windowMs: number;
    maxRequests: number;
    blockDurationMs: number;
    tiers: {
      free: number; // Multiplier for free tier
      pro: number; // Multiplier for pro tier
      enterprise: number; // Multiplier for enterprise tier
    };
  };

  // Per-user limits (authenticated users)
  perUser: {
    windowMs: number;
    maxRequests: number;
    blockDurationMs: number;
  };

  // Endpoint-specific limits (critical operations)
  endpoints: Record<
    string,
    {
      windowMs: number;
      maxRequests: number;
      blockDurationMs: number;
    }
  >;
}

export interface RateLimitContext {
  tenantId?: string;
  userId?: string;
  endpoint?: string;
  ip: string;
  userAgent: string;
  tier?: 'free' | 'pro' | 'enterprise';
}
```

### 2. Sliding Window Algorithm Implementation

```typescript
// packages/security/src/rate-limit/sliding-window.ts
import { Redis } from '@upstash/redis';

export class SlidingWindowRateLimiter {
  constructor(
    private redis: Redis,
    private config: RateLimitConfig
  ) {}

  async checkLimit(
    key: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Redis pipeline for atomic operations
    const pipeline = this.redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiration to window duration
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const currentCount = (results?.[1]?.[1] as number) || 0;

    return {
      allowed: currentCount < maxRequests,
      remaining: Math.max(0, maxRequests - currentCount - 1),
      resetTime: now + windowMs,
    };
  }

  async checkMultiLayerLimits(context: RateLimitContext): Promise<{
    allowed: boolean;
    violatedLayer?: string;
    remaining: Record<string, number>;
    resetTimes: Record<string, number>;
  }> {
    const checks = [];

    // Global IP-based limit
    checks.push(
      this.checkLimit(
        `global:${context.ip}`,
        this.config.global.windowMs,
        this.config.global.maxRequests
      ).then((result) => ({ layer: 'global', ...result }))
    );

    // Per-tenant limit
    if (context.tenantId) {
      const tierMultiplier = this.config.perTenant.tiers[context.tier || 'free'];
      checks.push(
        this.checkLimit(
          `tenant:${context.tenantId}`,
          this.config.perTenant.windowMs,
          this.config.perTenant.maxRequests * tierMultiplier
        ).then((result) => ({ layer: 'tenant', ...result }))
      );
    }

    // Per-user limit
    if (context.userId) {
      checks.push(
        this.checkLimit(
          `user:${context.userId}`,
          this.config.perUser.windowMs,
          this.config.perUser.maxRequests
        ).then((result) => ({ layer: 'user', ...result }))
      );
    }

    // Endpoint-specific limit
    if (context.endpoint && this.config.endpoints[context.endpoint]) {
      const endpointConfig = this.config.endpoints[context.endpoint];
      checks.push(
        this.checkLimit(
          `endpoint:${context.endpoint}:${context.tenantId || 'anonymous'}`,
          endpointConfig.windowMs,
          endpointConfig.maxRequests
        ).then((result) => ({ layer: 'endpoint', ...result }))
      );
    }

    const results = await Promise.all(checks);
    const violations = results.filter((r) => !r.allowed);

    return {
      allowed: violations.length === 0,
      violatedLayer: violations[0]?.layer,
      remaining: Object.fromEntries(results.map((r) => [r.layer, r.remaining])),
      resetTimes: Object.fromEntries(results.map((r) => [r.layer, r.resetTime])),
    };
  }
}
```

### 3. Next.js Middleware Integration

```typescript
// packages/security/src/rate-limit/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { SlidingWindowRateLimiter } from './sliding-window';
import { RateLimitContext, RateLimitConfig } from './types';

export class RateLimitMiddleware {
  constructor(
    private rateLimiter: SlidingWindowRateLimiter,
    private config: RateLimitConfig
  ) {}

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    // Extract context from request
    const context = await this.extractContext(request);

    // Check all rate limits
    const result = await this.rateLimiter.checkMultiLayerLimits(context);

    if (!result.allowed) {
      return this.createRateLimitResponse(result, context);
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    this.addRateLimitHeaders(response, result);

    return response;
  }

  private async extractContext(request: NextRequest): Promise<RateLimitContext> {
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Extract tenant from hostname
    const hostname = request.headers.get('host') || '';
    const tenantId = this.extractTenantFromHostname(hostname);

    // Extract user from JWT (if authenticated)
    const userId = await this.extractUserIdFromRequest(request);

    // Extract tier from tenant or user metadata
    const tier = await this.extractTierFromContext(tenantId, userId);

    // Extract endpoint from pathname
    const endpoint = this.extractEndpointFromPath(request.nextUrl.pathname);

    return {
      tenantId,
      userId,
      endpoint,
      ip,
      userAgent,
      tier,
    };
  }

  private getClientIP(request: NextRequest): string {
    // Check various headers for real IP (accounting for proxies)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    if (realIP) {
      return realIP;
    }

    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    return request.ip || 'unknown';
  }

  private createRateLimitResponse(result: any, context: RateLimitContext): NextResponse {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        violatedLayer: result.violatedLayer,
        resetTimes: result.resetTimes,
        retryAfter: Math.max(...Object.values(result.resetTimes)),
      },
      { status: 429 }
    );

    // Add security headers
    response.headers.set(
      'Retry-After',
      String(Math.ceil((Math.max(...Object.values(result.resetTimes)) - Date.now()) / 1000))
    );

    // Log violation for monitoring
    this.logRateLimitViolation(context, result);

    return response;
  }

  private addRateLimitHeaders(response: NextResponse, result: any): void {
    Object.entries(result.remaining).forEach(([layer, remaining]) => {
      response.headers.set(`X-RateLimit-Remaining-${layer}`, String(remaining));
      response.headers.set(`X-RateLimit-Limit-${layer}`, String(this.getLimitForLayer(layer)));
      response.headers.set(`X-RateLimit-Reset-${layer}`, String(result.resetTimes[layer]));
    });
  }

  private async logRateLimitViolation(context: RateLimitContext, result: any): Promise<void> {
    // Send to monitoring system (Sentry, Tinybird, etc.)
    console.warn('Rate limit violation', {
      timestamp: new Date().toISOString(),
      violatedLayer: result.violatedLayer,
      context: {
        ip: context.ip,
        tenantId: context.tenantId,
        userId: context.userId,
        endpoint: context.endpoint,
        tier: context.tier,
        userAgent: context.userAgent,
      },
      remaining: result.remaining,
      resetTimes: result.resetTimes,
    });
  }
}
```

### 4. Production Configuration

```typescript
// packages/security/src/rate-limit/config.ts
export const productionRateLimitConfig: RateLimitConfig = {
  global: {
    windowMs: 60 * 1000, // 1 minute sliding window
    maxRequests: 1000, // 1000 requests per minute globally
    blockDurationMs: 300 * 1000, // 5 minute block
  },

  perTenant: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute per tenant
    blockDurationMs: 60 * 1000, // 1 minute block
    tiers: {
      free: 1, // 1x multiplier (100 requests)
      pro: 5, // 5x multiplier (500 requests)
      enterprise: 20, // 20x multiplier (2000 requests)
    },
  },

  perUser: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 requests per minute per user
    blockDurationMs: 30 * 1000, // 30 second block
  },

  endpoints: {
    '/api/auth/login': {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 login attempts per 15 minutes
      blockDurationMs: 15 * 60 * 1000, // 15 minute block
    },
    '/api/auth/register': {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 registrations per hour
      blockDurationMs: 60 * 60 * 1000, // 1 hour block
    },
    '/api/leads': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 lead submissions per minute
      blockDurationMs: 60 * 1000, // 1 minute block
    },
    '/api/bookings': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 bookings per minute
      blockDurationMs: 60 * 1000, // 1 minute block
    },
  },
};
```

---

## Integration Patterns

### 1. Next.js App Router Integration

```typescript
// apps/marketing/src/middleware.ts
import { RateLimitMiddleware } from '@repo/security/rate-limit';
import { productionRateLimitConfig } from '@repo/security/rate-limit/config';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const rateLimitMiddleware = new RateLimitMiddleware(
  new SlidingWindowRateLimiter(redis, productionRateLimitConfig),
  productionRateLimitConfig
);

export async function middleware(request: NextRequest) {
  // Apply rate limiting first
  const rateLimitResponse = await rateLimitMiddleware.middleware(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Continue with other middleware...
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 2. Server Action Integration

```typescript
// packages/features/src/leads/submit-lead-action.ts
import { secureAction } from '@repo/infra/secure-action';
import { RateLimitMiddleware } from '@repo/security/rate-limit';

const rateLimitMiddleware = new RateLimitMiddleware(/* ... */);

export const submitLead = secureAction
  .metadata({
    actionName: 'submit-lead',
    rateLimit: {
      endpoint: '/api/leads',
      perUser: true,
      perTenant: true,
    },
  })
  .bind(async (data: LeadSubmissionData) => {
    // Rate limiting is automatically applied by secureAction
    // based on the metadata above

    // Process lead submission...
    return await createLead(data);
  });
```

---

## Monitoring & Analytics

### 1. Real-time Dashboard

```typescript
// packages/analytics/src/rate-limit-monitoring.ts
export class RateLimitMonitoring {
  async trackViolation(violation: RateLimitViolation): Promise<void> {
    // Send to Tinybird for real-time analytics
    await fetch('https://api.tinybird.co/v0/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'rate_limit_violations',
        data: {
          timestamp: new Date().toISOString(),
          tenant_id: violation.context.tenantId,
          user_id: violation.context.userId,
          violated_layer: violation.violatedLayer,
          ip: violation.context.ip,
          endpoint: violation.context.endpoint,
          tier: violation.context.tier,
          user_agent: violation.context.userAgent,
        },
      }),
    });
  }

  async getViolationStats(timeRange: string): Promise<ViolationStats> {
    const query = `
      SELECT 
        violated_layer,
        tier,
        COUNT(*) as violation_count,
        COUNT(DISTINCT tenant_id) as affected_tenants,
        COUNT(DISTINCT ip) as unique_ips
      FROM rate_limit_violations 
      WHERE timestamp > now() - INTERVAL '${timeRange}'
      GROUP BY violated_layer, tier
      ORDER BY violation_count DESC
    `;

    const response = await fetch(`https://api.tinybird.co/v0/sql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    return response.json();
  }
}
```

### 2. Alerting Configuration

```typescript
// packages/monitoring/src/rate-limit-alerts.ts
export class RateLimitAlerts {
  async checkForAnomalies(): Promise<void> {
    const stats = await this.monitoring.getViolationStats('1h');

    // Alert on high violation rates
    const totalViolations = stats.reduce((sum, stat) => sum + stat.violation_count, 0);
    if (totalViolations > 1000) {
      await this.sendAlert({
        severity: 'high',
        title: 'High Rate Limit Violation Rate',
        message: `${totalViolations} violations in the last hour`,
        metadata: { stats },
      });
    }

    // Alert on tenant-specific issues
    const tenantViolations = stats.filter((s) => s.affected_tenants > 10);
    if (tenantViolations.length > 0) {
      await this.sendAlert({
        severity: 'medium',
        title: 'Multiple Tenants Exceeding Rate Limits',
        message: `${tenantViolations.length} tenants with high violation rates`,
        metadata: { tenantViolations },
      });
    }
  }
}
```

---

## Testing Strategy

### 1. Unit Tests

```typescript
// packages/security/src/rate-limit/__tests__/sliding-window.test.ts
import { SlidingWindowRateLimiter } from '../sliding-window';
import { RateLimitConfig } from '../types';

describe('SlidingWindowRateLimiter', () => {
  let rateLimiter: SlidingWindowRateLimiter;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    mockRedis = {
      pipeline: jest.fn(),
      zremrangebyscore: jest.fn(),
      zcard: jest.fn(),
      zadd: jest.fn(),
      expire: jest.fn(),
      exec: jest.fn(),
    } as any;

    rateLimiter = new SlidingWindowRateLimiter(mockRedis, testConfig);
  });

  describe('checkLimit', () => {
    it('should allow requests within limit', async () => {
      const mockPipeline = {
        zremrangebyscore: jest.fn().mockReturnThis(),
        zcard: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          [null, 5], // zremrangebyscore result
          [null, 5], // zcard result (5 requests in window)
          [null, 1], // zadd result
          [null, 1], // expire result
        ]),
      };

      mockRedis.pipeline.mockReturnValue(mockPipeline);

      const result = await rateLimiter.checkLimit('test-key', 60000, 10);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding limit', async () => {
      const mockPipeline = {
        zremrangebyscore: jest.fn().mockReturnThis(),
        zcard: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          [null, 10], // zremrangebyscore result
          [null, 10], // zcard result (10 requests in window)
          [null, 1], // zadd result
          [null, 1], // expire result
        ]),
      };

      mockRedis.pipeline.mockReturnValue(mockPipeline);

      const result = await rateLimiter.checkLimit('test-key', 60000, 10);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});
```

### 2. Integration Tests

```typescript
// apps/marketing/src/__tests__/rate-limit.integration.test.ts
import { createApp } from '../app';
import { Redis } from '@upstash/redis';

describe('Rate Limiting Integration', () => {
  let app: ReturnType<typeof createApp>;
  let redis: Redis;

  beforeAll(async () => {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_TEST_URL!,
      token: process.env.UPSTASH_REDIS_TEST_TOKEN!,
    });
    app = createApp({ redis });
  });

  afterEach(async () => {
    // Clean up Redis test data
    await redis.flushdb();
  });

  it('should enforce global rate limits', async () => {
    const promises = Array.from({ length: 15 }, () =>
      fetch(app.url + '/api/test', { method: 'POST' })
    );

    const responses = await Promise.all(promises);
    const successCount = responses.filter((r) => r.ok).length;
    const rateLimitedCount = responses.filter((r) => r.status === 429).length;

    expect(rateLimitedCount).toBeGreaterThan(0);
    expect(successCount).toBeLessThanOrEqual(10); // Global limit
  });

  it('should enforce per-tenant rate limits', async () => {
    const tenant1Requests = Array.from({ length: 12 }, () =>
      fetch(app.url + '/api/test', {
        method: 'POST',
        headers: { 'X-Tenant-ID': 'tenant-1' },
      })
    );

    const tenant2Requests = Array.from({ length: 12 }, () =>
      fetch(app.url + '/api/test', {
        method: 'POST',
        headers: { 'X-Tenant-ID': 'tenant-2' },
      })
    );

    const [tenant1Responses, tenant2Responses] = await Promise.all([
      Promise.all(tenant1Requests),
      Promise.all(tenant2Requests),
    ]);

    // Each tenant should be rate limited independently
    expect(tenant1Responses.filter((r) => r.status === 429).length).toBeGreaterThan(0);
    expect(tenant2Responses.filter((r) => r.status === 429).length).toBeGreaterThan(0);
  });
});
```

---

## Performance Optimization

### 1. Redis Optimization

```typescript
// Optimized Redis configuration for rate limiting
export const optimizedRedisConfig = {
  // Use pipeline for atomic operations
  pipeline: true,

  // Enable compression for large datasets
  compression: 'gzip',

  // Configure connection pooling
  connectionPool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },

  // Use Redis Cluster for horizontal scaling
  cluster: {
    enabled: true,
    nodes: [
      { url: process.env.UPSTASH_REDIS_URL_1! },
      { url: process.env.UPSTASH_REDIS_URL_2! },
      { url: process.env.UPSTASH_REDIS_URL_3! },
    ],
  },
};
```

### 2. Edge Computing Integration

```typescript
// Edge-optimized rate limiting for Vercel Edge Functions
export class EdgeRateLimiter {
  private static instance: EdgeRateLimiter;

  static getInstance(): EdgeRateLimiter {
    if (!EdgeRateLimiter.instance) {
      EdgeRateLimiter.instance = new EdgeRateLimiter();
    }
    return EdgeRateLimiter.instance;
  }

  async checkEdgeLimit(context: RateLimitContext): Promise<boolean> {
    // Use KV store for edge rate limiting (faster but less precise)
    const kv = process.env.KV_NAMESPACE;

    if (!kv) {
      return true; // Fallback to allow if KV not available
    }

    const key = `edge:${context.ip}:${Math.floor(Date.now() / 60000)}`;
    const current = await kv.get(key);
    const count = parseInt(current || '0');

    if (count >= 10) {
      // Conservative edge limit
      return false;
    }

    await kv.put(key, String(count + 1), { expirationTtl: 60 });
    return true;
  }
}
```

---

## Deployment & Operations

### 1. Environment Configuration

```bash
# .env.production
# Upstash Redis for rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Rate limiting configuration
RATE_LIMIT_GLOBAL_WINDOW_MS=60000
RATE_LIMIT_GLOBAL_MAX_REQUESTS=1000
RATE_LIMIT_TENANT_WINDOW_MS=60000
RATE_LIMIT_TENANT_MAX_REQUESTS=100

# Monitoring
TINYBIRD_TOKEN=your-tinybird-token
SENTRY_DSN=your-sentry-dsn

# Edge rate limiting (Vercel KV)
KV_NAMESPACE=your-kv-namespace
```

### 2. Docker Configuration

```dockerfile
# Dockerfile for rate limiting service
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY packages/security ./packages/security
COPY packages/shared ./packages/shared

# Build the application
RUN npm run build

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Troubleshooting Guide

### Common Issues & Solutions

**1. Redis Connection Failures**

```bash
# Check Redis connectivity
curl -X GET "$UPSTASH_REDIS_REST_URL/ping" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

# Common solutions:
# - Verify URL and token are correct
# - Check network connectivity
# - Ensure Redis instance is running
```

**2. High Memory Usage**

```typescript
// Monitor Redis memory usage
const memoryUsage = await redis.memory('usage');
console.log('Redis memory usage:', memoryUsage);

// Solutions:
// - Reduce window sizes for high-traffic endpoints
// - Implement data expiration policies
// - Use Redis Cluster for horizontal scaling
```

**3. Performance Degradation**

```typescript
// Monitor Redis performance
const stats = await redis.info('stats');
console.log('Redis performance stats:', stats);

// Solutions:
// - Enable Redis pipelining
// - Use connection pooling
// - Consider edge rate limiting for global limits
```

---

## References

- [OWASP Rate Limiting Cheat Sheet](https://owasp.org/www-project-rate-limiting/) — Security best practices
- [Upstash Redis Documentation](https://upstash.com/docs/redis) — Redis configuration and patterns
- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware) — Edge middleware patterns
- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) — Edge computing patterns
- [Redis Sliding Window Algorithm](https://redis.com/docs/data-types/sorted-sets/) — Sorted sets for rate limiting
- [Core Web Vitals Specification](https://web.dev/vitals/) — Performance standards
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01) — Authentication standards

---
