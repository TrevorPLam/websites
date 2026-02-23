Excellent — rich, current data across all critical topics. Generating Batch 3 now — prioritizing the **🚨 CRITICAL** tier docs first, in decreasing priority order.

---

# security-headers-system.md

````markdown
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
````

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

````

***

# react-19-documentation.md

```markdown
# react-19-documentation.md

> **2026 Standards Compliance** | React 19.2 · React Compiler 1.0 Stable ·
> Activity API · useEffectEvent · View Transitions · Next.js 16 Integration

## Table of Contents
1. [Overview & What's New in 19.2](#overview--whats-new-in-192)
2. [React Compiler 1.0 — Stable](#react-compiler-10--stable)
3. [Activity Component](#activity-component)
4. [useEffectEvent Hook](#useeffectevent-hook)
5. [Actions & Form State (19.0 Recap)](#actions--form-state-190-recap)
6. [Server Components Patterns](#server-components-patterns)
7. [View Transitions](#view-transitions)
8. [Performance Patterns with Activity](#performance-patterns-with-activity)
9. [Migration Guide](#migration-guide)
10. [References](#references)

---

## Overview & What's New in 19.2

React 19.2, shipped in October 2025, is a significant update that stabilizes the React
Compiler and introduces first-class primitives for managing UI state complexity. [web:25][web:28]

| Feature | Status | Description |
|---------|--------|-------------|
| React Compiler | **Stable 1.0** | Build-time memoization; replaces `useMemo`/`useCallback` [web:34] |
| `<Activity />` | **New** | Hide/show UI preserving state without unmounting [web:28] |
| `useEffectEvent` | **New** | Decouple event logic from effect dependencies [web:25] |
| View Transitions | **New** | Declarative page/element transitions via browser API [web:31] |
| Performance Tracks | **New** | Chrome DevTools integration for React render profiling [web:31] |
| `use()` | **Stable** | Read Promises and Context in render |
| Actions / `useActionState` | **Stable** | Full-stack form mutations [web:34] |

---

## React Compiler 1.0 — Stable

The React Compiler is now **stable and production-ready**. It eliminates the need for
manual memoization by analyzing your component tree at build time and inserting optimal
`useMemo`/`useCallback` equivalents automatically. [web:34]

### Setup in Next.js 16

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,   // Enable stable React Compiler
  },
}

export default nextConfig
````

```bash
# Install compiler babel plugin (used by Next.js internally)
pnpm add -D babel-plugin-react-compiler
```

### Before vs After Compiler

**Before (manual memoization — verbose and error-prone):**

```typescript
// ❌ Manual memoization — what you had to write before
function ProductList({ products, onSelect }: ProductListProps) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  )

  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect],
  )

  return (
    <ul>
      {sortedProducts.map(p => (
        <ProductItem key={p.id} product={p} onSelect={handleSelect} />
      ))}
    </ul>
  )
}
```

**After (compiler handles it — clean component logic):**

```typescript
// ✅ React Compiler handles memoization at build time
function ProductList({ products, onSelect }: ProductListProps) {
  // Compiler automatically memoizes derived values and callbacks
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ul>
      {sortedProducts.map(p => (
        <ProductItem key={p.id} product={p} onSelect={id => onSelect(id)} />
      ))}
    </ul>
  )
}
```

### Compiler Linting Rules

```bash
# Install the compiler ESLint plugin
pnpm add -D eslint-plugin-react-compiler
```

```javascript
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: {
      // Warns about patterns that prevent compiler optimization
      'react-compiler/react-compiler': 'warn',
    },
  },
];
```

### Rules of React Compiler (What Breaks Optimization)

The compiler can only optimize components that follow the Rules of React. Common
violations that prevent optimization:

```typescript
// ❌ Mutating props or state directly — breaks compiler
function BadComponent({ items }: { items: string[] }) {
  items.push('new') // Direct mutation — unpredictable
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
}

// ✅ Pure, immutable operations — compiler can optimize
function GoodComponent({ items }: { items: string[] }) {
  const withNew = [...items, 'new']
  return <ul>{withNew.map(i => <li key={i}>{i}</li>)}</ul>
}

// ❌ Calling hooks conditionally — breaks compiler
function ConditionalHook({ isAdmin }: { isAdmin: boolean }) {
  if (isAdmin) {
    const data = useAdminData() // Conditional hook — forbidden
  }
}

// ❌ Reading refs during render — breaks optimization
function RefDuringRender({ ref }: { ref: React.RefObject<HTMLElement> }) {
  const height = ref.current?.offsetHeight  // Side effect during render
}
```

---

## Activity Component

`<Activity>` is React 19.2's solution for managing hidden-but-retained UI — tabs,
drawers, wizard steps, and back-navigation state. [web:25][web:28]

### Core Behavior

```
mode="visible"  →  Component renders normally, is interactive, paints to screen
mode="hidden"   →  Component continues rendering (data fetches, state updates)
                   but does NOT paint — zero visual or layout impact
```

This means hidden activities can **prefetch data** and **warm up state** while
invisible, making the transition to `visible` instantaneous.

### Basic Usage

```typescript
import { Activity } from 'react'

function TabbedDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'settings'>('analytics')

  return (
    <div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ✅ All tabs render simultaneously; only active one paints */}
      <Activity mode={activeTab === 'analytics' ? 'visible' : 'hidden'}>
        <AnalyticsTab />    {/* Data fetches continue in background */}
      </Activity>

      <Activity mode={activeTab === 'leads' ? 'visible' : 'hidden'}>
        <LeadsTab />        {/* Form state preserved when switching away */}
      </Activity>

      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />     {/* Settings don't lose unsaved changes */}
      </Activity>
    </div>
  )
}
```

**Compared to previous patterns:**

```typescript
// ❌ Before — loses state on tab switch, refetches data every time
{activeTab === 'leads' && <LeadsTab />}

