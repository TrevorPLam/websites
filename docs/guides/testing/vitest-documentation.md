<!--
/**
 * @file vitest-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for vitest documentation.
 * @entrypoints docs/guides/vitest-documentation.md
 * @exports vitest documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# vitest-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

Vitest is a next-generation testing framework powered by Vite. It provides a fast, modern testing experience with excellent TypeScript support, hot module replacement (HMR) for tests, and seamless integration with Vite projects.

## Key Features

- **Lightning Fast**: Built on Vite's ecosystem for instant test execution
- **HMR Support**: Hot module replacement for tests during development
- **TypeScript First**: Native TypeScript support with no extra configuration
- **Jest Compatible**: Drop-in replacement for most Jest APIs
- **Smart Watch Mode**: Only runs tests related to changed files
- **In-Source Testing**: Write tests alongside your source code
- **Multi-threading**: Parallel test execution for better performance

## Installation

### Basic Setup

```bash
# npm
npm install --save-dev vitest

# yarn
yarn add --dev vitest

# pnpm
pnpm add --save-dev vitest
```

### With TypeScript Support

```bash
npm install --save-dev vitest @vitest/ui jsdom
```

## Configuration

### Basic vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',

    // Global setup
    globals: true,

    // Test files
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*'],
    },
  },

  // Vite config integration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### Advanced Configuration

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    // Test environment
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],

    // Global APIs
    globals: true,

    // Test matching
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],

    // Performance
    threads: true,
    isolate: true,

    // Timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporting
    reporter: ['verbose', 'html'],
    outputFile: {
      html: './coverage/index.html',
    },

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.stories.*',
      ],
    },

    // Mocking
    clearMocks: true,
    restoreMocks: true,

    // Watch mode
    watch: true,
    watchExclude: ['**/node_modules/**', '**/dist/**'],
  },

  // Vite configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
    },
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
```

## Test Writing

### Basic Test Structure

```typescript
// sum.test.ts
import { describe, it, expect } from 'vitest';

function sum(a: number, b: number): number {
  return a + b;
}

describe('sum function', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});
```

### Async Testing

```typescript
import { describe, it, expect, vi } from 'vitest';

// Mock API
const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

describe('fetchUser', () => {
  it('should fetch user data', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: '1', name: 'John Doe' }),
    });

    const user = await fetchUser('1');

    expect(user).toEqual({ id: '1', name: 'John Doe' });
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should handle API errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchUser('1')).rejects.toThrow('Network error');
  });
});
```

### Component Testing with React

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Testing Custom Hooks

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(5));

    expect(result.current.count).toBe(5);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });
});
```

## Mocking

### Function Mocking

```typescript
import { vi, describe, it, expect } from 'vitest';

// Simple function mock
const mockFn = vi.fn();
mockFn('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Mock implementation
const mockFn = vi.fn(() => 'mocked result');
expect(mockFn()).toBe('mocked result');

// Mock with different return values
const mockFn = vi
  .fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

expect(mockFn()).toBe('first');
expect(mockFn()).toBe('second');
expect(mockFn()).toBe('default');
```

### Module Mocking

```typescript
// api.ts
export const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// api.test.ts
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

// Mock the entire module
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}));

import { fetchUser as mockFetchUser } from './api';

describe('User Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user data', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    mockFetchUser.mockResolvedValue(mockUser);

    const user = await fetchUser('1');

    expect(user).toEqual(mockUser);
    expect(mockFetchUser).toHaveBeenCalledWith('1');
  });
});
```

### Timer Mocking

```typescript
import { vi, describe, it, expect } from 'vitest';

describe('Timer functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback after timeout', () => {
    const callback = vi.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle intervals', () => {
    const callback = vi.fn();

    setInterval(callback, 1000);

    vi.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
```

## Advanced Features

### In-Source Testing

```typescript
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// In-source test
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00.000Z');
    expect(formatDate(date)).toBe('2024-01-15');
  });
}
```

### Test Projects (Workspaces)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global test configuration
    globals: true,
    environment: 'jsdom',
  },

  // Define multiple test projects
  projects: [
    {
      // Unit tests
      name: 'unit',
      test: {
        include: ['src/**/*.unit.test.{ts,tsx}'],
        environment: 'node',
      },
    },
    {
      // Component tests
      name: 'components',
      test: {
        include: ['src/**/*.component.test.{ts,tsx}'],
        environment: 'jsdom',
        setupFiles: ['./src/test/component-setup.ts'],
      },
    },
    {
      // Integration tests
      name: 'integration',
      test: {
        include: ['src/**/*.integration.test.{ts,tsx}'],
        environment: 'jsdom',
        setupFiles: ['./src/test/integration-setup.ts'],
      },
    },
  ],
});
```

### Custom Matchers

```typescript
// test/matchers.ts
import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toBeValidEmail(): R;
  toBeWithinRange(range: [number, number]): R;
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
  }
}

expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },

  toBeWithinRange(received: number, range: [number, number]) {
    const [min, max] = range;
    const pass = received >= min && received <= max;

    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${min}-${max}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${min}-${max}`,
        pass: false,
      };
    }
  },
});

// Usage in tests
test('email validation', () => {
  expect('test@example.com').toBeValidEmail();
  expect('invalid-email').not.toBeValidEmail();
});

test('range validation', () => {
  expect(5).toBeWithinRange([1, 10]);
  expect(15).not.toBeWithinRange([1, 10]);
});
```

## Performance Optimization

### Smart Watch Mode

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // Only run tests related to changed files
    watch: true,

    // Exclude certain files from watching
    watchExclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],

    // Enable HMR for tests
    hmr: true,
  },
});
```

### Parallel Execution

```typescript
export default defineConfig({
  test: {
    // Enable multi-threading
    threads: true,

    // Isolate tests for better performance
    isolate: true,

    // Maximum number of threads
    maxThreads: 4,
    minThreads: 1,
  },
});
```

### Selective Test Running

```bash
# Run only tests matching a pattern
vitest run --reporter=verbose "**/*.unit.test.*"

# Run tests for specific files
vitest run src/utils/date.test.ts

# Run tests in watch mode for specific files
vitest --watch src/components/

# Run tests with coverage for specific files
vitest run --coverage src/utils/
```

## Integration with CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:component": "vitest run --project components",
    "test:unit": "vitest run --project unit"
  }
}
```

## Best Practices

### 1. Organize Tests by Type

```typescript
// File naming conventions
// utils.test.ts - Unit tests
// Button.component.test.tsx - Component tests
// user-service.integration.test.ts - Integration tests
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Vague
test('works', () => {});

// ✅ Descriptive
test('should format date to YYYY-MM-DD format', () => {});
```

### 3. Setup and Cleanup

```typescript
describe('Database operations', () => {
  beforeEach(async () => {
    // Setup database connection
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Cleanup database
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    // Close connection
    await closeDatabase();
  });
});
```

### 4. Use Test Utilities

```typescript
// test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from './theme';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
```

### 5. Mock External Dependencies

```typescript
// test/setup.ts
import { vi } from 'vitest';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);
```

## Migration from Jest

### Configuration Migration

```typescript
// jest.config.js -> vitest.config.ts
export default defineConfig({
  test: {
    // Jest equivalent: testEnvironment
    environment: 'jsdom',

    // Jest equivalent: setupFilesAfterEnv
    setupFiles: ['./src/test/setup.ts'],

    // Jest equivalent: collectCoverageFrom
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.stories.*'],
    },
  },
});
```

### API Differences

```typescript
// Jest
jest.fn();
jest.mock();
jest.spyOn();

// Vitest
vi.fn();
vi.mock();
vi.spyOn();
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Vitest Official Documentation](https://vitest.dev/)
- [Vitest Configuration Guide](https://vitest.dev/config/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)
- [Testing Library with Vitest](https://testing-library.com/docs/react-testing-library/docs/vitest)
- [Vitest Migration Guide](https://vitest.dev/guide/migration.html)


## Implementation

[Add content here]
