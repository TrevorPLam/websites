---
doc_id: "UI-2026-PACKAGE-README"
doc_version: "2.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "ui-team@marketing-websites.com"

# Bimodal Classification
ai_readiness_score: 0.89
human_ttv_seconds: 18
bimodal_grade: "A"

# Technical Context
type: package
language: typescript
framework: react
runtime: browser
complexity: component

# Compliance & Governance
compliance_frameworks:
- "SOC2-Type-II"
- "GDPR-Article-32"
- "WCAG-2.2-AA"
- "EU-AI-Act-High-Risk"
risk_classification: "medium-risk"
data_governance: "PII-Encrypted"

# AI Retrieval Optimization
rag_optimization:
  chunk_strategy: "recursive-headers"
  chunk_size: 800
  chunk_overlap: 120
  late_chunking: true
  embedding_model: "text-embedding-3-large"
  hybrid_search: true

# Executable Documentation
executable_status: true
ci_validation: true
last_executed: "2026-02-27T13:45:00Z"

# Maintenance & Quality
maintenance_mode: "active"
stale_threshold_days: 90
audit_trail: "github-actions"
---

# @repo/ui

**Version:** 1.0.0  
**Last Updated:** 2026-02-27  
**Maintainers:** Development Team

## Overview

`@repo/ui` is the comprehensive UI component library for the marketing-websites platform. It provides 68+ UI primitives built with React 19, TypeScript, and Tailwind CSS 4, following modern accessibility and performance standards.

### Key Features

- **68+ UI Primitives:** Complete component library for building interfaces
- **React 19 Compatible:** Server Components by default, Client Components for interactivity
- **TypeScript First:** Full type safety with comprehensive interfaces
- **Accessibility Compliant:** WCAG 2.2 AA compliance built-in
- **Tailwind CSS 4:** Modern styling with design tokens
- **Performance Optimized:** Server Components, code splitting, lazy loading

---

## Installation

```bash
pnpm add @repo/ui
```

### Dependencies

- **React:** 19.0.0 (peer dependency)
- **React DOM:** 19.0.0 (peer dependency)
- **Tailwind CSS:** 4.1.0 (peer dependency)
- **@repo/utils:** Utility functions (internal dependency)

---

## Usage

### Basic Usage

```typescript
import { Button, Input, Card } from '@repo/ui';

export function ContactForm() {
  return (
    <Card className="p-6">
      <h2>Contact Us</h2>
      <form>
        <Input
          type="email"
          placeholder="Your email"
          className="mb-4"
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Card>
  );
}
```

### Server vs Client Components

```typescript
// Server Component (default)
export function ServerComponent() {
  return (
    <div>
      <h1>Server Component</h1>
      <p>No interactivity, rendered on server</p>
    </div>
  );
}

// Client Component (for interactivity)
'use client';
import { useState } from 'react';

export function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Client Component</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

### Theme Integration

```typescript
import { Button } from '@repo/ui';
import { cn } from '@repo/utils';

export function ThemedButton({ variant = 'primary', className, ...props }) {
  return (
    <Button
      variant={variant}
      className={cn(
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}
```

---

## API Reference

### Core Components

#### **Button**

Primary action component with multiple variants and states.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Examples:**

```typescript
// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="lg">
  Large Button
</Button>

// Loading state
<Button loading={true}>
  Processing...
</Button>

// Disabled state
<Button disabled={true}>
  Disabled
</Button>
```

#### **Input**

Form input component with validation states.

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
```

**Examples:**

```typescript
// Basic input
<Input placeholder="Enter your name" />

// With validation
<Input
  type="email"
  placeholder="Email address"
  error="Invalid email format"
  required
/>

// Controlled input
const [value, setValue] = useState('');
<Input
  value={value}
  onChange={setValue}
  placeholder="Controlled input"
/>
```

#### **Card**

Container component for grouping related content.

```typescript
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}
```

**Examples:**

```typescript
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Components

#### **Form**

Form container with validation and submission handling.

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
}
```

#### **FormField**

Form field with label, input, and error handling.

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}
```

**Examples:**

```typescript
<Form onSubmit={handleSubmit}>
  <FormField
    label="Email"
    name="email"
    type="email"
    placeholder="Enter your email"
    required
    error={errors.email}
  />
  <FormField
    label="Message"
    name="message"
    placeholder="Your message"
    required
  />
  <Button type="submit">Submit</Button>
</Form>
```

### Layout Components

#### **Container**

Responsive container with max-width and padding.

```typescript
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: React.ReactNode;
}
```

#### **Grid**

CSS Grid layout system.

```typescript
interface GridProps {
  cols?: number | string;
  gap?: number | string;
  className?: string;
  children: React.ReactNode;
}
```

**Examples:**

```typescript
<Container size="lg" className="py-8">
  <Grid cols={3} gap={6}>
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
  </Grid>
</Container>
```

### Navigation Components

#### **Navigation**

Main navigation component with responsive design.

```typescript
interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}
```

#### **Breadcrumb**

Breadcrumb navigation for hierarchical content.

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

**Examples:**

```typescript
<Navigation
  items={[
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]}
/>

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Web Design', href: '/services/web-design' }
  ]}
