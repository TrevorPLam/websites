# Testing Strategy Documentation

**Last Updated:** February 17, 2026  
**Status:** Active  
**Applies To:** All packages in marketing-websites monorepo

---

## Executive Summary

This document defines the testing approach for all packages in the marketing-websites monorepo. Our strategy follows the **testing pyramid** model with a focus on **user-centric testing**, **accessibility-first patterns**, and **deterministic, maintainable test suites**.

**Core Principles:**

- **User-centric testing:** Test components as users interact with them, not implementation details
- **Accessibility-first:** Tests verify ARIA attributes and keyboard navigation naturally
- **Fast feedback:** Unit tests run in milliseconds; integration tests complete in seconds
- **Deterministic:** No flaky tests; all tests are repeatable and self-contained
- **Maintainable:** Clear test structure, reusable utilities, comprehensive documentation

---

## Test Pyramid Distribution

Following industry best practices (2026), we target the following distribution:

| Test Type | Target % | Speed | Scope | Examples |
|-----------|----------|-------|-------|----------|
| **Unit Tests** | 70% | < 50ms | Single function/component | Utility functions, pure components, schemas |
| **Integration Tests** | 20% | < 2s | Component interactions | Form submissions, feature workflows, API integrations |
| **E2E Tests** | 10% | < 30s | Full user flows | Critical paths: booking, contact, search |

**Coverage Targets:**

- **Phase 1 (Current):** 50% overall coverage
- **Phase 6 (Target):** 80% overall coverage
- **Critical paths:** 90%+ coverage (booking, contact, payment flows)

---

## Package-Specific Testing Strategies

### @repo/ui (Component Library)

**Test Environment:** `jsdom` (browser simulation)

**Focus Areas:**

1. **Component Rendering**
   - Components render without errors
   - Props are passed correctly
   - Default values work as expected

2. **Accessibility**
   - ARIA attributes are present and correct
   - Keyboard navigation works
   - Focus management is proper
   - Screen reader announcements are accurate

3. **User Interactions**
   - Click handlers fire correctly
   - Form inputs update state
   - Validation messages appear
   - Loading states display

4. **Visual States**
   - Variants render correctly
   - Disabled states work
   - Error states display
   - Responsive behavior

**Test Tools:**

- `@testing-library/react` for component rendering
- `@testing-library/user-event` for realistic user interactions
- `@testing-library/jest-dom` for DOM matchers
- `jest-environment-jsdom` for browser APIs

**Example Test Pattern:**

```typescript
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible via keyboard', async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);
    
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
```

### @repo/features (Feature Modules)

**Test Environment:** Mixed (`node` for actions/schemas, `jsdom` for components)

**Focus Areas:**

1. **Server Actions**
   - Input validation (Zod schemas)
   - Rate limiting integration
   - Error handling
   - Provider adapter behavior

2. **Schema Validation**
   - Valid inputs pass
   - Invalid inputs are rejected
   - Error messages are clear
   - Edge cases are handled

3. **Feature Components**
   - Forms submit correctly
   - Multi-step flows work
   - State persistence
   - Integration with actions

**Test Tools:**

- `jest` with `node` environment for server code
- `@testing-library/react` for feature components
- Mock Service Worker (MSW) for API mocking (future)

**Example Test Pattern:**

```typescript
import { submitBookingRequest } from '../actions';
import { headers } from 'next/headers';

jest.mock('next/headers');
jest.mock('@repo/infra', () => ({
  checkRateLimit: jest.fn().mockResolvedValue(true),
}));

describe('submitBookingRequest', () => {
  it('validates required fields', async () => {
    const formData = new FormData();
    // Missing required fields
    
    await expect(submitBookingRequest(formData)).rejects.toThrow();
  });

  it('respects rate limits', async () => {
    const { checkRateLimit } = require('@repo/infra');
    checkRateLimit.mockResolvedValue(false);
    
    const formData = createValidFormData();
    await expect(submitBookingRequest(formData)).rejects.toThrow(/rate limit/i);
  });
});
```

