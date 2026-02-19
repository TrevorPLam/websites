# D.6 a11y Release Gate

## Metadata

- **Task ID**: d-6-a11y-release-gate
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [D.6]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 0-1 (a11y rubric)
- **Downstream Tasks**: Release process

## Context

Implement or document a11y release gate per docs/accessibility/release-a11y-gate.md. Ensures accessibility checks run before release. May integrate axe-core, jest-axe, or Lighthouse a11y.

## Dependencies

- **Upstream Task**: 0-1 – a11y rubric (optional)
- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 0-1 (optional)
- **Downstream**: Release process

## Research

- **Primary topics**: [R-A11Y](RESEARCH-INVENTORY.md#r-a11y-wcag-22-aa-aria-touch-targets-keyboard).
- **[2026-02] a11y gate**: release-a11y-gate.md defines criteria; axe-core/jest-axe or Lighthouse; runnable in release/PR; document CI integration.
- **References**: [RESEARCH-INVENTORY.md – R-A11Y](RESEARCH-INVENTORY.md#r-a11y-wcag-22-aa-aria-touch-targets-keyboard), [THEGOAL.md](../THEGOAL.md) [D.6].

## Related Files

- `docs/accessibility/release-a11y-gate.md` – create or update
- CI workflow – modify – Add a11y check (optional)
- Component tests – reference – jest-axe usage

## Acceptance Criteria

- [ ] release-a11y-gate.md defines gate criteria
- [ ] Gate includes: axe-core/jest-axe on components, or Lighthouse a11y
- [ ] Runnable as part of release or PR process
- [ ] Document integration with CI

## Implementation Plan

- [ ] Create/update release-a11y-gate.md
- [ ] Define gate steps (which checks, thresholds)
- [ ] Wire to CI or release workflow (optional)
- [ ] Document

## Sample code / examples

- **release-a11y-gate.md**: Sections for gate criteria, tools (jest-axe, Lighthouse), thresholds, and CI/release wiring.

## Testing Requirements

- Run validate-docs; optionally run a11y checks per doc.

## Execution notes

- **Related files — current state:** a11y release gate — CI step or script; axe-core, WCAG 2.2 AA; reference docs/accessibility where present.
- **Potential issues / considerations:** Gate can block release on a11y failures; document in CI and docs.
- **Verification:** Gate runs in CI or locally; build passes.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Gate documented
- [ ] Integration defined
