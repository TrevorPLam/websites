# package-level-fsd-implementation.md

> **Internal Template – customize as needed**  
> **2026 Standards Compliance** | Feature-Sliced Design 2.1 · Next.js 16 App Router

## 2026 Standards Compliance

- **Feature-Sliced Design 2.1**: Latest FSD standards with layer hierarchy
- **Next.js 16 App Router**: Modern React patterns with Server Components
- **Zero-Trust Architecture**: Per-request validation, no trusted internal state
- **Core Web Vitals**: Component rendering < 100ms (INP budget)
- **TypeScript 5.1**: Full type safety with strict configuration
- **WCAG 2.2 AA**: Accessibility compliance for all UI components

---

## Overview

Package-level Feature-Sliced Design (FSD) implementation provides a scalable architecture for multi-tenant SaaS applications. This guide demonstrates how to structure packages according to FSD 2.1 principles, implement proper layer isolation, and manage cross-slice communication using the `@x` notation. The implementation supports both shared packages and application-specific packages while maintaining strict architectural boundaries.

## FSD Layer Hierarchy (Low → High Coupling)

```
shared        ← Utilities, UI primitives, constants
entities      ← Business entities (Tenant, User, Site)
features      ← User interactions (CreateSite, UpdateBilling)
widgets       ← Composite blocks (SiteCard, TenantHeader)
pages         ← Full pages composed of widgets/features
app           ← App-level setup (providers, routing, layout)
```

**Rule:** A layer may only import from layers **below** it in the hierarchy.

---

## Package Structure Patterns

### Next.js App (`apps/portal/`)

```
apps/portal/src/
├── app/                    # [app] — Next.js App Router (routing only)
│   ├── layout.tsx
│   ├── page.tsx
│   └── [tenant]/
│       ├── dashboard/
│       │   └── page.tsx    # Thin: imports from pages/
│       └── settings/
│           └── page.tsx
│
├── pages/                  # [pages] — Full page compositions
│   ├── dashboard/
│   │   ├── index.tsx       # Composes widgets, handles data loading
│   │   └── ui/
│   ├── settings/
│   │   ├── index.tsx
│   │   └── ui/
│   └── billing/
│       ├── index.tsx
│       └── ui/
│
├── widgets/                # [widgets] — Composite reusable blocks
│   ├── site-header/
│   │   ├── index.ts
│   │   └── ui/SiteHeader.tsx
│   ├── analytics-chart/
│   │   ├── index.ts
│   │   └── ui/AnalyticsChart.tsx
│   └── lead-feed/
│       ├── index.ts
│       └── ui/LeadFeed.tsx
│
├── features/               # [features] — User interactions with side effects
│   ├── create-site/
│   │   ├── index.ts
│   │   ├── ui/CreateSiteForm.tsx
│   │   ├── model/use-create-site.ts
│   │   └── api/create-site-action.ts
│   ├── update-billing/
│   │   ├── index.ts
│   │   ├── ui/UpdatePaymentForm.tsx
│   │   └── api/update-payment-action.ts
│   └── invite-member/
│       ├── index.ts
│       ├── ui/InviteMemberModal.tsx
│       └── api/invite-member-action.ts
│
├── entities/               # [entities] — Business objects, no side effects
│   ├── tenant/
│   │   ├── index.ts
│   │   ├── model/tenant.schema.ts
│   │   └── ui/TenantAvatar.tsx
│   ├── site/
│   │   ├── index.ts
│   │   ├── model/site.schema.ts
│   │   └── ui/SiteCard.tsx
│   └── user/
│       ├── index.ts
│       ├── model/user.schema.ts
│       └── ui/UserAvatar.tsx
│
└── shared/                 # [shared] — Zero business logic
    ├── lib/
    │   ├── cn.ts           # className utility
    │   ├── format-date.ts
    │   └── slugify.ts
    ├── ui/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── Modal.tsx
    ├── api/
    │   └── supabase-client.ts
    └── config/
        └── constants.ts
```

### Shared Package (`packages/ui/`)

Shared packages only implement `shared/` layer content — they have no `features/`, `pages/`, or `app/` layers:

```
packages/ui/src/
├── button/
│   ├── index.ts
│   ├── Button.tsx
│   └── button.test.tsx
├── input/
│   ├── index.ts
│   ├── Input.tsx
│   └── input.test.tsx
├── modal/
│   ├── index.ts
│   └── Modal.tsx
└── index.ts                # Public API barrel
```

