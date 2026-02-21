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

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-LOCALIZATION**: i18n, RTL, translation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-localization) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-LOCALIZATION](RESEARCH-INVENTORY.md#r-localization) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

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

### Related Patterns

- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples
- See [R-LOCALIZATION - Research Findings](RESEARCH-INVENTORY.md#r-localization) for additional examples

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
