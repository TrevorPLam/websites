# C.7 Storybook Visual Regression

## Metadata

- **Task ID**: c-7-storybook-visual-regression
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.7]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 6-4 (component docs)
- **Downstream Tasks**: Visual QA

## Context

Set up Storybook and wire visual-regression.yml. THEGOAL [C.7]; visual-regression.yml exists but Storybook may need setup. Storybook for UI and marketing-components; visual regression checks in CI.

## Dependencies

- **Upstream Task**: 6-4 – optional (component docs)

## Cross-Task Dependencies & Sequencing

- **Upstream**: 6-4
- **Downstream**: Visual QA

## Research

- **Primary topics**: [R-VISUAL-REG](RESEARCH-INVENTORY.md#r-visual-reg-visual-regression-testing), [R-TEST](RESEARCH-INVENTORY.md#r-test-jest-axe-core-playwright). THEGOAL [C.7].
- **[2026-02] Storybook 7+**: React 19; visual-regression.yml; Chromatic or static build; key components have stories.
- **References**: [RESEARCH-INVENTORY.md – R-VISUAL-REG](RESEARCH-INVENTORY.md#r-visual-reg-visual-regression-testing), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/ui/` – modify – Add Storybook config
- `packages/marketing-components/` – modify – Add Storybook config
- `.github/workflows/visual-regression.yml` – modify – Wire to Storybook build
- `docs/storybook/` – reference

## Acceptance Criteria

- [ ] Storybook runs for ui and/or marketing-components
- [ ] Key components have stories
- [ ] visual-regression.yml runs Storybook build and comparison (or Chromatic/similar)
- [ ] Document in docs/storybook/

## Technical Constraints

- Storybook 7+ for React 19
- May use Chromatic, Percy, or built-in static build

## Implementation Plan

- [ ] Add Storybook to ui or root
- [ ] Create stories for representative components
- [ ] Wire visual-regression workflow
- [ ] Document

## Sample code / examples

- **Storybook config**: Add to packages/ui and/or marketing-components; stories for Button, Hero; wire .github/workflows/visual-regression.yml to Storybook build.

## Testing Requirements

- Run Storybook; run visual-regression workflow; confirm build.

## Execution notes

- **Related files — current state:** Storybook config and visual regression setup — to be added or extended. Align with R-VISUAL-REG; Chromatic or similar if adopted.
- **Potential issues / considerations:** Storybook for packages/ui and/or marketing-components; baseline capture; CI integration.
- **Verification:** Visual regression runs; build and tests pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Storybook works
- [ ] Visual regression workflow runs
- [ ] Build passes
