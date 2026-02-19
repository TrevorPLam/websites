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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Presets work
- [ ] Build passes
- [ ] Documentation updated
- [ ] Reduced motion respected
