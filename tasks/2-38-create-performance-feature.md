# 2.38 Create Performance Feature

## Metadata

- **Task ID**: 2-38-create-performance-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, C.14
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Performance feature with 5+ implementation patterns, optimization, and monitoring.

**Implementation Patterns:** Config-Based, Optimization-Based, Monitoring-Based, CDN-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: C.14 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, C.14
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/features/src/performance/index` – create – (see task objective)
- `packages/features/src/performance/lib/schema` – create – (see task objective)
- `packages/features/src/performance/lib/adapters` – create – (see task objective)
- `packages/features/src/performance/lib/performance-config.ts` – create – (see task objective)
- `packages/features/src/performance/lib/optimization.ts` – create – (see task objective)
- `packages/features/src/performance/lib/monitoring.ts` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceSection.tsx` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceConfig.tsx` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceOptimization.tsx` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceMonitoring.tsx` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceCDN.tsx` – create – (see task objective)
- `packages/features/src/performance/components/PerformanceHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `PerformanceSection`, `performanceSchema`, `createPerformanceConfig`, `optimize`, `monitor`, `analyzePerformance`, `PerformanceConfig`, `PerformanceOptimization`, `PerformanceMonitoring`, `PerformanceCDN`, `PerformanceHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; optimization; monitoring; CDN; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] optimization functional
- [ ] monitoring works.

## Technical Constraints

- No custom optimization
- standard techniques only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

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

