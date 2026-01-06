# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-06
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

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

## 🔴 PHASE 0: Build Blockers (P0)
> These MUST be fixed before any other work. Build is currently broken.

### T-001: Fix corrupted JSDoc and syntax in lib/actions.ts
Priority: P0
Type: BUG
Owner: AGENT
Status: READY
Context:
- **BUILD BLOCKER**: `lib/actions.ts` has corrupted JSDoc comments breaking TypeScript compilation
- Line 184: ` **` should be `/**` (missing opening slash)
- Line 200: `*/p.get(identifier)` — comment end merged with code `rateLimitMap.get(identifier)`
- Missing function body for `checkRateLimitInMemory` (last ~10 lines got overwritten by JSDoc)
- Discovered during deep-dive audit 2026-01-06
Acceptance Criteria:
- [ ] T-001.1: Fix line 184 JSDoc opening (`/**` not ` **`)
- [ ] T-001.2: Restore line 200 — separate `*/` from `rateLimitMap.get(identifier)`
- [ ] T-001.3: Restore missing function body for `checkRateLimitInMemory`
- [ ] T-001.4: Run `npm run type-check` — must pass with 0 errors
- [ ] T-001.5: Run `npm run build` — must succeed
References:
- `/lib/actions.ts` (lines 175-215)
Dependencies: None
Effort: S

### T-002: Add missing Zod import to lib/actions.ts
Priority: P0
Type: BUG
Owner: AGENT
Status: READY
Context:
- **BUILD BLOCKER**: `z.ZodError` used on line 390 but `z` is not imported
- Only `contactFormSchema` is imported from `@/lib/contact-form-schema`
- Causes TypeScript error: `Cannot find name 'z'`
Acceptance Criteria:
- [ ] T-002.1: Add `import { z } from 'zod'` to imports section
- [ ] T-002.2: Verify no other unresolved references
- [ ] T-002.3: Run `npm run type-check` — must pass
References:
- `/lib/actions.ts` (line 390)
Dependencies: T-001
Effort: XS

### T-003: Verify and fix React/React-DOM version mismatch
Priority: P0
Type: DEPENDENCY
Owner: AGENT
Status: READY
Context:
- `react: ^19.2.3` but `react-dom: ^18.3.1` — major version mismatch
- `@types/react: ^19.2.7` but `@types/react-dom: ^18.3.17` — type mismatch
- May cause runtime hydration errors or undefined behavior
- Should be same major version
Acceptance Criteria:
- [ ] T-003.1: Update `react-dom` to `^19.x` to match `react`
- [ ] T-003.2: Update `@types/react-dom` to match React 19
- [ ] T-003.3: Run `npm install` and verify no peer dep warnings
- [ ] T-003.4: Run `npm run build` — must succeed
- [ ] T-003.5: Run `npm run test` — existing tests must pass
References:
- `/package.json` (lines 36-37, 55-56)
Dependencies: T-001, T-002
Effort: S

---

## 🟠 PHASE 1: Security & Stability (P1)
> Fix security issues and stabilize production readiness.

### T-004: Add input validation to OG image route
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- `/app/api/og/route.tsx` accepts `title` and `subtitle` query params without validation
- Could cause memory issues with very long strings
- Defense-in-depth: sanitize even low-risk inputs
- Found during SECURITYAUDIT.md run
Acceptance Criteria:
- [ ] T-004.1: Add Zod schema for query params with max lengths (title: 200, subtitle: 500)
- [ ] T-004.2: Import and use `escapeHtml` from `lib/sanitize.ts`
- [ ] T-004.3: Return 400 error for invalid inputs
- [ ] T-004.4: Add unit test for validation
- [ ] T-004.5: Test manually with malicious inputs
References:
- `/app/api/og/route.tsx`
- `/lib/sanitize.ts`
Dependencies: T-001, T-002, T-003
Effort: S

