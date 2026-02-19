# 6.8c Implement validate-site-config

## Metadata

- **Task ID**: 6-8c-implement-validate-site-config
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL tooling
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1, 6.10a (validate-client)
- **Downstream Tasks**: Config validation workflow

## Context

Implement standalone `validate-site-config` (or `pnpm validate-config`) in tooling/validation that validates a site.config.ts file without full client scaffold. Currently a stub. May extend or wrap scripts/validate-client.ts for config-only checks.

## Dependencies

- **Upstream Task**: 5.1 – SiteConfig type exists
- **Upstream Task**: 6.10a – validate-client exists

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1, 6.10a
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Config validation in CI or pre-commit

## Research

- **Primary topics**: [R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod).
- **[2026-02] Zod**: Use SiteConfig schema from @repo/types; validate file at path; report errors; exit 0/1.
- **References**: [RESEARCH-INVENTORY.md – R-CONFIG-VALIDATION](RESEARCH-INVENTORY.md#r-config-validation-config-schema-validation-zod), scripts/validate-client.ts.

## Related Files

- `tooling/validation/src/validate-site-config.ts` – modify – Implementation
- `scripts/validate-client.ts` – reference – May reuse validation logic
- `packages/types/src/site-config.ts` – reference – Zod schema

## Acceptance Criteria

- [ ] `pnpm validate-config clients/x/site.config.ts` validates config
- [ ] Uses SiteConfig Zod schema from @repo/types
- [ ] Reports missing fields, type errors, invalid values
- [ ] Exit 0 on valid, 1 on invalid

## Technical Constraints

- Must work on standalone file path
- Reuse @repo/types schema if possible

## Implementation Plan

- [ ] Implement validate-site-config.ts
- [ ] Add package.json bin/script
- [ ] Wire to root package.json

## Sample code / examples

- **validate-site-config**: Load site.config.ts (or .js), run Zod schema parse; print errors; process.exit(success ? 0 : 1). Reuse logic from scripts/validate-client.ts if it already validates config.

## Testing Requirements

- Run against valid and invalid configs; verify exit codes

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Validates config correctly
- [ ] Documentation updated
