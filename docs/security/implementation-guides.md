# Security Implementation Guides

**Created:** 2026-02-21  
**Role:** Implementation Documentation  
**Audience:** Developers, Security Engineers  
**Last Reviewed:** 2026-02-21  
**Review Interval:** 30 days

---

## Overview

This document provides comprehensive implementation guides for security patterns and practices in the marketing-websites platform. All guides follow 2026 security standards and compliance requirements.

---

## Webhook Security Implementation

### Overview

Webhook security is critical for preventing fraud, data corruption, and unauthorized automation. This guide implements secure webhook handling with signature verification, replay protection, and idempotency.

### Requirements

**Security Standards:**

- **HMAC signature validation** over raw body bytes
- **Timestamp-based replay protection** with configurable windows
- **Idempotency tracking** to prevent duplicate processing
- **Dead Letter Queue (DLQ)** for failed webhook processing
- **Constant-time comparison** for signature verification

### Implementation

#### 1. Signature Verification Utility

```typescript
// packages/integrations-shared/src/webhook-signature.ts
import crypto from 'crypto';

export interface WebhookSignature {
  signature: string;
  timestamp: string;
  nonce?: string;
}

export class WebhookSignatureVerifier {
  constructor(private readonly secret: string) {}

  verify(payload: string, signature: WebhookSignature): boolean {
    // 1. Check timestamp to prevent replay attacks
    if (!this.isValidTimestamp(signature.timestamp)) {
      return false;
    }

    // 2. Create expected signature
    const expectedSignature = this.createSignature(payload, signature.timestamp, signature.nonce);

    // 3. Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature.signature), Buffer.from(expectedSignature));
  }

  private isValidTimestamp(timestamp: string): boolean {
    const now = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    const windowSeconds = 300; // 5 minutes

    return Math.abs(now - webhookTime) <= windowSeconds;
  }

  private createSignature(payload: string, timestamp: string, nonce?: string): string {
    const data = nonce ? `${timestamp}.${nonce}.${payload}` : `${timestamp}.${payload}`;

    return crypto.createHmac('sha256', this.secret).update(data).digest('hex');
  }
}
```

#### 2. Idempotency Manager

```typescript
// packages/integrations-shared/src/idempotency.ts
import { Redis } from 'ioredis';

export interface IdempotencyRecord {
  id: string;
  processedAt: Date;
  response?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export class IdempotencyManager {
  constructor(private readonly redis: Redis) {}

  async checkAndSet(
    idempotencyKey: string,
    ttlSeconds: number = 3600
  ): Promise<{ exists: boolean; record?: IdempotencyRecord }> {
    const existing = await this.redis.get(idempotencyKey);

    if (existing) {
      return { exists: true, record: JSON.parse(existing) };
    }

    const record: IdempotencyRecord = {
      id: idempotencyKey,
      processedAt: new Date(),
      status: 'pending',
    };

    await this.redis.setex(idempotencyKey, ttlSeconds, JSON.stringify(record));

    return { exists: false, record };
  }

  async updateStatus(
    idempotencyKey: string,
    status: IdempotencyRecord['status'],
    response?: any
  ): Promise<void> {
    const record: IdempotencyRecord = {
      id: idempotencyKey,
      processedAt: new Date(),
      status,
      response,
    };

    await this.redis.set(idempotencyKey, JSON.stringify(record));
  }
}
```

#### 3. Webhook Handler Middleware

