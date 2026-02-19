# Research Gaps Analysis

_Last updated:_ 2026-02-19  
_Purpose:_ Identifies gaps between research findings and THEGOAL.md architecture, categorizing by priority and recommending integration strategy.

---

## Summary

Analysis of 25 research topics from perplexity research against `THEGOAL.md` reveals:

- **7 Critical Gaps (P0)** — Security and correctness issues not explicitly covered
- **3 High-Priority Gaps (P1)** — Important infrastructure and compliance items
- **15 Topics Already Covered** — Planned or existing in THEGOAL.md

---

## Critical Gaps (P0)

### 1. Server Action Security & IDOR Mitigation (Topic #1)

**Gap:** Booking actions lack `secureAction` wrapper, tenant-scoped queries, and audit logging.

**Current State:**
- `packages/features/src/booking/lib/booking-actions.ts` exists with basic verification
- Task `0-5-booking-actions-verification.md` addresses verification params
- Missing: unified `secureAction` wrapper pattern, tenant-scoped queries, security audit logging

**Recommendation:**
- Create `tasks/security-1-server-action-hardening.md`
- Implement `packages/infra/security/secure-action.ts` wrapper
- Add tenant-scoped query helpers in `packages/database/src/booking.ts`
- Add security audit logging for all booking mutations

**THEGOAL.md Reference:** Not explicitly covered

---

### 2. Multi-Tenant RLS (Topic #3)

**Gap:** No RLS policies, `tenant_id` coverage, or JWT claims pattern documented.

**Current State:**
- Supabase integration exists
- Multi-tenant architecture mentioned but RLS patterns not detailed
- Missing: RLS policies, `auth.tenant_id()` helper, membership table pattern

**Recommendation:**
- Create `tasks/security-2-rls-multi-tenant.md`
- Document RLS policy patterns in `docs/architecture/security/multi-tenant-rls.md`
- Create SQL migrations for `tenant_id` coverage and RLS policies
- Implement JWT claims pattern for tenant isolation

**THEGOAL.md Reference:** Not explicitly covered

---

### 3. Webhook Security (Topic #7)

**Gap:** No unified verification framework, idempotency, or replay protection.

**Current State:**
- Integration packages exist (`packages/integrations/*`)
- Webhook handlers likely exist but verification inconsistent
- Missing: unified `webhook-security.ts` utility, idempotency tracking, timestamp validation

**Recommendation:**
- Create `tasks/security-3-webhook-security.md`
- Implement `packages/integrations-core/src/webhook-security.ts`
- Add idempotency tracking (Redis or Postgres)
- Standardize signature verification across all integrations

**THEGOAL.md Reference:** Not explicitly covered

---

### 4. Consent Management (Topic #16)

**Gap:** No ScriptManager component or consent-gated script loading.

**Current State:**
- Third-party integrations exist
- Script loading via Next.js `<Script>` likely present
- Missing: consent management integration, ScriptManager component, GDPR/CCPA compliance

**Recommendation:**
- Create `tasks/security-4-consent-management.md`
- Implement `packages/ui/src/components/ScriptManager.tsx`
- Add consent configuration to `site.config.ts`
- Integrate with CMP providers (Termly, CookieScript, or custom)

**THEGOAL.md Reference:** Not explicitly covered

---

### 5. Supply Chain Hardening (Topic #2)

**Gap:** SBOM generation exists but lacks signing/provenance verification.

**Current State:**
- `.github/workflows/sbom-generation.yml` exists (THEGOAL.md [D.8])
- Task `d-8-supply-chain-sbom.md` exists
- Missing: cosign signing, provenance attestation, dependency-review blocking

**Recommendation:**
- Enhance `tasks/d-8-supply-chain-sbom.md` with research findings
- Add cosign signing to CI pipeline
- Add `github/dependency-review-action` as blocking check
- Document SBOM + provenance strategy

**THEGOAL.md Reference:** `.github/workflows/sbom-generation.yml` [D.8]

---

### 6. Security SAST (Topic #2)

**Gap:** SAST exists but threat models from research not integrated.

**Current State:**
- `.github/workflows/security-sast.yml` exists (THEGOAL.md [C.13])
- Task `c-13-security-sast-regression.md` exists
- Missing: threat models for booking flows, business logic abuse patterns

**Recommendation:**
- Enhance `tasks/c-13-security-sast-regression.md` with research threat models
- Add booking-specific threat scenarios
- Document OWASP API Top 10 coverage

**THEGOAL.md Reference:** `.github/workflows/security-sast.yml` [C.13]

---

### 7. Config Versioning (Topic #9)

**Gap:** Config schema exists but no explicit versioning or migration pipeline.

**Current State:**
- `site.config.ts` with Zod validation exists
- Task `d-1-config-schema-versioning.md` planned (THEGOAL.md [D.1])
- Missing: `version` field, migration helpers, versioned schemas

**Recommendation:**
- Enhance `tasks/d-1-config-schema-versioning.md` with research recommendations
- Implement discriminated union pattern for versioned schemas
- Add migration CLI tool

**THEGOAL.md Reference:** `scripts/governance/validate-schema-versioning.ts` [D.1]

---

## High-Priority Gaps (P1)

### 8. Data Residency (Topic #4)

**Gap:** No multi-region deployment strategy or tenant→region mapping.

**Current State:**
- Multi-tenant architecture exists
- No explicit data residency guarantees documented
- Missing: tenant region mapping, multi-region DB strategy, GDPR compliance

**Recommendation:**
- Create `tasks/infrastructure-4-data-residency.md`
- Design tenant region mapping model
- Document multi-region deployment strategy
- Add GDPR compliance documentation

