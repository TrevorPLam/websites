# 6.8b Implement pnpm create-client

## Metadata

- **Task ID**: 6-8b-implement-create-client-cli
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL tooling
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1, 6-8a (optional)
- **Downstream Tasks**: Developer workflow

## Context

Implement `pnpm create-client <name> --industry=X` in tooling/create-client. Currently a stub. Should scaffold a new client from starter-template with config overrides.

## Dependencies

- **Upstream Task**: 5.1 – required
- **Upstream Task**: 6-8a – optional (parallel implementation)

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1
- **Parallel Work**: 6-8a (turbo gen)
- **Downstream**: Developer workflow

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding).
- **[2026-02] create-*-app UX**: Commander or similar; `create-client <name> --industry=X`; copy starter-template, set package name and site.config; run validate-client.
- **References**: [RESEARCH-INVENTORY.md – R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `tooling/create-client/src/index.ts` – modify – CLI implementation
- `tooling/create-client/package.json` – modify – Bin entry, scripts
- `clients/starter-template/` – reference – Source template

## Acceptance Criteria

- [ ] `pnpm create-client my-client` creates clients/my-client/
- [ ] Optional `--industry=restaurant` sets site.config industry
- [ ] Copies starter-template; updates package name, site.config id/name
- [ ] New client passes validate-client

## Technical Constraints

- Use commander or similar for CLI
- Follow create-*-style UX (e.g. create-next-app)

## Implementation Plan

- [ ] Implement create-client CLI
- [ ] Add to root package.json scripts or as runnable binary
- [ ] Test end-to-end

## Sample code / examples

- **CLI entry** (tooling/create-client): Parse `name` and `--industry`; copy from clients/starter-template to clients/<name>; update package.json `name` to `@clients/<name>` and site.config.ts `id`/`name`; optionally set industry in config. Run `pnpm validate-client clients/<name>/` after creation.

## Testing Requirements

- Create test client; validate; remove

## Execution notes

- **Related files — current state:** CLI entry (e.g. tooling/create-client or scripts) — to be created or wired. `clients/starter-template/` — exists as copy source. Reuse pattern from 6-8a (copy + transform package.json, site.config.ts).
- **Potential issues / considerations:** Coordinate with 6-8a (Plop vs standalone CLI); run `pnpm validate-client clients/<name>/` after creation; support `--industry` optional flag.
- **Verification:** Create test client, run `pnpm validate-client`, remove test client.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] CLI works end-to-end
- [ ] Documentation updated
