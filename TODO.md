<!--
/**
 * @file TODO.md
 * @role docs
 * @summary Implementation backlog and phased tasks for the template.
 *
 * @entrypoints
 * - Planning and prioritization reference
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - N/A
 *
 * @used_by
 * - Maintainers and contributors
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: roadmap decisions
 * - outputs: task list
 *
 * @invariants
 * - Tasks should align with current codebase state
 *
 * @gotchas
 * - Contains aspirational items that may not match current implementation
 *
 * @issues
 * - [severity:med] Backlog statements are UNVERIFIED against current codebase.
 *
 * @opportunities
 * - Reconcile backlog items with audited findings and docs/REMEDIATION_PLAN.md
 *
 * @verification
 * - TODO(verify): Review each item against current code and update status
 *
 * @status
 * - confidence: low
 * - last_audited: 2026-02-09
 */
-->

# Hair Salon Template - Implementation TODO

## Audit Status (UNVERIFIED)

- This backlog is not yet reconciled with the audited codebase.

## Overview

This document tracks remaining implementation tasks to complete the hair salon template.
Work is phased to avoid thrash: **do not start a lower phase until the previous phase is green**.

**Status:** Configuration ✅ | Build 🔴 | Development 🚀

---

## Phase 0 - Critical Infrastructure & Build Fixes

**Goal:** All basic development commands work without errors.

**Definition of Done**

- [ ] `pnpm install` completes without errors
- [ ] `pnpm lint` passes across all packages
- [ ] `pnpm type-check` passes without errors
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` runs without runtime errors

**Tasks**

### 0.1 Package Configuration & Dependencies

- [x] **Fix @repo/eslint-config package resolution**

  - [x] Verify package.json exports in packages/config/eslint-config/
    - File: packages/config/eslint-config/package.json
    - Snip:
      ```json
      { "main": "./library.js", "exports": { ".": "./library.js", "./next": "./next.js" } }
      ```
  - [x] Ensure workspace dependencies are properly linked
  - [x] Test eslint config resolution in all packages
  - DoD: `pnpm lint` runs without "Cannot find package '@repo/eslint-config'" errors ✅
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Added @repo/eslint-config as devDependency to all consuming packages; fixed plugin conflict in next.js config by removing baseConfig import; updated console rules to allow info/warn/error

- [x] **Install missing MDX dependencies**

  - [x] Add `next-mdx-remote`, `gray-matter`, `reading-time`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code` to apps/web/package.json
    - File: apps/web/package.json (dependencies)
    - Snip:
      ```json
      { "dependencies": { "next": "15.1.6", "react": "19.0.0" } }
      ```
  - [x] Update lockfile and verify installation
  - [x] Test MDX compilation in development
  - DoD: MDX files parse without import errors ✅
  - Deps: none
  - **Completed:** 2026-02-10 (verified already installed)
  - **Status:** All dependencies present and imported in blog components

- [x] **Install missing form dependencies**

  - [x] Add `react-hook-form`, `@hookform/resolvers/zod` to apps/web/package.json
    - File: apps/web/package.json (dependencies)
    - Snip:
      ```json
      { "dependencies": { "zod": "3.22.4" } }
      ```
  - [x] Update lockfile and verify installation
  - [x] Test form validation imports
  - DoD: Contact form imports resolve without errors ✅
  - Deps: none
  - **Completed:** 2026-02-10 (verified already installed)
  - **Status:** Dependencies present and imported in ContactForm component

- [x] **Install missing rate limiting dependencies**
  - [x] Add `@upstash/ratelimit`, `@upstash/redis` to apps/web/package.json
    - File: apps/web/package.json (dependencies)
    - Snip:
      ```json
      { "dependencies": { "@sentry/nextjs": "8.0.0" } }
      ```
  - [x] Update lockfile and verify installation
  - [x] Test rate limiting imports
  - DoD: Rate limiting module imports resolve without errors ✅
  - Deps: none
  - **Completed:** 2026-02-10 (verified already installed)
  - **Status:** Dependencies present and dynamically imported in rate-limit module

### 0.2 Module Resolution & Import Fixes

- [x] **Fix component barrel exports**

  - [x] Audit all `features/*/index.ts` files for missing exports
    - Files: apps/web/features/blog/index.ts, apps/web/features/contact/index.ts, apps/web/features/search/index.ts, apps/web/features/services/index.ts
  - [x] Fix BlogPostContent export in features/blog/index.ts
  - [x] Fix ContactForm export in features/contact/index.ts
  - [x] Fix SearchDialog and SearchPage exports in features/search/index.ts
  - [x] Fix ServicesOverview and ServiceDetailLayout exports in features/services/index.ts
  - DoD: All feature barrel exports match their component files ✅
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Fixed default exports for BlogPostContent and ContactForm; corrected search lib import path; verified all component barrel exports

- [x] **Fix missing component imports**

  - [x] Create or fix ServicesOverview component import in app/page.tsx
  - [x] Create or fix SearchDialog component import in components/Navigation.tsx
    - File: apps/web/components/Navigation.tsx
    - Snip:
      ```tsx
      import { SearchDialog } from '@/features/search';
      <SearchDialog items={searchItems} />
      <SearchDialog items={searchItems} variant="mobile" />
      ```
  - [x] Verify all @/component imports resolve correctly
  - DoD: No "Cannot find module '@/components/\*'" errors ✅
  - Deps: component barrel exports
  - **Completed:** 2026-02-10
  - **Changes:** Verified ServicesOverview import in app/page.tsx; verified SearchDialog import in Navigation.tsx; all component imports now resolve correctly

- [x] **Fix TypeScript configuration issues**
  - [x] Update tsconfig.json paths to match current directory structure
  - [x] Verify @/lib, @/features, @/components paths are correct
  - [x] Test module resolution in development
  - DoD: TypeScript paths resolve without alias errors ✅
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Verified tsconfig.json paths are correct; confirmed all @/lib, @/features, @/components paths resolve; module resolution working in development

### 0.3 Type Safety & Code Quality

- [x] **Fix TypeScript errors**

  - [x] Fix Button variant type error in Gallery component
  - [x] Fix undefined array access in Navigation.tsx (lastElement, firstElement)
  - [x] Fix HubSpot action string type error
  - [x] Remove unused imports (requestId, env variables)
  - DoD: `pnpm type-check` passes without new errors ✅
  - Deps: module resolution fixes
  - **Completed:** 2026-02-10
  - **Changes:** Fixed Select component options prop; fixed HubSpot email null check; resolved all NODE_ENV assignment errors

