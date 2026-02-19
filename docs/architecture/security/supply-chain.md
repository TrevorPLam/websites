<!--
/**
 * @file docs/architecture/security/supply-chain.md
 * @role docs
 * @summary pnpm supply chain security policy — install script allow-list and dependency hygiene.
 *
 * @entrypoints
 * - Security review and onboarding for engineers adding new dependencies
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - pnpm-workspace.yaml (onlyBuiltDependencies)
 * - .github/workflows/ci.yml (pnpm audit)
 *
 * @used_by
 * - Engineers adding dependencies that require install scripts
 * - Security auditors reviewing the dependency graph
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: pnpm-workspace.yaml, pnpm-lock.yaml
 * - outputs: auditable supply chain policy
 *
 * @invariants
 * - onlyBuiltDependencies in pnpm-workspace.yaml must be reviewed before any addition
 * - All entries must have a documented rationale in this file
 *
 * @gotchas
 * - pnpm v10 silently skips install scripts for packages NOT in onlyBuiltDependencies
 * - Removing a package from the allow-list may break native modules silently
 *
 * @issues
 * - None known; policy is active and enforced
 *
 * @opportunities
 * - Automate allow-list audit in CI via pnpm audit --json
 * - Add SBOM generation step to track install-script packages over time
 *
 * @verification
 * - ✅ Verified: pnpm install succeeds with onlyBuiltDependencies configured
 * - ✅ Verified: sharp and unrs-resolver are the only packages requiring install scripts
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Supply Chain Security Policy

**Task:** security-5 | **Updated:** 2026-02-19

This document defines the pnpm supply chain security configuration for the marketing-websites monorepo.

---

## Overview

Supply chain attacks via compromised npm packages are a growing threat. pnpm 10 provides
a first-class mechanism to restrict which packages may run lifecycle scripts (`install`,
`postinstall`, `preinstall`) during `pnpm install`. This eliminates a common attack vector
where a malicious package runs arbitrary code at install time.

---

## Configuration

### `onlyBuiltDependencies` (pnpm-workspace.yaml)

Only packages listed here are allowed to run lifecycle scripts. All other packages that
declare `install`, `postinstall`, or `preinstall` scripts have those scripts silently
skipped during installation.

**Current allow-list:**

| Package         | Script        | Rationale                                                                                                                                                                          |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sharp`         | `install`     | High-performance image processing. Requires native bindings (libvips via node-gyp). Without the install script, sharp falls back to pure-JS (10× slower) or fails entirely.        |
| `unrs-resolver` | `postinstall` | Rust-based module resolver used by ESLint/Rollup toolchain. Postinstall downloads the correct prebuilt binary for the current platform. Without it, the package is non-functional. |

> **Note:** `prepare` scripts (used by many packages for TypeScript compilation) do NOT
> run during `npm install` / `pnpm install` from a registry — they only run for
> git-sourced dependencies. These are not a supply chain concern for registry packages.

---

## Adding a New Package with Install Scripts

When adding a dependency that requires a lifecycle script:

1. **Audit the script**: Read `node_modules/<package>/package.json` `scripts.postinstall`
   and verify it only does what it claims (download prebuilt binary, compile native addon, etc.).
2. **Check the source**: Confirm the package is a reputable, widely-used library with an
   active maintainer and recent audit history.
3. **Add to allow-list**: Add the package name to `onlyBuiltDependencies` in
   `pnpm-workspace.yaml` with a comment explaining the rationale.
4. **Document here**: Add a row to the table above with package name, script type, and rationale.
5. **Verify**: Run `pnpm install` and confirm the build succeeds without errors.

---

## Dependency Vulnerability Scanning

The CI pipeline runs `pnpm audit` as a non-blocking quality audit step (see
`.github/workflows/ci.yml` → `quality-audit` job). This checks for known CVEs in the
dependency graph using the npm advisory database.

To run locally:

```bash
pnpm audit                   # Check for vulnerabilities
pnpm audit --fix             # Auto-fix where possible (upgrades)
pnpm audit --audit-level=high  # Fail only on high/critical
```

---

## Threat Model

| Threat                                        | Mitigation                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| Malicious postinstall in transitive dep       | `onlyBuiltDependencies` allow-list blocks script execution               |
| Typosquatting (e.g. `lодash`)                 | `syncpack:check` catches version drift; review all `pnpm add` commands   |
| Compromised package version                   | `pnpm-lock.yaml` pins exact versions + integrity hashes; reviewed in PRs |
| Git-sourced dependency with malicious prepare | pnpm runs `prepare` for git deps; avoid git: protocol in dependencies    |
| Unpinned `*` version ranges                   | Version catalog in `pnpm-workspace.yaml` enforces catalog: entries       |

---

## Related

- `pnpm-workspace.yaml` — `onlyBuiltDependencies` allow-list
- `.github/workflows/ci.yml` — `pnpm audit` in quality-audit job
- `docs/architecture/module-boundaries.md` — Dependency direction rules
- [pnpm docs: onlyBuiltDependencies](https://pnpm.io/package_json#pnpmonly-built-dependencies)
