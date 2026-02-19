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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
