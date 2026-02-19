# INF-6 Block / Content Type Registry

## Metadata

- **Task ID**: inf-6-block-content-type-registry
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C-10 (content)
- **Downstream Tasks**: Blog, static pages

## Context

Content blocks as first-class config: define block types (text, image, video, CTA, etc.) and compose pages from block sequences. Extend BlogPost and static pages. Infinite content format combinations.

## Dependencies

- **Upstream Task**: C-10 – optional (content adapters)

## Cross-Task Dependencies & Sequencing

- **Upstream**: C-10
- **Downstream**: Blog, static pages

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-CMS](RESEARCH-INVENTORY.md#r-cms-content-adapters-mdx-pagination). Block composition.
- **[2026-02] Block registry**: Block type schema (type, props, children); registry; renderer by type; integrate with BlogPost and page templates.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).

## Related Files

- `packages/features/src/content/` – modify – Block types
- `packages/page-templates/` – modify – Block composition
- `packages/types/` – modify – Block schema
- `packages/marketing-components/` – reference – Block renderers

## Acceptance Criteria

- [ ] Block type registry: text, image, video, CTA, etc.
- [ ] Page content defined as block sequence in config or CMS
- [ ] Block renderer resolves by type
- [ ] BlogPost and static pages can use block composition
- [ ] Document block types and composition

## Technical Constraints

- Block schema: type, props, children (optional)
- Renderers from marketing-components or features

## Implementation Plan

- [ ] Define block type schema
- [ ] Create block registry
- [ ] Implement block renderer
- [ ] Integrate with BlogPost, page templates
- [ ] Document
- [ ] Add tests

## Sample code / examples

- **Block schema**: `{ type: 'text'|'image'|'video'|'cta', props: object, children?: Block[] }`. Registry maps type to renderer; page template iterates block sequence.

## Testing Requirements

- Unit tests for block resolution; build pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
