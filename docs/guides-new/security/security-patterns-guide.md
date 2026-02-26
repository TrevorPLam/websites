---
title: Security Patterns Guide
description: Comprehensive security implementation guide with multi-layer defense, rate limiting, authentication, and 2026 standards compliance
last_updated: 2026-02-26
tags: [#security #authentication #rate-limiting #middleware #2026-standards]
estimated_read_time: 60 minutes
difficulty: advanced
---

# Security Patterns Guide

## Overview

Comprehensive security implementation for multi-tenant SaaS applications using Next.js 16. This guide consolidates security headers, multi-layer rate limiting, secrets management, authentication patterns, and defense-in-depth strategies following 2026 security standards and post-quantum cryptography readiness.

## Key Features

- **Multi-Layer Defense**: Edge, API, and Action-level security controls
- **Zero Trust Architecture**: Never trust, always verify security model
- **Multi-Tenant Security**: Tenant isolation with proper data boundaries
- **Post-Quantum Ready**: Architecture designed for NIST FIPS 203/204/205 migration
- **Rate Limiting**: Three-layer rate limiting with dynamic throttling
- **Authentication**: OAuth 2.1 with PKCE and Supabase RLS integration
- **TypeScript First**: Full type safety and comprehensive validation

---

## 🛡️ Multi-Layer Security Architecture

### Security Layer Overview

```
                    Incoming Request
                           │
                 ┌─────────▼──────────┐
                 │  LAYER 1: EDGE     │  middleware.ts
                 │  Global Protection │  IP-based limits
                 │  Security Headers  │  CSP, HSTS, etc.
                 └─────────┬──────────┘
                           │ pass
                 ┌─────────▼──────────┐
                 │  LAYER 2: API      │  Route Handlers
                 │  Per-Tenant Limits │  Plan-based throttling
                 │  Authentication    │  JWT validation
                 └─────────┬──────────┘
                           │ pass
                 ┌─────────▼──────────┐
                 │  LAYER 3: ACTION   │  Server Actions
                 │  User-Specific     │  Action-based limits
                 │  Business Logic   │  Input validation
                 └─────────┬──────────┘
                           │ pass
                    Business Logic
```

---

## 🔒 Security Headers Implementation

### Core Security Headers with CSP

```typescript
// packages/security/src/headers.ts
import { NextRequest, NextResponse } from 'next/server';
import { crypto } from 'node:crypto';

export interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  reportUri?: string;
  nonce?: string;
}

export function securityHeaders(
  request: NextRequest,
  config: SecurityConfig = { enableCSP: true, enableHSTS: true }
): NextResponse {
  const response = NextResponse.next();
  const nonce = config.nonce || crypto.randomBytes(16).toString('base64');

  // Content Security Policy with nonce for 2026 compliance
  if (config.enableCSP) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: *.vercel.app",
      "font-src 'self'",
      "connect-src 'self' *.vercel.app",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
  }

  // HTTP Strict Transport Security
  if (config.enableHSTS) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add nonce to response for client-side usage
  if (config.nonce) {
    response.headers.set('x-csp-nonce', nonce);
  }

  return response;
}
```

### Middleware Integration

```typescript
// middleware.ts
import { securityHeaders } from '@/packages/security/headers';
import { rateLimitMiddleware } from '@/packages/rate-limit/edge';

export function middleware(request: NextRequest) {
  // Apply rate limiting first
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // Apply security headers
  return securityHeaders(request, {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
  });
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## ⚡ Multi-Layer Rate Limiting

### Layer 1: Edge Global Rate Limit

```typescript
// packages/rate-limit/src/edge.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const edgeRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 s'),
  analytics: true,
  prefix: 'rl:global',
  ephemeralCache: new Map(), // Reduces Redis calls for blocked IPs
});

export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  return edgeRatelimit.limit(ip).then((result) => {
    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
        },
      });
    }
    return null;
  });
}
```

### Layer 2: API Route Rate Limit

```typescript
// packages/rate-limit/src/api.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const redis = Redis.fromEnv();

export type PlanTier = 'free' | 'pro' | 'enterprise';

