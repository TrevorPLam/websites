
# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-08
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

## 🔴 PHASE 0: Build & Deploy Blockers (P0)
> These MUST be fixed before feature work, otherwise Cloudflare deploys will fail.

### T-050: Restore green local install/build/test
Priority: P0
Type: DEPENDENCY
Owner: AGENT
Status: DONE
Context:
- In this workspace, `npm run lint` failed with `next: not found` (suggests deps not installed)
- Need a known-good baseline before Cloudflare Pages integration
Acceptance Criteria:
- [x] T-050.1: Run `npm install` successfully (no registry 403)
- [x] T-050.2: Run `npm run build` successfully
- [x] T-050.3: Run `npm run test` successfully
- [x] T-050.4: Run `npm run type-check` successfully
- [x] T-050.5: Run `npm run lint` successfully
References:
- /package.json
Dependencies: None
Effort: S

### T-051: Unblock npm registry access (if installs fail)
Priority: P0
Type: DEPENDENCY
Owner: Trevor
Status: DONE
Context:
- Earlier repo history reported `npm install` returning 403 for type packages
- Cloudflare Pages builds will also fail if registry access is blocked
- **Verification**: `npm-registry-check.mjs` passes and `npm install` works locally.
Acceptance Criteria:
- [x] T-051.1: Provide registry/proxy credentials or allowlist so `npm install` succeeds
- [x] T-051.2: Confirm `npm install` works locally and in Cloudflare Pages build logs
References:
- /scripts/npm-registry-check.mjs
- /package.json
Dependencies: None
Effort: XS

### T-052: Enable Cloudflare Pages build (GitHub integration)
Priority: P0
Type: RELEASE
Owner: AGENT
Status: DONE
Context:
- Hosting target is Cloudflare Pages via GitHub integration
- Next.js App Router requires Cloudflare-compatible build output
- **Implementation Note**: Downgraded to Next.js 15.5.2 and ESLint 9 compatible config to ensure stability with `@cloudflare/next-on-pages`.
Acceptance Criteria:
- [x] T-052.1: Add Cloudflare Pages build instructions to `/docs/DEPLOYMENT.md`
- [x] T-052.2: Configure repo for Cloudflare Pages Next.js deployment (documented + reproducible)
- [x] T-052.3: Produce a successful Cloudflare Pages preview build (no runtime errors)
References:
- /docs/DEPLOYMENT.md
- /next.config.mjs
- /middleware.ts
Dependencies: T-050
Effort: M

---

## 🟠 PHASE 1: Lead Capture Pipeline (Supabase + HubSpot) (P1)
> Replace email delivery with DB + CRM while preserving spam controls.

### T-053: Migrate contact form pipeline to Supabase (DB) + HubSpot (CRM)
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Context:
- Chat decision: no email; save lead to Supabase (server-only) and sync to HubSpot CRM
- Must preserve current UX contract (success/error messages) in `submitContactForm`
- Save suspicious submissions but flag them (suspicious = too many requests)
Acceptance Criteria:
- [ ] T-053.1: Update schema so Name/Email/Phone are required (keep message required)
- [ ] T-053.2: Add env validation for Supabase + HubSpot server-only secrets
- [ ] T-053.3: Insert lead into Supabase with `is_suspicious` + `suspicion_reason`
- [ ] T-053.4: Upsert HubSpot contact by email; store HubSpot IDs + sync status in Supabase
- [ ] T-053.5: If HubSpot fails, return success and mark lead `hubspot_sync_status = 'needs_sync'`
- [ ] T-053.6: Update `scripts/check-client-secrets.mjs` to forbid new secret env names
- [ ] T-053.7: Remove email-send behavior from `lib/actions.ts` and remove unused Resend config/deps
- [ ] T-053.8: Add unit test(s) for: rate-limit flagged lead saved; HubSpot failure still returns success
References:
- /lib/actions.ts
- /lib/contact-form-schema.ts
- /components/ContactForm.tsx
- /lib/env.ts
- /env.example
- /scripts/check-client-secrets.mjs
Dependencies: T-054, T-055, T-050
Effort: L

### T-054: Provision Supabase project + provide server credentials
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
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

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
- Blocked: Lighthouse CLI unavailable in sandbox (npm registry 403 on install)
Acceptance Criteria:
- [x] T-058.1: Add a local Lighthouse config and script
- [ ] T-058.2: Capture baseline metrics for mobile (home/services/pricing/contact)
- [x] T-058.3: Define budgets as regression guards (not arbitrary hard fails)
- [x] T-058.4: Document targets in `/docs/OBSERVABILITY.md`
References:
- /docs/OBSERVABILITY.md
- /package.json
Dependencies: T-050
Effort: M

