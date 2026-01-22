# __tests__/AGENTS.md — Test Suite

Last Updated: 2026-01-21
Applies To: Any agent working in __tests__/

**Quick Reference:** See `/BESTPR.md` for comprehensive repo standards.

## Purpose
This folder contains unit and integration tests for the application. Tests ensure code quality, prevent regressions, and document expected behavior.

---

## Folder Structure

```
__tests__/
├── AGENTS.md              # This file
├── components/            # Component tests
│   ├── Breadcrumbs.test.tsx
│   ├── ContactForm.test.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── HomePage.test.tsx
│   ├── Navigation.test.tsx
│   ├── pages/             # Page-level component tests
│   └── ui/                # UI primitive tests
│       └── components.test.tsx
└── lib/                   # Utility module tests
    ├── actions.rate-limit.test.ts
    ├── analytics.test.ts
    ├── blog.test.ts
    ├── env.test.ts
    ├── logger.test.ts
    ├── rate-limit.test.ts
    ├── request-validation.test.ts
    └── sanitize.test.ts

tests/
└── e2e/                   # Playwright E2E tests
    ├── critical-flows.spec.ts
    └── home.spec.ts
```

---

## Testing Tools

| Tool | Purpose | Config File |
|------|---------|-------------|
| **Vitest** | Unit test runner | `vitest.config.ts` |
| **@testing-library/react** | React component testing | — |
| **Playwright** | E2E browser testing | `playwright.config.ts` |

---

## Running Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/lib/sanitize.test.ts

# Run E2E tests (requires dev server)
npm run test:e2e
```

---

## Test Conventions

### File Naming
- Unit tests: `{module}.test.ts` or `{Component}.test.tsx`
- E2E tests: `{feature}.spec.ts`

### Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest'

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should do expected behavior', () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = functionName(input)
      
      // Assert
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      // ...
    })
  })
})
```

### Component Test Structure
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ComponentName from '@/components/ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    render(<ComponentName />)
    await fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('After click')).toBeInTheDocument()
  })
})
```

---

## Mocking Patterns

### Mock Modules
```typescript
import { vi } from 'vitest'

// Mock entire module
vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
}))

// Mock with implementation
vi.mock('@/lib/env', () => ({
  isDevelopment: () => true,
  validatedEnv: { SITE_URL: 'http://localhost:3000' }
}))
```

### Mock Functions
```typescript
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')
mockFn.mockImplementation((arg) => arg.toUpperCase())
```

### Mock Next.js
```typescript
// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/current-path',
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: () => new Map([['x-forwarded-for', '127.0.0.1']]),
}))
```

---

## Test Setup

Global setup is in `vitest.setup.tsx`:
- Configures jsdom environment
- Sets up testing-library matchers
- Mocks browser APIs not available in jsdom

---

## Coverage Requirements

Current focus areas (should have good coverage):
- `lib/sanitize.ts` — Security-critical XSS prevention
- `lib/actions.ts` — Rate limiting and form handling
- `lib/env.ts` — Environment validation
- `components/ContactForm.tsx` — Form validation and submission

Run coverage report:
```bash
npm run test:coverage
```

---

## Writing New Tests

### When to Add Tests
- New utility functions (especially security-related)
- New components with business logic
- Bug fixes (add test to prevent regression)
- Complex state management

### Test Checklist
- [ ] Happy path covered
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Accessibility verified (for components)
- [ ] Mocks cleaned up after test
- [ ] When using `vi.*`, include `vi` in the Vitest import to avoid runtime reference errors

### Security Tests
For security-critical code, test:
- Valid input produces expected output
- Malicious input is sanitized/rejected
- Edge cases (empty, null, very long input)
- Rate limiting enforced

---

## E2E Tests

E2E tests live in `tests/e2e/` and use Playwright.

### Current Coverage
- `home.spec.ts` — Homepage loads and renders
- `critical-flows.spec.ts` — Contact form, navigation

### Running E2E
```bash
# Start dev server first
npm run dev

# In another terminal
npm run test:e2e

# Or run headed (see browser)
npx playwright test --headed
```
