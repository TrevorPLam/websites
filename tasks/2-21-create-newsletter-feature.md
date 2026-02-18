# 2.21 Create Newsletter Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 4.1

**Related Research:** §5.1 (Spec-driven), §4.1 (Email integrations)

**Objective:** Newsletter feature with 5+ implementation patterns, segmentation, and automation.

**Implementation Patterns:** Config-Based, API-Based, Email-Service-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/newsletter/` (index, lib/schema, lib/adapters, lib/newsletter-config.ts, lib/segmentation.ts, lib/automation.ts, components/NewsletterSection.tsx, components/NewsletterConfig.tsx, components/NewsletterAPI.tsx, components/NewsletterEmail.tsx, components/NewsletterCMS.tsx, components/NewsletterHybrid.tsx)

**API:** `NewsletterSection`, `newsletterSchema`, `createNewsletterConfig`, `subscribe`, `segmentSubscribers`, `automateCampaigns`, `NewsletterConfig`, `NewsletterAPI`, `NewsletterEmail`, `NewsletterCMS`, `NewsletterHybrid`

**Checklist:** Schema; adapters; segmentation; automation; implementation patterns; export.
**Done:** Builds; all patterns work; segmentation functional; automation works.
**Anti:** No custom email service; use existing providers.

---
