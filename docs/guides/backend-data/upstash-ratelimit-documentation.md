# upstash-ratelimit-documentation.md


## Overview

Upstash Rate Limit is a serverless rate limiting solution built on Redis that provides high-performance, globally distributed rate limiting for APIs and applications. It offers multiple algorithms, real-time analytics, and advanced traffic protection features designed for modern cloud applications.

## Key Features

### Core Capabilities

- **Serverless Architecture**: Pay-per-request pricing with no cold starts
- **Multiple Algorithms**: Sliding window, fixed window, token bucket, and more
- **Global Distribution**: Low latency from edge locations worldwide
- **Real-time Analytics**: Comprehensive monitoring and usage statistics
- **Traffic Protection**: Built-in DDoS protection and deny list capabilities

### Advanced Features

- **Caching Layer**: Local cache to reduce Redis calls for blocked requests
- **Multi-Region Support**: Synchronize across multiple Redis regions
- **Dynamic Limits**: Change rate limits at runtime without redeployment
- **Custom Rates**: Variable token consumption based on request characteristics
- **Auto IP Blocking**: Automatic IP blocking for abusive behavior

## Getting Started

### 1. Installation

```bash
# npm
npm install @upstash/ratelimit

# yarn
yarn add @upstash/ratelimit

# pnpm
pnpm add @upstash/ratelimit

# Deno
import { Ratelimit } from "https://deno.land/x/upstash_ratelimit/mod.ts"
```

### 2. Basic Setup

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Create rate limiter instance
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Basic usage
async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### 3. Environment Variables

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Rate Limiting Algorithms

### Sliding Window

```typescript
// Sliding window - most common for APIs
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
});

// Usage
const { success, remaining, reset } = await ratelimit.limit('user-123');
```

### Fixed Window

```typescript
// Fixed window - resets at fixed intervals
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(1000, '1 d'), // 1000 requests per day
});
```

### Token Bucket

```typescript
// Token bucket - allows bursts
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.tokenBucket(10, 1), // 10 tokens, refill 1 per second
});
```

### Custom Algorithm

```typescript
// Custom algorithm with specific behavior
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: (identifier) => ({
    success: true,
    limit: 100,
    remaining: 50,
    reset: Date.now() + 3600000,
    pending: Promise.resolve(),
  }),
});
```

## Advanced Configuration

### Caching

```typescript
// Enable local caching for better performance
const cache = new Map<string, number>(); // Must be outside function handler

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  ephemeralCache: cache, // Enable local caching
  analytics: true,
});

// Cache blocks reduce Redis calls
const { success, reason } = await ratelimit.limit('user-123');
if (reason === 'cacheBlock') {
  // Request blocked by local cache, no Redis call made
}
```

### Timeout Configuration

```typescript
// Set timeout for Redis operations
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  timeout: 1000, // 1 second timeout
  analytics: true,
});

// Timeout behavior
const { success, reason } = await ratelimit.limit('user-123');
if (reason === 'timeout') {
  // Request allowed due to timeout
}
```

### Analytics and Dashboard

```typescript
// Enable analytics collection
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  analytics: true, // Enable analytics
});

// Get analytics data
const analytics = await ratelimit.getAnalytics();
console.log('Total requests:', analytics.total);
console.log('Blocked requests:', analytics.blocked);
console.log('Top identifiers:', analytics.topIdentifiers);
```

## Traffic Protection

### Deny List

```typescript
// Enable traffic protection with deny list
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  enableProtection: true, // Enable deny list
  analytics: true,
});

// Check with protection data
const { success, reason, deniedValue } = await ratelimit.limit('user-123', {
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  country: 'US',
});

if (reason === 'denyList') {
  console.log('Blocked by deny list:', deniedValue);
}
```

### Auto IP Blocking

```typescript
// Auto IP blocking for abusive behavior
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  enableProtection: true,
});

// IP will be automatically blocked if it exceeds limits
const { success } = await ratelimit.limit('user-123', {
  ip: request.ip,
});
```

### Custom Protection Rules

```typescript
// Custom protection based on request characteristics
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  enableProtection: true,
  // Custom protection logic
  protection: {
    userAgents: ['bot', 'crawler', 'scraper'],
    countries: ['CN', 'RU', 'KP'],
    ips: ['192.168.1.100', '10.0.0.50'],
  },
});
```

## Multi-Region Setup

### Configuration

