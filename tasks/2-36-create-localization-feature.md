# 2.36 Create Localization Feature

## Metadata

- **Task ID**: 2-36-create-localization-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, C.11
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Localization feature with 5+ implementation patterns, AI translation, and RTL support.

**Implementation Patterns:** Config-Based, i18n-Based, AI-Translation-Based, CMS-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: C.11 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, C.11
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/features/src/localization/index` – create – (see task objective)
- `packages/features/src/localization/lib/schema` – create – (see task objective)
- `packages/features/src/localization/lib/adapters` – create – (see task objective)
- `packages/features/src/localization/lib/locale-config.ts` – create – (see task objective)
- `packages/features/src/localization/lib/i18n.ts` – create – (see task objective)
- `packages/features/src/localization/lib/translation.ts` – create – (see task objective)
- `packages/features/src/localization/lib/rtl.ts` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationSection.tsx` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationConfig.tsx` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationI18n.tsx` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationAI.tsx` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationCMS.tsx` – create – (see task objective)
- `packages/features/src/localization/components/LocalizationHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `LocalizationSection`, `localizationSchema`, `createLocaleConfig`, `translate`, `switchLocale`, `rtlSupport`, `LocalizationConfig`, `LocalizationI18n`, `LocalizationAI`, `LocalizationCMS`, `LocalizationHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; i18n; AI translation; RTL support; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] i18n functional
- [ ] AI translation works
- [ ] RTL works.

## Technical Constraints

- No custom translation models
- use existing services.

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

