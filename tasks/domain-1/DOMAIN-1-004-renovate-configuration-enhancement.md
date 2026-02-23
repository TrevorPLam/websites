---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-004
title: 'Enhance Renovate configuration with 2026 best practices'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: refactor # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-004-renovate-enhancement
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(renovate:*)
---

# DOMAIN-1-004 · Enhance Renovate configuration with 2026 best practices

## Objective

Enhance the Renovate configuration to implement 2026 best practices for automated dependency management, including catalog-aware updates, vulnerability alerting, and intelligent package grouping for a monorepo scaling to 1000+ client sites.

## Context

**Current State Analysis:**

- Repository uses basic Renovate configuration without 2026 enhancements
- Missing catalog-aware dependency management for pnpm 10.x
- No vulnerability alerting with immediate security response
- Limited package grouping strategies for large monorepo
- Missing post-quantum crypto dependency pinning
- No design system update coordination
- Limited rate limiting for CI/CD pipeline protection

**Codebase area:** Dependency management automation
**Related files:** `renovate.json`, `pnpm-workspace.yaml`, all `package.json` files
**Dependencies:** Renovate bot, pnpm 10.x catalog, GitHub Actions
**Prior work:** Basic renovate.json exists with simple rules
**Constraints:** Must maintain existing dependency update workflows during enhancement

**2026 Standards Compliance:**

- Catalog-aware dependency management for pnpm 10.x
- Immediate vulnerability alerting with security-first response
- Intelligent package grouping for monorepo efficiency
- Post-quantum crypto dependency pinning (NIST PQC readiness)
- Design system coordination with team review workflows
- Rate limiting to prevent CI/CD pipeline overload

## Tech Stack

| Layer                 | Technology                       |
| --------------------- | -------------------------------- |
| Dependency Management | Renovate with 2026 enhancements  |
| Package Manager       | pnpm 10.x catalog protocol       |
| Security              | Automated vulnerability alerting |
| Crypto                | Quantum-resistant cryptography   |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Renovate configuration updated with 2026 best practices
- [ ] **[Agent]** Catalog-aware dependency management implemented
- [ ] **[Agent]** Vulnerability alerting configured with immediate response
- [ ] **[Agent]** Intelligent package grouping for Next.js, Supabase, testing tools
- [ ] **[Agent]** Quantum-resistant cryptography implemented
- [ ] **[Agent]** Design system update coordination with team review
- [ ] **[Agent]** Rate limiting configured to prevent CI/CD overload
- [ ] **[Human]** All existing dependency update workflows continue to function

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Backup current configuration** - Save existing `renovate.json`
- [ ] **[Agent]** **Update base configuration** - Implement 2026 recommended extends
- [ ] **[Agent]** **Configure catalog-aware updates** - Add pnpm 10.x catalog support
- [ ] **[Agent]** **Set up vulnerability alerting** - Configure immediate security response
- [ ] **[Agent]** **Implement package grouping** - Group Next.js, Supabase, testing tools
- [ ] **[Agent]** **Add PQC dependency pinning** - Pin post-quantum crypto packages
- [ ] **[Agent]** **Configure design system coordination** - Add team review requirements
- [ ] **[Agent]** **Set up rate limiting** - Prevent CI/CD pipeline overload
- [ ] **[Agent]** **Test configuration** - Validate Renovate creates proper PRs
- [ ] **[Human]** **Update documentation** - Document new dependency management workflow

> ⚠️ **Agent Question**: Ask human before proceeding if step 3 conflicts with existing catalog configuration.

## Commands

```bash
# Validate Renovate configuration
npx renovate-config-validator

# Test Renovate configuration (dry run)
npx renovate --dry-run=true

# Check for immediate security updates
npx renovate --autodiscover=true --vulnerability-alerts=true

# Validate catalog compatibility
pnpm audit --catalog-strict

# Test package grouping simulation
npx renovate --package-files=all
```

## Code Style

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":dependencyDashboard",
    ":semanticCommits",
    ":separateMajorReleases",
    ":preserveSemverRanges",
    ":semanticCommitTypeAll(chore)"
  ],
  "baseBranches": ["main"],
  "schedule": ["before 5am on Monday"],
  "timezone": "America/Chicago",
  "prConcurrentLimit": 5,
  "prHourlyLimit": 2,
  "automerge": true,
  "automergeType": "pr",
  "automergeStrategy": "squash",
  "packageRules": [
    {
      "description": "Security updates: immediate merge",
      "matchUpdateTypes": ["patch"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true
    }
  ]
}
```

**Naming conventions:**

- Configuration keys: `camelCase` - `packageRules`, `schedule`, `timezone`
- Group names: `Title Case` - "Next.js core", "Supabase", "Testing"
- Commit types: `kebab-case` - "chore(deps)", "fix(security)"
- Labels: `kebab-case` - "dependencies", "security", "major"

## Boundaries

| Tier             | Scope                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify renovate.json; add package rules; configure vulnerability alerts; set up rate limiting; test configuration; document changes |
| ⚠️ **Ask first** | Changing automerge strategies; modifying review requirements; adding new package groups; changing schedule or rate limits           |
| 🚫 **Never**     | Ignoring security vulnerabilities; disabling vulnerability alerts; removing rate limiting; modifying package.json files directly    |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `npx renovate-config-validator` — configuration validates successfully
- [ ] **[Agent]** Run `npx renovate --dry-run=true` — dry run completes without errors
- [ ] **[Agent]** Check package grouping — Similar packages grouped correctly in simulation
- [ ] **[Agent]** Verify vulnerability alerts — Security updates flagged for immediate attention
- [ ] **[Agent]** Test rate limiting — PR creation respects configured limits
- [ ] **[Agent]** Validate catalog compatibility — Works with pnpm catalog strict mode
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Catalog conflicts:** Renovate may need special configuration for pnpm catalog
- **Security updates:** Some security patches may require manual review
- **Package grouping:** Over-aggressive grouping may hide important updates
- **Rate limiting:** Too restrictive may delay important updates
- **Team review:** Reviewer assignments must match actual team members

## Out of Scope

- Modifying individual package dependencies
- Changing package.json files directly
- Updating build tools or frameworks
- Modifying CI/CD pipeline logic

## References

- [Renovate Documentation](https://docs.renovatebot.com/)
- [Domain 1.5 Renovate Configuration](../docs/plan/domain-1/1.5-renovate-configuration-for-automated-dependency-updates.md)
- [pnpm Catalog Documentation](../docs/guides/pnpm-workspaces-documentation.md)
- [NIST Post-Quantum Cryptography Standards](../docs/guides/nist-fips-203-204-205.md)
