# testing-library-documentation.md


## Overview

React Testing Library is a lightweight solution for testing React components that encourages better testing practices. Its primary guiding principle is: "The more your tests resemble the way your software is used, the more confidence they can give you."

## Core Philosophy

### Testing User Behavior, Not Implementation

React Testing Library focuses on testing components from a user's perspective rather than testing implementation details. This approach:

- **Increases confidence** that your application works for real users
- **Reduces test fragility** when refactoring components
- **Encourages accessibility** by using semantic HTML
- **Aligns with user interactions** rather than component internals

### Key Principles

1. **Test what users see**: Query DOM elements as users would
2. **Use accessible queries**: Prefer getByRole, getByLabelText over test IDs
3. **Avoid implementation details**: Don't test component state or internal methods
4. **Focus on behavior**: Test what users can do, not how components work

## Installation and Setup

### Basic Installation

```bash
# npm
npm install --save-dev @testing-library/react @testing-library/dom @testing-library/jest-dom

# yarn
yarn add --dev @testing-library/react @testing-library/dom @testing-library/jest-dom
```

### TypeScript Support

```bash
npm install --save-dev @testing-library/react @testing-library/dom @testing-library/jest-dom @types/jest
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
```

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
```

## Core APIs

### Render Function

The `render` function mounts your component and provides utilities for testing.

```tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);

  // screen provides access to all queries
  const element = screen.getByText('Hello World');
  expect(element).toBeInTheDocument();
});
```

### Query Methods

#### Priority Order (Recommended)

1. **getByRole** - Most accessible and preferred
2. **getByLabelText** - Form inputs with labels
3. **getByPlaceholderText** - Input placeholders
4. **getByText** - Text content
5. **getByDisplayValue** - Form input values
6. **getByAltText** - Image alt text
7. **getByTitle** - Title attributes
8. **getByTestId** - Escape hatch (use sparingly)

#### Query Variants

```tsx
import { render, screen } from '@testing-library/react';

// getBy - Throws error if not found (default)
const element = screen.getByRole('button');

// queryBy - Returns null if not found
const element = screen.queryByRole('button');

// findBy - Async, waits for element
const element = await screen.findByRole('button');

// getAllBy - Returns array, throws if none found
const elements = screen.getAllByRole('button');

// queryAllBy - Returns array (empty if none found)
const elements = screen.queryAllByRole('button');

// findAllBy - Async, waits for multiple elements
const elements = await screen.findAllByRole('button');
```

## Common Testing Patterns

### Basic Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders with text content', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Form Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify submission
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('shows validation errors', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for error messages
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

### Async Component Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

// Mock API
jest.mock('./api', () => ({
  getUser: jest.fn(),
}));

import { getUser } from './api';

describe('UserProfile', () => {
  test('displays loading state', () => {
    getUser.mockResolvedValue({ name: 'John Doe', email: 'john@example.com' });

    render(<UserProfile userId="123" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays user data after loading', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    getUser.mockResolvedValue(mockUser);

    render(<UserProfile userId="123" />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
  });

  test('handles error state', async () => {
    getUser.mockRejectedValue(new Error('User not found'));

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });
  });
});
```

### Component with Props Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  test('renders with title and content', () => {
    render(
      <Card title="Test Title">
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByRole('heading', { name: /test title/i })).toBeInTheDocument();
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  test('applies variant styles', () => {
    render(<Card variant="outlined">Content</Card>);

    const card = screen.getByText(/content/i).closest('div');
    expect(card).toHaveClass('card-outlined');
  });

  test('renders optional elements conditionally', () => {
    const { rerender } = render(<Card showFooter={false}>Content</Card>);

    expect(screen.queryByText(/footer/i)).not.toBeInTheDocument();

    rerender(<Card showFooter={true}>Content</Card>);
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
  });
});
```

## Advanced Patterns

### Custom Render Function

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from './theme';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  test('initializes with provided value', () => {
    const { result } = renderHook(() => useCounter(5));

    expect(result.current.count).toBe(5);
  });

  test('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  test('decrements count', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });
});
```

### Mocking External Dependencies

```tsx
// Mocking API calls
jest.mock('./services/api', () => ({
  fetchUser: jest.fn(),
  updateUser: jest.fn(),
}));

import { fetchUser, updateUser } from './services/api';

describe('UserComponent', () => {
  beforeEach(() => {
    fetchUser.mockClear();
    updateUser.mockClear();
  });

  test('loads user data on mount', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    fetchUser.mockResolvedValue(mockUser);

    render(<UserComponent userId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    expect(fetchUser).toHaveBeenCalledWith(1);
  });
});
```

