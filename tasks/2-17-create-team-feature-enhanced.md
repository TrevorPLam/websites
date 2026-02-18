# 2.17 Create Team Feature (Enhanced)

## Metadata

- **Task ID**: 2-17-create-team-feature-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.3
- **Downstream Tasks**: (Tasks that consume this output)

## Context

TeamSection with 5+ implementation patterns, CMS and API adapters. Uses 2.3 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Directory-Based (5+ total)
- **CMS Integration:** Sanity, Contentful, Strapi, MDX adapters
- **API Integration:** REST API, GraphQL, directory services
- **Features:** Schema validation, role filtering, department organization, social integration

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.3 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.3
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/features/src/team/index` – create – (see task objective)
- `packages/features/src/team/lib/schema` – create – (see task objective)
- `packages/features/src/team/lib/adapters/config.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/api.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/cms.ts` – create – (see task objective)
- `packages/features/src/team/lib/adapters/directory.ts` – create – (see task objective)
- `packages/features/src/team/lib/team-config.ts` – create – (see task objective)
- `packages/features/src/team/lib/filters.ts` – create – (see task objective)
- `packages/features/src/team/components/TeamSection.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamConfig.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamAPI.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamCMS.tsx` – create – (see task objective)
- `packages/features/src/team/components/TeamHybrid.tsx` – create – (see task objective)

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

## Acceptance Criteria

- [ ] Schema → adapters → implementation patterns → Section components → export. Copy pattern from testimonials.
- [ ] Builds
- [ ] all patterns work
- [ ] CMS integration functional
- [ ] API adapters work
- [ ] filtering works.

## Technical Constraints

- No CMS sync
- Server Components for data
- formatCurrency server-side.

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