### T-060: E2E tests for critical user journeys
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Diamond Standard requires confidence in core flows
- Contact flow is security + lead-critical; search/404 are UX-critical
Acceptance Criteria:
- [ ] T-060.1: Add E2E test for contact submission success
- [ ] T-060.2: Add E2E test for rate limiting behavior (suspicious flag path)
- [ ] T-060.3: Add E2E test for 404 page
- [ ] T-060.4: Add E2E test for search with no results
References:
- /tests/
- /components/ContactForm.tsx
Dependencies: T-053
Effort: M

### T-061: Unit test coverage threshold for critical paths
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Diamond Standard expects meaningful unit coverage on critical components
Acceptance Criteria:
- [ ] T-061.1: Set coverage thresholds in `/vitest.config.ts`
- [ ] T-061.2: Add unit tests for key components (Hero, ValueProps, ServicesOverview, SocialProof)
References:
- /vitest.config.ts
- /__tests__/components/
- /components/
Dependencies: T-050
Effort: L

### T-062: Structured data for SEO (Article/Service/Breadcrumb)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Diamond Standard SEO: structured data improves rich results + clarity
Acceptance Criteria:
- [ ] T-062.1: Add Article schema to blog posts
- [ ] T-062.2: Add Service schema to service pages
- [ ] T-062.3: Add BreadcrumbList schema where breadcrumbs exist
- [ ] T-062.4: Validate via Google Rich Results Test
References:
- /app/blog/
- /app/services/
- /components/Breadcrumbs.tsx
Dependencies: T-050
Effort: M

### T-063: Image optimization audit (next/image)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Images are a common performance bottleneck
Acceptance Criteria:
- [ ] T-063.1: Convert any `<img>` tags to `next/image` where appropriate
- [ ] T-063.2: Ensure explicit sizes + lazy loading + `priority` for above-fold hero
- [ ] T-063.3: Document guidelines in `/docs/UI_DESIGN_SYSTEM.md`
References:
- /components/
- /app/
- /docs/UI_DESIGN_SYSTEM.md
Dependencies: T-050
Effort: M

### T-064: Analytics provider selection and rollout
Priority: P2
Type: QUALITY
Owner: Trevor
Status: READY
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

---

## 🟦 PHASE 3: Release Hygiene (P2)
> Make releases repeatable and safe.

### T-065: Update deployment docs for Cloudflare Pages + secrets
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- `/docs/DEPLOYMENT.md` is currently a template
- Needs to reflect actual Cloudflare Pages process and required env vars
Acceptance Criteria:
- [ ] T-065.1: Document Cloudflare Pages build settings (build cmd, output, Node version)
- [ ] T-065.2: Document required env vars (Supabase, HubSpot, Sentry, Upstash)
- [ ] T-065.3: Document rollback procedure
- [ ] T-065.4: Document DNS/domain setup checklist
References:
- /docs/DEPLOYMENT.md
- /env.example
Dependencies: T-052
Effort: S


### T-066: Create mobile-first smoke test checklist
Priority: P1
Type: RELEASE
Owner: AGENT
Status: READY
Context:
- Need a manual verification script for releases until E2E coverage is 100%
- Critical flows: Contact Form, Navigation, Mobile Menu, SEO tags
Acceptance Criteria:
- [ ] T-066.1: Create `/docs/ops/SMOKE_TEST.md`
- [ ] T-066.2: Include strict mobile viewport tests (hamburger menu, touch targets)
- [ ] T-066.3: Include critical user journey steps (Lead Capture)
- [ ] T-066.4: Include basic SEO check (Title, Meta, OG Image)
References:
- /docs/ops/
Dependencies: None
Effort: XS

### T-067: Consolidate deployment documentation
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- We have `docs/DEPLOYMENT.md` (template) and `docs/ops/DEPLOYMENT.md` (detailed).
- Confusing for agents which one to follow.
Acceptance Criteria:
- [ ] T-067.1: Merge unique value from `docs/ops/DEPLOYMENT.md` into `docs/DEPLOYMENT.md`
- [ ] T-067.2: Archive `docs/ops/DEPLOYMENT.md` or make it the source of truth
- [ ] T-067.3: Update `DOCS_INDEX.md` to point to the single source of truth
References:
- /docs/DEPLOYMENT.md
- /docs/ops/DEPLOYMENT.md
Dependencies: None
Effort: S

### T-068: Archive historical roadmaps
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- `docs/product/DEVELOPMENT-ROADMAP.md` contains historical checks.
- `docs/GAME-PLAN-100.md` is a mix of status and plan.
- Should move completed/stale planning docs to `docs/ARCHIVE/` to prevent task leakage confusion.
Acceptance Criteria:
- [ ] T-068.1: Move `docs/product/DEVELOPMENT-ROADMAP.md` to `docs/ARCHIVE/product/`
- [ ] T-068.2: Add "ARCHIVED" header to moved files if not present
References:
- /docs/product/DEVELOPMENT-ROADMAP.md
Dependencies: None
Effort: XS

