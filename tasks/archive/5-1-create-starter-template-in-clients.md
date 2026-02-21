# 5.1 Create Starter-Template in clients/

## Metadata

- **Task ID**: 5-1-create-starter-template-in-clients
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 3.1, 3.2, 3.3, 3.5, 3.8
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Thin Next.js shell. Routes: home, about, services, contact, blog, book. site.config.ts ONLY file client changes. L3.

## Dependencies

- **Upstream Task**: 3.1 – required – prerequisite
- **Upstream Task**: 3.2 – required – prerequisite
- **Upstream Task**: 3.3 – required – prerequisite
- **Upstream Task**: 3.5 – required – prerequisite
- **Upstream Task**: 3.8 – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 3.1, 3.2, 3.3, 3.5, 3.8
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-INDUSTRY**: JSON-LD, industry patterns — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-industry) for full research findings.
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CONFIG-VALIDATION**: Config schema validation, Zod — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-config-validation) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-INDUSTRY](RESEARCH-INVENTORY.md#r-industry) — Full research findings
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `clients/starter-template/` – modify – (see task objective)
- `app/layout.tsx` – modify – (see task objective)
- `app/page.tsx` – modify – (see task objective)
- `app/about/page.tsx` – modify – (see task objective)
- `site.config.ts` – modify – (see task objective)
- `api/health/route.ts` – modify – (see task objective)

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

### R-NEXT — App Router and Server Components

```typescript
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Server Component by default
export default async function Page({ params }: { params: { slug: string } }) {
  const data = await fetchData(params.slug);

  if (!data) {
    notFound();
  }

  return React.createElement(
    Suspense,
    { fallback: React.createElement('div', {}, 'Loading...') },
    React.createElement(PageContent, { data })
  );
}

// Client Component for interactivity
('use client');

export function InteractiveComponent() {
  const [state, setState] = React.useState(null);

  return React.createElement('div', {}, 'interactive content');
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
- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CONFIG-VALIDATION - Research Findings](RESEARCH-INVENTORY.md#r-config-validation) for additional examples

## Acceptance Criteria

- [ ] 5.1a layout (ThemeInjector, providers); 5.1b routes; 5.1c site.config + README; api/health; validate-client when 6.10a exists.
- [ ] Builds
- [ ] all routes render
- [ ] siteConfig-only customization.

## Technical Constraints

- No CMS
- no custom API beyond health/OG
- config drives all.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] 5.1a layout (ThemeInjector, providers); 5.1b routes; 5.1c site.config + README; api/health; validate-client when 6.10a exists.

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
