# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-21
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

## Task Assessment Notes (2026-01-21)
- Reviewed existing tasks (T-080 through T-107); priorities align with release blockers and lead-capture requirements, so no priority corrections were required.
- Added audit-derived tasks from `WRONG.md` with priorities mapped to the audit severity: CRITICAL → P0, HIGH/MAJOR → P1, MEDIUM → P2, MINOR/DEAD-CODE → P3.

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

### T-113: Fix ErrorBoundary infinite reload loop
Priority: P0
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-001 flags an infinite refresh loop when errors persist.
- Users can be trapped in the ErrorBoundary with no recovery path.
Acceptance Criteria:
- [ ] T-113.1: Replace `window.location.reload()` with a safe navigation or retry-limited recovery flow.
- [ ] T-113.2: Add a regression test that prevents the infinite loop scenario.
- [ ] T-113.3: Update any relevant docs or comments describing the recovery behavior.
References:
- /components/ErrorBoundary.tsx
- /WRONG.md
Dependencies: None
Effort: S

### T-114: Add CSP nonce fallback in layout
Priority: P0
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-002 notes the app crashes if the CSP nonce header is missing.
- Middleware failures should not hard-crash the app.
Acceptance Criteria:
- [ ] T-114.1: Provide a fallback nonce when the header is missing, with a logged warning.
- [ ] T-114.2: Add coverage to ensure missing nonce does not crash the app.
- [ ] T-114.3: Document the fallback behavior in deployment or security docs.
References:
- /app/layout.tsx
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-115: Locate and fix missing `vi` import in tests
Priority: P0
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- WRONG.md mentions a critical test failure caused by a missing Vitest `vi` import.
- The exact file is not specified and must be located safely.
Acceptance Criteria:
- [ ] T-115.1: Identify the test file(s) using `vi` without importing it.
- [ ] T-115.2: Add the correct import and ensure the test passes.
- [ ] T-115.3: Add or update lint/test guidance to prevent recurrence.
References:
- /__tests__
- /WRONG.md
Dependencies: None
Effort: XS

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

### T-116: Fix blog date sorting + frontmatter validation
Priority: P1
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-003/004/005 show incorrect sorting and crashes when blog dates/frontmatter are invalid.
- Blog rendering should remain stable even with malformed content.
Acceptance Criteria:
- [ ] T-116.1: Sort posts using validated date parsing (no string comparison).
- [ ] T-116.2: Validate required frontmatter fields and handle invalid posts safely.
- [ ] T-116.3: Guard blog date formatting in page rendering with safe fallback behavior.
- [ ] T-116.4: Add tests for valid, missing, and invalid date/frontmatter cases.
References:
- /lib/blog.ts
- /app/blog/[slug]/page.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-117: Harden HubSpot + Supabase response validation
Priority: P1
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-006/007 shows array access and ID validation gaps in external responses.
- Invalid responses should be handled gracefully with explicit errors.
Acceptance Criteria:
- [ ] T-117.1: Verify HubSpot search responses are arrays before indexing.
- [ ] T-117.2: Validate Supabase insert responses to ensure IDs are valid strings.
- [ ] T-117.3: Add tests for malformed HubSpot/Supabase responses.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-118: Extract rate limiting module from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit notes the `lib/actions.ts` god object and rate limiter initialization complexity.
- Rate limiting should be isolated and testable.
Acceptance Criteria:
- [ ] T-118.1: Move rate limiter initialization and helpers into a dedicated module.
- [ ] T-118.2: Update server actions to consume the new module.
- [ ] T-118.3: Add unit tests for rate limiter behavior.
References:
- /lib/actions.ts
- /lib (new module)
- /WRONG.md
Dependencies: None
Effort: M

### T-119: Extract validation + security helpers from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit highlights deep nesting and mixed concerns for IP/CSRF validation.
- Validation logic should be reusable and easier to audit.
Acceptance Criteria:
- [ ] T-119.1: Extract CSRF validation, IP parsing, and header validation into a dedicated module.
- [ ] T-119.2: Update actions to call the new validation helpers.
- [ ] T-119.3: Add tests for invalid/edge-case header and IP inputs.
References:
- /lib/actions.ts
- /lib (new module)
- /WRONG.md
Dependencies: None
Effort: M

