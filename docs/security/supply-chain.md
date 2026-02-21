# Supply Chain Security

**Last Updated:** 2026-02-20  
**Purpose:** Document pnpm 10 supply chain security configurations and threat mitigation strategies.

---

## Overview

This repository uses pnpm 10's advanced supply chain security features to protect
against malicious dependencies, build script attacks, and exotic protocol
resolution vulnerabilities.

## Security Configuration

### `allowBuilds`

Controls which packages are permitted to execute build scripts (`install`, `postinstall`, `preinstall`) during `pnpm install`.

**Current Allow-List:**

- `esbuild` — JavaScript bundler used by Next.js and toolchain
- `sharp` — Native image processing; downloads prebuilt libvips bindings
- `unrs-resolver` — Rust-based module resolver used by ESLint/Rollup toolchain
- `@sentry/cli` — Sentry CLI binary download for source map uploads

**Threat Mitigated:** Prevents malicious build scripts from executing arbitrary code during installation.

### `blockExoticSubdeps`

Blocks resolution of exotic protocols (git+ssh, tarball URLs, etc.) in transitive dependencies.

**Threat Mitigated:** Prevents dependency confusion attacks and typosquatting via exotic protocols.

### `onlyBuiltDependencies`

Legacy pnpm security feature (maintained for compatibility). Specifies packages
allowed to execute build scripts, superseded by `allowBuilds` in pnpm 10.

## Threat Model

### Supply Chain Attack Vectors Mitigated

1. **Malicious Build Scripts**
   - Attack: Compromised package executes arbitrary code in postinstall
   - Mitigation: `allowBuilds` require explicit approval per package

2. **Dependency Confusion**
   - Attack: Private package name published to public registry with higher version
   - Mitigation: `blockExoticSubdeps` prevents exotic protocol resolution

3. **Typosquatting**
   - Attack: Malicious package with similar name to legitimate package
   - Mitigation: Combined with `allowBuilds` and integrity verification

4. **Git Repository Compromise**
   - Attack: Malicious code injected into git-based dependencies
   - Mitigation: `blockExoticSubdeps` blocks git+ssh protocols in transitive deps

## Adding New Dependencies

### Dependencies Requiring Build Scripts

When adding a new dependency that requires build scripts:

1. **Security Review**: Assess the package's security posture and maintenance
2. **Add to allowBuilds**: Update `pnpm-workspace.yaml` with justification
3. **PR Review**: Security team must approve the addition
4. **Testing**: Verify installation succeeds with new configuration

### Example PR Description

```markdown
## Add [package-name] to allowBuilds

**Justification**: [Brief explanation of why build script is required]
**Security Review**: [Assessment of package security posture]
**Risk Assessment**: [Low/Medium/High with mitigation strategy]
```

## Monitoring and Validation

### CI Validation

The CI pipeline validates pnpm security configuration:

```yaml
- name: Validate pnpm Security
  run: |
    pnpm install --frozen-lockfile
    pnpm audit --audit-level moderate
```

### Local Validation

```bash
# Test installation with security settings
pnpm install

# Audit for vulnerabilities
pnpm audit

# Verify security configuration
pnpm config list
```

## Incident Response

### Suspicious Dependency Detected

1. **Immediate Action**: Remove dependency from `allowBuilds`
2. **Investigation**: Audit package source and build scripts
3. **Remediation**: Update to safe version or find alternative
4. **Documentation**: Update security incident log

### Supply Chain Compromise

1. **Isolate**: Revert to known-good lockfile
2. **Audit**: Run full dependency audit with `pnpm audit`
3. **Rebuild**: Clean install with verified dependencies
4. **Monitor**: Enhanced monitoring for unusual behavior

## Best Practices

1. **Principle of Least Privilege**: Only add packages to `allowBuilds` when absolutely necessary
2. **Regular Audits**: Review `allowBuilds` list quarterly for necessity
3. **Security Reviews**: Mandatory security review for new build script dependencies
4. **Monitoring**: Continuous monitoring for security advisories
5. **Documentation**: Maintain clear justification for each `allowBuilds` entry

## References

- [pnpm 10 Security Features](https://pnpm.io/security)
- [Supply Chain Security Best Practices](https://snyk.io/blog/secure-software-supply-chain/)
- [Dependency Confusion Attacks](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fecf10)
- [Internal Research](../../archive/research/gemini-production-audit-2026.md)

---

## Maintenance

- **Quarterly Review**: Assess `allowBuilds` necessity
- **Version Updates**: Review pnpm security feature updates
- **Incident Log**: Document security incidents and responses
- **Training**: Team education on supply chain security
