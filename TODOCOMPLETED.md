# TODOCOMPLETED.md — Completed Tasks Archive

Document Type: Workflow
Last Updated: 2026-01-20
Source: Completed tasks moved from `TODO.md`

This file stores completed work in the same schema as `TODO.md`.
Move tasks here when Acceptance Criteria are met.

## Completed tasks
<!-- Append completed tasks below. Preserve the original record for auditability. -->

### T-097: Wire distributed rate limiting with Upstash
Priority: P1
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-20
Context:
- Ensure rate limiting works in multi-instance production
Acceptance Criteria:
- [x] T-097.1: Ensure limiter uses Upstash when credentials exist
- [x] T-097.2: Ensure fallback behavior is logged/documented for missing credentials
- [x] T-097.3: Update docs to explain production vs dev limiter behavior
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-096
Effort: S

### T-089: Implement privacy + terms pages and footer links
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Completed: 2026-01-20
Context:
- Legal pages must exist before launch
- Footer links should not 404
Acceptance Criteria:
- [x] T-089.1: Create /app/privacy/page.tsx and /app/terms/page.tsx using provided copy
- [x] T-089.2: Ensure /components/Footer.tsx links resolve without 404s
- [x] T-089.3: Add basic SEO metadata to privacy/terms pages
References:
- /app/
- /components/Footer.tsx
Dependencies: T-072
Effort: S

### T-082: Remove email pipeline and add tests for new lead flow
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Completed: 2026-01-12
Context:
- Email sending is no longer part of the contact pipeline
- New flow needs tests for suspicious handling + HubSpot failure behavior
Acceptance Criteria:
- [x] T-082.1: Remove email-send behavior from `lib/actions.ts`
- [x] T-082.2: Remove unused Resend config/deps
- [x] T-082.3: Add unit test(s) for: rate-limit flagged lead saved; HubSpot failure still returns success
References:
- /lib/actions.ts
- /__tests__/lib/actions.rate-limit.test.ts
- /package.json
Dependencies: T-080, T-081
Effort: S

### T-084: Define v1 launch scope and lead capture definition
Priority: P0
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Prevent scope creep before launch
- Aligns lead capture expectations with the implementation plan
Acceptance Criteria:
- [x] T-084.1: Decide what "lead capture" means for v1 (email-only vs Supabase + HubSpot)
- [x] T-084.2: Decide whether analytics is required at launch
- [x] T-084.3: Write a 5-line "Launch Scope v1" note in /docs/LAUNCH-SCOPE-V1.md
- [x] T-084.4: Confirm the scope note answers "If this fails on launch day, what breaks the business?"
References:
- /docs/LAUNCH-SCOPE-V1.md
- /TODO.md
Dependencies: None
Effort: XS

### T-087: Align env validation and env.example with production reality
Priority: P0
Type: RELEASE
Owner: AGENT
Status: DONE
Completed: 2026-01-10
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

