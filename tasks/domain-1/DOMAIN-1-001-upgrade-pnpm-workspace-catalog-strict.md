---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-001
title: 'Upgrade pnpm workspace to catalog-strict mode'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-001-pnpm-catalog-strict
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-1-001 · Upgrade pnpm workspace to catalog-strict mode

## Objective

Upgrade pnpm-workspace.yaml to use catalog-strict mode with complete dependency catalog as specified in section 1.2, ensuring centralized dependency management and version consistency across the monorepo.

---

## Context

**Documentation Reference:**

- Pnpm Workspaces Documentation: `docs/guides/build-monorepo/pnpm-workspaces-documentation.md` ✅ COMPLETED
- Turborepo Documentation: `docs/guides/build-monorepo/turborepo-documentation.md` ✅ COMPLETED
- Turborepo Remote Caching: `docs/guides/build-monorepo/turborepo-remote-caching.md` ✅ COMPLETED
- Pnpm Deploy Documentation: `docs/guides/infrastructure-devops/pnpm-deploy-documentation.md` ✅ COMPLETED
- Pnpm Vs Yarn Vs Npm Benchmarks: `docs/guides/build-monorepo/pnpm-vs-yarn-vs-npm-benchmarks.md` ✅ COMPLETED
- Renovate Configuration Documentation: `docs/guides/best-practices/renovate-configuration-documentation.md` ✅ COMPLETED
- Git Branching Strategies: `docs/guides/best-practices/git-branching-strategies.md` ✅ COMPLETED
- Feature Flags System: `docs/guides/build-monorepo/feature-flags-system.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Root `pnpm-workspace.yaml` — workspace configuration and dependency catalog

**Related files:** `package.json`, `turbo.json`, all package.json files in workspace

**Dependencies:** pnpm v10.x with catalog protocol support

**Prior work:** Basic workspace configuration exists but lacks catalog-strict mode

**Constraints:** Must maintain backward compatibility with existing packages during migration

---

## Tech Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Package Manager  | pnpm v10.29.2+              |
| Node.js          | 22.x LTS                    |
| Catalog Protocol | pnpm catalog-strict mode    |
| Validation       | pnpm audit --catalog-strict |

---

## Acceptance Criteria

- [ ] **[Agent]** `pnpm-workspace.yaml` includes apps/, sites/, packages/, e2e/ directories as specified
- [ ] **[Agent]** `catalog-strict: true` enables strict catalog mode enforcement
- [ ] **[Agent]** Complete catalog with all dependencies from section 1.2 specification
- [ ] **[Agent]** `auto-install-peers: true` and `node-linker: isolated` configured
- [ ] **[Agent]** `engines` constraint ensures Node 22.x and pnpm 10.x minimum versions
- [ ] **[Agent]** `pnpm install --catalog-strict` succeeds without errors
- [ ] **[Agent]** All existing packages continue to build and test successfully
- [ ] **[Human]** Verify catalog prevents installing non-catalog versions

---

## Implementation Plan

- [ ] **[Agent]** **Backup current workspace** — Copy existing `pnpm-workspace.yaml` to `pnpm-workspace.yaml.backup`
- [ ] **[Agent]** **Update workspace globs** — Add apps/, sites/, e2e/ directories following specification
- [ ] **[Agent]** **Enable catalog-strict mode** — Add `catalog-strict: true` and related settings
- [ ] **[Agent]** **Populate complete catalog** — Add all dependencies from section 1.2 with exact versions
- [ ] **[Agent]** **Configure engines** — Add Node 22.x and pnpm 10.x constraints
- [ ] **[Agent]** **Validate configuration** — Run `pnpm install --catalog-strict` and resolve any conflicts
- [ ] **[Agent]** **Test existing packages** — Ensure all packages still build and pass tests
- [ ] **[Human]** **Document migration** — Update any relevant documentation about catalog usage

> ⚠️ **Agent Question**: Ask human before proceeding if any existing packages have dependencies not in the new catalog.

---

## Commands

```bash
# Install dependencies with catalog-strict validation
pnpm install --catalog-strict

# Verify catalog usage across workspace
pnpm audit --catalog-strict

# Test all packages after migration
pnpm -r build
pnpm -r test

# Validate workspace configuration
pnpm list --depth=0
```

---

## Code Style

```yaml
# ✅ Correct — Complete catalog-strict configuration
catalog:
  # Framework (Next.js 16.1 stable)
  next: ^16.1.0
  react: ^19.2.0
  react-dom: ^19.2.0

  # TypeScript
  typescript: ^5.7.2
  '@types/node': ^22.10.0
  '@types/react': ^19.0.0
  '@types/react-dom': ^19.0.0

# Catalog strict mode enforcement
catalog-strict: true
auto-install-peers: true
strict-peer-dependencies: false
node-linker: isolated
```

**Configuration principles:**

- Use semantic version ranges (^) for most dependencies
- Pin exact versions for critical security dependencies
- Group related dependencies with comments
- Maintain alphabetical order within groups

---

## Boundaries

| Tier             | Scope                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify pnpm-workspace.yaml; run pnpm install commands; test package builds; follow catalog structure from specification |
| ⚠️ **Ask first** | Changing existing package.json dependencies; modifying turbo.json cache settings; updating CI/CD workflows              |
| 🚫 **Never**     | Delete node_modules/ manually; modify pnpm-lock.yaml directly; ignore catalog-strict errors; downgrade pnpm version     |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm install --catalog-strict` — zero errors, all dependencies resolve
- [ ] **[Agent]** Run `pnpm audit --catalog-strict` — zero catalog violations
- [ ] **[Agent]** Run `pnpm -r build` — all packages build successfully
- [ ] **[Agent]** Run `pnpm -r test` — all tests pass
- [ ] **[Human]** Attempt to install non-catalog version — verify it fails with proper error
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Catalog conflicts:** Existing packages may have versions not in new catalog — resolve by updating catalog or package.json
- **Peer dependencies:** Some packages may require specific peer dependency configurations
- **Workspace protocol:** Ensure internal dependencies use `workspace:*` protocol correctly
- **Cache invalidation:** Clear pnpm cache if strange resolution issues occur: `pnpm store prune`

---

## Out of Scope

- Individual package.json updates (handled in separate tasks)
- Migration from npm/yarn lock files (already using pnpm)
- CI/CD pipeline updates for catalog-strict mode
- Package-specific dependency version updates

---

## References

- [pnpm Catalog Documentation](https://pnpm.io/workspaces#catalog-protocol)
- [Section 1.2 Complete pnpm Workspace Configuration](docs/plan/domain-1/1.2-complete-pnpm-workspace-configuration.md)
- [pnpm v10.29.2 Release Notes](https://github.com/pnpm/pnpm/releases/tag/v10.29.2)
- Current `pnpm-workspace.yaml` (backup file)
