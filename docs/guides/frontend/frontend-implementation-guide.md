# Frontend Implementation Guide

> **Modern Frontend Development with Next.js 16 & React 19 — February 2026**

## Overview

Comprehensive frontend development guide covering Next.js 16, React 19, TypeScript, and modern development patterns. Focus on practical implementation and production-ready patterns.

## Key Features

- **Next.js 16**: Latest features with App Router and PPR
- **React 19**: Server Components and new hooks
- **TypeScript**: Strict mode with comprehensive typing
- **Performance**: Core Web Vitals optimization
- **Accessibility**: WCAG 2.2 AA compliance

---

## ⚛️ React 19 Implementation

### Server Components Pattern

```typescript
// React 19 Server Component - Default pattern
export async function UserProfile({ userId }: { userId: string }) {
  // Server-side data fetching
  const user = await getUser(userId);
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Client Component for interactivity
'use client';

export function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  
  const handleFollow = async () => {
    await followUser(userId);
    setIsFollowing(!isFollowing);
  };
  
  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### New React 19 Hooks

```typescript
// useActionState for form handling
'use client';

import { useActionState } from 'react';

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Server action
      await sendContactForm(formData);
      return { success: true, message: 'Form submitted successfully!' };
    },
    { success: false, message: '' }
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
      {state.success && <p>{state.message}</p>}
    </form>
  );
}

// useFormStatus for form state
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

---

## 🚀 Next.js 16 Features

### Partial Pre-rendering (PPR)

```typescript
// next.config.ts
export default {
  experimental: {
    ppr: true, // Enable Partial Pre-rendering
  },
};

// Page with PPR - Static shell + dynamic content
export async function ProductPage({ params }: { params: { id: string } }) {
  // Static content (rendered at build time)
  const staticContent = (
    <div>
      <h1>Product Details</h1>
      <p>View our comprehensive product information</p>
    </div>
  );

  // Dynamic content (rendered at request time)
  const product = await getProduct(params.id);

  return (
    <div>
      {staticContent}
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <span>${product.price}</span>
      </div>
    </div>
  );
}
```

### Advanced Middleware

```typescript
// middleware.ts - Enhanced tenant resolution
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Tenant resolution logic
  const tenantId = resolveTenant(subdomain);
  
  // Add tenant context to headers
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenantId);
  response.headers.set('x-subdomain', subdomain);
  
  // Rate limiting per tenant
  const clientIP = request.ip || 'anonymous';
  const rateLimitKey = `rate-limit:${tenantId}:${clientIP}`;
  
  // Check rate limit (simplified)
  if (isRateLimited(rateLimitKey)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 🎨 Tailwind CSS v4

### CSS-First Configuration

```css
/* app.css - Tailwind v4 CSS-first approach */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #64748b;
  --color-secondary-foreground: #ffffff;
  
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium;
  }
  
  .card {
    @apply bg-white border border-gray-200 rounded-lg shadow-sm;
  }
}
```

### Component Patterns

```typescript
// UI components with Tailwind v4
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-gray-300 hover:bg-gray-50',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        sizeClasses[size], 
        className
      )}
    >
      {children}
    </button>
  );
}
```

---

## 📱 Performance Optimization

### Core Web Vitals Targets

```typescript
// lib/performance.ts
export const CWV_TARGETS = {
  LCP: 2500,  // Largest Contentful Paint (ms)
  INP: 200,   // Interaction to Next Paint (ms)
  CLS: 0.1,   // Cumulative Layout Shift
} as const;

// Performance monitoring
export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (metric.value > CWV_TARGETS[metric.name as keyof typeof CWV_TARGETS]) {
    console.warn(`Performance regression: ${metric.name} = ${metric.value}ms`);
  }
}

// Image optimization
export function OptimizedImage({ 
  src, 
  alt, 
  priority = false,
  className 
}: ImageProps) {
  return (
    <picture>
      <source 
        srcSet={`${src}?format=webp&w=800`} 
        type="image/webp" 
      />
      <img
        src={`${src}?w=800`}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        width={800}
        height={400}
      />
    </picture>
  );
}
```

### Bundle Optimization

```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

// Heavy components loaded on demand
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <div>Loading dashboard...</div>,
  ssr: false, // Client-side only for admin features
});

const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <div>Loading chart...</div>,
});

// Usage in component
export function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminDashboard />}
      <ChartComponent />
    </div>
  );
}
```

---

## 🧪 Testing Patterns

### Component Testing

```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete purchase flow', async ({ page }) => {
  await page.goto('/');
  
  // Navigate to product
  await page.click('[data-testid="product-link"]');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  
  // Checkout
  await page.click('[data-testid="checkout-button"]');
  
  // Fill form
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="name"]', 'Test User');
  
  // Submit
  await page.click('[data-testid="submit-order"]');
  
  // Verify success
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
});
```

---

## ♿ Accessibility Implementation

### WCAG 2.2 AA Compliance

```typescript
// Accessible form component
export function AccessibleForm() {
  return (
    <form role="form" aria-labelledby="form-title">
      <h2 id="form-title" className="sr-only">
        Contact Information
      </h2>
      
      <div className="form-group">
        <label htmlFor="email">
          Email Address
          <span className="required" aria-label="required">
            *
          </span>
        </label>
        <input
          id="email"
          type="email"
          required
          aria-describedby="email-help"
          aria-invalid="false"
        />
        <div id="email-help" className="help-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      
      <button type="submit" className="btn-primary">
        Submit Form
      </button>
    </form>
  );
}

// Focus management
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
      // Trap focus within modal
      const trapFocus = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          // Focus trapping logic
        }
      };
      
      document.addEventListener('keydown', trapFocus);
      return () => document.removeEventListener('keydown', trapFocus);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal-overlay"
    >
      <div className="modal-content">
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

---

## 📋 Performance Checklist

### Pre-Deployment Checklist

- [ ] **LCP < 2.5s**: Optimize images, fonts, and critical resources
- [ ] **INP < 200ms**: Minimize JavaScript execution time
- [ ] **CLS < 0.1**: Specify dimensions for media elements
- [ ] **Bundle Size**: Keep JavaScript under 250KB gzipped
- [ ] **Font Loading**: Use font-display: swap
- [ ] **Image Optimization**: WebP format with responsive sizes
- [ ] **Code Splitting**: Dynamic imports for heavy components
- [ ] **Caching Strategy**: Proper cache headers for static assets

### Monitoring Setup

```typescript
// lib/monitoring.ts
export function setupPerformanceMonitoring() {
  // Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });

  // Error tracking
  window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
  });

  // Performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance Entry:', entry.name, entry.duration);
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
}
```

---

## 🔗 References & Resources

### Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org)

### Performance Standards

- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Audits](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://webpack.js.org/analyse/)

### Accessibility Guidelines

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [axe-core Testing](https://www.deque.com/axe/)
- [React A11y Guide](https://github.com/evcohen/eslint-plugin-jsx-a11y)

---

This consolidated frontend guide provides practical implementation patterns for modern web development while eliminating redundant documentation and focusing on actionable code examples.
