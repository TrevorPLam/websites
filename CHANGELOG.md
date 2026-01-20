# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added `npm run check:npm-registry` to diagnose registry connectivity and proxy issues before running dependency commands
- Added registry reachability checks for `@cloudflare/next-on-pages` metadata to support dependency monitoring
- Added a contact form honeypot field to block bot submissions
- Added repeatable accessibility and Lighthouse audit scripts for local QA
- Added Playwright coverage for contact submission success, rate limiting, and search empty states
- Added privacy policy and terms of service pages plus sitemap entries for legal routes
- Added Playwright coverage to verify legal pages render and footer links resolve
- Added unit tests for Hero, ValueProps, ServicesOverview, and SocialProof sections
- Added Article and Service structured data on blog posts and service pages for richer SEO signals
- Added GA4 analytics script injection and conversion tracking for contact form submissions

### Security
- Added hashed IP + email rate limiting for contact form submissions

### Fixed
- Restored in-memory rate limiting logic and JSDoc formatting in `lib/actions.ts`
- Added contact form error boundary fallback and accessibility improvements for decorative icons

### Documentation
- Expanded middleware security header docs and environment helper documentation
- Noted npm registry access blockers for dependency monitoring task T-070
- Clarified sanitize utility usage guidance
- Documented accessibility standards, Lighthouse baselines, and Sentry performance instrumentation
- Documented Vitest coverage threshold expectations in the testing strategy
- Consolidated Cloudflare Pages deployment guidance, added mobile smoke test checklist, and archived legacy roadmaps
- Documented rate limiting behavior differences between development and production environments
- Documented GA4 analytics configuration, conversion events, and CSP allowlists

### Changed
- Removed deprecated `api` and `sentry` keys from `next.config.mjs`
- Documented npm as the canonical package manager and lockfile
- Updated pre-commit TypeScript hook to use npm instead of pnpm
- Hardened Sentry source map handling for production builds
- Added Vitest coverage thresholds to enforce minimum unit coverage
- Logged missing Upstash Redis keys before falling back to in-memory rate limiting
- Enhanced npm registry diagnostics output with per-check context and summaries

### Dependencies
- Aligned `@next/mdx` to the Next.js 14.x line
- Moved `@types/mdx` to devDependencies
- Removed `pnpm-lock.yaml` in favor of `package-lock.json`
- Planned `@vitest/coverage-v8` addition for coverage reporting (install + lockfile regeneration pending registry access)

## [2026.01.05] - 2026-01-05

### Added
- Added `/feed.xml` RSS feed generation, linked in the primary navigation, and surfaced in the sitemap
- Added distributed rate limiting support with Upstash Redis and new environment configuration
- Added a post-build client bundle scan to prevent accidental secret exposure
- Added Lighthouse performance budgets configuration

### Changed
- Removed deprecated next-pwa integration while preserving basic PWA assets
- Expanded deployment, security, and documentation guides to reflect the latest platform changes

### Security
- Added Sentry event sanitization and logger redaction for PII and sensitive fields
- Enforced 1MB request payload limits in middleware and API configuration

### Dependencies
- Pinned security-critical dependencies (Next.js, Sentry, Resend, Zod)
- Upgraded eslint-config-next and added Upstash rate limiting dependencies

## [2026.01.03] - 2026-01-03

### Documentation
- Completed comprehensive dependency health review
- Added dependency update policy to DEPENDENCY_HEALTH.md
- Documented MDX architecture decision (ADR-004)
- Documented clsx + tailwind-merge utility pattern (ADR-005)
- Created comprehensive security review framework in SECURITY_REVIEW.md
- Added 10 security enhancement tasks to TODO.md (T-001 through T-010)
- Added dependency evaluation task for next-pwa (T-DEP-001)
- Created TODO_COMPLETED.md to track completed tasks
- Enhanced CODE_AUDIT.md with audit execution framework
- Created DOCS_ROOT.md as documentation index
- Created RELEASE_CHECKLIST.md for safe, repeatable releases

### Quality
- Established Architecture Decision Records (ADR) system in DECISIONS.md
- Documented dependency health policies and review process
- Added security hardening tasks covering PII redaction, logging, rate limiting, and CSRF protection

## [0.1.0] - 2024-12-26

### Added
- Initial release of Your Dedicated Marketer marketing website
- Next.js 14 App Router with static site generation
- Blog functionality with MDX support
- Contact form with email integration via Resend
- Responsive design with Tailwind CSS
- Error tracking with Sentry
- PWA support with next-pwa
- Testing infrastructure (Vitest + Playwright)
- Security headers and CORS configuration

### Security
- Implemented rate limiting for contact form
- Added security headers via middleware
- Configured Sentry error tracking
- Input validation with Zod schemas

---

## Changelog Guidelines

### When to Update
- Add entries when dependency changes affect user-facing behavior
- Document breaking changes immediately
- Record security patches and vulnerability fixes
- Note major feature additions or architectural changes

### Categories
- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes or improvements
- **Dependencies** - Significant dependency updates

### Dependency Changes
Per DEPENDENCY_HEALTH.md:
- Document dependency additions with justification
- Note dependency removals and what replaced them
- Record major version upgrades with impact summary
- Link to related TODO.md or DECISIONS.md entries
