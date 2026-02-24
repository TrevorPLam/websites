# upstash-redis-documentation.md

Official Upstash Redis documentation for serverless Redis caching, rate limiting, and real-time data management as of February 2026.

## Overview

Upstash Redis is a serverless, globally distributed Redis-compatible database designed for modern cloud applications. It provides Redis APIs with serverless pricing, automatic scaling, and global replication, making it ideal for edge computing, serverless functions, and real-time applications.

## Key Features

### Core Capabilities

- **Serverless Architecture**: Pay-per-request pricing with no cold starts
- **Global Distribution**: Multi-region deployment with automatic replication
- **Redis Compatibility**: Full Redis API compatibility with popular SDKs
- **Edge Optimized**: Low latency from edge locations worldwide
- **Automatic Scaling**: No capacity planning or manual scaling required

### Advanced Features

- **Rate Limiting**: Built-in rate limiting with advanced algorithms
- **Real-time Analytics**: Performance monitoring and usage analytics
- **Traffic Protection**: DDoS protection and deny list capabilities
- **Multi-Database Support**: Multiple Redis databases per project
- **Backup and Restore**: Automated backups with point-in-time recovery

## Getting Started

### 1. Create Redis Instance

```bash
# Using Upstash CLI
npm install -g @upstash/cli
upstash redis create

# Or via Upstash Console
# Visit https://console.upstash.com/redis
```

### 2. Install SDK

```bash
# npm
npm install @upstash/redis

# yarn
yarn add @upstash/redis

# pnpm
pnpm add @upstash/redis
```

### 3. Initialize Client

```typescript
import { Redis } from '@upstash/redis';

// Environment variables
const redis = Redis.fromEnv();

// Or explicit configuration
const redis = new Redis({
  url: 'https://your-redis-url.upstash.io',
  token: 'your-redis-token',
});
```

### 4. Basic Operations

```typescript
// Set a value
await redis.set('user:123', 'John Doe');

// Get a value
const name = await redis.get('user:123');

// Set with expiration
await redis.setex('session:abc', 3600, 'session-data');

// Increment counter
await redis.incr('api-calls');

// Hash operations
await redis.hset('user:123', {
  name: 'John Doe',
  email: 'john@example.com',
  age: '30',
});
```

## SDK Integration

### Node.js/TypeScript

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Async/await usage
async function getUserData(userId: string) {
  const userData = await redis.hgetall(`user:${userId}`);
  return userData;
}

// Pipeline operations
async function updateUserActivity(userId: string) {
  const pipeline = redis.pipeline();
  pipeline.incr(`user:${userId}:views`);
  pipeline.set(`user:${userId}:lastSeen`, Date.now().toString());
  await pipeline.exec();
}
```

### Next.js Integration

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// pages/api/user/[id].ts
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await redis.hgetall(`user:${id}`);
    res.json(user);
  } else if (req.method === 'POST') {
    const { name, email } = req.body;
    await redis.hset(`user:${id}`, { name, email });
    res.status(201).json({ success: true });
  }
}
```

### Cloudflare Workers

```typescript
// Cloudflare Workers integration
import { Redis } from '@upstash/redis/cloudflare';

export default {
  async fetch(request, env, ctx) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    const key = 'counter';
    const count = await redis.incr(key);

    return new Response(`Count: ${count}`);
  },
};
```

### Vercel Edge Functions

```typescript
// Vercel Edge integration
import { Redis } from '@upstash/redis/edge';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const value = await redis.get('my-key');
  return new Response(JSON.stringify({ value }));
}
```

## Data Types and Operations

### String Operations

```typescript
// Basic string operations
await redis.set('key', 'value');
const value = await redis.get('key');

// Atomic operations
await redis.setnx('key', 'value'); // Set if not exists
await redis.getset('key', 'newValue'); // Get and set

// Numeric operations
await redis.incr('counter');
await redis.incrby('counter', 5);
await redis.decr('counter');
await redis.decrby('counter', 2);

// String manipulation
await redis.append('key', 'suffix');
await redis.strlen('key');
```