### T-005: Add honeypot field for spam prevention
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- Rate limiting exists but honeypot provides zero-cost spam reduction
- Hidden field that bots fill but humans don't see
- Industry standard anti-spam technique
Acceptance Criteria:
- [ ] T-005.1: Add hidden `website` field to contact form schema (must be empty)
- [ ] T-005.2: Add visually hidden input to ContactForm component
- [ ] T-005.3: Reject submissions where honeypot is filled in `lib/actions.ts`
- [ ] T-005.4: Add unit test for honeypot rejection
- [ ] T-005.5: Document in SECURITY.md
References:
- `/components/ContactForm.tsx`
- `/lib/contact-form-schema.ts`
- `/lib/actions.ts`
- `/SECURITY.md`
Dependencies: T-001, T-002
Effort: S

### T-006: Implement comprehensive accessibility audit
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- WCAG 2.1 AA compliance required for Diamond Standard
- Found aria-labels in SearchDialog, Footer, Breadcrumbs ✅
- Missing: systematic audit, keyboard navigation testing, color contrast verification
Acceptance Criteria:
- [ ] T-006.1: Install axe-core devDependency for automated scanning
- [ ] T-006.2: Create `scripts/a11y-audit.sh` to run axe on all pages
- [ ] T-006.3: Verify all interactive elements have visible focus indicators
- [ ] T-006.4: Test keyboard navigation for forms, modals, navigation
- [ ] T-006.5: Verify color contrast ratios (4.5:1 minimum)
- [ ] T-006.6: Document a11y standards in `docs/UI_DESIGN_SYSTEM.md`
- [ ] T-006.7: Add `npm run a11y` script to package.json
References:
- All components and pages
- `/docs/UI_DESIGN_SYSTEM.md`
Dependencies: T-003
Effort: M

### T-007: Implement performance monitoring and budgets
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- No Lighthouse CI or performance budgets configured
- Diamond Standard requires: LCP < 2.5s, FID < 100ms, CLS < 0.1
- @next/bundle-analyzer already available
Acceptance Criteria:
- [ ] T-007.1: Create `lighthouserc.json` with Core Web Vitals budgets
- [ ] T-007.2: Add `npm run lighthouse` script for local testing
- [ ] T-007.3: Add bundle size budget (main JS < 200KB gzipped)
- [ ] T-007.4: Document targets in `docs/OBSERVABILITY.md`
- [ ] T-007.5: Add `npm run analyze` script using bundle-analyzer
References:
- Create `/lighthouserc.json`
- `/next.config.mjs`
- `/docs/OBSERVABILITY.md`
Dependencies: T-003
Effort: M

### T-008: Add comprehensive error tracking
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Sentry configured but basic
- Missing: granular error boundaries, performance transactions
Acceptance Criteria:
- [ ] T-008.1: Add error boundaries to major page sections (not just root)
- [ ] T-008.2: Configure Sentry source maps for production builds
- [ ] T-008.3: Add performance monitoring for form submissions
- [ ] T-008.4: Document monitoring strategy in `docs/OBSERVABILITY.md`
References:
- `/components/ErrorBoundary.tsx`
- `/docs/OBSERVABILITY.md`
- `/docs/SENTRY-SETUP.md`
Dependencies: T-003
Effort: M

### T-009: Document production deployment details (Trevor)
Priority: P1
Type: DOCS
Owner: Trevor
Status: READY
Context:
- `docs/DEPLOYMENT.md` is a template with no actual deployment info
- Rollback procedures undefined
- Required for production readiness
Acceptance Criteria:
- [ ] T-009.1: Fill target environments (local/staging/production URLs)
- [ ] T-009.2: Document Cloudflare Pages deployment process
- [ ] T-009.3: Document environment variables needed
- [ ] T-009.4: Define rollback plan
- [ ] T-009.5: Document DNS/domain configuration
References:
- `/docs/DEPLOYMENT.md`
Dependencies: None
Effort: M

---

## 🟡 PHASE 2: Quality & Testing (P2)
> Improve test coverage, code quality, and documentation.