### T-069: Update Next.js to fix critical vulnerabilities
Priority: P0
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- npm audit reports critical CVEs in next@15.5.2 (RCE, Source Exposure).
- Must update to >=15.5.9.
- Constraint: Must stay on Next.js 15.x for Cloudflare Pages compatibility (do not upgrade to 16.x yet).
Acceptance Criteria:
- [ ] T-069.1: Update `package.json` to use `next@15.5.9` (or latest 15.x patch)
- [ ] T-069.2: Run `npm install`
- [ ] T-069.3: Run `npm audit` to verify criticals are gone
- [ ] T-069.4: Run `npm run build` to verify Cloudflare compatibility
References:
- /package.json
Dependencies: None
Effort: S

### T-070: Monitor and fix transitive build-tool vulnerabilities
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
- Need to wait for Cloudflare execution environment updates or adapter updates.
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
References:
- /package.json
Dependencies: None
Effort: S

---

## 🟣 PHASE 4: AI Deep Dive Findings (Discovered 2026-01-07)
> Tasks discovered during comprehensive codebase analysis. See docs/AI_DEEP_DIVE_FINDINGS.md for details.

### T-071: Fix hardcoded URLs in structured data
Priority: P1
Type: BUG
Owner: AGENT
Status: READY
Context:
- Breadcrumbs.tsx and blog/[slug]/page.tsx use hardcoded "yourdedicatedmarketer.com" in schema.org data
- Should use getPublicBaseUrl() for environment-aware URLs
- Affects SEO structured data accuracy
Acceptance Criteria:
- [ ] T-071.1: Update Breadcrumbs.tsx to use getPublicBaseUrl() in structuredData
- [ ] T-071.2: Update blog/[slug]/page.tsx articleStructuredData to use getPublicBaseUrl()
- [ ] T-071.3: Verify structured data renders correctly with Rich Results Test
References:
- /components/Breadcrumbs.tsx
- /app/blog/[slug]/page.tsx
- /lib/env.public.ts
Dependencies: None
Effort: XS
### T-072: Create missing legal pages (privacy, terms)
Priority: P2
Type: FEATURE
Owner: Trevor
Status: READY
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

### T-073: Handle support services "coming soon" pages
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Context:
- Services page links to /services/strategy, /services/crm, /services/funnel, /services/reporting
- These routes don't exist (404)
- Options: create pages, show "coming soon", or remove links
Acceptance Criteria:
- [ ] T-073.1: Create placeholder pages with "coming soon" content, OR
- [ ] T-073.2: Remove supportServices links from services page
References:
- /app/services/page.tsx
Dependencies: None
Effort: S

### T-074: Add active link highlighting to Navigation
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Context:
- Navigation links don't indicate current page
- Improves UX by showing user where they are
Acceptance Criteria:
- [ ] T-074.1: Use usePathname() to detect current route
- [ ] T-074.2: Add active styles to matching nav link
- [ ] T-074.3: Test on all pages
References:
- /components/Navigation.tsx
Dependencies: None
Effort: XS

### T-075: Add case studies to search index
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Context:
- Search includes blog posts and static pages but not case studies
- Easy enhancement to improve site search
Acceptance Criteria:
- [ ] T-075.1: Import caseStudies from lib/case-studies.ts
- [ ] T-075.2: Map case studies to SearchItem format
- [ ] T-075.3: Include in getSearchIndex() return
References:
- /lib/search.ts
- /lib/case-studies.ts
Dependencies: None
Effort: XS

### T-076: Fix honeypot logging as error
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Context:
- Honeypot field triggers ZodError which logs as error in actions.ts
- Should be handled as spam detection (warn level), not error
- Creates noise in error monitoring
Acceptance Criteria:
- [ ] T-076.1: Move honeypot check before Zod parse, OR
- [ ] T-076.2: Catch honeypot ZodError specifically and log as warn
- [ ] T-076.3: Add test for honeypot logging behavior
References:
- /lib/actions.ts
- /__tests__/lib/actions.rate-limit.test.ts
Dependencies: None
Effort: XS

### T-077: Add focus trap to mobile navigation menu
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Mobile menu doesn't trap focus (accessibility gap)
- Users can tab to elements behind the menu overlay
Acceptance Criteria:
- [ ] T-077.1: Implement focus trap when mobile menu is open
- [ ] T-077.2: Focus first focusable element when menu opens
- [ ] T-077.3: Return focus to hamburger button when menu closes
References:
- /components/Navigation.tsx
Dependencies: None
Effort: S

### T-078: Delete backup and unused files
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
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