### Hash Operations

```typescript
// Hash field operations
await redis.hset('user:123', {
  name: 'John Doe',
  email: 'john@example.com',
  age: '30',
});

const name = await redis.hget('user:123', 'name');
const allFields = await redis.hgetall('user:123');
const fieldNames = await redis.hkeys('user:123');

// Hash atomic operations
await redis.hincrby('user:123', 'score', 10);
await redis.hsetnx('user:123', 'newField', 'value');
```

### List Operations

```typescript
// List operations
await redis.lpush('queue', 'item1', 'item2', 'item3');
const item = await redis.rpop('queue');

// Range operations
const items = await redis.lrange('queue', 0, -1);

// List manipulation
await redis.lrem('queue', 1, 'item2');
await redis.ltrim('queue', 0, 10);
```

### Set Operations

```typescript
// Set operations
await redis.sadd('tags', 'javascript', 'typescript', 'react');
const members = await redis.smembers('tags');

// Set operations
await redis.sadd('tags', 'vue');
await redis.srem('tags', 'javascript');

// Set operations
const intersection = await redis.sinter('set1', 'set2');
const union = await redis.sunion('set1', 'set2');
const difference = await redis.sdiff('set1', 'set2');
```

### Sorted Set Operations

```typescript
// Sorted set operations
await redis.zadd('leaderboard', {
  player1: 1000,
  player2: 850,
  player3: 920,
});

// Range operations
const topPlayers = await redis.zrange('leaderboard', 0, 9, 'REV');
const playerScore = await redis.zscore('leaderboard', 'player1');

// Score operations
await redis.zincrby('leaderboard', 50, 'player1');
await redis.zrem('leaderboard', 'player3');
```

## Advanced Features

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Rate limiting middleware
async function rateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}

// Usage in API
app.post('/api/expensive', async (req, res) => {
  const identifier = req.ip || req.headers['x-forwarded-for'];
  const allowed = await rateLimit(identifier);

  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  // Process request
  res.json({ success: true });
});
```

### Caching with Ephemeral Cache

```typescript
// Serverless function with caching
const cache = new Map<string, number>(); // Must be outside handler

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  ephemeralCache: cache, // Enable local caching
  analytics: true,
});

// Cache blocks reduce Redis calls
const { success, reason } = await ratelimit.limit('user-123');
if (reason === 'cacheBlock') {
  // Request blocked by local cache, no Redis call made
}
```

### Multi-Region Setup

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

// Write to primary, read from nearest
async function setValue(key: string, value: string) {
  await primaryRedis.set(key, value);
  // Optionally replicate to secondary
  await secondaryRedis.set(key, value);
}

async function getValue(key: string) {
  // Try secondary first (nearest)
  let value = await secondaryRedis.get(key);
  if (!value) {
    value = await primaryRedis.get(key);
  }
  return value;
}
```

### Analytics and Monitoring

```typescript
// Enable analytics
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  analytics: true, // Enable analytics collection
});

// Get analytics data
const analytics = await ratelimit.getAnalytics();
console.log('Total requests:', analytics.total);
console.log('Blocked requests:', analytics.blocked);
console.log('Top identifiers:', analytics.topIdentifiers);
```

### Traffic Protection

```typescript
// Traffic protection with deny lists
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  trafficProtection: {
    // Block specific user agents
    userAgents: ['bot', 'crawler'],
    // Block specific countries
    countries: ['CN', 'RU'],
    // Block specific IPs
    ips: ['192.168.1.1', '10.0.0.1'],
  },
});

// Custom deny lists
await ratelimit.addToDenyList('ip', 'malicious-ip');
await ratelimit.removeFromDenyList('ip', 'malicious-ip');
```

## Performance Optimization

### Connection Pooling