### Feature Package (`packages/auth/`)

Feature packages may implement `entities/` and `features/` layers but not `pages/` or `app/`:

```
packages/auth/src/
├── features/
│   ├── sign-in/
│   │   ├── index.ts
│   │   ├── ui/SignInForm.tsx
│   │   └── api/sign-in-action.ts
│   └── sign-out/
│       ├── index.ts
│       └── api/sign-out-action.ts
├── entities/
│   └── session/
│       ├── index.ts
│       └── model/session.schema.ts
└── shared/
    ├── lib/
    │   ├── verify-token.ts
    │   └── create-session.ts
    └── config/
        └── auth-config.ts
```

---

## Cross-Slice Communication with @x Notation

### Public API Pattern

Each slice exports a public API that defines what other slices can access:

```typescript
// entities/tenant/@x/site.ts
// Only exports what the 'site' slice is allowed to use from 'tenant'

export { TenantAvatar } from '../ui/TenantAvatar';
export type { TenantContext } from '../model/tenant.schema';
export { getTenantById } from '../api/tenant-api';
```

### Usage in Other Slices

```typescript
// features/create-site/ui/CreateSiteForm.tsx

// ✅ Correct — importing via public @x API
import { TenantAvatar } from '@/entities/tenant/@x/site';

// ❌ Incorrect — direct import violates FSD rules
// import { TenantAvatar } from '@/entities/tenant/ui/TenantAvatar';

export function CreateSiteForm() {
  return (
    <div>
      <TenantAvatar />
      {/* ... */}
    </div>
  );
}
```

### @x API Structure

```typescript
// entities/tenant/@x/index.ts
// Master @x API for tenant entity

export * from './auth'; // For auth slice
export * from './site'; // For site slice
export * from './billing'; // For billing slice
export * from './analytics'; // For analytics slice
```

---

## Implementation Examples

### Entity Layer Implementation

```typescript
// entities/tenant/model/tenant.schema.ts
import { z } from 'zod';

export const TenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(63),
  name: z.string().min(1).max(100),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'suspended', 'deleted']),
  customDomain: z.string().url().optional(),
  features: z.array(z.string()),
  billingStatus: z.enum(['current', 'past_due', 'canceled']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Tenant = z.infer<typeof TenantSchema>;

// No side effects - pure data structures
export const createTenant = (data: Partial<Tenant>): Tenant => {
  return TenantSchema.parse({
    id: crypto.randomUUID(),
    slug: '',
    name: '',
    plan: 'free',
    status: 'active',
    features: [],
    billingStatus: 'current',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  });
};
```

```typescript
// entities/tenant/ui/TenantAvatar.tsx
import { cn } from '@/shared/lib/cn';
import type { Tenant } from '../model/tenant.schema';

interface TenantAvatarProps {
  tenant: Tenant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TenantAvatar({ tenant, size = 'md', className }: TenantAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-r from-blue-500 to-purple-600',
      sizeClasses[size],
      className
    )}>
      <span className="text-white font-semibold">
        {tenant.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
```

### Feature Layer Implementation

```typescript
// features/create-site/model/use-create-site.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSite } from '../api/create-site-action';
import type { Site } from '@/entities/site/model/site.schema';

export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSite,
    onSuccess: (newSite) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.setQueryData(['site', newSite.id], newSite);
    },
    onError: (error) => {
      console.error('Failed to create site:', error);
    },
  });
}
```

```typescript
// features/create-site/api/create-site-action.ts
'use server';
import { revalidatePath } from 'next/cache';
import { createSite as createSiteService } from '@/entities/site/api/site-service';
import { getCurrentTenant } from '@/shared/lib/tenant-context';

export async function createSite(data: { name: string; domain: string; template: string }) {
  const tenant = getCurrentTenant();

  if (!tenant) {
    throw new Error('No tenant context found');
  }

  const site = await createSiteService({
    ...data,
    tenantId: tenant.id,
  });

  // Revalidate related pages
  revalidatePath('/dashboard');
  revalidatePath(`/sites/${site.id}`);

  return site;
}
```

### Widget Layer Implementation

```typescript
// widgets/site-header/index.ts
export { SiteHeader } from './ui/SiteHeader';
export type { SiteHeaderProps } from './ui/SiteHeader';
```

