---
title: Daily Development Workflow
description: Essential daily development tasks and best practices
last_updated: 2026-02-26
tags: [#how-to #workflow #development #daily-tasks]
estimated_read_time: 15 minutes
difficulty: beginner
---

# Daily Development Workflow

## Overview

Essential development tasks you'll perform regularly when working with the marketing websites monorepo.

## Starting Your Day

### 1. Update Dependencies

```bash
# Pull latest changes
git pull origin main

# Update dependencies
pnpm update

# Check for any breaking changes
pnpm audit
```

### 2. Start Development Servers

```bash
# Start all services
pnpm dev

# Or start specific services
pnpm dev:web      # Marketing website
pnpm dev:portal   # Admin portal
pnpm dev:db       # Database (if needed)
```

### 3. Check Status

```bash
# Run health checks
pnpm type-check   # TypeScript validation
pnpm lint         # Code quality
pnpm test         # Run tests
```

## Common Development Tasks

### Creating a New Feature

1. **Create feature branch**:
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Implement feature**:
   - Follow FSD layer structure
   - Write tests alongside code
   - Update documentation

3. **Test implementation**:
   ```bash
   pnpm test:unit
   pnpm test:e2e
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Adding a New Page

1. **Create page component**:
   ```typescript
   // app/new-page/page.tsx
   export default function NewPage() {
     return (
       <main>
         <h1>New Page</h1>
         <p>Page content here</p>
       </main>
     )
   }
   ```

2. **Add to navigation**:
   ```typescript
   // components/Navigation.tsx
   const navItems = [
     { href: '/', label: 'Home' },
     { href: '/new-page', label: 'New Page' },
   ]
   ```

3. **Test the page**:
   ```bash
   # Navigate to http://localhost:3000/new-page
   ```

### Working with Components

**Create a new component**:
```typescript
// components/NewComponent.tsx
interface NewComponentProps {
  title: string
  description?: string
}

export function NewComponent({ title, description }: NewComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

**Use the component**:
```typescript
// app/page.tsx
import { NewComponent } from '@/components/NewComponent'

export default function HomePage() {
  return (
    <main>
      <NewComponent 
        title="Welcome" 
        description="This is our new component" 
      />
    </main>
  )
}
```

### Database Operations

**Run migrations**:
```bash
pnpm db:migrate
```

**Seed development data**:
```bash
pnpm db:seed
```

**Reset database**:
```bash
pnpm db:reset
```

### Styling Tasks

**Add new Tailwind classes**:
```css
/* app/globals.css */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg;
  }
}
```

**Create CSS variables**:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #1e40af;
}
```

## Testing Workflow

### Unit Tests

```bash
# Run unit tests
pnpm test:unit

# Run tests in watch mode
pnpm test:unit --watch

# Run tests with coverage
pnpm test:unit --coverage
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e login.spec.ts

# Run tests in headed mode (show browser)
pnpm test:e2e --headed
```

### Writing Tests

**Component test example**:
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})
```

## Code Quality Tasks

### Linting

```bash
# Run linter
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Check specific file
pnpm lint src/components/Button.tsx
```

### Type Checking

```bash
# Run TypeScript compiler
pnpm type-check

# Check specific file
pnpm type-check --noEmit src/components/Button.tsx
```

### Formatting

```bash
# Format all files
pnpm format

# Format specific file
pnpm format src/components/Button.tsx
```

## Deployment Tasks

### Build for Production

```bash
# Build all packages
pnpm build

# Build specific app
pnpm build:web
pnpm build:portal
```

### Deploy to Staging

```bash
# Deploy to Vercel staging
vercel

# Deploy with custom environment
vercel --env staging
```

### Deploy to Production

```bash
# Deploy to production
vercel --prod

# Deploy specific branch
vercel --prod --branch main
```

## Troubleshooting Common Issues

### Build Errors

**TypeScript errors**:
```bash
# Clear TypeScript cache
pnpm type-check --force

# Check tsconfig.json
cat tsconfig.json
```

**Import errors**:
```bash
# Check package exports
pnpm list --depth=0

# Verify import paths
grep -r "import.*from" src/
```

### Runtime Errors

**Database connection**:
```bash
# Check database status
pnpm db:status

# Restart database
pnpm db:restart
```

**Environment variables**:
```bash
# Check current environment
env | grep NODE_ENV

# Verify .env.local
cat .env.local
```

### Performance Issues

**Bundle analysis**:
```bash
# Analyze bundle size
pnpm analyze

# Check webpack stats
pnpm build --stats
```

**Memory usage**:
```bash
# Check Node.js memory
node --max-old-space-size=4096

# Monitor memory usage
pnpm dev --inspect
```

## End of Day Workflow

### 1. Save Progress

```bash
# Stage changes
git add .

# Commit work in progress
git commit -m "wip: progress on feature X"
```

### 2. Clean Up

```bash
# Stop development servers
# Ctrl+C in terminal or:
pkill -f "next dev"

# Clean temporary files
pnpm clean
```

### 3. Prepare for Next Day

```bash
# Pull latest changes
git pull origin main

# Note current branch
git branch --show-current

# Check for any conflicts
git status
```

## Related Resources

- [Development Setup](../../getting-started/development-setup.md)
- [Testing Guide](../../guides-new/testing/)
- [Deployment Patterns](../../guides-new/infrastructure/deployment.md)