```typescript
// Connection pooling for high-throughput applications
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  // Connection options
  retry: 3,
  retryDelay: 100,
  timeout: 5000,
});
```

### Pipeline Operations

```typescript
// Pipeline for batch operations
async function batchUpdate(userId: string, data: Record<string, string>) {
  const pipeline = redis.pipeline();

  Object.entries(data).forEach(([key, value]) => {
    pipeline.hset(`user:${userId}`, key, value);
  });

  pipeline.incr(`user:${userId}:updates`);
  pipeline.set(`user:${userId}:lastUpdate`, Date.now().toString());

  await pipeline.exec();
}
```

### Lua Scripting

```typescript
// Atomic operations with Lua scripts
const incrementWithLimit = `
local current = redis.call('GET', KEYS[1])
local value = tonumber(current) or 0
if value < tonumber(ARGV[1]) then
  return redis.call('INCR', KEYS[1])
else
  return -1
end
`;

const result = await redis.eval(incrementWithLimit, {
  keys: ['counter'],
  arguments: ['100'],
});
```

## Real-World Use Cases

### Session Management

```typescript
// Session storage with expiration
class SessionManager {
  constructor(private redis: Redis) {}

  async createSession(userId: string, data: any) {
    const sessionId = generateSessionId();
    const sessionData = {
      userId,
      data,
      createdAt: Date.now(),
    };

    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(sessionData));
    return sessionId;
  }

  async getSession(sessionId: string) {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async extendSession(sessionId: string) {
    await redis.expire(`session:${sessionId}`, 3600);
  }

  async deleteSession(sessionId: string) {
    await redis.del(`session:${sessionId}`);
  }
}
```

### Real-time Notifications

```typescript
// Pub/Sub for real-time notifications
class NotificationService {
  constructor(private redis: Redis) {}

  async publish(channel: string, message: any) {
    await redis.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    const subscriber = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    await subscriber.subscribe(channel, (message) => {
      callback(JSON.parse(message));
    });
  }
}
```

### Leaderboard System

```typescript
// Real-time leaderboard
class Leaderboard {
  constructor(private redis: Redis) {}

  async addScore(playerId: string, score: number) {
    await redis.zincrby('leaderboard', score, playerId);
    await redis.zadd('player:scores', { [playerId]: score });
  }

  async getTopPlayers(limit: number = 10) {
    return await redis.zrange('leaderboard', 0, limit - 1, {
      rev: true,
      withScores: true,
    });
  }

  async getPlayerRank(playerId: string) {
    const rank = await redis.zrevrank('leaderboard', playerId);
    const score = await redis.zscore('leaderboard', playerId);
    return { rank: rank !== null ? rank + 1 : null, score };
  }
}
```

### Caching Layer

```typescript
// Intelligent caching with TTL
class CacheManager {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    let value = await this.get<T>(key);

    if (!value) {
      value = await fetcher();
      await this.set(key, value, ttl);
    }

    return value;
  }

  async invalidate(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

## Security Best Practices

### Environment Variables

```typescript
// Secure configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  // Security options
  enableAutoPipelining: true,
  maxRetriesPerRequest: 3,
});
```

### Data Encryption

```typescript
// Encrypt sensitive data before storage
import { encrypt, decrypt } from './crypto';

class SecureRedis {
  constructor(private redis: Redis) {}

  async setSecure(key: string, value: any, ttl?: number) {
    const encrypted = encrypt(JSON.stringify(value));
    if (ttl) {
      await this.redis.setex(key, ttl, encrypted);
    } else {
      await this.redis.set(key, encrypted);
    }
  }

  async getSecure<T>(key: string): Promise<T | null> {
    const encrypted = await this.redis.get(key);
    if (!encrypted) return null;

    try {
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }
}
```

### Access Control

```typescript
// Role-based access control
class RedisACL {
  constructor(private redis: Redis) {}