- [x] **Fix NODE_ENV assignment errors**
  - [x] Replace direct NODE_ENV assignment with process.env.NODE_ENV
  - [x] Update test files to use proper environment variable handling
  - [x] Verify environment variable usage in tests
  - DoD: Test files run without "read-only property" errors ✅
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Replaced all process.env.NODE_ENV direct assignments with Object.assign approach in test files

### 0.4 Environment Configuration

- [ ] **Align local env template with runtime schema**

  - [ ] Compare .env.example with apps/web/lib/env.ts and apps/web/lib/env.public.ts
  - [ ] Update .env.example to match current schema requirements
  - [ ] Add missing optional integration variables
  - DoD: New developers can copy .env.example without immediate failures
  - Deps: env schema finalized

- [ ] **Relax local env schema for optional integrations**
  - [ ] Make Supabase/HubSpot variables optional in local development
  - [ ] Keep them required for production builds
  - [ ] Update validation logic accordingly
  - DoD: Local pnpm dev runs without setting optional integration keys
  - Deps: env schema alignment

### 0.5 Build & Development Tools

- [x] **Fix Tailwind configuration**

  - [x] Add missing Tailwind tokens for bg-off-white
  - [x] Update SearchDialog palette configuration
  - [x] Verify no missing class warnings
  - DoD: UI only changes where intended; no missing class warnings
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Added Tailwind color tokens for CSS custom properties; updated SearchDialog to use theme colors (teal/charcoal) instead of hardcoded purple

- [x] **Fix component runtime errors**

  - [x] Fix InstallPrompt Button import issues
  - [x] Add null checks in Navigation component
  - [x] Fix Gallery Button variant usage
  - [x] Fix Book page Select options
  - DoD: pnpm dev runs without runtime errors on these pages
  - Deps: type fixes
  - **Completed:** 2026-02-10
  - **Changes:** Fixed Navigation null checks for array access; resolved ARIA attributes; verified Button/Select components use correct props

- [x] **Fix .gitignore ordering**
  - [x] Adjust .gitignore ordering so .vscode/settings.json is included
  - [x] Verify git treats .vscode/settings.json as tracked per policy
  - DoD: Git ignore negation works as intended
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Removed duplicate .vscode/ ignore rule that was overriding earlier negation for settings.json

### 0.6 Testing & CI Configuration

- [x] **Make CI tests blocking**

  - [x] Remove continue-on-error from tests in .github/workflows/ci.yml
  - [x] Verify CI fails when tests fail
  - [x] Test CI pipeline with intentional failure
  - DoD: CI fails when tests fail ✅
  - Deps: tests pass locally
  - **Completed:** 2026-02-10
  - **Changes:** Removed continue-on-error: true from test step; tests now block CI pipeline on failure

- [x] **Update verification command log**

  - [x] Run pnpm install, pnpm lint, pnpm type-check, pnpm test, pnpm test:coverage, pnpm build
  - [x] Run pnpm --filter @repo/web start (or docker-compose up -d)
  - [x] Record all outputs in docs/TESTING_STATUS.md
  - [x] Include dates and success/failure status
  - DoD: Command log includes outputs and dates for each run ✅
  - Deps: all commands work
  - **Completed:** 2026-02-10
  - **Changes:** Updated docs/TESTING_STATUS.md with comprehensive verification results including
    bundle analysis and quality gates

- [x] **Verify consent persistence**

  - [x] Document consent cookie/localStorage keys
  - [x] Test that refresh preserves consent toggles
  - [x] Verify SSR reads correct consent state
  - DoD: Consent state persists across sessions ✅
  - Deps: analytics consent module exists
  - **Completed:** 2026-02-10
  - **Changes:** Verified dual storage strategy (localStorage + cookies) with GDPR/CCPA compliance;
    documented consent persistence behavior

- [x] Fix blog import paths (resolved)
- Deliverables: corrected blog/search/sitemap imports in `apps/web/app/blog/[slug]/page.tsx`, `apps/web/app/blog/page.tsx`, `apps/web/app/search/page.tsx`, `apps/web/app/sitemap.ts`
- DoD: no module resolution errors for blog/search/sitemap routes
- Deps: none

- [x] Fix contact + analytics import paths (resolved)
- Deliverables: corrected imports in `apps/web/features/contact/lib/submit.ts`, `apps/web/features/contact/lib/helpers.ts`, `apps/web/features/contact/components/ContactForm.tsx`, `apps/web/components/AnalyticsConsentBanner.tsx`
- DoD: contact form modules resolve without alias errors
- Deps: none

- [x] Fix HubSpot/Supabase adapter imports (resolved)
- Deliverables: corrected imports in `apps/web/features/hubspot/hubspot.ts`, `apps/web/features/supabase/supabase.ts`, `apps/web/features/hubspot/hubspot-client.ts`, `apps/web/features/supabase/supabase-leads.ts`
- DoD: server actions resolve at runtime
- Deps: none

- [x] Fix optional analytics env test (resolved)
- Deliverables: update `apps/web/lib/env.test.ts` to expect `undefined` for optional analytics ID
- DoD: env tests pass with no analytics ID set
- Deps: none

---

## Phase 0.5 - Evergreen Posture + Proof Artifacts

**Goal:** Establish evergreen maintenance, golden-path setup, and quality gates.

**Definition of Done**

- [x] Upgrade policy documented and adopted
- [x] Automated dependency upkeep configured
- [x] CI quality gates publish artifacts and enforce budgets

**Tasks**

### 0.5.1 Maintenance and Upkeep

- [x] **Evergreen version policy**

  - [x] Document policy for Next/React/Turbo patches
  - [x] Set Node 24 as recommended engine version
  - [x] Define upgrade path to next major versions
  - [x] Create version compatibility matrix
  - DoD: Policy referenced in README and requirements/design docs ✅
  - Deps: none
  - **Completed:** 2026-02-10
  - **Changes:** Created docs/VERSION_POLICY.md with comprehensive policy; updated package.json engines to Node 24+

- [x] **Automated dependency upkeep**

  - [x] Configure Renovate for dependency updates
  - [x] Set up patch auto-merge rules
  - [x] Create minor upgrade approval gates
  - [x] Test dependency update PR workflow
  - DoD: CI green on a sample dependency update PR ✅
  - Deps: evergreen policy
  - **Completed:** 2026-02-10
  - **Changes:** Added renovate.json with automated updates; CI integration for quality gates

### 0.5.2 Quality Gates and Security

