<<<<<<< Updated upstream

# TODO

- [x] DOMAIN-1-001 · Upgrade pnpm workspace to catalog strict mode
- [x] DOMAIN-1-002 · Upgrade Turborepo to composable tasks configuration
- [x] DOMAIN-1-003 · Reorganize directory structure to match domain-1 specification
- [x] DOMAIN-1-004 · Enhance Renovate configuration with 2026 best practices
- [x] DOMAIN-1-005 · Implement Git branching strategy and branch protection
- [x] DOMAIN-1-006 · Implement feature flags system for gradual rollout
- [x] DOMAIN-2-001 · Implement complete Zod config schema with validation
- [x] DOMAIN-2-002 · Implement config validation CI step with conflict detection
- [x] DOMAIN-2-003 · Implement golden path CLI pnpm create-site
- [x] DOMAIN-3-001 · Adopt Feature-Sliced Design rationale and conventions
- [x] DOMAIN-3-002 · Implement complete layer architecture baseline
- [x] DOMAIN-3-003 · Document and enforce @x cross-slice import notation
- [x] DOMAIN-3-004 · Add Steiger CI integration entrypoint
- [x] DOMAIN-3-005 · Define FSD layer mapping for every package
- [x] DOMAIN-3-006 · Define FSD structure guidance for marketing sites
- [x] DOMAIN-3-007 · Add per-package AGENTS.md stubs
- [x] DOMAIN-3-008 · Create root AGENTS.md master context
- [x] DOMAIN-3-009 · Create CLAUDE.md sub-agent definitions
- [x] DOMAIN-3-010 · Create AI agent cold-start checklist + MCP config
- [x] DOMAIN-4-001 · Complete middleware.ts with all security layers
- [x] DOMAIN-4-002 · Implement createServerAction() security wrapper
- [x] DOMAIN-4-003 · Complete Supabase RLS implementation
- [x] DOMAIN-4-004 · Implement RLS isolation test suite
- [x] DOMAIN-4-005 · Implement per-tenant secrets management
- [x] DOMAIN-4-006 · Implement post-quantum cryptography abstraction
- [x] DOMAIN-5-001 · Complete next.config.ts performance baseline
- [x] DOMAIN-5-002 · Define four-mode rendering decision matrix
- [x] DOMAIN-5-003 · Implement per-tenant use cache patterns
- [x] DOMAIN-5-004 · Create PPR marketing page template
- [x] DOMAIN-5-005 · Document React compiler rollout strategy
- [x] DOMAIN-5-006 · Implement LCP/INP/CLS optimization baseline
- [x] DOMAIN-5-007 · Implement Core Web Vitals Tinybird pipeline
- [x] DOMAIN-5-008 · Enforce bundle size budgets
- [x] # DOMAIN-5-009 · Configure Lighthouse CI thresholds

# TODO: Multi-Client Multi-Site Monorepo Tasks

This file provides a consolidated, checkable task list of all domain tasks across the monorepo.

## Task Status Overview

| Domain    | Total Tasks | Completed | In Progress | Pending |
| --------- | ----------- | --------- | ----------- | ------- |
| Domain 1  | 3           | 0         | 0           | 3       |
| Domain 2  | 3           | 0         | 0           | 3       |
| Domain 3  | 6           | 0         | 0           | 6       |
| Domain 4  | 6           | 0         | 0           | 6       |
| Domain 5  | 9           | 0         | 0           | 9       |
| Domain 6  | 4           | 0         | 0           | 4       |
| Domain 7  | 5           | 0         | 0           | 5       |
| **Total** | **36**      | **0**     | **0**       | **36**  |

## Domain 1: FOUNDATION & INFRASTRUCTURE

### Pending Tasks

- [ ] [DOMAIN-1-001](tasks/domain-1/DOMAIN-1-001-upgrade-pnpm-workspace-catalog-strict.md) - Upgrade pnpm workspace catalog to strict mode
- [ ] [DOMAIN-1-002](tasks/domain-1/DOMAIN-1-002-turborepo-composable-tasks.md) - Implement Turborepo composable tasks
- [ ] [DOMAIN-1-003](tasks/domain-1/DOMAIN-1-003-directory-structure-reorganization.md) - Reorganize directory structure

## Domain 2: CONFIGURATION-AS-CODE

### Pending Tasks

- [ ] [DOMAIN-2-001](tasks/domain-2/DOMAIN-2-001-complete-config-schema.md) - Complete Zod schema implementation
- [ ] [DOMAIN-2-002](tasks/domain-2/DOMAIN-2-002-config-validation-ci-step.md) - Config validation CI step
- [ ] [DOMAIN-2-003](tasks/domain-2/DOMAIN-2-003-golden-path-cli-create-site.md) - Golden path CLI: pnpm create-site

## Domain 3: FEATURE-SLICED DESIGN v2.1

### Pending Tasks

- [ ] [DOMAIN-3-001](tasks/domain-3/DOMAIN-3-001-implement-fsd-architecture.md) - Implement FSD v2.1 architecture
- [ ] [DOMAIN-3-002](tasks/domain-3/DOMAIN-3-002-steiger-ci-integration.md) - Implement Steiger FSD linter CI integration
- [ ] [DOMAIN-3-003](tasks/domain-3/DOMAIN-3-003-agents-md-stubs.md) - Create per-package AGENTS.md stubs
- [ ] [DOMAIN-3-004](tasks/domain-3/DOMAIN-3-004-root-agents-md.md) - Update root AGENTS.md master context file
- [ ] [DOMAIN-3-005](tasks/domain-3/DOMAIN-3-005-claude-sub-agents.md) - Create CLAUDE.md sub-agent definitions
- [ ] [DOMAIN-3-006](tasks/domain-3/DOMAIN-3-006-cold-start-checklist.md) - Create cold-start checklist

