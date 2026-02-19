# Security-5: pnpm 10 Supply Chain Hardening

## Metadata

- **Task ID**: security-5-pnpm-supply-chain-hardening
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Supply chain security, dependency management, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: d-8-supply-chain-sbom (enhance)

## Context

pnpm 10 introduces critical security features that prevent supply chain attacks:
1. `allowBuilds` configuration blocks arbitrary build scripts from git-hosted dependencies
2. `blockExoticSubdeps` prevents resolution of untrusted protocols (git+ssh, tarball URLs) in transitive dependencies
3. Integrity hash verification for HTTP tarballs

Current state: pnpm-workspace.yaml lacks these security configurations, leaving the repository vulnerable to supply chain attacks.

This addresses **Research Topic: pnpm 10 Security Features** from gemini1.md and gemini2.md.

## Dependencies

- **Required Packages**: pnpm 10.29.2 (already enforced via packageManager field)
- **Configuration Files**: `pnpm-workspace.yaml`

## Research

- **Primary topics**: [R-PNPM-SECURITY](RESEARCH-INVENTORY.md#r-pnpm-security) (new)
- **[2026-02] Gemini Research**: pnpm 10 security enhancements:
  - `allowBuilds`: Granular permission for build scripts (e.g., `allowBuilds: { "esbuild": true }`)
  - `blockExoticSubdeps`: Prevents resolution of exotic protocols in transitive dependencies
  - `integrityHash`: Auto-calculated for HTTP tarballs to ensure content integrity
- **Threat Model**: Supply chain attacks via compromised git repositories, malicious build scripts, typosquatting
- **References**: 
  - [docs/research/gemini-strategic-architecture-2026.md](../docs/research/gemini-strategic-architecture-2026.md)
  - [docs/research/gemini-production-audit-2026.md](../docs/research/gemini-production-audit-2026.md)

## Related Files

- `pnpm-workspace.yaml` – modify – Add security configurations
- `.github/workflows/ci.yml` – modify – Add pnpm security validation step
- `docs/architecture/security/supply-chain.md` – create – Document pnpm security features

## Acceptance Criteria

- [ ] `pnpm-workspace.yaml` configured with:
  - `allowBuilds` setting (explicit allow-list for trusted packages)
  - `blockExoticSubdeps: true` to prevent exotic protocol resolution
- [ ] CI pipeline validates pnpm security configuration
- [ ] Documentation created: `docs/architecture/security/supply-chain.md`
- [ ] All existing dependencies reviewed for build script requirements
- [ ] Migration guide for adding new dependencies with build scripts

## Technical Constraints

- Must not break existing builds
- Must maintain compatibility with current dependency set
- Configuration must be version-controlled and auditable

## Implementation Plan

### Phase 1: Configuration
- [ ] Review current dependencies for build script usage
- [ ] Configure `allowBuilds` in `pnpm-workspace.yaml`:
  ```yaml
  allowBuilds:
    esbuild: true
    # Add other trusted packages as needed
  ```
- [ ] Enable `blockExoticSubdeps: true`

### Phase 2: Validation
- [ ] Add CI check to validate pnpm security settings
- [ ] Test installation with new configuration
- [ ] Verify no build failures

### Phase 3: Documentation
- [ ] Document security features in `docs/architecture/security/supply-chain.md`
- [ ] Create migration guide for adding dependencies with build scripts
- [ ] Update CLAUDE.md with pnpm security best practices

## Testing

- [ ] Verify `pnpm install` succeeds with new configuration
- [ ] Verify CI pipeline passes with security checks
- [ ] Test adding a new dependency with build scripts (should require allowBuilds entry)

## Notes

- This is a quick win (S effort) that significantly improves supply chain security
- Should be done early in Wave 1 as it prevents future supply chain vulnerabilities
- Complements existing SBOM generation workflow (d-8-supply-chain-sbom)
