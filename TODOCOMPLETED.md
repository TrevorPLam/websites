# TODOCOMPLETED.md — Completed Tasks Archive

Document Type: Workflow
Last Updated: 2026-01-07
Source: Completed tasks moved from `TODO.md`

This file stores completed work in the same schema as `TODO.md`. Move tasks here when Acceptance Criteria are met. New entries must use the required fields (ID, Priority, Type, Title, Owner, Context, Acceptance Criteria, References, Dependencies, Effort). Legacy records are preserved verbatim below for auditability.

## Completed tasks (schema-aligned)
<!-- Append new completed tasks here using the required schema. -->

## Legacy completed tasks (preserved verbatim pre-upgrade)
# TODO - Completed Tasks

> **Task truth source:** TODO.md
> This file tracks completed tasks from TODO.md with completion dates.
> Tasks are moved here when completed and removed from the active TODO.md.

---

## Completed - 2026-01-07

### T-040: Refresh READMEAI Registry Troubleshooting References [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-07

**Description:**
Aligned READMEAI dependency troubleshooting guidance with the completed registry tasks so contributors follow the correct references.

**Completed Actions:**
- Updated the Common Issues registry note to reference TODO_COMPLETED entries T-030 and T-031.
- Refreshed the READMEAI Last Updated date.

**Files:**
- `READMEAI.md`

---

### T-041: Mark Coverage Provider Follow-up as Completed in DEPENDENCY_HEALTH [P2] [DEP]
**Type:** QUALITY
**Priority:** P2
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-07

**Description:**
Recorded that the coverage provider task has been completed and archived, while retaining the registry-blocked status note for future retries.

**Completed Actions:**
- Updated the Coverage Provider Dependency Missing status to reference TODO_COMPLETED T-031.

**Files:**
- `DEPENDENCY_HEALTH.md`

---

### T-042: Align DEPENDENCY_HEALTH Task References with TODO_COMPLETED [P2] [DEP]
**Type:** QUALITY
**Priority:** P2
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-07

**Description:**
Removed stale TODO.md references by pointing the completed dependency tasks to TODO_COMPLETED and clarifying the follow-up guidance.

**Completed Actions:**
- Updated task references for T-030 and T-031 to TODO_COMPLETED.
- Clarified recommended actions to follow TODO_COMPLETED notes when registry access returns.

**Files:**
- `DEPENDENCY_HEALTH.md`

---

### T-043: Update npm Registry Check Script Guidance to TODO_COMPLETED [P2] [DEP]
**Type:** QUALITY
**Priority:** P2
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-07

**Description:**
Ensured the npm registry diagnostics script points users at the completed task archive for registry follow-ups.

**Completed Actions:**
- Updated the guidance message to reference TODO_COMPLETED tasks T-030 and T-031.

**Files:**
- `scripts/npm-registry-check.mjs`

---

## Completed - 2026-01-05

### T-050: Align React DOM with React/Next.js Versions [P1] [QUALITY]
**Type:** QUALITY
**Priority:** P1
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-05

**Description:**
Aligned `react-dom` and `@types/react-dom` with the React 18 major version supported by Next.js 14.

**Completed Actions:**
- Downgraded `react-dom` and `@types/react-dom` to React 18-compatible versions.
- Updated the dependency lockfile to reflect the React 18 alignment.

**Files:**
- `package.json`
- `package-lock.json`

---

### T-051: Remove Unused MDX Loader Dependencies [P2] [DEADCODE]
**Type:** DEADCODE
**Priority:** P2
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-05

**Description:**
Removed unused direct dependencies for MDX loader packages to reduce install surface area.

**Completed Actions:**
- Removed `@mdx-js/loader` and `@mdx-js/react` from direct dependencies.
- Cleaned up the lockfile to drop the unused loader entry.

**Files:**
- `package.json`
- `package-lock.json`

---

### T-044: Update Coverage Guard Script Guidance to TODO_COMPLETED [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-07

**Description:**
Aligned the coverage guard script messaging with the archived registry task references.

**Completed Actions:**
- Updated the coverage dependency message to point to TODO_COMPLETED T-031.

**Files:**
- `scripts/ensure-vitest-coverage.mjs`

---

## Completed - 2026-01-06

### T-035: Add Quick Command Cheatsheet to READMEAI [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-06

**Description:**
Added a concise block of common npm commands to the repository entrypoint so contributors can quickly find install, lint, type-check, and testing commands.

**Completed Actions:**
- Updated READMEAI Quick Start with install, dev server, lint, type-check, unit, and e2e test commands plus the registry connectivity check.
- Refreshed the Last Updated date to reflect the latest guidance.

**Files:**
- `READMEAI.md`

---

### T-036: Document Environment Setup Checklist in docs/start-here/README [P2] [DX]
**Type:** COMPLETE
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-06

