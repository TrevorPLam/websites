# 6.8a Implement turbo gen new-client (Plop)

## Metadata

- **Task ID**: 6-8a-turbo-gen-new-client
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [5.1], CLI tooling
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1, 6.3
- **Downstream Tasks**: create-client, developer workflow

## Context

Implement Plop-based scaffolding so `turbo gen new-client` (or equivalent) creates a new client by copying starter-template and prompting for name, industry, etc. Currently turbo/generators/config.ts is a stub.

## Dependencies

- **Upstream Task**: 5.1 – required – starter-template exists
- **Upstream Task**: 6.3 – templates/ removed

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1, 6.3
- **Parallel Work**: 6-8b (create-client)
- **Downstream**: Golden path for new clients

## Related Files

- `turbo/generators/config.ts` – modify – Plop config
- `turbo.json` – modify – Wire gen command if needed
- `clients/starter-template/` – reference – Source template

## Acceptance Criteria

- [ ] `turbo gen new-client` (or `pnpm gen new-client`) runs interactively
- [ ] Prompts for client name, industry (optional)
- [ ] Creates clients/<name>/ by copying starter-template
- [ ] Updates package.json name to @clients/<name>
- [ ] Updates site.config.ts id and name
- [ ] New client passes validate-client

## Technical Constraints

- Use Plop or similar; integrate with Turbo/pnpm
- No hardcoded industry logic; config-driven

## Implementation Plan

- [ ] Implement Plop config for new-client generator
- [ ] Wire to pnpm/turbo
- [ ] Test with sample client creation

## Testing Requirements

- Create a test client; run `pnpm validate-client clients/<test>/`; delete test client

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Generator works end-to-end
- [ ] Documentation updated