```typescript
// Multi-region Redis instances
const primaryRedis = new Redis({
  url: process.env.UPSTASH_REDIS_PRIMARY_URL,
  token: process.env.UPSTASH_REDIS_PRIMARY_TOKEN,
});

const secondaryRedis = new Redis({
  url: process.env.UPSTASH_REDIS_SECONDARY_URL,
  token: process.env.UPSTASH_REDIS_SECONDARY_TOKEN,
});

// Multi-region rate limiter
const ratelimit = new Ratelimit({
  redis: primaryRedis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  regions: [
    { redis: primaryRedis, region: 'us-east' },
    { redis: secondaryRedis, region: 'eu-west' },
  ],
  analytics: true,
});
```

### Synchronization

```typescript
// Asynchronous synchronization between regions
const { success, pending } = await ratelimit.limit('user-123');

// Handle pending promise for edge environments
if (pending) {
  // Vercel Edge
  context.waitUntil(pending);

  // Cloudflare Workers
  self.waitUntil(pending);
}
```

## Dynamic Limits

### Runtime Configuration

```typescript
// Dynamic limit changes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Change limit at runtime
await ratelimit.setDynamicLimit('user-123', {
  limit: 20, // Increase limit
  window: '5 s', // Change window
});

// Get current dynamic limit
const currentLimit = await ratelimit.getDynamicLimit('user-123');
```

### Conditional Limits

```typescript
// Different limits for different user types
async function getRateLimitForUser(userId: string) {
  const user = await getUser(userId);

  if (user.plan === 'premium') {
    return Ratelimit.slidingWindow(1000, '1 h');
  } else {
    return Ratelimit.slidingWindow(100, '1 h');
  }
}

// Usage
const userLimit = await getRateLimitForUser(userId);
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: userLimit,
});
```

## Custom Rates

### Variable Token Consumption

```typescript
// Custom rates based on request characteristics
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  customRates: {
    // Consume different tokens based on request size
    rate: (req) => {
      const size = JSON.stringify(req.body).length;
      return Math.ceil(size / 1024); // 1 token per KB
    },
  },
});

// Usage with custom rate
const { success } = await ratelimit.limit('user-123', {
  rate: 5, // Custom token consumption
  requestSize: 2048,
});
```

### Weighted Limits

```typescript
// Weighted rate limiting for different operations
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

// Different weights for different operations
const operations = {
  read: 1, // 1 token
  write: 5, // 5 tokens
  delete: 10, // 10 tokens
};

async function checkOperationLimit(userId: string, operation: keyof typeof operations) {
  const { success } = await ratelimit.limit(userId, {
    rate: operations[operation],
  });
  return success;
}
```

## Platform Integration

### Next.js Middleware

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export default async function middleware(request: NextRequest) {
  const identifier = request.ip || 'anonymous';

  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
```

### Express.js Middleware

```typescript
// rateLimitMiddleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Request, Response, NextFunction } from 'express';

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
});

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const identifier = req.ip || req.headers['x-forwarded-for'] || 'anonymous';

  const { success, remaining, reset } = await ratelimit.limit(identifier);

  res.set({
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(reset).toISOString(),
  });

  if (!success) {
    return res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    });
  }

  next();
}
```

### Cloudflare Workers

```typescript
// worker.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export default {
  async fetch(request, env, ctx) {
    const identifier = request.headers.get('CF-Connecting-IP') || 'anonymous';

    const { success, pending } = await ratelimit.limit(identifier);

    // Handle pending promise for analytics
    ctx.waitUntil(pending);

    if (!success) {
      return new Response('Too Many Requests', { status: 429 });
    }

    return new Response('OK');
  },
};
```

### Vercel Edge Functions

```typescript
// api/rate-limit/route.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/edge';

export const config = {
  runtime: 'edge',
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export default async function handler(request: Request) {
  const identifier = request.ip || 'anonymous';

  const { success, pending } = await ratelimit.limit(identifier);

  // Handle pending promise for analytics
  if (pending) {
    // In Vercel Edge, you can use waitUntil
    // This is handled automatically in edge functions
  }

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return Response.json({ message: 'Success' });
}
```

## Real-World Use Cases

### API Rate Limiting

```typescript
// API rate limiting with different tiers
class APIRateLimiter {
  private limiters: Map<string, Ratelimit> = new Map();

  constructor(private redis: Redis) {
    // Initialize limiters for different tiers
    this.limiters.set(
      'free',
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 h'),
        analytics: true,
      })
    );

    this.limiters.set(
      'premium',
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10000, '1 h'),
        analytics: true,
      })
    );

    this.limiters.set(
      'enterprise',
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100000, '1 h'),
        analytics: true,
      })
    );
  }

  async checkLimit(userId: string, tier: string): Promise<RatelimitResponse> {
    const limiter = this.limiters.get(tier);
    if (!limiter) {
      throw new Error(`Unknown tier: ${tier}`);
    }

    return await limiter.limit(userId);
  }
}
```

### Login Protection

```typescript
// Login rate limiting to prevent brute force
class LoginProtection {
  private ratelimit: Ratelimit;
  private failedAttempts: Map<string, number> = new Map();

