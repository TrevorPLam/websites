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

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-8d
- **Downstream**: Component scaling

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). CVA variants.
- **[2026-02] generate-component**: --family and --variant flags; output to family folder; CVA pattern; index and Storybook.
- **References**: [RESEARCH-INVENTORY.md – R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), task 6-8d.

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

## Sample code / examples

- **CLI**: Parse --family=hero, --variant=compact; template outputs to packages/marketing-components/src/<family>/; update family index and add .stories.tsx.

## Testing Requirements

- Run generate-component with --family and --variant; verify build and exports.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] CLI works for family and variant
- [ ] Build passes
- [ ] Documentation updated