### T-120: Extract persistence + CRM adapters from lib/actions.ts
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags direct fetch calls and duplicate Supabase header building.
- External integrations should be isolated behind adapters.
Acceptance Criteria:
- [ ] T-120.1: Create Supabase lead repository module with shared header builder.
- [ ] T-120.2: Create HubSpot adapter module to avoid direct fetch usage in actions.
- [ ] T-120.3: Update submit flow to use adapters and add adapter tests/mocks.
References:
- /lib/actions.ts
- /lib (new modules)
- /WRONG.md
Dependencies: T-118, T-119
Effort: M

### T-121: Create contact form orchestration layer
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit highlights submitContactForm complexity, multiple dependencies, and action file size.
- Orchestration should reduce coupling and clarify flow.
Acceptance Criteria:
- [ ] T-121.1: Create a focused orchestration module that composes validation, rate limiting, and persistence.
- [ ] T-121.2: Reduce `lib/actions.ts` size and responsibilities to a thin entry point.
- [ ] T-121.3: Replace magic strings/identifiers with shared helpers or types.
- [ ] T-121.4: Add integration tests covering success, validation error, and HubSpot failure flows.
References:
- /lib/actions.ts
- /lib (new modules)
- /WRONG.md
Dependencies: T-118, T-119, T-120
Effort: L

### T-122: Refactor Navigation component complexity
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags Navigation as a god component with focus trap and active link complexity.
- Bugs include memory leak and path normalization edge cases.
Acceptance Criteria:
- [ ] T-122.1: Extract focus trap and key handling into a reusable hook.
- [ ] T-122.2: Fix event listener cleanup to prevent memory leaks.
- [ ] T-122.3: Normalize active link logic to handle edge cases.
- [ ] T-122.4: Add tests for focus trap and active link behavior.
References:
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-123: Refactor ContactForm component for DRY + separation
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags ContactForm for repetition and feature envy of server actions.
- Form behavior should be centralized in a hook or helper.
Acceptance Criteria:
- [ ] T-123.1: Extract repeated input field rendering into a shared component or config map.
- [ ] T-123.2: Move submit logic into a dedicated hook/service to reduce UI coupling.
- [ ] T-123.3: Add/update unit tests for the refactored component and hook.
References:
- /components/ContactForm.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-124: Refactor logger sanitization and record building
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit calls out sanitizeValue complexity, sensitive key checks, and buildLogRecord complexity.
- Logging must remain safe while reducing complexity.
Acceptance Criteria:
- [ ] T-124.1: Split sanitizeValue into smaller helpers covering object/array cases.
- [ ] T-124.2: Harden sensitive key detection with clearer rule set and tests.
- [ ] T-124.3: Simplify buildLogRecord and update related tests.
References:
- /lib/logger.ts
- /__tests__/lib/logger.test.ts
- /WRONG.md
Dependencies: None
Effort: M

### T-125: Refactor middleware for clarity and guardrails
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags middleware size, magic numbers, and NaN content-length handling.
- Middleware should be simpler and safer.
Acceptance Criteria:
- [ ] T-125.1: Extract security header configuration into helper(s).
- [ ] T-125.2: Guard against NaN content-length values in size checks.
- [ ] T-125.3: Replace magic numbers with named constants and update docs/tests.
References:
- /middleware.ts
- /WRONG.md
Dependencies: None
Effort: M

### T-126: Streamline environment validation structure
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags `lib/env.ts` as overlong with mixed concerns.
- Validation logic should be easier to scan and maintain.
Acceptance Criteria:
- [ ] T-126.1: Extract schema and production checks into focused helpers/modules.
- [ ] T-126.2: Preserve existing validation behavior and tests.
- [ ] T-126.3: Update docs to reflect the new structure.
References:
- /lib/env.ts
- /WRONG.md
Dependencies: None
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

### T-127: Stabilize SearchDialog focus and tag rendering
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-009 and BUG-015 call out focus race conditions and unsafe tag joins.
- Search UX should be stable under keyboard navigation and missing tags.
Acceptance Criteria:
- [ ] T-127.1: Remove brittle timing assumptions in focus management.
- [ ] T-127.2: Guard tag join logic when tags are undefined.
- [ ] T-127.3: Add unit tests for keyboard focus and tag edge cases.
References:
- /components/SearchDialog.tsx
- /WRONG.md
Dependencies: None
Effort: S

