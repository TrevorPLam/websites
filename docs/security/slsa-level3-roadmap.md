# SLSA Level 3 Roadmap

This roadmap tracks the controls needed to reach and sustain SLSA Build Level 3 across CI pipelines.

## Current baseline

- Security scanning and SARIF publication for SAST, SCA, DAST, and IaC.
- SBOM generation and keyless signing for SPDX and CycloneDX artifacts.
- Container signing workflow with build provenance attestation.
- Release-oriented provenance workflow (`.github/workflows/slsa-level3-provenance.yml`).

## Remaining work to satisfy Level 3

1. **Centralize trusted builders**
   - Move all release builds to a hardened reusable workflow.
   - Restrict workflows to protected branches and reviewed changes.
2. **Enforce non-falsifiable provenance**
   - Require attestation verification in deploy gates.
   - Store attestations in immutable registry/object storage.
3. **Two-person reviewed workflow changes**
   - Enable CODEOWNERS + branch protection requirement for `.github/workflows/**`.
4. **Hermetic build posture improvements**
   - Eliminate opportunistic network calls in build jobs.
   - Pin action SHAs for provenance-sensitive workflows.

## Verification cadence

- Weekly check of attestation generation success rates.
- Monthly review of branch protection and workflow protection posture.
- Quarterly tabletop exercise validating rollback from attestation failure.
