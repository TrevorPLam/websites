# 2.32 Create Payment Feature

## Metadata

- **Task ID**: 2-32-create-payment-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.29
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Payment feature with 5+ implementation patterns and multi-gateway support.

**Implementation Patterns:** Config-Based, Stripe-Based, PayPal-Based, Multi-Gateway-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.29 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.29
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-E-COMMERCE**: Headless commerce, payment gateways — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-e-commerce) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-E-COMMERCE](RESEARCH-INVENTORY.md#r-e-commerce) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/features/src/payment/index` – create – (see task objective)
- `packages/features/src/payment/lib/schema` – create – (see task objective)
- `packages/features/src/payment/lib/adapters` – create – (see task objective)
- `packages/features/src/payment/lib/payment-config.ts` – create – (see task objective)
- `packages/features/src/payment/lib/gateways.ts` – create – (see task objective)
- `packages/features/src/payment/lib/processing.ts` – create – (see task objective)
- `packages/features/src/payment/components/PaymentSection.tsx` – create – (see task objective)
- `packages/features/src/payment/components/PaymentConfig.tsx` – create – (see task objective)
- `packages/features/src/payment/components/PaymentStripe.tsx` – create – (see task objective)
- `packages/features/src/payment/components/PaymentPayPal.tsx` – create – (see task objective)
- `packages/features/src/payment/components/PaymentMultiGateway.tsx` – create – (see task objective)
- `packages/features/src/payment/components/PaymentHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

### R-E-COMMERCE — Product catalog integration

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  variants?: ProductVariant[];
  inventory?: number;
}

interface CartItem extends Product {
  quantity: number;
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

### Related Patterns

- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples
- See [R-E-COMMERCE - Research Findings](RESEARCH-INVENTORY.md#r-e-commerce) for additional examples

## Acceptance Criteria

- [ ] Schema; adapters; payment gateways; processing; webhooks; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] payment processing functional
- [ ] webhooks work.

## Technical Constraints

- No custom payment processing
- use existing gateways.

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
