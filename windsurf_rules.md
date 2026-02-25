# Windsurf Rules - Marketing Websites Monorepo

## Directory Structure Overview

### Apps (Client Applications)
- `apps/portal/` - Main admin portal for tenant management
- `apps/web/` - Public marketing website
- `apps/admin/` - System administration interface

### Packages (Shared Libraries)
- `packages/ui/` - Reusable UI components (shadcn/ui based)
- `packages/features/` - Business logic features (booking, billing, analytics)
- `packages/entities/` - Core domain entities (tenant, user, lead)
- `packages/integrations/` - Third-party service integrations (Stripe, Supabase, ConvertKit)
- `packages/infrastructure/` - Core infrastructure (auth, database, caching)
- `packages/core/` - Shared utilities and types
- `packages/config-schema/` - Site configuration validation

### Clients (Tenant Sites)
- `clients/*/` - Individual client marketing sites
- Each client has independent Next.js app with shared packages

## Framework-Specific Patterns

### Next.js 16 + React 19
- **Server Components by default** - Only use Client Components for interactivity
- **App Router only** - No pages directory usage
- **Server Actions for mutations** - Use @repo/features for action patterns
- **Streaming with Suspense** - Implement proper loading boundaries

### Feature-Sliced Design v2.1
```
app/
├── pages/           # Route pages
├── widgets/         # Composite UI components
├── features/        # Business features
├── entities/        # Domain entities
└── shared/          # Shared utilities
```

### Import Patterns
- Use `@repo/*` for cross-package imports
- Use `@x` notation for cross-slice imports only when necessary
- Prefer index.ts exports over deep imports

## Validation & Typing Rules

### Schema Validation
- **Zod for all schemas** - No raw object types
- **TypeScript strict mode** - No `any` types allowed
- **Infer types from Zod schemas** - Maintain single source of truth

### Database Operations
- **Repository pattern only** - All DB access through packages/core/
- **RLS policies required** - Every query must include tenant_id
- **Supabase client factory** - Use proper connection pooling

### Component Patterns
- **shadcn/ui components** - Use as base for all UI
- **Tailwind CSS only** - No inline styles or CSS-in-JS
- **Responsive design first** - Mobile-first approach

## UI Library Standards
- **Component library**: shadcn/ui + custom components
- **Styling**: Tailwind CSS v4 with design tokens
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Data display**: TanStack Query + React Table

## Commands & Workflow

### Development Commands
```bash
pnpm dev          # Start development servers
pnpm build        # Build all packages
pnpm typecheck    # TypeScript validation
pnpm test         # Run test suite
pnpm lint         # ESLint + Prettier
```

### Quality Gates
- **Typecheck required** - Must pass before commits
- **Test coverage >80%** - Enforced via CI
- **Code Health ≥9.5** - Automated quality scoring
- **Bundle size limits** - JS <250KB gzipped

## Security Requirements
- **No hardcoded secrets** - Use environment variables
- **Tenant isolation mandatory** - All operations scoped to tenant
- **Input validation required** - Zod schemas for all inputs
- **Rate limiting** - Implement on all public endpoints

## Performance Standards
- **Core Web Vitals**: LCP <2.5s, INP <200ms, CLS <0.1
- **Bundle optimization**: Code splitting and lazy loading
- **Image optimization**: Next.js Image component only
- **Caching strategy**: ISR for marketing pages, SWR for dynamic data

## Multi-Tenant Patterns
- **Tenant context propagation** - Use AsyncLocalStorage
- **Per-tenant configuration** - site.config.ts per client
- **Database isolation** - Row Level Security policies
- **Cache segmentation** - Redis keys prefixed by tenant

## Context Management
- **Start fresh sessions** - Don't carry context between unrelated tasks
- **Update rules after manual edits** - Keep agent context current
- **Lean context** - Keep rules file under 500 words
- **Reference canonical files** - Link instead of duplicating

## Common Tasks
- **Adding new feature**: Create in packages/features/ following FSD
- **UI components**: Add to packages/ui/ with proper exports
- **Database changes**: Use migration system in supabase/migrations/
- **New client site**: Use tooling/create-site CLI template