### T-128: Guard analytics gtag usage with type checks
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-012 flags unsafe access of `window.gtag`.
- Analytics should fail safely without runtime errors.
Acceptance Criteria:
- [ ] T-128.1: Add safe type guards before calling gtag.
- [ ] T-128.2: Add tests covering missing gtag scenarios.
References:
- /lib/analytics.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-129: Support relative URLs in sanitizeUrl
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-013 notes sanitizeUrl rejects relative URLs.
- Internal paths should be supported safely.
Acceptance Criteria:
- [ ] T-129.1: Allow safe relative URLs in sanitizeUrl.
- [ ] T-129.2: Add tests for relative and invalid URL cases.
References:
- /lib/sanitize.ts
- /__tests__/lib/sanitize.test.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-130: Fix blog structured data image references
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-016 indicates structured data points to non-existent images.
- Invalid image URLs reduce SEO quality.
Acceptance Criteria:
- [ ] T-130.1: Ensure structured data uses existing image assets or omit image when unavailable.
- [ ] T-130.2: Add tests or build checks to catch missing image references.
References:
- /components/BlogPostContent.tsx
- /WRONG.md
Dependencies: None
Effort: S

### T-131: Correct IP hashing + empty IP handling
Priority: P2
Type: BUG
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit BUG-017/018 identify wrong salt variable usage and empty IP handling.
- IP hashing should be deterministic and safe.
Acceptance Criteria:
- [ ] T-131.1: Fix salt variable usage in IP hashing.
- [ ] T-131.2: Handle empty IP strings without returning misleading `unknown`.
- [ ] T-131.3: Add tests for empty/invalid IP inputs.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-132: Introduce typed identifiers for email/IP rate limits
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags primitive string identifiers for email/IP (risk of mix-ups).
- Typed identifiers improve clarity and safety.
Acceptance Criteria:
- [ ] T-132.1: Add branded types or wrapper helpers for email/IP identifiers.
- [ ] T-132.2: Update rate limit checks to use the new types/helpers.
- [ ] T-132.3: Add tests covering identifier creation and usage.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: T-118
Effort: S

### T-133: Replace magic numbers in sanitize utilities
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags magic numbers in sanitize utilities.
- Named constants improve clarity and auditability.
Acceptance Criteria:
- [ ] T-133.1: Replace magic numbers in sanitize helpers with named constants.
- [ ] T-133.2: Ensure tests still cover length limits and truncation behavior.
References:
- /lib/sanitize.ts
- /__tests__/lib/sanitize.test.ts
- /WRONG.md
Dependencies: None
Effort: XS

_Completed (moved to TODOCOMPLETED.md on 2026-01-21): T-112._
_Completed (moved to TODOCOMPLETED.md on 2026-01-20): T-108, T-109._


## 🟢 PHASE 3: Backlog & Tech Debt (P3)

### T-134: Normalize naming conventions and vague identifiers
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags inconsistent case conventions and vague/abbreviated names.
- Clear naming improves maintainability and onboarding.
Acceptance Criteria:
- [ ] T-134.1: Identify inconsistent casing and abbreviations in core modules.
- [ ] T-134.2: Rename identifiers with clear, consistent conventions.
- [ ] T-134.3: Update tests and docs affected by renames.
References:
- /lib/actions.ts
- /components/ContactForm.tsx
- /components/Navigation.tsx
- /WRONG.md
Dependencies: None
Effort: M

### T-135: Add barrel exports where missing
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags missing barrel exports for clearer import boundaries.
- Index files improve discoverability and reduce import churn.
Acceptance Criteria:
- [ ] T-135.1: Identify directories with repeated deep imports.
- [ ] T-135.2: Add index files that export public APIs only.
- [ ] T-135.3: Update imports to use the barrel exports where appropriate.
References:
- /components
- /lib
- /WRONG.md
Dependencies: None
Effort: S

### T-136: Replace generic error returns with specific messages
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit notes generic error returns reduce debugging clarity.
- Errors should be user-safe but specific internally.
Acceptance Criteria:
- [ ] T-136.1: Identify generic error responses in core flows.
- [ ] T-136.2: Improve error messaging with safe, specific user + log context.
- [ ] T-136.3: Add tests covering improved error paths.
References:
- /lib/actions.ts
- /WRONG.md
Dependencies: None
Effort: S

