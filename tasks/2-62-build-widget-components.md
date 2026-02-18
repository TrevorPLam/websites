# 2.30 Build Widget Components

## Metadata

- **Task ID**: 2-30-build-widget-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7
- **Downstream Tasks**: (Tasks that consume this output)

## Context

8+ Widget variants including weather, clock, and countdown. L2.

**Enhanced Requirements:**

- **Variants:** Weather, Clock, Countdown, Stock Ticker, News Feed, Social Feed, Calendar Widget, Minimal (8+ total)
- **Real-Time Updates:** Live data, auto-refresh, API integration

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/widget/types.ts` – modify – (see task objective)
- `WeatherWidget.tsx` – modify – (see task objective)
- `ClockWidget.tsx` – modify – (see task objective)
- `CountdownWidget.tsx` – modify – (see task objective)
- `widget/updates.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `WidgetDisplay`. Props: `variant`, `config`, `autoRefresh`, `updateInterval`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; real-time updates; export.
- [ ] All 8+ variants render
- [ ] updates work
- [ ] API integration functional.

## Technical Constraints

- No custom APIs
- standard providers only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; real-time updates; export.

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

