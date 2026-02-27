---
doc_id: "INFRA-2026-PACKAGE-README"
doc_version: "2.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "infra-team@marketing-websites.com"

# Bimodal Classification
ai_readiness_score: 0.89
human_ttv_seconds: 18
bimodal_grade: "A"

# Technical Context
type: package
language: typescript
framework: node
runtime: node-22
complexity: infrastructure

# Compliance & Governance
compliance_frameworks:
- "SOC2-Type-II"
- "GDPR-Article-32"
- "ISO-27001"
- "EU-AI-Act-High-Risk"
risk_classification: "medium-risk"
data_governance: "PII-Encrypted"

# AI Retrieval Optimization
rag_optimization:
  chunk_strategy: "recursive-headers"
  chunk_size: 800
  chunk_overlap: 120
  late_chunking: true
  embedding_model: "text-embedding-3-large"
  hybrid_search: true

# Executable Documentation
executable_status: true
ci_validation: true
last_executed: "2026-02-27T13:45:00Z"

# Maintenance & Quality
maintenance_mode: "active"
stale_threshold_days: 90
audit_trail: "github-actions"
---

# @repo/infra

Shared infrastructure for security, middleware, logging, and request context used by templates (e.g. hair-salon, plumber) in the marketing monorepo.

## Middleware

The package exports a **middleware factory** for Next.js that applies:

- **CSP**: Nonce-based Content-Security-Policy (with `strict-dynamic` in production).
- **Security headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and related headers.
- **CVE-2025-29927 mitigation**: The `x-middleware-subrequest` header is stripped from every request so clients cannot spoof it to bypass middleware.
- **Optional CSRF allowlist**: When `allowedOrigins` is set, requests that send an `Origin` header are allowed only if that origin is in the list; otherwise the middleware returns 403.

### Usage

In your template’s `middleware.ts`:

```ts
import { createMiddleware } from '@repo/infra';

export const middleware = createMiddleware({
  // optional:
  // allowedOrigins: ['https://example.com'],
  // cspReportEndpoint: 'https://csp-report.example.com',
});

export const config = {
  matcher: [
    /* your matcher */
  ],
};
```

Templates must define and export `config.matcher` themselves; the factory only returns the middleware function.

### Options

- **`allowedOrigins?: string[]`** — If set, requests with an `Origin` header are allowed only when the origin (scheme + host) is in this list.
- **`cspReportEndpoint?: string`** — Optional CSP violation report endpoint (report-uri / report-to).
- **`enableStrictDynamic?: boolean`** — Override strict-dynamic in CSP (default: true in production, false in development).

## Other exports

- **Security**: CSP (`createCspNonce`, `buildContentSecurityPolicy`), security headers (`getSecurityHeaders`), sanitize, rate-limit (including `checkRateLimit`), request-validation.
- **Logger**: Server logger in `@repo/infra` (`logInfo`, `logWarn`, `logError`, `sanitizeLogContext`). Production logs JSON (Vercel Log Drain compatible). Client-safe `logError`/`logInfo` in `@repo/infra/client` for client components (e.g. Error Boundary, analytics).
- **Request context**: Stub in `@repo/infra`; server implementation in `@repo/infra/context/request-context.server` (`runWithRequestId`, `getRequestId`). Use the server module in Server Actions so request ID appears in logs.
- **Sentry**: Server helpers (`withServerSpan`, `sanitizeSentryEvent`) from `@repo/infra`; client helpers (`setSentryUser`, `setSentryContext`, `withSentrySpan`) from `@repo/infra/client`.

### Client vs server

- **`@repo/infra`** (main entry): Use in server code only (Server Actions, API routes, middleware, RSC). Exports logger, context stub, Sentry server, and all security modules.
- **`@repo/infra/client`**: Use in client components. Exports Sentry client helpers and client-safe `logError`/`logInfo` only.

## Verification

- From repo root: `pnpm build` (both templates), `pnpm test`.
- Middleware tests: `packages/infra/__tests__/create-middleware.test.ts`.
- Logger tests: `packages/infra/__tests__/logger.test.ts` (JSON format in production).
