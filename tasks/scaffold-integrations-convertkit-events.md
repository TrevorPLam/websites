# scaffold-integrations-convertkit Implement ConvertKit integration package scaffold

## Metadata

- **Task ID**: scaffold-integrations-convertkit
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL.md platform evolution, ROADMAP.md
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: TBD

## Context

`packages/integrations/convertkit/src/index.ts` is scaffolded but not implemented, leaving an incomplete public surface in `packages/integrations/convertkit`. This creates capability gaps and blocks roadmap-aligned adoption.

## Dependencies

- No hard dependency. Must follow workspace architecture boundaries and public export rules.

## Cross-Task Dependencies & Sequencing

- **Parallel**: Other scaffold-\* tasks for unrelated packages.
- **Downstream**: Client capability activation tasks that consume this package.

## Research

- **Date**: 2026-02
- **R-\* topics**: R-ARCHITECTURE, R-TYPE-SAFETY, R-VALIDATION-CHAIN (see `tasks/RESEARCH-INVENTORY.md`).
- **Findings**:
  - Keep package APIs small, typed, and exported only through package barrels.
  - Prefer config-driven enablement (CaCA) over client-specific branching.
  - Add tests for contracts and non-happy paths before wiring into clients.
- **References**: `THEGOAL.md`, `NEW.md`, `docs/architecture/evolution-roadmap.md`.

## Related Files

- `packages/integrations/convertkit/` — implement package internals (modify/create)
- `packages/integrations/convertkit/src/index.ts` — replace scaffold/stub entrypoint (modify)
- `tasks/scaffold-integrations-convertkit-events.md` — implementation contract (this file)

## Acceptance Criteria

- [ ] Scaffold-only implementation is replaced with production-ready module logic.
- [ ] Public exports are explicit and validated with `pnpm validate-exports`.
- [ ] Unit tests cover core behavior and failure paths.
- [ ] Task references and docs are updated for the new implementation surface.

## Technical Constraints

- Use strict TypeScript (no `any`) and maintain current package boundaries.
- No deep imports; use public package exports only.
- Preserve backwards compatibility for existing consumers where applicable.

## Implementation Plan

1. Inspect current scaffold surface and define stable API contracts.
2. Implement internal modules/types and wire `index.ts` exports.
3. Add tests for success + error paths.
4. Run validation chain and update docs/tasks references.

## Sample code / examples

```ts
// packages/integrations/convertkit/src/index.ts
// Example shape only; adapt to final package contract.
export interface CapabilityStatus {
  enabled: boolean;
  provider: string;
}

export function getCapabilityStatus(): CapabilityStatus {
  return { enabled: false, provider: 'none' };
}
```

## Testing Requirements

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`
- `pnpm validate-exports`
- Package-targeted tests (if added): `pnpm --filter <package-name> test`

## Definition of Done

- [ ] Implementation merged with passing quality gates.
- [ ] Tests added/updated and passing locally.
- [ ] Documentation and task links updated.
- [ ] No scaffold-only code remains in targeted entrypoint.