### @repo/utils (Utility Functions)

**Test Environment:** `node`

**Focus Areas:**

1. **Pure Functions**
   - Input/output correctness
   - Edge cases
   - Type safety
   - Performance (for hot paths)

**Example Test Pattern:**

```typescript
import { cn } from '../cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});
```

### @repo/infra (Infrastructure)

**Test Environment:** `node`

**Focus Areas:**

1. **Security Modules**
   - CSP nonce generation
   - Rate limiting logic
   - Input sanitization
   - Header generation

2. **Middleware**
   - Request transformation
   - Response modification
   - Error handling

**Existing Pattern:** Well-established; use as reference for other packages.

### Templates (Hair Salon, etc.)

**Test Environment:** Mixed

**Focus Areas:**

1. **Route Registry**
   - All routes are registered
   - Sitemap generation works
   - Search index includes all pages

2. **Feature Integration**
   - Features work together
   - Config drives behavior
   - Parity with extracted features

---

## Test Organization

### File Structure

```
packages/
├── ui/
│   └── src/
│       └── components/
│           ├── Button.tsx
│           └── __tests__/
│               └── Button.test.tsx
├── features/
│   └── src/
│       └── booking/
│           ├── lib/
│           │   ├── actions.ts
│           │   └── __tests__/
│           │       └── actions.test.ts
│           └── components/
│               ├── BookingForm.tsx
│               └── __tests__/
│                   └── BookingForm.test.tsx
```

### Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test directories: `__tests__/` (co-located with source)
- Test descriptions: Use `describe` blocks for grouping, `it` for individual tests
- Test names: Describe behavior, not implementation ("renders correctly" not "calls render function")

---

## Test Templates

### Component Test Template

```typescript
// File: packages/ui/src/components/__tests__/ComponentName.test.tsx
// Purpose: Unit tests for ComponentName component
// Features: [FEAT:TESTING] [FEAT:ACCESSIBILITY]

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders without errors', () => {
      render(<ComponentName />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles user actions correctly', async () => {
      const user = userEvent.setup();
      // Test implementation
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      // Test implementation
    });
  });
});
```

### Server Action Test Template

```typescript
// File: packages/features/src/feature/lib/__tests__/actions.test.ts
// Purpose: Unit tests for server actions
// Features: [FEAT:TESTING] [FEAT:SECURITY]

import { actionFunction } from '../actions';

// Mock dependencies
jest.mock('next/headers');
jest.mock('@repo/infra', () => ({
  checkRateLimit: jest.fn().mockResolvedValue(true),
}));

describe('actionFunction', () => {
  describe('Validation', () => {
    it('rejects invalid input', async () => {
      // Test implementation
    });
  });

  describe('Rate Limiting', () => {
    it('respects rate limits', async () => {
      // Test implementation
    });
  });

  describe('Success Cases', () => {
    it('processes valid requests', async () => {
      // Test implementation
    });
  });
});
```

### Schema Test Template

```typescript
// File: packages/features/src/feature/lib/__tests__/schema.test.ts
// Purpose: Unit tests for Zod schemas
// Features: [FEAT:TESTING] [FEAT:VALIDATION]

import { z } from 'zod';
import { featureSchema } from '../schema';

describe('featureSchema', () => {
  describe('Valid Inputs', () => {
    it('accepts valid data', () => {
      const valid = { /* valid data */ };
      expect(() => featureSchema.parse(valid)).not.toThrow();
    });
  });

  describe('Invalid Inputs', () => {
    it('rejects missing required fields', () => {
      const invalid = { /* missing fields */ };
      expect(() => featureSchema.parse(invalid)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings', () => {
      // Test implementation
    });
  });
});
```

---

## Flaky Test Policy

**Definition:** A test that passes or fails non-deterministically without code changes.

**Prevention:**

1. **No time-dependent logic:** Use mocked timers (`jest.useFakeTimers()`)
2. **No random data:** Use deterministic fixtures
3. **No shared state:** Each test is isolated
4. **No external dependencies:** Mock APIs and databases
5. **Wait for async:** Use `waitFor` and `findBy` queries

