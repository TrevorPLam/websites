# INF-14 Feature Plugin Interface

## Metadata

- **Task ID**: inf-14-feature-plugin-interface
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.x (features)
- **Downstream Tasks**: Custom features

## Context

Define feature module contract: export id, schema, components, sections. Load features by ID from config. Add features as packages without wiring to page-templates.

## Dependencies

- **Upstream Task**: 2.x – features exist

## Related Files

- `packages/features/src/` – modify – Feature contract
- `packages/page-templates/` – modify – Feature resolution
- `packages/types/` – modify – Feature schema
- New feature packages – create – Follow contract

## Acceptance Criteria

- [ ] Feature contract: id, schema, components, sections
- [ ] Feature registry: load by ID from config
- [ ] New feature package can register without editing page-templates
- [ ] Sections from feature auto-register when feature enabled
- [ ] Document how to add new feature package

## Technical Constraints

- Contract as TypeScript interface
- Discovery: package exports or config

## Implementation Plan

- [ ] Define FeatureModule interface
- [ ] Create feature registry
- [ ] Update page-templates to resolve features
- [ ] Migrate existing features to contract (optional)
- [ ] Document
- [ ] Add tests

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
