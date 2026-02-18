# Refactor Parity Matrix

**Last Updated:** February 17, 2026  
**Purpose:** Ensure extracted `@repo/features` behavior matches template/original behavior before deleting template code.  
**Status:** Active — parity suite is a blocking CI check on extraction PRs.

---

## Overview

This matrix maps each extracted feature to explicit test cases that must pass to confirm **parity** between:

1. **Template/original behavior** — What the hair-salon template (or its local feature code) currently does.
2. **Extracted package behavior** — What `@repo/features/*` exposes.

No template feature code should be deleted without parity test sign-off.

---

## Parity Test Locations

| Location | Scope | Purpose |
|----------|--------|---------|
| `templates/hair-salon/__tests__/refactor-parity/*.test.ts` | Template-level integration | Critical paths using template wiring (e.g. `lib/search.ts`, booking page flow). Verifies template + @repo/features together. |
| `packages/features/src/<feature>/__tests__/parity/*.test.ts` | Package-level contract | Verifies @repo/features API and behavior in isolation (optional; use when contract is complex). |

---

## Feature Parity Matrix

### 1. Booking

| ID | Test Case | Priority | Template Source | Package Contract | Parity Test Location |
|----|------------|----------|-----------------|------------------|----------------------|
| B1 | Valid IP extraction from `x-forwarded-for` | Critical | `features/booking/lib/__tests__/booking-actions.test.ts` | `submitBookingRequest(formData, config)` uses getValidatedClientIp; rate limit receives clientIp | `refactor-parity/booking-parity.test.ts` |
| B2 | Spoofed header rejection → clientIp `unknown` | Critical | Same | Same | Same |
| B3 | No IP headers → clientIp `unknown` | Critical | Same | Same | Same |
| B4 | Result shape: `success`, `bookingId?`, `confirmationNumber?`, `error?` | Critical | Same | `BookingSubmissionResult` | Same |
| B5 | Rate limit enforced (checkRateLimit false → error) | Critical | Implied | Same | Same |
| B6 | Valid form data + config → success true | High | Template action | Package action with `BookingFeatureConfig` | Same |

**Intentional deltas:**

- Package requires `BookingFeatureConfig` as second argument; template currently uses single-arg (local config). Template migration will pass config from site.config.

---

### 2. Search

| ID | Test Case | Priority | Template Source | Package Contract | Parity Test Location |
|----|------------|----------|-----------------|------------------|----------------------|
| S1 | Search index includes static pages from route registry | Critical | `lib/search.ts` + `lib/routes.ts` | `getSearchIndex({ staticItems, blogItems })` | `refactor-parity/search-parity.test.ts` |
| S2 | Search index includes blog posts with correct href `/blog/:slug` | Critical | `lib/__tests__/search.test.ts` | Same | Same |
| S3 | Each item has `id`, `title`, `description`, `href`, `type` | High | `SearchItem` type | `@repo/features/search` SearchItem | Same |
| S4 | Filter/ranking behavior (e.g. filterItems) | Medium | Feature lib | Package search-index + filter-items | Package unit tests already exist |

**Intentional deltas:**

- Template adapter `lib/search.ts` builds `blogItems` from `getAllPosts()`; package accepts `blogItems` or async provider. No behavioral delta.

---

### 3. Services

| ID | Test Case | Priority | Template Source | Package Contract | Parity Test Location |
|----|------------|----------|-----------------|------------------|----------------------|
| SV1 | `ServiceOverviewItem`: `icon`, `title`, `description`, `href` | High | `lib/services-config.ts` | `@repo/features` types | `refactor-parity/services-parity.test.ts` |
| SV2 | ServicesOverview accepts items and renders (data-shape parity) | High | Homepage + ServicesOverview | Package ServicesOverview props | Same |
| SV3 | ServiceDetailLayout accepts `siteName`, `baseUrl`, steps, pricing | High | Service detail pages | Package ServiceDetailProps | Same |

**Intentional deltas:**

- Template provides content (titles, hrefs); package is presentational. Data shape is the contract.

---

### 4. Contact

| ID | Test Case | Priority | Template Source | Package Contract | Parity Test Location |
|----|------------|----------|-----------------|------------------|----------------------|
| C1 | ContactSubmissionResult: `success`, `message`, `errors?` | Critical | Template form submit | `ContactSubmissionResult` | `refactor-parity/contact-parity.test.ts` |
| C2 | Schema validates required fields (name, email, message) | High | Template schema | `@repo/features/contact` contactSchema | Same |
| C3 | Rate limiting applied to contact submissions | High | Implied | submitContactForm uses checkRateLimit | Same |

**Intentional deltas:**

- Template uses adapter ContactForm; package provides base ContactForm + createContactConfig. Result shape is the contract.

---

### 5. Blog

| ID | Test Case | Priority | Template Source | Package Contract | Parity Test Location |
|----|------------|----------|-----------------|------------------|----------------------|
| BL1 | getAllPosts() returns array of { slug, title, description, ... } | High | features/blog | @repo/features/blog BlogPost shape | `refactor-parity/blog-parity.test.ts` + search (S2) |
| BL2 | Blog post content renders (MDX) | Medium | BlogPostContent | Package export | E2E or visual; not in parity suite |

**Intentional deltas:**

- Blog parity: BL1 contract asserted in `blog-parity.test.ts`; full getAllPosts() shape also covered by search (S2: blog items in index).

---

## CI Integration

- **Command:** `pnpm test` (root Jest; includes all projects and `templates/hair-salon/__tests__/refactor-parity/*.test.ts`).
- **CI job:** `.github/workflows/ci.yml` quality-gates job runs `pnpm test`; parity suite is part of the full suite (blocking).
- **Blocking:** Parity tests must pass before:
  - Removing template feature code (e.g. deleting `templates/hair-salon/features/booking/lib/booking-actions.ts`).
  - Merging extraction PRs that change @repo/features contract.
- **Location:** `templates/hair-salon/__tests__/refactor-parity/*.test.ts` is included in root `jest.config.js` (node project match patterns for template lib and feature tests).

---

## Adding New Parity Tests

1. Add a row to the matrix above (feature, ID, test case, priority, locations).
2. Add or extend test file under `templates/hair-salon/__tests__/refactor-parity/` or `packages/features/src/<feature>/__tests__/parity/`.
3. Document any **intentional deltas** so they are not treated as regressions.
4. Run `pnpm test` and confirm parity suite passes.

---

**Document Status:** Active  
**Next Review:** When a new feature is extracted or template code is removed.