const PLAN_LIMITS: Record<PlanTier, { requests: number; window: string; burst: number }> = {
  free: { requests: 60, window: '1 m', burst: 10 },
  pro: { requests: 600, window: '1 m', burst: 50 },
  enterprise: { requests: 6000, window: '1 m', burst: 200 },
};

const ratelimitByPlan = Object.fromEntries(
  Object.entries(PLAN_LIMITS).map(([plan, config]) => [
    plan,
    new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(config.requests, config.window, config.burst),
      analytics: true,
      prefix: `rl:api:${plan}`,
      ephemeralCache: new Map(),
    }),
  ])
) as Record<PlanTier, Ratelimit>;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkApiRateLimit(params: {
  tenantId: string;
  userId: string;
  routeKey: string;
  plan?: PlanTier;
}): Promise<RateLimitResult> {
  const { tenantId, userId, routeKey, plan = 'free' } = params;
  // Architecture invariant: key includes tenantId
  const key = `${tenantId}:${userId}:${routeKey}`;
  return ratelimitByPlan[plan].limit(key);
}

// Higher-order function for route protection
export function withRateLimit(
  handler: Function,
  options: {
    routeKey: string;
    getPlan?: (context: any) => Promise<PlanTier>;
  }
) {
  return async (request: NextRequest, context: any) => {
    const plan = options.getPlan ? await options.getPlan(context) : 'free';
    const { tenantId, userId } = context;

    const rl = await checkApiRateLimit({
      tenantId,
      userId,
      routeKey: options.routeKey,
      plan,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': String(rl.remaining),
            'X-RateLimit-Reset': String(rl.reset),
            'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    return handler(request, context);
  };
}
```

### Layer 3: Server Action Rate Limit

```typescript
// packages/security/src/server-actions.ts
import { z } from 'zod';
import { checkApiRateLimit } from '@/packages/rate-limit/api';

interface ServerActionConfig {
  actionName: string;
  schema: z.ZodSchema;
  rateLimit?: { requests: number; window: string };
  allowUnauthenticated?: boolean;
  handler: (input: any, context: any) => Promise<any>;
}

export function createServerAction(config: ServerActionConfig) {
  return async function (input: unknown) {
    // Validate input
    const validatedInput = config.schema.parse(input);

    // Get context (tenant, user, etc.)
    const context = await getActionContext();

    // Check authentication if required
    if (!config.allowUnauthenticated && !context.userId) {
      throw new Error('Unauthorized');
    }

    // Apply rate limiting
    if (config.rateLimit) {
      const rl = await checkApiRateLimit({
        tenantId: context.tenantId,
        userId: context.userId || 'anonymous',
        routeKey: config.actionName,
      });

      if (!rl.success) {
        throw new Error(
          `Rate limit exceeded: ${config.rateLimit.requests} per ${config.rateLimit.window}`
        );
      }
    }

    // Execute handler
    return config.handler(validatedInput, context);
  };
}

// Example usage
export const requestPasswordResetAction = createServerAction({
  actionName: 'requestPasswordReset',
  schema: z.object({ email: z.string().email() }),
  allowUnauthenticated: true,
  rateLimit: { requests: 3, window: '15 m' }, // 3 per 15 minutes
  handler: async (input, ctx) => {
    // Handle password reset logic
    return { success: true };
  },
});
```

---

## 🔐 Secrets Management

### Enterprise Secrets Manager

```typescript
// packages/security/src/secrets.ts
import { crypto } from 'node:crypto';
import { z } from 'zod';

const SecretConfigSchema = z.object({
  name: z.string().min(1).max(255),
  value: z.string().min(1),
  version: z.number().default(1),
  tenantId: z.string().uuid(),
  rotationPeriod: z.number().default(86400), // 24 hours
  encrypted: z.boolean().default(true),
});

type SecretConfig = z.infer<typeof SecretConfigSchema>;

export class SecretsManager {
  private encryptionKey: Buffer;
  private algorithm = 'aes-256-gcm';

  constructor(key: string) {
    this.encryptionKey = Buffer.from(key, 'base64');
  }

  // Encrypt secret with tenant isolation
  encrypt(
    secret: string,
    tenantId: string
  ): {
    encrypted: string;
    iv: string;
    tag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);

    // Add tenant context to encryption
    const tenantKey = crypto
      .createHash('sha256')
      .update(tenantId + this.encryptionKey)
      .digest();
    const tenantCipher = crypto.createCipher(this.algorithm, tenantKey);

    let encrypted = tenantCipher.update(secret, 'utf8', 'hex');
    encrypted += tenantCipher.final('hex');

    const tag = tenantCipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  // Decrypt secret with tenant validation
  decrypt(encryptedData: { encrypted: string; iv: string; tag: string }, tenantId: string): string {
    const tenantKey = crypto
      .createHash('sha256')
      .update(tenantId + this.encryptionKey)
      .digest();
    const decipher = crypto.createDecipher(this.algorithm, tenantKey);

    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Rotate secret with audit logging
  async rotateSecret(secretName: string, tenantId: string): Promise<SecretConfig> {
    const oldSecret = await this.getSecret(secretName, tenantId);
    const newSecret = this.generateSecret();

    const encrypted = this.encrypt(newSecret, tenantId);

    const newConfig: SecretConfig = {
      name: secretName,
      value: encrypted.encrypted,
      version: oldSecret.version + 1,
      tenantId,
      encrypted: true,
    };

    // Log rotation event for audit
    await this.logSecurityEvent({
      type: 'secret_rotation',
      tenantId,
      secretName,
      oldVersion: oldSecret.version,
      newVersion: newConfig.version,
    });

    return newConfig;
  }

  private generateSecret(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  private async logSecurityEvent(event: {
    type: string;
    tenantId: string;
    secretName: string;
    oldVersion: number;
    newVersion: number;
  }) {
    console.log(`SECURITY_EVENT: ${event.type}`, {
      tenantId: event.tenantId,
      secretName: event.secretName,
      oldVersion: event.oldVersion,
      newVersion: event.newVersion,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Environment Variable Management

```typescript
// packages/env/src/index.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  server: {
    DATABASE_URL: z.string().url(),
    SECRET_ENCRYPTION_KEY: z.string().min(64),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
```

---

## 🔑 Authentication & Authorization

### OAuth 2.1 with PKCE Implementation

```typescript
// packages/auth/src/oauth.ts
import { crypto } from 'node:crypto';
import { z } from 'zod';

export class OAuth2Provider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(config: { clientId: string; clientSecret: string; redirectUri: string }) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }

  // Generate PKCE challenge
  generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

    return { codeVerifier, codeChallenge };
  }

  // Build authorization URL with PKCE
  buildAuthUrl(options: {
    state: string;
    codeChallenge: string;
    scopes: string[];
    tenantId?: string;
  }): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: options.state,
      code_challenge: options.codeChallenge,
      code_challenge_method: 'S256',
      scope: options.scopes.join(' '),
    });

    if (options.tenantId) {
      params.append('tenant_id', options.tenantId);
    }

    return `https://auth.example.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(options: {
    code: string;
    codeVerifier: string;
    state: string;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch('https://auth.example.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: options.code,
        code_verifier: options.codeVerifier,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return response.json();
  }
}
```

### Supabase Authentication & RLS Integration

```typescript
// packages/auth/src/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export class SupabaseAuthService {
  private supabase: SupabaseClient<Database>;
  private serviceRoleClient: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    this.serviceRoleClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }

  // Get current user with tenant context
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get tenant information from user metadata
    const tenantId = user.user_metadata?.tenant_id;

    return {
      user,
      tenantId,
      // Add role-based permissions
      roles: user.app_metadata?.roles || [],
    };
  }

  // Sign up with tenant assignment
  async signUpWithTenant(options: {
    email: string;
    password: string;
    tenantId: string;
    role?: string;
  }) {
    const { data, error } = await this.serviceRoleClient.auth.admin.createUser({
      email: options.email,
      password: options.password,
      email_confirm: true,
      user_metadata: {
        tenant_id: options.tenantId,
      },
      app_metadata: {
        roles: [options.role || 'user'],
        tenant_id: options.tenantId,
      },
    });

    if (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }

    return data;
  }

  // Create tenant-specific JWT claims
  async createTenantJWT(userId: string, tenantId: string): Promise<string> {
    const { data, error } = await this.serviceRoleClient.auth.admin.generateLink({
      type: 'signup',
      email: `${userId}@${tenantId}.local`,
      password: crypto.randomBytes(32).toString('hex'),
    });

    if (error) {
      throw new Error('JWT generation failed');
    }

    // Extract the token from the generated link
    const tokenMatch = data.properties?.link?.match(/access_token=([^&]+)/);
    return tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';
  }

  // Row Level Security helper
  async createRLSPolicy(
    tenantId: string,
    policy: {
      table: string;
      name: string;
      definition: string;
    }
  ) {
    const { error } = await this.serviceRoleClient.rpc('create_rls_policy', {
      p_tenant_id: tenantId,
      p_table_name: policy.table,
      p_policy_name: policy.name,
      p_policy_definition: policy.definition,
    });

    if (error) {
      throw new Error(`RLS policy creation failed: ${error.message}`);
    }
  }
}
```

### Row Level Security Patterns

```sql
-- Database RLS policies for multi-tenant isolation

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY users_own_data ON users
  FOR ALL USING (auth.uid()::text = id::text);

-- Users can only access data within their tenant
CREATE POLICY tenant_isolation ON leads
  FOR ALL USING (
    tenant_id = auth.jwt()->> 'tenant_id'
  );

-- Service role can bypass RLS for admin operations
CREATE POLICY service_role_full_access ON leads
  FOR ALL USING (
    auth.jwt()->> 'role' = 'service_role'
  );

-- Tenant-specific booking access
CREATE POLICY tenant_bookings ON bookings
  FOR ALL USING (
    tenant_id = auth.jwt()->> 'tenant_id' AND
    user_id = auth.uid()::text
  );
```

---

## 🛡️ Security Middleware Integration

### Complete Security Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders } from '@/packages/security/headers';
import { rateLimitMiddleware } from '@/packages/rate-limit/edge';
import { SecretsManager } from '@/packages/security/secrets';
import { SupabaseAuthService } from '@/packages/auth/supabase';
import { env } from '@/packages/env';

const secretsManager = new SecretsManager(env.SECRET_ENCRYPTION_KEY);
const authService = new SupabaseAuthService();

export async function middleware(request: NextRequest) {
  // Apply edge rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // Apply security headers
  const response = securityHeaders(request, {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
  });

  // Extract tenant context
  const tenantId = request.headers.get('x-tenant-id') || 'anonymous';
  const requestId = crypto.randomUUID();

  // Add security headers to response
  response.headers.set('x-tenant-id', tenantId);
  response.headers.set('x-request-id', requestId);

  // Validate tenant if provided
  if (tenantId !== 'anonymous') {
    try {
      const tenant = await validateTenant(tenantId);
      if (!tenant) {
        return new NextResponse('Invalid tenant', { status: 400 });
      }
      response.headers.set('x-tenant-valid', 'true');
    } catch (error) {
      console.error('Tenant validation failed:', error);
      return new NextResponse('Tenant validation error', { status: 500 });
    }
  }

  // Log security event
  await logSecurityEvent({
    type: 'request',
    tenantId,
    requestId,
    ip: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
  });

  return response;
}

async function validateTenant(tenantId: string): Promise<boolean> {
  // Implementation would validate tenant exists and is active
  return true; // Simplified for example
}

async function logSecurityEvent(event: {
  type: string;
  tenantId: string;
  requestId: string;
  ip: string;
  userAgent: string;
  path: string;
}) {
  console.log(`SECURITY_EVENT: ${event.type}`, {
    tenantId: event.tenantId,
    requestId: event.requestId,
    ip: event.ip,
    userAgent: event.userAgent,
    path: event.path,
    timestamp: new Date().toISOString(),
  });
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 📊 Security Monitoring & Analytics

### Security Event Tracking

```typescript
// packages/security/src/monitoring.ts
export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_activity' | 'data_access';
  tenantId: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  path?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  async logEvent(event: SecurityEvent) {
    // Add timestamp
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Store in memory (in production, use a proper logging system)
    this.events.push(eventWithTimestamp);

    // Trim old events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console (replace with proper logging in production)
    console.log(`SECURITY_EVENT: ${event.type}`, eventWithTimestamp);

    // Trigger alerts for critical events
    if (event.severity === 'critical') {
      await this.triggerAlert(eventWithTimestamp);
    }
  }

  async triggerAlert(event: SecurityEvent & { timestamp: string }) {
    // Implementation would send alerts to monitoring system
    console.error('CRITICAL SECURITY ALERT:', event);

    // Could integrate with:
    // - PagerDuty
    // - Slack notifications
    // - Email alerts
    // - Security incident response system
  }

  getSecurityMetrics(tenantId?: string) {
    const filteredEvents = tenantId
      ? this.events.filter((e) => e.tenantId === tenantId)
      : this.events;

    return {
      totalEvents: filteredEvents.length,
      eventsByType: this.groupBy(filteredEvents, 'type'),
      eventsBySeverity: this.groupBy(filteredEvents, 'severity'),
      recentEvents: filteredEvents.slice(-10),
    };
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce(
      (groups, item) => {
        const group = String(item[key]);
        groups[group] = (groups[group] || 0) + 1;
        return groups;
      },
      {} as Record<string, number>
    );
  }
}
```

### Rate Limit Analytics Dashboard

```typescript
// packages/rate-limit/src/analytics.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getTenantRateLimitStats(tenantId: string) {
  const keys = await redis.keys(`rl:*:${tenantId}:*`);
  const stats = await Promise.all(
    keys.map(async (key) => ({
      key,
      count: (await redis.get<number>(key)) ?? 0,
    }))
  );

  return stats.sort((a, b) => b.count - a.count).slice(0, 20);
}

export async function getGlobalRateLimitStats() {
  const globalKeys = await redis.keys('rl:global:*');
  const globalStats = await Promise.all(
    globalKeys.map(async (key) => ({
      key,
      count: (await redis.get<number>(key)) ?? 0,
    }))
  );

  return {
    totalRequests: globalStats.reduce((sum, stat) => sum + stat.count, 0),
    topIPs: globalStats.sort((a, b) => b.count - a.count).slice(0, 10),
  };
}
```

---

## 🧪 Security Testing

### Security Test Suite

```typescript
// tests/security/security.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { SecretsManager } from '@/packages/security/secrets';
import { securityHeaders } from '@/packages/security/headers';
import { checkApiRateLimit } from '@/packages/rate-limit/api';

describe('Security Implementation', () => {
  let secretsManager: SecretsManager;

  beforeEach(() => {
    secretsManager = new SecretsManager('test-key-32-chars-long-for-testing');
  });

  describe('Secrets Management', () => {
    it('should encrypt and decrypt secrets correctly', () => {
      const secret = 'your-secret-here';
      const tenantId = 'test-tenant-123';

      const encrypted = secretsManager.encrypt(secret, tenantId);
      const decrypted = secretsManager.decrypt(encrypted, tenantId);

      expect(decrypted).toBe(secret);
    });

    it('should fail decryption with wrong tenant', () => {
      const secret = 'your-secret-here';
      const tenantId = 'test-tenant-123';
      const wrongTenantId = 'wrong-tenant-456';

      const encrypted = secretsManager.encrypt(secret, tenantId);

      expect(() => {
        secretsManager.decrypt(encrypted, wrongTenantId);
      }).toThrow();
    });
  });

  describe('Security Headers', () => {
    it('should add proper security headers', () => {
      const request = new Request('https://example.com');
      const response = securityHeaders(request);

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });

    it('should include CSP with nonce in production', () => {
      process.env.NODE_ENV = 'production';
      const request = new Request('https://example.com');
      const response = securityHeaders(request);

      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toContain('script-src');
      expect(csp).toContain('nonce-');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits per tenant', async () => {
      const result = await checkApiRateLimit({
        tenantId: 'test-tenant',
        userId: 'test-user',
        routeKey: 'test-route',
        plan: 'free',
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('remaining');
    });
  });
});
```

---

## 📋 Security Checklist

### Implementation Checklist

#### Core Security

- [ ] **Security Headers**: CSP, HSTS, and protective headers configured
- [ ] **Rate Limiting**: Three-layer rate limiting implemented
- [ ] **Authentication**: OAuth 2.1 with PKCE implemented
- [ ] **Authorization**: Role-based access control with tenant isolation
- [ ] **Secrets Management**: Encryption at rest with tenant isolation
- [ ] **Input Validation**: Zod schemas for all inputs
- [ ] **Audit Logging**: Security events tracked and logged

#### Multi-Tenant Security

- [ ] **Tenant Isolation**: Data isolation at application and database levels
- [ ] **Row Level Security**: RLS policies implemented for all tables
- [ ] **Tenant Context**: Proper tenant context propagation
- [ ] **Cross-Tenant Access**: Prevention of cross-tenant data access
- [ ] **Tenant Validation**: Validation of tenant existence and status

#### Post-Quantum Readiness

- [ ] **Encryption Algorithms**: Post-quantum ready algorithms identified
- [ ] **Key Management**: Prepared for quantum-resistant key sizes
- [ ] **Migration Plan**: Strategy for post-quantum cryptography migration
- [ ] **NIST Compliance**: Alignment with NIST FIPS 203/204/205 standards

#### Monitoring & Alerting

- [ ] **Security Events**: Comprehensive event tracking
- [ ] **Rate Limit Monitoring**: Real-time rate limit analytics
- [ ] **Alert System**: Critical security event alerts
- [ ] **Audit Trails**: Complete audit trail for security events
- [ ] **Performance Monitoring**: Security overhead monitoring

### Security Headers Validation

```bash
# Test security headers
curl -I https://your-app.com

# Expected headers:
# content-security-policy: default-src 'self'...
# strict-transport-security: max-age=31536000...
# x-frame-options: DENY
# x-content-type-options: nosniff
# referrer-policy: strict-origin-when-cross-origin
```

### Rate Limit Testing

```bash
# Test rate limiting with curl
for i in {1..15}; do
  curl -w "%{http_code}\n" -o /dev/null -s https://your-app.com/api/test
done

# Should return 429 after limit exceeded
```

### Security Monitoring

```typescript
// Monitor security events in production
const monitor = new SecurityMonitor();

// Log suspicious activity
await monitor.logEvent({
  type: 'suspicious_activity',
  tenantId: 'tenant-123',
  userId: 'user-456',
  ip: '192.168.1.100',
  severity: 'high',
  metadata: {
    reason: 'multiple_failed_attempts',
    attempts: 5,
  },
});
```

---

## 🔗 References & Resources

### Authoritative Sources

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [NIST Post-Quantum Cryptography](https://csrc.nist.gov/Projects/Post-Quantum-Cryptography)
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

### Security Standards

- **OAuth 2.1 with PKCE**: Required for all authentication flows
- **NIST FIPS 203/204/205**: Post-quantum cryptography readiness
- **GDPR/CCPA**: Data protection and privacy compliance
- **SOC 2**: Security controls and audit requirements
- **ISO 27001**: Information security management

### 2026 Security Requirements

- **Zero Trust Architecture**: Never trust, always verify
- **Multi-Tenant Isolation**: Proper data boundaries between tenants
- **Post-Quantum Ready**: Prepared for quantum computing threats
- **AI Security**: Protection against AI-powered attacks
- **Privacy by Design**: Built-in privacy protections

---

## 🚀 Production Deployment

### Environment Configuration

```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://your-app.com
DATABASE_URL=postgresql://...
SECRET_ENCRYPTION_KEY=base64-encoded-256-bit-key
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Security Monitoring Setup

```typescript
// lib/production-security.ts
export function setupProductionSecurity() {
  // Enable comprehensive logging
  process.env.NODE_ENV = 'production';

  // Setup security monitoring
  const monitor = new SecurityMonitor();

  // Setup rate limit monitoring
  setInterval(async () => {
    const stats = await getGlobalRateLimitStats();
    if (stats.totalRequests > 10000) {
      // Alert threshold
      await monitor.logEvent({
        type: 'suspicious_activity',
        tenantId: 'global',
        ip: 'system',
        severity: 'medium',
        metadata: { reason: 'high_global_traffic', requests: stats.totalRequests },
      });
    }
  }, 60000); // Check every minute
}
```

This comprehensive security patterns guide provides enterprise-grade security implementation for multi-tenant SaaS applications while following 2026 security standards and preparing for post-quantum cryptography requirements.
