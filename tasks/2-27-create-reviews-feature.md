# 2.27 Create Reviews Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.4

**Related Research:** §5.1 (Spec-driven), review aggregation, moderation

**Objective:** Reviews feature with 5+ implementation patterns, aggregation, and moderation.

**Implementation Patterns:** Config-Based, API-Based, Aggregation-Based, Moderation-Based, Hybrid (5+ total)

**Files:** `packages/features/src/reviews/` (index, lib/schema, lib/adapters, lib/reviews-config.ts, lib/aggregation.ts, lib/moderation.ts, components/ReviewsSection.tsx, components/ReviewsConfig.tsx, components/ReviewsAPI.tsx, components/ReviewsAggregation.tsx, components/ReviewsModeration.tsx, components/ReviewsHybrid.tsx)

**API:** `ReviewsSection`, `reviewsSchema`, `createReviewsConfig`, `aggregateReviews`, `moderateReview`, `ReviewsConfig`, `ReviewsAPI`, `ReviewsAggregation`, `ReviewsModeration`, `ReviewsHybrid`

**Checklist:** Schema; adapters; aggregation; moderation; implementation patterns; export.
**Done:** Builds; all patterns work; aggregation functional; moderation works.
**Anti:** No custom moderation AI; manual moderation only.

---
