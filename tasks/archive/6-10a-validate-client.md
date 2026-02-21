# 6.10a validate-client

## Metadata

- **Task ID**: 6-10a-validate-client
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6.3 (6.8), 6.1+6.3 (6.9), 5.1 (6.10a)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

pnpm create-client, validate-config, generate-component; knip/depcheck; validate-client script; pnpm health; program:wave0–wave3 scripts.

## Dependencies

- **Upstream Task**: 6.3 (6.8) – required – prerequisite
- **Upstream Task**: 6.1+6.3 (6.9) – required – prerequisite
- **Upstream Task**: 5.1 (6.10a) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6.3 (6.8), 6.1+6.3 (6.9), 5.1 (6.10a)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-DOCS**: ADRs, config reference, migration — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-docs) for full research findings.
- **[2026-02-18] R-CONFIG-VALIDATION**: Config schema validation, Zod — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-config-validation) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-DOCS](RESEARCH-INVENTORY.md#r-docs) — Full research findings
- [RESEARCH-INVENTORY.md - R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- (Add file paths)

## Code Snippets / Examples

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Component({ ref, className, ...props }: ComponentProps) {
  return React.createElement(Primitive.Root, {
    ref,
    className: cn('component', className),
    ...props,
  });
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

### R-PERF — Core Web Vitals optimization

```typescript
// Performance monitoring
export function reportWebVitals(metric: any) {
  // Send to analytics service
  console.log({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
}

// Bundle optimization
export function optimizeBundle() {
  // Bundle optimization logic
}

// Image optimization with next/image
export function OptimizedImage({ src, alt, priority }: ImageProps) {
  return React.createElement(Image, {
    src,
    alt,
    priority,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  });
}
```

### Related Patterns

- See [R-DOCS - Research Findings](RESEARCH-INVENTORY.md#r-docs) for additional examples
- See [R-CONFIG-VALIDATION - Research Findings](RESEARCH-INVENTORY.md#r-config-validation) for additional examples

## Acceptance Criteria

- [ ] (Add specific, testable criteria)

## Technical Constraints

- (Add technical constraints per task scope)

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
