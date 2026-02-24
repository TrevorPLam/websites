---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-005
title: 'Replace any types with proper TypeScript types'
status: pending
priority: medium
type: refactor
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: refactor/DOMAIN-0-005-fix-any-types
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-0-005 · Replace any types with proper TypeScript types

## Objective

Eliminate all instances of `any` type usage throughout the codebase and replace them with proper TypeScript types to improve type safety and developer experience.

---

## Context

The repository analysis identified 34 instances of `any` type usage across packages, reducing type safety and making the codebase harder to maintain. These need to be replaced with specific, type-safe alternatives.

- **Codebase area**: Type definitions across all packages, particularly in test utilities and component props
- **Related files**: 34 files with any type usage, including test mocks, component definitions, and utility functions
- **Dependencies**: TypeScript 5.9.3, existing type definitions
- **Prior work**: Some type safety improvements already made, but any types remain
- **Constraints**: Must maintain existing functionality while improving type safety

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Language | TypeScript 5.9.3                    |
| Runtime  | Node.js 22 LTS                      |
| Types    | Existing interfaces + new types     |
| Testing  | Vitest + Jest                       |
| Linting  | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

- [ ] **[Agent]** All 34 instances of `any` type replaced with proper TypeScript types
- [ ] **[Agent]** Type safety maintained without breaking existing functionality
- [ ] **[Agent]** New type definitions created where needed for complex data structures
- [ ] **[Agent]** TypeScript compilation passes with zero any type usage
- [ ] **[Agent]** Test files maintain functionality with improved typing
- [ ] **[Agent]** Component props properly typed with specific interfaces

---

## Implementation Plan

- [ ] **[Agent]** **Audit any Types** — Find and catalog all instances of any type usage
- [ ] **[Agent]** **Create Type Definitions** — Define proper interfaces for complex data structures
- [ ] **[Agent]** **Replace Test Mocks** — Update test utility types with specific interfaces
- [ ] **[Agent]** **Fix Component Props** — Replace any in component props with specific types
- [ ] **[Agent]** **Validate Type Safety** — Ensure all replacements maintain functionality

---

## Commands

```bash
# Find all any type usage
grep -r ": any" packages/ --include="*.ts" --include="*.tsx"

# Find any in array/object types
grep -r "any\[\]" packages/ --include="*.ts" --include="*.tsx"

# Type check after changes
pnpm type-check

# Run tests to ensure functionality maintained
pnpm test
```

---

## Code Style

```typescript
// ✅ Correct — specific type definitions
interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

const handler: (data: unknown) => Promise<ApiResponse<string>> = async (data) => {
  if (typeof data === 'string') {
    return { data: data.toUpperCase(), error: null, status: 200 };
  }
  return { data: '', error: 'Invalid input', status: 400 };
};

// ✅ Correct — generic constraints
function processItems<T extends { id: string }>(items: T[]): T[] {
  return items.filter((item) => item.id);
}

// ❌ Incorrect — any types
const handler: (data: any) => Promise<any> = async (data: any) => {
  return { data: data, error: null };
};

function processItems(items: any[]): any[] {
  return items;
}
```

---

## Boundaries

| Tier             | Scope                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Replace any types with proper TypeScript; create new interfaces as needed; maintain existing functionality; improve type safety      |
| ⚠️ **Ask first** | Changing function signatures that affect public APIs; modifying complex type hierarchies; updating external library type definitions |
| 🚫 **Never**     | Using type assertions (as any) to bypass type system; breaking existing functionality; removing necessary type flexibility           |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm type-check` — zero compilation errors
- [ ] **[Agent]** Search for any types — confirm no any types remain
- [ ] **[Agent]** Run `pnpm test` — all tests pass with new types
- [ ] **[Agent]** Check component props — properly typed interfaces
- [ ] **[Agent]** Verify test utilities — type-safe mock implementations
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Unknown vs Any**: Use `unknown` for truly untyped data instead of `any`
- **Generic Types**: Create generic interfaces for reusable patterns
- **Test Mocks**: Test utilities may need flexible but typed interfaces
- **External Libraries**: Some libraries may have loosely typed APIs requiring careful handling

---

## Out of Scope

- Changing external library type definitions
- Modifying public API signatures beyond type improvements
- Adding new functionality beyond type safety improvements
- Rewriting algorithms for performance (focus on types only)

---

## References

- [TypeScript Handbook: Type Safety](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Why Avoid Any Type](https://typescript-eslint.io/rules/no-explicit-any/)
- Current any type usage patterns found in repository analysis
