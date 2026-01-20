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

### T-097: Wire distributed rate limiting with Upstash
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Ensure rate limiting works in multi-instance production
Acceptance Criteria:
- [ ] T-097.1: Ensure limiter uses Upstash when credentials exist
- [ ] T-097.2: Ensure fallback behavior is logged/documented for missing credentials
- [ ] T-097.3: Update docs to explain production vs dev limiter behavior
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-096
Effort: S

### T-098: Install analytics provider and track conversions
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Launch should have visibility into traffic and conversions
Acceptance Criteria:
- [ ] T-098.1: Install provider script and ensure it loads without console errors
- [ ] T-098.2: Track contact form submissions as conversion events
- [ ] T-098.3: Update CSP to allow provider (if needed)
- [ ] T-098.4: Document the implementation in /docs/OBSERVABILITY.md
References:
- /lib/analytics.ts
- /lib/env.ts
- /docs/OBSERVABILITY.md
Dependencies: T-064
Effort: S

---

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed (install globally or set `LIGHTHOUSE_BIN`).
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
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates.
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
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