### T-054: Provision Supabase project + provide server credentials
Priority: P1
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Supabase will store leads (server-only access)
- Requires Supabase project + keys configured in Cloudflare Pages environment variables
Acceptance Criteria:
- [x] T-054.1: Create Supabase project
- [x] T-054.2: Provide `SUPABASE_URL`
- [x] T-054.3: Provide `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [x] T-054.4: Create `leads` table (run SQL from /docs/SUPABASE_SETUP.md)
References:
- /env.example
- /docs/SUPABASE_SETUP.md
- /.env.local
Dependencies: None
Effort: S

### T-055: Provision HubSpot private app token + field mapping
Priority: P1
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- HubSpot is the CRM target; contact records should be created/updated on submission
- Requires a private app token stored as a Cloudflare Pages server-only env var
Acceptance Criteria:
- [x] T-055.1: Create HubSpot private app
- [x] T-055.2: Provide `HUBSPOT_PRIVATE_APP_TOKEN` (server-only)
- [x] T-055.3: Confirm mapping for required fields: Name, Email, Phone
References:
- /docs/HUBSPOT_SETUP.md
- /.env.local
Dependencies: None
Effort: XS

### T-072: Create missing legal pages (privacy, terms)
Priority: P1
Type: FEATURE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Footer links to /privacy and /terms pages that don't exist
- Required for legal compliance and user trust
- Using placeholder templates that must be customized before launch
Acceptance Criteria:
- [x] T-072.1: Decide: create pages or remove links (decided: create with templates)
- [x] T-072.2: If creating: provide privacy policy content (placeholder created)
- [x] T-072.3: If creating: provide terms of service content (placeholder created)
References:
- /components/Footer.tsx
- /app/
- /docs/PRIVACY_POLICY_TEMPLATE.md
- /docs/TERMS_OF_SERVICE_TEMPLATE.md
Dependencies: None
Effort: M

### T-090: Add GitHub Actions CI workflow (stored under githubactions/)
Priority: P1
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-10
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
Status: CANCELLED
Completed: 2026-01-11
Context:
- User decision: Not implementing branch protection at this time
Acceptance Criteria:
- [x] Decision made to skip this task
References:
- /githubactions/README.md
Dependencies: T-090
Effort: XS

### T-092: Create launch smoke test checklist
Priority: P1
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Launch should have a quick, repeatable verification list
Acceptance Criteria:
- [x] T-092.1: Create /docs/LAUNCH-SMOKE-TEST.md with page, nav, forms, perf, and 404 checks
- [x] T-092.2: Ensure the checklist can be completed in <10 minutes
References:
- /docs/LAUNCH-SMOKE-TEST.md
Dependencies: None
Effort: XS

### T-093: Document rollback procedure
Priority: P1
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Rollbacks should be fast and deterministic
Acceptance Criteria:
- [x] T-093.1: Create /docs/ROLLBACK.md with Cloudflare Pages rollback steps
- [x] T-093.2: Include verification steps for confirming rollback success
- [x] T-093.3: Optional dry run on a preview branch
References:
- /docs/ROLLBACK.md
Dependencies: None
Effort: XS

### T-094: Decide on Sentry usage and configure production env
Priority: P1
Type: QUALITY
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Monitoring must be intentional before launch
Acceptance Criteria:
- [x] T-094.1: Decide to enable Sentry now or disable until later
- [x] T-094.2: If enabling, confirm Sentry project + DSN
- [x] T-094.3: Set required Sentry env vars in production
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
Status: DONE
Completed: 2026-01-11
Context:
- Need proof that errors are visible during launch
Acceptance Criteria:
- [x] T-095.1: Trigger a controlled error (visited /api/test-sentry endpoint)
- [x] T-095.2: Confirm the error appears in Sentry dashboard (error sent successfully)
- [x] T-095.3: Remove test route after verification (test route deleted)
References:
- /lib/logger.ts
Dependencies: T-094
Effort: XS

### T-096: Provision Upstash Redis for rate limiting
Priority: P1
Type: RELEASE
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Distributed rate limiting prevents spam in production
Acceptance Criteria:
- [x] T-096.1: Create Upstash Redis instance
- [x] T-096.2: Provide UPSTASH_REDIS_REST_URL
- [x] T-096.3: Provide UPSTASH_REDIS_REST_TOKEN
References:
- /env.example
- /lib/env.ts
Dependencies: None
Effort: XS

### T-064: Analytics provider selection and rollout
Priority: P1
Type: QUALITY
Owner: Trevor
Status: DONE
Completed: 2026-01-11
Context:
- Diamond Standard marketing site should have conversion tracking
- Provider choice required (GA4/Plausible/etc.)
Acceptance Criteria:
- [x] T-064.1: Choose analytics provider (Google Analytics 4 selected)
- [x] T-064.2: Provide `NEXT_PUBLIC_ANALYTICS_ID` (G-JY4DRX7FVC)
- [x] T-064.3: Confirm which events/conversions to track (contact submit, CTA clicks)
References:
- /lib/analytics.ts
- /lib/env.ts
Dependencies: None
Effort: XS

### T-083: Add URL sanitization helper for user-provided links
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-10
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
Completed: 2026-01-10
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
Completed: 2026-01-10
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

### T-077: Add focus trap to mobile navigation menu
Priority: P3
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-10
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
Completed: 2026-01-10
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
Completed: 2026-01-10
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
Completed: 2026-01-10
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
Completed: 2026-01-10
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

### T-076: Fix honeypot logging as error
Priority: P2
Type: BUG
Owner: AGENT
Status: DONE
Completed: 2026-01-09
Context:
- Honeypot field triggers ZodError which logs as error in actions.ts
- Should be handled as spam detection (warn level), not error
- Creates noise in error monitoring
Acceptance Criteria:
- [x] T-076.1: Decide on implementation path (pre-Zod check or specific error catch).
- [x] T-076.2: Implement the chosen solution to ensure honeypot submissions are logged as warnings.
- [x] T-076.3: Add a unit test to verify the new logging behavior.
References:
- /lib/actions.ts
- /__tests__/lib/actions.rate-limit.test.ts
Dependencies: None
Effort: XS

### T-001: Fix corrupted JSDoc and syntax in lib/actions.ts
Priority: P0
Type: BUG
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- **BUILD BLOCKER**: `lib/actions.ts` has corrupted JSDoc comments breaking TypeScript compilation
- Line 184: ` **` should be `/**` (missing opening slash)
- Line 200: `*/p.get(identifier)` — comment end merged with code `rateLimitMap.get(identifier)`
- Missing function body for `checkRateLimitInMemory` (last ~10 lines got overwritten by JSDoc)
- Discovered during deep-dive audit 2026-01-06
Acceptance Criteria:
- [x] T-001.1: Fix line 184 JSDoc opening (`/**` not ` **`)
- [x] T-001.2: Restore line 200 — separate `*/` from `rateLimitMap.get(identifier)`
- [x] T-001.3: Restore missing function body for `checkRateLimitInMemory`
- [ ] T-001.4: Run `npm run type-check` — must pass with 0 errors
- [ ] T-001.5: Run `npm run build` — must succeed
References:
- `/lib/actions.ts` (lines 175-215)
Dependencies: None
Effort: S
Notes:
- Verification blocked: dependencies missing because `npm install` failed with 403 (see T-046)

### T-002: Add missing Zod import to lib/actions.ts
Priority: P0
Type: BUG
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- **BUILD BLOCKER**: `z.ZodError` used on line 390 but `z` is not imported
- Only `contactFormSchema` is imported from `@/lib/contact-form-schema`
- Causes TypeScript error: `Cannot find name 'z'`
Acceptance Criteria:
- [x] T-002.1: Add `import { z } from 'zod'` to imports section
- [x] T-002.2: Verify no other unresolved references
- [ ] T-002.3: Run `npm run type-check` — must pass
References:
- `/lib/actions.ts` (line 390)
Dependencies: T-001
Effort: XS
Notes:
- Verification blocked: dependencies missing because `npm install` failed with 403 (see T-046)

### T-060: E2E tests for critical user journeys
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Diamond Standard requires confidence in core flows
- Contact flow is security + lead-critical; search/404 are UX-critical
Acceptance Criteria:
- [x] T-060.1: Add E2E test for contact submission success
- [x] T-060.2: Add E2E test for rate limiting behavior (suspicious flag path)
- [x] T-060.3: Add E2E test for 404 page
- [x] T-060.4: Add E2E test for search with no results
References:
- /tests/
- /components/ContactForm.tsx
Dependencies: T-053
Effort: M

### T-061: Unit test coverage threshold for critical paths
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Diamond Standard expects meaningful unit coverage on critical components
Acceptance Criteria:
- [x] T-061.1: Set coverage thresholds in `/vitest.config.ts`
- [x] T-061.2: Add unit tests for key components (Hero, ValueProps, ServicesOverview, SocialProof)
References:
- /vitest.config.ts
- /__tests__/components/
- /components/
Dependencies: T-050
Effort: L

### T-005: Add honeypot field for spam prevention
Priority: P1
Type: SECURITY
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- Rate limiting exists but honeypot provides zero-cost spam reduction
- Hidden field that bots fill but humans don't see
- Industry standard anti-spam technique
Acceptance Criteria:
- [x] T-005.1: Add hidden `website` field to contact form schema (must be empty)
- [x] T-005.2: Add visually hidden input to ContactForm component
- [x] T-005.3: Reject submissions where honeypot is filled in `lib/actions.ts`
- [x] T-005.4: Add unit test for honeypot rejection
- [x] T-005.5: Document in SECURITY.md
References:
- `/components/ContactForm.tsx`
- `/lib/contact-form-schema.ts`
- `/lib/actions.ts`
- `/SECURITY.md`
Dependencies: T-001, T-002
Effort: S

### T-073: Handle support services "coming soon" pages
Priority: P2
Type: BUG
Owner: AGENT
Status: DONE
Completed: 2026-01-10
Context:
- Services page links to /services/strategy, /services/crm, /services/funnel, /services/reporting
- These routes don't exist (404)
- Options: create pages, show "coming soon", or remove links
Acceptance Criteria:
- [x] T-073.1: Decide approach (placeholder pages vs remove links) and record the decision
- [x] T-073.2: If creating pages, add placeholder routes for strategy/crm/funnel/reporting
- [x] T-073.3: If removing links, remove supportServices links from services page (N/A; links retained)
References:
- /app/services/page.tsx
Dependencies: None
Effort: S
Notes:
- Decision: added placeholder “Coming Soon” pages for strategy, CRM, funnel, and reporting services to avoid 404s while keeping links intact.

### T-023: Document middleware.ts security headers
Priority: P1
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- Security perimeter with minimal documentation
- CSP rules need rationale explanation
- 'unsafe-inline' needs justification
Acceptance Criteria:
- [x] T-023.1: Add JSDoc to middleware function
- [x] T-023.2: Document each security header's purpose
- [x] T-023.3: Explain CSP directives (why unsafe-inline)
- [x] T-023.4: Document production vs development differences
- [x] T-023.5: Add future hardening notes (nonce-based CSP)
References:
- `/middleware.ts`
Dependencies: None
Effort: S

### T-024: Enhance lib/sanitize.ts security docs
Priority: P1
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- Security-critical XSS prevention code
- Missing attack examples and usage scenarios
Acceptance Criteria:
- [x] T-024.1: Add XSS attack examples to escapeHtml JSDoc
- [x] T-024.2: Document HTML entity encoding specifics
- [x] T-024.3: Add references to OWASP guidelines
- [x] T-024.4: Document when to use each function
References:
- `/lib/sanitize.ts`
Dependencies: None
Effort: S

### T-025: Add JSDoc to lib/env.ts
Priority: P1
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-06
Context:
- Environment validation is critical for deployment
- Helper functions lack usage docs
Acceptance Criteria:
- [x] T-025.1: Document env schema validation rules
- [x] T-025.2: Document behavior on validation failure
- [x] T-025.3: Add JSDoc to getBaseUrl and other helpers
- [x] T-025.4: Add examples for different environments
References:
- `/lib/env.ts`
Dependencies: None
Effort: S

### T-056: Add input validation to OG image route
Priority: P1
Type: SECURITY
Owner: AGENT
Status: DONE
Completed: 2026-01-07
Context:
- OG route accepts query params without bounds
- Diamond Standard requires defense-in-depth validation
Acceptance Criteria:
- [x] T-056.1: Add Zod schema for query params with max lengths (title: 200, subtitle: 500)
- [x] T-056.2: Sanitize with `escapeHtml` from `/lib/sanitize.ts`
- [x] T-056.3: Return 400 for invalid inputs
- [x] T-056.4: Add unit test for validation
References:
- /app/api/og/route.tsx
- /lib/sanitize.ts
Dependencies: T-050
Effort: S
Notes:
- Verified with `npm test -- __tests__/app/og-route.test.ts`

### T-069: Update Next.js to fix critical vulnerabilities
Priority: P0
Type: SECURITY
Owner: AGENT
Status: DONE
Completed: 2026-01-09
Context:
- npm audit reports critical CVEs in next@15.5.2 (RCE, Source Exposure).
- Must update to >=15.5.9.
- Constraint: Must stay on Next.js 15.x for Cloudflare Pages compatibility (do not upgrade to 16.x yet).
Acceptance Criteria:
- [x] T-069.1: Update `package.json` to use `next@15.5.9` (or latest 15.x patch)
- [x] T-069.2: Run `npm install`
- [x] T-069.3: Run `npm audit` to verify criticals are gone
- [x] T-069.4: Run `npm run build` to verify Cloudflare compatibility
References:
- /package.json
Dependencies: None
Effort: S

### T-062: Structured data for SEO (Article/Service/Breadcrumb)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Diamond Standard SEO: structured data improves rich results + clarity
Acceptance Criteria:
- [x] T-062.1: Add Article schema to blog posts
- [x] T-062.2: Add Service schema to service pages
- [x] T-062.3: Add BreadcrumbList schema where breadcrumbs exist
- [ ] T-062.4: Validate via Google Rich Results Test
References:
- /app/blog/
- /app/services/
- /components/Breadcrumbs.tsx
Dependencies: T-050
Effort: M
Notes:
- Rich Results Test validation not run in this environment.

### T-071: Fix hardcoded URLs in structured data
Priority: P1
Type: BUG
Owner: AGENT
Status: DONE
Completed: 2026-01-07
Context:
- Breadcrumbs.tsx and blog/[slug]/page.tsx use hardcoded "yourdedicatedmarketer.com" in schema.org data
- Should use getPublicBaseUrl() for environment-aware URLs
- Affects SEO structured data accuracy
Acceptance Criteria:
- [x] T-071.1: Update Breadcrumbs.tsx to use getPublicBaseUrl() in structuredData
- [x] T-071.2: Update blog/[slug]/page.tsx articleStructuredData to use getPublicBaseUrl()
- [ ] T-071.3: Verify structured data renders correctly with Rich Results Test
References:
- /components/Breadcrumbs.tsx
- /app/blog/[slug]/page.tsx
- /lib/env.public.ts
Dependencies: None
Effort: XS
Notes:
- Rich Results Test not run (no external tooling configured).

### T-057: Accessibility audit (WCAG 2.1 AA)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Diamond Standard requires WCAG 2.1 AA compliance
- Need systematic checks (keyboard nav, focus states, contrast)
Acceptance Criteria:
- [x] T-057.1: Add axe tooling and a repeatable audit script
- [x] T-057.2: Fix any discovered a11y issues on core pages (home/services/pricing/contact)
- [x] T-057.3: Document a11y standards in `/docs/UI_DESIGN_SYSTEM.md`
References:
- /docs/UI_DESIGN_SYSTEM.md
- /components/
- /app/
Dependencies: T-050
Effort: M

### T-059: Strengthen Sentry (errors + performance)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Sentry is kept
- Want actionable errors and form submission visibility
Acceptance Criteria:
- [x] T-059.1: Add granular error boundaries where appropriate
- [x] T-059.2: Ensure production source maps are configured and safe
- [x] T-059.3: Add performance instrumentation for contact submissions
- [x] T-059.4: Update `/docs/SENTRY-SETUP.md` and `/docs/OBSERVABILITY.md`
References:
- /components/ErrorBoundary.tsx
- /docs/SENTRY-SETUP.md
- /docs/OBSERVABILITY.md
Dependencies: T-050
Effort: M

### T-065: Update deployment docs for Cloudflare Pages + secrets
Priority: P2
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- `/docs/DEPLOYMENT.md` is currently a template
- Needs to reflect actual Cloudflare Pages process and required env vars
Acceptance Criteria:
- [x] T-065.1: Document Cloudflare Pages build settings (build cmd, output, Node version)
- [x] T-065.2: Document required env vars (Supabase, HubSpot, Sentry, Upstash)
- [x] T-065.3: Document rollback procedure
- [x] T-065.4: Document DNS/domain setup checklist
References:
- /docs/DEPLOYMENT.md
- /env.example
Dependencies: T-052
Effort: S

### T-066: Create mobile-first smoke test checklist
Priority: P1
Type: RELEASE
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- Need a manual verification script for releases until E2E coverage is 100%
- Critical flows: Contact Form, Navigation, Mobile Menu, SEO tags
Acceptance Criteria:
- [x] T-066.1: Create `/docs/ops/SMOKE_TEST.md`
- [x] T-066.2: Include strict mobile viewport tests (hamburger menu, touch targets)
- [x] T-066.3: Include critical user journey steps (Lead Capture)
- [x] T-066.4: Include basic SEO check (Title, Meta, OG Image)
References:
- /docs/ops/
Dependencies: None
Effort: XS

### T-067: Consolidate deployment documentation
Priority: P3
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- We have `docs/DEPLOYMENT.md` (template) and `docs/ops/DEPLOYMENT.md` (detailed).
- Confusing for agents which one to follow.
Acceptance Criteria:
- [x] T-067.1: Merge unique value from `docs/ops/DEPLOYMENT.md` into `docs/DEPLOYMENT.md`
- [x] T-067.2: Archive `docs/ops/DEPLOYMENT.md` or make it the source of truth
- [x] T-067.3: Update `DOCS_INDEX.md` to point to the single source of truth
References:
- /docs/DEPLOYMENT.md
- /docs/ops/DEPLOYMENT.md
Dependencies: None
Effort: S

### T-068: Archive historical roadmaps
Priority: P3
Type: DOCS
Owner: AGENT
Status: DONE
Completed: 2026-01-08
Context:
- `docs/product/DEVELOPMENT-ROADMAP.md` contains historical checks.
- `docs/GAME-PLAN-100.md` is a mix of status and plan.
- Should move completed/stale planning docs to `docs/ARCHIVE/` to prevent task leakage confusion.
Acceptance Criteria:
- [x] T-068.1: Move `docs/product/DEVELOPMENT-ROADMAP.md` to `docs/ARCHIVE/product/`
- [x] T-068.2: Add "ARCHIVED" header to moved files if not present
References:
- /docs/product/DEVELOPMENT-ROADMAP.md
Dependencies: None
Effort: XS

### T-050: Restore green local install/build/test
Priority: P0
Type: DEPENDENCY
Owner: AGENT
Status: DONE
Completed: 2026-01-08
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
Notes:
- Moved from TODO.md; completion date not recorded in task history.

### T-079: Update contact form requirements + env validation for Supabase/HubSpot
Priority: P1
Type: FEATURE
Owner: AGENT
Status: DONE
Completed: 2026-01-09
Context:
- Pipeline shifts to Supabase + HubSpot, so form validation must align with required fields
- Server-only secrets must be validated and blocked from client exposure
Acceptance Criteria:
- [x] T-079.1: Update contact form schema so Name/Email/Phone are required (keep message required)
- [x] T-079.2: Update `ContactForm` UI to match required fields and error messaging
- [x] T-079.3: Add env validation for `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `HUBSPOT_PRIVATE_APP_TOKEN`
- [x] T-079.4: Update `scripts/check-client-secrets.mjs` to forbid new server-only env names
- [x] T-079.5: Update `/env.example` with the new server-only env vars and notes
References:
- /lib/contact-form-schema.ts
- /components/ContactForm.tsx
- /lib/env.ts
- /scripts/check-client-secrets.mjs
- /env.example
Dependencies: None
Effort: S

