# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Added hashed IP + email rate limiting for contact form submissions

### Changed
- Removed deprecated `api` and `sentry` keys from `next.config.mjs`
- Documented npm as the canonical package manager and lockfile
- Updated pre-commit TypeScript hook to use npm instead of pnpm

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
