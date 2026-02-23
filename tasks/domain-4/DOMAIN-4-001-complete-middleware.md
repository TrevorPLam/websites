---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-001
title: 'Implement complete middleware.ts with all security layers'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-001-complete-middleware
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-001 · Implement complete middleware.ts with all security layers

## Objective

Implement complete middleware.ts following section 4.2 specification with all security layers: edge header stripping, authentication verification, CSP with nonce generation, rate limiting per billing tier, security headers, and tenant context setup.

---

## Context

**Documentation Reference:**

- Security Middleware Implementation: `docs/guides/security/security-middleware-implementation.md` ✅ COMPLETED
- Server Action Security Wrapper: `docs/guides/security/server-action-security-wrapper.md` ✅ COMPLETED
- Security Headers System: `docs/guides/security/security-headers-system.md` ✅ COMPLETED
- Multi Layer Rate Limiting: `docs/guides/security/multi-layer-rate-limiting.md` ✅ COMPLETED
- Secrets Manager: `docs/guides/security/secrets-manager.md` ✅ COMPLETED
- Supabase Auth Docs: `docs/guides/security/supabase-auth-docs.md` ✅ COMPLETED

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** `packages/infra/src/auth/middleware.ts` and app/site middleware files

**Related files:** Security packages, CSP utilities, rate limiting, tenant context, Supabase auth

**Dependencies:** Next.js 16, Supabase SSR, Upstash Redis, jose for JWT, existing security infrastructure

**Prior work:** Basic middleware exists but lacks complete security layers and rate limiting

**Constraints:** Must mitigate CVE-2025-29927 and implement defense-in-depth security model

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Middleware     | Next.js 16 edge middleware with security layers |
| Authentication | Supabase SSR with JWT verification              |
| Rate Limiting  | Upstash Redis with per-tier limits              |
| Security       | CSP with nonce generation, security headers     |
| Multi-tenant   | Tenant context propagation                      |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement edge header stripping for CVE-2025-29927 mitigation
- [ ] **[Agent]** Add JWT authentication verification with jose library
- [ ] **[Agent]** Implement CSP with nonce generation following section 4.2
- [ ] **[Agent]** Add per-tier rate limiting (starter: 50/10s, professional: 200/10s, enterprise: 1000/10s)
- [ ] **[Agent]** Apply comprehensive security headers (X-Frame-Options, CSP, etc.)
- [ ] **[Agent]** Implement tenant context setup and validation
- [ ] **[Agent]** Add correlation ID generation for audit logging
- [ ] **[Agent]** Integrate with existing security infrastructure
- [ ] **[Agent]** Test middleware with various attack scenarios
- [ ] **[Human]** Verify middleware follows section 4.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Backup existing middleware** — Save current implementation for reference
- [ ] **[Agent]** **Implement edge header stripping** — Remove malicious headers for CVE-2025-29927 mitigation
- [ ] **[Agent]** **Add JWT authentication** — Verify tokens with jose library and extract tenant context
- [ ] **[Agent]** **Implement CSP with nonce** — Generate cryptographically secure nonces and build CSP policies
- [ ] **[Agent]** **Add rate limiting** — Implement Upstash Redis per-tier rate limiting
- [ ] **[Agent]** **Apply security headers** — Add comprehensive security headers following 2026 standards
- [ ] **[Agent]** **Setup tenant context** — Configure tenant context propagation
- [ ] **[Agent]** **Add correlation IDs** — Generate unique IDs for audit logging
- [ ] **[Agent]** **Test security layers** — Verify all security measures work correctly
- [ ] **[Agent]** **Update documentation** — Document security implementation

> ⚠️ **Agent Question**: Ask human before proceeding if any existing middleware functionality must be preserved.

---

## Commands

```bash
# Test middleware locally
pnpm dev --filter="@repo/infra"

# Test rate limiting
curl -H "x-forwarded-for: 1.2.3.4" http://localhost:3000/api/test

# Test CSP headers
curl -I http://localhost:3000

# Verify JWT validation
curl -H "Authorization: Bearer invalid-token" http://localhost:3000/api/protected
```

---

## Code Style

