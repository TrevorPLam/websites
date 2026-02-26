---
title: "Automated CLI Template Updates Guide"
description: "When you maintain a canonical CLI tool template (scaffolding, configs, Makefile, Docker setup, CI workflows) and spawn multiple downstream repos from it, those repos inevitably diverge from the upstre..."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "automated", "template", "updates"]
legacy_path: "automated-cli-template-updates.md"
---
# Automated CLI Template Updates Guide

## The Template Drift Problem

When you maintain a canonical CLI tool template (scaffolding, configs, Makefile, Docker setup, CI workflows) and spawn multiple downstream repos from it, those repos inevitably diverge from the upstream template. Manually merging updates is error-prone and doesn't scale. The solution is a scheduled GitHub Actions workflow that opens an automated PR in each downstream repo whenever the upstream template changes.[13][14]

## Strategy Options

| Approach | Best For | Mechanism |
|----------|----------|-----------|
| `actions-template-sync` Action | GitHub template repos | PR-based sync via GitHub API[13][15] |
| `template-sync-cli` (npm) | npm/Node.js ecosystems | CLI tool run in CI[16] |
| Git subtrees | Monorepo structures | `git subtree pull` in CI |
| npm workspaces `version` script | Version-only sync | `npm version` + workspace scripts[1] |
| Custom merge workflow | Complex customizations | Shell script + `gh` CLI |

## Implementation: actions-template-sync (Recommended)

This action handles the most common case — a GitHub template repository with downstream repos that need to receive updates automatically.[15][13]

**Step 1: Add workflow to EACH downstream repo**

```yaml
# .github/workflows/sync-from-template.yml
name: "Sync from Upstream Template"

on:
  schedule:
    - cron: "0 3 * * 1"   # Every Monday at 3 AM UTC
  workflow_dispatch:        # Allow manual trigger from GitHub UI
    inputs:
      force:
        description: 'Force sync even if no changes'
        required: false
        default: 'false'

jobs:
  sync:
    name: "Pull template updates"
    runs-on: ubuntu-latest

    permissions:
      contents: write
      pull-requests: write

    env:
      SOURCE_REPOSITORY: "your-org/cli-template"
      SOURCE_BRANCH: "main"

    steps:
      - name: Checkout target repo
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          fetch-depth: 0

      - name: Run template sync
        uses: AndreasAugustin/actions-template-sync@v2
        with:
          github_token: ${{ secrets.REPO_SYNC_PAT }}
          source_repo_path: ${{ env.SOURCE_REPOSITORY }}
          upstream_branch: ${{ env.SOURCE_BRANCH }}
          pr_title: "chore(template): sync from upstream template"
          pr_commit_msg: "chore(template): apply upstream template changes"
          pr_labels: "template-sync,automated"
          # Don't fail if there are no changes
          is_dry_run: ${{ github.event.inputs.force == 'false' && 'false' || 'false' }}
```

**Step 2: Create the `REPO_SYNC_PAT` secret**

1. Create a PAT with `repo` and `workflow` scopes (classic token) or fine-grained with `contents:write` and `pull_requests:write`.
2. Add it as a secret named `REPO_SYNC_PAT` in **each downstream repo** (or at the organization level to share across all repos).

**Step 3: Add `.templatesyncignore` to downstream repos**

Prevent template sync from overwriting files that are intentionally customized per repo:

```gitignore
# .templatesyncignore
# Files that this repo intentionally overrides — don't sync from template
README.md
.env.example
CHANGELOG.md
package.json          # If version differs per repo
docs/getting-started.md
.github/CODEOWNERS
```

## Triggering Sync from the Template Side

Rather than waiting for the Monday schedule, you can trigger all downstream repo syncs immediately when you push changes to the template:

```yaml
# Template repo: .github/workflows/trigger-downstream-sync.yml
name: "Notify downstream repos"

on:
  push:
    branches: [main]

jobs:
  trigger-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger sync in downstream repos
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.ORG_ADMIN_PAT }}
          repository: your-org/target-repo-1
          event-type: template-updated
          client-payload: '{"template_sha": "${{ github.sha }}"}'
```

In the downstream repo, add a trigger alongside the schedule:

```yaml
on:
  schedule:
    - cron: "0 3 * * 1"
  repository_dispatch:
    types: [template-updated]
  workflow_dispatch:
```

## Handling Merge Conflicts

Template sync PRs may conflict with local customizations. The recommended workflow is:[14]

1. **Review the PR immediately** — the longer it sits, the more divergence accumulates.
2. **Cherry-pick template changes** rather than merging wholesale when conflicts are extensive.
3. **Document intentional divergences** in a `TEMPLATE_OVERRIDES.md` file so future maintainers understand why certain files differ from the upstream template.
4. **Use `is_fork_point_sync: true`** in `actions-template-sync` to use git's three-way merge rather than file-level replacement, which reduces conflicts significantly.[15]

## npm CLI Template Updates

For Node.js CLI tools, version and script synchronization can use npm workspaces natively:[1]

```json
// Root package.json (template/workspace root)
{
  "name": "cli-workspace",
  "workspaces": ["packages/*"],
  "scripts": {
    "version": "npm version $npm_package_version --no-git-tag-version --workspaces && git add .",
    "sync-scripts": "node scripts/sync-package-scripts.js"
  }
}
```

```javascript
// scripts/sync-package-scripts.js
// Propagates canonical scripts from root to all workspace packages
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const SHARED_SCRIPTS = ["lint", "format", "test", "build"];
const workspaces = rootPkg.workspaces || [];

for (const ws of workspaces) {
  const pkgPath = path.join(ROOT, ws, "package.json");
  if (!fs.existsSync(pkgPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  let changed = false;

  for (const script of SHARED_SCRIPTS) {
    if (rootPkg.scripts[script] && pkg.scripts?.[script] !== rootPkg.scripts[script]) {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts[script] = rootPkg.scripts[script];
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`Updated scripts in: ${ws}/package.json`);
  }
}
```

## References

[13] actions-template-sync - https://github.com/AndreasAugustin/actions-template-sync
[14] Template sync best practices - https://github.blog/2023-01-19-template-repositories-best-practices/
[15] GitHub Actions template sync documentation - https://github.com/AndreasAugustin/actions-template-sync/blob/main/README.md
[16] template-sync-cli npm package - https://www.npmjs.com/package/template-sync-cli