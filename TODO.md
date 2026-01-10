# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-10
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (from chat)
- Site: High-performance marketing site for “Your Dedicated Marketer”
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

### T-084: Define v1 launch scope and lead capture definition
Priority: P0
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Prevent scope creep before launch
- Aligns lead capture expectations with the implementation plan
Acceptance Criteria:
- [ ] T-084.1: Decide what “lead capture” means for v1 (email-only vs Supabase + HubSpot)
- [ ] T-084.2: Decide whether analytics is required at launch
- [ ] T-084.3: Write a 5-line “Launch Scope v1” note in /docs/LAUNCH-SCOPE-V1.md
- [ ] T-084.4: Confirm the scope note answers “If this fails on launch day, what breaks the business?”
References:
- /docs/
- /TODO.md
Dependencies: None
Effort: XS

### T-085: Align contact pipeline implementation to the v1 scope decision
Priority: P0
Type: RELEASE
Owner: AGENT
Status: BLOCKED
Blockers: Requires v1 lead capture decision (T-084).
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

### T-087: Align env validation and env.example with production reality
Priority: P0
Type: RELEASE
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Prevent startup failures caused by mismatched env requirements
- Ensure new deploys only need required vars
Acceptance Criteria:
- [x] T-087.1: Align env validation (required vs optional) with current runtime behavior
- [x] T-087.2: Update /env.example to include every required variable
- [x] T-087.3: Annotate each env var in /env.example as required/optional/future
- [x] T-087.4: Verify a fresh deploy with only required vars starts successfully
References:
- /lib/env.ts
- /env.example
Dependencies: None
Effort: S

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
Status: READY
Blockers: Launch tasks must be completed.
Context:
- Final gate to confirm launch readiness
Acceptance Criteria:
- [ ] T-106.1: Verify contact form works in deployed environment
- [ ] T-106.2: Confirm no missing env vars cause startup risk
- [ ] T-106.3: Confirm Privacy + Terms pages exist and load
- [ ] T-106.4: Confirm CI is installed and required for merges
- [ ] T-106.5: Complete launch smoke test checklist
- [ ] T-106.6: Confirm rollback steps are documented
- [ ] T-106.7: Confirm monitoring is enabled or intentionally disabled
- [ ] T-106.8: Confirm no broken links
References:
- /docs/LAUNCH-SMOKE-TEST.md
- /docs/ROLLBACK.md
- /docs/LAUNCH-VERIFICATION.md
Dependencies: T-086, T-088, T-089, T-090, T-092, T-093, T-094
Effort: XS

## 🟠 PHASE 1: Lead Capture Pipeline (Supabase + HubSpot) (P1)
> Replace email delivery with DB + CRM while preserving spam controls.