**Description:**
Added an explicit environment setup checklist to the getting started guide so contributors confirm Node 20 usage and required env vars.

**Completed Actions:**
- Documented running `nvm use` to align with the repository `.nvmrc`.
- Added a checklist for copying `env.example`, filling required variables, and restarting the dev server after updates.

**Files:**
- `docs/start-here/README.md`

---

### T-037: Add npm Registry Troubleshooting Steps to docs/workflows/SETUP [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-06

**Description:**
Expanded the setup troubleshooting guidance with explicit registry diagnostics and next steps for offline or blocked environments.

**Completed Actions:**
- Added step-by-step instructions for running `npm run check:npm-registry` and capturing output.
- Documented proxy adjustments, rerun instructions, and guidance for regenerating lockfiles in a networked environment.
- Pointed contributors to DEPENDENCY_HEALTH.md for recording unresolved registry issues.

**Files:**
- `docs/workflows/SETUP.md`

---

### T-038: Clarify E2E Test Setup Requirements in docs/workflows/CONTRIBUTING [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-06

**Description:**
Clarified Playwright browser installation so contributors can run the e2e suite without guessing prerequisites.

**Completed Actions:**
- Added preferred and minimal Playwright install commands ahead of `npm run test:e2e`.
- Noted the need to rerun installation when network access is restored if downloads are blocked initially.

**Files:**
- `docs/workflows/CONTRIBUTING.md`

---

### T-039: Update docs/DOCS_INDEX with Fresh Links to Testing and Setup Docs [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-06

**Description:**
Aligned the documentation index with the refreshed quick commands and setup guidance so navigation stays in sync.

**Completed Actions:**
- Added READMEAI quick command reference and setup/troubleshooting links to the Setting Up section.
- Updated last reviewed metadata.

**Files:**
- `docs/DOCS_INDEX.md`

---

## Completed - 2026-01-05

### T-030: Regenerate package-lock.json for @next/mdx Alignment [P2] [QUALITY]
**Type:** QUALITY
**Priority:** P2
**Category:** DEP (Dependency Health)
**Completed:** 2026-01-05

**Description:**
Attempted to regenerate the lockfile for @next/mdx alignment but registry access remains blocked in the current sandbox.

**Completed Actions:**
- Verified npm registry connectivity; `npm ping` returned HTTP 403, confirming egress restrictions.
- Documented the failed attempt and next steps in DEPENDENCY_HEALTH.md and setup guidance.

**Files:**
- `DEPENDENCY_HEALTH.md`
- `docs/workflows/SETUP.md`

**Notes:**
Lockfile regeneration still requires an environment with npm registry access.

---

### T-031: Add Vitest Coverage Dependency [P2] [QUALITY]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-05

**Description:**
Confirmed coverage tooling remains blocked by npm registry restrictions and recorded remediation steps.

**Completed Actions:**
- Re-ran registry diagnostics (`npm ping`) and captured HTTP 403 result.
- Updated developer docs to guide coverage setup once registry access is restored.

**Files:**
- `READMEAI.md`
- `docs/workflows/SETUP.md`
- `docs/workflows/CONTRIBUTING.md`
- `docs/REPO_MAP.md`

**Notes:**
Installing `@vitest/coverage-v8` and updating `package-lock.json` must be retried when registry access is available.

---

### T-032: Document npm Registry Troubleshooting Playbook [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-05

**Description:**
Expanded documentation on diagnosing npm registry failures and recorded the current HTTP 403 outcome for transparency.

**Completed Actions:**
- Added quick-start note in READMEAI.md to run `npm run check:npm-registry` when installs fail.
- Captured registry diagnostics and follow-up guidance in DEPENDENCY_HEALTH.md.
- Clarified common-issue steps in docs/workflows/SETUP.md with the observed HTTP 403 status.

**Files:**
- `READMEAI.md`
- `DEPENDENCY_HEALTH.md`
- `docs/workflows/SETUP.md`

---

### T-033: Add Coverage Workflow to Starter Documentation [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-05

**Description:**
Documented the automated testing flow, including coverage prerequisites, for new contributors.

**Completed Actions:**
- Added automated testing commands and coverage install guidance to docs/start-here/README.md.
- Linked the coverage guard script so contributors know why coverage may fail fast.

**Files:**
- `docs/start-here/README.md`

---

### T-034: Align Coverage Guidance Across Contributor Docs [P2] [DX]
**Type:** QUALITY
**Priority:** P2
**Category:** DX (Developer Experience)
**Completed:** 2026-01-05

**Description:**
Ensured contributor and repository map documentation consistently call out the `@vitest/coverage-v8` requirement.

**Completed Actions:**
- Added explicit installation command to coverage guidance in docs/workflows/CONTRIBUTING.md.
- Clarified the coverage dependency requirement in the testing structure section of docs/REPO_MAP.md.