```typescript
// packages/integrations-shared/src/webhook-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebhookSignatureVerifier } from './webhook-signature';
import { IdempotencyManager } from './idempotency';

export interface WebhookHandlerOptions {
  secret: string;
  idempotencyTTL?: number;
  replayWindow?: number;
}

export function createWebhookHandler(
  handler: (payload: any, metadata: any) => Promise<any>,
  options: WebhookHandlerOptions
) {
  const verifier = new WebhookSignatureVerifier(options.secret);

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // 1. Extract signature headers
      const signature = request.headers.get('x-webhook-signature');
      const timestamp = request.headers.get('x-webhook-timestamp');
      const nonce = request.headers.get('x-webhook-nonce');
      const idempotencyKey = request.headers.get('x-webhook-id');

      if (!signature || !timestamp) {
        return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
      }

      // 2. Get raw body for signature verification
      const body = await request.text();

      // 3. Verify signature
      if (!verifier.verify(body, { signature, timestamp, nonce })) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }

      // 4. Check idempotency
      if (idempotencyKey) {
        const idempotency = await idempotencyManager.checkAndSet(
          idempotencyKey,
          options.idempotencyTTL
        );

        if (idempotency.exists && idempotency.record?.status === 'completed') {
          return NextResponse.json(idempotency.record.response);
        }
      }

      // 5. Process webhook
      const payload = JSON.parse(body);
      const metadata = {
        timestamp,
        nonce,
        idempotencyKey,
        headers: Object.fromEntries(request.headers),
      };

      const result = await handler(payload, metadata);

      // 6. Update idempotency record
      if (idempotencyKey) {
        await idempotencyManager.updateStatus(idempotencyKey, 'completed', result);
      }

      return NextResponse.json(result);
    } catch (error) {
      console.error('Webhook processing error:', error);

      // 7. Send to Dead Letter Queue
      await sendToDLQ({
        error: error.message,
        headers: Object.fromEntries(request.headers),
        body: await request.text(),
      });

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
```

#### 4. Usage Example

```typescript
// app/api/webhooks/hubspot/route.ts
import { createWebhookHandler } from '@repo/integrations-shared';
import { processHubspotWebhook } from '@repo/integrations-hubspot';

export const POST = createWebhookHandler(
  async (payload, metadata) => {
    return await processHubspotWebhook(payload, metadata);
  },
  {
    secret: process.env.HUBSPOT_WEBHOOK_SECRET!,
    idempotencyTTL: 3600, // 1 hour
    replayWindow: 300, // 5 minutes
  }
);
```

---

## Consent Management Implementation

### Overview

GDPR/CCPA compliance requires explicit consent before loading third-party scripts. This guide implements a consent management system with script categorization and performance optimization.

### Requirements

**Compliance Standards:**

- **ScriptManager component** for consent-gated loading
- **CMP integration** for consent management platform
- **Script categorization** (analytics/marketing/functional)
- **Performance optimization** with deferred loading
- **Granular consent controls** for different script types

### Implementation

#### 1. Consent Context Provider

```typescript
// packages/ui/src/contexts/consent-context.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean; // Always true
}

interface ConsentContextValue {
  consent: ConsentState;
  updateConsent: (updates: Partial<ConsentState>) => void;
  hasConsent: (category: keyof ConsentState) => boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
    functional: false,
    necessary: true
  });

  // Load consent from localStorage/CMP
  useEffect(() => {
    const savedConsent = localStorage.getItem('consent-state');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const updateConsent = (updates: Partial<ConsentState>) => {
    const newConsent = { ...consent, ...updates };
    setConsent(newConsent);
    localStorage.setItem('consent-state', JSON.stringify(newConsent));

    // Notify CMP of consent changes
    if (window.consentManager) {
      window.consentManager.updateConsent(newConsent);
    }
  };

  const hasConsent = (category: keyof ConsentState) => {
    return consent[category];
  };

  return (
    <ConsentContext.Provider value={{ consent, updateConsent, hasConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
```

#### 2. Script Manager Component