### T-010: Add E2E tests for error states
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Existing E2E tests cover happy paths only
- Missing: error states, network failures, edge cases
Acceptance Criteria:
- [ ] T-010.1: Add E2E test for network failure on contact form
- [ ] T-010.2: Add E2E test for rate limiting behavior
- [ ] T-010.3: Add E2E test for 404 page
- [ ] T-010.4: Add E2E test for search with no results
- [ ] T-010.5: Update `docs/TESTING_STRATEGY.md` with E2E patterns
References:
- `/tests/e2e/`
- `/docs/TESTING_STRATEGY.md`
Dependencies: T-003
Effort: M

### T-011: Add unit tests for untested components
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Target: 80%+ coverage for critical paths
- Missing tests: Hero, ValueProps, ServicesOverview, ServiceDetailLayout, SocialProof
Acceptance Criteria:
- [ ] T-011.1: Add tests for Hero component
- [ ] T-011.2: Add tests for ValueProps component
- [ ] T-011.3: Add tests for ServicesOverview component
- [ ] T-011.4: Add tests for ServiceDetailLayout component
- [ ] T-011.5: Add tests for SocialProof component
- [ ] T-011.6: Add coverage threshold to vitest.config.ts (80% lines)
References:
- `/__tests__/components/`
- `/vitest.config.ts`
Dependencies: T-003
Effort: L

### T-012: Implement structured data for SEO
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Organization JSON-LD exists in layout.tsx ✅
- Missing: Article, Service, BreadcrumbList schemas
Acceptance Criteria:
- [ ] T-012.1: Add Article schema to blog post pages
- [ ] T-012.2: Add Service schema to service detail pages
- [ ] T-012.3: Add BreadcrumbList schema to pages with breadcrumbs
- [ ] T-012.4: Validate with Google Rich Results Test
- [ ] T-012.5: Document schema patterns in repo
References:
- `/app/blog/[slug]/page.tsx`
- `/app/services/*/page.tsx`
- `/components/Breadcrumbs.tsx`
Dependencies: T-003
Effort: M

### T-013: Fix vitest.setup.tsx `any` type usage
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Line 28: `({ src, alt, ...props }: any)` uses `any` type
- Should use explicit ImageProps or custom interface
- Violates strict typing standards
Acceptance Criteria:
- [ ] T-013.1: Create proper interface for mock Image component props
- [ ] T-013.2: Replace `any` with typed interface
- [ ] T-013.3: Verify tests still pass
References:
- `/vitest.setup.tsx` (line 28)
Dependencies: T-003
Effort: XS

### T-014: Replace console.log with logger in analytics.ts
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- `lib/analytics.ts` uses console.log for development logging
- Should use `logInfo` from `lib/logger.ts` for consistency
- Found on lines 64, 98
Acceptance Criteria:
- [ ] T-014.1: Import `logInfo` from `lib/logger.ts`
- [ ] T-014.2: Replace `console.log('[Analytics]'...)` with `logInfo('Analytics...')`
- [ ] T-014.3: Verify analytics events still log in dev mode
References:
- `/lib/analytics.ts` (lines 64, 98)
- `/lib/logger.ts`
Dependencies: None
Effort: XS

### T-015: Centralize hardcoded domain to env
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Domain `yourdedicatedmarketer.com` hardcoded in multiple files
- Should use `NEXT_PUBLIC_SITE_URL` from env
Acceptance Criteria:
- [ ] T-015.1: Update `app/layout.tsx` to use env variable
- [ ] T-015.2: Update `app/sitemap.ts` to use env variable
- [ ] T-015.3: Update `app/robots.ts` to use env variable
- [ ] T-015.4: Verify all metadata URLs use centralized config
References:
- `/app/layout.tsx`
- `/app/sitemap.ts`
- `/app/robots.ts`
- `/lib/env.ts`
Dependencies: None
Effort: S

### T-016: Create mobile-first smoke test checklist
Priority: P2
Type: RELEASE
Owner: AGENT
Status: READY
Context:
- No documented smoke test checklist for pre-release
- Marketing site is mobile-first
Acceptance Criteria:
- [ ] T-016.1: Create `docs/RELEASE_CHECKLIST.md`
- [ ] T-016.2: Include mobile viewport tests (home, services, pricing, contact)
- [ ] T-016.3: Include contact form submission test
- [ ] T-016.4: Include SEO metadata verification
- [ ] T-016.5: Include Lighthouse mobile score check
- [ ] T-016.6: Include broken link check
References:
- Create `/docs/RELEASE_CHECKLIST.md`
Dependencies: None
Effort: S

