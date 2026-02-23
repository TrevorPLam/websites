---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-004
title: 'Upgrade Renovate configuration to 2026 standards'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-004-renovate-2026-standards
allowed-tools: Bash(git:*) Read Write Bash(node:*)
---

# DOMAIN-1-004 · Upgrade Renovate configuration to 2026 standards

## Objective

Upgrade renovate.json to match section 1.5 specification with advanced package rules, security vulnerability handling, and pnpm 10.x catalog-strict compatibility.

---

## Context

**Codebase area:** Root `renovate.json` — automated dependency management configuration

**Related files:** `package.json`, `pnpm-workspace.yaml`, `.github/workflows/`

**Dependencies:** Renovate bot with GitHub integration, pnpm catalog-strict mode

**Prior work:** Basic renovate.json exists with limited package rules and security handling

**Constraints:** Must maintain compatibility with existing CI/CD workflows

---

## Tech Stack

| Layer                 | Technology                       |
| --------------------- | -------------------------------- |
| Dependency Automation | Renovate bot with GitHub Actions |
| Package Manager       | pnpm v10.x catalog-strict mode   |
| Security Scanning     | OSV vulnerability alerts         |
| Scheduling            | Cron-based automated updates     |

---

## Acceptance Criteria

- [ ] **[Agent]** `renovate.json` includes all extends from section 1.5 specification
- [ ] **[Agent]** Advanced package rules for Next.js, Supabase, testing tools, observability
- [ ] **[Agent]** Security vulnerability alerts with immediate PR creation
- [ ] **[Agent]** Proper automerge strategy (patch/minor auto-merge, major manual)
- [ ] **[Agent]** pnpm catalog-strict compatibility with rangeStrategy: "bump"
- [ ] **[Agent]** Grouped updates with proper scheduling and reviewer assignments
- [ ] **[Agent]** Lock file maintenance with monthly schedule
- [ ] **[Agent]** Rate limiting and concurrent PR controls
- [ ] **[Human]** Verify Renovate creates properly categorized PRs

---

## Implementation Plan

- [ ] **[Agent]** **Backup current configuration** — Copy existing `renovate.json` to `renovate.json.backup`
- [ ] **[Agent]** **Update extends configuration** — Add all recommended extends from section 1.5
- [ ] **[Agent]** **Configure scheduling** — Set Monday 5am schedule with timezone
- [ ] **[Agent]** **Add advanced package rules** — Implement Next.js, Supabase, testing tool groups
- [ ] **[Agent]** **Configure security alerts** — Enable vulnerability alerts with immediate PRs
- [ ] **[Agent]** **Set automerge strategy** — Configure patch/minor auto-merge, major manual review
- [ ] **[Agent]** **Add pnpm compatibility** — Configure rangeStrategy and catalog-strict awareness
- [ ] **[Agent]** **Configure rate limiting** — Set PR concurrency and hourly limits
- [ ] **[Human]** **Test Renovate bot** — Verify PR creation and categorization

> ⚠️ **Agent Question**: Ask human before proceeding if any existing workflows depend on current Renovate behavior.

---

## Commands

```bash
# Validate Renovate configuration
npx renovate-config-validator

# Test Renovate configuration locally
npx renovate --dry-run

# Check for existing Renovate PRs
gh pr list --label "dependencies,renovate"

# Validate JSON syntax
jq . renovate.json
```

---

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
  "prCreation": "immediate",
  "automerge": true,
  "automergeType": "pr",
  "automergeStrategy": "squash",
  "packageRules": [
    {
      "description": "Security updates: immediate merge",
      "matchUpdateTypes": ["patch"],
      "matchCurrentVersion": "!/^0/",
      "matchPackagePatterns": ["*"],
      "automerge": true,
      "automergeType": "pr",
      "automergeStrategy": "squash"
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security", "vulnerability"],
    "automerge": false
  },
  "pnpm": {
    "rangeStrategy": "bump"
  }
}
```

**Configuration principles:**

- Group related packages to reduce PR noise
- Use semantic commits for clear changelog
- Enable security alerts for immediate vulnerability response
- Rate limit to prevent CI/CD overload
- Configure proper automerge for safe updates

---

## Boundaries

| Tier             | Scope                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify renovate.json configuration; test validation; follow section 1.5 specification; enable security alerts             |
| ⚠️ **Ask first** | Changing automerge strategy; modifying reviewer assignments; updating GitHub workflow integration                         |
| 🚫 **Never**     | Ignore security vulnerabilities; disable rate limiting; break existing PR categorization; modify Renovate bot permissions |

---

## Success Verification

- [ ] **[Agent]** Run `npx renovate-config-validator` — configuration validates successfully
- [ ] **[Agent]** Run `jq . renovate.json` — valid JSON syntax confirmed
- [ ] **[Agent]** Check package rules coverage — all major dependency groups configured
- [ ] **[Agent]** Verify security configuration — vulnerability alerts enabled
- [ ] **[Human]** Monitor first Renovate PR run — proper categorization and automerge behavior
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Catalog conflicts:** Renovate may need catalog-strict awareness for pnpm 10.x compatibility
- **Security alerts:** Ensure proper GitHub permissions for vulnerability detection
- **Automerge failures:** CI failures should prevent automerge from proceeding
- **Rate limiting:** Too many concurrent PRs may overwhelm CI/CD pipeline
- **Reviewer availability:** Ensure assigned reviewers are available for major updates

---

## Out of Scope

- GitHub workflow integration for Renovate
- Renovate bot authentication and permissions setup
- Custom Renovate presets or private package rules
- Integration with project management tools

---

## References

- [Renovate Configuration Documentation](https://docs.renovatebot.com/configuration-options/)
- [Section 1.5 Renovate Configuration](docs/plan/domain-1/1.5-renovate-configuration-for-automated-dependency-updates.md)
- [pnpm Catalog Documentation](https://pnpm.io/workspaces#catalog-protocol)
- [OSV Vulnerability Alerts](https://osv.dev/)