```typescript
// packages/ui/src/components/script-manager.tsx
'use client';

import Script from 'next/script';
import { useConsent } from '../contexts/consent-context';

interface ScriptConfig {
  src: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  category: 'analytics' | 'marketing' | 'functional' | 'necessary';
  id?: string;
  integrity?: string;
  crossOrigin?: string;
}

interface ScriptManagerProps {
  scripts: ScriptConfig[];
}

export function ScriptManager({ scripts }: ScriptManagerProps) {
  const { hasConsent } = useConsent();

  return (
    <>
      {scripts.map((script) => {
        // Necessary scripts always load
        if (script.category === 'necessary') {
          return (
            <Script
              key={script.id || script.src}
              src={script.src}
              strategy={script.strategy || 'afterInteractive'}
              integrity={script.integrity}
              crossOrigin={script.crossOrigin}
            />
          );
        }

        // Other scripts require consent
        if (!hasConsent(script.category)) {
          return null;
        }

        return (
          <Script
            key={script.id || script.src}
            src={script.src}
            strategy={script.strategy || 'lazyOnload'}
            integrity={script.integrity}
            crossOrigin={script.crossOrigin}
          />
        );
      })}
    </>
  );
}
```

#### 3. Consent Banner Component

```typescript
// packages/ui/src/components/consent-banner.tsx
'use client';

import { useState } from 'react';
import { useConsent } from '../contexts/consent-context';
import { Button } from './button';

export function ConsentBanner() {
  const { consent, updateConsent } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  // Show banner if no consent given for non-necessary categories
  useEffect(() => {
    const hasAnyConsent = consent.analytics || consent.marketing || consent.functional;
    setIsVisible(!hasAnyConsent);
  }, [consent]);

  if (!isVisible) {
    return null;
  }

  const handleAcceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
      functional: true
    });
    setIsVisible(false);
  };

  const handleCustomize = () => {
    // Open consent preferences modal
    window.consentManager?.showPreferences();
  };

  const handleReject = () => {
    updateConsent({
      analytics: false,
      marketing: false,
      functional: false
    });
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Privacy & Consent</h3>
          <p className="text-sm text-gray-300">
            We use cookies and scripts to improve your experience. Accept all or customize your preferences.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCustomize}>
            Customize
          </Button>
          <Button variant="outline" onClick={handleReject}>
            Reject All
          </Button>
          <Button onClick={handleAcceptAll}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
```

#### 4. Integration Example

```typescript
// app/layout.tsx
import { ConsentProvider } from '@repo/ui';
import { ScriptManager } from '@repo/ui';
import { ConsentBanner } from '@repo/ui';

const scripts = [
  {
    src: 'https://www.googletagmanager.com/gtag/js',
    category: 'analytics' as const,
    id: 'google-analytics',
    strategy: 'afterInteractive' as const
  },
  {
    src: 'https://connect.facebook.net/en_US/fbevents.js',
    category: 'marketing' as const,
    id: 'facebook-pixel',
    strategy: 'lazyOnload' as const
  },
  {
    src: 'https://cdn.jsdelivr.net/npm/algoliasearch@4.0.0/dist/algoliasearch-lite.umd.js',
    category: 'functional' as const,
    id: 'algolia-search',
    strategy: 'afterInteractive' as const
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConsentProvider>
          <ScriptManager scripts={scripts} />
          {children}
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
```

---

## API Security Implementation

### Overview

API security requires proper authentication, input validation, and secure data handling. This guide implements OAuth 2.1 with PKCE, secure API key management, and comprehensive input validation.

### Requirements

**Security Standards:**

- **OAuth 2.1 with PKCE** for authentication
- **Header-based API key management** (never in request body/URL)
- **Input validation** with strict TypeScript typing
- **Rate limiting** for all public endpoints
- **Secure logging** with automatic data redaction

### Implementation

#### 1. OAuth 2.1 with PKCE Implementation

```typescript
// packages/infra/src/auth/oauth-pkce.ts
import crypto from 'crypto';
import { jose } from 'jose';

export interface PKCECodeChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export class PKCEManager {
  static generateCodeChallenge(): PKCECodeChallenge {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256',
    };
  }

  static async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
    clientId: string,
    clientSecret: string,
    tokenUrl: string
  ): Promise<{ access_token: string; refresh_token?: string }> {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI!,
        client_id: clientId,
        client_secret: clientSecret,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return response.json();
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jose.jwtVerify(token, secret);
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
```

