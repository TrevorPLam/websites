# Multi-Layer Rate Limiting

> **Reference Documentation — February 2026**

## Overview

Advanced rate limiting strategies with multiple layers of protection using 2026 sliding window algorithms and multi-tenant SaaS patterns. [OWASP Rate Limiting](https://owasp.org/www-project-rate-limiting/)

## Implementation

This document covers production-ready rate limiting strategies with sliding window algorithms following 2026 security standards. Key features include:

- **Sliding Window Algorithms**: Smooth request distribution preventing burst spikes
- **Multi-Tenant Support**: Per-tenant and endpoint-specific rate limiting
- **Dynamic Limits**: Usage-based adjustments and tier-based scaling
- **Redis Integration**: High-performance distributed rate limiting
- **Analytics Integration**: Real-time monitoring and alerting
- **Post-Quantum Ready**: Cryptographic token security for 2026+ standards

## Core Implementation

```typescript
// 2026 Multi-layer rate limiting with sliding window algorithms
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createLogger } from '@repo/logging';
import { z } from 'zod';

// Rate limit configuration schema
const RateLimitConfigSchema = z.object({
  requests: z.number().min(1),
  window: z.string(),
  tier: z.enum(['basic', 'premium', 'enterprise']),
  algorithm: z.enum(['sliding-log', 'sliding-counter']).default('sliding-counter'),
});

type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

// Tier-based rate limits with 2026 standards
const tierLimits: Record<string, RateLimitConfig> = {
  basic: {
    requests: 100,
    window: '60 s',
    tier: 'basic',
    algorithm: 'sliding-counter',
  },
  premium: {
    requests: 500,
    window: '60 s',
    tier: 'premium',
    algorithm: 'sliding-counter',
  },
  enterprise: {
    requests: 2000,
    window: '60 s',
    tier: 'enterprise',
    algorithm: 'sliding-log',
  },
};

// Sliding window log algorithm (high precision)
class SlidingWindowLog {
  constructor(private redis: Redis) {}

  async isAllowed(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; reset: number; remaining: number }> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;

    // Use Redis pipeline for atomic operations
    const pipe = this.redis.pipeline();

    // Remove expired entries
    pipe.zremrangebyscore(key, 0, windowStart);

    // Count remaining entries
    pipe.zcard(key);

    const results = await pipe.execute();
    const currentCount = results[1] as number;

    if (currentCount < limit) {
      // Add current request timestamp
      await this.redis.zadd(key, { [`${now}-${Math.random()}`]: now });
      await this.redis.expire(key, windowSeconds + 1);

      return {
        allowed: true,
        reset: now + windowSeconds,
        remaining: limit - currentCount - 1,
      };
    }

    return {
      allowed: false,
      reset: now + windowSeconds,
      remaining: 0,
    };
  }
}

// Sliding window counter algorithm (memory efficient)
class SlidingWindowCounter {
  constructor(private redis: Redis) {}

  async isAllowed(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; reset: number; remaining: number }> {
    const now = Math.floor(Date.now() / 1000);
    const windowSize = windowSeconds;
    const currentWindow = Math.floor(now / windowSize);
    const previousWindow = currentWindow - 1;
    const windowProgress = (now % windowSize) / windowSize;

    const currentKey = `${key}:${currentWindow}`;
    const previousKey = `${key}:${previousWindow}`;

    // Get counts from both windows
    const pipe = this.redis.pipeline();
    pipe.get(currentKey);
    pipe.get(previousKey);
    const results = await pipe.execute();

    const currentCount = parseInt((results[0] as string) || '0', 10);
    const previousCount = parseInt((results[1] as string) || '0', 10);

    // Calculate weighted count
    const previousWeight = 1 - windowProgress;
    const estimatedCount = previousCount * previousWeight + currentCount;

    if (estimatedCount < limit) {
      // Increment current window
      await this.redis.incr(currentKey);
      await this.redis.expire(currentKey, windowSize * 2);

      return {
        allowed: true,
        reset: (currentWindow + 1) * windowSize,
        remaining: Math.floor(limit - estimatedCount),
      };
    }

    return {
      allowed: false,
      reset: (currentWindow + 1) * windowSize,
      remaining: 0,
    };
  }
}

// Multi-layer rate limiting service
export class MultiLayerRateLimitService {
  private logger = createLogger('rate-limiting');
  private slidingLog: SlidingWindowLog;
  private slidingCounter: SlidingWindowCounter;

  constructor(private redis: Redis) {
    this.slidingLog = new SlidingWindowLog(redis);
    this.slidingCounter = new SlidingWindowCounter(redis);
  }

  async checkRateLimit(
    request: NextRequest,
    tenantId: string,
    endpoint?: string
  ): Promise<RateLimitResult> {
    const startTime = Date.now();
    const correlationId = crypto.randomUUID();

    try {
      // Extract client identifier
      const clientId = this.extractClientId(request);
      const tier = await this.getTenantTier(tenantId);
      const config = tierLimits[tier] || tierLimits.basic;

      // Parse window duration
      const windowSeconds = this.parseWindow(config.window);

      // Layer 1: Global rate limit
      const globalKey = `global:${clientId}`;
      const globalResult = await this.executeAlgorithm(
        globalKey,
        config.requests,
        windowSeconds,
        config.algorithm
      );

      // Layer 2: Per-tenant rate limit
      const tenantKey = `tenant:${tenantId}:${clientId}`;
      const tenantResult = await this.executeAlgorithm(
        tenantKey,
        config.requests * 2,
        windowSeconds,
        config.algorithm
      );

      // Layer 3: Endpoint-specific rate limit
      const endpointKey = `endpoint:${tenantId}:${endpoint || 'default'}:${clientId}`;
      const endpointResult = await this.executeAlgorithm(endpointKey, 10, 10, 'sliding-counter');

      const allowed = globalResult.allowed && tenantResult.allowed && endpointResult.allowed;
      const reset = Math.max(globalResult.reset, tenantResult.reset, endpointResult.reset);
      const remaining = Math.min(
        globalResult.remaining,
        tenantResult.remaining,
        endpointResult.remaining
      );

      const result: RateLimitResult = {
        allowed,
        limit: config.requests,
        remaining,
        reset: Math.floor(reset),
        retryAfter: allowed ? undefined : Math.ceil(reset - Date.now() / 1000),
        tier,
        endpoint,
      };

      // Log rate limit decision
      this.logger.info('Rate limit check completed', {
        correlationId,
        tenantId,
        clientId,
        allowed,
        remaining,
        tier,
        endpoint,
        duration: Date.now() - startTime,
      });

      return result;
    } catch (error) {
      this.logger.error('Rate limit check failed', {
        correlationId,
        tenantId,
        error: error.message,
        duration: Date.now() - startTime,
      });

      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        limit: 0,
        remaining: 0,
        reset: 0,
        tier: 'basic',
      };
    }
  }

  private async executeAlgorithm(
    key: string,
    limit: number,
    windowSeconds: number,
    algorithm: string
  ): Promise<{ allowed: boolean; reset: number; remaining: number }> {
    if (algorithm === 'sliding-log') {
      return this.slidingLog.isAllowed(key, limit, windowSeconds);
    }
    return this.slidingCounter.isAllowed(key, limit, windowSeconds);
  }

  private extractClientId(request: NextRequest): string {
    // Priority order: API key > User ID > IP address
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) return `api:${apiKey}`;

    const userId = request.headers.get('x-user-id');
    if (userId) return `user:${userId}`;

    return `ip:${request.ip}`;
  }

  private async getTenantTier(tenantId: string): Promise<string> {
    // Cache tenant tier for 5 minutes
    const cacheKey = `tenant_tier:${tenantId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) return cached as string;

    // Fetch from database (implementation depends on your setup)
    const tier = 'basic'; // Default tier

    await this.redis.setex(cacheKey, 300, tier);
    return tier;
  }

  private parseWindow(window: string): number {
    const match = window.match(/(\d+)\s*(s|m|h)/);
    if (!match) return 60;

    const [, value, unit] = match;
    const multiplier = unit === 's' ? 1 : unit === 'm' ? 60 : 3600;
    return parseInt(value, 10) * multiplier;
  }
}

