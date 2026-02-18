# 5.5 Sunrise-Dental

## Metadata

- **Task ID**: 5-5-sunrise-dental
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Copy starter-template → clients/<name>. Edit site.config.ts only. Industry, conversionFlow, layout options.

## Dependencies

- **Upstream Task**: 5.1 – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-INDUSTRY**: JSON-LD, industry patterns — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-industry) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- (Add file paths)

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

### R-CONFIG-VALIDATION — Zod runtime validation
```typescript
import { z } from 'zod';

const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  description: z.string().optional(),
  logo: z.string().optional(),
  social: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

type SiteConfig = z.infer<typeof siteConfigSchema>;

export function validateSiteConfig(config: unknown): SiteConfig {
  return siteConfigSchema.parse(config);
}
```

### R-MIGRATION — Template-to-client migration
```typescript
interface MigrationPlan {
  sourceTemplate: string;
  targetClient: string;
  components: ComponentMapping[];
  routes: RouteMapping[];
  config: ConfigMapping[];
}

interface ComponentMapping {
  source: string;
  target: string;
  type: 'server' | 'client' | 'shared';
}

export function executeMigration(plan: MigrationPlan) {
  // Migration execution logic
}
```

### Related Patterns
- See [R-INDUSTRY - Research Findings](RESEARCH-INVENTORY.md#r-industry) for additional examples

## Acceptance Criteria

- [ ] Copy; edit site.config (industry, features); validate-client; build; smoke.
- [ ] Client builds
- [ ] config-driven
- [ ] no custom components.

## Technical Constraints

- No custom components
- config only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Copy; edit site.config (industry, features); validate-client; build; smoke.

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

