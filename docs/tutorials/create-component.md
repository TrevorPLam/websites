<!--
/**
 * @file docs/tutorials/create-component.md
 * @role docs
 * @summary Tutorial for creating a custom UI component in the component library.
 *
 * @entrypoints
 * - Referenced from learning paths
 * - Developer tutorials
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/components/ui-library.md (component patterns)
 * - docs/getting-started/onboarding.md (setup)
 *
 * @used_by
 * - Developers extending the UI library
 * - Contributors adding components
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: tutorial instructions
 * - outputs: new component in library
 *
 * @invariants
 * - Component must follow library patterns
 * - Must include tests and documentation
 *
 * @gotchas
 * - Component API design is important
 * - Accessibility must be considered
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add code examples
 * - Create video walkthrough
 *
 * @verification
 * - ✅ Steps verified against component patterns
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Create a Custom Component

**Last Updated:** 2026-02-18  
**Status:** Active Tutorial  
**Estimated Time:** 1-2 hours  
**Difficulty:** Intermediate  
**Prerequisites:** React knowledge, TypeScript basics, component library understanding

---

This tutorial guides you through creating a new UI component for the `@repo/ui` package. You'll learn the patterns, conventions, and best practices used in the component library.

## Overview

In this tutorial, you will:

1. Understand component library structure
2. Create a new component
3. Add TypeScript types
4. Write tests
5. Document the component
6. Export and use it

## Prerequisites

- ✅ Development environment set up
- ✅ Understanding of React and TypeScript
- ✅ Familiarity with component patterns
- ✅ Testing knowledge (Vitest, React Testing Library)

## Step 1: Understand Component Structure (10 minutes)

The component library follows this structure:

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── ...
│   └── index.ts
```

**Key patterns:**

- Each component has its own directory
- Component file: `ComponentName.tsx`
- Test file: `ComponentName.test.tsx`
- Index file: `index.ts` (exports component)
- Main export: `src/index.ts` (barrel export)

## Step 2: Choose Component Name and Location (5 minutes)

For this tutorial, we'll create an `Alert` component.

**Naming conventions:**

- Use PascalCase: `Alert`, `Card`, `Button`
- Be descriptive: `Alert` not `Msg`
- Follow existing patterns

**Location:**

```bash
packages/ui/src/components/Alert/
```

## Step 3: Create Component Directory and Files (5 minutes)

```bash
# Navigate to UI package
cd packages/ui/src/components

# Create component directory
mkdir Alert
cd Alert

# Create component files
touch Alert.tsx
touch Alert.test.tsx
touch index.ts
```

## Step 4: Write Component Implementation (20 minutes)

Create `Alert.tsx`:

```typescript
import * as React from 'react'
import { cn } from '@repo/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'rounded-lg border p-4',
          {
            'border-gray-200 bg-gray-50': variant === 'default',
            'border-green-200 bg-green-50': variant === 'success',
            'border-yellow-200 bg-yellow-50': variant === 'warning',
            'border-red-200 bg-red-50': variant === 'error',
          },
          className
        )}
        {...props}
      >
        {title && (
          <h4 className="mb-2 font-semibold">{title}</h4>
        )}
        <div>{children}</div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
```

**Key points:**

- Uses `forwardRef` for ref forwarding
- Extends HTML attributes for flexibility
- Uses `cn` utility for className merging
- Includes accessibility (`role="alert"`)
- Supports variants for different styles
- Optional title prop

## Step 5: Create Index File (2 minutes)

Create `index.ts`:

```typescript
export { Alert, type AlertProps } from './Alert';
```

This allows importing: `import { Alert } from '@repo/ui'`

## Step 6: Write Tests (20 minutes)

Create `Alert.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Test message</Alert>)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Message</Alert>)
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    const { container } = render(<Alert>Message</Alert>)
    expect(container.firstChild).toHaveClass('border-gray-200')
  })

  it('applies variant classes', () => {
    const { container } = render(<Alert variant="success">Message</Alert>)
    expect(container.firstChild).toHaveClass('border-green-200')
  })

  it('has alert role', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Message</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
```

**Test coverage:**

- ✅ Renders content
- ✅ Optional props work
- ✅ Variants apply correctly
- ✅ Accessibility attributes
- ✅ Ref forwarding

## Step 7: Export from Package (5 minutes)

Add to `packages/ui/src/index.ts`:

```typescript
// ... existing exports
export { Alert, type AlertProps } from './components/Alert';
```

## Step 8: Build and Verify (5 minutes)

```bash
# Build the UI package
pnpm --filter @repo/ui build

# Run tests
pnpm --filter @repo/ui test

# Type check
pnpm type-check
```

Fix any errors before proceeding.

## Step 9: Use Component in Template (10 minutes)

Use your new component in a template:

```typescript
// In a template file
import { Alert } from '@repo/ui'

export default function Page() {
  return (
    <div>
      <Alert variant="success" title="Success!">
        Your changes have been saved.
      </Alert>
    </div>
  )
}
```

## Step 10: Document Component (10 minutes)

Add documentation to component file or create `Alert.md`:

```markdown
# Alert Component

Displays important messages to users.

## Usage

\`\`\`tsx
import { Alert } from '@repo/ui'

<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>
\`\`\`

## Props

- `variant`: 'default' | 'success' | 'warning' | 'error'
- `title`: Optional title
- `children`: Alert content
```

## Best Practices

### Component Design

- ✅ **Composable**: Break into smaller pieces if needed
- ✅ **Accessible**: Include ARIA attributes, keyboard support
- ✅ **Flexible**: Accept className and other HTML attributes
- ✅ **Type-safe**: Use TypeScript properly
- ✅ **Performant**: Use React.memo if needed

### Testing

- ✅ Test user interactions
- ✅ Test accessibility
- ✅ Test edge cases
- ✅ Test variants/props
- ✅ Aim for high coverage

### Documentation

- ✅ Document all props
- ✅ Include usage examples
- ✅ Show variants
- ✅ Note accessibility features
- ✅ Add to component library docs

## Common Patterns

### Variants

```typescript
variant?: 'default' | 'success' | 'warning' | 'error'
```

### Size Variants

```typescript
size?: 'sm' | 'md' | 'lg'
```

### Compound Components

```typescript
<Alert>
  <Alert.Title>Title</Alert.Title>
  <Alert.Content>Content</Alert.Content>
</Alert>
```

## Next Steps

- ✅ Add more variants
- ✅ Add animations
- ✅ Create Storybook story
- ✅ Add to design system docs
- ✅ Get code review

## Related Resources

- [UI Library Documentation](../components/ui-library.md)
- [Component Patterns](../components/)
- [Testing Strategy](../testing-strategy.md)
- [Accessibility Guide](../accessibility-audit.md)

---

**Ready for more?** Try creating a more complex component or contributing to existing ones!