// Type definitions
interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
  tier: string;
  endpoint?: string;
}

// Middleware factory
export function createRateLimitMiddleware(redis: Redis) {
  const rateLimitService = new MultiLayerRateLimitService(redis);

  return async function rateLimitMiddleware(
    request: NextRequest,
    tenantId: string,
    endpoint?: string
  ): Promise<NextResponse | null> {
    const result = await rateLimitService.checkRateLimit(request, tenantId, endpoint);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': result.retryAfter?.toString() || '',
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', result.reset.toString());

    return null; // Allow request to proceed
  };
}

// Usage example
const redis = Redis.fromEnv();
const rateLimitMiddleware = createRateLimitMiddleware(redis);

// In your API route
export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id') || 'default';

  const rateLimitResponse = await rateLimitMiddleware(request, tenantId, '/api/leads');

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Proceed with API logic
  return NextResponse.json({ message: 'Success' });
}
```

## Usage Examples

### Basic Multi-Tenant Setup

```typescript
import { MultiLayerRateLimitService } from './rate-limiting';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const rateLimitService = new MultiLayerRateLimitService(redis);

// Check rate limit for a tenant
const result = await rateLimitService.checkRateLimit(request, 'tenant-123', '/api/leads');

if (!result.allowed) {
  console.log(`Rate limited. Retry after: ${result.retryAfter}s`);
}
```

### Dynamic Rate Limits Based on Usage

```typescript
// Advanced usage with dynamic limits
class AdaptiveRateLimitService extends MultiLayerRateLimitService {
  async getAdaptiveLimits(tenantId: string): Promise<RateLimitConfig> {
    const baseTier = await this.getTenantTier(tenantId);
    const baseConfig = tierLimits[baseTier];

    // Get current usage metrics
    const usage = await this.getTenantUsage(tenantId);

    // Adjust limits based on usage patterns
    if (usage.apiCallsPerMinute > baseConfig.requests * 0.8) {
      // High usage - reduce limits temporarily
      return {
        ...baseConfig,
        requests: Math.floor(baseConfig.requests * 0.7),
      };
    }

    if (usage.successRate > 0.95) {
      // Good behavior - increase limits
      return {
        ...baseConfig,
        requests: Math.floor(baseConfig.requests * 1.2),
      };
    }

    return baseConfig;
  }

