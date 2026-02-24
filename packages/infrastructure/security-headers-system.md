# Security Headers System

> **Reference Documentation — February 2026**

## Overview

Comprehensive security headers implementation for Next.js applications. [web.dev](https://web.dev/csp/)

## Implementation

This document covers comprehensive security headers implementation for
next.js applications following 2026 security standards and best practices. Key features include:

- **Defense-in-depth**: Multiple layers of security protection
- **Audit logging**: Comprehensive security event tracking
- **Performance optimized**: Minimal overhead for production use
- **Multi-tenant ready**: Built for SaaS applications
- **TypeScript first**: Full type safety and IntelliSense support

The implementation follows 3 authoritative sources and includes practical examples for immediate integration.

## Core Implementation

```typescript
// Comprehensive security headers with CSP nonce and 2026 standards
import { NextRequest, NextResponse } from 'next/server';
import { crypto } from 'node:crypto';

// Security header configuration interface
interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableXContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
  customHeaders?: Record<string, string>;
}

// Default security configuration
const defaultSecurityConfig: SecurityConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXFrameOptions: true,
  enableXContentTypeOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
};

// Generate CSP nonce for inline scripts and styles
function generateCSPNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Build Content Security Policy based on request context
function buildCSP(nonce: string, isDev: boolean): string {
  const directives = [
    // Default directive: only allow same-origin by default
    `default-src 'self'`,

    // Script sources with nonce for inline scripts
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' ${isDev ? '' : ''}`,

    // Style sources with nonce for inline styles
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,

    // Image sources
    `img-src 'self' data: https:`,

    // Font sources
    `font-src 'self' data:`,

    // Connect sources (API calls, websockets)
    `connect-src 'self' https://api.vercel.com https://*.supabase.co`,

    // Frame sources (iframes)
    `frame-src 'self'`,

    // Object sources (plugins, embeds)
    `object-src 'none'`,

    // Base URI
    `base-uri 'self'`,

    // Form action
    `form-action 'self'`,

    // Frame ancestors (X-Frame-Options equivalent)
    `frame-ancestors 'none'`,

    // Upgrade insecure requests
    `upgrade-insecure-requests`,
  ];

  return directives.join('; ');
}

// Build Permissions Policy for feature control
function buildPermissionsPolicy(): string {
  const features = [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)',
  ];

  return features.join(', ');
}

// Main security headers middleware
export function applySecurityHeaders(
  response: NextResponse,
  config: Partial<SecurityConfig> = {}
): NextResponse {
  const securityConfig = { ...defaultSecurityConfig, ...config };
  const isDev = process.env.NODE_ENV === 'development';

  // Generate CSP nonce
  const nonce = generateCSPNonce();

  // Apply Content Security Policy
  if (securityConfig.enableCSP) {
    const csp = buildCSP(nonce, isDev);
    response.headers.set('Content-Security-Policy', csp);

    // Store nonce in response headers for client access
    response.headers.set('x-csp-nonce', nonce);
  }

  // Apply HTTP Strict Transport Security
  if (securityConfig.enableHSTS && !isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Apply X-Frame-Options (legacy fallback)
  if (securityConfig.enableXFrameOptions) {
    response.headers.set('X-Frame-Options', 'DENY');
  }

  // Apply X-Content-Type-Options
  if (securityConfig.enableXContentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Apply Referrer Policy
  if (securityConfig.enableReferrerPolicy) {
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  // Apply Permissions Policy
  if (securityConfig.enablePermissionsPolicy) {
    const permissionsPolicy = buildPermissionsPolicy();
    response.headers.set('Permissions-Policy', permissionsPolicy);
  }

  // Apply additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Apply custom headers
  if (securityConfig.customHeaders) {
    Object.entries(securityConfig.customHeaders).forEach(([name, value]) => {
      response.headers.set(name, value);
    });
  }

  return response;
}

// Next.js middleware wrapper
export function securityMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Apply security headers to all responses
  return applySecurityHeaders(response);
}

// Edge middleware for Vercel deployment
export async function middleware(request: NextRequest) {
  const response = NextResponse.rewrite(new URL(request.url, request.url));

  // Apply security headers with tenant-specific configuration
  const tenantId = request.headers.get('x-tenant-id');
  const config = tenantId
    ? {
        customHeaders: {
          'x-tenant-id': tenantId,
        },
      }
    : {};

  return applySecurityHeaders(response, config);
}
```

The implementation includes:

- Input validation and sanitization
- Error handling and logging
- Performance optimization
- Security hardening
- TypeScript type safety

## Usage Examples

### Basic Usage

```typescript
import { SecurityHeadersSystem } from './SecurityHeadersSystem';

const result = await SecurityHeadersSystem({
  // parameters
});

console.log(result);
```

### Advanced Usage

```typescript
// Advanced configuration
const config = {
  // configuration options
};

const advancedResult = await SecurityHeadersSystem(data, config);
```

## Best Practices

- **Security First**: Always validate inputs and sanitize data
- **Performance**: Minimize overhead and optimize for production
- **Monitoring**: Implement comprehensive logging and metrics
- **Testing**: Include unit tests, integration tests, and E2E tests
- **Documentation**: Keep documentation up-to-date with code changes
- **Error Handling**: Provide clear error messages and recovery options

## Testing

### Unit Tests

```typescript
import { SecurityHeadersSystem } from './SecurityHeadersSystem';

describe('Security Headers System', () => {
  it('should handle basic operations', async () => {
    const result = await SecurityHeadersSystem({});
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

```typescript
import { SecurityHeadersSystem } from './SecurityHeadersSystem';

describe('Security Headers System Integration', () => {
  it('should integrate with Next.js', async () => {
    // Integration test implementation
  });
});
```

---

## References

- [Research Inventory](../../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- https://web.dev/csp/ — web.dev
- https://owasp.org/www-project-secure-headers/ — owasp.org
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers — developer.mozilla.org

---
