# 2.9 Build FAQ Section Component (Expanded)

## Metadata

- **Task ID**: 2-9-build-faq-section-component-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.27 (Accordion)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6 FAQ Section variants with search functionality. L2.

**Enhanced Requirements:**

- **Variants:** Accordion, List, Tabs, Searchable, With Categories, Minimal (6 total)
- **Search:** Full-text search, highlight matches, filter by category
- **Composition:** FAQ items with question, answer, category, tags

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.27 (Accordion) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.27 (Accordion); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/faq/types.ts` – modify – (see task objective)
- `FAQAccordion.tsx` – modify – (see task objective)
- `FAQList.tsx` – modify – (see task objective)
- `FAQTabs.tsx` – modify – (see task objective)
- `FAQSearchable.tsx` – modify – (see task objective)
- `FAQWithCategories.tsx` – modify – (see task objective)
- `faq/search.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `FAQSection`, `FAQItem`. Props: `variant`, `items` (array), `searchable`, `filterByCategory`, `showCategories`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; search functionality; export.
- [ ] All 6 variants render
- [ ] search works
- [ ] filtering functional
- [ ] SEO-friendly.

## Technical Constraints

- No fuzzy search
- basic string matching only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; search functionality; export.

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

