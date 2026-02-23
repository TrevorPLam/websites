---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-006
title: 'Implement feature flags system for gradual rollout'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-006-feature-flags
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pnpm:*)
---

# DOMAIN-1-006 · Implement feature flags system for gradual rollout

## Objective

Implement a comprehensive feature flags system that enables gradual feature rollout, A/B testing, and trunk-based development support for 1000+ client sites with tenant-specific targeting and tier-based access control.

## Context

**Current State Analysis:**

- Repository lacks centralized feature flag management system
- No gradual rollout capability for new features
- Missing tenant-specific feature targeting
- No integration with site.config.ts for per-client configuration
- Absence of A/B testing framework integration
- Missing analytics integration for feature performance tracking

**Codebase area:** Feature management and rollout system
**Related files:** `packages/feature-flags/`, `site.config.ts` files, analytics packages
**Dependencies:** Zod for type safety, analytics for tracking, tenant context system
**Prior work:** Basic tenant context exists but no feature flag integration
**Constraints:** Must integrate with existing multi-tenant architecture

**2026 Standards Compliance:**

- Feature flag integration with trunk-based development
- Tenant-specific targeting with percentage-based rollout
- Tier-based access control for different subscription levels
- Analytics integration for feature performance tracking
- A/B testing framework compatibility
- Environment variable support for emergency toggles

## Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| Feature Management | Custom feature flags system      |
| Type Safety        | Zod schema validation            |
| Analytics          | Integration with tracking system |
| Tenant Context     | Multi-tenant isolation           |
| Configuration      | site.config.ts integration       |

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable.
Use "Given / When / Then" framing where it adds clarity.
All criteria must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Feature flags package created with comprehensive type definitions
- [ ] **[Agent]** useFeatureFlag hook implemented for React components
- [ ] **[Agent]** Tenant-specific targeting with percentage-based rollout
- [ ] **[Agent]** Tier-based access control for subscription levels
- [ ] **[Agent]** Integration with site.config.ts for per-client configuration
- [ ] **[Agent]** Analytics tracking for feature performance metrics
- [ ] **[Agent]** Environment variable support for emergency toggles
- [ ] **[Agent]** Comprehensive test coverage for all flag scenarios

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable.
Do NOT skip steps. Do NOT combine steps.
All steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** **Create feature flags package** - Set up package structure and types
- [ ] **[Agent]** **Implement flag schema** - Define Zod schemas for type safety
- [ ] **[Agent]** **Create useFeatureFlag hook** - React hook for flag evaluation
- [ ] **[Agent]** **Add tenant targeting** - Implement tenant-specific and percentage rollout
- [ ] **[Agent]** **Configure tier-based access** - Add subscription level controls
- [ ] **[Agent]** **Integrate with site.config.ts** - Enable per-client flag configuration
- [ ] **[Agent]** **Add analytics tracking** - Track feature usage and performance
- [ ] **[Agent]** **Implement environment variables** - Support emergency feature toggles
- [ ] **[Agent]** **Create comprehensive tests** - Test all flag scenarios and edge cases
- [ ] **[Human]** **Update documentation** - Document feature flag usage patterns

> ⚠️ **Agent Question**: Ask human before proceeding if step 4 conflicts with existing tenant context system.

## Commands

```bash
# Create feature flags package
mkdir -p packages/feature-flags/src
cd packages/feature-flags

# Initialize package
pnpm init

# Install dependencies
pnpm add zod
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Create package structure
mkdir -p src/{hooks,types,utils}

# Build package
pnpm build

# Run tests
pnpm test

# Install in workspace
cd ../../
pnpm install
```

## Code Style

```typescript
// Feature flag schema definition
const flagSchema = z.object({
  enabled: z.boolean(),
  rollout: z.number().min(0).max(100).optional(),
  tenantIds: z.array(z.string()).optional(),
  tiers: z.array(z.enum(['starter', 'professional', 'enterprise'])).optional(),
});

// Feature flags configuration
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
  NEW_CHECKOUT_FLOW: process.env.NEXT_PUBLIC_FF_NEW_CHECKOUT === 'true',
} as const;

// React hook for flag evaluation
export function useFeatureFlag(
  flag: keyof typeof featureFlags,
  tenantId: string,
  tier: string
): boolean {
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

**Naming conventions:**

- Flag names: `camelCase` - `newLeadScoringEngine`, `experimentalPPR`
- Environment variables: `UPPER_SNAKE_CASE` - `NEXT_PUBLIC_FF_*`
- Functions: `camelCase` - `useFeatureFlag`, `hashString`
- Types: `PascalCase` - `FeatureFlagConfig`, `TenantTier`

## Boundaries

| Tier             | Scope                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Create feature flags package; implement React hooks; add tenant targeting; integrate with site.config.ts; add analytics tracking; test scenarios |
| ⚠️ **Ask first** | Modifying existing tenant context system; changing analytics implementation; updating environment variable patterns                              |
| 🚫 **Never**     | Bypassing feature flag checks; hardcoding feature states; ignoring tier-based access control; modifying tenant data structure                    |

## Success Verification

How the agent (or reviewer) confirms the task is truly done.
All verification steps must be markable with checkboxes and assigned to agent or human.

- [ ] **[Agent]** Run `pnpm -r test` — All feature flag tests pass
- [ ] **[Agent]** Test tenant targeting — Flags work correctly for different tenants
- [ ] **[Agent]** Verify percentage rollout — Rollout percentages work as expected
- [ ] **[Agent]** Check tier-based access — Subscription levels control access correctly
- [ ] **[Agent]** Test site.config.ts integration — Per-client configuration works
- [ ] **[Agent]** Verify analytics tracking — Feature usage tracked properly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Hash consistency:** Tenant ID hashing must be deterministic for consistent rollout
- **Environment variables:** Feature flags must work without environment variables set
- **Performance:** Feature flag evaluation must be fast (not block rendering)
- **Cache invalidation:** Flag changes must propagate quickly across deployments
- **Analytics privacy:** Feature tracking must respect privacy regulations

## Out of Scope

- Creating a full-featured feature flag service (like LaunchDarkly)
- Implementing real-time flag updates without deployment
- Adding complex user segmentation beyond tenant and tier
- Creating admin UI for flag management

## References

- [Domain 1.6 Git Branching Strategy](../docs/plan/domain-1/1.6-git-branching-strategy-trunk-based-development-feature-flags.md)
- [LaunchDarkly Documentation](../docs/guides/launchdarkly-documentation.md)
- [Zod Documentation](../docs/guides/zod-documentation.md)
- [Multi-tenant Architecture](../docs/plan/domain-4/4.1-multi-tenant-architecture.md)