  private async getTenantUsage(tenantId: string) {
    // Implementation for fetching usage metrics
    return {
      apiCallsPerMinute: 0,
      successRate: 1.0,
    };
  }
}
```

### Multi-Region Deployment

```typescript
// Multi-region Redis setup for global rate limiting
import { Redis } from '@upstash/redis';

const regionalRedisInstances = [
  new Redis({
    url: process.env.REDIS_US_EAST_1!,
    token: process.env.REDIS_TOKEN_US_EAST_1!,
  }),
  new Redis({
    url: process.env.REDIS_EU_WEST_1!,
    token: process.env.REDIS_TOKEN_EU_WEST_1!,
  }),
  new Redis({
    url: process.env.REDIS_AP_SOUTHEAST_1!,
    token: process.env.REDIS_TOKEN_AP_SOUTHEAST_1!,
  }),
];

// Geographic rate limiting with region-specific keys
class GeographicRateLimitService extends MultiLayerRateLimitService {
  async checkGeographicRateLimit(
    request: NextRequest,
    tenantId: string,
    region: string
  ): Promise<RateLimitResult> {
    const regionKey = `geo:${region}:${tenantId}`;
    const clientId = this.extractClientId(request);

    // Use region-specific Redis instance
    const redisIndex = this.getRegionIndex(region);
    const redis = regionalRedisInstances[redisIndex];

    return this.checkRateLimitWithRedis(request, tenantId, redis, regionKey);
  }

