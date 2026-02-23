# Renovate Configuration Documentation

## Overview

Renovate is an open-source automated dependency update bot that detects outdated dependencies across your repository, creates PRs to update them, and supports advanced monorepo configurations including `packageRules`, grouping, and per-package schedules. [docs.renovatebot](https://docs.renovatebot.com/configuration-options/)

## Installation

### Self-Hosted (GitHub Actions)

```yaml
# .github/workflows/renovate.yml
name: Renovate
on:
  schedule:
    - cron: '0 3 * * 1' # Every Monday at 3 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: renovatebot/github-action@v40
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: debug
```

### GitHub App (recommended for orgs)

Install the [Renovate GitHub App](https://github.com/apps/renovate) and add a `renovate.json` config to the root of your repository. [docs.renovatebot](https://docs.renovatebot.com)

---

## Base Configuration for pnpm Monorepos

```json
// renovate.json (repo root)
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":dependencyDashboard",
    ":semanticCommits",
    "group:monorepos",
    "group:recommended",
    "workarounds:all"
  ],

  // Limit PR creation rate — prevent overwhelming CI
  "prConcurrentLimit": 8,
  "prHourlyLimit": 2,
  "rebaseWhen": "conflicted",
  "schedule": ["before 6am on Monday"],

  // Auto-merge patch/minor for trusted packages
  "packageRules": [
    {
      "description": "Automerge patch updates for all packages",
      "matchUpdateTypes": ["patch", "pin", "digest"],
      "automerge": true,
      "automergeType": "pr",
      "platformAutomerge": true,
      "minimumReleaseAge": "3 days"
    },
    {
      "description": "Group all Next.js ecosystem updates",
      "matchPackageNames": ["next", "eslint-config-next", "@next/bundle-analyzer", "@next/font"],
      "groupName": "Next.js ecosystem",
      "automerge": false
    },
    {
      "description": "Group all Supabase packages",
      "matchPackagePatterns": ["^@supabase/"],
      "groupName": "Supabase",
      "automerge": false
    },
    {
      "description": "Group all Radix UI packages (safe to automerge patches)",
      "matchPackagePatterns": ["^@radix-ui/"],
      "groupName": "Radix UI",
      "automerge": true,
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Group all testing dependencies",
      "matchPackagePatterns": ["^@playwright/", "^vitest", "^@testing-library/"],
      "groupName": "Testing dependencies",
      "automerge": true
    },
    {
      "description": "Pin Node.js major version — manual upgrade only",
      "matchPackageNames": ["node"],
      "allowedVersions": "^22",
      "enabled": true
    },
    {
      "description": "Security updates — always open immediately",
      "matchCategories": ["security"],
      "automerge": false,
      "prPriority": 10,
      "labels": ["security", "dependencies"]
    },
    {
      "description": "Major version bumps — never automerge, assign reviewer",
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "assignees": ["@team-leads"],
      "reviewers": ["@team-leads"],
      "labels": ["major-update"]
    },
    {
      "description": "TypeScript and type definitions — automerge patches",
      "matchPackageNames": ["typescript"],
      "matchPackagePatterns": ["^@types/"],
      "groupName": "TypeScript and type definitions",
      "automerge": true,
      "matchUpdateTypes": ["patch", "minor"]
    }
  ]
}
```

---

## Monorepo-Specific Configuration

For large monorepos where different teams own different packages, use `additionalBranchPrefix` to create per-package PRs: [jvt](https://www.jvt.me/posts/2025/07/07/renovate-monorepo/)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],

  "packageRules": [
    {
      "description": "Split dependency updates by package directory",
      "matchFileNames": ["apps/**", "packages/**"],
      "additionalBranchPrefix": "{{packageFileDir}}/",
      "commitMessagePrefix": "{{packageFileDir}}:"
    },
    {
      "description": "apps/marketing — automerge UI patches",
      "matchPaths": ["apps/marketing/**"],
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "description": "apps/portal — conservative, no automerge",
      "matchPaths": ["apps/portal/**"],
      "automerge": false
    }
  ]
}
```

---

## Dependency Dashboard

The Dependency Dashboard is a GitHub Issue (automatically maintained by Renovate) that shows all pending updates in one place. Enable it with: [docs.mend](https://docs.mend.io/wsk/common-practices-for-renovate-configuration)

```json
{
  "dependencyDashboard": true,
  "dependencyDashboardTitle": "🔄 Dependency Updates Dashboard",
  "dependencyDashboardLabels": ["dependencies"]
}
```

---

## Security Vulnerability Auto-Patching

Renovate integrates with GitHub's dependency graph to detect and immediately open PRs for CVE-affected packages:

```json
{
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"],
    "automerge": true,
    "schedule": ["at any time"], // Override schedule for security patches
    "prPriority": 10
  },
  "osvVulnerabilityAlerts": true // Also check OSV database
}
```

---

## pnpm Catalog Support

Renovate supports the `catalog:` protocol introduced in pnpm 9. Ensure the `pnpm-workspace.yaml` is in `includePaths`:

```json
{
  "includePaths": ["pnpm-workspace.yaml", "package.json", "apps/**", "packages/**"]
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Renovate Official Documentation — https://docs.renovatebot.com
- Renovate Configuration Options — https://docs.renovatebot.com/configuration-options/
- Renovate Monorepo Presets — https://docs.renovatebot.com/presets-monorepo/
- Monorepo Optimization Tips — https://www.jvt.me/posts/2025/07/07/renovate-monorepo/
- Mend Common Practices — https://docs.mend.io/wsk/common-practices-for-renovate-configuration

---
