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

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Downstream**: Supply chain security

## Research

- **Primary topics**: THEGOAL [D.8], supply chain security. SBOM, dependency provenance.
- **[2026-02] SBOM**: sbom-generation.yml produces artifact; dependency-integrity.yml checks provenance; docs/security/supply-chain-security.md.
- **References**: [THEGOAL.md](../THEGOAL.md) [D.8], [RESEARCH-INVENTORY.md – R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling).

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

## Sample code / examples

- **Workflows**: Verify .github/workflows/sbom-generation.yml and dependency-integrity.yml; supply-chain-security.md describes artifact and process.

## Testing Requirements

- Run workflows; confirm artifacts; run validate-docs.

## Execution notes

- **Related files — current state:** SBOM/dependency integrity — CI (e.g. quality-audit job) or script; Anchore or similar if already in use.
- **Potential issues / considerations:** Wire to scripts if standalone; document in docs; non-blocking audit per CLAUDE.md.
- **Verification:** SBOM generation runs; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Workflows verified
- [ ] Documentation updated
