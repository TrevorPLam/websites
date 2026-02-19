# INF-13 Animation / Motion Presets

## Metadata

- **Task ID**: inf-13-animation-motion-presets
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12), THEGOAL C.6
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Motion consistency

## Context

Named motion presets (fadeIn, slideUp, stagger) as config. Components reference by ID. Infinite motion variants. Aligns with THEGOAL [C.6] motion primitives.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Motion consistency

## Research

- **Primary topics**: [R-MOTION](RESEARCH-INVENTORY.md#r-motion-animation-motion-primitives), [R-A11Y](RESEARCH-INVENTORY.md#r-a11y-wcag-22-aa-aria-touch-targets-keyboard). THEGOAL C.6.
- **[2026-02] Motion presets**: fadeIn, slideUp, stagger; duration, easing; motion="fadeIn"; prefers-reduced-motion.
- **References**: [RESEARCH-INVENTORY.md – R-MOTION](RESEARCH-INVENTORY.md#r-motion-animation-motion-primitives).

## Related Files

- `packages/ui/src/motion/` – create or modify
- `packages/config/tokens/` – modify – Motion presets
- `packages/types/src/site-config.ts` – modify – Optional motion config

## Acceptance Criteria

- [ ] Motion preset registry: fadeIn, slideUp, stagger, etc.
- [ ] Presets define: duration, easing, variants
- [ ] Components use preset by ID (e.g. motion="fadeIn")
- [ ] Respect prefers-reduced-motion
- [ ] Document in docs/design/motion-guidelines.md

## Technical Constraints

- CSS or Framer Motion
- Reduced motion: disable or simplify

## Implementation Plan

- [ ] Create motion presets (CSS vars or JS config)
- [ ] Add preset resolution
- [ ] Update motion primitives to use presets
- [ ] Document
- [ ] Add tests or manual verification

## Sample code / examples

- **packages/ui/src/motion/presets.ts**: Named presets (fadeIn, slideUp); component uses motion="fadeIn"; guard for prefers-reduced-motion.

## Testing Requirements

- Manual or unit tests; build pass.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Presets work
- [ ] Build passes
- [ ] Documentation updated
- [ ] Reduced motion respected
