---
title: "Git Branching Strategies"
description: "> **Reference Documentation — February 2026**"
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "branching", "strategies"]
legacy_path: "best-practices\git-branching-strategies.md"
---
# Git Branching Strategies

> **Reference Documentation — February 2026**

## Overview

Modern high-velocity teams use **trunk-based development** (TBD) combined with **feature flags** as the primary branching strategy. Long-lived branches like `develop` and `release/*` introduce merge conflicts, delay integration, and break continuous delivery. [remoteenv](https://www.remoteenv.com/blog/feature-flag-branching-strategies-git-workflow)

---

## Branching Model Comparison

| Strategy                    | Integration Frequency | Merge Conflicts | CD Compatible | Feature Isolation |
| --------------------------- | --------------------- | --------------- | ------------- | ----------------- |
| GitFlow                     | Rare (per release)    | High            | ❌            | Via branches      |
| GitHub Flow                 | On PR merge           | Medium          | ⚠️            | Via branches      |
| **Trunk-Based Development** | Daily (or per commit) | Minimal         | ✅            | Via feature flags |

---

## Trunk-Based Development

**Core Rule:** All engineers commit to `main` at least once per day. Long-lived branches are prohibited. [launchdarkly](https://launchdarkly.com/blog/git-branching-strategies-vs-trunk-based-development/)

### Branch Naming Convention

```
main                    ← production; always deployable
feature/<ticket-id>-short-description   ← max 2 days lifespan
fix/<ticket-id>-short-description       ← max 1 day lifespan
chore/<description>                     ← dependency updates, config
```

### Branch Lifecycle Rules

```
feature/  → must merge to main within 48 hours
fix/      → must merge to main within 24 hours
No branch → survives a weekly cleanup (Autonomous Janitor job closes stale)
```

---

## Feature Flag Branching Pattern

Every feature ≥ 4 hours of work gets a feature flag **before** any code is written. The flag gates the feature at the UI/API level, allowing incomplete code to safely land in `main`. [configcat](https://configcat.com/trunk-based-development/)

```typescript
// Workflow:
// 1. Create flag in LaunchDarkly / Flagsmith BEFORE writing code
// 2. Write code behind the flag — commit to main daily
// 3. Flag starts at 0% rollout (off by default)
// 4. Enable for internal team → QA → gradual rollout → 100%
// 5. Remove flag + dead code within 1 sprint of full rollout

// Example:
const { enabled } = useFlag('new-booking-calendar-v2');

return enabled ? <BookingCalendarV2 /> : <BookingCalendarV1 />;
```

---

## GitHub Flow (Secondary Pattern)

Used when a project does not yet have feature flags infrastructure:

```
main ──────────────────────────────────────────► (production)
         ↑                    ↑
  PR merge (squash)      PR merge (squash)
         │                    │
feature/abc-123 ──────► feature/xyz-456
(reviewed, CI green)   (reviewed, CI green)
```

**Rules for GitHub Flow:**

- `main` is always deployable
- Feature branches are short-lived (< 3 days)
- All changes require a PR with ≥ 1 approval
- Squash merge (clean linear history)

---

## Branch Protection Rules

```yaml
# GitHub repository settings (Infrastructure as Code via Terraform)
branch_protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - 'TypeScript Check'
        - 'Tests'
        - 'Build Check'
        - 'Bundle Size Check'
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions:
      push: [] # Nobody force-pushes to main
    enforce_admins: true
    allow_force_pushes: false
    allow_deletions: false
    require_linear_history: true # Squash or rebase merges only
```

---

## Commit Convention (Conventional Commits)

```
type(scope): short description

Types: feat | fix | chore | docs | style | refactor | test | perf | ci | build | revert

Examples:
  feat(leads): add real-time lead scoring via QStash job
  fix(portal): correct CSS variable injection order to prevent FOUC
  chore(deps): update @supabase/supabase-js to v2.50.0
  perf(marketing): add priority prop to hero image for LCP improvement
  ci(lighthouse): lower LCP threshold to 2.2s
```

Enforced by `commitlint` + `husky`:

```json
// package.json (root)
{
  "commitlint": { "extends": ["@commitlint/config-conventional"] },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

---

## References

- Trunk-Based Development — https://trunkbaseddevelopment.com
- Feature Flags + TBD (LaunchDarkly) — https://launchdarkly.com/blog/git-branching-strategies-vs-trunk-based-development/
- TBD vs Git Branching (Statsig) — https://www.statsig.com/perspectives/trunk-based-development-vs-git-branching
- Feature Flag Branching Strategies — https://www.remoteenv.com/blog/feature-flag-branching-strategies-git-workflow
- ConfigCat TBD Guide — https://configcat.com/trunk-based-development/

---