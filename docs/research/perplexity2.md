Below assumes the repository layout and details provided in your prompt (e.g., `booking-actions.ts`, `site.config.ts`, `.github/workflows/ci.yml`, `@repo/ui`, `@repo/ai-platform`, `@repo/industry-schemas`, and the docs paths). The actual files cannot be inspected directly here, so paths beyond those you named are illustrative; adapt them to the real repo structure during implementation.

---

## Topic #1: Server Action Security & IDOR Mitigation

### Current State Analysis

- **Files:**
  - `apps/*/app/actions/booking-actions.ts` (e.g., `confirmBooking`, `cancelBooking`, `getBookingDetails`)
  - Auth/session utilities (likely `packages/auth/src/*` or `apps/*/lib/auth.ts`)
  - Supabase data access layer (e.g., `packages/database/src/booking.ts`)
- **Status:** Partial — actions exist and work functionally but ignore ownership/tenant checks.
- **Gaps:**
  - IDOR: Actions trust `bookingId` from the client without verifying tenant ownership or user’s relationship to the booking (e.g., no `tenant_id` / `user_id` binding).[1]
  - No explicit auth/authorization in actions themselves (likely checked only at page level, which is insufficient because actions are separate HTTP endpoints).[1]
  - Weak runtime validation (relying on TypeScript types vs runtime validation with Zod).
  - Minimal security logging around sensitive state changes.
- **Risk:** **Critical**
  - Attackers can enumerate booking IDs and read/modify/cancel other tenants’ bookings if RLS and ownership checks are missing or misconfigured. This is explicitly called out as CRITICAL in `docs/archive/ISSUES.md`.

### 2026 Best Practice Standards

- **Standards:**
  - Every Server Action handling sensitive data must enforce:
    - Input validation (Zod/valibot)
    - Authentication (session or access token)
    - Authorization (ownership / role / tenant checks)
    - Rate limiting and idempotency for side-effectful actions.[2][1]
  - Next.js Server Actions security guidance (origin checks, encrypted action IDs, same-origin CSRF protections).[3][4]
- **Tools:**
  - `zod` schemas for all action payloads.
  - A shared `secureAction` wrapper (or `next-safe-action`-style pattern) to enforce auth + logging.[2][1]
  - Supabase RLS policies for bookings so DB refuses cross-tenant access even if app code is buggy.[5][6]
- **Compliance:**
  - OWASP A01: Broken Access Control & A02: Cryptographic Failures (IDOR is explicitly in A01).
  - For regulated verticals (healthcare/finance), ownership checks + audit logs become compliance requirements, not “nice to have”.

### Implementation Recommendations

- **Code Changes:**
  - Refactor `booking-actions.ts`:
    - Move each action into its own file under a `server/` or `actions/` folder and mark `'use server'`.
    - Introduce a shared wrapper, e.g. `packages/security/src/secureAction.ts`:
      - Runs `auth()` to get `session`.
      - Requires `session.user.id` & `session.user.tenantId`.
      - Validates payload with Zod.
      - Passes a typed `ctx` (`{ userId, tenantId, roles }`) into the handler.
    - In `confirmBooking` / `cancelBooking` / `getBookingDetails`:
      - Look up booking by `id` **and** `tenant_id` (and optionally `customer_id` if end-user context) via Supabase/RLS-bound client.
      - Throw/return standardized `Forbidden` result when tenant or user does not own the booking.
  - Centralize booking DB access:
    - `packages/database/src/booking.ts`: functions like `getBookingForTenant({bookingId, tenantId})` and `updateBookingStatus({bookingId, tenantId, ...})` so every access path includes tenant binding.
- **New Dependencies:**
  - If not present, add `zod` or standardize on it across server actions.
  - Optionally `next-safe-action` or equivalent pattern library.[2]
