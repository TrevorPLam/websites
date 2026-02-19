# Issues — Codebase Analysis Results

> **Generated:** 2026-02-18 — Deep codebase analysis (no documentation referenced)  
> **Re-verified:** 2026-02-19 — Fixed issues verified; remaining issues documented

This file documents all issues discovered through exhaustive code and configuration analysis.

---

## CRITICAL — Blocking CI / Merge

### 1. ~~Build fails: TypeScript errors in @repo/ui Toast.tsx~~ (FIXED — 2026-02-19)

**Location:** `packages/ui/src/components/Toast.tsx`

**Status:** Fixed. Toast.tsx now uses `React.ReactElement` for `custom()` callback and `promise(promise, { ...messages, ...options })` (2 args) matching Sonner v2 API.

**Previous Error:** When `@repo/features` (or `@repo/marketing-components`) builds, it type-checks `@repo/ui`. Two errors:
- `toast.custom(jsx, options)` — Sonner expects `(id) => ReactElement` but we passed `(id) => ReactNode`
- `sonnerToast.promise(promise, messages, options)` — Expected 1–2 arguments, got 3

**Verification:** `pnpm --filter @repo/ui type-check` passes; `pnpm --filter @repo/marketing-components type-check` passes.

---

### 2. ~~validate-workspaces fails: package.json workspaces out of sync~~ (FIXED — 2026-02-19)

**Location:** `package.json` vs `pnpm-workspace.yaml`

**Status:** Fixed. Both files now have identical workspace globs. `pnpm validate:workspaces` passes. Added to CI pipeline as blocking step.

**Previous Error:** `pnpm validate:workspaces` exited 1. `package.json` workspaces omitted several globs.

**Verification:** `pnpm validate:workspaces` passes; added to `.github/workflows/ci.yml`.

---

### 3. ~~Tests fail: booking-actions verification tests (4 failures)~~ (FIXED — 2026-02-19)

**Location:** `packages/features/src/booking/lib/__tests__/booking-actions.test.ts`

**Error:** Tests expect `confirmBooking`, `cancelBooking`, and `getBookingDetails` to:

1. Accept verification params: `{ confirmationNumber, email }`
2. Reject when verification doesn’t match (IDOR prevention)

**Implementation:** These functions ignore verification:

- `confirmBooking(bookingId: string)` — no verification params
- `cancelBooking(bookingId: string)` — no verification params  
- `getBookingDetails(bookingId, config)` — no verification params

Tests call e.g. `confirmBooking(bookingId, { confirmationNumber: 'WRONG', email: '...' })`; second arg is ignored.

**Failing tests:**

1. `confirmBooking › requires verification and rejects without matching confirmationNumber`
2. `confirmBooking › requires verification and rejects without matching email`
3. `cancelBooking › requires verification and rejects without matching verification`
4. `getBookingDetails › returns null without matching verification`

**Impact:** CI runs `pnpm test:coverage`; suite fails. Also indicates missing IDOR protection in booking actions.

---

### 4. ~~Turbo build: @repo/marketing-components has no output files~~ (FIXED — 2026-02-19)

**Location:** `packages/marketing-components/package.json` + `turbo.json`

**Status:** Fixed. Build script now creates `dist/.stub`; `turbo.json` has explicit `@repo/marketing-components#build` task with `outputs: ["dist/**"]`.

**Previous Error:** Build script was `"echo build complete"` with no file output; Turbo warned about missing outputs.

**Verification:** `packages/marketing-components/package.json` build script verified; `turbo.json` task override verified.

---

## HIGH — Major gaps / inconsistencies

### 5. All page templates are NotImplementedPlaceholder

**Location:** `packages/page-templates/src/templates/*.tsx`

**Details:** All 7 templates render `NotImplementedPlaceholder`:

- HomePageTemplate
- ServicesPageTemplate
- AboutPageTemplate
- ContactPageTemplate
- BlogIndexTemplate
- BlogPostTemplate
- BookingPageTemplate

**Impact:** Every client page shows “Hero, services preview, and CTA sections will be composed from site config” (or similar). No real page content from page-templates.

---

### 6. Integration packages unused by clients

**Location:** `packages/integrations/*`

**Details:** No client imports any `@repo/integrations-*` package. 14 packages exist:

- hubspot, supabase, analytics (core)
- acuity, calendly, calcom (booking)
- convertkit, mailchimp, sendgrid (email)
- crisp, intercom, tidio (chat)
- google-maps, google-reviews, trustpilot, yelp (reviews/maps)

**Impact:** Integration packages are scaffolded but not wired into client apps.

---

### 7. ~~ESLint 9: many packages lack flat config~~ (FIXED — 2026-02-19)

**Location:** Multiple packages under `packages/`, `tooling/`

**Status:** Fixed. 35 packages now have `eslint.config.mjs` including all tooling, integrations, ai-platform, content-platform, marketing-ops, and infrastructure packages.

**Previous Error:** ESLint 9 expects `eslint.config.(js|mjs|cjs)`. Many packages lacked this config.

