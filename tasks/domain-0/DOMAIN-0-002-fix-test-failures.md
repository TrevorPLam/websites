---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-0-002
title: 'Resolve test suite failures and timeouts'
status: done
priority: critical
type: fix
created: 2026-02-23
updated: 2026-02-23
owner: ''
branch: fix/DOMAIN-0-002-test-failures
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(vitest:*)
---

# DOMAIN-0-002 · Resolve test suite failures and timeouts

## Objective

Fix the 55 failing tests that are blocking the CI/CD pipeline, focusing on integration adapter timeouts and directory import issues that are causing test suite instability.

---

## Context

The repository analysis revealed critical test failures that are preventing reliable deployments. Tests are timing out and failing due to import configuration issues.

- **Codebase area:** Test files across packages, particularly integration adapters
- **Related files:** `packages/integrations/shared/src/__tests__/adapter.test.ts`, `packages/features/src/contact/lib/__tests__/contact-actions.test.ts`, `packages/infrastructure/index.ts`
- **Dependencies:** Vitest 3.2.4, Jest 30.2.0, Playwright 1.58.2
- **Prior work:** Comprehensive test suite implemented but with timeout and import issues
- **Constraints:** Must maintain existing test coverage and functionality

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Language | TypeScript 5.9.3                    |
| Runtime  | Node.js 22 LTS                      |
| Testing  | Vitest 3.2.4 + Jest 30.2.0          |
| Mocking  | MSW 2.11.2                          |
| Linting  | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

- [ ] **[Agent]** Integration adapter tests pass with increased timeout configuration
- [ ] **[Agent]** Directory import issues in infrastructure package are resolved
- [ ] **[Agent]** Contact form tests pass with proper mock configuration
- [ ] **[Agent]** All 55 currently failing tests are resolved and passing
- [ ] **[Agent]** Test suite runs to completion without timeouts or unhandled errors
- [ ] **[Agent]** Overall test success rate returns to 100% (286/286 tests passing)

---

## Implementation Plan

- [ ] **[Agent]** **Fix Integration Timeouts** — Increase timeout for integration adapter tests from 5s to 10s
- [ ] **[Agent]** **Resolve Directory Imports** — Fix directory import issues in infrastructure/index.ts with explicit file extensions
- [ ] **[Agent]** **Fix Contact Form Tests** — Resolve mock configuration issues in contact action tests
- [ ] **[Agent]** **Update Test Configuration** — Adjust Vitest configuration for better timeout handling
- [ ] **[Agent]** **Validate Test Suite** — Run full test suite to ensure all failures are resolved

---

## Commands

```bash
# Run all tests
pnpm test

# Run tests with increased timeout
pnpm test -- --timeout 10000

# Run specific failing test file
pnpm --filter @repo/integrations-shared test adapter.test.ts

# Run tests with coverage
pnpm test:coverage

# Run contact form tests specifically
pnpm --filter @repo/features test contact-actions.test.ts
```

---

## Code Style

```typescript
// ✅ Correct — increased timeout for integration tests
it('should classify network errors as retryable', async () => {
  const result = await adapter.testOperation(true);
  expect(result.success).toBe(false);
}, 10000); // Increased timeout to 10s

// ✅ Correct — explicit file extensions for imports
export * from './security/index.js';
export * from './auth/index.js';

// ❌ Incorrect — directory imports causing failures
export * from './security';
export * from './auth';
```

---

## Boundaries

| Tier             | Scope                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Modify test files, update Vitest configuration, fix import statements; run tests before commit; maintain test coverage    |
| ⚠️ **Ask first** | Changing test logic or assertions; modifying mock data structures; updating test dependencies                             |
| 🚫 **Never**     | Removing failing tests without fixing underlying issues; changing test framework; modifying production code to pass tests |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm test` — all 286 tests pass (0 failures)
- [ ] **[Agent]** Run `pnpm test:coverage` — coverage report generates successfully
- [ ] **[Agent]** Check test execution time — no tests timeout unexpectedly
- [ ] **[Agent]** Verify integration adapter tests specifically pass
- [ ] **[Agent]** Confirm contact form tests pass with proper mocks
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Test Timeouts:** Integration tests may need longer timeouts due to network operations
- **Mock Configuration:** Ensure MSW mocks are properly set up before tests run
- **Directory Imports:** Node.js ES modules require explicit file extensions for directory exports
- **Async Cleanup:** Ensure proper cleanup in test teardown to prevent memory leaks

---

## Out of Scope

- Adding new test cases
- Changing test framework from Vitest to Jest
- Modifying test assertions or logic
- Updating test dependencies to major versions

---

## References

- [Vitest Configuration Documentation](https://vitest.dev/config/)
- `packages/integrations/shared/src/__tests__/adapter.test.ts` — failing integration tests
- `packages/infrastructure/index.ts` — directory import issues
