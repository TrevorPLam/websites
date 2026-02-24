---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-003
title: 'Fix performance budget validation system'
status: done
priority: high
type: fix
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: fix/DOMAIN-0-003-budget-validation
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-0-003 · Fix performance budget validation system

## Objective

Repair the broken bundle size budget validation system that is failing due to missing client template, preventing enforcement of performance budgets across the platform.

---

## Context

The performance budget validation script is failing because it expects a client template that doesn't exist, breaking the automated bundle size enforcement that protects against performance regressions.

- **Codebase area:** `scripts/perf/validate-budgets.ts` — bundle size validation system
- **Related files:** `.size-limit.json`, `turbo.json`, client configuration files
- **Dependencies**: size-limit package, TypeScript compilation
- **Prior work**: Budget limits configured but validation script broken
- **Constraints**: Must maintain existing budget limits and validation logic

---

## Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Language   | TypeScript 5.9.3         |
| Runtime    | Node.js 22 LTS           |
| Build      | Turbo 2.8.10             |
| Bundling   | Next.js 16.1.5           |
| Size Limit | size-limit configuration |

---

## Acceptance Criteria

- [ ] **[Agent]** Budget validation script handles missing client template gracefully
- [ ] **[Agent]** `pnpm validate:budgets` command executes successfully without errors
- [ ] **[Agent]** Bundle size limits are enforced for existing packages
- [ ] **[Agent]** Performance budget reporting works correctly
- [ ] **[Agent]** CI/CD can run budget validation without failures
- [ ] **[Agent]** Budget validation provides meaningful output for developers

---

## Implementation Plan

- [ ] **[Agent]** **Fix Script Error Handling** — Add graceful handling for missing client template in validate-budgets.ts
- [ ] **[Agent]** **Update Client Path Logic** — Make client template detection optional or provide fallback
- [ ] **[Agent]** **Test Budget Validation** — Verify script works with current package structure
- [ ] **[Agent]** **Validate Budget Limits** — Ensure existing size limits are still enforced
- [ ] **[Agent]** **Update Documentation** — Document any changes to budget validation process

---

## Commands

```bash
# Run budget validation (currently failing)
pnpm validate:budgets

# Test fixed script
npx tsx scripts/perf/validate-budgets.ts

# Check size limit configuration
cat .size-limit.json

# Validate all packages build
pnpm build
```

---

## Code Style

```typescript
// ✅ Correct — graceful handling of missing client
const clientPath = path.join(process.cwd(), 'clients', 'starter-template');
if (!fs.existsSync(clientPath)) {
  console.warn('Client template not found, skipping client budget validation');
  // Continue with package validation only
}

// ❌ Incorrect — hard failure on missing client
const clientPath = path.join(process.cwd(), 'clients', 'starter-template');
// This throws and stops all validation
```

---

## Boundaries

| Tier             | Scope                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify `scripts/perf/validate-budgets.ts`; update error handling; test budget validation; maintain existing budget limits    |
| ⚠️ **Ask first** | Changing budget limits in `.size-limit.json`; modifying validation logic beyond error handling; adding new budget categories |
| 🚫 **Never**     | Removing budget validation entirely; changing size-limit configuration format; bypassing budget checks                       |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm validate:budgets` — command executes successfully
- [ ] **[Agent]** Check output — meaningful budget validation results displayed
- [ ] **[Agent]** Test with oversized bundle — validation properly flags size violations
- [ ] **[Agent]** Verify CI integration — budget validation works in CI environment
- [ ] **[Agent]** Confirm package budgets — all package budgets still validated
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Missing Client Template:** The script should not fail when client templates don't exist
- **Package Structure:** Handle cases where packages directory structure varies
- **Size Limit Format:** Ensure compatibility with current .size-limit.json format
- **Turbo Integration:** Budget validation should work with Turbo build system

---

## Out of Scope

- Changing actual budget limits
- Adding new budget categories
- Modifying size-limit package configuration
- Creating new client templates

---

## References

- [size-limit Documentation](https://github.com/ai/size-limit)
- `scripts/perf/validate-budgets.ts` — current failing implementation
- `.size-limit.json` — existing budget configuration
