# F.2 Variant System Infrastructure

## Metadata

- **Task ID**: f-2-variant-system-infrastructure
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Centralized variant system with type-safe variant definitions and composition.

## Dependencies

- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Component patterns), CVA, variant systems

## Related Files

- `packages/infrastructure/variants/index` – create – (see task objective)
- `packages/infrastructure/variants/types.ts` – create – (see task objective)
- `packages/infrastructure/variants/cva.ts` – create – (see task objective)
- `packages/infrastructure/variants/compose.ts` – create – (see task objective)
- `packages/infrastructure/variants/utils.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `createVariant`, `composeVariants`, `variantSchema`, `useVariant`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Variant types; CVA integration; composition; utilities; export.
- [ ] Builds
- [ ] variant system functional
- [ ] type-safe variants work.

## Technical Constraints

- No custom variant engine
- CVA-based only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Variant types; CVA integration; composition; utilities; export.

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

