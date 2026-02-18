# 2.31 Create Form Builder Feature

## Metadata

- **Task ID**: 2-31-create-form-builder-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 1.23 (Form)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Form builder feature with 5+ implementation patterns and visual builder.

**Implementation Patterns:** Config-Based, Visual-Builder-Based, Schema-Based, API-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 1.23 (Form) – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 1.23 (Form)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), visual form builders

## Related Files

- `packages/features/src/form-builder/index` – create – (see task objective)
- `packages/features/src/form-builder/lib/schema` – create – (see task objective)
- `packages/features/src/form-builder/lib/adapters` – create – (see task objective)
- `packages/features/src/form-builder/lib/form-config.ts` – create – (see task objective)
- `packages/features/src/form-builder/lib/visual-builder.ts` – create – (see task objective)
- `packages/features/src/form-builder/lib/fields.ts` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderSection.tsx` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderConfig.tsx` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderVisual.tsx` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderSchema.tsx` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderAPI.tsx` – create – (see task objective)
- `packages/features/src/form-builder/components/FormBuilderHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `FormBuilderSection`, `formBuilderSchema`, `createFormConfig`, `buildForm`, `renderForm`, `FormBuilderConfig`, `FormBuilderVisual`, `FormBuilderSchema`, `FormBuilderAPI`, `FormBuilderHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; visual builder; field types; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] visual builder functional
- [ ] forms render.

## Technical Constraints

- No custom field types
- standard inputs only.

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