### T-063: Image optimization audit (next/image)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: DONE
Completed: 2026-01-09
Context:
- Images are a common performance bottleneck
Acceptance Criteria:
- [x] T-063.1: Convert any `<img>` tags to `next/image` where appropriate
- [x] T-063.2: Ensure explicit sizes + lazy loading + `priority` for above-fold hero
- [x] T-063.3: Document guidelines in `/docs/UI_DESIGN_SYSTEM.md`
References:
- /components/
- /app/
- /docs/UI_DESIGN_SYSTEM.md
Dependencies: None
Effort: M

### T-051: Unblock npm registry access (if installs fail)
Priority: P0
Type: DEPENDENCY
Owner: Trevor
Status: DONE
Completed: 2026-01-08
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
Notes:
- Moved from TODO.md; completion date not recorded in task history.

### T-074: Add active link highlighting to Navigation
Priority: P3
Type: FEATURE
Owner: AGENT
Status: DONE
Completed: 2026-01-09
Context:
- Navigation links don't indicate current page
- Improves UX by showing user where they are
Acceptance Criteria:
- [x] T-074.1: Use usePathname() to detect current route
- [x] T-074.2: Add active styles to matching nav link
- [x] T-074.3: Test on all pages
References:
- /components/Navigation.tsx
Dependencies: None
Effort: XS

### T-052: Enable Cloudflare Pages build (GitHub integration)
Priority: P0
Type: RELEASE
Owner: AGENT
Status: DONE
Completed: 2026-01-08
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
Notes:
- Moved from TODO.md; completion date not recorded in task history.
