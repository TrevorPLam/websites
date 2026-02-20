# INF-14 Feature Plugin Interface

## Metadata

- **Task ID**: inf-14-feature-plugin-interface
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12), NEW.md Phase 3 (Week 11-13), evol-7
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.x (features)
- **Downstream Tasks**: Custom features

## Context

Define feature module contract: export id, schema, components, sections. Load features by ID from config. Add features as packages without wiring to page-templates.

## Dependencies

- **Upstream Task**: 2.x – features exist

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.x
- **Downstream**: Custom features

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Feature module contract.
- **[2026-02] Feature contract**: id, schema, components, sections; registry by ID; sections auto-register when feature enabled.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva).

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

## Sample code / examples

- **FeatureModule interface**: { id, schema, components, sections }; featureRegistry.get(id); page-templates resolve features from config.

## Testing Requirements

- Unit tests for feature resolution; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; feature plugin interface — extensibility for features; config-driven.
- **Potential issues / considerations:** No breaking changes; plugin contract for features; align with R-INFRA.
- **Verification:** Build passes; tests pass; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