- [x] **SBOM and dependency scanning**

  - [x] Add SBOM generation step to CI pipeline
  - [x] Implement dependency audit task
  - [x] Configure artifacts upload for security scans
  - [x] Set up failure on critical vulnerabilities
  - DoD: CI publishes SBOM and fails on critical vulns ✅
  - Deps: CI baseline
  - **Completed:** 2026-02-10
  - **Changes:** Added .github/workflows/sbom-generation.yml; enhanced CI with security scanning

- [x] **Quality gates pipeline**

  - [x] Implement lint/type/test checks in CI
  - [x] Add Lighthouse CI on key routes (95+ targets)
  - [x] Create bundle size budgets (strict enforcement)
  - [x] Add accessibility checks (95+ score)
  - [x] Implement secret scanning
  - DoD: PRs fail when budgets or checks fail; artifacts stored ✅
  - Deps: CI baseline
  - **Completed:** 2026-02-10
  - **Changes:** Enhanced CI pipeline with comprehensive quality gates and artifact publishing

- [ ] **Security contact accuracy**
  - [ ] Replace placeholder security email in `SECURITY.md`
  - [ ] Update security reporting procedures
  - [ ] Verify security monitoring setup
  - DoD: Security reports go to a monitored address
  - Deps: maintainers sign-off

### 0.5.3 Documentation and Evidence

- [ ] **Documentation evidence reconciliation**

  - [ ] Reconcile README/CONFIG/ANALYSIS/QUALITY_REPORT with evidence links
  - [ ] Update TESTING_STATUS after running verification commands
  - [ ] Add evidence links to all verified claims
  - [ ] Remove or mark UNVERIFIED sections
  - DoD: Verified facts are linked; UNVERIFIED sections reduced
  - Deps: Phase 0 commands run

- [ ] **Verify legacy analysis claims**

  - [ ] Audit `ANALYSIS.md` for outdated information
  - [ ] Add evidence links or mark as deprecated
  - [ ] Update analysis with current findings
  - DoD: Legacy analysis is verified or clearly archived
  - Deps: none

- [ ] **Verify README/CONFIG/CONTRIBUTING claims**
  - [ ] Audit `README.md` for unverified statements
  - [ ] Audit `CONFIG.md` for accuracy
  - [ ] Audit `CONTRIBUTING.md` for current processes
  - [ ] Add evidence links to verified claims
  - DoD: Unverified claims are updated or explicitly marked
  - Deps: none

### 0.5.4 Audit and Verification

- [ ] **Refresh audit checklist**

  - [ ] Update `tasks.md` to reflect current audit progress
  - [ ] Add new audit items discovered during analysis
  - [ ] Prioritize audit items by impact
  - DoD: Audit checklist matches current state
  - Deps: none

- [ ] **Verify backlog against codebase**

  - [ ] Review `TODO.md` items against current implementation
  - [ ] Update task statuses based on actual progress
  - [ ] Add missing tasks discovered during audit
  - [ ] Remove completed or obsolete tasks
  - DoD: Backlog reflects current codebase state
  - Deps: none

- [ ] **Trace analytics and consent flow**

  - [ ] Document consent and analytics flow from code
  - [ ] Create flow diagrams and documentation
  - [ ] Add evidence references to audit entries
  - DoD: Audit entry exists with evidence references
  - Deps: none

- [ ] **Populate remediation plan**
  - [ ] Prioritize fixes based on impact and effort
  - [ ] Add prioritized fixes to `docs/REMEDIATION_PLAN.md`
  - [ ] Assign owners and target dates
  - DoD: Remediation plan lists prioritized fixes with owners/targets
  - Deps: issues documented

### 0.5.5 Demo and Setup

- [ ] **Demo mode and demo route**

  - [ ] Create `/demo` route or seeded mode
  - [ ] Showcase all features toggled on/off
  - [ ] Document consent gating and integrations
  - DoD: Demo documents consent gating and integrations
  - Deps: core features present

- [ ] **One-command initializer**

  - [ ] Create `pnpm template:init` command
  - [ ] Add prompts for site configuration
  - [ ] Generate `site.config.ts`, schema JSON-LD, env stubs
  - DoD: Fresh setup runs without manual edits
  - Deps: config schema defined

- [ ] **Marketing setup checklist**

  - [ ] Create short playbook for local SEO
  - [ ] Add GBP (Google Business Profile) setup guide
  - [ ] Document social proof and CTA strategies
  - [ ] Add interstitial guidance
  - DoD: Referenced from README and docs
  - Deps: none

- [ ] **Repo scorecard section**
  - [ ] Add README badges for CWV targets
  - [ ] Include consent compliance badges
  - [ ] Add budget pass rate indicators
  - DoD: Scorecard reflects CI outputs
  - Deps: quality gates pipeline

## Phase 1 - Core Site MVP

**Goal:** Essential business features work end-to-end for a functional salon website.

**Definition of Done**

- [ ] Home -> service -> book click flow works and is tracked
- [ ] Contact form submits successfully with confirmation
- [ ] Blog index loads and individual posts render correctly
- [ ] Search functionality works across content
- [ ] All core pages are accessible and functional

**Tasks**

### 1.1 Blog System Implementation

- [ ] **Blog: MDX parsing and rendering**

  - [ ] Implement MDX parsing in `apps/web/features/blog/lib/`
  - [ ] Create `app/blog/page.tsx` for blog index
  - [ ] Create `app/blog/[slug]/page.tsx` for individual posts
  - [ ] Add sample blog posts with proper frontmatter
  - [ ] Test code blocks and markdown rendering
  - Refs:
    - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts)
    - [apps/web/app/blog/page.tsx](apps/web/app/blog/page.tsx)
    - [apps/web/app/blog/[slug]/page.tsx](apps/web/app/blog/%5Bslug%5D/page.tsx)
  - Snip:
    ```ts
    const posts = getAllPosts();
    const categories = getAllCategories();
    ```
  - DoD: `/blog` renders 3 sample posts; one post renders code blocks
  - Deps: MDX dependencies installed

- [ ] **Blog: category filtering system**

  - [ ] Implement `getPostsByCategory` function in blog lib
  - [ ] Add category filtering UI to blog index page
  - [ ] Add category links and filtering logic
  - [ ] Implement empty state for filtered results
  - Refs:
    - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts)
    - [apps/web/app/blog/page.tsx](apps/web/app/blog/page.tsx)
  - Snip:
    ```ts
    export function getPostsByCategory(category: string): BlogPost[] {
      return getAllPosts().filter((post) => post.category === category);
    }
    ```
  - DoD: Category links change visible list; empty state shown when none
  - Deps: blog lib exists