- **Configuration:**
  - Ensure auth token (JWT) or session stores `tenant_id` and user id; map them into Supabase claims to support RLS (see Topic #3).
  - Add an `SECURITY_LOG_LEVEL` env to control verbosity of audit logs.
- **Migration:**
  - Step 1: Implement secure wrapper and update bookings actions only.
  - Step 2: Add regression tests for bookings actions.
  - Step 3: Incrementally migrate other sensitive actions (payments, account settings) onto the wrapper, gating each migration on green tests.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                                |
| -------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| P0       | M      | 3, 20, 21    | Add server-action unit tests to CI; lint rule requiring secure wrapper for `app/actions/**`; block merge if violations found |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests for `confirmBooking`, `cancelBooking`, `getBookingDetails`:
    - Ensure they fail when `session` is missing.
    - Ensure they fail when booking’s `tenant_id` does not match session’s `tenantId`.
    - Ensure they fail when `bookingId` is unknown.
  - E2E tests (Playwright/Cypress) to:
    - Log in as Tenant A, create booking.
    - Attempt CRUD using Tenant B session or direct POST with Tenant A `bookingId` → expect 403.[7]
- **Monitoring:**
  - Add structured logs (with correlation IDs and `tenantId`) for all booking mutations.
  - Add security alerts when:
    - Multiple forbidden attempts on bookings from same IP / user.
    - Unusual spike in booking lookups by ID pattern (potential enumeration).
- **Success Metrics:**
  - Zero successful cross-tenant booking access in logs.
  - 100% of sensitive actions using the secure wrapper pattern.
  - No IDOR findings in periodic penetration tests.

### Documentation Updates

- **Files:**
  - `docs/architecture/security/server-actions.md` — document secure action pattern and examples.
  - Update `docs/architecture/module-boundaries.md` to clarify that all DB writes go through RLS-safe repositories.
- **ADRs:**
  - `docs/architecture/adrs/ADR-00X-secure-server-actions.md` describing the wrapper approach and RLS coupling.
- **Runbooks:**
  - `docs/operations/runbooks/booking-security-incident.md`:
    - Steps to trace, contain, and remediate suspected IDOR attempts.
    - Query templates for Supabase logs.

---

## Topic #2: CI/CD Pipeline Supply Chain Security

### Current State Analysis

- **Files:** `.github/workflows/ci.yml`, `pnpm-workspace.yaml`, package `package.json` files.
- **Status:** Partial — SBOM generation exists, but:
  - No signature/provenance verification.
  - Likely no gated dependency review on PRs.
  - No secret scanning or SAST integrated as hard gates.
- **Gaps:**
  - SBOMs not signed/attested; consumers cannot verify integrity.[8][9]
  - PRs may introduce vulnerable or untrusted deps without automated blocking.[10][11]
  - pnpm workspace may allow “shadow” dependencies not visible in central scanning.
- **Risk:** **High**
  - Complex JS supply chain + multi-tenant SaaS + many integrations → high blast radius from a compromised dependency.

### 2026 Best Practice Standards

- **Standards:**
  - OWASP Software Supply Chain & 2025 OWASP Top 10 supply chain items (SCA + SBOM + code signing).
  - SLSA provenance for build artifacts where possible.[12][9]
- **Tools:**
  - SBOM: Syft or similar for Node workspaces, output SPDX or CycloneDX.[13]
  - Signing: Sigstore/cosign for container images & SBOM attestations.[12][8]
  - GitHub-native:
    - Dependency Graph & Dependabot alerts.
    - Dependency Review Action.
    - CodeQL SAST.
    - Secret scanning.[11][10]
  - Optionally `github-sbom-toolkit` for org-wide SBOM aggregation.[14]
- **Compliance:**
  - Many enterprise RFPs and regulations now expect SBOM + provenance as table stakes.[9]

### Implementation Recommendations

- **Code Changes:**
  - Extend `.github/workflows/ci.yml`:
    - Add jobs:
      - `dependency-review` using `github/dependency-review-action`.
      - `npm/pnpm audit` (or `trivy`/`grype`) to fail on High/Critical vulns above a threshold.[15]
      - SBOM generation with Syft for key apps/packages; store artifacts.
      - Cosign attestation signing for images/SBOM if you build containers.[8]
    - Upload SBOM SARIF to GitHub code scanning for unified view.[16]
  - Normalize `pnpm-lock.yaml` as the single source of dependency truth.
- **New Dependencies:**
  - `anchore/syft` (via Docker or GH Action).[13]
  - `cosign` in CI images.[8]
  - Optionally `github-sbom-toolkit` for later org-wide usage.[14]
- **Configuration:**
  - Enforce branch protection:
    - Require status checks: lint, tests, dependency-review, security scan.
    - Require signed commits for protected branches.
- **Migration:**
  - Phase 1: Add scanning as non-blocking (warnings only).
  - Phase 2 (after noise tuning): switch to blocking for High/Critical vulns and unsigned SBOMs.
  - Phase 3: Extend checks to all packages in monorepo.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                       |
| -------- | ------ | ------------ | ----------------------------------------------------------------------------------- |
| P0       | M      | 8, 11        | Add dependency-review, SBOM, SAST, secret scanning jobs; enforce as required checks |
| P1       | L      | —            | Integrate cosign signing & verification into release pipeline                       |

### Validation & Testing Strategy

- **Tests:**
  - Add a “canary” vulnerable dependency in a feature branch and ensure CI blocks the PR.
  - Add unsigned artifact in release workflow and ensure verify step fails.
- **Monitoring:**
  - Review GitHub Security tab regularly.
  - Set alerts for new Dependabot advisories on critical packages (Next.js, React, Supabase client, auth libs).
- **Success Metrics:**
  - 100% of releases with attached, signed SBOMs.
  - All PRs changing dependencies go through automated dependency-review.
  - Time-to-remediate critical dependency vulnerabilities within SLA (e.g., <7 days).

### Documentation Updates

- **Files:**
  - `docs/operations/ci-cd-pipeline.md` — new “Security Gates” section.
- **ADRs:**
  - `ADR-00X-supply-chain-hardening.md` documenting SBOM + signing + dependency-review choices.
- **Runbooks:**
  - `docs/operations/runbooks/dependency-vuln-response.md` (how to triage and patch).

---

## Topic #3: Multi-Tenant Data Isolation (Supabase RLS)

### Current State Analysis

- **Files:** Supabase SQL migrations (`supabase/migrations/*`), DB access in `packages/database/**`.
- **Status:** Partial — shared DB instance across clients; RLS may exist for user-level but not systematically for tenant-level.
- **Gaps:**
  - Incomplete `tenant_id` coverage across tables.
  - RLS policies may rely on `auth.uid()` only, not `tenant_id` claims.[6][5]
  - No membership/organization pattern; difficult to support users in multiple tenants safely.[17][6]
- **Risk:** **Critical**
  - Any RLS misconfig leads directly to cross-tenant data exposure.

### 2026 Best Practice Standards

- **Standards:**
  - Multi-tenant RLS:
    - Every tenant-scoped table has a `tenant_id` (or `org_id`).[17][6]
    - RLS enabled on all such tables.
    - Policies match `tenant_id` from JWT or secure session setting.[18][5]
- **Tools:**
  - Supabase Auth custom JWT claims (e.g., `app_metadata.tenant_id`).[5]
  - Helper function `auth.tenant_id()` encapsulating JWT parsing.[6][5]
  - Membership table pattern for orgs + roles.[17][6]
- **Compliance:**
  - Data isolation is a basic expectation under GDPR/CCPA for multi-tenant SaaS; breaches here can trigger mandatory disclosures and fines.

### Implementation Recommendations

- **Code / SQL Changes:**
  - Schema:
    - Ensure all tenant data tables (bookings, sites, leads, webhooks, AI usage, etc.) have `tenant_id` (UUID) + index.
  - RLS:
    - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
    - Create policies using membership pattern, e.g.:[6][17]

      ```sql
      CREATE FUNCTION auth.tenant_id() RETURNS uuid AS $$
      BEGIN
        RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
      END;
      $$ LANGUAGE plpgsql STABLE;

      CREATE POLICY "tenant_isolation_select"
      ON bookings
      FOR SELECT USING (tenant_id = auth.tenant_id());

      CREATE POLICY "tenant_isolation_mutation"
      ON bookings
      FOR ALL
      USING (tenant_id = auth.tenant_id())
      WITH CHECK (tenant_id = auth.tenant_id());
      ```

  - For multi-org users, introduce `org_members` table and adjust policies as in membership examples.[17][6]

- **New Dependencies:**
  - None beyond Supabase; rely on migrations & SQL functions.
- **Configuration:**
  - Auth pipeline must populate `tenant_id` into JWT `app_metadata`.
  - App code must **never** pass raw `tenant_id` from client; derive from session.
- **Migration:**
  - Backfill `tenant_id` for existing rows:
    - Use existing site/client mapping to set correct `tenant_id`.
  - Deploy RLS in “shadow” mode:
    - Start with read policies only, validate queries.
    - Then enforce writes with `WITH CHECK`.
  - Monitor for policy errors and fix missing `tenant_id`.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                        |
| -------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| P0       | L      | 1, 14, 25    | Add DB migration tests; add RLS policy checks to CI (e.g., SQL lints ensuring `tenant_id` & RLS on sensitive tables) |

### Validation & Testing Strategy

- **Tests:**
  - DB tests:
    - Attempt cross-tenant read/write via service role vs anon/user role; expect RLS failures for user role.
  - E2E:
    - Seed multiple tenants and ensure tenant A never sees B’s data even via crafted requests.
- **Monitoring:**
  - Supabase logs for RLS policy violations.
  - Alerts on unexpected 401/403 spikes (may indicate overly strict RLS after deploy).
- **Success Metrics:**
  - 100% of tenant-data tables with RLS + `tenant_id`.
  - No cross-tenant data found in automated security scans.

### Documentation Updates

- **Files:**
  - `docs/architecture/multi-tenancy.md` — describe RLS patterns and tenant_id lifecycle.
- **ADRs:**
  - `ADR-00X-tenant-isolation-rls.md` summarizing chosen approach (per-row `tenant_id` + JWT).
- **Runbooks:**
  - `runbooks/rls-policy-regression.md` for incidents where policies block valid operations.

---

## Topic #4: Data Residency & Global Privacy Regulations (2026)

### Current State Analysis

- **Files:** Likely `docs/architecture/data-governance.md`, env configuration for Supabase/infra, but not explicitly defined.
- **Status:** Scaffolded — multi-region clients exist, but no explicit residency guarantees.
- **Gaps:**
  - No mapping from tenant → data region (e.g., EU vs US).
  - Single Supabase project region tends to violate data-locality expectations for some verticals.
- **Risk:** **High**
  - GDPR: Cross-border transfers to US require SCCs + transfer impact assessments.[19][20]
  - Some verticals (healthcare, financial) + jurisdictions (e.g., some EU member state health rules) expect stricter residency.[20][21][19]

### 2026 Best Practice Standards

- **Standards:**
  - GDPR Articles 44–50 (data transfers), Schrems II consequences: strong scrutiny on EU→US transfers.[19][20]
  - National/local residency laws for specific sectors (e.g., public sector, healthcare).
  - CNIL-style and DPA guidance increasingly pushing EU-hosted + EU-controlled providers.[21]
- **Tools:**
  - Multi-region DBs (e.g., CockroachDB multi-region, Supabase per-region projects).[22][23][24]
  - Cloudflare Data Localization Suite / Regional Services for edge-level residency.[25][26][27]
  - Vercel Regions for function execution pinned to EU for EU tenants.[28][29][30]
- **Compliance:**
  - Detailed Records of Processing Activities (RoPA) including region & legal basis for transfers.[20][19]
  - DPA-ready documentation for data flows, subprocessors, and encryption.

### Implementation Recommendations

- **Code / Architecture Changes:**
  - Introduce a `TenantRegion` model:
    - `tenant_settings` table specifying `data_region` (`eu`, `us`, etc.).
  - Separate DB instances per region (start with `eu` and `us`):
    - For EU tenants, use EU-hosted Supabase/DB.
  - Route traffic based on tenant region:
    - At auth time, look up tenant’s region.
    - Use region-specific DB client in server actions (abstracted in `@repo/data`).
- **Infra Configuration:**
  - Vercel:
    - Set default function region to `fra1` or `dub1` for EU-only projects; use `regions` config keyed off subdomain/path for EU tenants where possible.[29][30][28]
  - Cloudflare (if used as CDN/WAF):
    - Enable Regional Services for EU tenant hostnames to keep HTTPS inspection and caching in-region.[26][27][25]
- **Consent & Rights Automation:**
  - Implement centralized consent management (see Topic #16).
  - Add scripts/routines for:
    - “Right to be forgotten” deletion workflows per tenant/region.
    - Data export per user.
- **Migration:**
  - Step 1: Build EU-only path for new tenants.
  - Step 2: Allow existing EU tenants to opt-in to migration; data copy with cutover and signed DPA amendments.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                       |
| -------- | ------ | ------------ | ----------------------------------- | -------------------------------------------------------------------------------------- |
| P1       | L      | 3, 14, 25    | Add env matrix in CI for `REGION=eu | us`to ensure code works per-region; config validation for`tenant_settings.data_region` |

### Validation & Testing Strategy

- **Tests:**
  - Integration tests asserting:
    - EU-flagged tenants use EU DB URL and EU Vercel function region.
  - Privacy tests:
    - Automated script verifying that deletion requests remove all PII for a test user.
- **Monitoring:**
  - Keep RoPA up to date with actual infra.
  - Logging of cross-region access attempts (should be 0 for strict tenants).
- **Success Metrics:**
  - Ability to contractually guarantee “EU-only processing” for EU tenants with technical enforcement.
  - No unapproved cross-region database or log writes in audits.

### Documentation Updates

- **Files:**
  - `docs/architecture/data-residency.md` — architecture diagrams for multi-region deployment.
- **ADRs:**
  - `ADR-00X-data-residency-model.md` describing per-tenant region selection & limitations.
- **Runbooks:**
  - `runbooks/dpa-audit-prep.md` for preparing for regulator or customer audits.

---

## Topic #5: WCAG 3.0 Compliance & Accessibility Automation

### Current State Analysis

- **Files:** Shared UI components (`packages/ui/src/**`), tests, possibly `docs/accessibility.md`.
- **Status:** Partial — repo claims WCAG 2.2 AA; WCAG 3.0 is still a working draft and not final.
- **Gaps:**
  - No continuous automated accessibility checks in CI.
  - Likely limited testing of industry/client-specific flows for a11y regressions.
- **Risk:** **Medium–High**
  - WCAG 2.2 AA compliance remains the baseline; WCAG 3.0 is not final until ~2028.[31][32]
  - Without automation, regressions are likely as UI evolves.

### 2026 Best Practice Standards

- **Standards:**
  - WCAG 2.2 AA as legal/compliance baseline.
  - Track evolving WCAG 3.0 drafts and align with direction (task/outcome-based, graded scoring).[33][32][34][31]
- **Tools:**
  - `axe-core` integrations with Playwright or Cypress.[35][36]
  - `pa11y-ci` for sitemap-level checks (CI).[37][35]
  - axe DevTools for developer and CI linting.[38]
- **Compliance:**
  - For many jurisdictions, explicit a11y obligations (e.g., EU Web Accessibility Directive, ADA case law) → failing 2.2 AA can be a legal risk now; 3.0 informs future-proofing.

### Implementation Recommendations

- **Code Changes:**
  - Enforce accessible component APIs in `@repo/ui`:
    - Props for ARIA attributes, explicit focus handling, correct roles.
  - Add storybook or isolated playground with axe scans on components.
- **New Dependencies:**
  - `@axe-core/playwright` (if using Playwright).[36][35]
  - `pa11y-ci` configured for each deployed site.[35][37]
- **Configuration:**
  - CI:
    - Add accessibility stage:
      - Run Playwright tests that include an `axe` audit on critical flows (home, booking, contact, pricing).
      - Run `pa11y-ci` against staging using each client’s sitemap.
  - Gate merges when:
    - New violations introduced vs baseline.
- **Migration:**
  - Start with 2–3 high-traffic templates per industry.
  - Gradually expand coverage; track metrics and fix backlog.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                  |
| -------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------- |
| P1       | M      | 15, 21       | Add `a11y-check` job in `.github/workflows/ci.yml` using Playwright + axe and pa11y-ci; fail on new violations |

### Validation & Testing Strategy

- **Tests:**
  - Add at least one Playwright test per client that:
    - Navigates key flows; runs `axe` on each page; asserts `violations.length === 0`.[36][35]
- **Monitoring:**
  - Track a11y regression count per release.
- **Success Metrics:**
  - 0 critical WCAG 2.2 AA violations across templates.
  - Stable or decreasing trend in automated a11y issues over time.

### Documentation Updates

- **Files:**
  - `docs/operations/accessibility-testing.md` — how to run and interpret a11y tests.
- **ADRs:**
  - `ADR-00X-accessibility-automation.md` selecting axe + pa11y-ci.
- **Runbooks:**
  - `runbooks/a11y-regression-response.md` for urgent fixes.

---

## Topic #6: Form Security & Spam Prevention Beyond Rate Limiting

### Current State Analysis

- **Files:** Contact/booking form endpoints (`app/api/contact`, `booking-actions.ts`), form components.
- **Status:** Partial — rate limiting present; little bot/spam mitigation beyond that.
- **Gaps:**
  - No honeypot fields.
  - No behavioral/”time-to-submit” validation.
  - No modern privacy-friendly CAPTCHA (Turnstile) integration.
- **Risk:** **Medium**
  - Mainly operational risk: spam floods, reduced deliverability, potential abuse for phishing.

### 2026 Best Practice Standards

- **Standards:**
  - Multi-layer form protection:
    - Invisible honeypot.
    - Submission timing checks.
    - Optional third-party anti-bot (Cloudflare Turnstile, hCaptcha).[39][40][41][42]
- **Tools:**
  - Cloudflare Turnstile (privacy-friendly, accessible).[40][42]
  - Simple honeypot + time-to-submit logic.[41][39]
  - Optional AI-based content moderation for free-text inputs (tie into AI platform later).
- **Compliance:**
  - Privacy: prefer non-invasive, non-tracking solutions where possible, especially for EU (Turnstile has privacy focus vs classic reCAPTCHA).

### Implementation Recommendations

- **Code Changes:**
  - Shared form utility in `@repo/ui` or `@repo/forms`:
    - Adds a visually-hidden honeypot field.
    - Captures `formRenderTimestamp` and validates min fill time on server (e.g., ≥ 3–5 seconds).[41]
  - Turnstile integration:
    - Add optional `turnstileSiteKey` in `site.config.ts`.
    - Component wraps forms when configured and passes token to server action.
    - Server action verifies token with Cloudflare API server-side before processing.
- **New Dependencies:**
  - Turnstile client library or simple HTML widget integration.[43][40]
- **Configuration:**
  - In `site.config.ts`, expose:
    - `forms.spamProtection = { honeypot: true, minSubmitSeconds: 4, turnstile: { enabled: boolean, siteKey: string } }`.
- **Migration:**
  - Start with most spammed forms (global contact, booking).
  - Roll out to all templates, default-on honeypot; Turnstile opt-in per client/region.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                      |
| -------- | ------ | ------------ | -------------------------------------------------------------------------------------------------- |
| P1       | M      | 1, 20, 25    | Add unit tests for spam filters; add basic smoke tests for Turnstile in Playwright against staging |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests:
    - Reject when honeypot filled.
    - Reject when elapsed time < threshold.
  - E2E:
    - Validate form submission path with and without Turnstile token.
- **Monitoring:**
  - Track spam rate vs baseline.
  - Monitor form error logs for false positives (legitimate users blocked).
- **Success Metrics:**
  - Significant drop in spam volume (e.g., ≥80%).
  - <1% legitimate submissions flagged as spam.

### Documentation Updates

- **Files:**
  - `docs/architecture/forms-security.md` — describe multi-layer pattern and config options.
- **ADRs:**
  - `ADR-00X-form-spam-mitigation.md`.
- **Runbooks:**
  - `runbooks/form-spam-incident.md` — steps to quickly adjust thresholds or disable a layer during outages.

---

## Topic #7: Webhook Security & Signature Verification

### Current State Analysis

- **Files:** Integration packages: `packages/integrations/*` (HubSpot, scheduling providers, etc.), likely Next.js route handlers for webhooks.
- **Status:** Scaffolded — handlers exist/are planned; robust verification likely missing or inconsistent.
- **Gaps:**
  - No unified webhook verification framework:
    - HMAC signature validation.
    - Timestamp-based replay protection.
    - Global idempotency & DLQ.[44][45][46]
- **Risk:** **High**
  - Webhooks drive critical flows (leads, bookings, billing). Forged or replayed events can cause fraud, data corruption, or arbitrary automation.

### 2026 Best Practice Standards

- **Standards:**
  - Verified HMAC or provider-specific signatures over **raw body bytes**, constant-time comparison.[45][44]
  - Timestamp windows + idempotency keys to prevent replay.[46][44][45]
  - At-least-once delivery handling with idempotent consumers.
- **Tools:**
  - Redis / Postgres table for tracking processed `event_id` with TTL.[45]
  - Central verification utility shared by all integrations.
- **Compliance:**
  - OWASP API Security: broken authentication & replay are common misconfigurations.[47][44]

### Implementation Recommendations

- **Code Changes:**
  - `packages/integrations-core/src/webhook-security.ts`:
    - `verifySignature({rawBody, headers, secret, algorithm})`.
    - `assertFreshTimestamp(header, skewSeconds=300)`.[45]
    - `assertIdempotent({eventId, ttlSeconds})` using Redis or DB.[44][45]
  - Each webhook route handler:
    - Reads **raw body** (ensure Next.js route config uses `bodyParser: false` or equivalent).
    - Calls shared security helpers before any business logic.
    - Wraps processing in try/catch, returning provider-expected status codes.
- **New Dependencies:**
  - Redis client (or use Postgres table) for idempotency.[45]
- **Configuration:**
  - Per-tenant webhook secrets stored in secure config (env/secret manager) **not** in `site.config.ts`.
  - `site.config.ts` can reference logical integration name; actual secrets resolved server-side.
- **Migration:**
  - Phase 1: Implement in 1–2 key integrations (e.g., Stripe-style, HubSpot).
  - Phase 2: Standardize across all 14 integrations.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                               |
| -------- | ------ | ------------ | ----------------------------------------------------------------------------------------------------------- |
| P0       | M      | 3, 20, 22    | Add webhook security tests in CI; static checks to ensure webhook handlers import `webhook-security` helper |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests for `verifySignature`, `assertFreshTimestamp`, `assertIdempotent`.
  - Integration tests:
    - Valid signed request → 200.
    - Invalid signature → 401.
    - Stale timestamp → 400.
    - Duplicate `event_id` → rejected before side effects.
- **Monitoring:**
  - Log all webhook events with event id, verification result, hash.[44][45]
  - Alert on repeated signature failures or replay attempts.
- **Success Metrics:**
  - 100% webhook handlers use common security utilities.
  - No security incidents from forged or replayed webhooks.

### Documentation Updates

- **Files:**
  - `docs/architecture/webhooks.md` — security model, idempotency, and DLQ.
- **ADRs:**
  - `ADR-00X-webhook-security-standard.md`.
- **Runbooks:**
  - `runbooks/webhook-incident.md`: triaging suspicious webhook traffic.

---

## Topic #8: Next.js 16 & React 19 Ecosystem Stability

### Current State Analysis

- **Files:** `package.json` in root & apps, `.nvmrc`, `tsconfig.*`, `next.config.js`.
- **Status:** Partial — running on Next.js 16.1.x + React 19; bleeding edge.
- **Gaps:**
  - Risk of dependency lag: not all 3rd-party packages might be React 19/Next 16–ready.
  - Limited documentation in repo on supported versions and upgrade plan.
- **Risk:** **Medium**
  - Instability possible if ecosystem deps lag; but requirement is to **not** downgrade unless security requires it.

### 2026 Best Practice Standards

- **Standards:**
  - Align with official Next.js 16 guidance (React Compiler 1.0 stable, App Router defaults).[48]
  - Keep tight control over dependencies that rely on React internals.
- **Tools:**
  - `next lint` and `next build` checks across apps.
  - Compatibility matrices for key UI deps (e.g., `@headlessui/react`, `react-hook-form`, `next-intl`).
- **Compliance:**
  - None directly, but ecosystem stability is required for uptime SLAs.

### Implementation Recommendations

- **Code / Config Changes:**
  - Lock Next.js & React versions explicitly in root:
    - e.g., `"next": "16.1.5"`, `"react": "19.0.0"`, `"react-dom": "19.0.0"`.
  - Document supported Node.js version in `.nvmrc` and CI.
  - Audit all package peerDeps for React 19/Next 16 compatibility:
    - Replace or update packages that lag.
- **Migration & Canary Strategy:**
  - Keep at least one “canary” app in the monorepo exercising all core capabilities.
  - Run nightly builds with `next@canary` on a branch for early detection but not for production.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                         |
| -------- | ------ | ------------ | --------------------------------------------------------------------- |
| P1       | M      | 11, 12, 15   | Add matrix CI for Node/OS; run `next lint` + `next build` on all apps |

### Validation & Testing Strategy

- **Tests:**
  - Smoke E2E tests per client against production-like build.
- **Monitoring:**
  - Error tracking (Sentry) for React 19–specific regressions (suspense boundaries, compiler).
- **Success Metrics:**
  - Stable CI for all apps.
  - No React 19–specific runtime errors in logs after hardening.

### Documentation Updates

- **Files:**
  - `docs/architecture/stack.md` — clearly state “Next 16 + React 19 + React Compiler”.
- **ADRs:**
  - `ADR-00X-next16-react19-standard.md`.

---

## Topic #9: Configuration Schema Versioning & Migration (site.config.ts)

### Current State Analysis

- **Files:** `site.config.ts`, shared Zod schemas in `packages/config-schema/**`.
- **Status:** Partial — Zod validation, but no explicit versioning or migrations.
- **Gaps:**
  - No `version` field in config.
  - No formal migration pipeline for schema changes.
- **Risk:** **Medium–High**
  - Breaking schema changes can break existing clients or prevent upgrades.

### 2026 Best Practice Standards

- **Standards:**
  - Use explicit configuration versioning (e.g., `version: 1 | 2 | 3`).
  - Maintain discriminated unions or versioned Zod schemas + migration functions.[49][50]
  - For complex versioning, use dedicated Zod-based versioning library (e.g., `verzod`).[51]
- **Tools:**
  - Zod discriminated unions and `.transform` for migrations.[50][49]
  - `verzod` for structured entity migration.[51]

### Implementation Recommendations

- **Code Changes:**
  - Introduce `version` in `site.config.ts`:
    ```ts
    export const siteConfigV1 = z.object({ version: z.literal(1), ... });
    export const siteConfigV2 = z.object({ version: z.literal(2), ... });
    export const siteConfig = z.discriminatedUnion('version', [siteConfigV1, siteConfigV2]);
    ```
  - Implement migration helpers:
    - `migrateConfigToLatest(configUnknown): LatestConfig`.
    - Optionally use `verzod` for more complex entities.[49][51]
- **Migration:**
  - Default any legacy configs to `version: 1`.
  - Add CLI to run migrations and write updated config to disk.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                            |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| P0       | M      | 10, 19, 24   | Add config schema tests; CI step that loads every `clients/*/site.config.ts` and validates + auto-migrates in check mode |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests for migrations between each version.
  - Golden snapshot tests for a few real `site.config.ts` files.
- **Monitoring:**
  - On runtime config load, log version and migration status.
- **Success Metrics:**
  - Safe upgrades of schema with no client breakage.
  - 0 runtime config validation failures in production.

### Documentation Updates

- **Files:**
  - `docs/architecture/configuration-as-code.md` — add versioning & migration section.
- **ADRs:**
  - `ADR-00X-config-schema-versioning.md`.

---

## Topic #10: Automated Client Scaffolding CLI

### Current State Analysis

- **Files:** `clients/starter-template/**`, manual `cp -r` instructions in docs.
- **Status:** Partial — basic template exists; copying causes drift.
- **Gaps:**
  - No generator CLI.
  - No validation that new client conforms to schema and module boundaries.
- **Risk:** **Medium**
  - Drift and inconsistencies across clients; harder upgrades.

### 2026 Best Practice Standards

- **Standards:**
  - Code generation via CLI with templates, not copy-paste.[52][53][54][55]
  - Enforce invariants: config schema valid, module boundaries respected.
- **Tools:**
  - Plop.js or Hygen are good fits for JS/TS monorepos.[53][54][52]
- **Compliance:**
  - Indirect: good scaffolding reduces accidental misuse of integrations and misconfigurations.

### Implementation Recommendations

- **Code Changes:**
  - Add `tools/scaffold-client` using Plop:
    - Prompts: industry, region, default locale, integrations to enable.
    - Actions:
      - Generate client folder.
      - Create `site.config.ts` from templates.
      - Register client in any `clients.json` index if you have one.
  - Add validation:
    - After generation, run `pnpm lint` and config validation for new client.
- **New Dependencies:**
  - `plop` devDependency.[55][53]
- **Migration:**
  - Keep existing clients as-is.
  - Use CLI for all new client creation; backfill old clients over time.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                      |
| -------- | ------ | ------------ | -------------------------------------------------------------------------------------------------- |
| P1       | M      | 9, 11, 19    | Add “scaffold-smoke” job that runs CLI on CI (temporary directory) to ensure generator stays valid |

### Validation & Testing Strategy

- **Tests:**
  - Snapshot tests for generated `site.config.ts` from several CLI scenarios.
- **Monitoring:**
  - Track generator usage (scripts, developer docs).
- **Success Metrics:**
  - 100% of new clients created via CLI.
  - Reduced variance between client structures.

### Documentation Updates

- **Files:**
  - `docs/operations/client-onboarding.md` — CLI-based workflow.
- **ADRs:**
  - `ADR-00X-client-scaffolding-cli.md`.

---

## Topic #11: Monorepo Dependency Isolation & Boundary Enforcement

### Current State Analysis

- **Files:** `docs/architecture/module-boundaries.md`, ESLint config.
- **Status:** Partial — ESLint rules present, but cross-client imports still possible.
- **Gaps:**
  - No hard enforcement that `clients/A` cannot import `clients/B`.
  - No systemic prevention of circular deps; deep imports into packages may still leak.
- **Risk:** **Medium**
  - Increases upgrade risk; violates CaCA and tenant isolation assumptions.

### 2026 Best Practice Standards

- **Standards:**
  - Enforce boundaries via:
    - ESLint (`@nx/enforce-module-boundaries` or `eslint-plugin-boundaries`), or `no-restricted-imports`.[56][57][58][59][60]
- **Tools:**
  - `eslint-plugin-boundaries` for generic projects.[61][58]
  - Nx-style boundary rules if Nx is in use.[62][60][56]
- **Compliance:**
  - Influences security (ensures no cross-tenant data references through code).

### Implementation Recommendations

- **Code / Config Changes:**
  - Tag projects by type and tenant:
    - e.g., `type:app`, `type:ui`, `type:integration`, `tenant:client-a`.
  - Configure ESLint:
    - Use `eslint-plugin-boundaries` or `@nx/enforce-module-boundaries` (if Nx) to disallow:
      - `clients/*` importing other `clients/*`.
      - Apps importing deep internals of packages (only via public entry points).[57][58][60][56]
- **Migration:**
  - Run lint in “warn” mode first, fix violations, then switch to error.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                               |
| -------- | ------ | ------------ | ----------------------------------------------------------- |
| P0       | M      | 9, 10, 20    | Enforce boundary lint rule in CI (fail build on violations) |

### Validation & Testing Strategy

- **Tests:**
  - Add sample rule test by deliberately adding forbidden import in a branch and confirming CI failure.
- **Monitoring:**
  - Track number of boundary violations over time.
- **Success Metrics:**
  - Zero boundary violations on main branch.

### Documentation Updates

- **Files:**
  - Update `docs/architecture/module-boundaries.md` with concrete ESLint config examples.
- **ADRs:**
  - `ADR-00X-boundary-enforcement-eslint.md`.

---

## Topic #12: Dynamic Composition Performance & Bundle Optimization

### Current State Analysis

- **Files:** `composePage` utility (likely in `packages/composer/**` or `apps/*/lib/composePage.ts`).
- **Status:** Partial — dynamic section composition works, but optimization for tree-shaking and bundle size unclear.
- **Gaps:**
  - Risk of importing whole section library even if only few used.
  - Possibly no granular code-splitting per section.
- **Risk:** **Medium**
  - Direct impact on Core Web Vitals (LCP, INP).[63][64][65][66]

### 2026 Best Practice Standards

- **Standards:**
  - Only ship components actually used by given page variant.
  - Use dynamic imports and route-level code splitting.
- **Tools:**
  - Next.js dynamic imports and RSCs.
  - Bundle analysis via `next-bundle-analyzer`.
- **Compliance:**
  - Performance is part of SEO and user experience; Google uses Core Web Vitals as ranking signal.[64][65][66][63]

### Implementation Recommendations

- **Code Changes:**
  - `composePage`:
    - Map config section types to lazily-imported components:
      - e.g., `const Hero = dynamic(() => import('../sections/Hero'));`
    - Ensure unused sections are not imported anywhere in the same module (avoid big `import * as Sections`).
  - Use RSC as much as possible to shift work to server.
- **Monitoring & Optimization:**
  - Enable webpack/Next analyzer for key clients.
  - Set performance budgets (max JS KB per page) and enforce via CI.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                              |
| -------- | ------ | ------------ | -------------------------------------------------------------------------- |
| P1       | M      | 8, 15, 23    | Add bundle size check step (e.g., `next build` with analyzer + thresholds) |

### Validation & Testing Strategy

- **Tests:**
  - Snapshot bundle analysis to confirm only necessary chunks loaded per client/page.
- **Monitoring:**
  - Track Core Web Vitals (LCP, INP, CLS) via RUM (e.g., Vercel Analytics, custom solution).[65][66][63][64]
- **Success Metrics:**
  - JS bundle per landing page under target KB.
  - Core Web Vitals passing for majority of real users.

### Documentation Updates

- **Files:**
  - `docs/architecture/performance.md` — dynamic composition and lazy loading guidelines.

---

## Topic #13: Cache Strategy & Invalidation for Config-Driven Content

### Current State Analysis

- **Files:** `composePage`, Next.js caching configs, potential use of ISR (`revalidate`).
- **Status:** Partial — some caching (ISR) likely; no end-to-end config-driven invalidation described.
- **Gaps:**
  - No standardized mapping from `site.config.ts` changes → `revalidatePath` / `revalidateTag` calls.[67][68][69]
  - Interaction with CDN caching (Cloudflare/Vercel Edge) not fully defined.[70]
- **Risk:** **Medium**
  - Stale content after config changes; confusing behavior for clients.

### 2026 Best Practice Standards

- **Standards:**
  - Leverage ISR (`revalidatePath`, `revalidateTag`) for static-ish marketing content.[68][69][67]
  - Carefully coordinate ISR with CDN stale-while-revalidate headers to avoid double-staleness.[71][70]
- **Tools:**
  - Next.js ISR APIs.[69][67]
  - CDN cache rules (Cloudflare, Vercel Edge).[70]

### Implementation Recommendations

- **Code Changes:**
  - Tag-based revalidation:
    - Associate each site/client with a cache tag, e.g., `site:${tenantId}`.
    - When `site.config.ts` is updated (whether via Git or admin tool), trigger a server action that calls `revalidateTag('site:${tenantId}')`.[67]
  - For route-specific pages (e.g., blog, case studies), use `revalidatePath` after content changes.
- **Infra/Config:**
  - Set consistent `Cache-Control: s-maxage` + `stale-while-revalidate` tuned to use-case; avoid stacking with external CDN SWR that causes infinite staleness.[71][70]
- **Migration:**
  - Add tags gradually; start with home and key marketing pages.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                        |
| -------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| P1       | M      | 9, 12, 23    | Add integration tests that simulate config change, then assert new content after revalidation in preview environment |

### Validation & Testing Strategy

- **Tests:**
  - Local: `next build && next start`, manual `revalidate` tests.[69]
  - Automated E2E in staging verifying config changes propagate in acceptable time.
- **Monitoring:**
  - Log revalidation events with tags and durations.
- **Success Metrics:**
  - Config changes visible within expected window (e.g., <5 min) without manual cache purge.

### Documentation Updates

- **Files:**
  - `docs/architecture/caching-strategy.md`.

---

## Topic #14: Multi-Region Deployment & Data Sovereignty

### Current State Analysis

- **Files:** Deployment configs (Vercel/Cloudflare), DNS configuration (maybe `infra/`).
- **Status:** Partial — global clients but not fully structured multi-region.
- **Gaps:**
  - No clear multi-region routeing strategy (global domain -> regional backends).
  - No documented mapping between tenants and hosting/db regions.
- **Risk:** **High** (ties into Topic 4 & 3)
  - Residency + sovereignty issues if EU data processed in US or US jurisdiction still applies over EU data.[23][27][21][29][22][20]

### 2026 Best Practice Standards

- **Standards:**
  - Multi-region architecture with:
    - Global entrypoint (e.g., Cloudflare or Route 53) + geo-based routing.[72][24][22]
    - Region-specific app+DB clusters.
  - Data Localization at edge via Cloudflare Data Localization Suite and/or Vercel Regions.[30][27][28][25][29][26]
- **Tools:**
  - DNS-based geo-routeing, Cloudflare Workers, or similar.
  - CockroachDB-style multi-region patterns (if used).[24][22]

### Implementation Recommendations

- **Architecture Changes:**
  - Introduce:
    - `global` (stateless) routing layer determining region per tenant.
    - Region-specific deployments for EU/US (and others as needed).
  - Use Vercel `regions` per project and environment for function pinning.[28][29][30]
  - Use Cloudflare Regional Services + Data Localization Suite where Cloudflare is CDN/WAF.[27][25][26]
- **Migration:**
  - Start with two primary regions (US, EU).
  - Document tenants per region and plan migrations (see Topic 4).

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                  |
| -------- | ------ | ------------ | ---------------------------------------------------------------------------------------------- |
| P1       | XL     | 3, 4, 20, 25 | Introduce multi-region deployment environments; CI matrix for region-specific builds and tests |

### Validation & Testing Strategy

- **Tests:**
  - Integration tests that simulate EU/US users hitting global endpoint and confirm they reach regional backends.
- **Monitoring:**
  - Observe latency per region; ensure EU users primarily hit EU infra.
- **Success Metrics:**
  - Measurable latency reduction for regional users.
  - Verified separation of EU and US data paths.

### Documentation Updates

- **Files:**
  - `docs/architecture/multi-region.md`.

---

## Topic #15: Tailwind CSS v4 Engine & Theming

### Current State Analysis

- **Files:** Tailwind config (`tailwind.config.*`), theme variables and `ThemeInjector` component.
- **Status:** Partial — using Tailwind 4.1 with HSL theme variables; not fully aligned with new CSS-first config model.
- **Gaps:**
  - Possibly still using legacy JS config patterns where CSS-first is recommended.
  - Multi-tenant theming heavily relies on runtime variables; may miss some new OKLCH capabilities.[73][74][75][76]
- **Risk:** **Low–Medium**
  - Mostly performance & maintainability; not core security.

### 2026 Best Practice Standards

- **Standards:**
  - Tailwind v4 uses Oxide Rust engine & CSS-first config via `@theme`.[74][75][77][76]
  - JIT always-on with better tree-shaking and small builds.[75][73][74]
- **Tools:**
  - `@tailwindcss/upgrade` for migration.[76][74]
- **Compliance:**
  - Theming should support accessible contrast (ties into Topic 5).

### Implementation Recommendations

- **Code Changes:**
  - Migrate to CSS-first configuration where reasonable:
    - Use `@theme` to declare brand tokens.
    - Map `site.config.ts` theme values to CSS variables at build/runtime.
  - Ensure `ThemeInjector`:
    - Writes theme values to CSS custom properties (OKLCH recommended for better contrast control).[73][74][75]
- **Migration:**
  - Use official upgrade tool on a branch; validate per-client styles.
  - Keep JS config fallback for complex overrides if necessary.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                     |
| -------- | ------ | ------------ | --------------------------------------------------------------------------------- |
| P2       | M      | 5, 12        | Visual regression tests for styling across sample clients; CSS size budget checks |

### Validation & Testing Strategy

- **Tests:**
  - Visual regression tests on key templates per industry.
- **Monitoring:**
  - Track CSS bundle size & build times.
- **Success Metrics:**
  - Faster builds and smaller CSS.
  - No regressions in theming or contrast coverage.

### Documentation Updates

- **Files:**
  - `docs/architecture/theming.md` — updated for Tailwind v4 and CSS-first config.

---

## Topic #16: Third-Party Script Loading & Consent Management

### Current State Analysis

- **Files:** Integration packages that inject scripts; centralized `<Script>` usage.
- **Status:** Partial — scripts load; consent gating inconsistent; performance impact not fully controlled.
- **Gaps:**
  - Some scripts likely load on every page regardless of consent or need.
  - No standardized consent management integration; risk of non-compliant trackers under GDPR/CCPA.[78][79][80][81][82]
- **Risk:** **High** (for EU/California clients)
  - Illegal tracking pre-consent; performance regressions.

### 2026 Best Practice Standards

- **Standards:**
  - Use Next.js `<Script strategy="afterInteractive" | "lazyOnload">` for most third-party scripts.[79]
  - Gate non-essential scripts behind CMP consent.[82][78]
- **Tools:**
  - CMP vendors (Termly, CookieScript, or similar) with script blocking API.[78][82]
  - Next.js `@next/third-parties` components, conditionally rendered based on consent.[81]
- **Compliance:**
  - GDPR, ePrivacy, CCPA data processing and consent requirements.[82][78]

### Implementation Recommendations

- **Code Changes:**
  - Introduce a `ScriptManager` component:
    - Reads consent state from CMP (via context or cookie) and only renders allowed scripts.
    - Uses Next.js `<Script>` with optimal strategies (`afterInteractive` or `lazyOnload`).[79][80]
  - Update all integration packages:
    - Export metadata describing script category (analytics/marketing/functional).
    - Rely on `ScriptManager` instead of directly injecting `<script>`.
- **Configuration:**
  - `site.config.ts` includes:
    - `consent.cmpProvider` (termly, cookie-script, custom).
    - Which script categories are used.
- **Migration:**
  - Stepwise: analytics, then marketing, then chat widgets.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                                  |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| P0       | M      | 4, 18, 23    | Add tests ensuring scripts not present in DOM when consent not granted; performance test to measure impact of scripts addition |

### Validation & Testing Strategy

- **Tests:**
  - E2E:
    - Visit page without consenting; assert tracking scripts absent.
    - Accept certain categories; assert only those scripts appear.
- **Monitoring:**
  - Performance metrics before/after gating.
- **Success Metrics:**
  - Scripts load only after consent.
  - Improved LCP/INP; reduced JS executed pre-interaction.

### Documentation Updates

- **Files:**
  - `docs/architecture/third-party-scripts.md`.
- **Runbooks:**
  - `runbooks/script-outage.md` — how to disable a misbehaving script quickly via config.

---

## Topic #17: Image Optimization & Multi-Tenant CDN Strategy

### Current State Analysis

- **Files:** Next.js image components, static assets paths; CDN configuration docs.
- **Status:** Partial — Next.js Image is likely used; tenant-level isolation not fully formalized.
- **Gaps:**
  - Limited asset namespace per tenant (could lead to leaks).
  - Formats and responsive behavior might not be consistently configured.
- **Risk:** **Medium**
  - Performance + data isolation risk (if internal assets leak between tenants).

### 2026 Best Practice Standards

- **Standards:**
  - Use modern image formats (AVIF, WebP) with automatic fallback.[70]
  - Tenant-specific storage buckets or prefixes.
- **Tools:**
  - Next.js `<Image>` with domain & loader config.
  - CDN features (Cloudflare Images/Vercel Image Optimization).
- **Compliance:**
  - Some industries might treat certain image content as regulated (e.g., health data in images) → tie into data locality.

### Implementation Recommendations

- **Code Changes:**
  - Standardize image usage via shared `@repo/ui/image` wrapper.
  - Enforce `sizes` & responsive attributes across templates.
- **Infra:**
  - Use per-tenant prefixes or separate buckets for uploads (e.g., `tenant-id/*`).
- **Migration:**
  - Backfill existing assets with proper prefixes (or at least segregation by industry).

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                |
| -------- | ------ | ------------ | ---------------------------------------------------------------------------- |
| P2       | M      | 12, 14, 23   | Add image optimization linting (no raw `<img>` in app) and asset path checks |

### Validation & Testing Strategy

- **Tests:**
  - Check generated HTML for correct responsive attributes.
- **Monitoring:**
  - Observe bandwidth usage & cache hit rates per tenant if metrics exist.
- **Success Metrics:**
  - Reduced image transfer size & improved LCP.

### Documentation Updates

- **Files:**
  - `docs/architecture/assets-and-cdn.md`.

---

## Topic #18: Internationalization (i18n) at Multi-Tenant Scale

### Current State Analysis

- **Files:** `next-intl` configuration, middleware, locale routing; possibly `app/[locale]/...`.
- **Status:** Partial — `next-intl` integration exists; inconsistent per client.
- **Gaps:**
  - No unified pattern for tenant + locale (e.g. `app/[tenant]/[locale]` or domain-based), which `next-intl` requires careful design for.[83][84]
  - Inconsistent translation key usage and fallback behavior.
- **Risk:** **Medium**
  - Broken localized URLs; inconsistent experiences across tenants.

### 2026 Best Practice Standards

- **Standards:**
  - Use `next-intl` design principles:
    - RSC-first.
    - Split messages by locale and by server/client where possible.[84]
  - Support multi-tenant routing patterns:
    - Either per-domain or `app/[locale]/[tenant]` based on constraints.[83]
- **Tools:**
  - `next-intl` v3+ latest guidance.[84][83]
- **Compliance:**
  - Some jurisdictions expect local language presence; not strictly regulatory but important.

### Implementation Recommendations

- **Code Changes:**
  - Standardize routing:
    - E.g. base path per tenant: `tenant.example.com` + leading `[locale]` segment as required by `next-intl`.
  - Use domain mappings (`domains` config) to support domain-per-tenant with locale support.[83][84]
  - Add a translation management pattern:
    - Local JSON per tenant + locale in `clients/{client}/messages/{locale}.json`.
- **Migration:**
  - Minimal route changes to avoid breaking existing clients; may require alias routes.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                               |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------- |
| P2       | M      | 4, 16, 23    | Add i18n integration tests per locale; check for missing translations and fallback behavior |

### Validation & Testing Strategy

- **Tests:**
  - Automated tests that verify:
    - All configured locales have messages for core keys.
- **Monitoring:**
  - Error logging for missing translation keys.

### Documentation Updates

- **Files:**
  - `docs/architecture/i18n.md` — multi-tenant patterns for `next-intl`.

---

## Topic #19: Design System Governance & Component Deprecation

### Current State Analysis

- **Files:** `packages/ui`, possibly storybook configuration.
- **Status:** Partial — shared components exist; no formal versioning/governance.
- **Gaps:**
  - No component lifecycle status (stable/deprecated/experimental).
  - No automated detection of deprecated usage in client apps.
- **Risk:** **Medium**
  - Hard to evolve UI without breaking clients.

### 2026 Best Practice Standards

- **Standards:**
  - Semver for shared UI package.
  - Deprecation policy: soft deprecate → removal in major release.
  - Changelogs and migration guides for each major bump.
- **Tools:**
  - Conventional commits + automatic changelog generation.
  - Custom ESLint rule or codemods to flag deprecated components.

### Implementation Recommendations

- **Code Changes:**
  - Add JSDoc `@deprecated` annotations and export-level flags.
  - Introduce `@repo/ui` semver policy (e.g., `1.x` for current generation).
- **Migration:**
  - For each deprecation, provide a codemod or recipe.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                 |
| -------- | ------ | ------------ | --------------------------------------------------------------------------------------------- |
| P2       | M      | 8, 11, 21    | Lint failing on new uses of deprecated components; version bumps tied to changelog generation |

### Validation & Testing Strategy

- **Tests:**
  - Storybook or component tests for core primitives.
- **Monitoring:**
  - Track deprecated usage across clients.

### Documentation Updates

- **Files:**
  - `docs/architecture/design-system-governance.md`.

---

## Topic #20: Observability & Distributed Tracing Strategy

### Current State Analysis

- **Files:** Potential `instrumentation.ts`; logging wrappers; Sentry config.
- **Status:** Scaffolded — logs exist; no full tracing across serverless functions & multi-tenant boundaries.
- **Gaps:**
  - No OpenTelemetry integration or standardized tenant-aware logging.
- **Risk:** **High**
  - Hard to debug incidents across tenants/regions.

### 2026 Best Practice Standards

- **Standards:**
  - Use OpenTelemetry for tracing/metrics/logs; Next.js supports instrumentation hooks.[85][86][87][88]
  - Tenant-aware correlation IDs and logs.
- **Tools:**
  - `@vercel/otel` for easy integration on Vercel.[86][88][85]
  - Backend observability stack (e.g., ClickHouse OTEL, Honeycomb, DataDog).[87]
- **Compliance:**
  - Indirectly supports SLAs and incident response obligations.

### Implementation Recommendations

- **Code Changes:**
  - Add `instrumentation.ts` with:

    ````ts
    import { registerOTel } from '@vercel/otel';

    export function register() {
      registerOTel({
        serviceName: 'marketing-platform',
        attributes: {
          'deployment.environment': process.env.NODE_ENV,
        },
      });
    }
    ```[85][86][88]
    ````

  - Include tenant id and request id in spans where possible.

- **New Dependencies:**
  - `@vercel/otel`.[85]
- **Configuration:**
  - Configure OTLP endpoint env vars for chosen backend.
- **Migration:**
  - Start by tracing booking flows and webhooks.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                  |
| -------- | ------ | ------------ | ---------------------------------------------------------------------------------------------- |
| P1       | M      | 1, 3, 7, 22  | Add instrumentation tests (smoke) in CI; ensure `instrumentationHook` enabled in `next.config` |

### Validation & Testing Strategy

- **Tests:**
  - Local verification that traces are emitted.
- **Monitoring:**
  - Dashboards and alerts (e.g., latency, error rate per tenant).
- **Success Metrics:**
  - Reduced MTTR on incidents.

### Documentation Updates

- **Files:**
  - `docs/operations/observability.md`.

---

## Topic #21: End-to-End (E2E) Testing Architecture

### Current State Analysis

- **Files:** Unit tests present (~646 tests), E2E tests minimal.
- **Status:** Scaffolded — unit coverage good; E2E for multi-tenant not fleshed out.
- **Gaps:**
  - No systematic multi-tenant E2E strategy.
  - No visual regression tests.
- **Risk:** **High**
  - Multi-tenant complexity easily breaks at integration boundaries.

### 2026 Best Practice Standards

- **Standards:**
  - Use Playwright or Cypress with:
    - Isolated tenant test data.
    - Parallelism tuned for CI.[89][90][7]
- **Tools:**
  - Playwright (good for multi-context, multi-tenant flows).[90][7][89]
  - Visual regression (Playwright snapshots or Percy).

### Implementation Recommendations

- **Code Changes:**
  - Create E2E test harness:
    - Fixture that provisions a test tenant, seeds site/config, run tests, then cleans up.[7][89]
  - Organize tests per “feature vertical” (booking, contact, SEO).
- **Migration:**
  - Start with 1–2 reference tenants; ensure tests stable; expand to others.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                        |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------ |
| P0       | L      | 1, 3, 16, 23 | Add `e2e` job in CI (Playwright) with smoke suite per tenant; run full suite nightly |

### Validation & Testing Strategy

- **Tests:**
  - Cross-tenant isolation tests (Topic 1 & 3).
  - SEO checks (Topic 23) like canonical URLs, sitemaps.
- **Monitoring:**
  - Track flaky tests and flakiness rate.

### Documentation Updates

- **Files:**
  - `docs/operations/testing-strategy.md` — E2E section.

---

## Topic #22: Integration Package Error Handling & Retry Logic

### Current State Analysis

- **Files:** `packages/integrations/*`.
- **Status:** Scaffolded — packages exist but not wired with robust retry/circuit breaker logic.
- **Gaps:**
  - No standardized retries with backoff.
  - No circuit breakers or DLQ for failed external calls.
- **Risk:** **High**
  - External outages or rate limits can cascade into app instability.

### 2026 Best Practice Standards

- **Standards:**
  - Exponential backoff retries with max attempts.
  - Circuit breaker + DLQ where needed.
- **Tools:**
  - Custom wrapper or library-level patterns.
  - Webhook-specific idempotency squared with Topic 7.[91][44][45]

### Implementation Recommendations

- **Code Changes:**
  - `packages/integrations-core/src/client.ts`:
    - Wrapper for all HTTP calls with:
      - Retry (exponential backoff on transient errors).
      - Circuit-breaker state (open/half-open/closed).
  - Standard error types and logging.
- **Migration:**
  - Gradually hook each integration client into this core.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                           |
| -------- | ------ | ------------ | --------------------------------------------------------------------------------------- |
| P1       | M      | 7, 20        | Add integration tests simulating 429/5xx and verifying retries/circuit breaker behavior |

### Validation & Testing Strategy

- **Tests:**
  - Fake integration server that returns specific sequences of errors.
- **Monitoring:**
  - Metrics: error rate, retry counts, circuit breaker states.

### Documentation Updates

- **Files:**
  - `docs/architecture/integrations.md`.

---

## Topic #23: SEO & Schema.org Optimization (2026 Standards)

### Current State Analysis

- **Files:** `@repo/industry-schemas`, per-client SEO config, Next metadata.
- **Status:** Partial — JSON-LD exists for industries; multi-tenant sitemaps & robots not fully standardized.
- **Gaps:**
  - No unified sitemap/robots strategy per tenant.
  - Schema may not follow latest best practices for AI Overviews/Geo contexts.[92][93][94][95]
- **Risk:** **Medium–High**
  - Direct impact on client traffic and ROI.

### 2026 Best Practice Standards

- **Standards:**
  - JSON-LD as primary schema format.[93][94][95][92]
  - Core Web Vitals as ranking factor (LCP, INP, CLS with recommended thresholds).[66][63][64][65]
  - Proper sitemaps and robots.txt per tenant.[96][97][98][99][100]
- **Tools:**
  - `next-sitemap` or custom generator for multi-tenant sitemaps.[97]
  - Google Search Console integration for representative domains.

### Implementation Recommendations

- **Code Changes:**
  - Per-tenant sitemap:
    - Use dynamic sitemap routes (e.g., `/sitemap.xml`) that consider tenant context.
  - robots.txt:
    - Each tenant domain gets appropriate robots with `Sitemap: ...` line.[98][99][100][96][97]
  - Schema:
    - Ensure JSON-LD:
      - Matches visible content.
      - Uses correct types (LocalBusiness, Organization, Service, etc.).[94][95][92][93]
- **Migration:**
  - Apply to 6 live clients first; monitor SEO KPIs.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                             |
| -------- | ------ | ------------ | --------------------------------------------------------------------------------------------------------- |
| P0       | M      | 12, 13, 17   | Add SEO tests that validate presence of JSON-LD, sitemaps, robots; optionally run Lighthouse checks in CI |

### Validation & Testing Strategy

- **Tests:**
  - Automated validation for sitemaps & robots presence and correctness.[97][98]
- **Monitoring:**
  - Track Core Web Vitals and organic traffic.
- **Success Metrics:**
  - Improved search visibility and conversions.

### Documentation Updates

- **Files:**
  - `docs/architecture/seo.md`.

---

## Topic #24: Client Customization Boundaries (Config vs. Code)

### Current State Analysis

- **Files:** `site.config.ts` per client; clients sometimes modify code.
- **Status:** Partial — CaCA architecture exists; guardrails on “config-only” vs “allowed override” not clearly enforced.
- **Gaps:**
  - No documented boundaries.
  - Risk of forks and local code changes per client.
- **Risk:** **High**
  - Fork drift; painful upgrades; violation of CaCA.

### 2026 Best Practice Standards

- **Standards:**
  - Clear separation:
    - Configurable aspects in `site.config.ts`.
    - Extension points via limited plugin APIs.
    - No direct edits to shared packages by clients.
- **Tools:**
  - ESLint/TS lint to disallow imports from `clients/*` into shared packages.
  - Policy docs and code review checklists.

### Implementation Recommendations

- **Code Changes:**
  - Introduce “extension points” with strict APIs for advanced customization.
- **Process:**
  - Enforce rule: client-specific variants must be expressed in config; code changes go through core team with design reviews.
- **Migration:**
  - Identify current code deviations and plan refactors into config or core.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                       |
| -------- | ------ | ------------ | --------------------------------------------------------------------------------------------------- |
| P0       | L      | 9, 11, 19    | Lint checks disallowing client-specific code under shared packages; PR templates reinforcing policy |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests around config-driven branching logic (e.g., theme, integrations).
- **Monitoring:**
  - Track forks/branches that diverge from main; code review enforcement.

### Documentation Updates

- **Files:**
  - `docs/architecture/config-vs-code-boundaries.md`.

---

## Topic #25: AI Platform Governance & Cost Control

### Current State Analysis

- **Files:** `@repo/ai-platform/*` (agent orchestration, LLM gateway, content engine).
- **Status:** Scaffolded — packages exist; not fully wired with governance, safety, or cost controls.
- **Gaps:**
  - No central per-tenant quotas or token-level metering.
  - Limited prompt injection defenses and moderation.
  - No standardized model selection strategy (cost vs capability).
- **Risk:** **High–Critical**
  - Prompt injection, data leakage, uncontrolled cost blow-ups, regulatory exposure.[101][102][103][104][105][106][107][108][109][110][111][112][113]

### 2026 Best Practice Standards

- **Standards:**
  - Align with OWASP LLM Top 10 (Prompt Injection as #1 risk).[102][103][104][101]
  - AI governance: Zero Trust + AI firewalls, data classification, RBAC/ABAC controls.[108]
  - Token-aware rate limits & quotas per tenant for cost control.[105][106][109][111][112]
- **Tools:**
  - AI gateway layer enforcing:
    - Moderation per input/output (OpenAI moderation, Llama Guard, etc.).[114][113]
    - Per-tenant token usage metrics & limits.[107][109][111][112][105]
  - Provider regional endpoints for data residency (e.g., `eu.api.openai.com`).[115][110]
- **Compliance:**
  - EU AI Act, sectoral AI rules, and OpenAI usage policies; data controls and moderation essential.[110][116][108]

### Implementation Recommendations

- **Code Changes (Gateway):**
  - Centralize all LLM calls in `@repo/ai-platform/llm-gateway`:
    - Enforce:
      - Prompt templates (system prompts locked in code, not user input).
      - Input validation and context isolation (untrusted content tagged and separated).[103][101][102]
      - Output moderation before passing to end user.[113][114]
    - Implement:
      - Per-tenant token accounting (prompt + completion).
      - Token-aware rate-limiting and quotas (TPM, daily quotas).[106][109][111][112][105][107]
  - Agents:
    - Restrict tool access via least privilege.
    - Require human-in-the-loop for high-risk actions (e.g., sending emails, editing live content).[104][102][103][108]
- **Cost Control:**
  - Model tiering:
    - Use cheaper models for low-risk tasks; reserve high-end for critical flows.[107]
  - Expose usage dashboards per tenant.
- **Data Controls:**
  - Configure provider settings:
    - Opt into Zero Data Retention where needed.[110]
    - Route EU tenants to EU endpoints when available (OpenAI EU, etc.).[115][110]
- **Migration:**
  - Wrap existing AI usages through gateway gradually.
  - Establish conservative quotas initially; adjust by tenant plan.

### Repository-Specific Action Items

| Priority | Effort | Dependencies | CI/CD Changes                                                                                                                                    |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| P0       | L      | 3, 4, 14, 20 | Add tests for gateway behavior (rate limits, moderation, region selection); CI checks forbidding direct provider SDK usage outside `llm-gateway` |

### Validation & Testing Strategy

- **Tests:**
  - Unit tests:
    - Prompt injection attempts; ensure system prompt & tools remain constrained.[101][102][103][104]
    - Quota enforcement; requests over quota rejected gracefully.
  - Security tests:
    - Red-team style scenarios for prompt injection and data exfiltration.
- **Monitoring:**
  - Metrics:
    - Token usage by tenant, by model/provider.
    - Moderation flags rate.
    - Cost per tenant.
- **Success Metrics:**
  - No uncontrolled LLM spend spikes.
  - No high-severity prompt injection incidents (or rapid containment if any).
  - Measurable cost savings via model tiering and prompt optimization.[109][107]

### Documentation Updates

- **Files:**
  - `docs/architecture/ai-platform.md` — gateway, guardrails, and quotas.
- **ADRs:**
  - `ADR-00X-ai-governance-and-cost-control.md`.
- **Runbooks:**
  - `runbooks/ai-incident-response.md` (leak, harmful output).
  - `runbooks/ai-cost-anomaly.md` (unexpected token spikes).

---

## Wave 1 Prioritization Summary (12-Week Horizon)

For Wave 1, focus on P0 items and highest risks:

- **Security/Critical:**
  - Topic 1 (Server Action Security & IDOR).
  - Topic 3 (RLS for multi-tenant isolation).
  - Topic 2 (Supply chain hardening).
  - Topic 7 (Webhook security).
  - Topic 20 (Observability) — to support all security topics.
  - Topic 21 (E2E foundation).
  - Topic 23 (SEO baseline).
  - Topic 24 (config vs code boundaries).
  - Topic 25 (AI governance, minimal viable gateway/guardrails).
  - Topic 16 (Third-party scripts & consent).
  - Topic 9 (Config versioning).

- **High but can follow:**
  - Topic 4 & 14 (data residency & multi-region) — design in Wave 1, implement partially.
  - Topic 6 (form spam).
  - Topic 11 (module boundaries enforcement).

Everything else (Tailwind v4 governance, i18n improvements, advanced scaffolding, image CDN optimizations, etc.) can be sequenced as P1/P2 items once P0 security and correctness are in place and CI is stable.
