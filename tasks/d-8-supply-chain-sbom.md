# D.8 Supply Chain (SBOM, Dependency Integrity)

## Metadata

- **Task ID**: d-8-supply-chain-sbom
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [D.8]
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Supply chain security

## Context

Verify sbom-generation.yml and dependency-integrity.yml are effective. Document in docs/security/supply-chain-security.md. THEGOAL [D.8]. SBOM and dependency provenance as release artifacts.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Related Files

- `.github/workflows/sbom-generation.yml` – verify
- `.github/workflows/dependency-integrity.yml` – verify
- `docs/security/supply-chain-security.md` – create or update

## Acceptance Criteria

- [ ] sbom-generation produces SBOM artifact
- [ ] dependency-integrity checks provenance
- [ ] supply-chain-security.md documents process
- [ ] Workflows run on release or scheduled

## Implementation Plan

- [ ] Verify workflows exist and run
- [ ] Create/update supply-chain-security.md
- [ ] Document artifact usage
- [ ] Fix any workflow issues

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Workflows verified
- [ ] Documentation updated
