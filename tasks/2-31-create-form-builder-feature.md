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

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-FORM**: React Hook Form, Zod, validation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-form) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-FORM](RESEARCH-INVENTORY.md#r-form) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

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

### R-FORM — Form with Zod resolver
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});
```

### R-UI — React 19 component with ref forwarding
```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Component({ ref, className, ...props }: ComponentProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('component', className)}
      {...props}
    />
  );
}
```

### R-A11Y — Touch targets and reduced motion
```css
.component-button {
  min-width: 24px;
  min-height: 24px;
}
```

### Reduced motion detection
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization
- Page shell < 250 KB gzipped; component-level budgets (e.g. section < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### Related Patterns
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-FORM - Research Findings](RESEARCH-INVENTORY.md#r-form) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples

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

