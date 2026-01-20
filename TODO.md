# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-20
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (from chat)
- Site: High-performance marketing site for "Your Dedicated Marketer"
- Hosting: Cloudflare Pages (GitHub integration)
- Standard: Diamond Standard (performance, accessibility, observability, testing)
- Keep: Sentry, PWA, Search
- Contact flow: Store lead in Supabase (server-only) + sync to HubSpot CRM
- No email sending
- Save suspicious submissions but flag them (suspicious = too many requests)
- Required fields: Name, Email, Phone
- UX: Return success even if HubSpot sync fails (best-effort)

## Task Schema (Required)
- **ID**: `T-###` (unique, sequential)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `SECURITY | RELEASE | DEPENDENCY | DOCS | QUALITY | BUG | FEATURE | CHORE`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW | DONE`
- **Blockers**: `None` or a short description of what prevents progress
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist (broken into subtasks T-###.#)
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `XS | S | M | L | XL` (XS = < 30 min, S = < 2 hr, M = < 4 hr, L = < 1 day, XL = > 1 day)

### Priority Meaning
- **P0**: BLOCKS BUILD or causes security/data loss — fix immediately
- **P1**: High impact; do within 7 days
- **P2**: Important but not urgent; do within 30 days
- **P3**: Backlog/tech debt; do when convenient

### Ownership Rule
- **Owner: AGENT** — task can be executed by Codex/Claude Code/Copilot in-repo
- **Owner: Trevor** — requires external actions (provider dashboards, DNS, billing, approvals)

---

## 🔴 PHASE 0: Build & Security Blockers (P0)
> These MUST be fixed before feature work.

---

### T-085: Align contact pipeline implementation to the v1 scope decision
Priority: P0
Type: RELEASE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-12
Context:
- Contact pipeline must match the chosen lead capture path
- Optional integrations should not crash the site
Acceptance Criteria:
- [ ] T-085.1: If v1 is email-only, disable Supabase/HubSpot paths (no required env vars, no dead calls)
- [ ] T-085.2: If v1 is Supabase + HubSpot, ensure contact submissions write to Supabase and attempt HubSpot sync
- [ ] T-085.3: Ensure submitContactForm returns clear success/failure and never silently succeeds
- [ ] T-085.4: Document pipeline behavior in /docs/DEPLOYMENT.md
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-084, T-080, T-081, T-082
Effort: M

### T-086: Verify contact flow in a deployed environment
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: Contact pipeline implementation (T-085) must be complete.
Context:
- Launch readiness requires live verification, not just local testing
Acceptance Criteria:
- [ ] T-086.1: Deploy a preview build (Cloudflare Pages preview or equivalent)
- [ ] T-086.2: Submit three forms (valid, invalid, and rapid-fire spammy)
- [ ] T-086.3: Confirm the lead appears in the chosen destination (email/DB/CRM)
- [ ] T-086.4: Record results (screenshot or notes) in /docs/LAUNCH-VERIFICATION.md
References:
- /docs/LAUNCH-VERIFICATION.md
Dependencies: T-085
Effort: XS

### T-088: Create production environment checklist
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Production env setup should be explicit and verifiable
Acceptance Criteria:
- [ ] T-088.1: Create /docs/PRODUCTION-ENV-CHECKLIST.md with Required/Dev/Optional sections
- [ ] T-088.2: Copy the final list from /env.example and mark required/optional
- [ ] T-088.3: Confirm each required value is set in Cloudflare Pages
References:
- /env.example
- /docs/PRODUCTION-ENV-CHECKLIST.md
Dependencies: T-087
Effort: XS

### T-106: Run Go/No-Go checklist before launch
Priority: P0
Type: RELEASE
Owner: Trevor
Status: BLOCKED
Blockers: T-086 (contact form verification) and T-089 (privacy/terms pages) must be completed first.
Context:
- Final gate to confirm launch readiness
Acceptance Criteria:
- [ ] T-106.1: Verify contact form works in deployed environment
- [ ] T-106.2: Confirm no missing env vars cause startup risk
- [ ] T-106.3: Confirm Privacy + Terms pages exist and load
- [ ] T-106.4: Confirm CI is installed (branch protection skipped per T-091)
- [ ] T-106.5: Complete launch smoke test checklist
- [ ] T-106.6: Confirm rollback steps are documented
- [ ] T-106.7: Confirm monitoring is enabled or intentionally disabled
- [ ] T-106.8: Confirm no broken links
References:
- /docs/LAUNCH-SMOKE-TEST.md
- /docs/ROLLBACK.md
- /docs/LAUNCH-VERIFICATION.md
Dependencies: T-086, T-088, T-089, T-090, T-092, T-093, T-094, T-107
Effort: XS

### T-107: Configure Cloudflare Pages deployment
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Cloudflare Pages configuration complete, needs dashboard setup
- wrangler.toml and deployment docs created
- Build scripts already exist in package.json
Acceptance Criteria:
- [ ] T-107.1: Log in to Cloudflare Dashboard and create Pages project
- [ ] T-107.2: Connect GitHub repository (TrevorPLam/your-dedicated-marketer)
- [ ] T-107.3: Configure build settings (command: npm run pages:build, output: .vercel/output/static)
- [ ] T-107.4: Set NODE_VERSION=20 and CLOUDFLARE_BUILD=true in environment variables
- [ ] T-107.5: Add all required secrets (UPSTASH_REDIS_REST_TOKEN, RESEND_API_KEY, SENTRY_AUTH_TOKEN)
- [ ] T-107.6: Add all required environment variables (UPSTASH_REDIS_REST_URL, SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT)
- [ ] T-107.7: Trigger first deployment and verify build succeeds
- [ ] T-107.8: Configure custom domain if applicable
References:
- /docs/CLOUDFLARE_DEPLOYMENT.md
- /wrangler.toml
- /.dev.vars.example
Dependencies: None
Effort: M

## 🟠 PHASE 1: Lead Capture Pipeline (Supabase + HubSpot) (P1)
> Replace email delivery with DB + CRM while preserving spam controls.

### T-080: Store leads in Supabase with suspicion metadata
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Blockers: None
Completed: 2026-01-12
Context:
- Replace email delivery with Supabase lead storage
- Must preserve current UX contract in `submitContactForm`
- Save suspicious submissions but flag them for later review
Acceptance Criteria:
- [ ] T-080.1: Insert lead into Supabase with `is_suspicious` + `suspicion_reason`
- [ ] T-080.2: Store submission metadata needed for downstream HubSpot sync
- [ ] T-080.3: Preserve current `submitContactForm` success/error UX contract
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-054, T-079
Effort: M

### T-081: Sync leads to HubSpot and record sync status
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Blockers: None (depends on T-080 implementation)
Completed: 2026-01-12
Context:
- Lead submissions should upsert into HubSpot CRM by email
- HubSpot failures must not break UX; retry should be possible
Acceptance Criteria:
- [ ] T-081.1: Upsert HubSpot contact by email and store HubSpot IDs in Supabase
- [ ] T-081.2: If HubSpot fails, return success and mark lead `hubspot_sync_status = 'needs_sync'`
- [ ] T-081.3: Store HubSpot sync attempt metadata for observability
References:
- /lib/actions.ts
- /lib/env.ts
Dependencies: T-055, T-080
Effort: M

---

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed; npm registry access is blocked (403) in this environment, so `npm install -g lighthouse` fails.
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
Acceptance Criteria:
- [x] T-058.1: Add a local Lighthouse config and script
- [ ] T-058.2: Capture baseline metrics for mobile (home/services/pricing/contact)
- [x] T-058.3: Define budgets as regression guards (not arbitrary hard fails)
- [x] T-058.4: Document targets in `/docs/OBSERVABILITY.md`
References:
- /docs/OBSERVABILITY.md
- /package.json
Dependencies: None
Effort: M

### T-070: Monitor and fix transitive build-tool vulnerabilities
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates; npm registry access in this environment returns 403 (confirmed via `npm view` and `scripts/npm-registry-check.mjs`, 2026-01-20).
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
- [x] T-070.3: Run `npm run check:npm-registry` and record the registry access result
References:
- /package.json
Dependencies: None
Effort: S

### T-101: Performance verification baseline (Lighthouse)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: BLOCKED
Blockers: T-058 is BLOCKED (Lighthouse CLI not installed).
Context:
- Capture baseline metrics for key pages
Acceptance Criteria:
- [ ] T-101.1: Run Lighthouse on Home and Contact (mobile)
- [ ] T-101.2: Record Performance/Accessibility/SEO scores in /docs/OBSERVABILITY.md
- [ ] T-101.3: Note top offenders for follow-up fixes
References:
- /docs/OBSERVABILITY.md
Dependencies: T-058
Effort: XS

### T-102: Accessibility validation (keyboard + focus)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: DONE
Blockers: None
Completed: 2026-01-11
Context:
- Confirm no obvious accessibility blockers before scaling
Acceptance Criteria:
- [x] T-102.1: Keyboard-only test (nav, menu, contact form)
- [x] T-102.2: Confirm focus visibility and order
- [x] T-102.3: Record results in /docs/ACCESSIBILITY.md
References:
- /docs/ACCESSIBILITY.md
- /components/Navigation.tsx
Dependencies: None
Effort: XS

_Completed (moved to TODOCOMPLETED.md on 2026-01-20): T-108, T-109._

### T-110: Add Sentry tracing spans for server actions + external calls
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Sentry is already integrated; tracing adds performance visibility
- Highlights slow external calls (Supabase/HubSpot) and bottlenecks
- Supports SLA monitoring for contact submissions
Acceptance Criteria:
- [ ] T-110.1: Add Sentry spans to contact form submission flow in `lib/actions.ts`
- [ ] T-110.2: Capture span attributes without PII (hashes only)
- [ ] T-110.3: Document tracing coverage in `/docs/OBSERVABILITY.md`
References:
- /lib/actions.ts
- /sentry.server.config.ts
- /docs/OBSERVABILITY.md
Dependencies: T-108
Effort: S

### T-111: Add bundle size regression guard
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Prevents silent performance regressions as the bundle grows
- Protects Core Web Vitals and Lighthouse scores
- Supports Diamond Standard performance goals
Acceptance Criteria:
- [ ] T-111.1: Wire `scripts/check-bundle-size.mjs` into `package.json` (new script)
- [ ] T-111.2: Document bundle size budget expectations in `/docs/OBSERVABILITY.md`
- [ ] T-111.3: Add guidance to `scripts/README.md` for running the bundle size check
References:
- /scripts/check-bundle-size.mjs
- /package.json
- /scripts/README.md
- /docs/OBSERVABILITY.md
Dependencies: None
Effort: S

### T-112: Harden CSP with nonce-based script handling
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Current CSP uses `unsafe-inline` for scripts; nonces strengthen XSS protection
- Aligns with security best practices for modern Next.js apps
- Reduces reliance on broad CSP exceptions
Acceptance Criteria:
- [ ] T-112.1: Implement CSP nonces in `middleware.ts` (or equivalent Next.js configuration)
- [ ] T-112.2: Remove `unsafe-inline` for scripts once nonces are in place
- [ ] T-112.3: Ensure GA4 scripts still load without CSP violations
- [ ] T-112.4: Document nonce usage and testing steps in `/docs/SECURITY-CSP-ANALYTICS.md`
References:
- /middleware.ts
- /app/layout.tsx
- /docs/SECURITY-CSP-ANALYTICS.md
Dependencies: None
Effort: L

### T-113: Add analytics consent gating (privacy compliance)
Priority: P2
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Analytics should honor consent requirements (GDPR/CCPA-ready)
- Provides opt-in control without breaking existing tracking
- Improves transparency for end users
Acceptance Criteria:
- [ ] T-113.1: Add consent state handling in client-side analytics init
- [ ] T-113.2: Update `app/layout.tsx` to conditionally load GA4 based on consent
- [ ] T-113.3: Provide UI or cookie-based preference storage for consent
- [ ] T-113.4: Document consent behavior in `/docs/OBSERVABILITY.md` and `/docs/PRIVACY_POLICY_TEMPLATE.md`
References:
- /app/layout.tsx
- /lib/analytics.ts
- /docs/OBSERVABILITY.md
- /docs/PRIVACY_POLICY_TEMPLATE.md
Dependencies: None
Effort: M

### T-114: Add retry policy + idempotency for HubSpot sync
Priority: P1
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- HubSpot sync failures should be retried automatically
- Idempotency prevents duplicate contacts on retries
- Reduces manual intervention for lead sync issues
Acceptance Criteria:
- [ ] T-114.1: Implement retry with backoff for HubSpot sync in `lib/actions.ts`
- [ ] T-114.2: Add idempotency key logic to avoid duplicate upserts
- [ ] T-114.3: Store retry attempts and final status in Supabase
- [ ] T-114.4: Add tests covering retry behavior and idempotency
References:
- /lib/actions.ts
- /__tests__/lib
- /docs/DEPLOYMENT.md
Dependencies: T-081
Effort: M
