# 2.24 Build Filter Components

## Metadata

- **Task ID**: 2-24-build-filter-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.11 (Switch), 1.21 (Checkbox)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

8+ Filter variants with presets and history. L2.

**Enhanced Requirements:**

- **Variants:** Sidebar, Top Bar, Accordion, Dropdown, With Presets, With History, Minimal, Advanced (8+ total)
- **Presets:** Saved filter presets, quick filters
- **History:** Recent filters, filter suggestions

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.11 (Switch) – required – prerequisite
- **Upstream Task**: 1.21 (Checkbox) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.11 (Switch), 1.21 (Checkbox)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/filter/types.ts` – modify – (see task objective)
- `FilterSidebar.tsx` – modify – (see task objective)
- `FilterTopBar.tsx` – modify – (see task objective)
- `FilterAccordion.tsx` – modify – (see task objective)
- `filter/presets.tsx` – modify – (see task objective)
- `filter/history.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `FilterDisplay`. Props: `variant`, `filters` (array), `showPresets`, `showHistory`, `onFilterChange`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; presets; history; export.
- [ ] All 8+ variants render
- [ ] presets work
- [ ] history functional.

## Technical Constraints

- No persistence
- session-only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; presets; history; export.

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