  constructor(redis: Redis) {
    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
      enableProtection: true,
      analytics: true,
    });
  }

  async checkLoginAttempt(ip: string, email: string): Promise<boolean> {
    const identifier = `${ip}:${email}`;

    const { success } = await this.ratelimit.limit(identifier, {
      ip,
      userAgent: 'login-attempt',
    });

    if (!success) {
      // Log failed attempt
      const attempts = this.failedAttempts.get(identifier) || 0;
      this.failedAttempts.set(identifier, attempts + 1);

      // Block after multiple failures
      if (attempts >= 10) {
        await this.blockIP(ip);
      }
    }

    return success;
  }

  private async blockIP(ip: string): Promise<void> {
    // Add IP to deny list
    await this.ratelimit.addToDenyList('ip', ip);
  }
}
```

### Content Upload Limits

```typescript
// Rate limiting for file uploads with size-based consumption
class UploadRateLimiter {
  private ratelimit: Ratelimit;

  constructor(redis: Redis) {
    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, '1 h'),
      customRates: {
        rate: (req) => {
          // Consume tokens based on file size (1 token per MB)
          const sizeMB = req.size / (1024 * 1024);
          return Math.max(1, Math.ceil(sizeMB));
        },
      },
      analytics: true,
    });
  }

  async checkUploadLimit(userId: string, fileSize: number): Promise<boolean> {
    const { success } = await this.ratelimit.limit(userId, {
      rate: Math.ceil(fileSize / (1024 * 1024)), // 1 token per MB
      size: fileSize,
    });

    return success;
  }
}
```

### Chatbot Rate Limiting

```typescript
// Rate limiting for chatbot API with streaming support
class ChatbotRateLimiter {
  private ratelimit: Ratelimit;

  constructor(redis: Redis) {
    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
      analytics: true,
    });
  }

  async checkMessageLimit(userId: string): Promise<boolean> {
    const { success } = await this.ratelimit.limit(userId, {
      userAgent: 'chatbot-message',
    });

    return success;
  }

  async checkStreamingLimit(userId: string): Promise<boolean> {
    // Separate limit for streaming responses
    const { success } = await this.ratelimit.limit(`${userId}:streaming`, {
      userAgent: 'chatbot-stream',
    });

    return success;
  }
}
```

## Monitoring and Analytics

### Real-time Analytics

```typescript
// Analytics dashboard
class RateLimitAnalytics {
  constructor(private ratelimit: Ratelimit) {}