#### 2. Secure API Client

```typescript
// packages/integrations-shared/src/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface APIClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class SecureAPIClient {
  private client: AxiosInstance;

  constructor(config: APIClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'User-Agent': 'Marketing-Websites/1.0.0',
        ...(config.apiKey && {
          'X-Api-Key': config.apiKey, // Never in request body
        }),
      },
    });

    this.setupInterceptors(config);
  }

  private setupInterceptors(config: APIClientConfig) {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (requestConfig) => {
        console.debug(`API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
        return requestConfig;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Retry logic for failed requests
        if (
          this.shouldRetry(error) &&
          (originalRequest as any).__retryCount < (config.retryAttempts || 3)
        ) {
          (originalRequest as any).__retryCount = ((originalRequest as any).__retryCount || 0) + 1;

          const delay = config.retryDelay || 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.client(originalRequest);
        }

        // Log error without sensitive data
        this.logSecureError(error);
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    if (!error.response) {
      return false; // Network errors
    }

    const status = error.response.status;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(status);
  }

  private logSecureError(error: any): void {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      // Never log sensitive data like API keys or tokens
    };

    console.error('API Error:', errorInfo);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}
```

#### 3. Input Validation Middleware

```typescript
// packages/infra/src/validation/input-validator.ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export interface ValidationSchema<T> {
  body?: z.ZodSchema<T>;
  query?: z.ZodSchema<T>;
  params?: z.ZodSchema<T>;
}

export function validateRequest<T>(schema: ValidationSchema<T>) {
  return async (request: NextRequest) => {
    try {
      // Validate request body
      if (schema.body) {
        const body = await request.json();
        schema.body.parse(body);
      }

      // Validate query parameters
      if (schema.query) {
        const query = Object.fromEntries(request.nextUrl.searchParams);
        schema.query.parse(query);
      }

      // Validate route parameters
      if (schema.params) {
        const params = request.nextUrl.pathname.split('/').slice(1);
        schema.params.parse(params);
      }

      return NextResponse.next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
    }
  };
}
```

#### 4. Usage Example

```typescript
// app/api/users/route.ts
import { z } from 'zod';
import { validateRequest } from '@repo/infra';
import { SecureAPIClient } from '@repo/integrations-shared';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

const client = new SecureAPIClient({
  baseURL: 'https://api.example.com',
  apiKey: process.env.API_KEY!,
});

export const GET = validateRequest({
  query: z.object({
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
  }),
});

export const POST = validateRequest({
  body: userSchema,
});