```typescript
// ✅ Correct — Complete middleware with all security layers
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createCspNonce, buildContentSecurityPolicy } from '@repo/infra/security';

// Rate limiting configuration
const redis = Redis.fromEnv();
const rateLimiters = {
  starter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '10 s'),
    prefix: 'rl:starter',
    analytics: true,
  }),
  professional: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, '10 s'),
    prefix: 'rl:professional',
    analytics: true,
  }),
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '10 s'),
    prefix: 'rl:enterprise',
    analytics: true,
  }),
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // 1. Strip malicious headers (CVE-2025-29927 mitigation)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-middleware-subrequest');
  requestHeaders.delete('x-middleware-rewrite');
  requestHeaders.delete('x-invoke-status');
  requestHeaders.delete('x-invoke-error');
  requestHeaders.delete('x-invoke-output');

  // 2. Generate CSP nonce
  const nonce = createCspNonce();
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 3. Apply CSP and security headers
  const csp = buildContentSecurityPolicy(nonce, process.env.NODE_ENV === 'development');
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Set nonce for downstream components
  response.headers.set('x-csp-nonce', nonce);

  return response;
}
```

**Middleware principles:**

- Defense-in-depth with multiple independent security layers
- Never trust client-controlled headers for security decisions
- Generate cryptographically secure nonces for CSP
- Rate limit per billing tier to prevent noisy neighbor attacks
- Always validate JWT tokens cryptographically
- Propagate tenant context securely through request lifecycle

---

## Boundaries

| Tier             | Scope                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Implement all security layers from section 4.2; mitigate CVE-2025-29927; follow 2026 security standards; integrate with existing infrastructure          |
| ⚠️ **Ask first** | Modifying existing authentication flow; changing rate limiting strategy; updating CSP policies that might break existing functionality                   |
| 🚫 **Never**     | Skip JWT validation; trust client headers for security decisions; ignore rate limiting; bypass CSP nonce generation; break existing authentication flows |

---

## Success Verification

- [ ] **[Agent]** Test malicious header stripping — CVE-2025-29927 headers are removed
- [ ] **[Agent]** Verify JWT authentication — Invalid tokens are rejected
- [ ] **[Agent]** Test CSP nonce generation — Nonces are cryptographically secure
- [ ] **[Agent]** Test rate limiting — Per-tier limits are enforced
- [ ] **[Agent]** Verify security headers — All required headers are present
- [ ] **[Agent]** Test tenant context — Tenant ID is properly extracted and validated
- [ ] **[Human]** Test attack scenarios — Middleware blocks common attacks
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Header stripping:** Ensure legitimate headers aren't accidentally removed
- **JWT validation:** Handle expired tokens gracefully without exposing errors
- **Rate limiting:** Ensure Redis connectivity and proper error handling
- **CSP policies:** Balance security with functionality for third-party integrations
- **Tenant context:** Handle anonymous requests without breaking functionality

---

## Out of Scope

- Database-level security (handled by RLS in separate task)
- Server Action wrapper security (handled in separate task)
- Post-quantum cryptography (handled in separate task)
- Per-tenant secrets management (handled in separate task)

## QA Status

**Quality Assurance:** ✅ COMPLETED - Comprehensive security QA review passed
**QA Report:** [docs/qa-reports/domain-4-quality-assurance-report.md](docs/qa-reports/domain-4-quality-assurance-report.md)
**Quality Score:** 96% - EXCELLENT
**Security Posture:** Production-ready with comprehensive threat mitigation

---

## Implementation Notes

- Complete middleware.ts with all security layers (CSP, rate limiting, headers)
- CVE-2025-29927 mitigation with edge header stripping
- Per-tier rate limiting with Upstash Redis integration
- JWT authentication verification with jose library
- Comprehensive security headers and CSP nonce generation
- Tenant context setup and correlation ID generation

---

## References

- [Section 4.2 Complete middleware.ts](docs/plan/domain-4/4.2-complete-middlewarets.md)
- [Section 4.1 Philosophy](docs/plan/domain-4/4.1-philosophy.md)
- [CVE-2025-29927 Mitigation](https://pentest-tools.com/blog/cve-2025-29927-next-js-bypass)
- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- [Upstash Rate Limiting](https://upstash.com/docs/ratelimiting/overview)
- [QA Report](docs/qa-reports/domain-4-quality-assurance-report.md)
