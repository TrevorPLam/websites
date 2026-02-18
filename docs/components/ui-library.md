<!--
/**
 * @file docs/components/ui-library.md
 * @role docs
 * @summary Comprehensive UI component library documentation and usage guide.
 *
 * @entrypoints
 * - Primary reference for UI component usage and development
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - packages/ui/ (component source code)
 * - docs/architecture/README.md (system understanding)
 * - docs/getting-started/onboarding.md (development setup)
 *
 * @used_by
 * - Developers, template creators, component contributors
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: component APIs, usage patterns, design tokens
 * - outputs: component understanding and proper usage
 *
 * @invariants
 * - Component documentation must match actual implementation
 * - Examples must be tested and working
 *
 * @gotchas
 * - Components evolve; keep documentation synchronized
 * - Some components may have specific accessibility requirements
 *
 * @issues
 * - [severity:medium] Need Storybook integration for interactive examples
 *
 * @opportunities
 * - Add component playground for live testing
 * - Create component design system documentation
 *
 * @verification
 * - ✅ Verified: Components listed match packages/ui exports
 * - ✅ Verified: Usage examples follow current patterns
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# UI Component Library Documentation

**Last Updated:** 2026-02-18  
**Status:** Active Documentation  
**Package:** `@repo/ui`  
**Version:** See package.json for current version

---

## Overview

The `@repo/ui` package provides a comprehensive set of reusable React components built with accessibility, performance, and developer experience in mind. These components follow modern React patterns and are designed to work seamlessly across all templates and client projects.

### Key Features

- **Accessibility First**: WCAG 2.2 AA compliant by default
- **TypeScript Support**: Full type safety and IntelliSense
- **Theme Integration**: Seamless theming with design tokens
- **Performance Optimized**: React 19 compatible with automatic optimizations
- **Consistent Design**: Unified design system across all components
- **Server Component Ready**: Compatible with React Server Components

### Design Principles

1. **Composability**: Components can be combined and extended
2. **Accessibility**: Built-in ARIA support and keyboard navigation
3. **Performance**: Optimized for Core Web Vitals
4. **Consistency**: Unified API and styling patterns
5. **Flexibility**: Customizable through props and theming

---

## Getting Started

### Installation

The UI package is included in the monorepo workspace. No additional installation needed for templates and clients.

```bash
# For external projects (not in monorepo)
pnpm add @repo/ui
```

### Basic Usage

```typescript
import { Button, Card, Input } from '@repo/ui';

export function MyComponent() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter your name" />
      <Button onClick={() => console.log('Clicked')}>
        Submit
      </Button>
    </Card>
  );
}
```

### Theme Provider Setup

```typescript
// app/layout.tsx or root layout
import { ThemeProvider } from '@repo/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Component Categories

### Form Components

#### Button

Interactive button with multiple variants and states.

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

**Examples:**

```typescript
// Basic button
<Button>Click me</Button>

// Variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>

// Sizes
<Button size="lg">Large Button</Button>
<Button size="sm">Small Button</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>
```

**Accessibility:**
- Keyboard navigation support
- ARIA attributes automatically applied
- Focus management
- Screen reader announcements

#### Input

Form input with validation and styling support.

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
```

**Examples:**

```typescript
// Basic input
<Input placeholder="Enter text" />

// With label and validation
<Input 
  label="Email Address"
  type="email"
  required
  error="Invalid email format"
  description="We'll never share your email"
/>

// Controlled input
const [value, setValue] = useState('');
<Input 
  value={value}
  onChange={setValue}
  placeholder="Controlled input"
/>
```

#### Select

Dropdown select component with search support.

```typescript
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}
```

**Examples:**

```typescript
const options = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' }
];

<Select 
  options={options}
  placeholder="Select a country"
  searchable
/>
```

### Layout Components

#### Card

Container component with consistent spacing and styling.

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}
```

**Examples:**

```typescript
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Custom styling
<Card padding="lg" shadow="md" border>
  <h3>Styled Card</h3>
  <p>With custom padding and shadow</p>
</Card>
```

#### Container

Responsive container with max-width and centering.

```typescript
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}
```

**Examples:**

```typescript
<Container size="lg">
  <h1>Page Title</h1>
  <p>Content with max-width constraint</p>
</Container>
```

### Navigation Components

#### Dialog

Modal dialog with overlay and focus management.

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Dialog sub-components
interface DialogTriggerProps { children: React.ReactNode; }
interface DialogContentProps { children: React.ReactNode; className?: string; }
interface DialogHeaderProps { children: React.ReactNode; }
interface DialogTitleProps { children: React.ReactNode; }
interface DialogDescriptionProps { children: React.ReactNode; }
interface DialogFooterProps { children: React.ReactNode; }
interface DialogCloseProps { children: React.ReactNode; }
```

**Examples:**

```typescript
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button onClick={() => setOpen(false)}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Tabs

Tabbed interface with keyboard navigation.

```typescript
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps { children: React.ReactNode; className?: string; }
interface TabsTriggerProps { value: string; children: React.ReactNode; }
interface TabsContentProps { value: string; children: React.ReactNode; }
```

**Examples:**

```typescript
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <h3>Account Settings</h3>
    <p>Manage your account information</p>
  </TabsContent>
  <TabsContent value="settings">
    <h3>Preferences</h3>
    <p>Customize your experience</p>
  </TabsContent>
  <TabsContent value="billing">
    <h3>Billing Information</h3>
    <p>Manage your subscription</p>
  </TabsContent>
</Tabs>
```

### Feedback Components

#### Toast

Non-intrusive notification system.

```typescript
interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

// Toast hook
interface ToastFn {
  success: (message: string, options?: Partial<ToastProps>) => void;
  error: (message: string, options?: Partial<ToastProps>) => void;
  warning: (message: string, options?: Partial<ToastProps>) => void;
  info: (message: string, options?: Partial<ToastProps>) => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string;
      error: string;
    }
  ) => Promise<T>;
}
```

**Examples:**

```typescript
import { toast, Toaster } from '@repo/ui';

// In layout
<Toaster position="top-right" />

// Usage
toast.success('Operation completed successfully');
toast.error('Something went wrong', {
  description: 'Please try again later'
});

// Promise handling
const savePromise = fetch('/api/save', { method: 'POST' });
toast.promise(savePromise, {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save'
});
```

#### Alert

Important message with severity levels.

```typescript
interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning';
  title?: string;
  description?: string;
  className?: string;
}
```

**Examples:**

```typescript
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This feature is experimental and may change.
  </AlertDescription>
</Alert>
```

---

## Advanced Usage

### Custom Themes

```typescript
// Custom theme configuration
const customTheme = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#64748B',
    accent: '#F59E0B',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  }
};

// Apply custom theme
<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

### Component Composition

```typescript
// Complex form with validation
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            required
          />
          
          <textarea
            className="w-full p-3 border rounded-md"
            placeholder="Your message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          />
          
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

### Server Component Integration

```typescript
// Server component with client boundary
'use client';

import { Button, Card } from '@repo/ui';

export function InteractiveClient({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  
  return (
    <Card>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
      {children}
    </Card>
  );
}
```

---

## Accessibility Features

### Built-in Accessibility

All components include:

- **Keyboard Navigation**: Full keyboard support with proper tab order
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Proper focus trapping and restoration
- **High Contrast**: Works with high contrast modes
- **Reduced Motion**: Respects user motion preferences

### Accessibility Testing

```typescript
// Testing accessibility with React Testing Library
import { render, screen } from '@testing-library/react';
import { Button } from '@repo/ui';

test('Button is accessible', () => {
  render(<Button>Click me</Button>);
  
  const button = screen.getByRole('button', { name: 'Click me' });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('type', 'button');
});
```

### Custom Accessibility

```typescript
// Custom accessible component
interface AccessibleComponentProps {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function AccessibleComponent({ 
  children, 
  ariaLabel, 
  ariaDescribedBy 
}: AccessibleComponentProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('@repo/ui/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Bundle Optimization

```typescript
// Tree-shaking friendly imports
import { Button } from '@repo/ui/Button'; // Specific import
// vs
import { Button } from '@repo/ui'; // Barrel import (larger bundle)

// Use specific imports for better tree-shaking
```

### React 19 Optimizations

Components are optimized for React 19 features:

- **Automatic Memoization**: No manual useMemo/useCallback needed
- **Activity Component**: Background rendering support
- **Server Components**: SSR and streaming support
- **Concurrent Features**: Smooth transitions and loading states

---

## Testing

### Unit Testing

```typescript
// Component testing example
import { render, fireEvent, screen } from '@testing-library/react';
import { Button } from '@repo/ui';

test('Button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Accessibility Testing

```typescript
// Accessibility testing with axe-core
import { render, axe } from '@testing-library/react';
import { Button } from '@repo/ui';

test('Button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Visual Testing

```typescript
// Visual regression testing with Chromatic
import { Story } from '@storybook/react';
import { Button } from '@repo/ui';

export const Default: Story = {
  render: () => <Button>Click me</Button>,
};
```

---

## Migration Guide

### From Custom Components

```typescript
// Before: Custom button component
function CustomButton({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
}

// After: UI library button
import { Button } from '@repo/ui';
function MyComponent() {
  return (
    <Button variant="default">
      Click me
    </Button>
  );
}
```

### Version Updates

Check the changelog for breaking changes when updating versions:

```bash
# Check current version
pnpm list @repo/ui

# Update to latest
pnpm update @repo/ui
```

---

## Contributing

### Adding New Components

1. **Create Component File**: `packages/ui/src/components/NewComponent/NewComponent.tsx`
2. **Add Tests**: `packages/ui/src/components/NewComponent/__tests__/NewComponent.test.tsx`
3. **Update Exports**: Add to `packages/ui/src/index.ts`
4. **Document**: Add to this documentation
5. **Storybook**: Add Storybook stories

### Component Template

```typescript
// packages/ui/src/components/NewComponent/NewComponent.tsx
import React from 'react';
import { cn } from '@repo/utils';

interface NewComponentProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary';
}

export const NewComponent = ({ 
  children, 
  className,
  variant = 'default' 
}: NewComponentProps) => {
  return (
    <div className={cn(
      'new-component',
      `new-component--${variant}`,
      className
    )}>
      {children}
    </div>
  );
};
```

### Style Guidelines

- **Consistent Naming**: Use PascalCase for components
- **Prop Interfaces**: Always define TypeScript interfaces
- **Default Props**: Use default parameters instead of defaultProps
- **ClassName Support**: Always accept className prop for customization
- **Accessibility**: Include proper ARIA attributes

---

## Troubleshooting

### Common Issues

#### Styling Not Applied

```typescript
// Ensure ThemeProvider is in root layout
import { ThemeProvider } from '@repo/ui';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

#### TypeScript Errors

```typescript
// Ensure proper imports and types
import { Button } from '@repo/ui';
// Not: import { Button } from '@repo/ui/Button';
```

#### Performance Issues

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

### Getting Help

- **Documentation**: Check this guide first
- **GitHub Issues**: Report bugs and request features
- **Community**: Ask questions in discussions
- **Code Review**: Get feedback on component contributions

---

## Roadmap

### Planned Features

- **Design System**: Comprehensive design token system
- **Component Variants**: More styling options
- **Animation Library**: Consistent motion patterns
- **Form Library**: Advanced form components
- **Data Display**: Tables, charts, and visualizations

### Future Enhancements

- **AI-Powered Components**: Smart form validation
- **Advanced Theming**: Dynamic theme switching
- **Performance Monitoring**: Built-in performance tracking
- **Accessibility Testing**: Automated a11y testing

---

_This UI library documentation evolves with the component system. Last updated: 2026-02-18_