  async getAnalytics(): Promise<AnalyticsData> {
    const analytics = await this.ratelimit.getAnalytics();

    return {
      totalRequests: analytics.total,
      blockedRequests: analytics.blocked,
      allowedRequests: analytics.total - analytics.blocked,
      blockRate: (analytics.blocked / analytics.total) * 100,
      topIdentifiers: analytics.topIdentifiers.slice(0, 10),
      timeRange: analytics.timeRange,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getIdentifierAnalytics(identifier: string): Promise<IdentifierAnalytics> {
    const data = await this.ratelimit.getIdentifierAnalytics(identifier);

    return {
      identifier,
      totalRequests: data.total,
      blockedRequests: data.blocked,
      remainingTokens: data.remaining,
      resetTime: new Date(data.reset).toISOString(),
      lastRequest: data.lastRequest ? new Date(data.lastRequest).toISOString() : null,
    };
  }

  async getBlockedIPs(): Promise<BlockedIP[]> {
    const blocked = await this.ratelimit.getDenyList('ip');
    return blocked.map((ip) => ({
      ip: ip.value,
      blockedAt: new Date(ip.timestamp).toISOString(),
      reason: ip.reason || 'Manual block',
    }));
  }
}
```

### Performance Monitoring

```typescript
// Performance monitoring for rate limiter
class RateLimitMonitor {
  private metrics = {
    requests: 0,
    blocked: 0,
    latency: [],
    errors: 0,
  };

  constructor(private ratelimit: Ratelimit) {
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Wrap the limit method to collect metrics
    const originalLimit = this.ratelimit.limit.bind(this.ratelimit);

    this.ratelimit.limit = async (identifier: string, req?: any) => {
      const start = Date.now();
      this.metrics.requests++;

      try {
        const result = await originalLimit(identifier, req);
        const latency = Date.now() - start;
        this.metrics.latency.push(latency);

        if (!result.success) {
          this.metrics.blocked++;
        }

        return result;
      } catch (error) {
        this.metrics.errors++;
        throw error;
      }
    };
  }

  getMetrics() {
    const avgLatency =
      this.metrics.latency.length > 0
        ? this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length
        : 0;

    return {
      ...this.metrics,
      avgLatency,
      blockRate: (this.metrics.blocked / this.metrics.requests) * 100,
      errorRate: (this.metrics.errors / this.metrics.requests) * 100,
      timestamp: new Date().toISOString(),
    };
  }

  resetMetrics() {
    this.metrics = {
      requests: 0,
      blocked: 0,
      latency: [],
      errors: 0,
    };
  }
}
```

## Error Handling

### Robust Error Handling

```typescript
// Resilient rate limiting with fallbacks
class ResilientRateLimiter {
  constructor(
    private primary: Ratelimit,
    private fallback?: Ratelimit
  ) {}

  async limit(identifier: string, req?: any): Promise<RatelimitResponse> {
    try {
      return await this.primary.limit(identifier, req);
    } catch (error) {
      console.warn('Primary rate limiter failed, using fallback:', error);

      if (this.fallback) {
        return await this.fallback.limit(identifier, req);
      }

      // Fallback to allow request if no fallback available
      return {
        success: true,
        limit: 1000,
        remaining: 999,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
        reason: 'fallback',
      };
    }
  }
}
```

### Timeout Handling

```typescript
// Timeout handling with graceful degradation
class TimeoutRateLimiter {
  constructor(private ratelimit: Ratelimit) {}

  async limitWithTimeout(
    identifier: string,
    req?: any,
    timeoutMs: number = 1000
  ): Promise<RatelimitResponse> {
    const timeoutPromise = new Promise<RatelimitResponse>((_, reject) => {
      setTimeout(() => reject(new Error('Rate limit timeout')), timeoutMs);
    });

    try {
      return await Promise.race([this.ratelimit.limit(identifier, req), timeoutPromise]);
    } catch (error) {
      if (error.message === 'Rate limit timeout') {
        // Allow request on timeout
        return {
          success: true,
          limit: 1000,
          remaining: 999,
          reset: Date.now() + 3600000,
          pending: Promise.resolve(),
          reason: 'timeout',
        };
      }
      throw error;
    }
  }
}
```

## Testing

### Unit Testing

```typescript
// Mock rate limiter for testing
import { vi } from "vitest";

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: vi.fn().mockImplementation((config) => ({
    limit: vi.fn().mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 10000,
      pending: Promise.resolve(),
    }),
    getAnalytics: vi.fn().mockResolvedValue({
      total: 100,
      blocked: 5,
      topIdentifiers: [],
    }),
    setDynamicLimit: vi.fn().mockResolvedValue(undefined),
    getDynamicLimit: vi.fn().mockResolvedValue({
      limit: 10,
      window: "10 s",
    }),
  })),
}));

// Test example
import { RateLimitService } from "./rate-limit-service";

