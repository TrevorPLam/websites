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

## Testing Requirements

- Create test client; validate; remove

## Definition of Done

- [ ] Code reviewed and approved
- [ ] CLI works end-to-end
- [ ] Documentation updated
