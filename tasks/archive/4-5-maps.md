# 4.5 Maps

## Metadata

- **Task ID**: 4-5-maps
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

- `packages/integrations/maps/contract.ts` – create – MapsAdapter (getStaticMapUrl, getEmbedConfig)
- `packages/integrations/maps/consent.ts` – create – hasMapsConsent for interactive script load
- `packages/integrations/maps/index.ts` – create – Central export
- `packages/integrations/google-maps/src/index.ts` – modify – GoogleMapsAdapter implementation
- `packages/integrations/maps/__tests__/adapters.test.ts` – create – Unit tests

## Code Snippets / Examples

### R-INDUSTRY — JSON-LD schema integration

```typescript
interface StructuredData {
  '@context': 'https://schema.org';
  '@type': 'Organization' | 'Product' | 'Article' | 'LocalBusiness' | 'Service';
  name: string;
  description?: string;
  url?: string;
  image?: string;
  address?: Address;
  contactPoint?: ContactPoint;
}

export function generateStructuredData(data: StructuredData) {
  return JSON.stringify(data);
}
```

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