describe("RateLimitService", () => {
  let service: RateLimitService;
  let mockRatelimit: any;

  beforeEach(() => {
    mockRatelimit = new (vi.fn().mockImplementation(() => ({
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 10000,
        pending: Promise.resolve(),
      }),
    })) as any;

    service = new RateLimitService(mockRatelimit);
  });

  it("should allow requests within limit", async () => {
    const result = await service.checkLimit("user-123");

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
    expect(mockRatelimit.limit).toHaveBeenCalledWith("user-123");
  });

  it("should block requests exceeding limit", async () => {
    mockRatelimit.limit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 10000,
      pending: Promise.resolve(),
    });

    const result = await service.checkLimit("user-123");

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
```

### Integration Testing

```typescript
// Integration tests with real Redis
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

describe('Rate Limit Integration', () => {
  let redis: Redis;
  let ratelimit: Ratelimit;

  beforeAll(async () => {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_TEST_URL,
      token: process.env.UPSTASH_REDIS_TEST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
      analytics: true,
    });
  });

  afterAll(async () => {
    await redis.flushall();
  });

  it('should limit requests correctly', async () => {
    const identifier = 'test-user';

    // First 5 requests should succeed
    for (let i = 0; i < 5; i++) {
      const result = await ratelimit.limit(identifier);
      expect(result.success).toBe(true);
    }

    // 6th request should be blocked
    const result = await ratelimit.limit(identifier);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', async () => {
    const identifier = 'test-user-2';

    // Use all tokens
    for (let i = 0; i < 5; i++) {
      await ratelimit.limit(identifier);
    }

    // Should be blocked
    let result = await ratelimit.limit(identifier);
    expect(result.success).toBe(false);

    // Wait for window to reset (in real tests, use proper waiting)
    await new Promise((resolve) => setTimeout(resolve, 11000));

    // Should be allowed again
    result = await ratelimit.limit(identifier);
    expect(result.success).toBe(true);
  });
});
```

## Best Practices

### Key Design Principles

```typescript
// Consistent identifier generation
class IdentifierGenerator {
  static generateUserId(userId: string): string {
    return `user:${userId}`;
  }

  static generateIPKey(ip: string): string {
    return `ip:${ip}`;
  }

  static generateAPIKey(apiKey: string): string {
    return `api:${apiKey}`;
  }

  static generateSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
```

### Configuration Management

```typescript
// Centralized rate limit configuration
interface RateLimitConfig {
  requests: number;
  window: string;
  algorithm: string;
  enableAnalytics: boolean;
  enableProtection: boolean;
  timeout?: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  api: {
    requests: 1000,
    window: '1 h',
    algorithm: 'slidingWindow',
    enableAnalytics: true,
    enableProtection: true,
    timeout: 1000,
  },
  auth: {
    requests: 5,
    window: '15 m',
    algorithm: 'slidingWindow',
    enableAnalytics: true,
    enableProtection: true,
  },
  upload: {
    requests: 100,
    window: '1 h',
    algorithm: 'tokenBucket',
    enableAnalytics: true,
    enableProtection: false,
  },
};

class RateLimitFactory {
  static create(type: keyof typeof RATE_LIMIT_CONFIGS, redis: Redis): Ratelimit {
    const config = RATE_LIMIT_CONFIGS[type];

    const limiter = this.getLimiter(config.algorithm, config.requests, config.window);

    return new Ratelimit({
      redis,
      limiter,
      analytics: config.enableAnalytics,
      enableProtection: config.enableProtection,
      timeout: config.timeout,
      prefix: `@upstash/ratelimit:${type}`,
    });
  }

  private static getLimiter(algorithm: string, requests: number, window: string) {
    switch (algorithm) {
      case 'slidingWindow':
        return Ratelimit.slidingWindow(requests, window);
      case 'fixedWindow':
        return Ratelimit.fixedWindow(requests, window);
      case 'tokenBucket':
        return Ratelimit.tokenBucket(requests, 1);
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }
}
```

### Error Handling Patterns

```typescript
// Standardized error handling
class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly identifier: string,
    public readonly retryAfter?: number,
    public readonly resetTime?: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

class SafeRateLimiter {
  constructor(private ratelimit: Ratelimit) {}