  async canAccess(userId: string, resource: string): Promise<boolean> {
    const userRole = await this.redis.hget(`user:${userId}`, 'role');
    const permissions = await this.redis.smembers(`permissions:${userRole}`);
    return permissions.includes(resource);
  }

  async grantPermission(role: string, permission: string) {
    await this.redis.sadd(`permissions:${role}`, permission);
  }
}
```

## Monitoring and Debugging

### Health Checks

```typescript
// Health check for Redis connection
async function checkRedisHealth(redis: Redis) {
  try {
    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;

    return {
      healthy: true,
      latency,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### Performance Metrics

```typescript
// Performance monitoring
class RedisMonitor {
  private metrics = {
    commands: 0,
    errors: 0,
    latency: [],
  };

  constructor(private redis: Redis) {
    this.setupMonitoring();
  }

  private setupMonitoring() {
    const originalExec = this.redis.pipeline().exec;

    this.redis.pipeline().exec = async (...args) => {
      const start = Date.now();
      try {
        const result = await originalExec.apply(this.redis.pipeline(), args);
        this.metrics.commands++;
        this.metrics.latency.push(Date.now() - start);
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
      timestamp: new Date().toISOString(),
    };
  }
}
```

### Debug Mode

```typescript
// Debug logging for development
class DebugRedis extends Redis {
  private log(level: string, operation: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[REDIS:${level}] ${operation}`, ...args);
    }
  }

  async set(key: string, value: string, ...args: any[]) {
    this.log('SET', key, value);
    return super.set(key, value, ...args);
  }

  async get(key: string) {
    this.log('GET', key);
    const result = await super.get(key);
    this.log('GET_RESULT', key, result);
    return result;
  }
}
```

## Error Handling

### Robust Error Handling

```typescript
// Retry logic with exponential backoff
async function robustRedisOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new Error(`Redis operation failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Usage
const value = await robustRedisOperation(() => redis.get('my-key'));
```

### Fallback Strategies

```typescript
// Fallback to local storage or alternative database
class ResilientRedis {
  constructor(
    private redis: Redis,
    private fallback: Map<string, any> = new Map()
  ) {}

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key);
      if (value !== null) {
        this.fallback.set(key, value);
      }
      return value;
    } catch (error) {
      console.warn('Redis failed, using fallback:', error.message);
      return this.fallback.get(key) || null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
      this.fallback.set(key, value);
    } catch (error) {
      console.warn('Redis failed, storing in fallback:', error.message);
      this.fallback.set(key, value);
    }
  }
}
```

## Testing

### Unit Testing

```typescript
// Mock Redis for testing
import { vi } from 'vitest';

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    hget: vi.fn(),
    hset: vi.fn(),
    hgetall: vi.fn(),
    incr: vi.fn(),
    pipeline: vi.fn().mockReturnValue({
      exec: vi.fn(),
    }),
  })),
}));

// Test example
import { Redis } from '@upstash/redis';
import { UserService } from './user-service';

describe('UserService', () => {
  let userService: UserService;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(() => {
    mockRedis = new Redis() as jest.Mocked<Redis>;
    userService = new UserService(mockRedis);
  });

  it('should get user data', async () => {
    const mockUser = { name: 'John', email: 'john@example.com' };
    mockRedis.hgetall.mockResolvedValue(mockUser);

    const user = await userService.getUser('123');

    expect(user).toEqual(mockUser);
    expect(mockRedis.hgetall).toHaveBeenCalledWith('user:123');
  });
});
```

### Integration Testing

```typescript
// Integration test with test Redis instance
import { Redis } from '@upstash/redis';

describe('Redis Integration', () => {
  let redis: Redis;

  beforeAll(async () => {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_TEST_URL,
      token: process.env.UPSTASH_REDIS_TEST_TOKEN,
    });
  });

  afterAll(async () => {
    await redis.flushall();
  });

  it('should store and retrieve data', async () => {
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should handle hash operations', async () => {
    await redis.hset('test-hash', { field1: 'value1', field2: 'value2' });
    const hash = await redis.hgetall('test-hash');
    expect(hash).toEqual({ field1: 'value1', field2: 'value2' });
  });
});
```

## Deployment

### Environment Configuration

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Production
UPSTASH_REDIS_REST_URL=https://prod-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=prod-redis-token

# Staging
UPSTASH_REDIS_REST_URL=https://staging-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=staging-redis-token
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Environment variables for Redis
ENV UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}
ENV UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}