- [ ] **Blog: metadata validation and types**

  - [ ] Define blog frontmatter TypeScript types
  - [ ] Implement Zod schema for frontmatter validation
  - [ ] Add validation error handling in development
  - [ ] Create sample posts with valid metadata
  - Refs:
    - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts)
  - Snip:
    ```ts
    export interface BlogPost {
      slug: string;
      title: string;
      description: string;
      date: string;
    }
    ```
  - DoD: Invalid frontmatter fails fast in dev
  - Deps: blog lib exists

- [ ] **Blog: performance optimization**
  - [ ] Implement memoization for `getAllPosts()` and related helpers
  - [ ] Add server-side caching for blog data
  - [ ] Optimize MDX compilation caching
  - Refs:
    - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts)
  - Snip:
    ```ts
    export function getAllPosts(): BlogPost[] {
      // reads content/blog/*.mdx
      return allPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }
    ```
  - DoD: Repeated calls avoid redundant fs reads during SSR
  - Deps: blog lib exists

### 1.2 Contact Form System

- [ ] **Contact form: schema and validation**

  - [ ] Create `features/contact/lib/contact-form-schema.ts` with Zod schema
  - [ ] Update `ContactForm` component with client-side validation
  - [ ] Add clear error states and validation messages
  - [ ] Implement form submission loading states
  - Refs:
    - [apps/web/features/contact/lib/contact-form-schema.ts](apps/web/features/contact/lib/contact-form-schema.ts)
    - [apps/web/features/contact/components/ContactForm.tsx](apps/web/features/contact/components/ContactForm.tsx)
  - Snip:
    ```ts
    export const contactFormSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
    });
    ```
  - DoD: Client-side validation works with clear error states
  - Deps: form dependencies installed

- [ ] **Contact form: submission and spam protection**

  - [ ] Implement server action or route handler for form submission
  - [ ] Add rate limiting or honeypot spam protection
  - [ ] Create success and error response handling
  - [ ] Add email notification system
  - Refs:
    - [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts)
    - [apps/web/lib/rate-limit.ts](apps/web/lib/rate-limit.ts)
    - [apps/web/features/contact/components/ContactForm.tsx](apps/web/features/contact/components/ContactForm.tsx)
  - Snip:
    ```ts
    export async function submitContactForm(data: ContactFormData) {
      return handleContactFormSubmission(data, requestHeaders);
    }
    ```
  - DoD: Submit success and error paths display correctly
  - Deps: contact schema exists

- [ ] **Contact: CRM integration and spam policy**
  - [ ] Define behavior when rate limit fails (skip HubSpot sync)
  - [ ] Implement suspicious submission detection
  - [ ] Add CRM sync error handling and logging
  - Refs:
    - [apps/web/lib/actions/supabase.ts](apps/web/lib/actions/supabase.ts)
    - [apps/web/lib/actions/hubspot.ts](apps/web/lib/actions/hubspot.ts)
    - [apps/web/lib/actions/helpers.ts](apps/web/lib/actions/helpers.ts)
  - Snip:
    ```ts
    const lead = await insertLeadWithSpan(sanitized, isSuspicious);
    await syncHubSpotLead(lead.id, sanitized);
    ```
  - DoD: Suspicious submissions do not reach CRM without explicit override
  - Deps: rate limiting in place

### 1.3 Services and Booking System

- [ ] **Services: data model and pages**

  - [ ] Define services data structure and types
  - [ ] Create `ServiceDetailLayout` component
  - [ ] Implement individual service pages (`/services/*`)
  - [ ] Add pricing information and booking links
  - Refs:
    - [apps/web/features/services/components/ServiceDetailLayout.tsx](apps/web/features/services/components/ServiceDetailLayout.tsx)
    - [apps/web/features/services/components/ServicesOverview.tsx](apps/web/features/services/components/ServicesOverview.tsx)
    - [apps/web/app/services/page.tsx](apps/web/app/services/page.tsx)
  - Snip:
    ```tsx
    export interface ServiceDetailProps {
      title: string;
      description: string;
      pricing: { tier: string; description: string; href: string }[];
    }
    ```
  - DoD: All service pages render with pricing and booking link
  - Deps: services data defined

- [ ] **Booking form submission handler**
  - [ ] Decide on booking flow (internal vs external provider)
  - [ ] Implement booking CTA submission handler
  - [ ] Add provider redirect flow if needed
  - [ ] Create booking confirmation system
  - Refs:
    - [apps/web/app/book/page.tsx](apps/web/app/book/page.tsx)
    - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx)
  - Snip:
    ```tsx
    <Link href="/book">
      <Button variant="primary">Book Now</Button>
    </Link>
    ```
  - DoD: Booking CTA has functional submission or redirect path
  - Deps: booking flow decision

### 1.4 Search Functionality

- [ ] **Search: index and user experience**

  - [ ] Build search index including blog + services content
  - [ ] Implement search dialog with keyboard shortcut (Ctrl/Cmd+K)
  - [ ] Add search results highlighting and navigation
  - [ ] Create search page for full search experience
  - Refs:
    - [apps/web/lib/search.ts](apps/web/lib/search.ts)
    - [apps/web/features/search/components/SearchDialog.tsx](apps/web/features/search/components/SearchDialog.tsx)
    - [apps/web/features/search/components/SearchPage.tsx](apps/web/features/search/components/SearchPage.tsx)
  - Snip:
    ```ts
    export function getSearchIndex(): SearchItem[] {
      return [...staticPages, ...posts];
    }
    ```
  - DoD: Ctrl/Cmd+K opens dialog; results include blog and services
  - Deps: blog and services pages exist

- [ ] **Search: performance optimization**
  - [ ] Implement memoization for `getSearchIndex()` with server cache
  - [ ] Add search result caching strategies
  - [ ] Optimize search algorithm performance
  - Refs:
    - [apps/web/lib/search.ts](apps/web/lib/search.ts)
  - Snip:
    ```ts
    const posts = getAllPosts().map((post) => ({
      id: `post-${post.slug}`,
    }));
    ```
  - DoD: Repeated renders do not re-read blog files
  - Deps: blog lib exists

### 1.5 Content and Media

- [ ] **Gallery: placeholder data replacement**

  - [ ] Replace placeholder portfolio data with real content
  - [ ] Update imagery with consistent metadata
  - [ ] Add alt text and accessibility features
  - Refs:
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
  - Snip:
    ```tsx
    <section className="py-20 bg-off-white">
      <Container>
    ```
  - DoD: Gallery shows real or seeded data with consistent metadata
  - Deps: media assets available