### T-017: Add comprehensive form validation UX
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Contact form has Zod validation but UX could be improved
- Missing: real-time field validation, accessible error announcements
Acceptance Criteria:
- [ ] T-017.1: Add onBlur validation to contact form fields
- [ ] T-017.2: Add aria-live region for error announcements
- [ ] T-017.3: Add success indicators for valid fields
- [ ] T-017.4: Add character counter to message textarea
References:
- `/components/ContactForm.tsx`
- `/lib/contact-form-schema.ts`
Dependencies: T-003
Effort: M

### T-018: Implement visual regression testing
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Playwright configured but no visual tests
- Need to catch unintended UI changes
Acceptance Criteria:
- [ ] T-018.1: Configure Playwright screenshot testing
- [ ] T-018.2: Add visual tests for home, services, pricing pages
- [ ] T-018.3: Add tests for mobile/tablet/desktop viewports
- [ ] T-018.4: Create baseline screenshots
- [ ] T-018.5: Add `npm run test:visual` script
- [ ] T-018.6: Document in TESTING_STRATEGY.md
References:
- `/tests/e2e/`
- `/playwright.config.ts`
- `/docs/TESTING_STRATEGY.md`
Dependencies: T-003
Effort: M

### T-019: Implement advanced caching strategy
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Next.js default caching active
- Missing: explicit ISR for blog, cache headers optimization
Acceptance Criteria:
- [ ] T-019.1: Configure revalidate times for static pages
- [ ] T-019.2: Implement ISR for blog posts (revalidate: 3600)
- [ ] T-019.3: Add cache-control headers for static assets in middleware
- [ ] T-019.4: Document caching strategy
References:
- `/app/**/page.tsx`
- `/middleware.ts`
- `/next.config.mjs`
Dependencies: T-003
Effort: M

### T-020: Implement analytics and conversion tracking (Trevor)
Priority: P2
Type: QUALITY
Owner: Trevor
Status: BLOCKED
Context:
- Analytics placeholder exists but no implementation
- Needs provider account setup (GA4 or Plausible)
Acceptance Criteria:
- [ ] T-020.1: Choose analytics provider (GA4 or Plausible)
- [ ] T-020.2: Provide NEXT_PUBLIC_ANALYTICS_ID
- [ ] T-020.3: Agent implements tracking after ID provided
References:
- `/lib/analytics.ts`
Dependencies: Trevor provides analytics ID
Effort: S (Agent), External (Trevor)

### T-021: Add image optimization with next/image
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Verify all images use Next.js Image component
- Ensure optimization, lazy loading, responsive sizing
Acceptance Criteria:
- [ ] T-021.1: Audit all `<img>` tags and convert to next/image
- [ ] T-021.2: Add proper width/height/alt to all images
- [ ] T-021.3: Add priority prop to above-fold hero images
- [ ] T-021.4: Document image guidelines in UI_DESIGN_SYSTEM.md
References:
- `/components/**/*.tsx`
- `/app/**/*.tsx`
- `/docs/UI_DESIGN_SYSTEM.md`
Dependencies: None
Effort: M

---

## 📚 PHASE 3: Documentation (P1-P2)
> Critical documentation for security-critical code.

### T-022: Add JSDoc to lib/actions.ts (submitContactForm)
Priority: P1
Type: DOCS
Owner: AGENT
Status: BLOCKED
Context:
- Server action is security-critical (rate limiting, sanitization, email)
- Complex error handling needs explanation
- Current code comment score: 4/10
Acceptance Criteria:
- [ ] T-022.1: Verify existing JSDoc is accurate after T-001 fix
- [ ] T-022.2: Document rate limiting strategy
- [ ] T-022.3: Document security measures (XSS, IP hashing)
- [ ] T-022.4: Add usage example with error handling
- [ ] T-022.5: Document all return types
References:
- `/lib/actions.ts`
Dependencies: T-001, T-002
Effort: S