EXPOSE 3000

CMD ["npm", "start"]
```

### Kubernetes Configuration

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
        - name: app
          image: my-app:latest
          env:
            - name: UPSTASH_REDIS_REST_URL
              valueFrom:
                secretKeyRef:
                  name: upstash-secrets
                  key: redis-url
            - name: UPSTASH_REDIS_REST_TOKEN
              valueFrom:
                secretKeyRef:
                  name: upstash-secrets
                  key: redis-token
```

## Best Practices

### Key Naming Conventions

```typescript
// Consistent key naming
const KEY_PATTERNS = {
  USER: 'user:{id}',
  USER_SESSION: 'session:{id}',
  USER_CACHE: 'cache:user:{id}',
  RATE_LIMIT: 'ratelimit:{type}:{id}',
  ANALYTICS: 'analytics:{date}:{type}',
  LEADERBOARD: 'leaderboard:{game}',
} as const;

// Usage
const userKey = KEY_PATTERNS.USER.replace('{id}', userId);
const sessionKey = KEY_PATTERNS.USER_SESSION.replace('{id}', sessionId);
```

### Data Structure Design

```typescript
// Structured data storage
interface UserSession {
  userId: string;
  createdAt: number;
  lastActivity: number;
  data: Record<string, any>;
}

class SessionManager {
  async createSession(session: UserSession) {
    const key = `session:${session.userId}`;
    await redis.hset(key, {
      userId: session.userId,
      createdAt: session.createdAt.toString(),
      lastActivity: session.lastActivity.toString(),
      data: JSON.stringify(session.data),
    });
    await redis.expire(key, 3600); // 1 hour TTL
  }

  async updateActivity(userId: string) {
    const key = `session:${userId}`;
    await redis.hset(key, 'lastActivity', Date.now().toString());
    await redis.expire(key, 3600); // Reset TTL
  }
}
```

### Memory Management

```typescript
// Efficient memory usage
class EfficientRedis {
  constructor(private redis: Redis) {}

  // Use hashes instead of multiple keys
  async setUserPreferences(userId: string, preferences: Record<string, string>) {
    await redis.hset(`prefs:${userId}`, preferences);
  }

  // Use sets for unique values
  async addTags(userId: string, tags: string[]) {
    await redis.sadd(`tags:${userId}`, ...tags);
  }

  // Use sorted sets for ranked data
  async updateScore(userId: string, score: number) {
    await redis.zadd('leaderboard', { [userId]: score });
  }

  // Clean up expired data
  async cleanupExpiredSessions() {
    const pattern = 'session:*';
    const keys = await redis.keys(pattern);

    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        // No expiration set
        await redis.expire(key, 3600); // Set default TTL
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Connection Problems

```typescript
// Connection diagnostics
async function diagnoseConnection(redis: Redis) {
  try {
    // Test basic connectivity
    await redis.ping();
    console.log('✅ Basic connectivity OK');

    // Test authentication
    await redis.set('test', 'test');
    const value = await redis.get('test');
    if (value === 'test') {
      console.log('✅ Read/write operations OK');
      await redis.del('test');
    } else {
      console.log('❌ Read/write operations failed');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);

    if (error.message.includes('UNAUTHORIZED')) {
      console.log('Check your Redis token');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('Check your Redis URL');
    } else if (error.message.includes('timeout')) {
      console.log('Network timeout, check connectivity');
    }
  }
}
```

#### Performance Issues

```typescript
// Performance diagnostics
async function diagnosePerformance(redis: Redis) {
  const start = Date.now();

  // Test latency
  await redis.ping();
  const latency = Date.now() - start;
  console.log(`Latency: ${latency}ms`);

  if (latency > 1000) {
    console.log('⚠️ High latency detected');
    console.log('Consider:');
    console.log('- Using nearest Redis region');
    console.log('- Implementing local caching');
    console.log('- Using pipeline operations');
  }

  // Test memory usage
  try {
    const info = await redis.info('memory');
    console.log('Memory info:', info);
  } catch (error) {
    console.log('Memory info not available');
  }
}
```

### Debug Mode

```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(operation: string, ...args: any[]) {
  if (DEBUG) {
    console.log(`[REDIS-DEBUG] ${operation}`, ...args);
  }
}

