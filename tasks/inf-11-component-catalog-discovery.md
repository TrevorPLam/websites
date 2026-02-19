# INF-11 Component Catalog / Discovery

## Metadata

- **Task ID**: inf-11-component-catalog-discovery
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-4, C-7 (Storybook)
- **Downstream Tasks**: Developer discovery

## Context

Docs or tooling to browse components by tag, industry, feature. Searchable props and usage. Generate from JSDoc + schemas. Find and reuse components at scale.

## Dependencies

- **Upstream Task**: 6-4 – component docs
- **Upstream Task**: C-7 – optional (Storybook)

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-4, C-7
- **Downstream**: Component discovery

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Component catalog.
- **[2026-02] Catalog discovery**: Component metadata (family, variant, tags); discovery API; Storybook integration.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).

## Related Files

- `docs/components/` – modify
- Storybook – modify – Tags, search
- Scripts – create – JSDoc/schema extraction
- `docs/` – new – Component catalog page

## Acceptance Criteria

- [ ] Component catalog: searchable, filterable by tag/industry/feature
- [ ] Props documented (from JSDoc or schema)
- [ ] Usage examples per component
- [ ] Links to Storybook when available
- [ ] validate-docs passes

## Technical Constraints

- Can be static docs or generated
- Align with existing docs structure

## Implementation Plan

- [ ] Define catalog structure
- [ ] Extract component metadata (JSDoc, props)
- [ ] Create catalog page or doc
- [ ] Add tags to components
- [ ] Document
- [ ] Integrate with Storybook if present

## Sample code / examples

- **Catalog**: Metadata per component (family, variant, tags); getCatalog() or similar; optional Storybook integration.

## Testing Requirements

- Unit tests for discovery; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; component catalog/discovery — expose catalog for tooling or docs; align with inf-5, validate-*-exports.
- **Potential issues / considerations:** No breaking changes; catalog may drive Storybook or CLI.
- **Verification:** Catalog available; docs updated; `pnpm validate-docs` passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Catalog available
- [ ] Documentation updated
- [ ] validate-docs passes