- [ ] **Terms of Service: content finalization**

  - [ ] Replace placeholder and "TO BE UPDATED" content
  - [ ] Write production-ready terms copy
  - [ ] Add legal disclaimers and privacy references
  - Refs:
    - [apps/web/app/terms/page.tsx](apps/web/app/terms/page.tsx)
    - [apps/web/app/privacy/page.tsx](apps/web/app/privacy/page.tsx)
  - Snip:
    ```tsx
    export const metadata: Metadata = {
      title: 'Terms of Service | Hair Salon Template',
    };
    ```
  - DoD: Terms page reads as production-ready copy
  - Deps: content owner input

- [ ] **Team and social links**
  - [ ] Replace placeholder social links in team page
  - [ ] Update footer social links or remove if not needed
  - [ ] Verify all social links point to real profiles
  - Refs:
    - [apps/web/app/team/page.tsx](apps/web/app/team/page.tsx)
    - [apps/web/components/Footer.tsx](apps/web/components/Footer.tsx)
  - Snip:
    ```tsx
    <Link href="/team" className="text-white/70">
      Team
    </Link>
    ```
  - DoD: Team and footer social links are real or intentionally omitted
  - Deps: content owner input

### 1.6 Performance and Security

- [ ] **OG image route protection**

  - [ ] Add lightweight rate limiting for `/api/og`
  - [ ] Implement caching strategy for OG images
  - [ ] Add error handling for OG image generation
  - Refs:
    - [apps/web/app/api/og/route.tsx](apps/web/app/api/og/route.tsx)
    - [apps/web/lib/rate-limit.ts](apps/web/lib/rate-limit.ts)
  - Snip:
    ```ts
    export async function GET(request: Request) {
      // TODO: add rate limit
    }
    ```
  - DoD: Basic abuse protection without breaking social previews
  - Deps: rate limiting util or edge cache strategy

- [ ] **Rate limiting: production fallback policy**
  - [ ] Decide fail-closed vs hard error when Upstash fails
  - [ ] Implement fallback behavior in production
  - [ ] Document production rate limiting behavior
  - Refs:
    - [apps/web/lib/rate-limit.ts](apps/web/lib/rate-limit.ts)
  - Snip:
    ```ts
    if (missingUpstashKeys.length === 0) {
      // init Upstash
    }
    ```
  - DoD: Production behavior documented and enforced in `apps/web/lib/rate-limit.ts`
  - Deps: rate limiting in place

### 1.7 Seed Data and Testing

- [ ] **Seed data creation**
  - [ ] Create sample services data
  - [ ] Add sample stylists/team members
  - [ ] Create sample blog posts
  - [ ] Add sample gallery images
  - Refs:
    - [apps/web/features/services/components/ServicesOverview.tsx](apps/web/features/services/components/ServicesOverview.tsx)
    - [apps/web/app/team/page.tsx](apps/web/app/team/page.tsx)
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
  - Snip:
    ```ts
    const services = [{ title: 'Haircuts & Styling', href: '/services/haircuts' }];
    ```
  - DoD: Local dev uses real data with no empty states
  - Deps: models exist

---

## Phase 2 - Integration Platform Layer (Default-Off)

**Goal:** Add integrations without ad-hoc scripts, all default-off, consent gated.

**Definition of Done**

- [ ] Consent off -> no analytics/marketing scripts load
- [ ] Consent on -> only enabled scripts load
- [ ] No PII in event payloads
- [ ] All integrations disabled by default

**Guardrails**

- [ ] All integrations must be disabled by default
- [ ] All marketing/analytics scripts must be consent gated
- [ ] Scripts must be lazy or interaction-loaded unless critical

**Tasks**

### 2.1 Core Integration Infrastructure

- [ ] **Integration registry and schema validation**

  - [ ] Create `integrations.config.ts` with provider definitions
  - [ ] Implement Zod registry schema for validation
  - [ ] Create per-provider schemas with required fields
  - [ ] Add validation error handling for missing keys
  - Refs:
    - [apps/web/lib/env.ts](apps/web/lib/env.ts)
    - [apps/web/lib/env.public.ts](apps/web/lib/env.public.ts)
  - Snip:
    ```ts
    export const validatedEnv = envSchema.parse(process.env);
    ```
  - DoD: Enabled providers without required keys fail fast
  - Deps: Zod available

- [ ] **Event taxonomy and event bus**

  - [ ] Define canonical event list (book_click, lead_submit, call_click, directions_click, gallery_open)
  - [ ] Implement client-side event emitter with payload sanitization
  - [ ] Create server-side event emitter wrapper
  - [ ] Add event validation and logging
  - Refs:
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```ts
    export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
      if (!hasAnalyticsConsent()) return;
    }
    ```
  - DoD: Client emit + server emit wrappers sanitize payloads
  - Deps: none

- [ ] **Consent model and helpers**

  - [ ] Define cookie format for consent storage
  - [ ] Create server-side consent reading helper
  - [ ] Implement client-side consent hook
  - [ ] Wire consent banner to consent model
  - [ ] Add per-category consent tracking (unknown/granted/denied)
  - Refs:
    - [apps/web/features/analytics/lib/analytics-consent.ts](apps/web/features/analytics/lib/analytics-consent.ts)
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```ts
    export type AnalyticsConsentState = 'granted' | 'denied' | 'unknown';
    ```
  - DoD: Unknown/granted/denied tracked per category
  - Deps: existing consent banner and analytics module

- [ ] **Script loader system**

  - [ ] Implement `loadClientScript(id, src, rule)` with deduplication
  - [ ] Add timeout handling and error logging
  - [ ] Create script loading queue management
  - [ ] Add script removal and cleanup functionality
  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```tsx
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
    ```
  - DoD: Scripts load only after consent and per load rule
  - Deps: consent model

- [ ] **Provider adapter pattern**

  - [ ] Define provider declaration structure with consent category
  - [ ] Implement load rule system for each provider
  - [ ] Add CSP domain configuration per provider
  - [ ] Create event subscription system for providers
  - Refs:
    - [apps/web/lib/csp.ts](apps/web/lib/csp.ts)
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```ts
    const scriptSources = ["'self'", `'nonce-${nonce}'`, 'https://www.googletagmanager.com'];
    ```
  - DoD: Enabling a provider requires no ad-hoc script tags
  - Deps: registry + loader

- [ ] **CSP allowlist builder**
  - [ ] Create CSP domain sets for script/img/connect/frame sources
  - [ ] Implement dynamic CSP header generation
  - [ ] Add CSP validation and testing
  - [ ] Update CSP only for enabled integrations
  - Refs:
    - [apps/web/lib/csp.ts](apps/web/lib/csp.ts)
    - [apps/web/middleware.ts](apps/web/middleware.ts)
  - Snip:
    ```ts
    const csp = buildContentSecurityPolicy({ nonce, isDevelopment });
    response.headers.set('Content-Security-Policy', csp);
    ```
  - DoD: CSP updates only for enabled integrations
  - Deps: provider adapter pattern