// Wrap Redis methods for debugging
class DebugRedis extends Redis {
  async get(key: string) {
    debugLog('GET', key);
    const start = Date.now();
    try {
      const result = await super.get(key);
      debugLog('GET_RESULT', key, result, `${Date.now() - start}ms`);
      return result;
    } catch (error) {
      debugLog('GET_ERROR', key, error, `${Date.now() - start}ms`);
      throw error;
    }
  }

  async set(key: string, value: string, ...args: any[]) {
    debugLog('SET', key, value, ...args);
    const start = Date.now();
    try {
      const result = await super.set(key, value, ...args);
      debugLog('SET_RESULT', key, `${Date.now() - start}ms`);
      return result;
    } catch (error) {
      debugLog('SET_ERROR', key, error, `${Date.now() - start}ms`);
      throw error;
    }
  }
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Resources

- [Upstash Documentation](https://upstash.com/docs) - Official documentation and guides
- [Redis SDK Documentation](https://upstash.com/docs/redis/sdks) - Complete SDK reference
- [Rate Limiting Guide](https://upstash.com/docs/redis/sdks/ratelimit-ts) - Rate limiting documentation
- [Getting Started](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted) - Quick start guide
- [Upstash Console](https://console.upstash.com) - Management dashboard

### SDK References

- [Node.js SDK](https://upstash.com/docs/redis/sdks/nodejs) - Node.js/TypeScript SDK
- [Python SDK](https://upstash.com/docs/redis/sdks/python) - Python SDK documentation
- [Go SDK](https://upstash.com/docs/redis/sdks/go) - Go SDK documentation
- [Java SDK](https://upstash.com/docs/redis/sdks/java) - Java SDK documentation
- [Rust SDK](https://upstash.com/docs/redis/sdks/rust) - Rust SDK documentation

### Platform Integration

- [Next.js Integration](https://upstash.com/docs/redis/sdks/examples/nextjs) - Next.js examples
- [Cloudflare Workers](https://upstash.com/docs/redis/sdks/cloudflare) - Cloudflare integration
- [Vercel Edge](https://upstash.com/docs/redis/sdks/vercel) - Vercel Edge functions
- [Deno](https://upstash.com/docs/redis/sdks/deno) - Deno integration
- [Fastly](https://upstash.com/docs/redis/sdks/fastly) - Fastly Compute@Edge

### Community Resources

- [Upstash Blog](https://upstash.com/blog) - Best practices and tutorials
- [GitHub Repository](https://github.com/upstash) - Source code and examples
- [Discord Community](https://upstash.com/discord) - Community discussions
- [Support Center](https://upstash.com/support) - Official support

### Learning Resources

- [Redis Commands Reference](https://upstash.com/docs/redis/commands) - Complete command reference
- [Rate Limiting Examples](https://github.com/upstash/ratelimit) - Rate limiting examples
- [Performance Guide](https://upstash.com/docs/redis/performance) - Performance optimization
- [Security Guide](https://upstash.com/docs/redis/security) - Security best practices

## Implementation

[Add content here]
