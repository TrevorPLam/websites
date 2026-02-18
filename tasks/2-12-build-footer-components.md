# 2.12 Build Footer Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Footer variants with newsletter and social-focused layouts. L2.

**Requirements:**

- **Variants:** Standard, Minimal, With Newsletter, Social-Focused, Multi-Column, With Map, With Contact, With Links, With Logo, Sticky (10+ total)
- **Newsletter Integration:** Email signup, validation, integration
- **Social Integration:** Social media links, icons, follow buttons

**Files:** `packages/marketing-components/src/footer/types.ts`, `FooterStandard.tsx`, `FooterMinimal.tsx`, `FooterWithNewsletter.tsx`, `FooterSocial.tsx`, `footer/newsletter.tsx`, `index.ts`

**API:** `Footer`. Props: `variant`, `links` (array), `showNewsletter`, `showSocial`, `showMap`, `showContact`.

**Checklist:** Types; variants; newsletter integration; social integration; export.
**Done:** All 10+ variants render; newsletter works; social links functional.
**Anti:** No custom styling; standard layouts only.

---
