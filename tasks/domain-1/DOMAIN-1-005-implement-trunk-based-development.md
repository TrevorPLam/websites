---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-005
title: 'Implement trunk-based development with feature flags'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-005-trunk-based-development
allowed-tools: Bash(git:*) Read Write Bash(gh:*)
---

# DOMAIN-1-005 · Implement trunk-based development with feature flags

## Objective

Implement trunk-based development strategy with feature flags as specified in section 1.6, including branch protection rules and feature flag management system.

---

## Context

**Codebase area:** GitHub repository settings and packages/feature-flags/ implementation

**Related files:** `.github/branch-protection.yml`, `packages/feature-flags/src/index.ts`, site configs

**Dependencies:** GitHub repository with admin access, feature flag package structure

**Prior work:** Basic repository structure exists, missing formal branching strategy

**Constraints:** Must maintain existing workflow compatibility during transition

---

## Tech Stack

| Layer              | Technology                           |
| ------------------ | ------------------------------------ |
| Version Control    | Git with trunk-based development     |
| Branch Protection  | GitHub branch protection rules       |
| Feature Management | TypeScript feature flag system       |
| Rollout Strategy   | Percentage-based and tenant-specific |

---

## Acceptance Criteria

- [ ] **[Agent]** Create `.github/branch-protection.yml` with complete protection rules
- [ ] **[Agent]** Implement `packages/feature-flags/src/index.ts` with feature flag system
- [ ] **[Agent]** Add feature flag validation with Zod schemas
- [ ] **[Agent]** Create useFeatureFlag hook for tenant-aware flag resolution
- [ ] **[Agent]** Configure branch protection in GitHub repository settings
- [ ] **[Agent]** Add feature flag examples for common use cases
- [ ] **[Agent]** Create documentation for feature flag usage patterns
- [ ] **[Human]** Verify branch protection prevents direct main commits
- [ ] **[Human]** Test feature flag resolution in development environment

---

## Implementation Plan

- [ ] **[Agent]** **Create branch protection configuration** — Add `.github/branch-protection.yml` with required rules
- [ ] **[Agent]** **Implement feature flag package** — Create packages/feature-flags/ with TypeScript implementation
- [ ] **[Agent]** **Add flag validation** — Implement Zod schemas for flag configuration
- [ ] **[Agent]** **Create flag resolution hook** — Implement useFeatureFlag with tenant/tier awareness
- [ ] **[Agent]** **Add example flags** — Create common feature flag patterns
- [ ] **[Agent]** **Configure GitHub protection** — Apply branch protection rules to repository
- [ ] **[Agent]** **Create usage documentation** — Document feature flag patterns and best practices
- [ ] **[Human]** **Test protection rules** — Verify branch protection works correctly

> ⚠️ **Agent Question**: Ask human before proceeding if repository requires admin permissions for branch protection.

---

## Commands

```bash
# Create feature flags package structure
mkdir -p packages/feature-flags/src
touch packages/feature-flags/package.json
touch packages/feature-flags/src/index.ts

# Create GitHub branch protection
mkdir -p .github
touch .github/branch-protection.yml

# Configure branch protection via GitHub CLI
gh repo edit --enable-merge-commit=false --enable-squash-merge=true
gh api repos/:owner/:repo/branches/main/protection --method PUT --field required_status_checks='{"strict":true,"contexts":["ci/typecheck","ci/lint","ci/test","ci/e2e"]}' --field enforce_admins=true --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' --field restrictions='{"users":[],"teams":["platform-team"]}'
```

---

## Code Style

```typescript
// ✅ Correct — Feature flag implementation with validation
import { z } from 'zod';

const flagSchema = z.object({
  enabled: z.boolean(),
  rollout: z.number().min(0).max(100).optional(),
  tenantIds: z.array(z.string()).optional(),
  tiers: z.array(z.enum(['starter', 'professional', 'enterprise'])).optional(),
});

export const featureFlags = {
  newLeadScoringEngine: {
    enabled: true,
    rollout: 10,
    tiers: ['enterprise'],
  },
  experimentalPPR: {
    enabled: true,
    tenantIds: ['client-001', 'client-005'],
  },
} as const;

export function useFeatureFlag(flag: keyof typeof featureFlags, tenantId: string, tier: string) {
  const config = featureFlags[flag];

  if (!config.enabled) return false;

  if (config.tenantIds && !config.tenantIds.includes(tenantId)) {
    return false;
  }

  if (config.tiers && !config.tiers.includes(tier as any)) {
    return false;
  }

  if (config.rollout) {
    const hash = hashString(`${tenantId}-${flag}`);
    return hash % 100 < config.rollout;
  }

  return true;
}
```

**Feature flag principles:**

- Always default to false for safety
- Use tenant-specific rollouts for beta testing
- Implement percentage-based rollouts for gradual deployment
- Include tier-based targeting for pricing tiers
- Provide deterministic hash-based percentage assignment

---

## Boundaries

| Tier             | Scope                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create branch protection rules; implement feature flag system; follow section 1.6 specification; add proper validation |
| ⚠️ **Ask first** | Modifying existing GitHub repository settings; changing team permissions; updating CI/CD status checks                 |
| 🚫 **Never**     | Disable branch protection; ignore feature flag validation; bypass required status checks; modify main branch directly  |

---

## Success Verification

- [ ] **[Agent]** Run `gh api repos/:owner/:repo/branches/main/protection` — branch protection active
- [ ] **[Agent]** Run `pnpm build --filter="@repo/feature-flags"` — package builds successfully
- [ ] **[Agent]** Test feature flag resolution — flags resolve correctly for different tenants/tiers
- [ ] **[Agent]** Validate Zod schemas — flag configurations pass validation
- [ ] **[Human]** Attempt direct push to main — blocked by branch protection
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Branch protection conflicts:** Existing workflows may need status check updates
- **Feature flag persistence:** Flags should be environment-aware (dev vs prod)
- **Rollout consistency:** Hash-based rollout must be deterministic across requests
- **Team permissions:** Ensure platform team has proper GitHub permissions
- **CI/CD integration:** Status checks must match actual workflow names

---

## Out of Scope

- Migration of existing branches to trunk-based model
- GitHub team management and permissions setup
- CI/CD workflow modifications for status checks
- Production feature flag management interface

---

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Section 1.6 Git Branching Strategy](docs/plan/domain-1/1.6-git-branching-strategy-trunk-based-development-feature-flags.md)
- [Feature Flag Best Practices](https://martinfowler.com/articles/feature-toggles.html)
- [Trunk-Based Development](https://trunkbaseddevelopment.com/)
