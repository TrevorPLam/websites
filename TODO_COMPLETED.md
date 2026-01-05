# TODO - Completed Tasks

> **Task truth source:** TODO.md  
> This file tracks completed tasks from TODO.md with completion dates.  
> Tasks are moved here when completed and removed from the active TODO.md.

---

## Completed - 2026-01-04

### T-003: Document Sensitive Data Retention Policy [P2] [SEC]
**Type:** COMPLETE  
**Priority:** P2  
**Category:** SEC (Security Documentation)  
**Completed:** 2026-01-04

**Description:**  
Documented retention periods for contact form submissions, Sentry logs, and production logs.

**Completed Actions:**
- Added data retention policy to SECURITY.md (email, Sentry, and log retention)

**Files:**
- `SECURITY.md`

---

### T-005: Implement Production Console Log Suppression [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Completed:** 2026-01-04

**Description:**  
Ensured console logging is suppressed in production except for critical errors and documented the policy.

**Completed Actions:**
- Confirmed console logging is development-only in analytics/logger utilities
- Documented production logging policy in SECURITY.md

**Files:**
- `lib/analytics.ts`
- `SECURITY.md`

---

### T-006: Add Security Headers Documentation [P2] [SEC]
**Type:** COMPLETE  
**Priority:** P2  
**Category:** SEC (Security Documentation)  
**Completed:** 2026-01-04

**Description:**  
Documented CSP trade-offs and added middleware comments and deployment verification steps.

**Completed Actions:**
- Added detailed CSP rationale and tightening plan in SECURITY.md
- Added header comments in middleware.ts
- Added deployment checklist step to verify security headers

**Files:**
- `middleware.ts`
- `SECURITY.md`
- `docs/ops/DEPLOYMENT.md`

---

### T-008: Review and Update Dependencies [P2] [SEC]
**Type:** QUALITY  
**Priority:** P2  
**Category:** SEC (Supply Chain Security)  
**Completed:** 2026-01-04

**Description:**  
Pinned security-critical dependencies and ensured audit checks are part of deployment gates.

**Completed Actions:**
- Pinned exact versions for Next.js, Zod, Resend, and Sentry
- Ensured Dependabot configuration is present
- Added npm audit to deployment and release checklists

**Files:**
- `package.json`
- `package-lock.json`
- `docs/ops/DEPLOYMENT.md`
- `RELEASE_CHECKLIST.md`

---

### T-009: Add Input Size Limits Enforcement [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Completed:** 2026-01-04

**Description:**  
Added 1MB body size limits and documented the policy.

**Completed Actions:**
- Added POST payload size limit handling in middleware
- Added API bodyParser size limit in next.config.mjs
- Documented payload limits in SECURITY.md

**Notes:** Manual oversized payload test should be run in a running app environment.

**Files:**
- `middleware.ts`
- `next.config.mjs`
- `SECURITY.md`

---

### T-002: Add Request Body Sanitization to Logger [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Completed:** 2026-01-04

**Description:**  
The logger utility needed explicit sanitization of sensitive fields to prevent accidental logging of secrets.

**Completed Actions:**
- Added sanitizeLogContext to redact sensitive fields before console or Sentry logging
- Redacted password, token, authorization, cookie, api_key, and secret fields (including nested values)
- Added unit tests for sanitization behavior

**Files:**
- `lib/logger.ts`
- `__tests__/lib/logger.test.ts`

---

### T-001: Enhance Sentry PII Redaction [P2] [SEC]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** SEC (Security Hardening)  
**Completed:** 2026-01-04

**Description:**  
Added shared Sentry event sanitization to redact emails, phone numbers, and contact form fields before events are sent.

**Completed Actions:**
- Added shared sanitization helper for Sentry events
- Applied sanitization in both client and server Sentry beforeSend hooks
- Documented the redaction approach in DECISIONS.md (ADR-009)

**Files:**
- `lib/sentry-sanitize.ts`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `DECISIONS.md`

---

### T-007: Enhance Rate Limiting Implementation [P1] [SEC]
**Type:** ENHANCE  
**Priority:** P1  
**Category:** SEC (Security Enhancement)  
**Completed:** 2026-01-04

**Description:**  
Documented and implemented production-ready rate limiting, including guidance for persistent storage.

