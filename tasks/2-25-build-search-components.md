# 2.25 Build Search Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.15 (Command Palette), 2.20 (Search Feature)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Search variants with autocomplete and suggestions. L2.

**Requirements:**

- **Variants:** Standard, With Autocomplete, With Suggestions, With Filters, Global Search, Mobile Search, Minimal, Advanced (8+ total)
- **Autocomplete:** Real-time suggestions, recent searches, popular searches
- **Suggestions:** Search suggestions, related searches, typo correction

**Files:** `packages/marketing-components/src/search/types.ts`, `SearchStandard.tsx`, `SearchAutocomplete.tsx`, `SearchWithSuggestions.tsx`, `search/autocomplete.tsx`, `search/suggestions.tsx`, `index.ts`

**API:** `SearchDisplay`. Props: `variant`, `onSearch`, `showAutocomplete`, `showSuggestions`, `debounceMs`.

**Checklist:** Types; variants; autocomplete; suggestions; export.
**Done:** All 8+ variants render; autocomplete works; suggestions display.
**Anti:** No fuzzy search; basic matching only.

---