### 2.2 Testing and Verification

- [ ] **Integration platform verification tests**

  - [ ] Create E2E tests for consent off -> no tags
  - [ ] Create E2E tests for consent on -> only enabled tags
  - [ ] Add unit tests for event bus and script loader
  - [ ] Test integration registry validation
  - Refs:
    - [apps/web/lib/**tests**/env.test.ts](apps/web/lib/__tests__/env.test.ts)
    - [jest.config.js](jest.config.js)
  - Snip:
    ```ts
    describe('env', () => {
      it('validates public env', () => {});
    });
    ```
  - DoD: Tests pass in CI-like run
  - Deps: event bus + script loader

- [ ] **Consent gating E2E tests**
  - [ ] Test consent denied -> no scripts load
  - [ ] Test consent granted -> only enabled scripts load
  - [ ] Verify consent persistence across sessions
  - [ ] Test consent category-specific behavior
  - Refs:
    - [apps/web/features/analytics/lib/analytics-consent.ts](apps/web/features/analytics/lib/analytics-consent.ts)
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```ts
    export function setAnalyticsConsent(consent: AnalyticsConsentState) {
      writeStoredConsent(consent);
    }
    ```
  - DoD: Tests enforced in CI
  - Deps: integration platform layer

---

## Phase 2.5 - Platform Data Layer (DB, RLS, Storage, Jobs)

**Goal:** Data and security foundations exist before marketing UI builds.

**Tasks**

- [ ] DB migrations + indexes
- Deliverables: SQL or migration scripts for reviews, testimonials, transformations, badges, certifications
- DoD: migrations apply cleanly; indexes cover common queries
- Deps: data models finalized

  - Refs:
    - [infrastructure/](infrastructure/)
    - [apps/web/features/supabase/lib/supabase-leads.ts](apps/web/features/supabase/lib/supabase-leads.ts)
  - Snip:
    ```ts
    const SUPABASE_LEADS_PATH = '/rest/v1/leads';
    ```

- [ ] RLS policies
- Deliverables: policies for public read (approved) and admin write
- DoD: public cannot write; admins can manage content
- Deps: migrations applied

  - Refs:
    - [infrastructure/](infrastructure/)
  - Snip:
    ```sql
    -- TODO: create RLS policies for public read + admin write
    ```

- [ ] Storage bucket policies
- Deliverables: buckets for media, signed URL strategy for private assets
- DoD: public assets readable; consent docs private
- Deps: migrations applied

  - Refs:
    - [infrastructure/](infrastructure/)
  - Snip:
    ```sql
    -- TODO: storage bucket policies for media and private assets
    ```

- [ ] Admin role model
- Deliverables: role claims or admins table; route middleware guard
- DoD: admin routes protected in dev and prod
- Deps: auth strategy defined

  - Refs:
    - [apps/web/middleware.ts](apps/web/middleware.ts)
  - Snip:
    ```ts
    export const config = { matcher: ['/((?!_next/static).*)'] };
    ```

- [ ] Background job runner
- Deliverables: cron strategy for review sync, optional Instagram sync, cleanup job for revoked media
- DoD: jobs run without blocking page render
- Deps: data tables and storage buckets
  - Refs:
    - [infrastructure/](infrastructure/)
  - Snip:
    ```ts
    // TODO: define scheduled jobs (review sync, instagram sync)
    ```

---

## Phase 3 - Marketing Enhancements

**Goal:** Social proof, portfolio, trust indicators, and conversion elements built on the platform layer.

### 3.1 Social Proof (Reviews/Testimonial Model)

- [ ] Model decision and schema
- Deliverables: review schema + testimonial schema referencing reviewId
- DoD: one source of truth for ratings and counts
- Deps: data layer ready

  - Refs:
    - [apps/web/components/SocialProof.tsx](apps/web/components/SocialProof.tsx)
  - Snip:
    ```ts
    const testimonials = [{ quote: '...', author: '...', title: '...' }];
    ```

- [ ] Testimonial display MVP
- Deliverables: carousel/grid, verified badge modes, aggregate rating component
- DoD: homepage shows ratings and a rotating testimonial block
- Deps: schema and seed data

  - Refs:
    - [apps/web/components/SocialProof.tsx](apps/web/components/SocialProof.tsx)
  - Snip:
    ```tsx
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {testimonials.map((testimonial) => (
    ```

- [ ] Video testimonials
- Deliverables: thumbnail + click-to-load player
- DoD: no iframe loads until interaction
- Deps: testimonial UI exists
  - Refs:
    - [apps/web/components/SocialProof.tsx](apps/web/components/SocialProof.tsx)
  - Snip:
    ```tsx
    <Card key={testimonial.author} variant="testimonial">
    ```

### 3.2 Portfolio (Before/After)

- [ ] Transformation model + permissions
- Deliverables: transformation schema with permission scope and revocation
- DoD: permission fields stored and enforceable
- Deps: data layer ready

  - Refs:
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
  - Snip:
    ```tsx
    <section className="py-20 bg-off-white">
    ```

- [ ] Portfolio MVP slice
- Deliverables: gallery with filters, lightbox, keyboard support
- DoD: gallery shows 12 items; modal accessible
- Deps: transformation data seeded

  - Refs:
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
  - Snip:
    ```tsx
    <div className="grid md:grid-cols-3 gap-8">
    ```

- [ ] Performance rules
- Deliverables: thumbnails for grids, lazy-load full res in modal
- DoD: no above-the-fold grids of full-size images
- Deps: gallery MVP

  - Refs:
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
  - Snip:
    ```tsx
    <div className={`w-full h-full ${item.image} flex items-center justify-center`}>
      Image {item.id}
    </div>
    ```

- [ ] Instagram feed adapter
- Deliverables: manual CMS default with optional API sync job
- DoD: feed renders from manual data with fallback copy
- Deps: data layer ready
  - Refs:
    - [infrastructure/](infrastructure/)
  - Snip:
    ```ts
    // TODO: optional Instagram sync job
    ```

### 3.3 Trust Indicators

- [ ] Trust models
- Deliverables: trust badge + certification schemas with verification URLs
- DoD: links point to issuer verification pages
- Deps: data layer ready

  - Refs:
    - [apps/web/app/about/page.tsx](apps/web/app/about/page.tsx)
  - Snip:
    ```tsx
    <h2 className="text-3xl font-bold text-charcoal">Our Story</h2>
    ```