**Handling:**

1. **Immediate:** Mark as `test.skip()` with `FLAKY:` prefix
2. **Within 24 hours:** Fix or remove
3. **Documentation:** Add to flaky test registry if recurring

**Example:**

```typescript
// FLAKY: Fails intermittently due to timing issues
test.skip('handles rapid clicks', async () => {
  // Test implementation
});
```

---

## Coverage Requirements

### Minimum Coverage by Package Type

| Package Type | Unit | Integration | Overall |
|--------------|------|------------|---------|
| **@repo/ui** | 80% | N/A | 80% |
| **@repo/features** | 70% | 50% | 60% |
| **@repo/utils** | 90% | N/A | 90% |
| **@repo/infra** | 80% | 60% | 75% |

### Critical Path Coverage

These features require 90%+ coverage:

- Booking submission flow
- Contact form submission
- Payment processing (when added)
- Authentication (when added)
- Search functionality

### Coverage Exclusions

Exclude from coverage:

- Type definitions (`*.d.ts`)
- Barrel exports (`index.ts`)
- Test utilities
- Mock implementations

---

## CI/CD Integration

### Test Execution

Tests run in CI via Turborepo:

```yaml
# .github/workflows/ci.yml
- name: Test
  run: pnpm test
```

### Test Scripts

**Root level:**

```json
{
  "scripts": {
    "test": "jest --maxWorkers=50%",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --maxWorkers=50%"
  }
}
```

**Package level:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Coverage Reporting

- Coverage reports generated in `coverage/` directory
- CI uploads coverage to coverage service (future)
- Coverage gates enforced in PRs (future)

---

## Test Ownership

### Package Ownership

| Package | Owner | Test Responsibility |
|---------|-------|-------------------|
| `@repo/ui` | UI Team | Component tests, accessibility |
| `@repo/features` | Features Team | Action tests, integration tests |
| `@repo/utils` | Platform Team | Utility tests |
| `@repo/infra` | Platform Team | Security tests, middleware tests |

### Feature Ownership

When adding a new feature:

1. **Required:** Unit tests for all exported functions
2. **Required:** Integration tests for user-facing flows
3. **Recommended:** E2E tests for critical paths
4. **Required:** Update this document if patterns change

---

## Future Enhancements

### Planned Additions

1. **Mock Service Worker (MSW):** For API mocking in integration tests
2. **Visual Regression Testing:** For UI component changes
3. **Accessibility Testing:** Automated a11y checks (axe-core)
4. **Performance Testing:** Component render time benchmarks
5. **E2E Testing:** Playwright or Cypress for critical flows

### Research Areas

- **Vitest migration:** Evaluate Vitest as Jest alternative (faster, better ESM support)
- **Snapshot testing:** When to use snapshots vs. explicit assertions
- **Test data factories:** Standardize fixture generation
- **Parallel test execution:** Optimize test runtime

---

## References

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Pyramid Best Practices](https://engineering.homeoffice.gov.uk/standards/test-pyramid)
- [Accessibility Testing Guide](https://www.w3.org/WAI/test-evaluate/)

---

**Document Status:** Active  
**Last Reviewed:** February 17, 2026  
**Next Review:** March 17, 2026

---

## Implementation Notes (Task 2.21)

- **Jest configuration:** Root `jest.config.js` uses `projects` for separate `node` and `jsdom` environments. Node: utils, infra, feature libs, template lib. jsdom: packages/ui, feature components, template components.
- **Test scripts:** `packages/ui`, `packages/features`, and `packages/utils` include `test` and `test:watch` scripts that invoke root Jest.
- **Templates:** Copy-paste templates live in `docs/templates/` (component-test-template.tsx, server-action-test-template.ts, schema-test-template.ts).
- **Known pre-existing failures:** Some infra env and template env tests assume mutable `NODE_ENV`; Dialog.test.tsx uses a partial Radix mock that omits DialogFooter/DialogHeader. These are outside the scope of the strategy task; address in follow-up tasks.
