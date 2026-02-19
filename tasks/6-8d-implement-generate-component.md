# 6.8d Implement generate-component

## Metadata

- **Task ID**: 6-8d-implement-generate-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL tooling, INF-7
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6.4 (docs reference)
- **Downstream Tasks**: Component scaling

## Context

Implement `pnpm generate-component MyComponent --package=marketing` in tooling/generate-component. Scaffolds a new component with correct package structure, index export, props interface, and optionally Storybook story. Currently a stub.

## Dependencies

- **Upstream Task**: Component packages exist (ui, marketing-components)

## Cross-Task Dependencies & Sequencing

- **Upstream**: None required
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Component creation workflow

## Related Files

- `tooling/generate-component/src/index.ts` – modify – Implementation
- `packages/ui/src/components/` – reference – Target structure
- `packages/marketing-components/src/` – reference – Family structure

## Acceptance Criteria

- [ ] `pnpm generate-component HeroNew --package=marketing` creates component in correct family
- [ ] Generates .tsx, index.ts update, props interface
- [ ] Optional --variant for CVA variants
- [ ] Optional --story for Storybook story
- [ ] Component follows project conventions (cn, forwardRef, etc.)

## Technical Constraints

- Match existing component structure (see Button, HeroCentered)
- Update package index.ts barrel

## Implementation Plan

- [ ] Implement generate-component CLI
- [ ] Add templates or codegen for component, export, story
- [ ] Support --package=ui|marketing

## Testing Requirements

- Generate component; verify it builds and exports

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Generator works for ui and marketing-components
- [ ] Documentation updated
