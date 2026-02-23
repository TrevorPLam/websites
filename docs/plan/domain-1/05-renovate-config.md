# 1.5 Renovate Configuration for Automated Dependency Updates

**File:** `renovate.json`

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
  "semanticCommits": "enabled",
  "commitMessagePrefix": "chore(deps): ",
  "labels": ["dependencies"],
  "assignees": ["@your-github-username"],
  "ignoreDeps": [],
  "packageRules": [
    {
      "description": "Security updates: immediate merge",
      "matchUpdateTypes": ["patch"],
      "matchCurrentVersion": "!/^0/",
      "matchPackagePatterns": ["*"],
      "automerge": true,
      "automergeType": "pr",
      "automergeStrategy": "squash"
    },
    {
      "description": "Automerge patch and minor updates",
      "matchUpdateTypes": ["patch", "minor"],
      "automerge": true
    },
    {
      "description": "Require manual approval for major updates",
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["dependencies", "major"],
      "dependencyDashboardApproval": true
    },
    {
      "description": "Group Next.js ecosystem updates",
      "groupName": "Next.js core",
      "matchPackagePatterns": ["^next", "^react", "^react-dom"],
      "schedule": ["before 5am on the first day of the month"],
      "automerge": false,
      "reviewers": ["platform-team"]
    },
    {
      "description": "Group Supabase updates",
      "groupName": "Supabase",
      "matchPackagePatterns": ["^@supabase"],
      "automerge": true,
      "matchUpdateTypes": ["patch", "minor"],
      "schedule": ["before 5am on Monday"]
    },
    {
      "description": "Group testing tools",
      "groupName": "Testing",
      "matchPackagePatterns": ["vitest", "@playwright", "@testing-library"],
      "automerge": true,
      "matchUpdateTypes": ["patch", "minor"],
      "schedule": ["before 5am on Monday"]
    },
    {
      "description": "TypeScript: manual review required",
      "matchPackageNames": ["typescript"],
      "groupName": "TypeScript",
      "automerge": false,
      "schedule": ["before 5am on the first day of the month"]
    },
    {
      "description": "Tailwind CSS v4: pin major version",
      "matchPackageNames": ["tailwindcss"],
      "allowedVersions": "^4.0.0",
      "schedule": ["before 5am on Monday"]
    },
    {
      "description": "Design system updates",
      "groupName": "Design system",
      "matchPackagePatterns": ["tailwindcss", "@electric-sql/pglite"],
      "schedule": ["before 5am on Tuesday"],
      "automerge": false,
      "reviewers": ["design-team"]
    },
    {
      "description": "Observability: group monitoring tools",
      "groupName": "Observability",
      "matchPackagePatterns": ["^@opentelemetry/", "^@sentry/"],
      "schedule": ["before 5am on Monday"]
    },
    {
      "description": "Dev dependencies",
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "description": "Critical security vulnerabilities",
      "matchDatasources": ["npm"],
      "vulnerabilityAlerts": {
        "enabled": true,
        "labels": ["security", "priority-high"],
        "automerge": false,
        "schedule": ["at any time"],
        "assignees": ["platform-lead"]
      }
    }
  ],
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 5am on the first day of the month"]
  },
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security", "vulnerability"],
    "automerge": false
  },
  "osvVulnerabilityAlerts": true,
  "reviewersFromCodeOwners": true,
  "ignorePresets": [":ignoreModulesAndTests"],
  "pnpm": {
    "rangeStrategy": "bump"
  }
}
```

**Why This Configuration:**

- Automerge patch/minor: Reduces manual PR review burden (95% of updates)
- Manual major: Prevents breaking changes without human/AI review
- Grouped updates: Next.js, Supabase, testing tools bundled (fewer PRs)
- Security alerts: Immediate PRs for CVEs (auto-labeled, not automerged)
- Monday 5am schedule: Low-traffic window for CI runs
- Rate limiting: Prevents CI/CD overload (3-5 PRs max, 2/hour)
- Catalog-Aware: Works with pnpm 10.x catalog protocol

**When to Build:** P0.5 (after initial packages are working)
