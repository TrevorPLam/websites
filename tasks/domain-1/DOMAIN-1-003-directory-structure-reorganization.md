---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-003
title: 'Reorganize directory structure to match domain-1 specification'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: refactor # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-003-directory-restructure
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*) Bash(mv:*)
---

# DOMAIN-1-003 · Reorganize directory structure to match domain-1 specification

## Objective

Reorganize the monorepo directory structure to match the domain-1 specification, creating the proper `apps/`, `sites/`, `packages/`, and `e2e/` directory layout that scales to 1000+ client sites while maintaining existing functionality.

## Context

**Current State Analysis:**

- Repository uses mixed directory structure (`clients/`, `packages/`, `tooling/`)
- Missing `apps/` directory for main applications
- Missing `sites/` directory for client-specific configurations
- Missing `e2e/` directory for end-to-end tests
- `packages/` structure doesn't match Feature-Sliced Design pattern
- Missing proper separation between apps, packages, and client sites

**Codebase area:** Root directory structure and package organization
**Related files:** All package directories, workspace configuration files
**Dependencies:** pnpm-workspace.yaml, turbo.json, all package.json files
**Prior work:** Basic monorepo structure exists but doesn't match spec
**Constraints:** Must preserve existing package functionality during reorganization

**2026 Standards Compliance:**

- Feature-Sliced Design (FSD) architecture for packages
- Clear separation: apps/ (applications), sites/ (configs), packages/ (shared)
- Scalable to 1000+ client sites without configuration changes
- AGENTS.md files in each package for AI context
- Proper workspace globs for new directory structure

## Tech Stack

| Layer               | Technology                     |
| ------------------- | ------------------------------ |
| Architecture        | Feature-Sliced Design (FSD)    |
| Directory Structure | apps/, sites/, packages/, e2e/ |
| Package Management  | pnpm workspaces                |
| AI Context          | AGENTS.md files (40-60 lines)  |
| Scaling             | Supports 1000+ client sites    |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Create `apps/` directory with `web/`, `admin/`, `portal/` applications
- [ ] **[Agent]** Create `sites/` directory structure for client-specific configurations
- [ ] **[Agent]** Reorganize `packages/` to follow Feature-Sliced Design pattern
- [ ] **[Agent]** Create `e2e/` directory with proper test structure
- [ ] **[Agent]** Update `pnpm-workspace.yaml` to reflect new directory globs
- [ ] **[Agent]** Migrate existing packages to appropriate new locations
- [ ] **[Agent]** Create AGENTS.md files in all packages (40-60 lines)
- [ ] **[Human]** All build workflows continue to function after reorganization
- [ ] **[Agent]** Documentation updated with new directory structure

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Create new directory structure** - Set up `apps/`, `sites/`, `e2e/` directories
- [ ] **[Agent]** **Organize applications** - Create `apps/web`, `apps/admin`, `apps/portal` structure
- [ ] **[Agent]** **Reorganize packages** - Migrate to FSD pattern with proper subdirectories
- [ ] **[Agent]** **Set up sites directory** - Create structure for 1000+ client sites
- [ ] **[Agent]** **Configure e2e tests** - Move/create end-to-end test structure
- [ ] **[Agent]** **Update workspace configuration** - Modify pnpm-workspace.yaml globs
- [ ] **[Agent]** **Migrate existing code** - Move packages to appropriate new locations
- [ ] **[Agent]** **Create AGENTS.md files** - Add AI context files to all packages
- [ ] **[Agent]** **Test all workflows** - Verify build, test, and dev commands work
- [ ] **[Human]** **Update documentation** - Document new structure in README

> ⚠️ **Agent Question**: Ask human before proceeding if step 7 conflicts with existing import paths or dependencies.

## Commands

```bash
# Create new directory structure
mkdir -p apps/{web,admin,portal}
mkdir -p sites
mkdir -p e2e/tests

# Reorganize packages to FSD structure
mkdir -p packages/ui/src/{primitives,marketing,shared,entities,features,widgets}
mkdir -p packages/{auth,database,seo,analytics,cms-adapters,email}
mkdir -p packages/{crypto-provider,server-actions,multi-tenant,ab-testing}

# Update workspace configuration
pnpm install

# Test new structure
pnpm -r build
pnpm -r test

# Verify all packages are discovered
pnpm list --depth=0
```

## Code Style

```
marketing-monorepo/
├── apps/
│   ├── web/                          # Main marketing site platform
│   ├── admin/                        # Internal admin dashboard
│   └── portal/                       # White-label client portal
├── sites/                            # Individual client site configs
│   └── {client-name}/                 # Client-specific configurations
├── packages/                         # Shared libraries (FSD pattern)
│   ├── ui/                          # Design system components
│   ├── auth/                        # Multi-tenant auth utilities
│   ├── database/                    # Supabase client + types
│   └── [15+ other packages]
├── e2e/                             # End-to-end tests
└── docs/                            # Documentation
```

**Naming conventions:**

- Directories: `kebab-case` - `apps/`, `packages/`, `sites/`
- Applications: `kebab-case` - `web/`, `admin/`, `portal/`
- Packages: `kebab-case` - `ui/`, `auth/`, `database/`
- Client sites: `kebab-case` - `client-name/`

## Boundaries

| Tier             | Scope                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create new directories; reorganize packages; update workspace config; create AGENTS.md files; test workflows; document changes    |
| ⚠️ **Ask first** | Moving packages with complex dependencies; changing import paths; modifying build configurations; updating CI/CD workflows        |
| 🚫 **Never**     | Deleting existing packages without migration; breaking existing import paths; modifying package.json dependencies without testing |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `pnpm list --depth=0` — all packages discovered in new structure
- [ ] **[Agent]** Run `pnpm -r build` — all packages build successfully
- [ ] **[Agent]** Run `pnpm -r test` — all tests pass after reorganization
- [ ] **[Agent]** Check directory structure — matches domain-1 specification exactly
- [ ] **[Agent]** Verify AGENTS.md files — exist in all packages with proper content
- [ ] **[Agent]** Test workspace globs — pnpm discovers all packages correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Import path changes:** Moving packages may break internal import paths
- **Build configurations:** Some packages may have hardcoded relative paths
- **CI/CD workflows:** GitHub Actions may need path updates
- **IDE configuration:** VS Code workspace settings may need updates
- **Git history:** Large moves may complicate git blame and history

## Out of Scope

- Modifying individual package code (only directory structure changes)
- Changing package functionality or APIs
- Updating build tools or frameworks
- Modifying CI/CD pipeline logic (only path updates)

## References

- [Domain 1.4 Complete Directory Structure](../docs/plan/domain-1/1.4-complete-directory-structure.md)
- [Feature-Sliced Design Documentation](../docs/guides/feature-sliced-design-docs.md)
- [pnpm Workspaces Documentation](../docs/guides/pnpm-workspaces-documentation.md)
- [AGENTS.md Pattern Documentation](../docs/guides/agents-md-patterns.md)