### T-054: Provision Supabase project + provide server credentials
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Supabase will store leads (server-only access)
- Requires Supabase project + keys configured in Cloudflare Pages environment variables
Acceptance Criteria:
- [ ] T-054.1: Create Supabase project
- [ ] T-054.2: Provide `SUPABASE_URL`
- [ ] T-054.3: Provide `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [ ] T-054.4: Create `leads` table (or approve SQL migration plan)
References:
- /env.example
- /docs/DEPLOYMENT.md
Dependencies: None
Effort: S

### T-055: Provision HubSpot private app token + field mapping
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- HubSpot is the CRM target; contact records should be created/updated on submission
- Requires a private app token stored as a Cloudflare Pages server-only env var
Acceptance Criteria:
- [ ] T-055.1: Create HubSpot private app
- [ ] T-055.2: Provide `HUBSPOT_PRIVATE_APP_TOKEN` (server-only)
- [ ] T-055.3: Confirm mapping for required fields: Name, Email, Phone
References:
- /docs/DEPLOYMENT.md
- /env.example
Dependencies: None
Effort: XS

### T-080: Store leads in Supabase with suspicion metadata
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Supabase project/table + credentials needed (T-054).
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
Status: BLOCKED
Blockers: HubSpot token required (T-055) and Supabase storage (T-080).
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

### T-082: Remove email pipeline and add tests for new lead flow
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Supabase + HubSpot flow required first (T-080, T-081).
Context:
- Email sending is no longer part of the contact pipeline
- New flow needs tests for suspicious handling + HubSpot failure behavior
Acceptance Criteria:
- [ ] T-082.1: Remove email-send behavior from `lib/actions.ts`
- [ ] T-082.2: Remove unused Resend config/deps
- [ ] T-082.3: Add unit test(s) for: rate-limit flagged lead saved; HubSpot failure still returns success
References:
- /lib/actions.ts
- /__tests__/lib/actions.rate-limit.test.ts
- /package.json
Dependencies: T-080, T-081
Effort: S

---

### T-072: Create missing legal pages (privacy, terms)
Priority: P1
Type: FEATURE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Footer links to /privacy and /terms pages that don't exist
- Required for legal compliance and user trust
- Alternatively, remove links until content is ready
Acceptance Criteria:
- [ ] T-072.1: Decide: create pages or remove links
- [ ] T-072.2: If creating: provide privacy policy content
- [ ] T-072.3: If creating: provide terms of service content
References:
- /components/Footer.tsx
- /app/
Dependencies: None
Effort: M

### T-089: Implement privacy + terms pages and footer links
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Requires legal copy and decision (T-072).
Context:
- Legal pages must exist before launch
- Footer links should not 404
Acceptance Criteria:
- [ ] T-089.1: Create /app/privacy/page.tsx and /app/terms/page.tsx using provided copy
- [ ] T-089.2: Ensure /components/Footer.tsx links resolve without 404s
- [ ] T-089.3: Add basic SEO metadata to privacy/terms pages
References:
- /app/
- /components/Footer.tsx
Dependencies: T-072
Effort: S

### T-090: Add GitHub Actions CI workflow (stored under githubactions/)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- CI should run on PR + main to catch lint/test/build failures
- GitHub Actions are off by default; workflows must live in /githubactions/
Acceptance Criteria:
- [x] T-090.1: Add CI workflow file under /githubactions/ that runs install, lint, test, build
- [x] T-090.2: Document enable/disable steps in /githubactions/README.md
- [x] T-090.3: Ensure the workflow fails on typecheck/lint/test errors
References:
- /githubactions/README.md
- /package.json
Dependencies: None
Effort: S

### T-091: Enforce branch protection rules in GitHub
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: CI workflow available (T-090).
Context:
- Prevent broken code from merging to main
Acceptance Criteria:
- [ ] T-091.1: Require PR before merge
- [ ] T-091.2: Require CI status checks (new workflow) to pass
- [ ] T-091.3: Require at least 1 approval (optional but recommended)
- [ ] T-091.4: Block force pushes
References:
- /githubactions/README.md
Dependencies: T-090
Effort: XS

### T-092: Create launch smoke test checklist
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Launch should have a quick, repeatable verification list
Acceptance Criteria:
- [ ] T-092.1: Create /docs/LAUNCH-SMOKE-TEST.md with page, nav, forms, perf, and 404 checks
- [ ] T-092.2: Ensure the checklist can be completed in <10 minutes
References:
- /docs/LAUNCH-SMOKE-TEST.md
Dependencies: None
Effort: XS

### T-093: Document rollback procedure
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Rollbacks should be fast and deterministic
Acceptance Criteria:
- [ ] T-093.1: Create /docs/ROLLBACK.md with Cloudflare Pages rollback steps
- [ ] T-093.2: Include verification steps for confirming rollback success
- [ ] T-093.3: Optional dry run on a preview branch
References:
- /docs/ROLLBACK.md
Dependencies: None
Effort: XS

### T-094: Decide on Sentry usage and configure production env
Priority: P1
Type: QUALITY
Owner: Trevor
Status: READY
Blockers: None
Context:
- Monitoring must be intentional before launch
Acceptance Criteria:
- [ ] T-094.1: Decide to enable Sentry now or disable until later
- [ ] T-094.2: If enabling, confirm Sentry project + DSN
- [ ] T-094.3: Set required Sentry env vars in production
References:
- /sentry.client.config.ts
- /sentry.server.config.ts
- /sentry.edge.config.ts
- /lib/logger.ts
Dependencies: None
Effort: XS

### T-095: Validate monitoring captures production errors
Priority: P1
Type: QUALITY
Owner: Trevor
Status: READY
Blockers: Sentry decision/configuration (T-094).
Context:
- Need proof that errors are visible during launch
Acceptance Criteria:
- [ ] T-095.1: Trigger a controlled error in preview or production
- [ ] T-095.2: Confirm the error appears in Sentry (or chosen tool)
- [ ] T-095.3: Remove any test triggers after verification
References:
- /lib/logger.ts
Dependencies: T-094
Effort: XS

### T-096: Provision Upstash Redis for rate limiting
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Distributed rate limiting prevents spam in production
Acceptance Criteria:
- [ ] T-096.1: Create Upstash Redis instance
- [ ] T-096.2: Provide UPSTASH_REDIS_REST_URL
- [ ] T-096.3: Provide UPSTASH_REDIS_REST_TOKEN
References:
- /env.example
- /lib/env.ts
Dependencies: None
Effort: XS

### T-097: Wire distributed rate limiting with Upstash
Priority: P1
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Upstash credentials required (T-096).
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

### T-064: Analytics provider selection and rollout
Priority: P1
Type: QUALITY
Owner: Trevor
Status: READY
Blockers: None
Context:
- Diamond Standard marketing site should have conversion tracking
- Provider choice required (GA4/Plausible/etc.)
Acceptance Criteria:
- [ ] T-064.1: Choose analytics provider
- [ ] T-064.2: Provide `NEXT_PUBLIC_ANALYTICS_ID` (if needed)
- [ ] T-064.3: Confirm which events/conversions to track (contact submit, CTA clicks)
References:
- /lib/analytics.ts
- /lib/env.ts
Dependencies: None
Effort: XS

### T-098: Install analytics provider and track conversions
Priority: P1
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Analytics provider selection (T-064).
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

### T-083: Add URL sanitization helper for user-provided links
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Prevent unsafe URL schemes in future link inputs
- Remove inline TODO in lib/sanitize.ts by implementing the helper
Acceptance Criteria:
- [x] T-083.1: Add sanitizeUrl() in lib/sanitize.ts with http/https allowlist
- [x] T-083.2: Add unit tests for sanitizeUrl() edge cases
- [x] T-083.3: Update sanitize.ts coverage checklist to reflect completion
References:
- /lib/sanitize.ts
- /__tests__/lib/sanitize.test.ts
Dependencies: None
Effort: XS

### T-099: Documentation vs reality cleanup
Priority: P2
Type: DOCS
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Reduce confusion between docs and actual deployment behavior
- Remove or clarify unused or misleading documentation
Acceptance Criteria:
- [x] T-099.1: Identify misleading/duplicate docs and remove or update them
- [x] T-099.2: Ensure README + env docs match actual deployment behavior
- [x] T-099.3: Remove unused features/routes that increase confusion or risk
References:
- /README.md
- /docs/
- /app/
Dependencies: None
Effort: M

### T-100: Security cleanup after launch integrations
Priority: P2
Type: SECURITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Ensure CSP and routes remain tight after analytics and other integrations
Acceptance Criteria:
- [x] T-100.1: Review OG image route and harden/remove if unnecessary
- [x] T-100.2: Re-check CSP after analytics integration
- [x] T-100.3: Remove overly-broad CSP allowances
References:
- /middleware.ts
- /next.config.mjs
- /lib/analytics.ts
- /docs/SECURITY-CSP-ANALYTICS.md
Dependencies: T-098
Effort: S

### T-101: Performance verification baseline (Lighthouse)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: READY
Blockers: Lighthouse setup in T-058.
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
Status: READY
Blockers: None
Context:
- Confirm no obvious accessibility blockers before scaling
Acceptance Criteria:
- [ ] T-102.1: Keyboard-only test (nav, menu, contact form)
- [ ] T-102.2: Confirm focus visibility and order
- [ ] T-102.3: Record results in /docs/ACCESSIBILITY.md
References:
- /docs/ACCESSIBILITY.md
- /components/Navigation.tsx
Dependencies: None
Effort: XS

## 🟦 PHASE 3: Enhancements (P3)
> Nice-to-have improvements for Diamond Standard.

### T-075: Add case studies to search index
Priority: P3
Type: FEATURE
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Search includes blog posts and static pages but not case studies
- Easy enhancement to improve site search
Acceptance Criteria:
- [x] T-075.1: Import caseStudies from lib/case-studies.ts
- [x] T-075.2: Map case studies to SearchItem format
- [x] T-075.3: Include in getSearchIndex() return
References:
- /lib/search.ts
- /lib/case-studies.ts
Dependencies: None
Effort: XS

### T-077: Add focus trap to mobile navigation menu
Priority: P3
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Mobile menu doesn't trap focus (accessibility gap)
- Users can tab to elements behind the menu overlay
Acceptance Criteria:
- [x] T-077.1: Implement focus trap when mobile menu is open
- [x] T-077.2: Focus first focusable element when menu opens
- [x] T-077.3: Return focus to hamburger button when menu closes
References:
- /components/Navigation.tsx
Dependencies: None
Effort: S

### T-078: Delete backup and unused files
Priority: P3
Type: CHORE
Owner: AGENT
Status: DONE
Blockers: None
Context:
- eslint.config.mjs.bak is a backup file from ESLint migration
- Clean up to reduce repo clutter
Acceptance Criteria:
- [x] T-078.1: Delete eslint.config.mjs.bak
- [x] T-078.2: Verify pre-commit-config.yaml is in use or delete it
References:
- /eslint.config.mjs.bak
- /pre-commit-config.yaml
Dependencies: None
Effort: XS

### T-103: Expand tests for critical paths
Priority: P3
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Expand coverage for lead pipeline, rate limiting, and contact flow
Acceptance Criteria:
- [x] T-103.1: Add unit tests for lead pipeline integrations
- [x] T-103.2: Add an E2E test for contact submit on preview deploy
- [x] T-103.3: Add rate limit test coverage for Upstash path
References:
- /__tests__/lib/actions.rate-limit.test.ts
- /lib/actions.ts
- /tests/
Dependencies: T-085, T-097
Effort: M

### T-104: Dependency hygiene and audit cadence
Priority: P3
Type: DEPENDENCY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Keep dependencies healthy and update-ready
Acceptance Criteria:
- [x] T-104.1: Add npm audit to CI pipeline
- [x] T-104.2: Document monthly dependency review process
References:
- /package.json
- /githubactions/
- /docs/DEPENDENCIES.md
Dependencies: T-090
Effort: S

### T-105: Governance automation (optional)
Priority: P3
Type: QUALITY
Owner: AGENT
Status: DONE
Blockers: None
Context:
- Automate governance checks to reduce drift
Acceptance Criteria:
- [x] T-105.1: Add CI rule to flag TODO comments if policy requires it
- [x] T-105.2: Document optional pre-commit hooks for lint/formatting
References:
- /githubactions/
- /docs/CONTRIBUTING.md
- /scripts/check-todo-comments.mjs
Dependencies: T-090
Effort: S