**Completed Actions:**
- Documented rate limiting strategy and trade-offs in DECISIONS.md
- Added deployment guidance for configuring rate limiting
- Implemented Upstash-backed rate limiting with in-memory fallback

**Files:**
- `lib/actions.ts`
- `DECISIONS.md`
- `docs/ops/DEPLOYMENT.md`
- `env.example`
- `lib/env.ts`

---

### T-016: Implement Distributed Rate Limiting [P1] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P1  
**Category:** REL (Reliability)  
**Completed:** 2026-01-04

**Description:**  
Replaced the single-instance limiter with a distributed limiter suitable for serverless deployments.

**Completed Actions:**
- Added Upstash Redis client and rate limiter integration
- Implemented sliding window rate limiting with analytics logging
- Added Upstash credentials to environment configuration

**Files:**
- `lib/actions.ts`
- `env.example`
- `lib/env.ts`
- `package.json`

---

## Completed - 2026-01-05

### T-029: Complete Manual Smoke Tests in Preview Deployment [P0] [QUALITY]
**Type:** QUALITY  
**Priority:** P0  
**Category:** REL (Release Gate)  
**Completed:** 2026-01-05

**Description:**  
Completed manual smoke verification against the running app UI and recorded results in the release record.

**Completed Actions:**
- Verified Universal UI smoke checks (app loads, nav works, error states available, mobile menu visible)
- Confirmed contact form validation errors surface for invalid inputs
- Recorded results in RELEASE_CHECKLIST.md

**Files:**
- `RELEASE_CHECKLIST.md`
- `components/ContactForm.tsx`
- `lib/actions.ts`
- `lib/contact-form-schema.ts`

---

### T-024: Add IP-Aware Rate Limiting for Contact Form [P1] [SEC]
**Type:** ENHANCE  
**Priority:** P1  
**Category:** SEC (Abuse Prevention)  
**Completed:** 2026-01-05

**Description:**  
Added IP-aware throttling to contact form submissions, combining email and hashed IP keys across Upstash and in-memory rate limiting.

**Completed Actions:**
- Added client IP extraction using trusted proxy headers with hashed identifiers
- Applied combined email/IP rate limiting for both distributed and in-memory paths
- Added tests for email limits when IP changes and for new email/IP combinations
- Documented privacy-aware rate limiting in SECURITY.md

**Files:**
- `lib/actions.ts`
- `__tests__/lib/actions.rate-limit.test.ts`
- `SECURITY.md`

---

### T-025: Align @next/mdx Version With Next.js [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Aligned @next/mdx with Next.js 14.x and updated lockfile metadata where possible.

**Completed Actions:**
- Set @next/mdx to ^14.2.18 in package.json
- Updated package-lock.json references for @next/mdx (integrity requires regeneration with registry access)
- Logged follow-up lockfile regeneration task in TODO.md

**Files:**
- `package.json`
- `package-lock.json`
- `TODO.md`

---

### T-026: Move @types/mdx to devDependencies [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Shifted @types/mdx to devDependencies to reduce production install surface area.

**Completed Actions:**
- Moved @types/mdx to devDependencies in package.json
- Marked @types/mdx as dev-only in package-lock.json

**Files:**
- `package.json`
- `package-lock.json`

---

### T-027: Consolidate to a Single Package Manager Lockfile [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Chose npm as the canonical package manager and removed the pnpm lockfile.

**Completed Actions:**
- Removed pnpm-lock.yaml
- Documented npm as the canonical package manager in READMEAI.md

**Files:**
- `pnpm-lock.yaml` (removed)
- `READMEAI.md`

---

### T-028: Remove Invalid next.config.mjs Keys [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** REL (Reliability)  
**Completed:** 2026-01-05

**Description:**  
Removed unsupported Next.js configuration keys to avoid runtime warnings.

**Completed Actions:**
- Removed deprecated api and sentry keys from next.config.mjs

**Files:**
- `next.config.mjs`

---

### T-032: Update Setup Guide to Use npm Commands [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Aligned the local setup guide with npm usage, correct environment file naming, and available scripts.

**Completed Actions:**
- Switched prerequisites and install steps to npm and package-lock.json
- Updated environment setup to use `.env.local`
- Replaced pnpm script references with npm run equivalents
- Corrected local production run guidance to `npm run build` + `npm run start`

