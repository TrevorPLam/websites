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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
