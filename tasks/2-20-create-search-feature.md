# 2.20 Create Search Feature

## Metadata

- **Task ID**: 2-20-create-search-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11, 2.25
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Search feature with 5+ implementation patterns, AI-powered search, and semantic search.

**Implementation Patterns:** Config-Based, API-Based, CMS-Based, AI-Powered, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Upstream Task**: 2.25 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11, 2.25
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.
- **[2026-02-18] R-AI**: AI Platform: LLM gateway, content engine, agents — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-ai) for full research findings.
- **[2026-02-18] R-SEARCH-AI**: AI semantic search, vector embeddings, RAG — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-search-ai) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH-INVENTORY.md - R-AI](RESEARCH-INVENTORY.md#r-ai) — Full research findings
- [RESEARCH-INVENTORY.md - R-SEARCH-AI](RESEARCH-INVENTORY.md#r-search-ai) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/features/src/search/index` – create – (see task objective)
- `packages/features/src/search/lib/schema` – create – (see task objective)
- `packages/features/src/search/lib/adapters` – create – (see task objective)
- `packages/features/src/search/lib/search-config.ts` – create – (see task objective)
- `packages/features/src/search/lib/ai-search.ts` – create – (see task objective)
- `packages/features/src/search/lib/semantic-search.ts` – create – (see task objective)
- `packages/features/src/search/components/SearchSection.tsx` – create – (see task objective)
- `packages/features/src/search/components/SearchConfig.tsx` – create – (see task objective)
- `packages/features/src/search/components/SearchAPI.tsx` – create – (see task objective)
- `packages/features/src/search/components/SearchCMS.tsx` – create – (see task objective)
- `packages/features/src/search/components/SearchAI.tsx` – create – (see task objective)
- `packages/features/src/search/components/SearchHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

### R-SEARCH-AI — Semantic search integration
```typescript
interface SearchConfig {
  apiKey: string;
  endpoint: string;
  embeddingModel: string;
  rerank?: boolean;
}

export function useSemanticSearch(query: string, config: SearchConfig) {
  // Semantic search implementation
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
- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CMS - Research Findings](RESEARCH-INVENTORY.md#r-cms) for additional examples
- See [R-AI - Research Findings](RESEARCH-INVENTORY.md#r-ai) for additional examples
- See [R-SEARCH-AI - Research Findings](RESEARCH-INVENTORY.md#r-search-ai) for additional examples

## Acceptance Criteria

- [ ] Schema; adapters; AI integration; semantic search; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] AI search functional
- [ ] semantic search works.

## Technical Constraints

- No custom AI models
- use existing APIs.

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