/>
```

### Feedback Components

#### **Toast**

Notification component for user feedback.

```typescript
interface ToastProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}
```

#### **Alert**

Alert component for important messages.

```typescript
interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

**Examples:**

```typescript
// Toast notification
<Toast
  variant="success"
  title="Success!"
  description="Your changes have been saved."
  duration={5000}
/>

// Alert message
<Alert
  variant="warning"
  title="Warning"
  description="This action cannot be undone."
  dismissible
/>
```

---

## Advanced Usage

### Custom Components

Create custom components that extend the base UI library:

```typescript
// Custom button with additional features
import { Button as BaseButton } from '@repo/ui';
import { cn } from '@repo/utils';

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function CustomButton({
  icon,
  iconPosition = 'left',
  className,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <BaseButton className={cn('flex items-center gap-2', className)} {...props}>
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </BaseButton>
  );
}
```

### Theme Customization

Customize component appearance using Tailwind CSS:

```typescript
// Themed component
import { Button } from '@repo/ui';
import { cn } from '@repo/utils';

export function ThemedButton({ className, ...props }) {
  return (
    <Button
      className={cn(
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'hover:from-blue-600 hover:to-purple-700',
        'text-white font-semibold',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}
```

### Server Component Patterns

Leverage React Server Components for optimal performance:

```typescript
// Server component with data fetching
async function ProductList() {
  const products = await getProducts(); // Server-side data fetching

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client component for interactivity
'use client';
import { useState } from 'react';

function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Button
        onClick={() => setIsLiked(!isLiked)}
        variant={isLiked ? 'secondary' : 'primary'}
      >
        {isLiked ? 'Liked' : 'Like'}
      </Button>
    </Card>
  );
}
```

---

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

---

## Component Library Structure

```
src/
├── components/          # All UI components
│   ├── button.tsx       # Button component
│   ├── input.tsx        # Input component
│   ├── card.tsx         # Card component
│   └── ...              # Other components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── index.ts            # Main exports
└── index.client.ts    # Client-safe exports
```

### Export Structure

```typescript
// Main exports (server-safe)
export { Button } from './components/button';
export { Input } from './components/input';
export { Card } from './components/card';
// ... other server-safe exports

// Client exports (interactive components)
export { Button as ClientButton } from './components/button.client';
export { InteractiveComponent } from './components/interactive';
```

---

## Accessibility

All components are built with WCAG 2.2 AA compliance in mind:

- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Support:** Proper ARIA labels and roles
- **Focus Management:** Visible focus indicators
- **Color Contrast:** 4.5:1 contrast ratio minimum
- **Touch Targets:** 24x24px minimum touch targets

### Accessibility Examples

```typescript
// Accessible button with proper ARIA
<Button
  aria-label="Submit form"
  aria-describedby="form-help"
  disabled={isLoading}
>
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>

// Accessible form field
<FormField
  label="Email address"
  name="email"
  type="email"
  required
  aria-describedby="email-help"
  error={errors.email}
  aria-invalid={!!errors.email}
/>
<div id="email-help" className="text-sm text-gray-600">
  Enter your email address for account updates
</div>
```

---

## Performance

### Server Components

Components are optimized for React Server Components:

