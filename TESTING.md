---
diataxis: how-to
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 60
project: marketing-websites
description: Testing strategy and execution guide
tags: [testing, quality, jest, accessibility]
primary_language: typescript
---

# Testing

This guide covers testing strategy, execution, and quality standards for the marketing-websites platform.

## Quick Start

### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage

# Package-specific tests
pnpm --filter @repo/ui test
pnpm --filter @repo/features test
```

### Test Structure

```text
packages/
├── ui/src/components/__tests__/     # UI component tests
├── features/src/feature/lib/__tests__/  # Feature action tests
└── utils/src/__tests__/            # Utility function tests
```

## Testing Strategy

### Test Pyramid

| Test Type             | Target % | Speed  | Scope                       |
| --------------------- | -------- | ------ | --------------------------- |
| **Unit Tests**        | 70%      | < 50ms | Single functions/components |
| **Integration Tests** | 20%      | < 2s   | Component interactions      |
| **E2E Tests**         | 10%      | < 30s  | Full user flows             |

### Coverage Targets

- **Current Phase:** 50% overall coverage
- **Target Phase:** 80% overall coverage
- **Critical Paths:** 90%+ coverage (booking, contact, search)

## Package Testing Guidelines

### @repo/ui (Component Library)

**Environment:** `jsdom` (browser simulation)

**Focus Areas:**

- Component rendering and props
- Accessibility (ARIA attributes, keyboard navigation)
- User interactions (clicks, forms, validation)
- Visual states (disabled, error, variants)

**Tools:**

- `@testing-library/react` for rendering
- `@testing-library/user-event` for interactions
- `jest-axe` for accessibility testing

**Example:**

```typescript
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
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
});
```

### @repo/features (Business Logic)

**Environment:** Mixed (`node` for actions, `jsdom` for components)

**Focus Areas:**

- Server Actions (validation, rate limiting, error handling)
- Schema validation (Zod schemas)
- Feature components (forms, workflows, state)

**Example:**

```typescript
import { submitBookingRequest } from '../actions';

jest.mock('@repo/infra', () => ({
  checkRateLimit: jest.fn().mockResolvedValue(true),
}));

describe('submitBookingRequest', () => {
  it('validates required fields', async () => {
    const formData = new FormData();
    // Missing required fields

    await expect(submitBookingRequest(formData)).rejects.toThrow();
  });
});
```

### @repo/utils (Utilities)

**Environment:** `node`

**Focus Areas:**

- Pure function correctness
- Edge cases and type safety
- Performance for hot paths

**Example:**

```typescript
import { cn } from '../cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});
```

## Test Templates

### Component Test Template

```typescript
// packages/ui/src/components/__tests__/ComponentName.test.tsx
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

## Quality Standards

### Code Style

- **User-centric testing:** Test behavior, not implementation
- **Accessibility-first:** Verify ARIA and keyboard navigation
- **Deterministic:** No flaky tests or time-dependent logic
- **Maintainable:** Clear structure and reusable utilities

### Flaky Test Policy

1. **Prevention:** Use mocked timers, deterministic fixtures, isolated tests
2. **Handling:** Mark as `test.skip()` with `FLAKY:` prefix
3. **Resolution:** Fix within 24 hours or document recurring issues

### Coverage Requirements

| Package Type       | Unit | Integration | Overall |
| ------------------ | ---- | ----------- | ------- |
| **@repo/ui**       | 80%  | N/A         | 80%     |
| **@repo/features** | 70%  | 50%         | 60%     |
| **@repo/utils**    | 90%  | N/A         | 90%     |
| **@repo/infra**    | 80%  | 60%         | 75%     |

## Common Testing Tasks

### Add Component Tests

```bash
cd packages/ui
mkdir -p src/components/NewComponent/__tests__
# Create NewComponent.test.tsx
# Follow component test template
```

### Mock Dependencies

```typescript
// Mock Next.js headers
jest.mock('next/headers');

// Mock infrastructure
jest.mock('@repo/infra', () => ({
  checkRateLimit: jest.fn().mockResolvedValue(true),
}));
```

### Test Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('handles async operations', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

### Test Execution in CI

Tests run automatically on:

- Pull requests
- Main branch pushes
- Release workflows

### Coverage Reporting

- Coverage reports generated in `coverage/` directory
- Coverage thresholds enforced in CI
- Coverage trends tracked over time

## Complete Documentation

For comprehensive testing guidance, including:

- Detailed testing strategies by package
- Advanced testing patterns and templates
- Flaky test prevention and handling
- Coverage requirements and exclusions
- Future enhancements and research areas

**See:** [docs/testing-strategy.md](docs/testing-strategy.md)

## Related Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development setup
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

_This is a quick testing reference. See [docs/testing-strategy.md](docs/testing-strategy.md) for the complete testing strategy._