### T-023: Document middleware.ts security headers
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Security perimeter with minimal documentation
- CSP rules need rationale explanation
- 'unsafe-inline' needs justification
Acceptance Criteria:
- [ ] T-023.1: Add JSDoc to middleware function
- [ ] T-023.2: Document each security header's purpose
- [ ] T-023.3: Explain CSP directives (why unsafe-inline)
- [ ] T-023.4: Document production vs development differences
- [ ] T-023.5: Add future hardening notes (nonce-based CSP)
References:
- `/middleware.ts`
Dependencies: None
Effort: S

### T-024: Enhance lib/sanitize.ts security docs
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Security-critical XSS prevention code
- Missing attack examples and usage scenarios
Acceptance Criteria:
- [ ] T-024.1: Add XSS attack examples to escapeHtml JSDoc
- [ ] T-024.2: Document HTML entity encoding specifics
- [ ] T-024.3: Add references to OWASP guidelines
- [ ] T-024.4: Document when to use each function
References:
- `/lib/sanitize.ts`
Dependencies: None
Effort: S

### T-025: Add JSDoc to lib/env.ts
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Environment validation is critical for deployment
- Helper functions lack usage docs
Acceptance Criteria:
- [ ] T-025.1: Document env schema validation rules
- [ ] T-025.2: Document behavior on validation failure
- [ ] T-025.3: Add JSDoc to getBaseUrl and other helpers
- [ ] T-025.4: Add examples for different environments
References:
- `/lib/env.ts`
Dependencies: None
Effort: S

### T-026: Add JSDoc to ContactForm component
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Complex form with React Hook Form + Zod
- State machine and Sentry integration undocumented
Acceptance Criteria:
- [ ] T-026.1: Add component-level JSDoc
- [ ] T-026.2: Document validation flow
- [ ] T-026.3: Document state machine (idle → submitting → success/error)
- [ ] T-026.4: Document accessibility features
References:
- `/components/ContactForm.tsx`
Dependencies: T-022
Effort: S

### T-027: Document SearchDialog keyboard navigation
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Complex search with keyboard nav undocumented
- Accessibility features not explained
Acceptance Criteria:
- [ ] T-027.1: Add component-level JSDoc
- [ ] T-027.2: Document keyboard shortcuts (Cmd+K, arrows, Escape, Enter)
- [ ] T-027.3: Document search filtering algorithm
- [ ] T-027.4: Document ARIA implementation
References:
- `/components/SearchDialog.tsx`
Dependencies: None
Effort: S

### T-028: Add JSDoc to Navigation mobile handling
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Mobile menu behavior undocumented
- Focus trap implementation unclear
Acceptance Criteria:
- [ ] T-028.1: Document mobile menu toggle
- [ ] T-028.2: Document keyboard navigation
- [ ] T-028.3: Document focus trap when menu open
References:
- `/components/Navigation.tsx`
Dependencies: None
Effort: S

### T-029: Create UI component JSDoc template
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- 9 UI components in components/ui/ lack documentation
- Need standardized template for consistency
Acceptance Criteria:
- [ ] T-029.1: Create `/docs/UI_COMPONENT_JSDOC_TEMPLATE.md`
- [ ] T-029.2: Include variant system patterns
- [ ] T-029.3: Include accessibility requirements
- [ ] T-029.4: Include validation state patterns
References:
- Create `/docs/UI_COMPONENT_JSDOC_TEMPLATE.md`
- `/components/ui/`
Dependencies: None
Effort: S

### T-030: Add JSDoc to UI components (Button, Card, Input, Select)
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Core UI components lack documentation
- Variant systems not explained
Acceptance Criteria:
- [ ] T-030.1: Add JSDoc to Button (variants, sizes, disabled)
- [ ] T-030.2: Add JSDoc to Card (variant system, layout)
- [ ] T-030.3: Add JSDoc to Input (validation states)
- [ ] T-030.4: Add JSDoc to Select (options handling)
References:
- `/components/ui/button.tsx`
- `/components/ui/card.tsx`
- `/components/ui/input.tsx`
- `/components/ui/select.tsx`
Dependencies: T-029
Effort: M