**Files:**
- `docs/workflows/SETUP.md`

---

### T-033: Align Contributing Guide With npm Scripts [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Updated contribution requirements and testing commands to match the npm-based script set.

**Completed Actions:**
- Replaced pnpm commands with npm equivalents in PR requirements
- Updated testing commands to match existing npm scripts
- Removed references to non-existent `check`, `preview`, and `lint:fix` scripts

**Files:**
- `docs/workflows/CONTRIBUTING.md`

---

### T-034: Refresh Start-Here README for npm + Testing Scripts [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Ensured onboarding documentation reflects npm usage and available test commands.

**Completed Actions:**
- Updated prerequisites to Node.js 20.x LTS and npm usage
- Added unit, coverage, and E2E test script references

**Files:**
- `docs/start-here/README.md`

---

### T-035: Refresh Dependency Health Notes for npm-Only State [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Updated dependency health notes to reflect the npm-only lockfile and resolved findings.

**Completed Actions:**
- Corrected ecosystem references to npm-only usage
- Marked prior MDX alignment, @types/mdx, and lockfile issues as resolved
- Updated content processing version references and assumptions

**Files:**
- `DEPENDENCY_HEALTH.md`

---

### T-036: Document npm Requirement in Architecture Context [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Recorded npm as the canonical package manager in the architecture context.

**Completed Actions:**
- Added npm requirement to technical requirements
- Updated the document timestamp

**Files:**
- `docs/architecture/CONTEXT.md`

### T-010: Verify Environment Variable Leakage Prevention [P2] [SEC]
**Type:** QUALITY  
**Priority:** P2  
**Category:** SEC (Security Verification)  
**Completed:** 2026-01-05

**Description:**  
Added documentation for environment variable naming and enforced a post-build scan to detect server-only secrets in client bundles.

**Completed Actions:**
- Documented `NEXT_PUBLIC_` naming conventions in SECURITY.md
- Added `scripts/check-client-secrets.mjs` and wired it to `postbuild`
- Defined server-only tokens to scan for in client chunks

**Files:**
- `SECURITY.md`
- `scripts/check-client-secrets.mjs`
- `package.json`

---

### T-020: Add Lighthouse Performance Budgets [P2] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** PERF (Performance)  
**Completed:** 2026-01-05

**Description:**  
Added Lighthouse budgets and hooked them into LHCI assertions.

**Completed Actions:**
- Created `.github/lighthouse/budget.json` with performance budgets
- Added `.lighthouserc.json` to apply budgets in CI

**Files:**
- `.github/lighthouse/budget.json`
- `.lighthouserc.json`

---

### T-022: Add RSS Feed for Blog [P2] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** UX (User Experience)  
**Completed:** 2026-01-05

**Description:**  
Implemented an RSS feed for blog posts, surfaced it in the header, and added it to the sitemap.

**Completed Actions:**
- Added `/feed.xml` route to generate RSS from blog posts
- Linked the feed in the primary navigation
- Added feed URL to sitemap

**Files:**
- `app/feed.xml/route.ts`
- `components/Navigation.tsx`
- `app/sitemap.ts`
---

### T-017: Increase Test Coverage [P2] [QUALITY]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Expanded unit tests to cover blog utilities, case studies, UI components, and page components.

**Completed Actions:**
- Added tests for `lib/blog.ts` and `lib/case-studies.ts`
- Added tests for `components/ui` primitives
- Added coverage for core page components including search

**Files:**
- `__tests__/lib/blog.test.ts`
- `__tests__/lib/case-studies.test.ts`
- `__tests__/components/ui/components.test.tsx`
- `__tests__/components/pages/pages.test.tsx`

---

### T-018: Add E2E Tests for Critical Flows [P2] [QUALITY]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** REL (Reliability)  
**Completed:** 2026-01-05

**Description:**  
Added Playwright coverage for key user journeys.

**Completed Actions:**
- Added E2E tests for homepage → services → contact flow
- Added blog listing → blog post → CTA flow tests
- Added mobile navigation, contact validation, and 404 coverage

**Files:**
- `tests/e2e/critical-flows.spec.ts`

---

### T-019: Optimize Bundle Size [P2] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** PERF (Performance)  
**Completed:** 2026-01-05

