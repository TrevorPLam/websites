# EVOL-2 CVA Completion + Token System

## Metadata

- **Task ID**: evol-2-cva-token-completion
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 1 (Week 2)
- **Related Epics / ADRs**: NEW.md Phase 1, TODO.md Wave 2.3
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: evol-3 (capability-ready theming)

## Context

Complete CVA migration for remaining components (TODO.md 2.3: ~49 components). Ensure Button and key variants use CSS variables (`hsl(var(--color-primary))`) for capability-ready runtime theme injection.

## Dependencies

- TODO.md 2.3 — 8 components done (Button, Badge, Alert, Tabs, Toggle, Card, Container, Skeleton)
- c-5 design tokens (complete per TODO.md 3.1)

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture).
- **[2026-02]** CVA from `@repo/infra/variants`; use CSS vars for capability system readiness.
- **References**: [packages/ui/src/components/Button.tsx](../packages/ui/src/components/Button.tsx), NEW.md Week 2.

## Related Files

- `packages/ui/src/components/**` – modify (Switch, Input, Checkbox, Textarea, etc.)
- `packages/ui/src/components/Button.tsx` – ensure CSS vars for variant colors

## Acceptance Criteria

- [ ] Remaining high-priority components migrated to CVA (Switch, Input, Checkbox, Textarea, RadioGroup, Progress)
- [ ] Button and primary variants use `hsl(var(--color-primary))` etc. for theme injection
- [ ] No breaking changes to component APIs
- [ ] `pnpm type-check` and `pnpm test` pass

## Technical Constraints

- CVA from @repo/infra/variants
- Theme colors from site.config via ThemeInjector CSS vars
- Preserve existing component APIs

## Implementation Plan

- [ ] Migrate Switch, Input, Checkbox, Textarea, RadioGroup, Progress to CVA (priority order from TODO.md)
- [ ] Audit Button for CSS var usage
- [ ] Add tests for variant rendering
- [ ] Document in design-token-architecture.md

## Sample code / examples

```tsx
// packages/ui/src/components/Button.tsx
export const buttonVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]',
    },
  },
});
```

## Testing Requirements

- Component tests for migrated components; `pnpm test` passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
