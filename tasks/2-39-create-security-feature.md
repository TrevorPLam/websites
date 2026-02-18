# 2.39 Create Security Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, C.13

**Related Research:** §5.1 (Spec-driven), §C.13 (Security), CSP, rate limiting

**Objective:** Security feature with 5+ implementation patterns, CSP, and rate limiting.

**Implementation Patterns:** Config-Based, CSP-Based, Rate-Limiting-Based, WAF-Based, Hybrid (5+ total)

**Files:** `packages/features/src/security/` (index, lib/schema, lib/adapters, lib/security-config.ts, lib/csp.ts, lib/rate-limiting.ts, components/SecuritySection.tsx, components/SecurityConfig.tsx, components/SecurityCSP.tsx, components/SecurityRateLimit.tsx, components/SecurityWAF.tsx, components/SecurityHybrid.tsx)

**API:** `SecuritySection`, `securitySchema`, `createSecurityConfig`, `enforceCSP`, `rateLimit`, `SecurityConfig`, `SecurityCSP`, `SecurityRateLimit`, `SecurityWAF`, `SecurityHybrid`

**Checklist:** Schema; adapters; CSP; rate limiting; WAF; implementation patterns; export.
**Done:** Builds; all patterns work; CSP functional; rate limiting works.
**Anti:** No custom security engine; standard practices only.

---
