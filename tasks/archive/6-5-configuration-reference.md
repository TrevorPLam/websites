# 6.5 Configuration Reference

## Metadata

- **Task ID**: 6-5-configuration-reference
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: Components/features complete
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Storybook or docs/; site.config reference; per-feature guides; ADRs.

## Dependencies

- **Upstream Task**: Components/features complete – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: Components/features complete
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-DOCS**: ADRs, config reference, migration — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-docs) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-DOCS](RESEARCH-INVENTORY.md#r-docs) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- (Add file paths)

## Code Snippets / Examples

### R-DOCS — Architecture Decision Records

```markdown
# ADR-001: Use App Router for Page Templates

## Context

We need to decide between Pages Router and App Router for our page templates.

## Decision

Use App Router with Server Components by default, Client Components only for interactivity.

## Consequences

- Better performance with RSC
- Learning curve for team
- Migration path from existing templates
```

### R-CONFIG-VALIDATION — Zod runtime validation

```typescript
import { z } from 'zod';

const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  description: z.string().optional(),
  logo: z.string().optional(),
  social: z
    .object({
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
});

type SiteConfig = z.infer<typeof siteConfigSchema>;

export function validateSiteConfig(config: unknown): SiteConfig {
  return siteConfigSchema.parse(config);
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

- See [R-DOCS - Research Findings](RESEARCH-INVENTORY.md#r-docs) for additional examples

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