```typescript
// widgets/site-header/ui/SiteHeader.tsx
import { SiteHeaderProps } from '../index';
import { SiteCard } from '@/entities/site/@x/header';
import { EditSiteButton } from '@/features/edit-site/@x/widgets';

export function SiteHeader({ site, onEdit }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-info">
        <SiteCard site={site} variant="compact" />
      </div>
      <div className="site-actions">
        <EditSiteButton siteId={site.id} onEdit={onEdit} />
      </div>
    </header>
  );
}
```

### Page Layer Implementation

```typescript
// pages/dashboard/index.tsx
import { SiteHeader } from '@/widgets/site-header';
import { CreateSiteForm } from '@/features/create-site';
import { SiteList } from '@/features/site-list';
import { getCurrentTenant } from '@/shared/lib/tenant-context';

export default async function DashboardPage() {
  const tenant = getCurrentTenant();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {tenant?.name}</h1>
        <CreateSiteForm />
      </div>

      <div className="dashboard-content">
        <SiteList />
      </div>
    </div>
  );
}
```

---

## Package Configuration

### Package.json Structure

```json
{
  "name": "@repo/portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start",
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/auth": "workspace:*",
    "@repo/types": "workspace:*",
    "next": "16.1.0",
    "react": "19.2.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "^9.0.0",
    "typescript": "^5.1.0"
  }
}
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/features/*": ["./src/features/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/pages/*": ["./src/pages/*"],
      "@repo/ui": ["../../packages/ui/src"],
      "@repo/auth": ["../../packages/auth/src"],
      "@repo/types": ["../../packages/types/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

---

## Linting and Validation

### Steiger Configuration

```typescript
// steiger.config.ts
import { defineConfig } from '@feature-sliced/steiger-plugin';

export default defineConfig([
  {
    // Rule for all packages
    rules: {
      'fsd/no-cross-slice-imports': 'error', // No feature → feature imports
      'fsd/public-api-only': 'error', // Must use index.ts public API
    },
  },
  {
    // Rule for app packages
    files: ['apps/*/src/**/*'],
    rules: {
      'fsd/layer-imports-only': 'error', // Only import features, entities, shared
    },
  },
  {
    // Rule for shared packages
    files: ['packages/*/src/**/*'],
    rules: {
      'fsd/no-upper-layer-imports': 'error', // shared cannot import entities+
    },
  },
]);
```

### ESLint Rules

```typescript
// eslint.config.mjs
import fsd from '@feature-sliced/steiger-plugin';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@feature-sliced': fsd,
    },
    rules: {
      '@feature-sliced/no-cross-slice-imports': 'error',
      '@feature-sliced/public-api-only': 'error',
      '@feature-sliced/layer-imports-only': 'error',
      '@feature-sliced/no-upper-layer-imports': 'error',
    },
  },
];
```

---

## Testing Strategy

### Unit Tests

```typescript
// entities/tenant/__tests__/tenant.test.ts
import { describe, it, expect } from 'vitest';
import { createTenant } from '../model/tenant.schema';

describe('Tenant Entity', () => {
  it('creates tenant with default values', () => {
    const tenant = createTenant({ name: 'Test Tenant' });

    expect(tenant.name).toBe('Test Tenant');
    expect(tenant.plan).toBe('free');
    expect(tenant.status).toBe('active');
    expect(tenant.id).toBeDefined();
  });

  it('validates tenant schema', () => {
    const invalidTenant = {
      name: '',
      plan: 'invalid',
      status: 'invalid',
    };

    expect(() => TenantSchema.parse(invalidTenant)).toThrow();
  });
});
```

### Integration Tests

```typescript
// features/create-site/__tests__/integration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateSiteForm } from '../ui/CreateSiteForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Create Site Feature', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('creates site successfully', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateSiteForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText('Site Name'), {
      target: { value: 'Test Site' },
    });

    fireEvent.change(screen.getByLabelText('Domain'), {
      target: { value: 'test.example.com' },
    });

    fireEvent.click(screen.getByText('Create Site'));

    await waitFor(() => {
      expect(screen.getByText('Site created successfully')).toBeInTheDocument();
    });
  });
});
```

---

## Performance Optimization

### Code Splitting

```typescript
// features/create-site/ui/CreateSiteForm.tsx
import dynamic from 'next/dynamic';