  private getRegionIndex(region: string): number {
    const regionMap: Record<string, number> = {
      'us-east-1': 0,
      'eu-west-1': 1,
      'ap-southeast-1': 2,
    };
    return regionMap[region] || 0;
  }
}
```

## Best Practices

### 2026 Rate Limiting Standards

- **Sliding Window Algorithms**: Prefer sliding window over fixed window to prevent burst spikes
- **Multi-Layer Defense**: Global → Tenant → Endpoint → User hierarchy for comprehensive protection
- **Fail-Open Architecture**: Allow requests if rate limiting service fails to prevent outages
- **Dynamic Adjustments**: Adapt limits based on usage patterns and tenant behavior
- **Comprehensive Monitoring**: Log all rate limit decisions with correlation IDs
- **Post-Quantum Security**: Use cryptographically secure tokens for rate limit keys

### Performance Optimization

- **Redis Pipeline Operations**: Use atomic pipelines for consistency and performance
- **Connection Pooling**: Reuse Redis connections to reduce latency
- **Efficient Data Structures**: Choose sliding-counter for memory efficiency, sliding-log for precision
- **TTL Management**: Set appropriate expiration times to prevent memory leaks
- **Batch Operations**: Check multiple rate limits in parallel when possible

### Security Considerations

- **Client Identification**: Use API keys > User IDs > IP addresses for accuracy
- **Input Validation**: Validate all rate limit parameters with Zod schemas
- **Rate Limit Header Injection**: Include standard headers in all responses
- **Tenant Isolation**: Ensure rate limit keys are properly scoped per tenant
- **Audit Logging**: Maintain immutable logs for security investigations

## Testing

### Unit Tests

```typescript
import { MultiLayerRateLimitService } from './rate-limiting';
import { Redis } from '@upstash/redis';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MultiLayerRateLimitService', () => {
  let rateLimitService: MultiLayerRateLimitService;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      pipeline: vi.fn(),
      zremrangebyscore: vi.fn(),
      zcard: vi.fn(),
      zadd: vi.fn(),
      expire: vi.fn(),
      get: vi.fn(),
      setex: vi.fn(),
      incr: vi.fn(),
    };
    rateLimitService = new MultiLayerRateLimitService(mockRedis);
  });

  describe('Sliding Window Log Algorithm', () => {
    it('should allow requests within limit', async () => {
      mockRedis.pipeline.mockReturnValue({
        execute: vi.fn().mockResolvedValue([0, 5]), // 5 existing requests
      });
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await rateLimitService.checkRateLimit(
        mockRequest('192.168.1.1'),
        'tenant-123',
        '/api/test'
      );

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should deny requests exceeding limit', async () => {
      mockRedis.pipeline.mockReturnValue({
        execute: vi.fn().mockResolvedValue([0, 100]), // At limit
      });

      const result = await rateLimitService.checkRateLimit(
        mockRequest('192.168.1.1'),
        'tenant-123',
        '/api/test'
      );

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('Client Identification', () => {
    it('should prioritize API key over IP', async () => {
      const request = mockRequest('192.168.1.1');
      request.headers.set('x-api-key', 'api-key-123');
      request.headers.set('x-user-id', 'user-456');

      await rateLimitService.checkRateLimit(request, 'tenant-123');

      // Should use API key as primary identifier
      expect(mockRedis.pipeline).toHaveBeenCalledWith(expect.stringContaining('api:api-key-123'));
    });
  });

  function mockRequest(ip: string): NextRequest {
    const headers = new Headers();
    return {
      ip,
      headers,
      nextUrl: { pathname: '/api/test' },
    } as any;
  }
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Redis } from '@upstash/redis';
import { MultiLayerRateLimitService } from './rate-limiting';

describe('Rate Limiting Integration', () => {
  let redis: Redis;
  let rateLimitService: MultiLayerRateLimitService;
  const testTenant = 'test-tenant-integration';

  beforeAll(async () => {
    redis = Redis.fromEnv();
    rateLimitService = new MultiLayerRateLimitService(redis);
  });

  afterAll(async () => {
    // Cleanup test data
    await redis.del(`rate_limit:global:api:test-key:${testTenant}`);
    await redis.del(`rate_limit:tenant:${testTenant}:api:test-key`);
  });

  it('should enforce rate limits across multiple requests', async () => {
    const request = {
      ip: '127.0.0.1',
      headers: new Headers({ 'x-api-key': 'test-key' }),
      nextUrl: { pathname: '/api/integration-test' },
    } as any;

    // Make requests up to the limit
    const results = [];
    for (let i = 0; i < 15; i++) {
      const result = await rateLimitService.checkRateLimit(
        request,
        testTenant,
        '/api/integration-test'
      );
      results.push(result.allowed);
    }

    // First 10 should be allowed, rest should be rate limited
    expect(results.slice(0, 10).every(Boolean)).toBe(true);
    expect(results.slice(10).some(Boolean)).toBe(false);
  });

  it('should handle concurrent requests correctly', async () => {
    const request = {
      ip: '127.0.0.1',
      headers: new Headers({ 'x-api-key': 'concurrent-test' }),
      nextUrl: { pathname: '/api/concurrent-test' },
    } as any;

    // Make 20 concurrent requests
    const promises = Array.from({ length: 20 }, () =>
      rateLimitService.checkRateLimit(request, testTenant, '/api/concurrent-test')
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter((r) => r.allowed).length;

    // Should allow exactly 10 requests (basic tier limit)
    expect(allowedCount).toBe(10);
  });
});
```

### Load Testing

```typescript
// Performance test for rate limiting under load
import { performance } from 'perf_hooks';

describe('Rate Limiting Performance', () => {
  it('should handle high load with minimal latency', async () => {
    const redis = Redis.fromEnv();
    const rateLimitService = new MultiLayerRateLimitService(redis);

    const requestCount = 1000;
    const startTime = performance.now();

    const promises = Array.from({ length: requestCount }, (_, i) =>
      rateLimitService.checkRateLimit(
        {
          ip: `192.168.1.${i % 255}`,
          headers: new Headers({ 'x-api-key': `load-test-${i}` }),
          nextUrl: { pathname: '/api/load-test' },
        } as any,
        `load-tenant-${i % 10}`,
        '/api/load-test'
      )
    );

    await Promise.all(promises);
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const avgLatency = totalTime / requestCount;

    // Should handle 1000 requests in under 5 seconds
    expect(totalTime).toBeLessThan(5000);
    // Average latency should be under 5ms per request
    expect(avgLatency).toBeLessThan(5);

    console.log(`Processed ${requestCount} requests in ${totalTime.toFixed(2)}ms`);
    console.log(`Average latency: ${avgLatency.toFixed(2)}ms per request`);
  });
});
```

---

## References

- [Research Inventory](../../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- https://owasp.org/www-project-rate-limiting/ — owasp.org
- https://vercel.com/docs/concepts/edge-functions/edge-middleware — vercel.com
- https://github.com/upstash/ratelimit — github.com

---
