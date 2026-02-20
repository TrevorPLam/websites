# EVOL-12 Full Platform Convergence

## Metadata

- **Task ID**: evol-12-full-platform-convergence
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: Phase 5 (Weeks 25-26)
- **Related Epics / ADRs**: NEW.md Phase 5, THEGOAL.md
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: evol-9, evol-10, evol-11
- **Downstream Tasks**: None (final phase task)

## Context

Document final architecture; validate legacy + universal coexist; migration path clear. Per NEW.md Weeks 25-26. Primarily documentation and validation task.

## Dependencies

- evol-9 (universal renderer), evol-10 (edge DB), evol-11 (legacy bridge)

## Research

- **Primary topics**: [R-CAPABILITY](RESEARCH-INVENTORY.md#r-capability), THEGOAL.md.
- **[2026-02]** Final architecture: Capability Registry, Data Contracts, Universal Renderer, Edge Storage.
- **References**: NEW.md Weeks 25-26, THEGOAL.md.

## Related Files

- `docs/architecture/evolution-roadmap.md` – update final state
- `THEGOAL.md` – align with achieved architecture
- `docs/architecture/README.md` – update
- `tasks/updates/` – checkpoint status

## Acceptance Criteria

- [ ] Final architecture documented (capability registry, data contracts, universal renderer, edge storage)
- [ ] Legacy + universal coexistence verified
- [ ] Migration path documented (classic → universal)
- [ ] Checkpoint Week 26 complete
- [ ] pnpm lint, type-check, test, build pass
- [ ] THEGOAL.md reflects achieved state

## Technical Constraints

- Validation only; no new code unless gaps found

## Implementation Plan

- [ ] Update evolution-roadmap.md with final state
- [ ] Update THEGOAL.md to reflect achieved architecture
- [ ] Document migration path (classic → universal)
- [ ] Run full validation suite
- [ ] Update tasks/updates/ with checkpoint status
- [ ] Create migration guide if needed

## Sample code / examples

Architecture summary per NEW.md:

```
┌─────────────────────────────────────────┐
│ CAPABILITY REGISTRY                      │
│ BookingCapability | BlogCapability | ... │
├─────────────────────────────────────────┤
│ DATA CONTRACTS (Canonical types, etc.)   │
├─────────────────────────────────────────┤
│ UNIVERSAL RENDERER (new default)         │
├─────────────────────────────────────────┤
│ EDGE STORAGE (opt-in)                    │
└─────────────────────────────────────────┘
```

## Testing Requirements

- Full pipeline: pnpm lint, type-check, test, build; validate-client for all clients.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation complete
- [ ] Platform converged (checkpoint)