## Domain 4: SECURITY (Defense in Depth)

### Pending Tasks

- [ ] [DOMAIN-4-001](tasks/domain-4/DOMAIN-4-001-complete-middleware.md) - Complete middleware.ts with all security layers
- [ ] [DOMAIN-4-002](tasks/domain-4/DOMAIN-4-002-server-action-wrapper.md) - Enhanced createServerAction wrapper
- [ ] [DOMAIN-4-003](tasks/domain-4/DOMAIN-4-003-supabase-rls-implementation.md) - Complete Supabase RLS implementation
- [ ] [DOMAIN-4-004](tasks/domain-4/DOMAIN-4-004-rls-isolation-test-suite.md) - RLS isolation test suite
- [ ] [DOMAIN-4-005](tasks/domain-4/DOMAIN-4-005-per-tenant-secrets.md) - Per-tenant secrets management
- [ ] [DOMAIN-4-006](tasks/domain-4/DOMAIN-4-006-post-quantum-crypto.md) - Post-quantum cryptography abstraction

## Domain 7: MULTI-TENANCY

### Pending Tasks

- [ ] [DOMAIN-7-001](tasks/domain-7/DOMAIN-7-001-tenant-resolution.md) - Complete tenant resolution with routing strategies
- [ ] [DOMAIN-7-002](tasks/domain-7/DOMAIN-7-002-billing-suspension.md) - Billing status check with suspension pattern
- [ ] [DOMAIN-7-003](tasks/domain-7/DOMAIN-7-003-rate-limiting.md) - Noisy neighbor prevention with complete rate limiting
- [ ] [DOMAIN-7-004](tasks/domain-7/DOMAIN-7-004-vercel-domains.md) - Vercel for Platforms programmatic domain lifecycle
- [ ] [DOMAIN-7-005](tasks/domain-7/DOMAIN-7-005-saml-sso.md) - Multi-tenant auth with SAML 2.0 enterprise SSO

## Domain 6: DATA ARCHITECTURE

### Pending Tasks

- [ ] [DOMAIN-6-001](tasks/domain-6/DOMAIN-6-001-connection-pooling.md) - PgBouncer/Supavisor connection pooling complete configuration
- [ ] [DOMAIN-6-002](tasks/domain-6/DOMAIN-6-002-electricsql-sync.md) - ElectricSQL local-first sync pattern implementation
- [ ] [DOMAIN-6-003](tasks/domain-6/DOMAIN-6-003-pglite-wasm.md) - PGlite WASM pattern for on-device state management
- [ ] [DOMAIN-6-004](tasks/domain-6/DOMAIN-6-004-schema-migration-safety.md) - Schema migration safety with down migrations

## Domain 5: PERFORMANCE ENGINEERING

### Pending Tasks

- [ ] [DOMAIN-5-001](tasks/domain-5/DOMAIN-5-001-complete-next-config.md) - Complete next.config.ts with Next.js 16 optimization
- [ ] [DOMAIN-5-002](tasks/domain-5/DOMAIN-5-002-rendering-decision-matrix.md) - Four-mode rendering decision matrix
- [ ] [DOMAIN-5-003](tasks/domain-5/DOMAIN-5-003-per-tenant-cache-patterns.md) - Per-tenant use cache patterns
- [ ] [DOMAIN-5-004](tasks/domain-5/DOMAIN-5-004-ppr-marketing-template.md) - PPR marketing page template
- [ ] [DOMAIN-5-005](tasks/domain-5/DOMAIN-5-005-react-compiler-rollout.md) - React Compiler rollout strategy
- [ ] [DOMAIN-5-006](tasks/domain-5/DOMAIN-5-006-core-web-vitals-optimization.md) - Core Web Vitals optimization
- [ ] [DOMAIN-5-007](tasks/domain-5/DOMAIN-5-007-tinybird-cwv-pipeline.md) - Core Web Vitals → Tinybird pipeline
- [ ] [DOMAIN-5-008](tasks/domain-5/DOMAIN-5-008-bundle-size-budgets.md) - Bundle size budgets
- [ ] [DOMAIN-5-009](tasks/domain-5/DOMAIN-5-009-lighthouse-ci.md) - Lighthouse CI configuration

## Task Execution Guidelines

### Task Status Updates

When working on a task:

1. Update the task file status in the YAML frontmatter (`pending` → `in-progress` → `done`)
2. Update this TODO.md file to reflect the status change
3. Add completion notes to the task file if needed

### Task Completion Criteria

A task is considered **complete** when:

- All acceptance criteria in the task file are met
- The implementation is tested and verified
- Documentation is updated
- The task file status is set to `done`

### Priority Execution Order

1. **P0 (Critical)**: Domain 1, Domain 2, Domain 4 (foundation)
2. **P1 (High)**: Domain 3, Domain 5 (performance and features)
3. **P2 (Medium)**: Remaining optimization and monitoring tasks

---

_Last updated: 2026-02-23_
_Total tasks: 27_

> > > > > > > Stashed changes
