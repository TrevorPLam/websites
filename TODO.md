# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-09
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

### T-064: Analytics provider selection and rollout
Priority: P2
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

### T-072: Create missing legal pages (privacy, terms)
Priority: P2
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
- [ ] T-072.4: Create app/privacy/page.tsx and app/terms/page.tsx (if proceeding)
References:
- /components/Footer.tsx
- /app/
Dependencies: None
Effort: M

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
Status: READY
Blockers: None
Context:
- eslint.config.mjs.bak is a backup file from ESLint migration
- Clean up to reduce repo clutter
Acceptance Criteria:
- [ ] T-078.1: Delete eslint.config.mjs.bak
- [ ] T-078.2: Verify pre-commit-config.yaml is in use or delete it
References:
- /eslint.config.mjs.bak
- /pre-commit-config.yaml
Dependencies: None
Effort: XS
