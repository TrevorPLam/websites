# UI Complete Remaining Primitives

## Metadata

- **Task ID**: ui-complete-remaining-primitives
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: Phase 1 (ROADMAP Immediate)
- **Related Epics / ADRs**: ROADMAP Phase 1 "Complete UI Component Library", THEGOAL 14 primitives
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-2 (CVA + tokens)
- **Downstream Tasks**: evol-3, page templates

## Context

ROADMAP states "9 of 14 primitives complete" and lists "Finish remaining 5 UI primitives" as Phase 1 Immediate priority. evol-2 covers CVA and the token system, not the net-new primitives. This task implements the remaining UI primitives per THEGOAL: ProgressStepper, StepConfidenceHint (E.6), motion/ primitives (C.6), and feedback/ (loading-patterns, recovery-states — E.1, F.12). Also resolve Toast component type errors if still present and add accessibility tests.

## Dependencies

- **Upstream Task**: evol-2 (tokens) — recommended before or in parallel
- **Related**: inf-13 (animation/motion presets), RESEARCH-INVENTORY E.6, C.6

## Cross-Task Dependencies & Sequencing

- **Upstream**: evol-2
- **Downstream**: evol-3 (registry hardening), page-templates (section composition)

## Research

- **Primary topics**: [R-MOTION](RESEARCH-INVENTORY.md), [R-INFRA](RESEARCH-INVENTORY.md). THEGOAL § UI primitives; E.6 progressive conversion; C.6 motion; E.1/F.12 feedback.
- **[2026-02]** ProgressStepper, StepConfidenceHint for multi-step forms; motion primitives (entrance, emphasis, page transition); loading-patterns and recovery-states for latency-band and trust recovery.
- **References**: [THEGOAL.md](../THEGOAL.md), [ROADMAP.md](../ROADMAP.md), [packages/ui/src/components/](../packages/ui/src/components/).

## Related Files

- `packages/ui/src/components/ProgressStepper.tsx` – create
- `packages/ui/src/components/StepConfidenceHint.tsx` – create
- `packages/ui/src/motion/primitives.ts` – create
- `packages/ui/src/motion/presets.ts` – create
- `packages/ui/src/feedback/loading-patterns.ts` – create
- `packages/ui/src/feedback/recovery-states.ts` – create
- `packages/ui/src/components/Toast.tsx` – modify (fix type errors if present)
- `packages/ui/src/index.ts` – modify – Export new primitives

## Acceptance Criteria

- [ ] ProgressStepper and StepConfidenceHint implemented (E.6 progressive conversion)
- [ ] motion/ primitives and presets implemented (C.6; align with inf-13)
- [ ] feedback/ loading-patterns and recovery-states implemented (E.1, F.12)
- [ ] Toast type errors resolved (if still present)
- [ ] All new components exported from @repo/ui
- [ ] Accessibility tests added for new primitives
- [ ] `pnpm type-check` and `pnpm test` pass

## Technical Constraints

- Use @repo/ui patterns (Radix where applicable, CVA, cn from @repo/utils)
- Respect prefers-reduced-motion for motion primitives
- No breaking changes to existing component APIs

## Implementation Plan

- [ ] Add ProgressStepper and StepConfidenceHint (multi-step form UX)
- [ ] Add motion/ (primitives.ts, presets.ts) with entrance/emphasis helpers
- [ ] Add feedback/ (loading-patterns.ts, recovery-states.ts)
- [ ] Fix Toast types if needed
- [ ] Export from packages/ui/src/index.ts
- [ ] Add a11y tests (jest-axe, @testing-library/react)

## Testing Requirements

- Unit tests for new components; a11y tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm --filter @repo/ui build`

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] 14 primitives complete per ROADMAP
