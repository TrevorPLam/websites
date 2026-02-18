# 2.25 Build Search Components

## Metadata

- **Task ID**: 2-25-build-search-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.15 (Command Palette), 2.20 (Search Feature)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

8+ Search variants with autocomplete and suggestions. L2.

**Enhanced Requirements:**

- **Variants:** Standard, With Autocomplete, With Suggestions, With Filters, Global Search, Mobile Search, Minimal, Advanced (8+ total)
- **Autocomplete:** Real-time suggestions, recent searches, popular searches
- **Suggestions:** Search suggestions, related searches, typo correction

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.15 (Command Palette) – required – prerequisite
- **Upstream Task**: 2.20 (Search Feature) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.15 (Command Palette), 2.20 (Search Feature); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/search/types.ts` – modify – (see task objective)
- `SearchStandard.tsx` – modify – (see task objective)
- `SearchAutocomplete.tsx` – modify – (see task objective)
- `SearchWithSuggestions.tsx` – modify – (see task objective)
- `search/autocomplete.tsx` – modify – (see task objective)
- `search/suggestions.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `SearchDisplay`. Props: `variant`, `onSearch`, `showAutocomplete`, `showSuggestions`, `debounceMs`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; autocomplete; suggestions; export.
- [ ] All 8+ variants render
- [ ] autocomplete works
- [ ] suggestions display.

## Technical Constraints

- No fuzzy search
- basic matching only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; autocomplete; suggestions; export.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