- [ ] Trust UI
- Deliverables: badge grid + certification cards
- DoD: displayed on homepage and service pages
- Deps: trust models seeded

  - Refs:
    - [apps/web/components/ValueProps.tsx](apps/web/components/ValueProps.tsx)
    - [apps/web/app/services/page.tsx](apps/web/app/services/page.tsx)
  - Snip:
    ```tsx
    <div className="grid md:grid-cols-3 gap-8">
    ```

- [ ] Guarantee + longevity
- Deliverables: satisfaction and longevity copy with source fields
- DoD: only data-backed claims render
- Deps: business data source
  - Refs:
    - [apps/web/components/Hero.tsx](apps/web/components/Hero.tsx)
  - Snip:
    ```tsx
    <p className="text-sm text-slate mt-4">
      Walk-ins welcome · Free consultations · Satisfaction guaranteed
    </p>
    ```

### 3.4 Conversion Elements (Truthful + Non-Intrusive)

- [ ] Sticky booking CTA
- Deliverables: sticky button with safe mobile spacing
- DoD: no overlap with mobile nav or footer
- Deps: booking link defined

  - Refs:
    - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx)
    - [apps/web/components/Navigation.tsx](apps/web/components/Navigation.tsx)
  - Snip:
    ```tsx
    <Link href="/contact">
      <Button variant="primary" size="large">
        Book Appointment
      </Button>
    </Link>
    ```

- [ ] CTA component + tracking
- Deliverables: CTA component wired to event bus
- DoD: click emits canonical event without PII
- Deps: event bus

  - Refs:
    - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx)
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```ts
    export function trackCTAClick(ctaText: string) {
      trackEvent({ action: 'cta_click', category: 'engagement', label: ctaText });
    }
    ```

- [ ] Urgency and activity rules
- Deliverables: system-sourced checks + neutral fallback copy
- DoD: no fabricated numbers displayed
- Deps: booking/CRM data source

  - Refs:
    - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx)
  - Snip:
    ```tsx
    <p className="text-lg text-white/90 mb-8 leading-relaxed">
    ```

- [ ] Lead capture banner
- Deliverables: inline/bottom banner variant
- DoD: banner used on mobile; non-intrusive
- Deps: contact endpoint

  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```tsx
    <div className="fixed bottom-4 left-4 right-4">
    ```

- [ ] Exit intent experiment
- Deliverables: desktop-only experiment flag
- DoD: disabled by default; no mobile interstitials
- Deps: analytics events
  - Refs:
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```ts
    if (isDevelopment() || isTest()) {
      logInfo('Analytics event', { action, category, label, value });
    }
    ```

---

## Phase 4 - Admin UI + Content Ops

**Goal:** Non-devs can manage content safely.

**Tasks**

- [ ] Admin routes + auth
- Deliverables: admin dashboard routes, route protection middleware
- DoD: non-admins cannot access admin pages
- Deps: admin role model

  - Refs:
    - [apps/web/app](apps/web/app)
    - [apps/web/middleware.ts](apps/web/middleware.ts)
  - Snip:
    ```ts
    export function middleware(request: NextRequest) {
      const response = NextResponse.next();
      return response;
    }
    ```

- [ ] Upload tooling
- Deliverables: admin upload UI, validation, optimization, thumbnails
- DoD: upload produces optimized assets + thumbnails
- Deps: storage buckets ready

  - Refs:
    - [apps/web/components](apps/web/components)
  - Snip:
    ```tsx
    <input type="file" accept="image/*" />
    ```

- [ ] Moderation workflow
- Deliverables: pending/approved/rejected status UI and filters
- DoD: only approved content renders publicly
- Deps: review/testimonial schemas

  - Refs:
    - [apps/web/features/supabase/lib/supabase-leads.ts](apps/web/features/supabase/lib/supabase-leads.ts)
  - Snip:
    ```ts
    export async function updateSupabaseLead(leadId: string, updates: Record<string, unknown>) {
      // update status fields
    }
    ```

- [ ] Audit log
- Deliverables: lightweight audit table and admin activity log view
- DoD: admin actions recorded and viewable
- Deps: admin routes

  - Refs:
    - [apps/web/lib/logger.ts](apps/web/lib/logger.ts)
  - Snip:
    ```ts
    export function logInfo(message: string, context?: LogContext) {
      log('info', message, context);
    }
    ```

- [ ] Media takedown tooling
- Deliverables: revoke + purge flow for consented media
- DoD: revoked assets removed from UI and CDN
- Deps: storage buckets + revocation fields
  - Refs:
    - [apps/web/app/gallery/page.tsx](apps/web/app/gallery/page.tsx)
    - [infrastructure/](infrastructure/)
  - Snip:
    ```tsx
    const portfolioItems = [{ id: 1, category: 'Color', title: 'Platinum Blonde Transformation' }];
    ```

---

## Phase 5 - Major Integrations (Tiered)

### Tier 1 (Highest ROI, Lowest Complexity)

- [ ] GA4 baseline + event taxonomy mapping
- Deliverables: GA4 tag wired to event bus and consent
- DoD: events visible in GA4 debug view
- Deps: integration platform layer

  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```tsx
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} />
    ```

- [ ] GTM optional
- Deliverables: GTM loader with consent gating
- DoD: GTM loads only when enabled
- Deps: script loader

  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```tsx
    <Script id="ga4-init" strategy="afterInteractive" nonce={nonce}>
    ```

- [ ] Google Ads conversion (client)
- Deliverables: conversion tag mapping to events
- DoD: conversion fires on lead submit or booking click
- Deps: event taxonomy

  - Refs:
    - [apps/web/features/analytics/lib/analytics.ts](apps/web/features/analytics/lib/analytics.ts)
  - Snip:
    ```ts
    trackEvent({ action: 'cta_click', category: 'engagement', label: ctaText });
    ```

- [ ] Meta Pixel (client)
- Deliverables: pixel tag with consent gating
- DoD: pixel fires only on consent
- Deps: script loader

  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
  - Snip:
    ```tsx
    const canLoadAnalytics = shouldLoadAnalytics(consent, analyticsId);
    ```

- [ ] Turnstile on forms
- Deliverables: Turnstile widget + server verification
- DoD: form rejects invalid tokens
- Deps: form endpoints

  - Refs:
    - [apps/web/features/contact/components/ContactForm.tsx](apps/web/features/contact/components/ContactForm.tsx)
    - [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts)
  - Snip:
    ```tsx
    <form onSubmit={handleSubmit(onSubmit)}>
    ```

