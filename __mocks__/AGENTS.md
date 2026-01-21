# __mocks__/AGENTS.md — Test Mocks

Last Updated: 2026-01-21
Applies To: Any agent working in __mocks__/

**Quick Reference:** See `/BESTPR.md` for comprehensive repo standards.

## Purpose
This folder contains mock implementations used by the test suite. Mocks allow tests to run without real dependencies like external services or Node.js-specific modules.

---

## Current Mocks

| Mock | Purpose |
|------|---------|
| `server-only.ts` | Mock for the `server-only` package used to prevent client-side imports |

---

## Mock Conventions

### File Naming
- **Match module name:** Mock filename should match the module being mocked
- **Extensions:** Use `.ts` for TypeScript mocks, `.js` for JavaScript

### Mock Structure
```typescript
/**
 * Mock: module-name
 * Purpose: Brief description of what this mocks
 */

// Export same API as real module
export const functionName = () => {
  // Simple mock implementation
  return 'mocked-value'
}
```

---

## Adding a New Mock

1. **Identify need:** What module/dependency needs mocking?
2. **Create file:** `__mocks__/module-name.ts`
3. **Match API:** Export same functions/objects as real module
4. **Keep simple:** Mocks should be minimal, just enough to satisfy tests
5. **Document:** Add JSDoc explaining what's being mocked

---

## Vitest Configuration

Mocks are automatically loaded by Vitest when:
- Module name matches file in `__mocks__/`
- Test calls `vi.mock('module-name')`

See `vitest.config.ts` for configuration details.

---

## Don't

- ❌ Add complex logic to mocks (defeats the purpose)
- ❌ Mock modules that should be tested (only mock external deps)
- ❌ Forget to update mocks when real module API changes
- ❌ Share mocks across test files (each test should be isolated)

---

**See also:** 
- `/BESTPR.md` for complete best practices guide
- `/__tests__/AGENTS.md` for testing guidelines
- `vitest.config.ts` for test configuration
