# 2.49 Build Menu Components (Restaurant)

## Metadata

- **Task ID**: 2-49-build-menu-components-restaurant
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.3 (Tabs)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Menu variants with dietary information. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Tabs, Accordion, With Images, With Prices, 
  With Descriptions, Category Tabs, Filterable, With Dietary Info (10+ total)
- **Dietary Information:** Vegetarian, vegan, gluten-free, allergen labels
- **Filtering:** By category, dietary restrictions, price range

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.3 (Tabs) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.3 (Tabs)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/menu/types.ts` – modify – (see task objective)
- `MenuGrid.tsx` – modify – (see task objective)
- `MenuTabs.tsx` – modify – (see task objective)
- `MenuAccordion.tsx` – modify – (see task objective)
- `MenuItemCard.tsx` – modify – (see task objective)
- `menu/dietary.tsx` – modify – (see task objective)
- `menu/filters.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `MenuDisplay`, `MenuItemCard`. Props: `variant`, `items` (array), 
// `showDietaryInfo`, `filterByCategory`, `filterByDietary`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; dietary info; filtering; export.
- [ ] All 10+ variants render
- [ ] dietary info displays
- [ ] filtering works.

## Technical Constraints

- No custom dietary labels
- standard options only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; dietary info; filtering; export.

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
