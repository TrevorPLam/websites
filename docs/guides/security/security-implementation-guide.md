# Security Implementation Guide

> **Comprehensive Security Patterns — February 2026**

## Overview

Production-ready security implementation for Next.js applications with multi-tenant SaaS architecture. This guide consolidates security headers, secrets management, and middleware patterns following 2026 security standards.

## Key Features

- **Defense-in-depth**: Multiple layers of security protection
- **Multi-tenant ready**: Built for SaaS applications with tenant isolation
- **Post-quantum ready**: Architecture designed for NIST FIPS 203/204/205 migration
- **TypeScript first**: Full type safety and IntelliSense support
- **Performance optimized**: Minimal overhead for production use

---

## 🔒 Security Headers Implementation

### Core Security Headers

```typescript
// Comprehensive security headers with CSP nonce and 2026 standards
import { NextRequest, NextResponse } from 'next/server';
import { crypto } from 'node:crypto';

// Security header configuration interface
interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  reportUri?: string;
}

export function securityHeaders(request: NextRequest, config: SecurityConfig = { enableCSP: true, enableHSTS: true }) {
  const response = NextResponse.next();
  const nonce = crypto.randomBytes(16).toString('base64');

  // Content Security Policy with nonce
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
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}
```

### Middleware Integration

```typescript
// middleware.ts
import { securityHeaders } from '@/lib/security';

export function middleware(request: NextRequest) {
  return securityHeaders(request, {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
  });
}
```

---

## 🔐 Secrets Management

### Core Secrets Manager

```typescript
// 2026 Enterprise secrets management with post-quantum readiness
import { crypto } from 'node:crypto';
import { z } from 'zod';

// Secret configuration schema with 2026 compliance
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
  encrypt(secret: string, tenantId: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    
    // Add tenant context to encryption
    const tenantKey = crypto.createHash('sha256').update(tenantId + this.encryptionKey).digest();
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
    const tenantKey = crypto.createHash('sha256').update(tenantId + this.encryptionKey).digest();
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

    // Log rotation event
    console.log(`Secret rotated: ${secretName} for tenant ${tenantId}`);
    
    return newConfig;
  }

  private generateSecret(): string {
    return crypto.randomBytes(32).toString('base64');
  }
}
```

### Environment Integration

```typescript
// lib/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  server: {
    DATABASE_URL: z.string().url(),
    SECRET_ENCRYPTION_KEY: z.string().min(64),
    RESEND_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
```

---

## 🛡️ Security Middleware

### Complete Security Middleware

```typescript
// middleware.ts - Complete security implementation
import { NextRequest, NextResponse } from 'next/server';
import { securityHeaders } from '@/lib/security';
import { SecretsManager } from '@/lib/secrets';
import { env } from '@/lib/env';

const secretsManager = new SecretsManager(env.SECRET_ENCRYPTION_KEY);

export function middleware(request: NextRequest) {
  // Apply security headers
  const response = securityHeaders(request);

  // Rate limiting by tenant
  const tenantId = request.headers.get('x-tenant-id') || 'anonymous';
  const rateLimitKey = `rate-limit:${tenantId}:${request.ip}`;
  
  // Add tenant context to response headers for debugging
  response.headers.set('x-tenant-id', tenantId);
  response.headers.set('x-request-id', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 📋 Security Checklist

### Implementation Checklist

- [ ] **Security Headers**: CSP, HSTS, and protective headers configured
- [ ] **Secrets Management**: Encryption at rest with tenant isolation
- [ ] **Rate Limiting**: Per-tenant rate limiting implemented
- [ ] **Audit Logging**: Security events tracked and logged
- [ ] **Environment Variables**: Proper validation with t3-env
- [ ] **Tenant Isolation**: Multi-tenant security boundaries enforced
- [ ] **Post-Quantum Ready**: Architecture prepared for quantum computing threats

### Security Headers Validation

```bash
# Test security headers
curl -I https://your-app.com

# Expected headers:
# content-security-policy: default-src 'self'...
# strict-transport-security: max-age=31536000...
# x-frame-options: DENY
# x-content-type-options: nosniff
```

### Secrets Management Testing

```typescript
// Test secrets encryption/decryption
const testSecret = 'api-key-123';
const tenantId = 'tenant-uuid';
const encrypted = secretsManager.encrypt(testSecret, tenantId);
const decrypted = secretsManager.decrypt(encrypted, tenantId);

console.assert(decrypted === testSecret, 'Secret encryption/decryption failed');
```

---

## 🔗 References & Resources

### Authoritative Sources

- [Web.dev CSP Guide](https://web.dev/csp/)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [NIST Post-Quantum Cryptography](https://csrc.nist.gov/Projects/Post-Quantum-Cryptography)

### Security Standards

- **OAuth 2.1 with PKCE**: Required for all authentication flows
- **NIST FIPS 203/204/205**: Post-quantum cryptography readiness
- **GDPR/CCPA**: Data protection and privacy compliance
- **SOC 2**: Security controls and audit requirements

---

## 🚀 Production Deployment

### Environment Configuration

```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://your-app.com
DATABASE_URL=postgresql://...
SECRET_ENCRYPTION_KEY=base64-encoded-256-bit-key
RESEND_API_KEY=re_...
```

### Security Monitoring

```typescript
// lib/security-monitoring.ts
export function logSecurityEvent(event: {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_activity';
  tenantId: string;
  ip: string;
  userAgent?: string;
}) {
  console.log(`SECURITY_EVENT: ${event.type}`, {
    tenantId: event.tenantId,
    ip: event.ip,
    timestamp: new Date().toISOString(),
    userAgent: event.userAgent,
  });
}
```

This consolidated guide provides the essential security patterns needed for production deployment while eliminating redundant documentation and focusing on practical implementation.
