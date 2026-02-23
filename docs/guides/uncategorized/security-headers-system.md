# security-headers-system.md

> **2026 Standards Compliance** | CSP Level 3 · Permissions-Policy · HSTS Preload ·
> Next.js 16 Edge Middleware · OWASP Top 10 2025

## Table of Contents

1. [Overview](#overview)
2. [Security Headers Reference](#security-headers-reference)
3. [CSP with Per-Request Nonces](#csp-with-per-request-nonces)
4. [Next.js Middleware Implementation](#nextjs-middleware-implementation)
5. [Static Headers via next.config.ts](#static-headers-via-nextconfigts)
6. [Tenant-Aware Header Overrides](#tenant-aware-header-overrides)
7. [Permissions Policy](#permissions-policy)
8. [Header Audit & CI Enforcement](#header-audit--ci-enforcement)
9. [Post-Quantum Readiness Notes](#post-quantum-readiness-notes)
10. [Testing](#testing)
11. [References](#references)

---

## Overview

Security headers are the first and cheapest layer of defense for web applications.
They instruct browsers to enforce policies that mitigate XSS, clickjacking,
MIME sniffing, information leakage, and cross-origin data theft — **before any
application code runs**.

In Next.js 16, headers are applied at two levels:

- **Middleware (Edge)** — per-request, dynamic; required for CSP nonces
- **next.config.ts** — build-time static headers; used for non-dynamic pages

> ⚠️ **Critical:** CSP with nonces **requires** middleware-based dynamic rendering.
> Static-only CSP (`next.config.ts` headers) cannot use nonces; use strict CSP
> directives instead. [web:20][web:21]

---

## Security Headers Reference

| Header                         | Purpose                                   | Recommended Value                              |
| ------------------------------ | ----------------------------------------- | ---------------------------------------------- |
| `Content-Security-Policy`      | Prevents XSS, injections                  | See full policy below                          |
| `Strict-Transport-Security`    | Enforces HTTPS                            | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options`              | Prevents clickjacking                     | `DENY` (or `SAMEORIGIN` if iframe needed)      |
| `X-Content-Type-Options`       | Prevents MIME sniffing                    | `nosniff`                                      |
| `Referrer-Policy`              | Controls referrer leakage                 | `strict-origin-when-cross-origin`              |
| `Permissions-Policy`           | Disables browser features                 | See full policy below                          |
| `Cross-Origin-Opener-Policy`   | Protects from cross-origin attacks        | `same-origin`                                  |
| `Cross-Origin-Resource-Policy` | Blocks cross-origin resource reads        | `same-origin`                                  |
| `Cross-Origin-Embedder-Policy` | Required for SharedArrayBuffer            | `require-corp`                                 |
| `X-DNS-Prefetch-Control`       | Controls DNS prefetching                  | `off`                                          |
| `X-XSS-Protection`             | Legacy XSS filter (kept for old browsers) | `0` (disabled — CSP is better)                 |

---

## CSP with Per-Request Nonces

### Why Nonces Over Hashes

A **nonce** (number used once) is a cryptographically random value generated per
request, embedded into the CSP header and into every `<script>` and `<style>` tag.
Browsers only execute scripts whose nonce matches the CSP header's nonce — blocking
all injected scripts even if they appear in the DOM. [web:21][web:27]

**Advantage over `'unsafe-inline'`**: Eliminates the largest XSS attack vector.
**Advantage over hashes**: No need to rehash on every content change; nonces rotate
per request automatically.

### Nonce Generation

```typescript
// packages/security/src/nonce.ts
import { Buffer } from 'node:buffer';

/**
 * Generates a cryptographically secure, URL-safe base64 nonce.
 * Must be regenerated per request — never reuse across requests.
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // URL-safe base64 (no +/=)
  return Buffer.from(array)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
```

### CSP Policy Builder

```typescript
// packages/security/src/csp.ts

interface CspOptions {
  nonce: string;
  isDev?: boolean;
  trustedDomains?: string[]; // Per-tenant allowed origins (e.g., analytics, fonts)
}

export function buildCsp(options: CspOptions): string {
  const { nonce, isDev = false, trustedDomains = [] } = options;

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'", // Trusts scripts loaded by nonce-marked scripts
      // Dev-only: allow eval for HMR
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],

    'style-src': [
      "'self'",
      `'nonce-${nonce}'`,
      // Allow inline styles from Tailwind CSS (hash or nonce)
    ],

    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://*.supabase.co', // Supabase Storage
      'https://*.sanity.io', // Sanity CDN
      'https://cdn.sanity.io',
      'https://*.cloudinary.com',
      ...trustedDomains,
    ],

    'font-src': ["'self'", 'https://fonts.gstatic.com'],

    'connect-src': [
      "'self'",
      'https://*.supabase.co',
      'https://*.supabase.io', // Supabase Realtime
      'wss://*.supabase.co', // WebSocket for Realtime
      'https://api.stripe.com',
      'https://checkout.stripe.com',
      'https://js.stripe.com',
      'https://app.posthog.com', // Analytics
      'https://*.sentry.io', // Error reporting
      ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
      ...trustedDomains,
    ],

    'frame-src': [
      'https://js.stripe.com', // Stripe Elements iframes
      'https://hooks.stripe.com',
      "'none'", // Restrict other frames
    ],

    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],

    'frame-ancestors': ["'none'"], // Replaces X-Frame-Options for modern browsers

    'upgrade-insecure-requests': [], // Force HTTPS for all embedded resources

    // Report-only URI for monitoring violations in prod
    'report-to': ['csp-endpoint'],
  };

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ');
}

// Reporting endpoint configuration (add to headers)
export const REPORTING_ENDPOINTS = 'csp-endpoint="https://your-csp-report-endpoint.com/csp"';
```

---

## Next.js Middleware Implementation

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, buildCsp } from '@repo/security';

export const config = {
  matcher: [
    // Apply to all routes EXCEPT static files and health checks
    '/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';

  // Build CSP (tenant-aware: read allowed domains from tenant context)
  const tenantPlan = req.headers.get('x-tenant-plan');
  const trustedDomains = getTrustedDomainsByPlan(tenantPlan);
  const csp = buildCsp({ nonce, isDev, trustedDomains });

  const requestHeaders = new Headers(req.headers);
  // Pass nonce to Server Components via header
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // ─── Security Headers ─────────────────────────────────────────────────────
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload' // 2 years, HSTS preload
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-XSS-Protection', '0'); // Disabled — CSP is the real protection
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Permissions-Policy', buildPermissionsPolicy(tenantPlan));
  response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS);

  // Remove headers that leak server info
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

function getTrustedDomainsByPlan(plan: string | null): string[] {
  // Enterprise tenants may have additional trusted domains
  // (e.g., their own analytics, fonts, or media CDN)
  if (plan === 'enterprise') return [];
  return [];
}
```

### Reading the Nonce in Server Components

The nonce must be accessed via `headers()` — **never via client-side JS**:

```typescript
// app/layout.tsx
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read nonce injected by middleware
  // Requires dynamic rendering (PPR shell must be dynamic for nonce support)
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? ''

  return (
    <html lang="en">
      <head>
        {/* Inline scripts MUST carry the nonce */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.__NONCE__ = "${nonce}";`,
          }}
        />
      </head>
      <body>
        {children}
        {/* Third-party scripts must use next/script with nonce */}
        <Script
          src="https://app.posthog.com/static/array.js"
          nonce={nonce}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

---

## Static Headers via next.config.ts

For routes that don't need nonces (API routes, static pages), apply security headers
in `next.config.ts` — these are set at the CDN edge via Vercel:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const STATIC_SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: buildPermissionsPolicy() },
  // Static CSP (no nonce — use hash-based for inline scripts if needed)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'strict-dynamic'",
      "style-src 'self' 'unsafe-inline'", // Relaxed for static — upgrade to nonce in middleware
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      'frame-src https://js.stripe.com',
      "object-src 'none'",
      "base-uri 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: STATIC_SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
```

---

## Tenant-Aware Header Overrides

Some enterprise tenants may require custom CSP adjustments — e.g., allowing their own
CDN domain or embedding your app in their portal:

```typescript
// packages/security/src/tenant-csp.ts
interface TenantCspOverrides {
  allowedImageDomains?: string[];
  allowedConnectDomains?: string[];
  allowIframe?: boolean; // Enterprise: embed in tenant's portal
  iframeAllowedOrigins?: string[];
}

export function buildTenantCsp(baseNonce: string, overrides: TenantCspOverrides = {}): string {
  const extraImages = overrides.allowedImageDomains ?? [];
  const extraConnect = overrides.allowedConnectDomains ?? [];

  // Override frame-ancestors for enterprise iframe embedding
  const frameAncestors =
    overrides.allowIframe && overrides.iframeAllowedOrigins?.length
      ? overrides.iframeAllowedOrigins.join(' ')
      : "'none'";

  return buildCsp({
    nonce: baseNonce,
    trustedDomains: [...extraImages, ...extraConnect],
  }).replace("frame-ancestors 'none'", `frame-ancestors ${frameAncestors}`);
}
```

---

## Permissions Policy

Control which browser APIs are available to your app and third-party scripts:

```typescript
// packages/security/src/permissions-policy.ts
interface PermissionsPolicyOptions {
  plan?: string;
}

export function buildPermissionsPolicy(plan?: string | null): string {
  const policies: Record<string, string> = {
    // Camera/mic/geo: only allow if explicitly needed (default: none)
    camera: '()', // Blocked
    microphone: '()', // Blocked
    geolocation: '(self)', // Only self — for local SEO features
    fullscreen: '(self)', // For video embeds
    payment: '()', // Stripe uses its own iframe — never expose API
    usb: '()', // Block hardware access
    bluetooth: '()',
    magnetometer: '()',
    gyroscope: '()',
    accelerometer: '()',
    'ambient-light-sensor': '()',
    autoplay: '()', // No autoplay — accessibility
    'picture-in-picture': '(self)',
    'screen-wake-lock': '()',
    serial: '()',
    'xr-spatial-tracking': '()',

    // Enterprise plans may need additional permissions for embedded widgets
    ...(plan === 'enterprise'
      ? {
          geolocation: '(self)',
        }
      : {}),
  };

  return Object.entries(policies)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
}
```

---

## Header Audit & CI Enforcement

### Automated Header Testing Script

```typescript
// scripts/audit-security-headers.ts
import { execSync } from 'node:child_process'

const REQUIRED_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
]

const FORBIDDEN_HEADERS = [
  'x-powered-by',
  'server',
]

async function auditHeaders(url: string) {
  const response = await fetch(url, { method: 'HEAD' })
  const issues: string[] = []

  for (const header of REQUIRED_HEADERS) {
    if (!response.headers.has(header)) {
      issues.push(`MISSING: ${header}`)
    }
  }

  for (const header of FORBIDDEN_HEADERS) {
    if (response.headers.has(header)) {
      issues.push(`LEAKING: ${header} = ${response.headers.get(header)}`)
    }
  }

  // Validate HSTS: must include preload and be ≥ 1 year
  const hsts = response.headers.get('strict-transport-security')
  if (hsts) {
    const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?. ?? '0')
    if (maxAge < 31_536_000) {
      issues.push(`WEAK HSTS: max-age=${maxAge} (minimum: 31536000 = 1 year)`)
    }
    if (!hsts.includes('includeSubDomains')) {
      issues.push('WEAK HSTS: missing includeSubDomains')
    }
  }

  // Validate CSP: must not contain 'unsafe-inline' or 'unsafe-eval'
  const csp = response.headers.get('content-security-policy')
  if (csp) {
    if (csp.includes("'unsafe-inline'") && !csp.includes('nonce-')) {
      issues.push("WEAK CSP: 'unsafe-inline' without nonce")
    }
    if (csp.includes("'unsafe-eval'") && process.env.NODE_ENV !== 'development') {
      issues.push("WEAK CSP: 'unsafe-eval' in production")
    }
  }

  return { url, issues, passed: issues.length === 0 }
}

// Run in CI:
// pnpm tsx scripts/audit-security-headers.ts https://staging.yoursaas.com
const results = await Promise.all([
  auditHeaders(process.argv ?? 'https://localhost:3000'),
])

for (const result of results) {
  if (!result.passed) {
    console.error(`❌ ${result.url}:`)
    result.issues.forEach(i => console.error(`   - ${i}`))
    process.exit(1)
  } else {
    console.log(`✅ ${result.url}: All security headers present`)
  }
}
```

### CI Integration

```yaml
# .github/workflows/security-headers.yml
name: Security Headers Audit

on:
  deployment_status:

jobs:
  audit:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - name: Audit Security Headers
        run: pnpm tsx scripts/audit-security-headers.ts ${{ github.event.deployment_status.environment_url }}
```

---

## Post-Quantum Readiness Notes

> **Timeline:** NIST finalized FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205
> (SLH-DSA) in August 2024. TLS 1.3 with hybrid PQC key exchange is being rolled
> out by Cloudflare and major CDNs through 2025–2026.

**What this means for your app today:**

- Your HTTPS traffic is protected by your CDN (Vercel → Cloudflare) — PQC migration
  happens at the TLS layer, not in your application headers.
- **Action required now:** Ensure all API keys, signing keys, and session tokens use
  256-bit symmetric keys (not 128-bit) — these are already quantum-resistant.
- **Action required by 2027:** Replace any RSA-2048 or ECDSA P-256 signing (JWT,
  webhook signatures) with Ed25519 or ML-DSA when library support stabilizes.
- **Monitor:** [NIST PQC Project](https://csrc.nist.gov/projects/post-quantum-cryptography)

---

## Testing

### Vitest Unit Tests

```typescript
// packages/security/src/csp.test.ts
import { describe, it, expect } from 'vitest';
import { buildCsp, generateNonce } from './csp';

describe('CSP Builder', () => {
  it('generates a unique nonce per call', () => {
    const n1 = generateNonce();
    const n2 = generateNonce();
    expect(n1).not.toBe(n2);
    expect(n1).toHaveLength(22); // 16 bytes base64url = 22 chars
  });

  it('includes nonce in script-src', () => {
    const nonce = generateNonce();
    const csp = buildCsp({ nonce });
    expect(csp).toContain(`'nonce-${nonce}'`);
  });

  it('blocks unsafe-inline in production', () => {
    const csp = buildCsp({ nonce: 'abc123', isDev: false });
    expect(csp).not.toContain("'unsafe-inline'");
  });

  it('disables object-src', () => {
    const csp = buildCsp({ nonce: 'abc123' });
    expect(csp).toContain("object-src 'none'");
  });

  it('blocks frame-ancestors by default', () => {
    const csp = buildCsp({ nonce: 'abc123' });
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
```

### Integration Test with Playwright

```typescript
// e2e/security-headers.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('homepage has correct security headers', async ({ request }) => {
    const response = await request.head('/');

    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['content-security-policy']).toContain("object-src 'none'");
    expect(response.headers()['strict-transport-security']).toContain('preload');
    expect(response.headers()['x-powered-by']).toBeUndefined();
  });

  test('CSP contains nonce on dynamic pages', async ({ request }) => {
    const response = await request.get('/dashboard');
    const csp = response.headers()['content-security-policy'];
    expect(csp).toMatch(/nonce-[A-Za-z0-9\-_]{20,}/);
  });
});
```

---

## References

- [Next.js CSP Guide](https://nextjs.org/docs/app/guides/content-security-policy) [web:20]
- [Nonce Setup in Next.js](https://centralcsp.com/articles/how-to-setup-nonce-with-nextjs) [web:21]
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HSTS Preload List](https://hstspreload.org/)
- [Permissions-Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)
- [NIST Post-Quantum Cryptography Standards](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [OneUptime Security Headers Guide](https://oneuptime.com/blog/post/2026-01-24-handle-security-headers/) [web:33]

---
