---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-001
title: 'Fix TypeScript compilation failures in Supabase integration'
status: done
priority: critical
type: fix
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: fix/DOMAIN-0-001-supabase-types
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-0-001 · Fix TypeScript compilation failures in Supabase integration

## Objective

Resolve critical TypeScript compilation errors in the Supabase integration that are blocking all builds and deployments. This is the highest priority issue preventing the platform from being production-ready.

---

## Context

The repository analysis identified critical TypeScript compilation failures in `packages/integrations/supabase/pooling.ts` that are blocking the entire build system.

- **Codebase area:** `packages/integrations/supabase/` — database connection pooling and client management
- **Related files:** `packages/integrations/supabase/pooling.ts`, `packages/integrations/supabase/types.ts`, `packages/infrastructure/security/crypto-provider.ts`
- **Dependencies:** `@supabase/supabase-js ^2.97.0`, TypeScript 5.9.3
- **Prior work:** Connection pooling architecture implemented but type definitions incomplete
- **Constraints:** Must maintain backward compatibility with existing Supabase client usage

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Language | TypeScript 5.9.3                    |
| Runtime  | Node.js 22 LTS                      |
| Database | Supabase (PostgreSQL 16)            |
| Client   | @supabase/supabase-js ^2.97.0       |
| Linting  | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

- [ ] **[Agent]** `Database` type is properly exported from `types.ts` with complete schema definition
- [ ] **[Agent]** SupabaseClient type constraints in `pooling.ts` are correctly typed as `'public'`
- [ ] **[Agent]** Crypto provider algorithm names are compatible with base class interface
- [ ] **[Agent]** `pnpm type-check` passes with zero errors across all packages
- [ ] **[Agent]** All existing Supabase functionality remains working (no breaking changes)
- [ ] **[Agent]** Connection pooling features continue to work as expected

---

## Implementation Plan

- [ ] **[Agent]** **Database Type Definition** — Add complete `Database` interface to `types.ts` with all table definitions
- [ ] **[Agent]** **Fix Client Type Constraints** — Update SupabaseClient generic constraints in `pooling.ts` to use `'public'` schema
- [ ] **[Agent]** **Fix Crypto Provider Types** — Update algorithm name types in crypto providers to match base class
- [ ] **[Agent]** **Type Validation** — Run `pnpm type-check` to ensure all compilation errors are resolved
- [ ] **[Agent]** **Functionality Test** — Verify all Supabase integration tests pass

---

## Commands

```bash
# Type check all packages
pnpm type-check

# Type check specific package
pnpm --filter @repo/integrations-supabase type-check

# Run Supabase tests
pnpm --filter @repo/integrations-supabase test

# Build all packages
pnpm build
```

---

## Code Style

```typescript
// ✅ Correct — proper Database type export
export interface Database {
  public: {
    Tables: {
      leads: SupabaseLeadRow;
      // Add other table definitions
    };
    Functions: {
      get_pool_health: {
        Returns: PoolHealth;
      };
    };
  };
}

// ✅ Correct — proper client typing
const client: SupabaseClient<Database, 'public', 'public'> = createPooledClient(url, key);

// ❌ Incorrect — missing Database export
// This causes compilation failures
```

---

## Boundaries

| Tier             | Scope                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify `packages/integrations/supabase/types.ts`, `packages/integrations/supabase/pooling.ts`; run type-check before commit; maintain existing API |
| ⚠️ **Ask first** | Changing Supabase client instantiation patterns; modifying connection pooling logic beyond type fixes                                              |
| 🚫 **Never**     | Breaking existing Supabase functionality; changing database schemas; modifying environment variable patterns                                       |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm type-check` — zero compilation errors
- [ ] **[Agent]** Run `pnpm build` — all packages build successfully
- [ ] **[Agent]** Run `pnpm --filter @repo/integrations-supabase test` — all tests pass
- [ ] **[Agent]** Confirm `Database` type is properly exported and used
- [ ] **[Agent]** Verify connection pooling functions work with new types
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Supabase Generic Constraints:** The third generic parameter must be `'public'` not a variable type for proper typing
- **Database Schema:** Must include all tables that are referenced in the codebase, not just leads
- **Crypto Provider Inheritance:** Algorithm names in child classes must be assignable to parent class type
- **Import Paths:** Ensure Database type is imported correctly in pooling.ts

---

## Out of Scope

- Database schema modifications
- Supabase client API changes
- Connection pooling algorithm changes
- Environment variable restructuring

---

## References

- [Supabase TypeScript Documentation](https://supabase.com/docs/reference/javascript/typescript-support)
- `packages/integrations/supabase/pooling.ts` — current implementation with type errors
- `packages/integrations/supabase/types.ts` — existing type definitions
