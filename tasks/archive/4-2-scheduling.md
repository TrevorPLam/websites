# 4.2 Scheduling

## Metadata

# 4.2 Scheduling

## Metadata

- **Task ID**: 4-2-scheduling
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None (4.4 feeds 2.16)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Adapter contracts. Calendly/Acuity/Cal.com; Intercom/Crisp/Tidio; Google/Yelp/Trustpilot; Google Maps (static + interactive); JSON-LD generators per industry.

## Dependencies

- **Upstream Task**: None (4.4 feeds 2.16) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None (4.4 feeds 2.16)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-INTEGRATION**: Scheduling, OAuth, TCF — see [RESEARCH-INVENTORY.md](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH-INVENTORY.md#r-integration) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-INTEGRATION](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH-INVENTORY.md#r-integration) — Full research findings
- [RESEARCH.md](https://github.com/TrevorPLam/websites/blob/main/tasks/RESEARCH.md) — Additional context

## Related Files

- `packages/integrations/scheduling/contract.ts` – modify – SchedulingAdapter interface
- `packages/integrations/calendly/src/index.ts` – modify – Calendly implementation
- `packages/integrations/acuity/src/index.ts` – modify – Acuity implementation
- `packages/integrations/calcom/src/index.ts` – modify – Cal.com implementation
- `packages/integrations/scheduling/index.ts` – modify – Central export
- `packages/integrations/scheduling/__tests__/adapters.test.ts` – create – Unit tests

## Code Snippets / Examples

### R-INTEGRATION — Scheduling Adapter Contract

```typescript
export interface SchedulingAdapter {
  id: string;
  name: string;
  getEventTypes(): Promise<SchedulingEvent[]>;
  getBookingUrl(eventTypeId?: string): string;
  getEmbedConfig(eventTypeId?: string): EmbedConfig;
}
```

### Usage Example

```typescript
const adapter = new CalendlyAdapter('username');
const url = adapter.getBookingUrl();
```

## Acceptance Criteria

- [x] Contract first; adapters; export; consent gate where needed.
- [x] Adapters work
- [ ] schemas generate valid JSON-LD.

## Definition of Done

- [x] Code reviewed and approved
- [x] All tests passing
- [x] Documentation updated
- [x] Build passes

- **Task ID**: 4-2-scheduling
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None (4.4 feeds 2.16)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Adapter contracts. Calendly/Acuity/Cal.com; Intercom/Crisp/Tidio; Google/Yelp/Trustpilot; Google Maps (static + interactive); JSON-LD generators per industry.

## Dependencies

- **Upstream Task**: None (4.4 feeds 2.16) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None (4.4 feeds 2.16)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-INTEGRATION**: Scheduling, OAuth, TCF — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-integration) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- (Add file paths)

## Code Snippets / Examples

### R-INTEGRATION — Third-party service adapter

```typescript
interface ServiceAdapter {
  name: string;
  connect: () => Promise<void>;
  send: (data: any) => Promise<any>;
  disconnect: () => void;
  retryPolicy?: RetryPolicy;
}

interface RetryPolicy {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class EmailAdapter implements ServiceAdapter {
  async send(data: EmailData) {
    // Email sending implementation with retry logic
  }
}
```

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

- See [R-INTEGRATION - Research Findings](RESEARCH-INVENTORY.md#r-integration) for additional examples

## Acceptance Criteria

- [ ] Contract first; adapters; export; consent gate where needed.
- [ ] Adapters work
- [ ] schemas generate valid JSON-LD.

## Technical Constraints

- No calendar sync (4.2)
- no review response (4.4)
- limit 12 industries (4.6).

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Contract first; adapters; export; consent gate where needed.

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