const SiteTemplateSelector = dynamic(
  () => import('./SiteTemplateSelector'),
  {
    loading: () => <div>Loading templates...</div>,
    ssr: false
  }
);

export function CreateSiteForm() {
  return (
    <div>
      <SiteTemplateSelector />
      {/* ... */}
    </div>
  );
}
```

### Bundle Optimization

```typescript
// widgets/site-header/ui/SiteHeader.tsx
import { lazyLoad } from '@/shared/lib/lazy-load';

// Lazy load heavy components
const SiteAnalytics = lazyLoad(() => import('./SiteAnalytics'));

export function SiteHeader({ site }: SiteHeaderProps) {
  return (
    <header>
      <SiteCard site={site} />
      <SiteAnalytics siteId={site.id} />
    </header>
  );
}
```

---

## Migration Guide

### From Traditional Structure to FSD

```typescript
// Before: Traditional structure
// components/SiteCard.tsx
// pages/Dashboard.tsx
// utils/formatDate.ts

// After: FSD structure
// entities/site/ui/SiteCard.tsx
// pages/dashboard/index.tsx
// shared/lib/formatDate.ts
```

### Step-by-Step Migration

1. **Create Layer Directories**

   ```bash
   mkdir -p src/{shared,entities,features,widgets,pages}
   ```

2. **Move Components to Layers**

   ```bash
   # Move UI components to shared
   mv components/Button.tsx src/shared/ui/

   # Move business entities to entities
   mv components/SiteCard.tsx src/entities/site/ui/

   # Move forms to features
   mv components/CreateSiteForm.tsx src/features/create-site/ui/
   ```

3. **Create Public APIs**

   ```typescript
   // entities/site/@x/index.ts
   export * from './dashboard';
   export * from './site-list';
   ```

4. **Update Imports**

   ```typescript
   // Before
   import { SiteCard } from '../components/SiteCard';

   // After
   import { SiteCard } from '@/entities/site/@x/dashboard';
   ```

---

## Best Practices

### 1. Layer Separation

- **Shared**: No business logic, pure utilities
- **Entities**: Business objects, no side effects
- **Features**: User interactions, API calls
- **Widgets**: UI composition, no business logic
- **Pages**: Data loading, layout composition

### 2. Public API Design

```typescript
// ✅ Good: Minimal, focused API
export { SiteCard } from '../ui/SiteCard';
export type { Site } from '../model/site.schema';

// ❌ Bad: Exporting everything
export * from '../ui';
export * from '../model';
export * from '../api';
```

### 3. Cross-Slice Communication

```typescript
// ✅ Good: Use @x notation
import { UserAvatar } from '@/entities/user/@x/site';

// ❌ Bad: Direct import
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
```

### 4. Testing Strategy

```typescript
// ✅ Good: Test each layer separately
describe('Entity Layer', () => {
  /* ... */
});
describe('Feature Layer', () => {
  /* ... */
});
describe('Widget Layer', () => {
  /* ... */
});

// ❌ Bad: Testing implementation details
describe('Component Internals', () => {
  /* ... */
});
```

---

## Troubleshooting

### Common Issues

1. **Circular Dependencies**
   - Check layer hierarchy
   - Use @x notation for cross-layer communication
   - Move shared logic to shared layer

2. **Import Errors**
   - Verify package.json dependencies
   - Check TypeScript paths configuration
   - Ensure public API exports exist

3. **Build Failures**
   - Check Steiger configuration
   - Verify ESLint rules
   - Ensure proper TypeScript types

### Debugging Tools

```typescript
// shared/lib/debug-fsd.ts
export function debugFSD(slice: string, layer: string, message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[FSD] ${slice}/${layer}: ${message}`);
  }
}

// Usage
debugFSD('tenant', 'entities', 'Creating tenant entity');
```

---

## References

- [Feature-Sliced Design Official Documentation](https://feature-sliced.design/) — FSD principles and patterns
- [Steiger FSD Linter](https://github.com/feature-sliced/steiger) — FSD validation and linting
- [@x Notation Guide](https://feature-sliced.design/docs/reference/public-api#cross-imports) — Cross-slice communication
- [FSD in Monorepos](https://feature-sliced.design/docs/guides/examples/monorepo) — Monorepo implementation patterns
- [Next.js 16 Documentation](https://nextjs.org/docs) — App Router and Server Components
- [TypeScript 5.1 Features](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html) — Latest TypeScript features

---