- **Zero Client JavaScript:** Server components render to HTML
- **Faster Page Loads:** No client-side hydration needed
- **Better SEO:** Search engines can crawl content
- **Reduced Bundle Size:** Less JavaScript sent to client

### Code Splitting

Components use automatic code splitting:

```typescript
// Lazy loading for heavy components
const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Client-side only
});
```

### Bundle Optimization

- **Tree Shaking:** Unused components are excluded from bundle
- **Minification:** Production builds are minified
- **Compression:** Gzip compression for production
- **Caching:** Long-term caching headers for static assets

---

## Theming

### Design Tokens

Components use design tokens for consistent styling:

```typescript
// Design token usage
const buttonStyles = {
  primary: {
    backgroundColor: 'var(--color-primary-500)',
    color: 'var(--color-white)',
    borderColor: 'var(--color-primary-500)',
  },
  secondary: {
    backgroundColor: 'var(--color-gray-100)',
    color: 'var(--color-gray-900)',
    borderColor: 'var(--color-gray-300)',
  },
};
```

### Custom Themes

Create custom themes using CSS variables:

```css
/* Custom theme */
:root {
  --color-primary-500: #3b82f6;
  --color-secondary-500: #64748b;
  --color-success-500: #10b981;
  --color-error-500: #ef4444;
  --color-warning-500: #f59e0b;
}
```

---

## Migration Guide

### From Previous Versions

If you're migrating from an older version of `@repo/ui`:

1. **Update Dependencies:** Ensure React 19 and TypeScript 5.9+
2. **Check Imports:** Some imports may have changed
3. **Update Server Components:** Review server/client component usage
4. **Test Accessibility:** Verify accessibility compliance

### Breaking Changes

- **React 19 Required:** No longer supports React 18
- **Server Components Default:** Components are server components by default
- **TypeScript Strict Mode:** All components use strict TypeScript
- **Tailwind CSS 4:** Updated styling system

---

## Contributing

### Adding New Components

1. **Create Component File:** `src/components/new-component.tsx`
2. **Add Tests:** `src/components/__tests__/new-component.test.tsx`
3. **Update Exports:** Add to `src/index.ts`
4. **Add Documentation:** Update this README
5. **Run Tests:** Ensure all tests pass

### Component Guidelines

- **TypeScript First:** Always use TypeScript interfaces
- **Accessibility First:** Ensure WCAG 2.2 AA compliance
- **Server Components:** Default to server components
- **Performance:** Optimize for server rendering
- **Testing:** Include comprehensive tests

### Code Style

```typescript
// Component template
'use client'; // Only if needed for interactivity

import { cn } from '@repo/utils';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function Component({ className, children, ...props }: ComponentProps) {
  return (
    <div className={cn('component-base-styles', className)} {...props}>
      {children}
    </div>
  );
}
```

---

## Changelog

### 1.0.0 (2026-02-21)

#### Added

- 68+ UI components
- React 19 Server Components support
- TypeScript 5.9 strict mode
- WCAG 2.2 AA compliance
- Tailwind CSS 4 integration
- Comprehensive testing suite
- Performance optimizations

#### Changed

- Migrated from React 18 to React 19
- Updated to TypeScript 5.9
- Enhanced accessibility compliance
- Improved performance with server components

#### Deprecated

- Legacy component exports (use new export structure)

---

## Support

### Getting Help

- **Documentation:** [Component Library Guide](../components/ui-library.md)
- **Examples:** [Component Examples](../examples/ui-components/)
- **Issues:** [GitHub Issues](https://github.com/your-org/marketing-websites/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/marketing-websites/discussions)

### Reporting Issues

When reporting issues, please include:

1. **Component Name:** Which component is affected
2. **React Version:** Ensure React 19 compatibility
3. **TypeScript Version:** Ensure TypeScript 5.9+
4. **Browser:** Which browser and version
5. **Steps to Reproduce:** Clear reproduction steps
6. **Expected vs Actual:** What you expected vs what happened

---

## License

MIT License - see [LICENSE](../../../LICENSE) for details.

---

**Package Last Updated:** 2026-02-21  
**Next Review:** 2026-05-21  
**Maintainers:** Development Team  
**Classification:** Public  
**Questions:** Create GitHub issue with `ui` label
