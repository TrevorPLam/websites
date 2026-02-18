# 2.36 Create Localization Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, C.11

**Related Research:** §5.1 (Spec-driven), §C.11 (i18n/RTL), AI translation

**Objective:** Localization feature with 5+ implementation patterns, AI translation, and RTL support.

**Implementation Patterns:** Config-Based, i18n-Based, AI-Translation-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/localization/` (index, lib/schema, lib/adapters, lib/locale-config.ts, lib/i18n.ts, lib/translation.ts, lib/rtl.ts, components/LocalizationSection.tsx, components/LocalizationConfig.tsx, components/LocalizationI18n.tsx, components/LocalizationAI.tsx, components/LocalizationCMS.tsx, components/LocalizationHybrid.tsx)

**API:** `LocalizationSection`, `localizationSchema`, `createLocaleConfig`, `translate`, `switchLocale`, `rtlSupport`, `LocalizationConfig`, `LocalizationI18n`, `LocalizationAI`, `LocalizationCMS`, `LocalizationHybrid`

**Checklist:** Schema; adapters; i18n; AI translation; RTL support; implementation patterns; export.
**Done:** Builds; all patterns work; i18n functional; AI translation works; RTL works.
**Anti:** No custom translation models; use existing services.

---
