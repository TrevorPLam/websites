# INF-7 generate-component with --family and --variant

## Metadata

- **Task ID**: inf-7-generate-component-family-variant
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12), 6-8d
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-8d (generate-component)
- **Downstream Tasks**: Component scaling

## Context

Extend generate-component CLI to support --family (marketing component family) and --variant. Scaffolds new marketing component family + variants. Outputs to correct package with index export, Storybook story, props schema.

## Dependencies

- **Upstream Task**: 6-8d – generate-component base

## Related Files

- `tooling/generate-component/src/index.ts` – modify
- `packages/marketing-components/` – reference

## Acceptance Criteria

- [ ] pnpm generate-component HeroNew --package=marketing --family=hero
- [ ] pnpm generate-component --family=events EventCard --variant=compact
- [ ] Generates: component file, family index, Storybook story, props
- [ ] Follows project conventions
- [ ] Document in create-component tutorial

## Technical Constraints

- Family must exist or be created
- Variant uses CVA pattern

## Implementation Plan

- [ ] Add --family, --variant flags
- [ ] Update templates for family structure
- [ ] Ensure index.ts barrel updated
- [ ] Add Storybook story template
- [ ] Document
- [ ] Test

## Definition of Done

- [ ] Code reviewed and approved
- [ ] CLI works for family and variant
- [ ] Build passes
- [ ] Documentation updated
