# Issues — Codebase Analysis Results

> **Generated:** 2026-02-18 — Deep codebase analysis (no documentation referenced)  
> **Re-verified:** 2026-02-18 — Documentation updated to reflect reality

This file documents all issues discovered through exhaustive code and configuration analysis.

---

## CRITICAL — Blocking CI / Merge

### 1. Build fails: TypeScript errors in @repo/ui Toast.tsx

**Location:** `packages/ui/src/components/Toast.tsx`

**Error:** When `@repo/features` (or `@repo/marketing-components`) builds, it type-checks `@repo/ui`. Two errors:

- **Line 66:** `toast.custom(jsx, options)` — Sonner expects `(id) => ReactElement` but we pass `(id) => ReactNode`. `ReactNode` includes `undefined`, which is not assignable.
- **Line 82:** `sonnerToast.promise(promise, messages, options)` — Expected 1–2 arguments, got 3. Sonner API may have changed.

**Impact:** Full monorepo build fails. CI quality-gates blocks merge.

---

### 2. validate-workspaces fails: package.json workspaces out of sync

**Location:** `package.json` vs `pnpm-workspace.yaml`

**Error:** `pnpm validate:workspaces` exits 1. `package.json` workspaces omit:

- `packages/ai-platform/*`
- `packages/content-platform/*`
- `packages/marketing-ops/*`
- `packages/infrastructure/*`
- `tooling/*`

**Impact:** CI runs `validate:workspaces` (or similar checks); script fails.

---

### 3. Tests fail: booking-actions verification tests (4 failures)

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

### 4. Turbo build: @repo/marketing-components has no output files

**Location:** `packages/marketing-components/package.json` + `turbo.json`

**Error:** Build script is `"build": "echo build complete"`. Turbo `outputs` expects `[".next/**", "dist/**", "build/**"]`. No such files are produced.

**Impact:** Turbo warns: `no output files found for task @repo/marketing-components#build`.

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

### 7. ESLint 9: many packages lack flat config

**Location:** Multiple packages under `packages/`, `tooling/`

**Error:** ESLint 9 expects `eslint.config.(js|mjs|cjs)`. Missing in:

- `tooling/validation`
- `tooling/create-client`
- `packages/infrastructure/tenant-core`
- `packages/ai-platform/agent-orchestration`
- `packages/ai-platform/llm-gateway`
- `packages/ai-platform/content-engine`
- `packages/integrations/yelp`
- `packages/integrations/convertkit`
- `packages/integrations/crisp`
- `packages/integrations/sendgrid`
- `packages/integrations/mailchimp`
- (and likely other integrations, content-platform, marketing-ops)

**Packages with config:** `ui`, `infra`, `features`, `utils` only.

**Impact:** `pnpm lint` fails in many packages. CI quality-gates fails.

---

### 8. @repo/marketing-components type-check fails

**Location:** `packages/marketing-components/src/**`

**Errors:**

- **TS6133 (unused):** Many `import * as React from 'react'` + `noUnusedLocals`. Also unused destructured params: `columns`, `autoPlay`, `interval`, `speed`, `services`.
- **TS2741:** `ServiceAccordion` passes `{}` to `Accordion` which requires `items`.
- **Toast/Toaster:** Same Toast issues as #1 when type-checked via marketing-components → ui.

**Impact:** `pnpm type-check` fails for marketing-components. CI type-check fails.

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

## Summary by CI pipeline step

| Step              | Status | Failing item(s)                                      |
|-------------------|--------|-----------------------------------------------------|
| validate:workspaces | FAIL | package.json vs pnpm-workspace sync                 |
| validate-exports  | PASS   | —                                                   |
| syncpack:check   | PASS   | —                                                   |
| madge:circular    | PASS   | —                                                   |
| lint             | FAIL   | Many packages missing `eslint.config.*`             |
| type-check       | FAIL   | @repo/marketing-components (Toast + unused vars)    |
| build            | FAIL   | @repo/features (Toast type errors)                 |
| test             | FAIL   | booking-actions.test.ts (4 tests)                  |

---

## Package inventory (from code analysis)

**Clients (6):** starter-template, luxe-salon, bistro-central, chen-law, sunrise-dental, urban-outfitters

**Core packages:** ui, utils, types, infra, features, marketing-components, page-templates, config (eslint-config, typescript-config)

**Integrations (14):** analytics, hubspot, supabase, acuity, calendly, calcom, convertkit, mailchimp, sendgrid, crisp, intercom, tidio, google-maps, google-reviews, trustpilot, yelp

**Other:** ai-platform (3), content-platform (2), marketing-ops (1), infrastructure (1), industry-schemas, tooling (3)

**Total workspace packages:** 43
