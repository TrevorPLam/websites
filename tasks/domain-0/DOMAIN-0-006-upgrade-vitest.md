---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-006
title: 'Upgrade Vitest to version 4.x for performance improvements'
status: pending
priority: low
type: refactor
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: refactor/DOMAIN-0-006-upgrade-vitest
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*)
---

# DOMAIN-0-006 · Upgrade Vitest to version 4.x for performance improvements

## Objective

Upgrade Vitest from version 3.2.4 to 4.0.18 to gain performance improvements, better TypeScript support, and enhanced testing capabilities while maintaining compatibility with existing test suite.

---

## Context

The repository analysis identified outdated testing dependencies. Vitest 4.x offers significant performance improvements and better TypeScript integration that will benefit the extensive test suite.

- **Codebase area**: Testing infrastructure and configuration
- **Related files**: `package.json`, `vitest.config.ts`, test files across packages
- **Dependencies**: Current Vitest 3.2.4, target Vitest 4.0.18
- **Prior work**: Comprehensive test suite implemented with Vitest 3.x
- **Constraints**: Must maintain all existing test functionality and compatibility

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Language | TypeScript 5.9.3                    |
| Runtime  | Node.js 22 LTS                      |
| Testing  | Vitest 4.0.18 (upgrade from 3.2.4)  |
| Coverage | @vitest/coverage-v8 4.0.18          |
| Linting  | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

- [ ] **[Agent]** Vitest upgraded to version 4.0.18 across all packages
- [ ] **[Agent]** @vitest/coverage-v8 upgraded to matching version 4.0.18
- [ ] **[Agent]** All existing tests continue to pass without modification
- [ ] **[Agent]** Test configuration updated for Vitest 4.x compatibility
- [ ] **[Agent]** Performance improvements verified in test execution
- [ ] **[Agent]** TypeScript integration improvements confirmed

---

## Implementation Plan

- [ ] **[Agent]** **Update Dependencies** — Upgrade Vitest and coverage packages to 4.0.18
- [ ] **[Agent]** **Check Breaking Changes** — Review Vitest 4.x breaking changes documentation
- [ ] **[Agent]** **Update Configuration** — Modify vitest.config.ts for 4.x compatibility
- [ ] **[Agent]** **Test Compatibility** — Run full test suite to ensure compatibility
- [ ] **[Agent]** **Verify Performance** — Confirm performance improvements in test execution

---

## Commands

```bash
# Update Vitest dependencies
pnpm add -D vitest@4.0.18 @vitest/coverage-v8@4.0.18

# Check for breaking changes
npx vitest --version

# Run tests with new version
pnpm test

# Check test performance
pnpm test -- --reporter=verbose
```

---

## Code Style

```typescript
// ✅ Correct — Vitest 4.x configuration
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});

// ❌ Incorrect — outdated configuration patterns
// May need updates for Vitest 4.x compatibility
```

---

## Boundaries

| Tier             | Scope                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Update Vitest dependencies; modify configuration files; test compatibility; verify performance improvements                 |
| ⚠️ **Ask first** | Changing test assertions or test logic; modifying test file structure; updating test utilities beyond configuration changes |
| 🚫 **Never**     | Modifying test functionality beyond compatibility; changing test framework APIs; breaking existing test patterns            |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm test` — all tests pass with Vitest 4.x
- [ ] **[Agent]** Check version — `npx vitest --version` shows 4.0.18
- [ ] **[Agent]** Verify coverage — coverage reports generate correctly
- [ ] **[Agent]** Test performance — improved test execution speed
- [ ] **[Agent]** Check TypeScript — better TypeScript integration confirmed
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Breaking Changes**: Vitest 4.x may have configuration changes requiring updates
- **Coverage Provider**: Coverage package must match Vitest version exactly
- **Test Environment**: jsdom configuration may need updates for 4.x
- **Performance Gains**: Some tests may run faster, affecting timeout configurations

---

## Out of Scope

- Rewriting existing tests for new features
- Changing test logic or assertions
- Adding new test capabilities beyond upgrade
- Modifying test file organization

---

## References

- [Vitest 4.0 Migration Guide](https://vitest.dev/guide/migration.html)
- [Vitest 4.0 Release Notes](https://github.com/vitest-dev/vitest/releases/tag/v4.0.0)
- Current Vitest configuration in repository