### T-137: Normalize import ordering across codebase
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit flags inconsistent import ordering.
- Consistent ordering improves readability and reduces merge noise.
Acceptance Criteria:
- [ ] T-137.1: Define import ordering standard (external, internal, relative).
- [ ] T-137.2: Apply ordering in affected files and update lint rules if needed.
References:
- /eslint.config.mjs
- /WRONG.md
Dependencies: None
Effort: S

### T-138: Remove unused CTASection component
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-001 marks CTASection as unused.
- Removing unused components reduces maintenance surface area.
Acceptance Criteria:
- [ ] T-138.1: Confirm CTASection is unused in app/components/tests.
- [ ] T-138.2: Remove CTASection and update any references if found.
- [ ] T-138.3: Ensure tests and builds still pass.
References:
- /components/CTASection.tsx
- /WRONG.md
Dependencies: None
Effort: XS

### T-139: Remove unused analytics tracking helpers
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-002 lists analytics helpers that are never called.
- Removing dead helpers reduces surface area.
Acceptance Criteria:
- [ ] T-139.1: Remove `trackButtonClick`, `trackPageView`, `trackScrollDepth`, `trackTimeOnPage`, `trackOutboundLink`, and `trackDownload`.
- [ ] T-139.2: Confirm no remaining references in tests or docs.
References:
- /lib/analytics.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-140: Remove unused parameters in analytics helpers
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-003 flags unused parameters in analytics helpers.
- Removing unused params clarifies API intent.
Acceptance Criteria:
- [ ] T-140.1: Remove unused `_location` and `_destination` parameters.
- [ ] T-140.2: Update call sites and tests if any exist.
References:
- /lib/analytics.ts
- /WRONG.md
Dependencies: T-139
Effort: XS

### T-141: Remove unused getBaseUrl export
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-004 flags `getBaseUrl` as unused.
- Remove dead exports to avoid confusion with getPublicBaseUrl.
Acceptance Criteria:
- [ ] T-141.1: Confirm no imports of getBaseUrl outside env.ts.
- [ ] T-141.2: Remove getBaseUrl and update any docs if needed.
References:
- /lib/env.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-142: Remove unused Skeleton utility exports
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-005 notes CardSkeleton/BlogPostSkeleton/ListSkeleton/TextSkeleton are unused.
- Removing unused exports reduces bundle and maintenance.
Acceptance Criteria:
- [ ] T-142.1: Confirm no imports of the unused Skeleton helpers.
- [ ] T-142.2: Remove the unused exports and update tests if needed.
References:
- /components/ui/Skeleton.tsx
- /WRONG.md
Dependencies: None
Effort: XS

### T-143: Remove unused SearchPage prop
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-006 flags unused `initialQuery` prop on SearchPage.
- Reducing unused props simplifies the component API.
Acceptance Criteria:
- [ ] T-143.1: Remove the unused prop from the interface.
- [ ] T-143.2: Confirm no call sites use the prop.
References:
- /components/SearchPage.tsx
- /WRONG.md
Dependencies: None
Effort: XS

### T-144: Decide fate of unused blog utility helpers
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-007 notes getFeaturedPosts/getPostsByCategory are unused but possibly future-facing.
- Decision should be explicit to avoid drift.
Acceptance Criteria:
- [ ] T-144.1: Confirm no production usage of the helpers.
- [ ] T-144.2: Decide to remove or keep with clear documentation of intent.
- [ ] T-144.3: Update tests/docs based on the decision.
References:
- /lib/blog.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-145: Decide whether to keep sanitizeUrl export
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-008 notes sanitizeUrl export is unused but security-relevant.
- Decision should be explicit and documented.
Acceptance Criteria:
- [ ] T-145.1: Confirm sanitizeUrl is unused in app/test code.
- [ ] T-145.2: Decide to keep (document usage intent) or remove.
- [ ] T-145.3: Update tests/docs based on the decision.
References:
- /lib/sanitize.ts
- /WRONG.md
Dependencies: None
Effort: XS

### T-146: Decide whether to keep sanitizeLogContext export
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Audit DEAD-009 notes sanitizeLogContext export may be unused.
- Decision should be explicit to keep logger API clean.
Acceptance Criteria:
- [ ] T-146.1: Confirm whether sanitizeLogContext is imported externally.
- [ ] T-146.2: Decide to keep (document external API) or remove export.
- [ ] T-146.3: Update tests/docs accordingly.
References:
- /lib/logger.ts
- /WRONG.md
Dependencies: None
Effort: XS
