---
title: Modern Development Stack Guide
description: Complete development patterns and best practices for Next.js 16, React 19, and TypeScript
last_updated: 2026-02-26
tags: [#development #react #nextjs #typescript #patterns #stack]
estimated_read_time: 55 minutes
difficulty: advanced
---

# Modern Development Stack Guide

## Overview

Comprehensive development guide covering React 19, Next.js 16, TypeScript 5.1, and modern development patterns. This guide consolidates frontend development, build systems, code quality, and development workflows.

## Key Features

- **React 19**: Server Components, new hooks, and performance features
- **Next.js 16**: App Router, PPR, and Turbopack integration
- **TypeScript 5.1**: Strict mode with advanced type patterns
- **Modern Build Systems**: Turborepo, pnpm, and optimized workflows
- **Code Quality**: Comprehensive linting, formatting, and testing

---

## ⚛️ React 19 Implementation

### Server Components Pattern

```typescript
// Server Component (default)
export async function UserProfile({ userId }: { userId: string }) {
  // Server-side data fetching
  const user = await getUser(userId);
  const posts = await getUserPosts(userId);
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <PostList posts={posts} />
    </div>
  );
}

// Client Component (interactive)
'use client';

export function PostList({ posts }: { posts: Post[] }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post}
          onSelect={setSelectedPost}
        />
      ))}
      {selectedPost && (
        <PostModal 
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
```

### React 19 New Features

#### Activity Component

```typescript
import { Activity } from 'react';

function LoadingSpinner({ fallback }: { fallback: React.ReactNode }) {
  return (
    <Activity fallback={fallback}>
      <ExpensiveComponent />
    </Activity>
  );
}

// Usage
<LoadingSpinner fallback={<div>Loading...</div>} />
```

#### useEffectEvent Hook

```typescript
'use client';

import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  const onMessage = useEffectEvent((message: string) => {
    console.log(`Room ${roomId}: ${message}`);
  });
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost/chat/${roomId}`);
    ws.onmessage = (event) => onMessage(event.data);
    
    return () => ws.close();
  }, [roomId]);
  
  return <div>Chat Room: {roomId}</div>;
}
```

#### React Compiler Integration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "react-compiler"
      }
    ]
  }
}

// Automatic memoization
function ExpensiveComponent({ data }: { data: ComplexData }) {
  // React Compiler automatically optimizes this
  const processedData = useMemo(() => processData(data), [data]);
  
  return <div>{processedData.result}</div>;
}
```

---

## 🚀 Next.js 16 Implementation

### App Router Architecture

