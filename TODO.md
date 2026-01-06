# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-07
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Task schema (required)
- **ID**: `T-###` (unique)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `SECURITY | RELEASE | DEPENDENCY | DOCS | QUALITY | BUG | FEATURE | CHORE`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW`
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `S | M | L` (relative; explain if unclear)

### Priority meaning
- **P0**: blocks production readiness or causes security/data loss
- **P1**: high impact; do within 7 days
- **P2**: important but not urgent; do within 30 days
- **P3**: backlog/tech debt; do when convenient

### Ownership rule
- **Owner: AGENT** means the task can be executed by a coding agent in-repo.
- **Owner: Trevor** means it requires external actions (provider dashboards, DNS, billing, approvals).

## Active tasks (fill in)
> Keep tasks small and independently executable. Prefer ≤ 1 day per task.

### T-001: Add input validation to OG image route
Priority: P2
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- The `/app/api/og/route.tsx` endpoint accepts title and description query params without validation
- Could potentially be exploited for XSS in generated OG images (low risk but defense-in-depth)
- Found during SECURITYAUDIT.md run
Acceptance Criteria:
- [ ] Add max length validation for title param (200 chars)
- [ ] Add max length validation for description param (500 chars)
- [ ] Sanitize params using `escapeHtml` from `lib/sanitize.ts`
- [ ] Test with malicious inputs to verify sanitization works
References:
- `/app/api/og/route.tsx`
- `/lib/sanitize.ts`
Dependencies: None
Effort: S

### T-002: Document production deployment details
Priority: P1
Type: DOCS
Owner: Trevor
Status: READY
Context:
- `docs/DEPLOYMENT.md` is currently a template
- Production deployment to Vercel needs to be documented
- Rollback procedures need to be defined
- Found during RELEASEAUDIT.md run
Acceptance Criteria:
- [ ] Fill in target environments section (local/staging/production URLs)
- [ ] Document Vercel deployment process
- [ ] Document environment variable requirements
- [ ] Define rollback plan (Vercel dashboard + git revert)
- [ ] Document DNS and domain configuration if applicable
References:
- `/docs/DEPLOYMENT.md`
Dependencies: None
Effort: M

### T-003: Create mobile-first smoke test checklist
Priority: P1
Type: RELEASE
Owner: AGENT
Status: READY
Context:
- No documented smoke test checklist exists for pre-release validation
- Marketing site should be verified on mobile devices first (mobile-first design)
- Found during RELEASEAUDIT.md run
Acceptance Criteria:
- [ ] Create smoke test checklist in `docs/RELEASE_CHECKLIST.md`
- [ ] Include mobile viewport tests for key pages (home, services, pricing, contact)
- [ ] Include contact form submission test
- [ ] Include SEO metadata verification (title, description, OG tags)
- [ ] Include performance check (Lighthouse mobile score)
- [ ] Include broken link check
References:
- Create `/docs/RELEASE_CHECKLIST.md`
Dependencies: None
Effort: S

### T-004: Add README to ARCHIVE explaining archived files
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- `docs/ARCHIVE/` contains old audit files and docs that may confuse agents
- No explanation exists for why files are archived
- Found during DOCSAUDIT.md run
Acceptance Criteria:
- [ ] Create `docs/ARCHIVE/README.md`
- [ ] Explain that these are historical/superseded documents
- [ ] Reference the authoritative current versions in root/docs
- [ ] Add "Do not use these for new work" warning
References:
- Create `/docs/ARCHIVE/README.md`
- `/docs/ARCHIVE/`
Dependencies: None
Effort: S

### T-005: Add image optimization with next/image
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Currently no usage of Next.js Image component found in codebase
- Images should use next/image for automatic optimization, lazy loading, and responsive sizing
- This improves performance scores and reduces bandwidth usage
- Part of "Diamond Standard" initiative for performance optimization
Acceptance Criteria:
- [ ] Audit all <img> tags in components and convert to next/image
- [ ] Add proper width/height/alt attributes to all images
- [ ] Verify images are lazy-loaded by default
- [ ] Add priority prop to above-the-fold hero images
- [ ] Document image optimization guidelines in UI_DESIGN_SYSTEM.md
References:
- `/components/**/*.tsx`
- `/app/**/*.tsx`
- `/docs/UI_DESIGN_SYSTEM.md`
Dependencies: None
Effort: M

### T-006: Implement comprehensive accessibility audit
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Found aria-labels in SearchDialog, Footer, Breadcrumbs ✅
- Need to verify WCAG 2.1 AA compliance across all pages
- Missing skip-to-content links verification
- Need keyboard navigation testing for all interactive elements
- Part of "Diamond Standard" for accessibility (WCAG 2.1 AA minimum)
Acceptance Criteria:
- [ ] Run axe-core or similar a11y scanner on all pages
- [ ] Verify all interactive elements have focus indicators
- [ ] Test keyboard navigation for forms, modals, navigation
- [ ] Verify color contrast ratios meet WCAG AA (4.5:1 for normal text)
- [ ] Add alt text audit for all images
- [ ] Document accessibility standards in UI_DESIGN_SYSTEM.md
- [ ] Add a11y tests to CI/CD pipeline (npm script)
References:
- All components and pages
- `/docs/UI_DESIGN_SYSTEM.md`
Dependencies: None
Effort: L

### T-007: Add E2E tests for error states and edge cases
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Existing E2E tests cover happy paths ✅
- Missing tests for: loading states, error states, network failures
- Missing tests for: empty states (no blog posts, no search results)
- Part of "Diamond Standard" for testing coverage
Acceptance Criteria:
- [ ] Add E2E test for network failure on contact form submission
- [ ] Add E2E test for rate limiting (3 submissions in 1 hour)
- [ ] Add E2E test for 404 and 500 error pages
- [ ] Add E2E test for search with no results
- [ ] Add E2E test for blog/case studies with loading states
- [ ] Document E2E testing strategy in TESTING_STRATEGY.md
References:
- `/tests/e2e/`
- `/docs/TESTING_STRATEGY.md`
Dependencies: None
Effort: M

### T-008: Implement performance monitoring and budgets
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- No Lighthouse CI or performance budgets configured
- No bundle size monitoring in place
- Part of "Diamond Standard" for performance (Core Web Vitals targets)
- Should aim for: LCP < 2.5s, FID < 100ms, CLS < 0.1, FCP < 1.8s
Acceptance Criteria:
- [ ] Add Lighthouse CI configuration (lighthouserc.json)
- [ ] Define performance budgets (LCP, FID, CLS, bundle size)
- [ ] Add npm script to run Lighthouse locally
- [ ] Document performance targets in docs/OBSERVABILITY.md
- [ ] Add bundle analysis script (already have @next/bundle-analyzer support)
- [ ] Consider adding performance monitoring to Sentry
References:
- Create `/lighthouserc.json`
- `/docs/OBSERVABILITY.md`
- `/next.config.mjs` (bundle analyzer)
Dependencies: None
Effort: M

### T-009: Add comprehensive unit test coverage
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Unit tests exist for lib/ functions ✅
- Missing tests for: components/Hero, ValueProps, ServicesOverview, CaseStudyHighlight, FinalCTA
- Missing tests for: app route handlers (currently no API routes except /api/og)
- Target: 80%+ coverage for critical paths
- Part of "Diamond Standard" for testing
Acceptance Criteria:
- [ ] Add unit tests for all untested components
- [ ] Add unit tests for OG image route
- [ ] Achieve 80%+ coverage on lib/ and components/
- [ ] Add coverage threshold enforcement to vitest.config.ts
- [ ] Document coverage requirements in TESTING_STRATEGY.md
References:
- `/__tests__/`
- `/vitest.config.ts`
- `/docs/TESTING_STRATEGY.md`
Dependencies: None
Effort: L

### T-010: Implement structured data for SEO
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Found Organization JSON-LD schema in layout.tsx ✅
- Missing: Article schema for blog posts
- Missing: Service schema for service pages
- Missing: BreadcrumbList schema
- Part of "Diamond Standard" for SEO optimization
Acceptance Criteria:
- [ ] Add Article schema to blog post pages
- [ ] Add Service schema to service detail pages
- [ ] Add BreadcrumbList schema to all pages with breadcrumbs
- [ ] Add FAQPage schema if FAQ sections exist
- [ ] Validate schemas with Google Rich Results Test
- [ ] Document schema.org implementation in SEO guide
References:
- `/app/blog/[slug]/page.tsx`
- `/app/services/*/page.tsx`
- `/app/layout.tsx`
Dependencies: None
Effort: M

### T-011: Add comprehensive error tracking and monitoring
Priority: P1
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Sentry is configured ✅
- Missing: Custom error boundaries for specific sections
- Missing: Performance transaction tracking
- Missing: User feedback mechanism
- Part of "Diamond Standard" for observability
Acceptance Criteria:
- [ ] Add error boundaries for major page sections (not just root)
- [ ] Add Sentry performance monitoring for critical flows
- [ ] Add user feedback widget for error states
- [ ] Configure Sentry source maps for production
- [ ] Add alerting rules for critical errors
- [ ] Document monitoring strategy in docs/OBSERVABILITY.md
References:
- `/components/ErrorBoundary.tsx`
- `/docs/OBSERVABILITY.md`
- `/docs/SENTRY-SETUP.md`
Dependencies: None
Effort: M

### T-012: Implement progressive enhancement strategy
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- SearchDialog, SocialProof, etc. use dynamic imports ✅
- Need systematic approach to progressive enhancement
- Ensure critical functionality works without JavaScript
- Part of "Diamond Standard" for resilience
Acceptance Criteria:
- [ ] Audit all forms to ensure they work with JS disabled
- [ ] Add noscript tags for critical content
- [ ] Document which features require JavaScript
- [ ] Test site with JavaScript disabled
- [ ] Add fallback content for dynamic imports
- [ ] Document progressive enhancement strategy
References:
- `/app/page.tsx`
- `/components/**/*.tsx`
Dependencies: None
Effort: S

### T-013: Add internationalization (i18n) foundation
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Context:
- Currently hardcoded to English (lang="en")
- Future-proofing for potential multi-language support
- Part of "Diamond Standard" for scalability
Acceptance Criteria:
- [ ] Add next-intl or similar i18n library
- [ ] Extract all user-facing strings to translation files
- [ ] Add language switcher component (initially just en)
- [ ] Configure routing for future language support
- [ ] Document i18n architecture in docs/
- [ ] Add locale detection from Accept-Language header
References:
- `/app/layout.tsx`
- Create `/locales/` directory
Dependencies: None
Effort: L

### T-014: Implement comprehensive security headers audit
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- Security headers exist in middleware.ts ✅
- Need to verify against OWASP recommendations
- Missing: Permissions-Policy header
- CSP allows unsafe-inline (documented as necessary for Next.js)
- Part of "Diamond Standard" for security
Acceptance Criteria:
- [ ] Add Permissions-Policy header (camera, microphone, geolocation, etc.)
- [ ] Document rationale for CSP unsafe-inline in SECURITY.md
- [ ] Run securityheaders.com scan and address findings
- [ ] Add Strict-Transport-Security header (HSTS)
- [ ] Consider upgrading CSP to stricter policy with nonces
- [ ] Document security headers in docs/SECURITY_BASELINE.md
References:
- `/middleware.ts`
- `/docs/SECURITY_BASELINE.md`
- `/SECURITY.md`
Dependencies: None
Effort: M

### T-015: Add comprehensive logging and debugging infrastructure
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Logger exists with logInfo, logWarn, logError ✅
- Missing: Structured logging with consistent format
- Missing: Request ID tracking across server actions
- Missing: Debug mode for development
- Part of "Diamond Standard" for observability
Acceptance Criteria:
- [ ] Add request ID generation and propagation
- [ ] Implement structured logging (JSON format)
- [ ] Add log levels configuration (DEBUG, INFO, WARN, ERROR)
- [ ] Add sensitive data redaction (emails, IPs)
- [ ] Add query logging for debugging
- [ ] Document logging standards in docs/OBSERVABILITY.md
References:
- `/lib/logger.ts`
- `/docs/OBSERVABILITY.md`
Dependencies: None
Effort: M

### T-016: Implement automated visual regression testing
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Playwright configured but no visual regression tests
- Need to catch unintended UI changes
- Part of "Diamond Standard" for UI quality assurance
Acceptance Criteria:
- [ ] Configure Playwright screenshot testing
- [ ] Add visual regression tests for key pages (home, services, pricing)
- [ ] Add visual tests for different viewports (mobile, tablet, desktop)
- [ ] Set up baseline screenshots
- [ ] Add npm script for updating baselines
- [ ] Document visual testing process in TESTING_STRATEGY.md
References:
- `/tests/e2e/`
- `/playwright.config.ts`
- `/docs/TESTING_STRATEGY.md`
Dependencies: None
Effort: M

### T-017: Add comprehensive form validation and UX improvements
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Contact form has Zod validation ✅
- Missing: Real-time field validation
- Missing: Accessible error messages
- Missing: Field-level success indicators
- Part of "Diamond Standard" for user experience
Acceptance Criteria:
- [ ] Add real-time validation (onBlur) to contact form
- [ ] Add accessible error announcements (aria-live)
- [ ] Add success indicators for valid fields
- [ ] Add character counters for text areas
- [ ] Add "saving" state indicators
- [ ] Add form analytics (field interaction tracking)
References:
- `/components/ContactForm.tsx`
- `/lib/contact-form-schema.ts`
Dependencies: None
Effort: M

### T-018: Implement content security and anti-spam measures
Priority: P1
Type: SECURITY
Owner: AGENT
Status: READY
Context:
- Rate limiting exists (3 req/hour) ✅
- Missing: Honeypot field for spam prevention
- Missing: Content validation for malicious payloads
- Missing: IP reputation checking
- Part of "Diamond Standard" for security
Acceptance Criteria:
- [ ] Add honeypot field to contact form (hidden from users)
- [ ] Add content pattern detection (spam keywords, URLs)
- [ ] Add configurable rate limit thresholds
- [ ] Add IP blocklist support
- [ ] Add CAPTCHA integration (optional, for high traffic)
- [ ] Document anti-spam strategy in SECURITY.md
References:
- `/lib/actions.ts`
- `/components/ContactForm.tsx`
- `/SECURITY.md`
Dependencies: None
Effort: M

### T-019: Add comprehensive analytics and conversion tracking
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Analytics placeholder exists (NEXT_PUBLIC_ANALYTICS_ID) ✅
- Missing: Event tracking implementation
- Missing: Conversion goal tracking
- Missing: Performance monitoring
- Part of "Diamond Standard" for business metrics
Acceptance Criteria:
- [ ] Implement Google Analytics 4 or Plausible
- [ ] Add event tracking for: form submissions, CTA clicks, navigation
- [ ] Add conversion goal tracking (contact form success)
- [ ] Add custom events for user engagement
- [ ] Add privacy-compliant cookie consent
- [ ] Document analytics strategy in docs/
References:
- `/lib/analytics.ts`
- `/app/layout.tsx`
Dependencies: T-002 (Trevor needs to provide analytics ID)
Effort: M

### T-020: Implement advanced caching strategy
Priority: P2
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Next.js default caching active ✅
- Missing: Explicit cache control for dynamic content
- Missing: Revalidation strategy for blog/case studies
- Missing: CDN cache headers
- Part of "Diamond Standard" for performance
Acceptance Criteria:
- [ ] Configure revalidate times for static pages
- [ ] Add cache headers for API routes
- [ ] Implement ISR (Incremental Static Regeneration) for blog
- [ ] Add cache-control headers in middleware for static assets
- [ ] Document caching strategy in docs/
- [ ] Add cache monitoring/analytics
References:
- `/app/**/page.tsx`
- `/middleware.ts`
- `/next.config.mjs`
Dependencies: None
Effort: M

### T-021: Add comprehensive documentation for developers
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Governance docs exist (Constitution, READMEAI) ✅
- Missing: Component library documentation
- Missing: Architecture decision records (ADRs)
- Missing: API documentation
- Part of "Diamond Standard" for maintainability
Acceptance Criteria:
- [ ] Add component library docs (Storybook or similar)
- [ ] Create ADRs for key architectural decisions
- [ ] Document API routes and server actions
- [ ] Add contributing guidelines (CONTRIBUTING.md)
- [ ] Add local development setup guide
- [ ] Add troubleshooting guide
References:
- Create `/docs/CONTRIBUTING.md`
- `/docs/adr/`
- `/docs/COMPONENT_LIBRARY.md`
Dependencies: None
Effort: L

## Backlog
<!-- Add future tasks here. -->

### T-025: Add JSDoc to lib/actions.ts (submitContactForm)
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Server action has NO documentation (233 lines)
- Security-critical: rate limiting, input sanitization, email delivery
- Complex error handling and fallback logic needs explanation
- Current code comment score: 4/10 per CODEBASE-ANALYSIS.md
- Blocks AI understanding of security guarantees
Acceptance Criteria:
- [ ] Add comprehensive JSDoc to submitContactForm function
- [ ] Document rate limiting strategy (Upstash vs in-memory)
- [ ] Document security measures (XSS prevention, IP hashing)
- [ ] Document email delivery flow and fallbacks
- [ ] Add usage example with error handling
- [ ] Document all thrown errors and return types
References:
- `/lib/actions.ts` (lines 133-233)
- Industry standard: JSDoc with @param, @returns, @throws, @example
Dependencies: None
Effort: S

### T-026: Enhance lib/sanitize.ts security documentation
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Security-critical XSS prevention code
- Has basic JSDoc but missing attack examples
- Needs clearer security guarantees and usage scenarios
- AI agents need to understand what attacks each function prevents
Acceptance Criteria:
- [ ] Enhance escapeHtml JSDoc with XSS attack examples
- [ ] Add documentation for HTML entity encoding specifics
- [ ] Add examples of dangerous inputs that are neutralized
- [ ] Document when to use escapeHtml vs other sanitization
- [ ] Add references to OWASP XSS prevention guidelines
References:
- `/lib/sanitize.ts` (60 lines, all functions)
- Industry standard: Security functions need threat model documentation
Dependencies: None
Effort: S

### T-027: Document middleware.ts security headers
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Security perimeter has NO documentation (75 lines)
- Complex CSP rules need rationale explanation
- 'unsafe-inline' and 'unsafe-eval' need justification
- Production vs development differences unclear
- Payload size limits and DoS prevention undocumented
Acceptance Criteria:
- [ ] Add comprehensive middleware function JSDoc
- [ ] Document each security header and its purpose
- [ ] Explain CSP directives with rationale (why 'unsafe-inline', etc.)
- [ ] Document payload size limits and DoS prevention
- [ ] Add future hardening roadmap notes (nonce-based CSP)
- [ ] Document production vs development differences
References:
- `/middleware.ts` (lines 1-75)
- Industry standard: OWASP Secure Headers Project
Dependencies: None
Effort: S

### T-028: Add JSDoc to lib/env.ts environment validation
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Environment validation logic undocumented (48 lines)
- Unclear what happens on validation failure
- Helper functions lack usage documentation
- Critical for deployment understanding
Acceptance Criteria:
- [ ] Add JSDoc to env schema explaining validation rules
- [ ] Document behavior on validation failure (throw vs default)
- [ ] Add JSDoc to helper functions (getBaseUrl, etc.)
- [ ] Document when to use each helper function
- [ ] Add examples for local, staging, production environments
References:
- `/lib/env.ts` (lines 1-48)
- Industry standard: Zod schema documentation patterns
Dependencies: None
Effort: S

### T-029: Document lib/sanitize.ts PII redaction logic
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Contact form sanitization logic undocumented (60 lines)
- Redaction patterns for PII not explained
- GDPR/CCPA compliance implications unclear
- Critical for privacy understanding
Acceptance Criteria:
- [ ] Add JSDoc to contact form sanitization functions
- [ ] Document what PII patterns are redacted and why
- [ ] Add GDPR/CCPA compliance notes
- [ ] Explain redaction vs deletion trade-offs
- [ ] Add examples of before/after sanitization
References:
- `/lib/sanitize.ts` (redaction functions)
Dependencies: T-026
Effort: S

### T-030: Add JSDoc to components/ContactForm.tsx
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Complex form component with NO documentation (182 lines)
- React Hook Form + Zod validation strategy unclear
- Async state management patterns undocumented
- Sentry integration purpose not explained
- Blocks AI understanding of validation flow
Acceptance Criteria:
- [ ] Add component-level JSDoc explaining features
- [ ] Document validation rules and strategy
- [ ] Document state machine (idle, submitting, success, error)
- [ ] Document Sentry context tracking
- [ ] Add accessibility features documentation (ARIA, labels)
- [ ] Add usage example
References:
- `/components/ContactForm.tsx` (182 lines)
- Industry standard: React component JSDoc patterns
Dependencies: T-025
Effort: M

### T-031: Document components/SearchDialog.tsx keyboard navigation
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Complex search component with NO documentation (150 lines)
- Keyboard navigation logic unclear
- Search algorithm (filtering, ranking) undocumented
- Focus management and accessibility features not explained
Acceptance Criteria:
- [ ] Add component-level JSDoc
- [ ] Document keyboard shortcuts (Cmd+K, Arrow keys, Escape, Enter)
- [ ] Document search filtering algorithm
- [ ] Document accessibility features (ARIA, focus management)
- [ ] Document memoization strategy for performance
- [ ] Add usage example
References:
- `/components/SearchDialog.tsx` (150 lines)
- Industry standard: Accessible component documentation patterns
Dependencies: None
Effort: M

### T-032: Add JSDoc to components/Navigation.tsx mobile handling
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Navigation component undocumented (116 lines)
- Mobile menu behavior not explained
- Keyboard handling logic unclear
- Focus trap implementation undocumented
Acceptance Criteria:
- [ ] Add component-level JSDoc
- [ ] Document mobile menu toggle behavior
- [ ] Document keyboard navigation handlers
- [ ] Document focus trap when menu open
- [ ] Document accessibility strategy
References:
- `/components/Navigation.tsx` (116 lines)
Dependencies: None
Effort: S

### T-033: Enhance lib/sentry-sanitize.ts with examples
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Has good JSDoc but missing detailed examples (137 lines)
- Sensitive data sanitization algorithm unclear
- What gets redacted and why needs more clarity
Acceptance Criteria:
- [ ] Add detailed examples of sanitized vs unsanitized data
- [ ] Document regex patterns for sensitive data detection
- [ ] Add PII categories (email, phone, credit cards, SSN)
- [ ] Document performance implications of sanitization
References:
- `/lib/sentry-sanitize.ts` (lines 50-95)
Dependencies: T-026, T-029
Effort: S

### T-034: Enhance lib/analytics.ts integration documentation
Priority: P1
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Has good JSDoc but missing integration examples (110 lines)
- How to add new analytics providers unclear
- Testing strategy not documented
Acceptance Criteria:
- [ ] Add examples for adding new analytics providers
- [ ] Document testing strategy for analytics events
- [ ] Add provider comparison notes (Vercel vs others)
- [ ] Document event naming conventions
- [ ] Add troubleshooting section
References:
- `/lib/analytics.ts` (lines 12-35)
Dependencies: None
Effort: S

### T-035: Add JSDoc to lib/blog.ts file structure expectations
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Blog data handling undocumented (81 lines)
- Expected directory structure unclear
- Frontmatter schema not documented
- Error handling for missing files unclear
Acceptance Criteria:
- [ ] Add JSDoc to all exported functions
- [ ] Document expected directory structure (content/blog/)
- [ ] Document frontmatter schema requirements
- [ ] Document error handling behavior
- [ ] Add usage examples
References:
- `/lib/blog.ts` (all functions)
Dependencies: None
Effort: S

### T-036: Document lib/case-studies.ts data structure
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Case study data hardcoded without documentation (167 lines)
- CaseStudy interface not documented
- Why hardcoded vs CMS not explained
- Future migration path unclear
Acceptance Criteria:
- [ ] Add JSDoc to CaseStudy interface
- [ ] Document why data is hardcoded (vs CMS)
- [ ] Add migration notes for future CMS integration
- [ ] Document helper functions
- [ ] Add examples of adding new case studies
References:
- `/lib/case-studies.ts` (lines 1-200)
Dependencies: None
Effort: S

### T-037: Add JSDoc to lib/search.ts indexing algorithm
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Search implementation undocumented (75 lines)
- Index generation unclear
- Search algorithm (filtering, ranking) not explained
- How to extend with new content types unclear
Acceptance Criteria:
- [ ] Add JSDoc to search index generation
- [ ] Document search algorithm and ranking logic
- [ ] Document how to add new content types
- [ ] Add performance notes (O(n) complexity)
- [ ] Add future enhancement ideas (fuzzy search)
References:
- `/lib/search.ts` (all functions)
Dependencies: None
Effort: S

### T-038: Document components/InstallPrompt.tsx PWA flow
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- PWA installation flow undocumented (110 lines)
- beforeinstallprompt event handling unclear
- localStorage strategy not explained
- Browser compatibility unclear
Acceptance Criteria:
- [ ] Add component-level JSDoc
- [ ] Document PWA installation flow
- [ ] Document localStorage strategy (dismissal tracking)
- [ ] Document browser compatibility
- [ ] Add user behavior tracking explanation
References:
- `/components/InstallPrompt.tsx` (110 lines)
Dependencies: None
Effort: S

### T-039: Add JSDoc to components/ServiceDetailLayout.tsx props
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Service detail layout undocumented (221 lines)
- ServiceDetailProps not documented
- Structured data implementation unclear
- SEO benefits not explained
Acceptance Criteria:
- [ ] Add JSDoc to ServiceDetailProps interface
- [ ] Document structured data (Schema.org) implementation
- [ ] Document SEO benefits
- [ ] Add usage example for new services
References:
- `/components/ServiceDetailLayout.tsx` (lines 1-30)
Dependencies: None
Effort: S

### T-040: Create UI component JSDoc documentation pattern
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- 9 UI components in components/ui/ lack documentation (95% gap)
- Need standardized JSDoc template for consistency
- Variant systems, accessibility, validation states undocumented
Acceptance Criteria:
- [ ] Create JSDoc template for UI components
- [ ] Document variant system pattern (Button, Card)
- [ ] Document accessibility requirements (ARIA)
- [ ] Document validation state patterns (Input, Select)
- [ ] Add usage examples to template
References:
- Create `/docs/UI_COMPONENT_JSDOC_TEMPLATE.md`
- `/components/ui/` (all files)
Dependencies: None
Effort: S

### T-041: Document components/ui/accordion.tsx ARIA implementation
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Complex ARIA accordion pattern undocumented
- Keyboard navigation not explained
- Accessibility requirements unclear
Acceptance Criteria:
- [ ] Add component JSDoc following UI template
- [ ] Document ARIA roles and attributes
- [ ] Document keyboard navigation (Arrow keys, Home, End)
- [ ] Add accessibility compliance notes (WCAG 2.1)
- [ ] Add usage example
References:
- `/components/ui/accordion.tsx`
Dependencies: T-040
Effort: S

### T-042: Add JSDoc to components/ui/ components (Button, Card, Input, Select)
Priority: P2
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Core UI components lack documentation
- Variant systems not explained (Button has multiple variants)
- Validation states not documented (Input, Select)
Acceptance Criteria:
- [ ] Add JSDoc to Button (variants, sizes, disabled state)
- [ ] Add JSDoc to Card (variant system, layout)
- [ ] Add JSDoc to Input (validation states, accessibility)
- [ ] Add JSDoc to Select (validation states, options handling)
- [ ] Follow UI component template from T-040
References:
- `/components/ui/button.tsx`
- `/components/ui/card.tsx`
- `/components/ui/input.tsx`
- `/components/ui/select.tsx`
Dependencies: T-040
Effort: M

### T-043: Document remaining components/ui/ components (Dialog, Label, Separator, Textarea)
Priority: P3
Type: DOCS
Owner: AGENT
Status: READY
Context:
- Remaining UI components need documentation for completeness
- Lower priority than core interactive components
Acceptance Criteria:
- [ ] Add JSDoc to Dialog (overlay, accessibility)
- [ ] Add JSDoc to Label (accessibility, form association)
- [ ] Add JSDoc to Separator (spacing, semantic HTML)
- [ ] Add JSDoc to Textarea (validation, auto-resize)
- [ ] Follow UI component template from T-040
References:
- `/components/ui/dialog.tsx`
- `/components/ui/label.tsx`
- `/components/ui/separator.tsx`
- `/components/ui/textarea.tsx`
Dependencies: T-040
Effort: M

### T-044: Update CODEBASE-ANALYSIS.md with new JSDoc coverage score
Priority: P2
Type: DOCS
Owner: AGENT
Status: BLOCKED
Context:
- Current code comment score: 4/10
- After completing JSDoc tasks, score should be 9/10
- Need to update docs/architecture/CODEBASE-ANALYSIS.md
Acceptance Criteria:
- [ ] Update code comment score from 4/10 to new score
- [ ] Document files that received JSDoc
- [ ] Update recommendations section
- [ ] Add "Last Updated" date
References:
- `/docs/architecture/CODEBASE-ANALYSIS.md` (lines 448-470)
Dependencies: T-025 through T-043
Effort: S

### T-022: Implement advanced SEO features
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- Basic SEO (metadata, OG tags) exists ✅
- Missing: XML sitemap generation (sitemap.ts exists but need to verify)
- Missing: robots.txt customization
- Missing: Canonical URLs for pagination
- Part of "Diamond Standard" for discoverability
Acceptance Criteria:
- [ ] Verify sitemap.ts generates all pages
- [ ] Add dynamic sitemap for blog posts and case studies
- [ ] Add lastmod dates to sitemap
- [ ] Customize robots.txt for crawl optimization
- [ ] Add canonical URLs for paginated content
- [ ] Document SEO strategy
References:
- `/app/sitemap.ts`
- `/app/robots.ts`
Dependencies: None
Effort: S

### T-023: Implement feature flags system
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- No feature flag system exists
- Would enable safer rollouts and A/B testing
- Part of "Diamond Standard" for deployment safety
Acceptance Criteria:
- [ ] Add feature flag library (e.g., PostHog, LaunchDarkly, or simple env-based)
- [ ] Create feature flag management UI/config
- [ ] Add examples of feature-flagged components
- [ ] Document feature flag strategy
- [ ] Add gradual rollout capability
References:
- Create `/lib/feature-flags.ts`
Dependencies: None
Effort: M

### T-024: Add comprehensive performance profiling
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Context:
- No performance profiling in place
- Would help identify bottlenecks
- Part of "Diamond Standard" for performance
Acceptance Criteria:
- [ ] Add React DevTools Profiler integration
- [ ] Add server-side performance metrics
- [ ] Add database query performance tracking (if applicable)
- [ ] Create performance dashboard
- [ ] Document performance optimization guide
References:
- `/docs/OBSERVABILITY.md`
Dependencies: T-008 (Performance monitoring)
Effort: L

## References
- Legacy priority/category codes are preserved for context: SEC, DEP, REL, PERF, UX, DX.
- No automation is allowed to rewrite this file; optional scripts may generate `TODO.generated.md` for convenience only.
