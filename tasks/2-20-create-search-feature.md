# 2.20 Create Search Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.25

**Related Research:** §5.1 (Spec-driven), §3.4 (CMS), search patterns

**Objective:** Search feature with 5+ implementation patterns, AI-powered search, and semantic search.

**Implementation Patterns:** Config-Based, API-Based, CMS-Based, AI-Powered, Hybrid (5+ total)

**Files:** `packages/features/src/search/` (index, lib/schema, lib/adapters, lib/search-config.ts, lib/ai-search.ts, lib/semantic-search.ts, components/SearchSection.tsx, components/SearchConfig.tsx, components/SearchAPI.tsx, components/SearchCMS.tsx, components/SearchAI.tsx, components/SearchHybrid.tsx)

**API:** `SearchSection`, `searchSchema`, `createSearchConfig`, `performSearch`, `aiSearch`, `semanticSearch`, `SearchConfig`, `SearchAPI`, `SearchCMS`, `SearchAI`, `SearchHybrid`

**Checklist:** Schema; adapters; AI integration; semantic search; implementation patterns; export.
**Done:** Builds; all patterns work; AI search functional; semantic search works.
**Anti:** No custom AI models; use existing APIs.

---