// ❌ Before — CSS hide (display: none) — component still in DOM but hidden
<div style={{ display: activeTab === 'leads' ? 'block' : 'none' }}>
  <LeadsTab />
</div>

// ✅ Activity — state preserved, data prefetched, zero paint overhead
<Activity mode={activeTab === 'leads' ? 'visible' : 'hidden'}>
  <LeadsTab />
</Activity>
```

### Route Prefetching with Activity

One of the most powerful uses: prefetch the next likely page while the current one
is visible:

```typescript
// components/NavigationPrefetcher.tsx
import { Activity } from 'react'

interface NavigationPrefetcherProps {
  currentPath: string
  children: React.ReactNode
}

export function NavigationPrefetcher({
  currentPath,
  children,
}: NavigationPrefetcherProps) {
  return (
    <>
      {children}

      {/* Prefetch dashboard while user is on login page */}
      {currentPath === '/login' && (
        <Activity mode="hidden">
          <DashboardShell />   {/* Prefetches dashboard data in background */}
        </Activity>
      )}

      {/* Prefetch settings while user is on dashboard */}
      {currentPath === '/dashboard' && (
        <Activity mode="hidden">
          <SettingsPage />
        </Activity>
      )}
    </>
  )
}
```

### Wizard / Multi-Step Form State Preservation

```typescript
// components/OnboardingWizard.tsx
import { Activity } from 'react'
import { useState } from 'react'

export function OnboardingWizard() {
  const [step, setStep] = useState(1)

  return (
    <div>
      <StepIndicator current={step} total={4} />

      {/* Each step retains its form state even when navigating back */}
      <Activity mode={step === 1 ? 'visible' : 'hidden'}>
        <BusinessInfoStep onNext={() => setStep(2)} />
      </Activity>

      <Activity mode={step === 2 ? 'visible' : 'hidden'}>
        <ServiceAreaStep onNext={() => setStep(3)} onBack={() => setStep(1)} />
      </Activity>

      <Activity mode={step === 3 ? 'visible' : 'hidden'}>
        <BillingStep onNext={() => setStep(4)} onBack={() => setStep(2)} />
      </Activity>

      <Activity mode={step === 4 ? 'visible' : 'hidden'}>
        <ReviewStep onBack={() => setStep(3)} />
      </Activity>
    </div>
  )
}
```

---

## useEffectEvent Hook

`useEffectEvent` separates **event-driven logic** (values read at the time of an
event) from **reactive dependencies** (values that should retrigger the effect). [web:25]

### The Problem It Solves

```typescript
// ❌ Before — verbose suppression or stale closure problems
function AnalyticsTracker({ eventName, userId }: { eventName: string; userId: string }) {
  useEffect(() => {
    // We want this to run when eventName changes
    // BUT userId should be current at time of event, not a dependency
    trackEvent(eventName, { userId }); // eslint-disable-line react-hooks/exhaustive-deps
  }, [eventName]); // Stale userId — but adding it causes unwanted re-runs
}
```

```typescript
// ✅ After — useEffectEvent: userId is always fresh, eventName triggers re-runs
import { useEffect, useEffectEvent } from 'react';

function AnalyticsTracker({ eventName, userId }: { eventName: string; userId: string }) {
  // track is an "effect event" — not reactive, always reads latest values
  const track = useEffectEvent(() => {
    trackEvent(eventName, { userId });
  });

  useEffect(() => {
    track();
  }, [eventName]); // Only eventName is a dependency — userId reads current value
}
```

### Real-World Pattern: Realtime Subscription with Non-Reactive Config

```typescript
// packages/realtime/src/use-realtime-channel.ts
import { useEffect, useEffectEvent } from 'react';
import { supabase } from '@/shared/api/supabase-client';

function useRealtimeChannel<T>(
  channel: string,
  onMessage: (payload: T) => void,
  options: { enabled: boolean; debug: boolean }
) {
  // Capture non-reactive values in effect event
  // onMessage and options.debug should not retrigger the subscription
  const handleMessage = useEffectEvent((payload: T) => {
    if (options.debug) console.log('[Realtime]', channel, payload);
    onMessage(payload);
  });

  useEffect(() => {
    if (!options.enabled) return;

    const sub = supabase
      .channel(channel)
      .on('broadcast', { event: '*' }, ({ payload }) => {
        handleMessage(payload as T);
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, [channel, options.enabled]); // Only reactive to channel + enabled changes
}
```

---

## Actions & Form State (19.0 Recap)

React 19.0 (Dec 2024) introduced Actions as the canonical mutation pattern. In 19.2
these are now fully stable and integrated with the compiler.

```typescript
// features/contact-form/ui/ContactForm.tsx
'use client'
import { useActionState, useOptimistic, startTransition } from 'react'
import { submitContactAction } from '../api/submit-contact-action'

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactAction, null)

  // Optimistic UI: show "Submitting..." state immediately
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (_, newState: string) => ({ status: newState }),
  )

  return (
    <form
      action={action}
      aria-live="polite"
      aria-busy={isPending}
    >
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        aria-required="true"
        disabled={isPending}
      />
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        aria-required="true"
        disabled={isPending}
      />
      <textarea name="message" rows={4} disabled={isPending} />

      <button type="submit" disabled={isPending} aria-disabled={isPending}>
        {isPending ? 'Sending…' : 'Send Message'}
      </button>

      {state?.success && (
        <p role="status" className="text-green-600">
          Message sent! We'll be in touch within 24 hours.
        </p>
      )}
      {state?.error && (
        <p role="alert" className="text-red-600">
          {state.error}
        </p>
      )}
    </form>
  )
}
```

---

## Server Components Patterns

### Data Fetching Without `useEffect`

```typescript
// pages/dashboard/index.tsx — Server Component
// No useEffect, no useState for async data — just async/await
export async function DashboardPage({ tenantId }: { tenantId: string }) {
  // Parallel data fetching — compiler optimizes re-renders
  const [analytics, leads, team] = await Promise.all([
    fetchAnalyticsSummary(tenantId),
    fetchRecentLeads(tenantId, { limit: 10 }),
    fetchTeamMembers(tenantId),
  ])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <AnalyticsCard data={analytics} />
      <LeadFeed leads={leads} />
      <TeamPanel members={team} />
    </div>
  )
}
```

### `use()` for Deferred Data

```typescript
// Use the `use()` hook to read a Promise in a Client Component
// (enables streaming — the Suspense boundary above handles loading)
'use client'
import { use } from 'react'

