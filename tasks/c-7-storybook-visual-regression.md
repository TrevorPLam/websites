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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Storybook works
- [ ] Visual regression workflow runs
- [ ] Build passes