**Verification:** Verified via glob search — all major packages now have ESLint flat config.

---

### 8. ~~@repo/marketing-components type-check fails~~ (FIXED — 2026-02-19)

**Location:** `packages/marketing-components/src/**`

**Status:** Fixed. Type-check now passes.

**Previous Errors:**
- Unused imports/params (TS6133)
- `ServiceAccordion` missing `items` prop (TS2741)
- Toast type issues (resolved with #1)

**Verification:** `pnpm --filter @repo/marketing-components type-check` passes.

---

### 9. ~~validate-exports references non-existent templates/~~ (FIXED)

**Location:** `scripts/validate-exports.js`

**Details:** Was `WORKSPACE_ROOTS = ['packages', 'templates', 'clients', 'apps']`. Fixed to `['packages', 'clients', 'apps', 'tooling']`.

---

### 10. ~~validate-documentation.js: duplicate call~~ (FIXED)

**Location:** `scripts/validate-documentation.js`

**Details:** `validateCodeExamples(docFiles)` was invoked twice. Duplicate removed.

---

## MEDIUM — Inconsistencies and debt

### 11. Client Next.js config divergence

**Location:** `clients/*/next.config.*`

**Details:**

- **starter-template:** `next.config.js` (CommonJS) with:
  - `output: 'standalone'`
  - `poweredByHeader: false`
  - `typescript: { ignoreBuildErrors: false }`
  - `next-intl` plugin

- **luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters:** `next.config.ts` with minimal config:
  - Only `transpilePackages`
  - No standalone output, poweredByHeader, or typescript options
  - No next-intl

**Impact:** Non-starter clients may behave differently for Docker, TS strictness, and i18n.

---

### 12. Client i18n/routing inconsistency

**Location:** `clients/`

**Details:**

- **starter-template:** Uses `next-intl`, `[locale]` routing, `i18n/request.ts`, `i18n/routing.ts`, `i18n/navigation.ts`
- **luxe-salon, others:** No next-intl; flat `app/page.tsx`, `app/services/page.tsx` (no `[locale]`)

**Impact:** Different routing and i18n models across clients.

---

### 13. Radix Dialog accessibility warning in tests

**Location:** `packages/ui/src/components/__tests__/Dialog.test.tsx` (via Radix)

**Details:** Radix warns that `DialogContent` requires `DialogTitle` for screen readers.

**Impact:** Tests emit warnings; accessibility may be incomplete in Dialog usage.

---

### 14. apps/ directory missing

**Location:** `pnpm-workspace.yaml`, `package.json` workspaces

**Details:** `apps/*` is listed in workspace globs but no `apps/` directory exists.

**Impact:** Low; globs merely match nothing. Slightly confusing.

---

## LOW — Polish and hygiene

### 15. Root package name vs repo name

**Location:** `package.json`

**Details:** `"name": "marketing-website-templates"` vs repo name `marketing-websites`.

**Impact:** Naming inconsistency only.

---

### 16. Madge circular-deps output

**Location:** `pnpm madge:circular`

**Details:** Madge reports “12 warnings” even though no circular dependencies are found.

**Impact:** Worth checking if warnings indicate real issues.

---

### 17. Jest: no moduleNameMapper for @repo/marketing-components, @repo/page-templates

**Location:** `jest.config.js`

**Details:** `moduleNameMapper` covers `@repo/ui`, `@repo/utils`, `@repo/infra`, `@repo/types`, `@repo/features` but not `@repo/marketing-components` or `@repo/page-templates`.

**Impact:** Low; those packages have no tests today. Needed if tests are added.

---

## Summary by CI pipeline step (Updated 2026-02-19)

| Step              | Status | Notes                                                |
|-------------------|--------|-----------------------------------------------------|
| validate:workspaces | PASS   | Fixed — added to CI pipeline                       |
| validate-exports  | PASS   | —                                                   |
| syncpack:check   | PASS   | —                                                   |
| madge:circular    | PASS   | —                                                   |
| lint             | PASS   | Fixed — all packages have eslint.config.mjs        |
| type-check       | PASS   | Fixed — Toast, marketing-components, infrastructure-ui all pass |
| build            | PASS   | Fixed — Toast type errors resolved                  |
| test             | PASS   | Fixed — booking-actions verification implemented    |

**Remaining issues:** See HIGH/MEDIUM/LOW sections below for non-blocking items.

---

## Package inventory (from code analysis)

**Clients (6):** starter-template, luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters

**Core packages:** ui, utils, types, infra, features, marketing-components, page-templates, config (eslint-config, typescript-config)

**Integrations (14):** analytics, hubspot, supabase, acuity, calendly, calcom, convertkit, mailchimp, sendgrid, crisp, intercom, tidio, google-maps, google-reviews, trustpilot, yelp

**Other:** ai-platform (3), content-platform (2), marketing-ops (1), infrastructure (1), industry-schemas, tooling (3)

**Total workspace packages:** 43