export async function GET(request: NextRequest) {
  const { page = 1, limit = 10 } = request.nextUrl.searchParams;

  const response = await client.get('/users', {
    params: { page, limit },
  });

  return NextResponse.json(response.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await client.post('/users', body);

  return NextResponse.json(response.data, { status: 201 });
}
```

---

## Testing Security Implementation

### Overview

Security testing requires comprehensive validation of authentication, authorization, and data protection. This guide implements security testing patterns and validation procedures.

### Requirements

**Testing Standards:**

- **Authentication testing** with valid and invalid credentials
- **Authorization testing** with role-based access control
- **Input validation testing** with malicious inputs
- **Rate limiting testing** with threshold violations
- **Data leakage testing** with sensitive data exposure

### Implementation

#### 1. Security Test Utilities

```typescript
// packages/infra/src/testing/security-test-utils.ts
import { generateKeyPairSync } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

export class SecurityTestUtils {
  private static keyPair = generateKeyPairSync('RS256');

  static generateValidToken(payload: any): string {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(this.keyPair.privateKey);
  }

  static generateInvalidToken(): string {
    return 'invalid.jwt.token';
  }

  static async verifyToken(token: string): Promise<any> {
    return jwtVerify(token, this.keyPair.publicKey);
  }

  static generateMaliciousInput(): string[] {
    return [
      '<script>alert("xss")</script>',
      "'; DROP TABLE users; --",
      '../../../etc/passwd',
      '{{7*7*}}',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(1)',
      '${jndi:ldap://}',
      '<!--#comment-->',
    ];
  }

  static generateRateLimitRequests(count: number): Array<() => Promise<any>> {
    return Array(count)
      .fill(null)
      .map(() => () => fetch('/api/test-endpoint', { method: 'POST' }));
  }
}
```

#### 2. Security Test Examples

```typescript
// packages/features/src/__tests__/security.test.ts
import { SecurityTestUtils } from '@repo/infra/testing';

describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should accept valid token', async () => {
      const validToken = SecurityTestUtils.generateValidToken({
        userId: 'test-user',
        tenantId: 'test-tenant',
      });

      const response = await fetch('/api/protected', {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.status).toBe(200);
    });

    it('should reject invalid token', async () => {
      const invalidToken = SecurityTestUtils.generateInvalidToken();

      const response = await fetch('/api/protected', {
        headers: {
          Authorization: `Bearer ${invalidToken}`,
        },
      });

      expect(response.status).toBe(401);
    });

    it('should reject missing token', async () => {
      const response = await fetch('/api/protected');

      expect(response.status).toBe(401);
    });
  });

  describe('Input Validation', () => {
    it('should reject XSS attempts', async () => {
      const maliciousInputs = SecurityTestUtils.generateMaliciousInput();

      for (const input of maliciousInputs) {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: input }),
        });

        expect(response.status).toBe(400);
      }
    });

    it('should reject SQL injection attempts', async () => {
      const response = await fetch('/api/users/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: "'; DROP TABLE users; --" }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = SecurityTestUtils.generateRateLimitRequests(10);

      // First 5 requests should succeed
      for (let i = 0; i < 5; i++) {
        const response = await requests[i]();
        expect(response.status).toBe(200);
      }

      // Subsequent requests should be rate limited
      for (let i = 5; i < 10; i++) {
        const response = await requests[i]();
        expect(response.status).toBe(429);
      }
    });
  });

  describe('Data Leakage', () => {
    it('should not expose sensitive data in responses', async () => {
      const response = await fetch('/api/users/1');
      const data = await response.json();

      // Should not contain sensitive fields
      expect(data).not.toHaveProperty('password');
      expect(data).not.toHaveProperty('apiKey');
      expect(data).not.toHaveProperty('secret');
    });

    it('should not expose sensitive data in errors', async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email' }),
      });

      const error = await response.json();

      // Should not contain stack traces or internal details
      expect(error).not.toHaveProperty('stack');
      expect(error).not.toHaveProperty('internalError');
    });
  });
});
```

---

## Related Documentation

### **Security Architecture**

- [**Security Overview**](overview.md) - Complete security architecture
- [**Multi-Tenant Isolation**](multi-tenant-isolation-implementation.md) - Tenant boundaries
- [**Audit Reports**](dependency-audit-report.md) - Security assessment results

### **Implementation Examples**

- [**Webhook Security**](../../tasks/security-3-webhook-security.md) - Task specification
- [**Consent Management**](../../tasks/security-4-consent-management.md) - Compliance requirements
- [**Integration Security**](../lessons-learned/integration-security-standardization-2026-02-21.md) - Implementation patterns

### **Testing Documentation**

- [**Security Testing Strategy**](../../testing-strategy.md) - Testing approach
- [**Test Coverage**](../lessons-learned/test-coverage-achievement-2026-02-21.md) - Coverage goals

---

**Document Last Updated:** 2026-02-21  
**Next Review:** 2026-03-21  
**Maintainers:** Security Team  
**Questions:** Create GitHub issue with `security` label