**THEGOAL.md Reference:** Not explicitly covered

---

### 9. Form Spam Prevention (Topic #6)

**Gap:** Rate limiting exists but no honeypot, Turnstile, or timing validation.

**Current State:**
- Rate limiting likely present
- Form components exist
- Missing: honeypot fields, Cloudflare Turnstile integration, timing validation

**Recommendation:**
- Create `tasks/security-5-form-spam-prevention.md`
- Implement honeypot utility in `@repo/ui` or `@repo/forms`
- Add Turnstile integration
- Add timing validation for form submissions

**THEGOAL.md Reference:** Not explicitly covered

---

### 10. Integration Error Handling (Topic #22)

**Gap:** No retry/circuit breaker pattern for integrations.

**Current State:**
- Integration packages exist (`packages/integrations/*`)
- Missing: standardized retry logic, circuit breaker pattern, DLQ

**Recommendation:**
- Create `tasks/infrastructure-3-integration-resilience.md`
- Implement `packages/integrations-core/src/client.ts` with retry/circuit breaker
- Add exponential backoff and error handling
- Document integration resilience patterns

**THEGOAL.md Reference:** Not explicitly covered

---

## Infrastructure Gaps (P1)

### 11. Observability & OpenTelemetry (Topic #20)

**Gap:** No OpenTelemetry integration or distributed tracing.

**Current State:**
- Sentry integration exists
- Logging present but not standardized
- Missing: OpenTelemetry instrumentation, distributed tracing, tenant-aware correlation IDs

**Recommendation:**
- Create `tasks/infrastructure-1-observability-opentelemetry.md`
- Add `instrumentation.ts` with `@vercel/otel`
- Integrate with Sentry (skipOpenTelemetrySetup: true)
- Add tenant-aware spans and logs

**THEGOAL.md Reference:** Not explicitly covered

---

### 12. E2E Testing (Topic #21)

**Gap:** No systematic multi-tenant E2E strategy.

**Current State:**
- Unit tests exist (~646 tests)
- E2E tests minimal or scaffolded
- Missing: Playwright harness, multi-tenant test strategy, visual regression

**Recommendation:**
- Create `tasks/infrastructure-2-e2e-testing.md`
- Set up Playwright test harness
- Create multi-tenant test fixtures
- Add visual regression testing

**THEGOAL.md Reference:** Not explicitly covered

---

## Already Covered Topics

| Topic # | Topic | THEGOAL.md Reference | Status |
|---------|-------|---------------------|--------|
| #2 | Supply Chain Security | `.github/workflows/sbom-generation.yml` [D.8] | Planned |
| #2 | Security SAST | `.github/workflows/security-sast.yml` [C.13] | Planned |
| #5 | Accessibility | `docs/accessibility/component-a11y-rubric.md` [D.6] | Planned |
| #9 | Config Versioning | `scripts/governance/validate-schema-versioning.ts` [D.1] | Planned |
| #10 | Client Scaffolding | `turbo/generators/config.ts` [5.1] | Planned |
| #11 | Module Boundaries | `scripts/architecture/check-dependency-graph.ts` [C.1] | Planned |
| #25 | AI Platform | `packages/ai-platform/` [7.1-7.3] | Future Phase 7 |

---

## Integration Strategy

### New Tasks to Create

1. **`security-1-server-action-hardening.md`** — P0, Medium effort
2. **`security-2-rls-multi-tenant.md`** — P0, Large effort
3. **`security-3-webhook-security.md`** — P0, Medium effort
4. **`security-4-consent-management.md`** — P0, Medium effort
5. **`infrastructure-1-observability-opentelemetry.md`** — P1, Medium effort
6. **`infrastructure-2-e2e-testing.md`** — P0, Large effort
7. **`infrastructure-3-integration-resilience.md`** — P1, Medium effort
8. **`infrastructure-4-data-residency.md`** — P1, Extra Large effort
9. **`security-5-form-spam-prevention.md`** — P1, Medium effort

### Existing Tasks to Enhance

1. **`d-8-supply-chain-sbom.md`** — Add cosign signing, provenance
2. **`c-13-security-sast-regression.md`** — Add threat models
3. **`d-1-config-schema-versioning.md`** — Add migration patterns
4. **`c-1-module-boundary-enforcement.md`** — Enhance with research details

---

## Priority Matrix

| Priority | Count | Topics |
|----------|-------|--------|
| P0 (Critical) | 7 | Server Actions, RLS, Webhooks, Consent, Supply Chain, SAST, Config Versioning |
| P1 (High) | 5 | Data Residency, Form Spam, Integration Resilience, Observability, E2E Testing |
| P2 (Medium) | 13 | Performance, i18n, Tailwind v4, Design System Governance, etc. |

---

## Next Steps

1. ✅ Create RESEARCH-INTEGRATION.md (master index)
2. ✅ Create RESEARCH-GAPS.md (this file)
3. 🔄 Create new security task files (security-1 through security-4)
4. 🔄 Create new infrastructure task files (infrastructure-1 through infrastructure-3)
5. 🔄 Update RESEARCH-INVENTORY.md with new topics
6. 🔄 Update TASKS.md with new tasks
7. 🔄 Enhance existing tasks with research findings

---

## References

- **Research Files:** `docs/research/perplexity-*.md`
- **Master Index:** `docs/research/RESEARCH-INTEGRATION.md`
- **Architecture:** `THEGOAL.md`
- **Task Inventory:** `tasks/RESEARCH-INVENTORY.md`