### T-031: Add README to docs/ARCHIVE
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- ARCHIVE contains old docs that may confuse agents
- No explanation for why files are archived
Acceptance Criteria:
- [ ] T-031.1: Create `docs/ARCHIVE/README.md`
- [ ] T-031.2: Explain these are historical/superseded documents
- [ ] T-031.3: Add "Do not use for new work" warning
References:
- Create `/docs/ARCHIVE/README.md`
Dependencies: None
Effort: XS

---

## 🔵 PHASE 4: Enhancements (P3)
> Nice-to-have improvements for Diamond Standard.

### T-032: Implement i18n foundation
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Context:
- Currently hardcoded to English
- Future-proofing for potential multi-language
Acceptance Criteria:
- [ ] T-032.1: Add next-intl library
- [ ] T-032.2: Extract user-facing strings to translation files
- [ ] T-032.3: Add language switcher (en only initially)
- [ ] T-032.4: Document i18n architecture
References:
- `/app/layout.tsx`
- Create `/locales/`
Dependencies: None
Effort: L

### T-033: Implement feature flags system
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Context:
- No feature flag system exists
- Would enable safer rollouts and A/B testing
Acceptance Criteria:
- [ ] T-033.1: Add simple env-based feature flags (lib/feature-flags.ts)
- [ ] T-033.2: Document feature flag patterns
- [ ] T-033.3: Add example usage
References:
- Create `/lib/feature-flags.ts`
Dependencies: None
Effort: S

### T-034: Advanced SEO features
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Basic SEO exists
- Missing: dynamic sitemap for blog, canonical URLs
Acceptance Criteria:
- [ ] T-034.1: Verify sitemap.ts generates all pages
- [ ] T-034.2: Add lastmod dates to sitemap
- [ ] T-034.3: Add canonical URLs for paginated content
References:
- `/app/sitemap.ts`
- `/app/robots.ts`
Dependencies: None
Effort: S

### T-035: Add progressive enhancement audit
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Ensure critical functionality works without JavaScript
Acceptance Criteria:
- [ ] T-035.1: Audit forms for no-JS functionality
- [ ] T-035.2: Add noscript tags for critical content
- [ ] T-035.3: Document which features require JS
- [ ] T-035.4: Test site with JS disabled
References:
- `/app/page.tsx`
- `/components/**/*.tsx`
Dependencies: None
Effort: S

### T-036: Performance profiling setup
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- No performance profiling in place
- Would help identify bottlenecks
Acceptance Criteria:
- [ ] T-036.1: Add React DevTools Profiler integration
- [ ] T-036.2: Document performance optimization guide
References:
- `/docs/OBSERVABILITY.md`
Dependencies: T-007
Effort: M

### T-037: Document remaining UI components (Dialog, Label, etc.)
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Remaining UI components need docs for completeness
Acceptance Criteria:
- [ ] T-037.1: Add JSDoc to Dialog
- [ ] T-037.2: Add JSDoc to Label
- [ ] T-037.3: Add JSDoc to Separator
- [ ] T-037.4: Add JSDoc to Textarea
- [ ] T-037.5: Add JSDoc to Accordion
References:
- `/components/ui/dialog.tsx`
- `/components/ui/label.tsx`
- `/components/ui/separator.tsx`
- `/components/ui/textarea.tsx`
- `/components/ui/accordion.tsx`
Dependencies: T-029
Effort: M

### T-038: Document blog.ts and case-studies.ts
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Content handling undocumented
- Frontmatter schema unclear
Acceptance Criteria:
- [ ] T-038.1: Add JSDoc to blog.ts functions
- [ ] T-038.2: Document expected directory structure
- [ ] T-038.3: Document frontmatter schema
- [ ] T-038.4: Add JSDoc to case-studies.ts
References:
- `/lib/blog.ts`
- `/lib/case-studies.ts`
Dependencies: None
Effort: S