  async checkLimit(identifier: string, req?: any): Promise<void> {
    try {
      const result = await this.ratelimit.limit(identifier, req);

      if (!result.success) {
        throw new RateLimitError(
          'Rate limit exceeded',
          identifier,
          Math.ceil((result.reset - Date.now()) / 1000),
          result.reset
        );
      }
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }

      // Log unexpected errors and allow request
      console.error('Rate limiter error:', error);
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Performance Problems

```typescript
// Diagnose performance issues
async function diagnoseRateLimitPerformance(ratelimit: Ratelimit) {
  const start = Date.now();

  // Test latency
  await ratelimit.limit('test-identifier');
  const latency = Date.now() - start;

  console.log(`Rate limit latency: ${latency}ms`);

  if (latency > 500) {
    console.log('⚠️ High latency detected:');
    console.log('- Consider enabling local caching');
    console.log('- Check Redis region proximity');
    console.log('- Review Redis connection pool settings');
  }

  // Check analytics overhead
  const analyticsStart = Date.now();
  await ratelimit.getAnalytics();
  const analyticsLatency = Date.now() - analyticsStart;

  console.log(`Analytics latency: ${analyticsLatency}ms`);

  if (analyticsLatency > 1000) {
    console.log('⚠️ Analytics overhead high:');
    console.log('- Consider disabling analytics for high-traffic endpoints');
    console.log('- Use analytics sampling');
  }
}
```

#### Memory Issues

```typescript
// Monitor memory usage in serverless environments
class MemoryMonitor {
  private static checkMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const usedMB = usage.heapUsed / 1024 / 1024;
      const totalMB = usage.heapTotal / 1024 / 1024;

      console.log(`Memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB`);

      if (usedMB > 100) {
        console.log('⚠️ High memory usage detected:');
        console.log('- Consider reducing cache size');
        console.log('- Implement cache cleanup');
        console.log('- Monitor for memory leaks');
      }
    }
  }
}

// Use in rate limiter
const cache = new Map();

// Periodic cleanup
setInterval(() => {
  if (cache.size > 1000) {
    // Clear oldest entries
    const entries = Array.from(cache.entries());
    entries.slice(0, 500).forEach(([key]) => {
      cache.delete(key);
    });
  }
}, 60000); // Every minute
```

### Debug Mode

```typescript
// Debug logging for development
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(operation: string, ...args: any[]) {
  if (DEBUG) {
    console.log(`[RATELIMIT-DEBUG] ${operation}`, ...args);
  }
}

class DebugRateLimiter extends Ratelimit {
  async limit(identifier: string, req?: any) {
    debugLog('LIMIT_START', identifier, req);
    const start = Date.now();

    try {
      const result = await super.limit(identifier, req);
      const latency = Date.now() - start;

      debugLog('LIMIT_SUCCESS', identifier, {
        success: result.success,
        remaining: result.remaining,
        latency: `${latency}ms`,
        reason: result.reason,
      });

      return result;
    } catch (error) {
      const latency = Date.now() - start;
      debugLog('LIMIT_ERROR', identifier, {
        error: error.message,
        latency: `${latency}ms`,
      });
      throw error;
    }
  }
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Resources

- [Upstash Rate Limit Documentation](https://upstash.com/docs/redis/sdks/ratelimit-ts) - Official documentation and guides
- [Getting Started](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted) - Quick start guide
- [Methods Reference](https://upstash.com/docs/redis/sdks/ratelimit-ts/methods) - Complete API reference
- [Features Overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/features) - Advanced features guide
- [Traffic Protection](https://upstash.com/docs/redis/sdks/ratelimit-ts/traffic-protection) - Security features

### Algorithm Documentation

- [Rate Limiting Algorithms](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms) - Algorithm details
- [Sliding Window](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms#sliding-window) - Sliding window algorithm
- [Token Bucket](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms#token-bucket) - Token bucket algorithm
- [Fixed Window](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms#fixed-window) - Fixed window algorithm

### Platform Integration

- [Next.js Examples](https://github.com/upstash/ratelimit/tree/main/examples/nextjs) - Next.js integration
- [Cloudflare Workers](https://github.com/upstash/ratelimit/tree/main/examples/cloudflare-workers) - Workers integration
- [Vercel Edge](https://github.com/upstash/ratelimit/tree/main/examples/vercel-edge) - Edge functions
- [Deno Examples](https://github.com/upstash/ratelimit/tree/main/examples/deno) - Deno integration
- [Remix Examples](https://github.com/upstash/ratelimit/tree/main/examples/remix) - Remix integration

### Community Resources

- [GitHub Repository](https://github.com/upstash/ratelimit) - Source code and examples
- [Upstash Console](https://console.upstash.com/ratelimit) - Management dashboard
- [Discord Community](https://upstash.com/discord) - Community discussions
- [Support Center](https://upstash.com/support) - Official support

### Learning Resources

- [Cost Guide](https://upstash.com/docs/redis/sdks/ratelimit-ts/costs) - Pricing and cost optimization
- [Best Practices](https://upstash.com/docs/redis/sdks/ratelimit-ts/best-practices) - Implementation guidelines
- [Security Guide](https://upstash.com/docs/redis/sdks/ratelimit-ts/security) - Security considerations
- [Performance Guide](https://upstash.com/docs/redis/sdks/ratelimit-ts/performance) - Performance optimization


## Implementation

[Add content here]