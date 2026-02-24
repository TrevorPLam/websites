---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-004
title: 'Centralize environment variable configuration'
status: done
priority: medium
type: refactor
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: refactor/DOMAIN-0-004-centralize-config
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-0-004 · Centralize environment variable configuration

## Objective

Create a centralized configuration management system to replace scattered process.env usage throughout the codebase, improving security and maintainability of environment variable handling.

---

## Context

The repository analysis identified 53+ instances of direct process.env usage scattered across files, creating security risks and maintenance challenges. A centralized configuration system will improve type safety and security.

- **Codebase area**: Environment variable usage across all packages
- **Related files**: Multiple files using process.env directly for Supabase, feature flags, and other config
- **Dependencies**: Node.js environment variables, TypeScript
- **Prior work**: Individual environment variable validation in various packages
- **Constraints**: Must maintain backward compatibility with existing environment variable names

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Language   | TypeScript 5.9.3                    |
| Runtime    | Node.js 22 LTS                      |
| Validation | Zod ^3.25.76                        |
| Config     | Environment variables               |
| Linting    | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

- [ ] **[Agent]** Centralized Config class created with type-safe environment variable access
- [ ] **[Agent]** All direct process.env usage replaced with Config class methods
- [ ] **[Agent]** Environment variable validation with Zod schemas
- [ ] **[Agent]** Backward compatibility maintained for existing environment variable names
- [ ] **[Agent]** Improved error messages for missing or invalid environment variables
- [ ] **[Agent]** TypeScript compilation passes with new configuration system

---

## Implementation Plan

- [ ] **[Agent]** **Create Config Class** — Implement centralized configuration class with type-safe getters
- [ ] **[Agent]** **Add Validation** — Use Zod schemas for environment variable validation
- [ ] **[Agent]** **Replace Direct Usage** — Update all files using process.env directly
- [ ] **[Agent]** **Add Error Handling** — Improve error messages for configuration issues
- [ ] **[Agent]** **Test Configuration** — Verify all environment variables work through new system

---

## Commands

```bash
# Find all process.env usage
grep -r "process\.env" packages/ --include="*.ts" --include="*.tsx"

# Type check after changes
pnpm type-check

# Test configuration loading
pnpm --filter @repo/infra dev

# Validate environment variables
node -e "console.log(require('./packages/infra/src/config').config.supabase)"
```

---

## Code Style

```typescript
// ✅ Correct — centralized configuration
export class Config {
  static get supabase() {
    return {
      url: this.required('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: this.required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      serviceKey: this.required('SUPABASE_SERVICE_ROLE_KEY'),
    };
  }

  private static required(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}

// Usage
const supabaseUrl = Config.supabase.url;

// ❌ Incorrect — scattered process.env usage
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

---

## Boundaries

| Tier             | Scope                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create Config class; update process.env usage; add validation; maintain backward compatibility; test all configuration access patterns |
| ⚠️ **Ask first** | Changing environment variable names; adding new validation rules; modifying configuration structure beyond centralization              |
| 🚫 **Never**     | Breaking existing environment variable contracts; removing validation; exposing secrets in client bundles                              |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm type-check` — zero compilation errors
- [ ] **[Agent]** Run `pnpm build` — all packages build successfully
- [ ] **[Agent]** Test environment variable loading — all required variables accessible through Config class
- [ ] **[Agent]** Verify error handling — proper error messages for missing variables
- [ ] **[Agent]** Check backward compatibility — existing environment variable names work
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Client vs Server Variables:** Ensure client-safe variables are properly separated from server-only variables
- **Type Safety:** Maintain TypeScript types for all configuration values
- **Runtime Validation:** Validate environment variables at startup, not just at access time
- **Default Values:** Some variables may need sensible defaults while maintaining required validation

---

## Out of Scope

- Changing existing environment variable names
- Adding new environment variables
- Modifying .env.example files
- Changing deployment configuration

---

## References

- [Environment Variables Best Practices](https://12factor.net/config)
- [Zod Validation Documentation](https://zod.dev/)
- Current process.env usage patterns found in repository analysis
