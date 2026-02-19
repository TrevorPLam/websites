# INF-2 Component Variant Schema

## Metadata

- **Task ID**: inf-2-component-variant-schema
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: INF-5, INF-7

## Context

Extend SiteConfig so features accept arbitrary variant strings (not just 'centered' | 'split'). E.g. hero: 'custom-branded' resolves or falls back to default. Enables infinite layout variants per component family.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: INF-5, INF-7

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture). CVA variants.
- **[2026-02] Variant schema**: features.hero (and similar) accept string or union; resolveVariant(id, value) with fallback to default; backward compatible.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), packages/types/src/site-config.ts.

## Advanced Code Pattern Expectations (2026-02-19)

From [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](../docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md) and [TODO.md](../TODO.md):

- **Wave 1 (CVA for Button)**: Migrate `@repo/ui` Button from manual variants to CVA (`cva()`, `variant`, `compoundVariants`); keeps API backward compatible.
- **Batch migration**: Hero, Card, Section components follow in Wave 2; avoid big-bang migration.

## Related Files

- `packages/types/src/site-config.ts` – modify – features schema
- `packages/page-templates/src/registry.ts` – modify – Variant resolution
- `packages/page-templates/src/sections/*.tsx` – modify – Fallback logic

## Acceptance Criteria

- [ ] features.hero (and similar) accept string | predefined union
- [ ] Unknown variant falls back to default (e.g. 'split')
- [ ] Variant resolution is documented
- [ ] No breaking change to existing clients

## Technical Constraints

- Backward compatible: existing variant values still work
- Fallback chain: custom → default

## Implementation Plan

- [ ] Extend features schema with flexible variant type
- [ ] Add resolveVariant(id, value) or similar
- [ ] Update section adapters to use resolution
- [ ] Document
- [ ] Add tests

## Sample code / examples

- **SiteConfig features**: Extend with flexible variant (e.g. `hero?: string`); resolveVariant('hero', config.features?.hero) returns resolved variant or default ('split'). Section adapters use resolution.

## Testing Requirements

- Unit tests for resolveVariant; build and test pass.

## Execution notes

- **Related files — current state:** See task Related Files; component variant schema — types or runtime schema; CVA or similar if adopted.
- **Potential issues / considerations:** No breaking changes; align with R-INFRA, existing variant patterns in @repo/ui.
- **Verification:** Build passes; tests pass; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