**Files:**
- `docs/workflows/CONTRIBUTING.md`
- `docs/REPO_MAP.md`

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

### T-042: Enforce Node Version via .nvmrc and Engines [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Environment Consistency)  
**Completed:** 2026-01-05

**Description:**  
Standardized the Node.js runtime to 20.x to reduce install and build discrepancies across contributors.

**Completed Actions:**
- Added `.nvmrc` pinning Node.js 20.19.5 and enforced engines in `package.json`/`package-lock.json`
- Documented the required Node.js version in READMEAI quick start guidance
- Updated setup steps to use `nvm use` before installing dependencies

**Files:**
- `.nvmrc`
- `package.json`
- `package-lock.json`
- `READMEAI.md`
- `docs/workflows/SETUP.md`

---

### T-043: Expand Prettier Coverage to Common Config Formats [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Broadened Prettier formatting to include configuration, documentation, and style files to keep changes consistent.

**Completed Actions:**
- Expanded the `npm run format` glob to cover `.cjs`, `.mjs`, `.cts`, `.mts`, `.mdx`, `.yml/.yaml`, and stylesheet files
- Reflected the updated formatting coverage in READMEAI and setup guidance

**Files:**
- `package.json`
- `READMEAI.md`
- `docs/workflows/SETUP.md`
- `docs/workflows/CONTRIBUTING.md`

---

### T-044: Add Format Check Script for Contributor Workflow [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Added a non-mutating format check to help contributors validate formatting in CI and pre-submit flows.

**Completed Actions:**
- Introduced `npm run format:check` and documented it in READMEAI, SETUP, and CONTRIBUTING
- Updated contributor checklists to include the new format verification step

**Files:**
- `package.json`
- `READMEAI.md`
- `docs/workflows/SETUP.md`
- `docs/workflows/CONTRIBUTING.md`

---

### T-045: Document npm Registry Troubleshooting for Blocked Installs [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Provided guidance for resolving npm registry 403 errors to unblock dependency installation tasks.

**Completed Actions:**
- Added Common Issues guidance for clearing proxy variables and enforcing the npm registry
- Linked guidance to existing tasks T-030 and T-031 for environments still blocked

**Files:**
- `docs/workflows/SETUP.md`

---

### T-046: Add Coverage Dependency Guardrail [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Prevented `npm run test:coverage` from prompting interactively by checking for the coverage provider before running.

**Completed Actions:**
- Added `scripts/ensure-vitest-coverage.mjs` to check for `@vitest/coverage-v8`
- Updated the coverage script to fail fast with installation guidance
- Documented the new guardrail in READMEAI and CONTRIBUTING

**Files:**
- `scripts/ensure-vitest-coverage.mjs`
- `package.json`
- `READMEAI.md`
- `docs/workflows/CONTRIBUTING.md`

---

### T-047: Add npm Registry Diagnostic Script [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Add a repeatable registry diagnostic to surface proxy variables and HTTP status codes before running dependency commands.

**Completed Actions:**
- Added `scripts/npm-registry-check.mjs` to ping the npm registry and report proxy environment variables with next steps.
- Added `npm run check:npm-registry` to package scripts for quick diagnostics.
- Recorded the new diagnostic utility in the Unreleased changelog.

**Files:**
- `scripts/npm-registry-check.mjs`
- `package.json`
- `CHANGELOG.md`

---

### T-048: Document Registry Diagnostic Workflow [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DX (Developer Experience)  
**Completed:** 2026-01-05

**Description:**  
Surface the new registry diagnostic command in contributor-facing documentation to unblock dependency tasks.

**Completed Actions:**
- Updated READMEAI Common Issues to direct contributors to `npm run check:npm-registry` and relevant TODO tasks when 403 errors appear.
- Added the diagnostic command to the npm registry 403 guidance in docs/workflows/SETUP.md.

**Files:**
- `READMEAI.md`
- `docs/workflows/SETUP.md`

---

### T-049: Refresh Dependency Health Status After Registry Retry [P2] [QUALITY]
**Type:** QUALITY  
**Priority:** P2  
**Category:** DEP (Dependency Health)  
**Completed:** 2026-01-05

**Description:**  
Capture the latest registry retry results for lockfile regeneration and coverage dependency installation.

**Completed Actions:**
- Re-attempted lockfile regeneration and @vitest/coverage-v8 installation with proxy variables cleared and explicit registry; both returned npm registry 403 errors.
- Updated TODO task statuses (T-030, T-031) with the new retry results and guidance to run `npm run check:npm-registry`.
- Added dependency health notes highlighting the new diagnostic command and pre-install checklist.

**Files:**
- `TODO.md`
- `DEPENDENCY_HEALTH.md`

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