**Description:**  
Reduced initial client bundle size by deferring non-critical UI and isolating MDX rendering.

**Completed Actions:**
- Dynamically imported the install prompt to avoid initial load cost
- Split MDX rendering into a dedicated component
- Documented bundle analysis attempt and follow-up steps

**Files:**
- `app/layout.tsx`
- `app/blog/[slug]/page.tsx`
- `components/BlogPostContent.tsx`
- `docs/ops/BUNDLE-OPTIMIZATION-2026-01-05.md`

---

### T-021: Accessibility Audit [P2] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** UX (User Experience)  
**Completed:** 2026-01-05

**Description:**  
Completed an accessibility review and addressed core ARIA gaps.

**Completed Actions:**
- Added ARIA-expanded and labeled regions to accordion items
- Documented audit scope, checks, and follow-up actions

**Files:**
- `components/ui/Accordion.tsx`
- `docs/ops/ACCESSIBILITY-AUDIT-2026-01-05.md`

---

### T-023: Add Search Functionality [P2] [ENHANCE]
**Type:** ENHANCE  
**Priority:** P2  
**Category:** UX (User Experience)  
**Completed:** 2026-01-05

**Description:**  
Implemented site-wide search with keyboard shortcuts and a dedicated search page.

**Completed Actions:**
- Added search index for blog posts and key pages
- Implemented a search modal in navigation with Cmd/Ctrl + K
- Added `/search` page for deep linking
- Documented search configuration

**Files:**
- `lib/search.ts`
- `components/SearchDialog.tsx`
- `components/SearchPage.tsx`
- `app/search/page.tsx`
- `components/Navigation.tsx`
- `docs/workflows/SEARCH.md`
- `app/sitemap.ts`
- `docs/start-here/README.md`

---

### T-037: Update Pre-commit Type Check Hook to npm [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Aligned the pre-commit TypeScript hook with the npm-based workflow to avoid pnpm dependency failures.

**Completed Actions:**
- Updated the local TypeScript hook entry to run `npm run type-check`
- Documented the change in the Unreleased changelog

**Files:**
- `pre-commit-config.yaml`
- `CHANGELOG.md`

---

### T-038: Document Coverage Workflow and Dependency [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Added guidance for running coverage with the Vitest V8 provider across contributor-facing docs.

**Completed Actions:**
- Documented coverage requirements and outputs in the start-here guide
- Added coverage command notes and dependency callout to SETUP instructions

**Files:**
- `docs/start-here/README.md`
- `docs/workflows/SETUP.md`

---

### T-039: Record Dependency Updates in Changelog and Health Notes [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Captured upcoming dependency changes and lockfile regeneration needs in the changelog and dependency health report.

**Completed Actions:**
- Added Unreleased changelog notes for the coverage dependency and npm pre-commit hook
- Updated dependency health summary with the pending coverage provider and lockfile regeneration tasks

**Files:**
- `CHANGELOG.md`
- `DEPENDENCY_HEALTH.md`

---

### T-040: Add Coverage Guidance to CONTRIBUTING [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Ensured contributors understand how to run and review coverage reports locally.

**Completed Actions:**
- Added coverage command and output location to CONTRIBUTING testing instructions
- Clarified the dependency on `@vitest/coverage-v8`

**Files:**
- `docs/workflows/CONTRIBUTING.md`

---

### T-041: Document Pre-commit Usage in READMEAI [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Surface the npm-based pre-commit workflow in the repository entrypoint documentation.

**Completed Actions:**
- Added pre-commit install and run commands to READMEAI
- Highlighted that hooks rely on `npm run type-check`

**Files:**
- `READMEAI.md`

---

## Completed - 2026-01-03 (P1/P2)

### T-004: Add CSRF Token Support Documentation [P1] [SEC]
**Type:** COMPLETE  
**Priority:** P1  
**Category:** SEC (Security Enhancement)  
**Completed:** 2026-01-03

**Description:**  
Documented Next.js Server Actions CSRF protections and related cookie considerations.

**Completed Actions:**
- Added CSRF protection documentation to SECURITY.md
- Documented CSRF trade-offs and future considerations in DECISIONS.md (ADR-006)

**Files:**
- `SECURITY.md`
- `DECISIONS.md`
- `middleware.ts`

---