- [ ] Booking providers (deep links + embeds)
- Deliverables: provider adapter + link/embed templates
- DoD: booking CTA opens correct provider link
- Deps: integration registry
  - Refs:
    - [apps/web/app/book/page.tsx](apps/web/app/book/page.tsx)
    - [apps/web/components/FinalCTA.tsx](apps/web/components/FinalCTA.tsx)
  - Snip:
    ```tsx
    <Link href="/book">
      <Button variant="primary">Book Now</Button>
    </Link>
    ```

### Tier 2

- [ ] Meta CAPI (server) with `event_id` dedup
- Deliverables: server event endpoint + deduped payloads
- DoD: test events show in Meta test console
- Deps: event bus

  - Refs:
    - [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts)
  - Snip:
    ```ts
    return withServerSpan({ name: 'contact_form.submit', op: 'action' }, async () => {
    ```

- [ ] Stripe payment links + webhooks
- Deliverables: payment link config + webhook handler
- DoD: webhook verified and logged
- Deps: server env secrets

  - Refs:
    - [apps/web/app/api](apps/web/app/api)
    - [apps/web/lib/logger.ts](apps/web/lib/logger.ts)
  - Snip:
    ```ts
    logInfo('Webhook received', { provider: 'stripe' });
    ```

- [ ] Email routing adapters
- Deliverables: server adapters for Mailchimp/Brevo/etc.
- DoD: lead submit routes to selected provider
- Deps: lead schema
  - Refs:
    - [apps/web/lib/actions/submit.ts](apps/web/lib/actions/submit.ts)
    - [apps/web/lib/actions/helpers.ts](apps/web/lib/actions/helpers.ts)
  - Snip:
    ```ts
    const sanitized = buildSanitizedContactData(validatedData, clientIp);
    ```

### Tier 3

- [ ] Review aggregation jobs
- Deliverables: scheduled review sync; Google required, Facebook best-effort
- DoD: reviews update without blocking page render
- Deps: background job runner

  - Refs:
    - [infrastructure/](infrastructure/)
  - Snip:
    ```ts
    // TODO: schedule review sync jobs
    ```

- [ ] CMS adapters
- Deliverables: optional adapters for Sanity/Contentful/Strapi/Payload
- DoD: content reads from selected CMS when enabled
- Deps: integration registry

  - Refs:
    - [apps/web/features/blog/lib/blog.ts](apps/web/features/blog/lib/blog.ts)
  - Snip:
    ```ts
    const postsDirectory = path.join(process.cwd(), 'content/blog');
    ```

- [ ] Advanced chat widgets / session replay
- Deliverables: chat and replay tags gated by marketing consent
- DoD: no scripts load without consent
- Deps: script loader
  - Refs:
    - [apps/web/components/AnalyticsConsentBanner.tsx](apps/web/components/AnalyticsConsentBanner.tsx)
    - [apps/web/lib/csp.ts](apps/web/lib/csp.ts)
  - Snip:
    ```ts
    const scriptSources = ["'self'", `'nonce-${nonce}'`];
    ```

---

## Testing & Validation

- [ ] Unit tests for Zod schemas + integration registry validation
- [ ] E2E: consent off -> no scripts load
- [ ] E2E: consent on -> only enabled scripts load
- [ ] Accessibility tests for modals/carousels (focus trap, escape, keyboard nav)
- [ ] Performance testing (Core Web Vitals)

---

## Appendix A - Task Index (Full)

- Module alias + re-export audit
- Canonical feature import surface
- Align local env template with runtime schema
- Dependency install + verify
- ESLint config resolution
- Tailwind tokens + SearchDialog palette
- Consent persistence smoke test
- Component fixups
- Type hygiene cleanup
- CI tests must be blocking
- Security contact accuracy
- Documentation evidence reconciliation
- Blog: MDX parsing
- Blog: category filtering
- Blog: metadata types + validation
- Contact form: schema + UI
- Contact form: submission + spam baseline
- Contact: spam policy for CRM sync
- Rate limit fallback policy in production
- Services: data model + pages
- Search: index + UX
- Search index caching
- Blog data caching
- OG image route protection
- Book page: MVP flow
- Seed data
- Integration registry + schema validation
- Event taxonomy + event bus
- Consent model + helpers
- Script loader
- Provider adapter pattern
- CSP allowlist builder
- Verification tests
- DB migrations + indexes
- RLS policies
- Storage bucket policies
- Admin role model
- Background job runner
- Social proof: model + schema
- Social proof: testimonial display MVP
- Social proof: video testimonials
- Portfolio: transformation model + permissions
- Portfolio: gallery MVP slice
- Portfolio: performance rules
- Portfolio: Instagram adapter
- Trust: models
- Trust: UI
- Trust: guarantee + longevity
- Conversion: sticky booking CTA
- Conversion: CTA component + tracking
- Conversion: urgency and activity rules
- Conversion: lead capture banner
- Conversion: exit intent experiment
- Admin routes + auth
- Upload tooling
- Moderation workflow
- Audit log
- Media takedown tooling
- Tier 1 integrations
- Tier 2 integrations
- Tier 3 integrations
- Testing and validation

---

## Appendix B - Integration Catalog (Reference)

- Booking: Square, Vagaro, Mindbody, Fresha, Booksy, generic booking link
- Payments: Stripe, Square, PayPal
- Analytics: GA4, GTM, privacy-friendly analytics (Plausible, Matomo)
- Ads: Google Ads, Meta Pixel + CAPI, TikTok, Pinterest, Snapchat, LinkedIn
- Consent: CMP or custom banner with Consent Mode v2
- Chat: Intercom, Crisp, Tawk
- Reviews: Google (managed locations), Facebook (best-effort)
- Bot protection: Turnstile
- CRM: Mailchimp, Klaviyo, Brevo, ActiveCampaign, Twilio, MessageBird
- CMS: Sanity, Contentful, Strapi, Payload

---

## Deployment Checklist

- [ ] Environment variables configured (.env.local)
- [ ] Database connections tested (Supabase or alternative)
- [ ] Third-party API keys secured
- [ ] Build process verified on clean machine
- [ ] Staging deployment successful
- [ ] Production deployment plan
- [ ] Monitoring and alerting setup
- [ ] Backup strategy in place

---

## Notes

- Use `pnpm dev` for development
- Use `pnpm build` to test production build
- Use `pnpm lint` and `pnpm type-check` regularly
- See CONFIG.md for detailed configuration documentation

---

**Last Updated:** February 9, 2026  
**Documentation Pass Completed:** February 9, 2026 - 78 files documented with comprehensive metaheaders
**Estimated Completion:** 2-4 weeks (depending on scope and team size)
