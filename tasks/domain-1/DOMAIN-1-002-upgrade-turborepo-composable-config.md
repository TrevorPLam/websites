---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-002
title: 'Upgrade Turborepo to 2.7 composable configuration'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-002-turborepo-composable-config
allowed-tools: Bash(git:*) Read Write Bash(turbo:*) Bash(node:*)
---

# DOMAIN-1-002 · Upgrade Turborepo to 2.7 composable configuration

## Objective

Upgrade turbo.json to Turborepo 2.7 with composable configuration using $TURBO_EXTENDS$, complete task definitions, and browser devtools support as specified in section 1.3.

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

**Codebase area:** Root `turbo.json` — task orchestration and caching configuration

**Related files:** `pnpm-workspace.yaml`, package.json files, `.turbo/` cache directory

**Dependencies:** Turborepo v2.7+ with composable configuration support

**Prior work:** Basic turbo.json exists with limited task definitions

**Constraints:** Must maintain existing cache compatibility during upgrade

---

## Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| Build Orchestrator | Turborepo v2.7+                   |
| Cache              | Vercel Remote Cache (free)        |
| Devtools           | Browser-based task visualization  |
| Config             | JSONC with $TURBO_EXTENDS$ syntax |

---

## Acceptance Criteria

- [ ] **[Agent]** `turbo.json` uses JSONC format with `$schema` reference
- [ ] **[Agent]** Composable configuration enabled with empty `extends` array
- [ ] **[Agent]** Complete task definitions for build, typecheck, lint, test, test:e2e, dev, clean
- [ ] **[Agent]** Additional tasks: validate:configs, lint:fsd, analyze, generate
- [ ] **[Agent]** Global environment variables properly configured
- [ ] **[Agent]** Remote caching enabled with signature verification
- [ ] **[Agent]** Experimental UI and browser devtools enabled
- [ ] **[Agent]** All existing tasks continue to work with improved caching
- [ ] **[Human]** Verify `turbo devtools` opens browser interface successfully

---

## Implementation Plan

- [ ] **[Agent]** **Backup current configuration** — Copy existing `turbo.json` to `turbo.json.backup`
- [ ] **[Agent]** **Convert to JSONC format** — Add schema reference and enable comments
- [ ] **[Agent]** **Enable composable configuration** — Add `extends: []` for $TURBO_EXTENDS$ support
- [ ] **[Agent]** **Configure global settings** — Add globalEnv, globalPassThroughEnv, globalDependencies
- [ ] **[Agent]** **Enable remote caching** — Configure Vercel Remote Cache with signature
- [ ] **[Agent]** **Add complete task definitions** — Implement all tasks from section 1.3 specification
- [ ] **[Agent]** **Enable experimental features** — Add experimentalUI and browser devtools
- [ ] **[Agent]** **Test task execution** — Verify all tasks run with improved caching
- [ ] **[Human]** **Validate devtools** — Test `turbo devtools` browser interface

> ⚠️ **Agent Question**: Ask human before proceeding if any existing workflows depend on current task names changing.

---

## Commands

```bash
# Verify Turborepo version
turbo --version

# Test task execution after upgrade
turbo run build --filter="*"
turbo run test --filter="*"

# Clear cache if needed
turbo clean

# Start browser devtools
turbo devtools

# Validate configuration
turbo run validate:configs
```

---

## Code Style

```jsonc
{
  "$schema": "https://turbo.build/schema.jsonc",

  // Composable configuration feature from Turborepo 2.7
  "extends": [],

  // Global environment variables that affect ALL tasks
  "globalEnv": [
    "NODE_ENV",
    "VERCEL",
    "VERCEL_ENV",
    "CI",
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ],

  // Experimental: Turborepo 2.7 browser devtools
  "experimentalUI": true,

  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**", "build/**", "out/**"],
      "cache": true,
      "inputs": [
        "src/**",
        "public/**",
        "package.json",
        "next.config.ts",
        "tailwind.config.ts",
        "tsconfig.json",
      ],
    },
  },
}
```

**Configuration principles:**

- Use JSONC format with comments for clarity
- Group related outputs and inputs logically
- Enable caching for deterministic tasks
- Use proper dependency chains with `^` prefix

---

## Boundaries

| Tier             | Scope                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify turbo.json configuration; test task execution; enable caching; follow section 1.3 specification                          |
| ⚠️ **Ask first** | Changing task names that existing workflows depend on; modifying cache strategy; updating CI/CD pipeline integration            |
| 🚫 **Never**     | Delete .turbo/ cache directory manually; ignore existing task dependencies; break backward compatibility without migration plan |

---

## Success Verification

- [ ] **[Agent]** Run `turbo --version` — confirms v2.7+ installed
- [ ] **[Agent]** Run `turbo run build --filter="*"` — all packages build successfully
- [ ] **[Agent]** Run `turbo run test --filter="*"` — tests execute with proper caching
- [ ] **[Agent]** Run `turbo run validate:configs` — new task executes without errors
- [ ] **[Human]** Run `turbo devtools` — browser interface opens and displays task graph
- [ ] **[Agent]** Check cache hit rates — improved caching performance evident
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Cache invalidation:** New configuration may invalidate existing cache — expect first run to be slower
- **Task dependencies:** Ensure proper dependency chains to avoid race conditions
- **Environment variables:** Verify all required globalEnv variables are available in CI/CD
- **Remote cache:** May need Vercel authentication for remote cache functionality
- **Browser devtools:** Requires local development environment, not available in CI

---

## Out of Scope

- Individual package turbo.json extensions (handled in separate tasks)
- Vercel Remote Cache authentication setup
- CI/CD pipeline integration updates
- Migration from other build orchestrators

---

## References

- [Turborepo 2.7 Release Notes](https://turbo.build/release-notes/v2.7.0)
- [Composable Configuration Documentation](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks/composable-configuration)
- [Section 1.3 Complete Turborepo Configuration](docs/plan/domain-1/1.3-complete-turborepo-configuration-with-composable-tasks.md)
- [Browser Devtools Documentation](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks/devtools)