```typescript
// app/layout.tsx - Root layout
export const metadata = {
  title: 'Marketing Websites',
  description: 'Enterprise marketing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

// app/page.tsx - Homepage
export default function HomePage() {
  return (
    <section>
      <Hero />
      <Features />
      <Testimonials />
    </section>
  );
}

// app/blog/[slug]/page.tsx - Dynamic route
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Server Actions

```typescript
// app/api/posts/route.ts
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);
    
    const post = await createPost(validatedData);
    revalidatePath('/blog');
    
    return Response.json(post, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// Client component usage
'use client';

export function CreatePostForm() {
  async function createAction(formData: FormData) {
    'use server';
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    await createPost({ title, content, published: false });
  }
  
  return (
    <form action={createAction}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Partial Pre-rendering (PPR)

```typescript
// app/page.tsx - PPR enabled page
export const dynamic = 'auto';
export const revalidate = 3600; // 1 hour

export default function HomePage() {
  // Static shell
  return (
    <div>
      <Header />
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<FeaturesSkeleton />}>
        <FeaturesSection />
      </Suspense>
      <Footer />
    </div>
  );
}

// Dynamic component
async function HeroSection() {
  const heroData = await getHeroData();
  
  return (
    <section>
      <h1>{heroData.title}</h1>
      <p>{heroData.description}</p>
    </section>
  );
}
```

---

## 🔧 TypeScript 5.1 Patterns

### Advanced Type Patterns

```typescript
// Branded types for validation
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, 'UserId'>;
type Email = Brand<string, 'Email'>;

function createUserId(id: string): UserId {
  if (!isValidUUID(id)) {
    throw new Error('Invalid user ID');
  }
  return id as UserId;
}

// Template literal types
type EventName = `user:${'created' | 'updated' | 'deleted'}`;
type EventHandler<T extends EventName> = T extends `user:${infer Action}`
  ? Action extends 'created'
    ? (user: User) => void
    : Action extends 'updated'
    ? (user: User, changes: Partial<User>) => void
    : Action extends 'deleted'
    ? (userId: UserId) => void
    : never
  : never;

// Conditional types for API responses
type ApiResponse<T> = T extends string
  ? { data: T; status: 'success' }
  : T extends number
  ? { value: T; status: 'success' }
  : { error: string; status: 'error' };

// Utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

### Generic Component Patterns

```typescript
// Generic component with proper typing
interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

type ColumnConfig<T> = {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading
}: DataTableProps<T>) {
  if (loading) return <div>Loading...</div>;
  
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={String(column.key)}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr 
            key={index}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map(column => (
              <td key={String(column.key)}>
                {column.render 
                  ? column.render(row[column.key], row)
                  : String(row[column.key])
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const userColumns: ColumnConfig<User>[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { 
    key: 'role', 
    title: 'Role',
    render: (role) => <Badge variant={role}>{role}</Badge>
  }
];
```

---

## 🏗️ Build System Architecture

### Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    }
  },
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_API_URL",
    "DATABASE_URL"
  ]
}
```

### pnpm Workspace Configuration

```json
// pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'

// .pnpmrc
shamefully-hoist=true
strict-peer-dependencies=false
prefer-frozen-lockfile=true
```

### Build Optimization

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack (experimental)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // SWC minification
  swcMinify: true,
};

export default nextConfig;
```

---

## 🎨 Component Architecture

### Design System Integration

```typescript
// Design tokens
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    }
  }
};

// Component variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
}
```

### Compound Components

```typescript
// Card compound component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

const CardContext = createContext<{
  variant: 'default' | 'outlined' | 'elevated';
}>({ variant: 'default' });

export function Card({ children, className = '' }: CardProps) {
  const [variant, setVariant] = useState<'default' | 'outlined' | 'elevated'>('default');
  
  return (
    <CardContext.Provider value={{ variant }}>
      <div className={`card ${variant} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="card-content">{children}</div>;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="card-footer">{children}</div>;
}

// Usage
<Card variant="elevated">
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## 🧪 Testing Strategies

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/user-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserDashboard } from '@/pages/UserDashboard';

describe('User Dashboard Flow', () => {
  it('allows user to create and view sites', async () => {
    const user = userEvent.setup();
    
    render(<UserDashboard />);
    
    // Create new site
    await user.click(screen.getByText('Create Site'));
    await user.type(screen.getByLabelText('Site Name'), 'Test Site');
    await user.click(screen.getByText('Create'));
    
    // Verify site appears in list
    await waitFor(() => {
      expect(screen.getByText('Test Site')).toBeInTheDocument();
    });
    
    // Navigate to site details
    await user.click(screen.getByText('Test Site'));
    await waitFor(() => {
      expect(screen.getByText('Site Details')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```typescript
// e2e/tests/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
  test('complete user signup and site creation', async ({ page }) => {
    // Navigate to signup
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill('[data-testid=email]', 'user@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.fill('[data-testid=name]', 'Test User');
    await page.click('[data-testid=signup-button]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Create first site
    await page.click('[data-testid=create-site-button]');
    await page.fill('[data-testid=site-name]', 'My First Site');
    await page.fill('[data-testid=site-domain]', 'my-first-site');
    await page.click('[data-testid=create-button]');
    
    // Verify site created
    await expect(page.locator('[data-testid=site-card]')).toContainText('My First Site');
  });
});
```

---

## 🔍 Code Quality Tools

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/anchor-is-valid": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📋 Development Workflow

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "tsc --noEmit"
    ],
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### GitHub Actions

```yaml
# .github/workflows/development.yml
name: Development Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type check
        run: pnpm type-check
        
      - name: Lint
        run: pnpm lint
        
      - name: Format check
        run: pnpm format:check
        
      - name: Test
        run: pnpm test
        
      - name: Build
        run: pnpm build
```

---

## 📋 Development Checklist

### Setup Checklist

- [ ] **Node.js 20+**: Latest LTS version installed
- [ ] **pnpm**: Package manager configured
- [ ] **VS Code**: Extensions installed (ESLint, Prettier, TypeScript)
- [ ] **Git Hooks**: Pre-commit hooks configured
- [ ] **Environment**: .env.local configured
- [ ] **Database**: Local database setup
- [ ] **Dependencies**: All packages installed

### Code Quality Checklist

- [ ] **TypeScript**: Strict mode, no any types
- [ ] **ESLint**: No linting errors
- [ ] **Prettier**: Code formatted consistently
- [ ] **Tests**: Unit and integration tests written
- [ ] **Components**: Properly typed and documented
- [ ] **Performance**: Core Web Vitals optimized
- [ ] **Accessibility**: WCAG 2.2 AA compliant

### Deployment Checklist

- [ ] **Build**: Successful build in production mode
- [ ] **Bundle Size**: Within limits (< 250KB gzipped)
- [ ] **Environment Variables**: All required variables set
- [ ] **Database**: Migrations applied
- [ ] **Monitoring**: Error tracking configured
- [ ] **Performance**: Lighthouse score > 90
- [ ] **Security**: Headers and CSP configured

---

## Related Resources

- [System Architecture Guide](../architecture/system-architecture-guide.md)
- [Security Implementation](../security/security-implementation-guide.md)
- [Infrastructure Patterns](../infrastructure/)
- [Testing Strategies](../testing/)
