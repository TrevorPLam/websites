# 2.19 Create Pricing Feature (Enhanced)

## Metadata

- **Task ID**: 2-19-create-pricing-feature-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.5
- **Downstream Tasks**: (Tasks that consume this output)

## Context

PricingSection with 5+ implementation patterns, calculator integration, and comparison. Uses 2.5 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Calculator-Based, Hybrid (5+ total)
- **Calculator Integration:** Price calculator, feature calculator, usage-based calculator
- **Comparison:** Feature comparison, price comparison, plan recommendations
- **Features:** Schema validation, currency formatting, localization, plan recommendations

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.5 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.5
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/features/src/pricing/index` – create – (see task objective)
- `packages/features/src/pricing/lib/schema` – create – (see task objective)
- `packages/features/src/pricing/lib/adapters/config.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/adapters/api.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/adapters/cms.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/pricing-config.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/calculator.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/comparison.ts` – create – (see task objective)
- `packages/features/src/pricing/lib/formatting.ts` – create – (see task objective)
- `packages/features/src/pricing/components/PricingSection.tsx` – create – (see task objective)
- `packages/features/src/pricing/components/PricingConfig.tsx` – create – (see task objective)
- `packages/features/src/pricing/components/PricingAPI.tsx` – create – (see task objective)
- `packages/features/src/pricing/components/PricingCMS.tsx` – create – (see task objective)
- `packages/features/src/pricing/components/PricingCalculator.tsx` – create – (see task objective)
- `packages/features/src/pricing/components/PricingHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Section with composition

```typescript
interface SectionProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}
export function Section({ title, description, children }: SectionProps) {
  return (
    <section>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}
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

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const ComponentRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('component-root', className)} {...props} />
));
```

### Related Patterns

- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples
- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CMS - Research Findings](RESEARCH-INVENTORY.md#r-cms) for additional examples

## Acceptance Criteria

- [ ] Schema → adapters → implementation patterns → calculator → comparison → Section components → export.
- [ ] Builds
- [ ] all patterns work
- [ ] calculator functional
- [ ] comparison works
- [ ] currency formatting works.

## Technical Constraints

- No payment processing
- display and calculation only.

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
