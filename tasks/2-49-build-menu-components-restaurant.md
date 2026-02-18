# 2.49 Build Menu Components (Restaurant)

## Metadata

- **Task ID**: 2-49-build-menu-components-restaurant
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.3 (Tabs)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Menu variants with dietary information. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Tabs, Accordion, With Images, With Prices, 
  With Descriptions, Category Tabs, Filterable, With Dietary Info (10+ total)
- **Dietary Information:** Vegetarian, vegan, gluten-free, allergen labels
- **Filtering:** By category, dietary restrictions, price range

## Dependencies

- **Upstream Task**: 1.3 (Tabs) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package (exists)

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.3 (Tabs); marketing-components package exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-INDUSTRY**: JSON-LD, industry patterns — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-industry) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/marketing-components/src/menu/types.ts` – create – menu item types, dietary flags
- `packages/marketing-components/src/menu/MenuGrid.tsx` – create – grid variant
- `packages/marketing-components/src/menu/MenuTabs.tsx` – create – category tabs variant
- `packages/marketing-components/src/menu/MenuAccordion.tsx` – create – accordion variant
- `packages/marketing-components/src/menu/MenuItemCard.tsx` – create – item card
- `packages/marketing-components/src/menu/dietary.tsx` – create – dietary/allergen chips
- `packages/marketing-components/src/menu/filters.tsx` – create – category/dietary filters
- `packages/marketing-components/src/index.ts` – modify – export menu

## Code Snippets / Examples

### Related Patterns
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples
- See [R-INDUSTRY - Research Findings](RESEARCH-INVENTORY.md#r-industry) for additional examples

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