export function LazyAnalyticsChart({
  dataPromise,
}: {
  dataPromise: Promise<AnalyticsData>
}) {
  // `use()` suspends the component until the promise resolves
  // The nearest <Suspense fallback> handles loading state
  const data = use(dataPromise)
  return <LineChart data={data} />
}
```

---

## View Transitions

```typescript
// hooks/use-view-transition.ts
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

export function useViewTransition() {
  const router = useRouter();

  const navigateWithTransition = (href: string) => {
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }

    document.startViewTransition(() => {
      startTransition(() => {
        router.push(href);
      });
    });
  };

  return { navigateWithTransition };
}

// CSS for View Transitions
// app/globals.css
// ::view-transition-old(root) { animation: fade-out 0.15s ease; }
// ::view-transition-new(root) { animation: fade-in 0.15s ease; }
```

---

## Migration Guide

### From React 18 to 19.2

| React 18 Pattern                         | React 19.2 Replacement              | Notes                      |
| ---------------------------------------- | ----------------------------------- | -------------------------- |
| `useCallback(fn, deps)`                  | Remove — Compiler handles it        | Only if Compiler enabled   |
| `useMemo(fn, deps)`                      | Remove — Compiler handles it        | Only for pure computations |
| `useState` + `useEffect` for server data | Server Component + `async/await`    | For server-rendered data   |
| Manual loading/error state               | `useActionState`                    | For mutations              |
| `{cond && <Comp />}` for hidden UI       | `<Activity mode="hidden\|visible">` | For state preservation     |
| `useEffect` with stale closures          | `useEffectEvent` + `useEffect`      | For reactive effects       |

### Compiler Adoption Strategy

1. **Audit first**: Run `eslint-plugin-react-compiler` and fix violations
2. **Enable incrementally**: Start with `packages/ui` (pure components, easiest)
3. **Remove useMemo/useCallback** only after verifying with React DevTools Profiler
4. **Do not remove `memo()`** on list items yet — wait for performance profiling data

---

## References

- [React 19.2 Official Blog](https://react.dev/blog/2025/10/01/react-19-2) [web:28]
- [React Compiler Docs](https://react.dev/learn/react-compiler)
- [Activity API Docs](https://react.dev/reference/react/Activity)
- [useEffectEvent Docs](https://react.dev/reference/react/experimental_useEffectEvent)
- [React 19.2 — InfoQ Coverage](https://www.infoq.com/news/2025/10/meta-ships-react-19-2/) [web:25]
- [JSJ 670 — React 19.2 Deep Dive](https://www.youtube.com/watch?v=-BMm--uHb6s) [web:31]
- [Reddit: React 19 → 19.2 Key Features](https://www.reddit.com/r/react/comments/1rb7qub/) [web:34]

````

***

# nextjs-16-documentation.md

```markdown
# nextjs-16-documentation.md

> **2026 Standards Compliance** | Next.js 16 · Stable PPR · `use cache` Directive ·
> Cache Components · Platform Adapters · DevTools MCP