### Context Provider Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeContext } from './theme';
import { ThemedComponent } from './ThemedComponent';

describe('ThemedComponent', () => {
  test('renders with light theme', () => {
    const theme = { mode: 'light', colors: { primary: 'blue' } };

    render(
      <ThemeContext.Provider value={theme}>
        <ThemedComponent />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  test('renders with dark theme', () => {
    const theme = { mode: 'dark', colors: { primary: 'black' } };

    render(
      <ThemeContext.Provider value={theme}>
        <ThemedComponent />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });
});
```

## User Interaction Testing

### FireEvent vs UserEvent

```tsx
import { render, screen, fireEvent, userEvent } from '@testing-library/react';
import { Form } from './Form';

describe('Form Interactions', () => {
  test('using fireEvent', () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  });

  test('using userEvent (preferred)', async () => {
    render(<Form />);

    await userEvent.type(screen.getByLabelText(/name/i), 'John');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  });
});
```

### Complex Interactions

```tsx
import { render, screen, userEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  test('opens calendar and selects date', async () => {
    render(<DatePicker />);

    // Open calendar
    await userEvent.click(screen.getByRole('button', { name: /select date/i }));

    // Navigate to specific month
    await userEvent.click(screen.getByRole('button', { name: /next month/i }));

    // Select date
    await userEvent.click(screen.getByRole('button', { name: /15/i }));

    // Verify selection
    expect(screen.getByDisplayValue(/2024-02-15/i)).toBeInTheDocument();
  });
});
```

## Accessibility Testing

### Built-in Accessibility Checks

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('button is accessible', () => {
  render(<Button>Submit</Button>);

  const button = screen.getByRole('button');

  // Check for accessible name
  expect(button).toHaveAccessibleName('Submit');

  // Check for proper role
  expect(button).toHaveAttribute('role', 'button');
});
```

### axe-core Integration

```bash
npm install --save-dev @testing-library/jest-dom axe-core
```

```tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { App } from './App';

expect.extend(toHaveNoViolations);

test('app is accessible', async () => {
  const { container } = render(<App />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
```

## Mocking Strategies

### Component Mocking

```tsx
// Mock entire component
jest.mock('./HeavyComponent', () => {
  return function MockHeavyComponent({ children }) {
    return <div>Mocked Heavy Component</div>;
  };
});

// Partial mocking
jest.mock('./api', () => ({
  ...jest.requireActual('./api'),
  expensiveFunction: jest.fn(),
}));
```

### Module Mocking

```tsx
// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' }),
}));
```

## Best Practices

### 1. Use Accessible Queries

```tsx
// ❌ Poor - uses test ID
expect(screen.getByTestId('submit-button')).toBeInTheDocument();

// ✅ Good - uses semantic role
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

### 2. Test Behavior, Not Implementation

```tsx
// ❌ Testing implementation details
expect(component.state('isLoading')).toBe(true);

// ✅ Testing user behavior
expect(screen.getByText(/loading/i)).toBeInTheDocument();
```

### 3. Use Proper Async Handling

```tsx
// ❌ Not waiting for async operations
fireEvent.click(button);
expect(screen.getByText(/success/i)).toBeInTheDocument();

// ✅ Waiting for async operations
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### 4. Keep Tests Focused

```tsx
// ❌ Testing multiple concerns
test('renders form and submits and validates', () => {
  // Multiple assertions
});

// ✅ Single concern per test
test('renders form fields correctly', () => {});
test('validates required fields', () => {});
test('submits form with valid data', () => {});
```

### 5. Use Descriptive Test Names

```tsx
// ❌ Vague test name
test('form works', () => {});

// ✅ Descriptive test name
test('displays validation error when email is invalid', () => {});
```

## Common Pitfalls

### 1. Overusing test IDs

```tsx
// ❌ Relying on test IDs
<button data-testid="submit-button">Submit</button>;
expect(screen.getByTestId('submit-button')).toBeInTheDocument();

// ✅ Using semantic HTML
<button>Submit</button>;
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

### 2. Testing Implementation Details

```tsx
// ❌ Testing internal state
expect(component.state('count')).toBe(1);

// ✅ Testing user-visible output
expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
```

### 3. Not Waiting for Updates

```tsx
// ❌ Missing async handling
fireEvent.click(button);
expect(screen.getByText(/success/i)).toBeInTheDocument();

// ✅ Proper async handling
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

## Integration with Testing Frameworks

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [React Testing Library Official Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro/)


## Implementation

[Add content here]