### T-039: Document InstallPrompt PWA flow
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- PWA installation flow undocumented
- Browser compatibility unclear
Acceptance Criteria:
- [ ] T-039.1: Add component-level JSDoc
- [ ] T-039.2: Document PWA installation flow
- [ ] T-039.3: Document browser compatibility
References:
- `/components/InstallPrompt.tsx`
Dependencies: None
Effort: S

### T-040: Document search.ts indexing algorithm
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Search implementation undocumented
- Algorithm and ranking not explained
Acceptance Criteria:
- [ ] T-040.1: Document search index generation
- [ ] T-040.2: Document search algorithm
- [ ] T-040.3: Add future enhancement notes (fuzzy search)
References:
- `/lib/search.ts`
Dependencies: None
Effort: S

### T-041: Document ServiceDetailLayout props
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Service layout props undocumented
- SEO benefits not explained
Acceptance Criteria:
- [ ] T-041.1: Add JSDoc to ServiceDetailProps
- [ ] T-041.2: Document Schema.org implementation
- [ ] T-041.3: Add usage example
References:
- `/components/ServiceDetailLayout.tsx`
Dependencies: None
Effort: S

### T-042: Enhance sentry-sanitize.ts with examples
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Has JSDoc but missing detailed examples
- What gets redacted needs clarity
Acceptance Criteria:
- [ ] T-042.1: Add sanitized vs unsanitized examples
- [ ] T-042.2: Document PII categories
References:
- `/lib/sentry-sanitize.ts`
Dependencies: None
Effort: S

### T-043: Enhance analytics.ts integration docs
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Has JSDoc but missing integration examples
Acceptance Criteria:
- [ ] T-043.1: Add provider integration examples
- [ ] T-043.2: Document event naming conventions
- [ ] T-043.3: Add testing strategy
References:
- `/lib/analytics.ts`
Dependencies: None
Effort: S

### T-044: Update CODEBASE-ANALYSIS.md after JSDoc work
Priority: P3
Type: DOCS
Owner: AGENT
Status: BLOCKED
Context:
- Code comment score: 4/10 needs update after JSDoc tasks
Acceptance Criteria:
- [ ] T-044.1: Update code comment score
- [ ] T-044.2: Document which files received JSDoc
- [ ] T-044.3: Update recommendations section
References:
- `/docs/architecture/CODEBASE-ANALYSIS.md`
Dependencies: T-022 through T-043
Effort: S

### T-045: Add component library documentation (Storybook)
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- No interactive component documentation
- Would improve developer experience
Acceptance Criteria:
- [ ] T-045.1: Install and configure Storybook
- [ ] T-045.2: Add stories for UI components
- [ ] T-045.3: Add `npm run storybook` script
References:
- `/components/ui/`
Dependencies: T-029, T-030
Effort: L

---

## Task Summary

| Phase | Priority | Count | Focus |
|-------|----------|-------|-------|
| 0 | P0 | 3 | Build blockers — MUST FIX FIRST |
| 1 | P1 | 6 | Security & stability |
| 2 | P2 | 12 | Quality & testing |
| 3 | P1-P2 | 10 | Documentation |
| 4 | P3 | 14 | Enhancements |
| **Total** | | **45** | |

### Critical Path
```
T-001 (fix actions.ts syntax)
  └→ T-002 (add zod import)
      └→ T-003 (fix react-dom version)
          └→ T-004+ (all other tasks)
```

### Owner Summary
| Owner | Count | Notes |
|-------|-------|-------|
| AGENT | 42 | Codex/Claude Code/Copilot executable |
| Trevor | 3 | T-009, T-020 (external setup required) |

---

## References
- Authority order: `CODEBASECONSTITUTION.md` > `READMEAI.md` > `TODO.md`
- No automation may rewrite this file; scripts may generate `TODO.generated.md` (informational only)
- When completing tasks, move to `TODOCOMPLETED.md` with completion date

