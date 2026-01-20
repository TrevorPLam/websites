# lib/AGENTS.md — Shared Utilities

Last Updated: 2026-01-06
Applies To: Any agent working in lib/

## Purpose
This folder contains all shared utility modules for the application. Many modules are **security-critical** and handle user input, secrets, or error reporting.

---

## Security-Critical Modules (Review Carefully)

| Module | Purpose | Key Security Features |
|--------|---------|----------------------|
| `actions.ts` | Server actions for contact form | Rate limiting, input sanitization, IP hashing |
| `sanitize.ts` | XSS and injection prevention | HTML escaping, email header sanitization |
| `env.ts` | Environment variable validation | Zod schemas, fail-fast on missing secrets |
| `sentry-sanitize.ts` | PII filtering for error reports | Redacts sensitive fields before Sentry |
| `logger.ts` | Centralized logging with Sentry | Sanitizes context, redacts sensitive keys |

**Non-Negotiable Rules:**
- ALL user input MUST pass through `sanitize.ts` functions before use
- NEVER log raw user input or IP addresses
- Errors MUST go through `logger.ts` (not raw console.error)

---

## Data Modules

| Module | Purpose | Data Source |
|--------|---------|-------------|
| `blog.ts` | Blog post parsing | MDX files in `content/blog/` |
| `search.ts` | Search index generation | Static pages + blog posts |

**Pattern:** All data is loaded at build time (SSG). No runtime data fetching.

---

## Utility Modules

| Module | Purpose |
|--------|---------|
| `utils.ts` | Generic utilities (cn for classnames) |
| `analytics.ts` | Analytics event tracking abstraction |
| `contact-form-schema.ts` | Zod schema for contact form validation |
| `sentry-client.ts` | Client-side Sentry helpers |
| `request-context.ts` | Request-scoped correlation ID storage |

---

## Conventions

1. **Server-only by default**: Do NOT add `'use client'` unless absolutely required
2. **Type exports**: Export TypeScript interfaces for consumers
3. **No side effects**: Modules should be pure (no auto-executing code)
4. **Error handling**: Use `logError()` from logger.ts, never raw throws

---

## Adding a New Module

1. Determine if it's security-critical (handles user input, secrets, or PII)
2. If security-critical: Add JSDoc with security notes (see `actions.ts` as template)
3. If data module: Document the data source and update pattern
4. Export types alongside functions
5. Update this AGENTS.md with the new module

---

## Module Dependencies (Import Graph)

```
actions.ts
├── logger.ts
├── sanitize.ts
├── env.ts
└── contact-form-schema.ts

blog.ts
└── (external: gray-matter, reading-time)

search.ts
└── blog.ts

logger.ts
├── env.ts
└── (external: @sentry/nextjs)
```

---

## Testing

Tests live in `__tests__/lib/`. Each module should have corresponding tests:
- `actions.rate-limit.test.ts` - Rate limiting tests
- `sanitize.test.ts` - XSS prevention tests
- `env.test.ts` - Environment validation tests