## Table of Contents
1. [What's New in Next.js 16](#whats-new-in-nextjs-16)
2. [Partial Pre-Rendering (PPR) — Now Stable](#partial-pre-rendering-ppr--now-stable)
3. [`use cache` Directive & Cache Components](#use-cache-directive--cache-components)
4. [Cache Life Profiles](#cache-life-profiles)
5. [Cache Tags & Revalidation](#cache-tags--revalidation)
6. [Async Request APIs](#async-request-apis)
7. [Platform Adapters](#platform-adapters)
8. [Next.js DevTools MCP](#nextjs-devtools-mcp)
9. [Migration from Next.js 15](#migration-from-nextjs-15)
10. [Complete Rendering Decision Tree](#complete-rendering-decision-tree)
11. [References](#references)

---

## What's New in Next.js 16

| Feature | Status | Impact |
|---------|--------|--------|
| PPR (Partial Pre-Rendering) | **Stable** | Static speed + dynamic personalization |
| `use cache` directive | **Stable** | Component-level caching |
| Cache Components | **Stable** | Cache any async Server Component |
| `cacheLife()` API | **New** | Declarative cache lifetime profiles |
| `cacheTag()` API | **New** | Fine-grained cache invalidation |
| Async Request APIs | **Breaking** | `cookies()`, `headers()`, `params` now async |
| Platform Adapters | **New** | Native Cloudflare Workers, OpenNext deploy targets |
| Next.js DevTools MCP | **New** | AI agent access to build analysis |
| React 19.2 | **Bundled** | Compiler, Activity, useEffectEvent |
| `cacheComponents: true` config | **New** | Opt-in flag for Cache Components [web:29][web:32] |

---

## Partial Pre-Rendering (PPR) — Now Stable

PPR is the core innovation of Next.js 16: a **single HTTP response** delivers a static
HTML shell instantly (cached at CDN edge), while dynamic Suspense boundaries stream in
as their data resolves. The browser renders meaningful content immediately, then
progressively hydrates dynamic sections. [web:29]

### How PPR Detects Static vs Dynamic

The static/dynamic boundary is determined **automatically** by the presence of
dynamic signals: [web:29]

````

Static signals → can be cached:

- async Server Components with no dynamic APIs
- Cached `fetch()` calls
- `use cache` directives

Dynamic signals → cannot be cached, stream in:

- `cookies()`, `headers()` calls
- `searchParams` access
- `new Date()`, `Math.random()`
- `unstable_noStore()` calls

````

### Enabling PPR

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,             // Enable stable PPR
    cacheComponents: true, // Enable cache components (use cache directive)
    reactCompiler: true,   // React Compiler 1.0
  },
}

export default nextConfig
````

### PPR Page Architecture

```typescript
// app/dashboard/page.tsx — PPR: static shell + dynamic islands
import { Suspense } from 'react'
import { DashboardShell } from '@/widgets/dashboard-shell'
import { PersonalizedGreeting } from '@/widgets/personalized-greeting'
import { AnalyticsChart } from '@/widgets/analytics-chart'
import { LiveLeadFeed } from '@/widgets/live-lead-feed'
import { Skeleton } from '@/shared/ui'

// This entire route uses PPR automatically when next.config has ppr: true
// Static shell renders at build time, dynamic parts stream in
export default async function DashboardPage() {
  return (
    <DashboardShell>
      {/* DYNAMIC — reads cookies() for user session → streams in */}
      <Suspense fallback={<Skeleton className="h-8 w-48" />}>
        <PersonalizedGreeting />
      </Suspense>

      {/* STATIC CACHED — analytics query cached for 1 hour → in static shell */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <AnalyticsChart />
      </Suspense>

      {/* DYNAMIC — real-time feed, no caching → streams in */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <LiveLeadFeed />
      </Suspense>
    </DashboardShell>
  )
}
```

---

## `use cache` Directive & Cache Components

The `use cache` directive marks any async Server Component or function as cacheable.
This is built on top of PPR — it allows **dynamic routes** to have **cached portions**,
giving granular control that route-level `revalidate` can't provide. [web:26][web:29][web:32]

### Function-Level Caching

```typescript
// Caching a data-fetch function
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function getProductCatalog(tenantId: string) {
  'use cache';
  cacheLife('hours'); // Cache for hours (built-in profile)
  cacheTag(`catalog:${tenantId}`); // Tag for on-demand revalidation

  const products = await db.products.findMany({ where: { tenantId } });
  return products;
}

// Any call to getProductCatalog('t_123') uses the cache for hours
// Manually invalidate with: revalidateTag('catalog:t_123')
```

### Component-Level Caching

```typescript
// widgets/analytics-chart/ui/AnalyticsChart.tsx
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

// The ENTIRE component output is cached — not just its data
export async function AnalyticsChart({ tenantId }: { tenantId: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`analytics:${tenantId}`)

  // This fetch runs once per hour per tenant, then the rendered HTML is cached
  const data = await fetchAnalyticsSummary(tenantId)

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-sm font-medium text-gray-500">Leads This Month</h2>
      <p className="mt-1 text-3xl font-bold">{data.leadsThisMonth}</p>
      <LineChart data={data.trend} />
    </div>
  )
}
```

### Critical Rules for `use cache`

```typescript
// ❌ BREAKS CACHE: new Date() is dynamic — causes cache miss every render
async function BadCachedComponent() {
  'use cache'
  const now = new Date()  // Dynamic value — defeats caching
  return <p>Rendered at {now.toISOString()}</p>
}

// ✅ CORRECT: move dynamic values outside the cached boundary
async function GoodCachedComponent({ staticDate }: { staticDate: string }) {
  'use cache'
  cacheLife('hours')
  return <p>Content as of {staticDate}</p>
}

// In the parent (not cached):
// <GoodCachedComponent staticDate={lastRevalidatedAt} />

// ❌ BREAKS CACHE: cookies() and headers() are request-specific
async function BadCachedPersonalized() {
  'use cache'
  const cookieStore = cookies()  // Dynamic — cannot be cached
  const userId = cookieStore.get('userId')?.value
}

// ✅ CORRECT: read dynamic values in parent, pass as props into cached component
async function PersonalizedPage() {
  // NOT cached — reads cookies
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  return (
    // Cached — receives userId as prop, makes it part of cache key
    <CachedUserProfile userId={userId} />
  )
}
```

---

## Cache Life Profiles

Built-in profiles for common caching needs: [web:26][web:29]

```typescript
// Built-in cacheLife profiles:
cacheLife('seconds'); // stale: 0s,   revalidate: 1s,    expire: 10s
cacheLife('minutes'); // stale: 60s,  revalidate: 60s,   expire: 10m
cacheLife('hours'); // stale: 1h,   revalidate: 1h,    expire: 1d
cacheLife('days'); // stale: 1d,   revalidate: 1d,    expire: 1w
cacheLife('weeks'); // stale: 1w,   revalidate: 1w,    expire: 1mo
cacheLife('max'); // stale: 1y,   revalidate: 1y,    expire: 1y (forever)
```

### Custom Cache Life Profiles

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    cacheComponents: true,
    // Define custom profiles matching your data freshness requirements
    cacheProfiles: {
      realtime: { stale: 0, revalidate: 5, expire: 30 },
      'lead-analytics': { stale: 300, revalidate: 300, expire: 86400 },
      'site-config': { stale: 3600, revalidate: 3600, expire: 604800 },
      'blog-content': { stale: 3600, revalidate: 3600, expire: 604800 },
    },
  },
};
```

```typescript
// Usage with custom profile:
async function LeadAnalyticsWidget({ tenantId }: { tenantId: string }) {
  'use cache';
  cacheLife('lead-analytics'); // 5 min freshness
  cacheTag(`leads:${tenantId}`);
  // ...
}
```

---

## Cache Tags & Revalidation

Cache tags enable on-demand, surgical revalidation from webhook handlers, Server
Actions, or API routes:

```typescript
// Tagging pattern — use hierarchical tags for flexibility
async function getTenantData(tenantId: string) {
  'use cache';
  cacheTag(
    `tenant:${tenantId}`, // Invalidate everything for a tenant
    `tenant:${tenantId}:sites` // Or just their sites data
  );
  return fetchTenantWithSites(tenantId);
}

// On-demand revalidation from Sanity webhook:
// apps/portal/src/app/api/revalidate/sanity/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-webhook-secret');
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { _type, tenantId, slug } = body;

  // Surgical invalidation based on content type
  switch (_type) {
    case 'blogPost':
      revalidateTag(`blog:${slug}`);
      revalidateTag('blog-index');
      break;
    case 'serviceArea':
      revalidateTag(`service-area:${slug}`);
      revalidateTag(`tenant:${tenantId}:service-areas`);
      break;
    case 'siteConfig':
      revalidateTag(`tenant:${tenantId}:config`);
      revalidateTag(`tenant:${tenantId}`); // Broad invalidation
      break;
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
```

---

## Async Request APIs

**Breaking change in Next.js 15/16**: `cookies()`, `headers()`, `params`, and
`searchParams` are now async. Failure to await them causes a runtime error. [web:29]

```typescript
// ❌ Next.js 14 (sync — no longer works)
import { cookies, headers } from 'next/headers';

export default function Page() {
  const token = cookies().get('token'); // Sync — THROWS in Next.js 16
  const nonce = headers().get('x-nonce');
}

// ✅ Next.js 16 (async — required)
import { cookies, headers } from 'next/headers';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>; // async params
  searchParams: Promise<{ q?: string }>; // async searchParams
}) {
  // All request APIs require await
  const cookieStore = await cookies();
  const headersList = await headers();
  const { slug } = await params;
  const { q } = await searchParams;

  const token = cookieStore.get('token');
  const nonce = headersList.get('x-nonce');
  // ...
}
```

---

## Platform Adapters

Next.js 16 ships with first-class **platform adapters** that emit platform-native
builds — not just Node.js: [web:29]

```typescript
// next.config.ts — Cloudflare Workers adapter
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  await initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  // Target Cloudflare Workers runtime
};

export default nextConfig;
```

| Adapter            | Use Case                    | Status                   |
| ------------------ | --------------------------- | ------------------------ |
| Vercel (default)   | Vercel deployment           | Built-in                 |
| Node.js            | Self-hosted / Docker        | Built-in                 |
| Cloudflare Workers | Edge-native, no cold starts | `@opennextjs/cloudflare` |
| AWS Lambda         | AWS deployments             | `@opennextjs/aws`        |
| Docker             | Containerized               | Built-in                 |

---

## Next.js DevTools MCP

Next.js 16 ships a built-in **Model Context Protocol (MCP) server** that exposes
your build analysis and route structure to AI agents: [web:29]

```json
// .mcp/config.json — already present in your repo!
{
  "mcpServers": {
    "nextjs-devtools": {
      "command": "npx",
      "args": ["@vercel/next-devtools-mcp", "--project", "."]
    }
  }
}
```

**What the MCP exposes to agents:**

- Build output (bundle sizes, route list, cache hit rates)
- Rendering mode per route (static / dynamic / PPR)
- `use cache` coverage report
- Turbopack module graph

---

## Migration from Next.js 15

### Automated Codemod

```bash
# Run the official migration codemod
npx @next/codemod@latest next-async-request-api .

# What it does:
# - Wraps cookies(), headers() in await
# - Updates params/searchParams to Promise<> types
# - Updates middleware usage of these APIs
```

### Manual Migration Checklist

```
□ Run async-request-api codemod
□ Set experimental.ppr: true in next.config.ts
□ Set experimental.cacheComponents: true
□ Install React 19.2 (ships with Next.js 16)
□ Enable React Compiler (experimental.reactCompiler: true)
□ Run React Compiler lint; fix violations
□ Audit 'use cache' placement in components
□ Replace revalidate = X with cacheLife() where granular caching is needed
□ Test all webhook revalidation flows with cacheTag()
```

---

## Complete Rendering Decision Tree

```
For each route/component, ask:

1. Does it read cookies/headers/searchParams at render time?
   └─ YES → DYNAMIC (Suspense boundary; stream in)
   └─ NO  → Continue ↓

2. Does it have time-sensitive data (stock prices, live counts)?
   └─ YES → DYNAMIC (Suspense + short revalidate)
   └─ NO  → Continue ↓

3. Does it have data that changes occasionally (hours/days)?
   └─ YES → use cache + cacheLife('hours'/'days') + cacheTag()
   └─ NO  → Continue ↓

4. Is it completely static (marketing copy, pricing)?
   └─ YES → Static (build-time, no cache directive needed)
              → generateStaticParams for parameterized routes
```

---

## References

- [Next.js 16 Master PPR Tutorial](https://www.youtube.com/watch?v=WJn1rXesTtg) [web:29]
- [Cache Components — Shahin.page Deep Dive](https://shahin.page/article/nextjs-cache-components-partial-prerendering-streaming-caching) [web:26]
- [Cache Components — YouTube](https://www.youtube.com/watch?v=Rodyt22D84A) [web:32]
- [Next.js generateMetadata Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) [web:41]
- [Next.js Sitemap Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) [web:47]
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [React 19.2 Blog](https://react.dev/blog/2025/10/01/react-19-2) [web:28]

````

***

# stripe-documentation.md

```markdown
# stripe-documentation.md

> **2026 Standards Compliance** | Stripe API 2025-11-20 · Payment Intents v2 ·
> SCA/3DS2 · Idempotency · Webhook Best Practices · Radar Fraud Rules

## Table of Contents
1. [Overview](#overview)
2. [API Versioning & 2026 Changes](#api-versioning--2026-changes)
3. [Payment Intents — Complete Implementation](#payment-intents--complete-implementation)
4. [Stripe Elements (React)](#stripe-elements-react)
5. [Webhook Handling — Production Patterns](#webhook-handling--production-patterns)
6. [Idempotency Keys — Complete Guide](#idempotency-keys--complete-guide)
7. [Stripe Checkout Sessions](#stripe-checkout-sessions)
8. [Customer Portal](#customer-portal)
9. [Subscription Management](#subscription-management)
10. [Radar Fraud Prevention](#radar-fraud-prevention)
11. [SCA / 3D Secure 2](#sca--3d-secure-2)
12. [Testing Patterns](#testing-patterns)
13. [Security Checklist](#security-checklist)
14. [References](#references)

---

## Overview

Stripe is the payments backbone for subscription billing, one-time charges, and
customer portal management. In 2026, the core patterns center on:
- **Payment Intents API** for all charge flows (not Charges API)
- **Idempotency keys** on every write operation
- **Webhook-driven state machine** for subscription lifecycle
- **Radar** for ML-based fraud prevention
- **SAQ A compliance** via Stripe-hosted Elements (no card data touches your servers)

---

## API Versioning & 2026 Changes

Always pin the Stripe API version in your client initialization:

```typescript
// packages/billing/src/stripe-client.ts
import Stripe from 'stripe'

// Pin to the version your integration was tested against
// Stripe issues changelogs for each version at stripe.com/docs/upgrades
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-20',   // Latest stable as of Feb 2026
  typescript: true,
  appInfo: {
    name: 'YourSaaS',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Automatic retry on network failures (3 retries with exponential backoff)
  maxNetworkRetries: 3,
})

export const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
````

---

## Payment Intents — Complete Implementation

The Payment Intents API is the **only** recommended way to accept payments in 2026.
The legacy Charges API does not support SCA/3DS2 and will be deprecated. [web:35]

### Server: Create PaymentIntent

```typescript
// apps/portal/src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@repo/billing/stripe-client';
import { verifyTenantSession } from '@repo/auth';
import { getTenantSubscription } from '@repo/db/subscriptions';

export async function POST(req: NextRequest) {
  const session = await verifyTenantSession();
  const { amount, currency = 'usd', priceId, metadata = {} } = await req.json();

  // Validate amount server-side — NEVER trust client-provided amounts for subscriptions
  if (!Number.isInteger(amount) || amount < 50 || amount > 99_999_99) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Generate idempotency key tied to the specific cart/session
  // Using session.cartId ensures the same cart won't create 2 PaymentIntents
  const idempotencyKey = `pi_${session.tenantId}_${session.cartId ?? Date.now()}`;

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount, // Amount in smallest currency unit (cents for USD)
      currency,
      customer: session.stripeCustomerId,
      automatic_payment_methods: {
        enabled: true, // Enables cards, Apple Pay, Google Pay, Link, etc.
        allow_redirects: 'never', // Keep user on your page (no bank redirects)
      },
      metadata: {
        tenant_id: session.tenantId,
        user_id: session.userId,
        price_id: priceId,
        ...metadata,
      },
      // SCA: capture method determines when the charge is captured
      capture_method: 'automatic',
      // Statement descriptor: what appears on customer's bank statement
      statement_descriptor_suffix: 'YOURSAAS',
    },
    {
      idempotencyKey,
    }
  );

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}
```

### Client: Stripe Elements

```typescript
// features/checkout/ui/CheckoutForm.tsx
'use client'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutWrapper({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#2563eb',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
        loader: 'auto',
      }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  )
}

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Form validation failed')
      setIsProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',  // Avoid redirect when not needed (e.g., card payments)
    })

    if (confirmError) {
      // Show user-friendly error message
      setError(
        confirmError.type === 'card_error' || confirmError.type === 'validation_error'
          ? (confirmError.message ?? 'Payment failed')
          : 'An unexpected error occurred. Please try again.',
      )
    }
    // If no error + no redirect: payment succeeded, handle success state here

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'accordion',   // Clean accordion layout for multiple methods
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'link'],
        }}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        aria-disabled={!stripe || isProcessing}
        aria-busy={isProcessing}
        className="w-full rounded-md bg-blue-600 py-3 text-white font-medium
                   hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  )
}
```

---

## Webhook Handling — Production Patterns

Webhooks are the **authoritative source of truth** for payment state. Never rely
solely on redirect URLs — they can be bypassed or lost on network failure. [web:38]

```typescript
// apps/portal/src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@repo/billing/stripe-client';
import { redis } from '@repo/cache';

// Disable body parsing — Stripe needs raw body for signature verification
export const dynamic = 'force-dynamic';

const WEBHOOK_HANDLERS: Partial<Record<Stripe.Event.Type, (event: Stripe.Event) => Promise<void>>> =
  {
    'payment_intent.succeeded': handlePaymentSucceeded,
    'payment_intent.payment_failed': handlePaymentFailed,
    'customer.subscription.created': handleSubscriptionCreated,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
    'invoice.payment_succeeded': handleInvoiceSucceeded,
    'invoice.payment_failed': handleInvoiceFailed,
    'customer.subscription.trial_will_end': handleTrialEnding,
  };

export async function POST(req: NextRequest) {
  const body = await req.text(); // Raw body for signature verification
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // IDEMPOTENCY: Track processed events to prevent duplicate processing
  const eventKey = `stripe:event:${event.id}`;
  const alreadyProcessed = await redis.get(eventKey);
  if (alreadyProcessed) {
    console.log(`Skipping duplicate webhook event: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Mark as processing before handling (prevents race condition)
  await redis.set(eventKey, '1', { ex: 86400 }); // 24h dedup window

  const handler = WEBHOOK_HANDLERS[event.type];
  if (handler) {
    try {
      await handler(event);
    } catch (err) {
      console.error(`Failed to handle webhook ${event.type}:`, err);
      // Delete the processed flag so Stripe retries
      await redis.del(eventKey);
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;
  const tenantId = intent.metadata.tenant_id;
  const orderId = intent.metadata.order_id;

  if (!tenantId) {
    console.warn('PaymentIntent missing tenant_id metadata', intent.id);
    return;
  }

  await Promise.all([
    updateOrderStatus(orderId, 'paid'),
    updateTenantBillingStatus(tenantId, 'active'),
    sendReceiptEmail(tenantId, intent),
  ]);
}
```

---

## Idempotency Keys — Complete Guide

Idempotency keys prevent duplicate charges when network timeouts cause retries. [web:35][web:36][web:37]

```typescript
// packages/billing/src/idempotency.ts

/**
 * Generate a stable idempotency key for Stripe API calls.
 *
 * Rules:
 * 1. Same key = same logical operation (safe to retry)
 * 2. Different key = different operation (creates new charge)
 * 3. Keys expire after 24 hours in Stripe
 * 4. Keys must be unique per operation type
 */
export function generateIdempotencyKey(operation: string, ...identifiers: string[]): string {
  // Stable, deterministic key from operation + identifiers
  // Do NOT include timestamps — that defeats idempotency
  return [operation, ...identifiers].join(':');
}

// Usage patterns:

// ✅ PaymentIntent creation: key = operation + cart ID (stable per cart)
const piKey = generateIdempotencyKey('create_pi', tenantId, cartId);
await stripe.paymentIntents.create(params, { idempotencyKey: piKey });

// ✅ Subscription creation: key = operation + tenant + price
const subKey = generateIdempotencyKey('create_sub', tenantId, priceId);
await stripe.subscriptions.create(params, { idempotencyKey: subKey });

// ✅ Refund: key = operation + payment intent ID (one refund per PI)
const refundKey = generateIdempotencyKey('refund', paymentIntentId);
await stripe.refunds.create({ payment_intent: paymentIntentId }, { idempotencyKey: refundKey });

// ❌ WRONG — timestamp in key defeats idempotency
const badKey = `create_pi_${tenantId}_${Date.now()}`; // Never do this
```

---

## Stripe Checkout Sessions

For simpler integrations (no custom UI needed), Stripe Checkout handles the full
payment flow with a hosted page:

```typescript
// Server Action: create checkout session
// apps/portal/src/app/billing/upgrade/actions.ts
'use server';
import { redirect } from 'next/navigation';
import { stripe } from '@repo/billing/stripe-client';

export async function createCheckoutSession(priceId: string) {
  const session = await verifyTenantSession();
  const tenant = await getTenant(session.tenantId);

  const checkoutSession = await stripe.checkout.sessions.create(
    {
      customer: tenant.stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/billing/upgrade`,
      subscription_data: {
        metadata: {
          tenant_id: session.tenantId,
          tenant_slug: tenant.slug,
        },
        trial_period_days: tenant.isEligibleForTrial ? 14 : 0,
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    },
    {
      idempotencyKey: generateIdempotencyKey('checkout', session.tenantId, priceId),
    }
  );

  redirect(checkoutSession.url!);
}
```

---

## Customer Portal

```typescript
// Server Action: create billing portal session
export async function createBillingPortalSession() {
  const session = await verifyTenantSession();
  const tenant = await getTenant(session.tenantId);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: `${process.env.APP_URL}/settings/billing`,
    // Optional: customize which features are visible
    // configuration: portalConfigId,
  });

  redirect(portalSession.url);
}
```

---

## Radar Fraud Prevention

```typescript
// Enable Radar rules in PaymentIntent
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency,
  metadata: {
    tenant_id: tenantId,
    // Radar uses metadata for rule matching
    plan: tenant.plan,
    account_age_days: String(daysSinceSignup),
    is_verified: String(tenant.isVerified),
  },
  radar_options: {
    // Associate with your user's session for velocity checks
    session: stripeRadarSessionId,
  },
});
```

---

## Testing Patterns

```typescript
// packages/billing/src/stripe.test.ts — use Stripe test mode
const TEST_CARDS = {
  success: '4242424242424242',
  decline: '4000000000000002',
  sca_required: '4000002500003155', // Triggers 3DS2
  insufficient: '4000000000009995',
};

describe('Stripe Integration', () => {
  it('creates PaymentIntent with idempotency', async () => {
    const key = generateIdempotencyKey('test_pi', 'tenant_001', 'cart_001');
    const pi1 = await stripe.paymentIntents.create(
      { amount: 2000, currency: 'usd' },
      { idempotencyKey: key }
    );
    const pi2 = await stripe.paymentIntents.create(
      { amount: 2000, currency: 'usd' },
      { idempotencyKey: key }
    );
    // Same key = same PaymentIntent returned
    expect(pi1.id).toBe(pi2.id);
  });
});
```

---

## Security Checklist

```
□ Never log or store raw card data — SAQ A requirement
□ Verify webhook signature on EVERY incoming webhook
□ Use idempotency keys on ALL write operations
□ Store Stripe secret key in environment variables only
□ Never expose secret key to client-side code
□ Pin API version in stripe client initialization
□ Set statement_descriptor to identify charges to customers
□ Enable Radar for ML-based fraud prevention
□ Restrict Stripe dashboard access to need-to-know
□ Use restricted keys for read-only webhook endpoints
□ Enable email notifications for failed payments
□ Test with Stripe test mode before live deployment
```

---

## References

- [Stripe Payment Intents API](https://docs.stripe.com/payments/payment-intents) [web:35]
- [Stripe Idempotent Requests](https://docs.stripe.com/api/idempotent_requests) [web:37]
- [Building Solid Stripe Integrations](https://stripe.dev/blog/building-solid-stripe-integrations-developers-guide-success) [web:38]
- [Stripe 2026 Developer Guide](https://www.digitalapplied.com/blog/stripe-payment-integration-developer-guide-2026) [web:36]
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks Best Practices](https://www.stigg.io/blog-posts/best-practices-i-wish-we-knew-when-integrating-stripe-webhooks)

````

***

# core-web-vitals-optimization.md

```markdown
# core-web-vitals-optimization.md

> **2026 Standards Compliance** | INP (Replaces FID) · LCP · CLS · TTFB ·
> Google CrUX 2026 Thresholds · Next.js 16 PPR · React 19.2 Compiler

## Table of Contents
1. [2026 Metric Overview & Thresholds](#2026-metric-overview--thresholds)
2. [INP — Interaction to Next Paint](#inp--interaction-to-next-paint)
3. [LCP — Largest Contentful Paint](#lcp--largest-contentful-paint)
4. [CLS — Cumulative Layout Shift](#cls--cumulative-layout-shift)
5. [TTFB & FCP](#ttfb--fcp)
6. [Measurement Infrastructure](#measurement-infrastructure)
7. [Performance Budget System](#performance-budget-system)
8. [INP Optimization Patterns](#inp-optimization-patterns)
9. [LCP Optimization Patterns](#lcp-optimization-patterns)
10. [CLS Optimization Patterns](#cls-optimization-patterns)
11. [CI Performance Gates](#ci-performance-gates)
12. [References](#references)

---

## 2026 Metric Overview & Thresholds

**Core Web Vitals are a Google ranking signal.** In 2026, INP has fully replaced FID as
the responsiveness metric, providing a far more accurate picture of interactive
performance across the entire user session. [web:40][web:46][web:49]

| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|------------------|------|-----------------|
| **INP** | ≤ 200ms | 200–500ms | > 500ms | Worst interaction latency across full session |
| **LCP** | ≤ 2.5s | 2.5–4.0s | > 4.0s | Time for largest visible element to render |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 | Unexpected layout shifts during page lifetime |
| **TTFB** | ≤ 800ms | 800ms–1.8s | > 1.8s | Server response time (not a CWV, but a ranking signal) |
| **FCP** | ≤ 1.8s | 1.8–3.0s | > 3.0s | First meaningful paint |

**INP Measurement Phase Breakdown:** [web:43]
````

User Click/Tap/Keyboard
│
▼ [Input Delay] ← Main thread busy with other tasks
Event Handler Runs
│
▼ [Processing Time] ← Your JS executes, DOM updates
Frame Produced
│
▼ [Presentation Delay] ← Browser renders/composites
Next Paint

```

---

## INP — Interaction to Next Paint

INP is the most difficult CWV to optimize because it measures **every interaction**
throughout the session, not just the first. The worst interaction becomes the score. [web:40][web:49]

### Why INP Is Hard

Traditional performance optimizations (bundle size, SSR, CDN) barely affect INP.
INP is dominated by **main thread contention** — JavaScript blocking the event loop
between a user's click and the next paint.

### INP Optimization Checklist

```

□ Break up long tasks (> 50ms) using scheduler.yield()
□ Defer non-critical JS until after first interaction
□ Use React Compiler to reduce unnecessary re-renders
□ Move expensive computations off the main thread (Web Workers)
□ Use CSS containment to limit layout recalculation scope
□ Virtualize long lists (react-window, TanStack Virtual)
□ Debounce/throttle search inputs and filter controls
□ Use startTransition() for non-urgent state updates
□ Profile with Chrome DevTools Performance Tracks (new in 2026)
□ Measure with web-vitals library (INP + attribution)

````

### `scheduler.yield()` — Break Up Long Tasks

```typescript
// packages/performance/src/scheduler.ts

/**
 * Yield to the browser event loop, allowing it to process
 * pending user input before continuing.
 *
 * Use inside loops that process many items or do heavy computation.
 */
export async function yieldToMain(): Promise<void> {
  if ('scheduler' in globalThis && 'yield' in globalThis.scheduler) {
    // Modern Scheduling API — respects user input priority
    return globalThis.scheduler.yield()
  }
  // Fallback: setTimeout(0) yields to the task queue
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Usage: Process 1000 items without blocking user interactions
export async function processItemsWithYield<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 50,
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    results.push(...chunk.map(processor))
    // Yield after each chunk — lets browser handle clicks between chunks
    await yieldToMain()
  }
  return results
}
````

### React `startTransition` for Non-Urgent Updates

```typescript
// features/lead-search/ui/LeadSearch.tsx
'use client'
import { useState, useTransition } from 'react'

export function LeadSearch() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Lead[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // URGENT: update the input immediately (low INP for keypress)
    setQuery(value)

    // NON-URGENT: search results can wait — React batches + defers
    startTransition(async () => {
      const results = await searchLeads(value)
      setSearchResults(results)
    })
  }

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder="Search leads…"
        aria-label="Search leads"
        aria-busy={isPending}
        className="w-full rounded-md border px-3 py-2"
      />
      {isPending && <SearchSkeleton />}
      <LeadList leads={searchResults} />
    </>
  )
}
```

### Web Worker for Heavy Computation

```typescript
// Move CSV processing off main thread to prevent INP degradation
// workers/csv-processor.worker.ts
self.addEventListener('message', async (e: MessageEvent) => {
  const { csvText, tenantId } = e.data;

  // This runs in a separate thread — zero main thread impact
  const leads = parseAndValidateCsv(csvText);
  const deduplicated = deduplicateLeads(leads);

  self.postMessage({ leads: deduplicated, count: deduplicated.length });
});

// usage in component:
// const worker = new Worker(new URL('./csv-processor.worker.ts', import.meta.url))
// worker.postMessage({ csvText: fileContent, tenantId })
// worker.onmessage = (e) => setLeads(e.data.leads)
```

### Virtualization for Long Lists

```typescript
// widgets/lead-feed/ui/VirtualLeadList.tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function VirtualLeadList({ leads }: { leads: Lead[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,       // Estimated row height in px
    overscan: 5,                  // Render 5 extra rows above/below viewport
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '600px', overflow: 'auto' }}
    >
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <LeadCard lead={leads[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## LCP — Largest Contentful Paint

LCP is typically the **hero image** or the **largest text block** above the fold.
The target is ≤ 2.5s