### T-014: Migrate or Remove Deprecated next-pwa [P1] [QUALITY]
**Type:** DEADCODE  
**Priority:** P1  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-03

**Description:**  
Removed deprecated next-pwa and retained only the basic installable PWA assets.

**Completed Actions:**
- Removed next-pwa dependency and withPWA wrapper
- Preserved manifest and install prompt behavior
- Documented decision in DECISIONS.md (ADR-008)

**Files:**
- `package.json`
- `next.config.mjs`
- `DECISIONS.md`

---

### T-015: Configure Production API Keys [P1] [COMPLETE]
**Type:** COMPLETE  
**Priority:** P1  
**Completed:** 2026-01-03

**Description:**  
Documented production API key setup for Resend and Sentry.

**Completed Actions:**
- Added deployment checklist steps for Resend and Sentry configuration
- Documented required environment variables and verification steps

**Files:**
- `docs/ops/DEPLOYMENT.md`
- `env.example`

---

## Completed - 2026-01-03 (P0 Critical Fixes)

### T-011: Fix Zod v4 API Error in Contact Form [P0] [QUALITY]
**Type:** QUALITY  
**Priority:** P0  
**Completed:** 2026-01-03

**Description:**  
TypeScript compilation was failing because Zod v4 changed the API from `error.errors` to `error.issues`.

**Completed Actions:**
- Changed `error.errors` to `error.issues` in lib/actions.ts line 137
- Verified type-check passes with `npm run type-check`

**Results:**  
TypeScript compilation now passes successfully with no errors.

**Files:**
- `lib/actions.ts`

---

### T-012: Fix ESLint Warnings for Unused Parameters [P0] [QUALITY]
**Type:** QUALITY  
**Priority:** P0  
**Completed:** 2026-01-03

**Description:**  
ESLint was reporting unused parameters `location` and `destination` in analytics.ts functions.

**Completed Actions:**
- Prefixed unused parameters with underscore: `_location`, `_destination`
- Verified lint passes with `npm run lint`

**Results:**  
ESLint now passes with no warnings or errors.

**Files:**
- `lib/analytics.ts`

---

### T-013: Update eslint-config-next to Fix Security Vulnerabilities [P0] [SEC]
**Type:** QUALITY  
**Priority:** P0  
**Category:** SEC (Supply Chain Security)  
**Completed:** 2026-01-03

**Description:**  
npm audit reported 3 high severity vulnerabilities in glob dependency through outdated eslint-config-next.

**Completed Actions:**
- Updated eslint-config-next from 14.2.18 to 15.5.9
- Ran `npm audit` and verified all vulnerabilities resolved
- Verified lint still works correctly

**Results:**  
npm audit now reports 0 vulnerabilities. All security issues resolved.

**Files:**
- `package.json`
- `package-lock.json`

**References:**
- Advisory: GHSA-5j98-mcp5-4vw2 (glob command injection)

---

## Completed - 2026-01-03 (CODE_AUDIT Execution)

### CODE_AUDIT Execution [HYGIENE]
**Type:** HYGIENE  
**Priority:** P0  
**Completed:** 2026-01-03

**Description:**  
Executed complete CODE_AUDIT process following CODE_AUDIT.md phases 0-6:
- Phase 0: Identified task truth source (TODO.md)
- Phase 1: Consolidated tasks from USERTODO.md, swept docs/code for actionable items
- Phase 2: Reviewed code completeness (no major gaps found)
- Phase 3: Ran lint/type-check/build, identified quality issues (3 critical fixes needed)
- Phase 4: Identified dead code candidates (next-pwa)
- Phase 5: Consolidated enhancements from USERTODO.md
- Phase 6: Produced unified TODO.md with 23 tasks in standard format

**Results:**
- Created comprehensive TODO.md with all tasks in standard format
- Found 3 P0 issues requiring immediate fix (type error, lint warnings, security vulns)
- Consolidated 20+ items from USERTODO.md into structured tasks
- All tasks have acceptance criteria, file references, and effort estimates
- Prioritized as P0 (3 tasks), P1 (4 tasks), P2 (16 tasks)

**Files:**
- `TODO.md` (completely restructured)
- `TODO_COMPLETED.md` (this file, updated)
- `docs/workflows/USERTODO.md` (reference document, kept for historical context)

---
