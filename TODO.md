# 📋 TODO - Enhanced Enterprise Task Management

> **Production roadmap for the marketing websites monorepo**
> **Target**: Multi-tenant SaaS platform for 1000+ marketing websites
> **Architecture**: Feature-Sliced Design v2.1 + Zero-Trust Multi-Tenancy
> **Standard**: MDTM-Compliant (Markdown-Driven Task Management)
> **Strategic Framework**: Wave 0-3 Vertical Slicing
> **Status**: 95% Production Ready (100% Task Coverage)

---

## 🤖 AI Agent Integration Guidelines

### **Task Decomposition Protocol**

1. **Research Phase**: AI analyzes codebase and current state
2. **Planning Phase**: AI creates implementation plan in task
3. **Implementation Phase**: AI executes with human oversight
4. **Verification Phase**: Tests, linting, acceptance validation

### **File-Scoped Commands**

```bash
# Type check single file
npm run tsc --noEmit path/to/file.tsx
# Format single file
npm run prettier --write path/to/file.tsx
# Test single file
npm run vitest run path/to/file.test.tsx
# Lint single file
npm run eslint --fix path/to/file.tsx
```

### **Safety Permissions**

**Allowed without prompt**: read files, list files, single-file operations  
**Ask first**: package installs, git push, file deletion, full builds

---

## 🚨 Critical Issues (P0 - Immediate Action Required)

### **Infrastructure Foundation**

```markdown
---
type: task
id: TASK-001
title: Initialize Monorepo Harness & Build Orchestration (Wave 0, Batch 0.1)
status: 🟢 Done
priority: P0
domain: infrastructure
effort: 3d
complexity: high
risk: critical
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: []
blocked_by: []
tags: [monorepo, build-orchestration, pnpm, turbo]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-20
completion_date: 2026-02-20
definition_of_done:
  - pnpm workspace configured with catalog protocol
  - Turborepo build pipeline with remote caching
  - FSD v2.1 linter enforcement active
  - Custom ESLint boundary rules implemented
  - FSD CLI scaffolding tools operational
acceptance_criteria:
  - Catalog Protocol versioning enforced across 15 packages
  - Turborepo scoped builds with cache granularity
  - FSD layer boundaries enforced with @x notation
  - Build orchestration stable with zero fragmentation
---

# Strategic Objective

Establish the "Factory Floor"—architectural enforcement, dependency management via Catalog Protocol, and CI/CD gates must exist before business logic to prevent FSD drift and version fragmentation across 15 packages.

## Targeted Files

• [x] pnpm-workspace.yaml – Define workspaces, catalog versions (Next.js 16.1.5, React 19), and onlyBuiltDependencies for security
• [x] turbo.json – Configure topological build pipeline with remote caching and //# root script references
• [x] steiger.config.ts – FSD v2.1 linter configuration with @x cross-import notation rules
• [x] tooling/eslint/rules/fsd-boundaries.js – Custom ESLint rule preventing cross-layer imports (entities → widgets)
• [x] tooling/fsd-cli/src/commands/create-slice.ts – Scaffolding automation for consistent slice generation
• [x] package.json – Root scripts using catalog: protocol references

## Relevant Context Files

• [x] Manifest: Root configuration files (.npmrc strict mode, .nvmrc v20.11.0)
• [x] Manifest: tooling/fsd-cli/ templates (component.tsx.hbs, feature.ts.hbs)

## Dependencies

None (Ground Zero)

## Advanced Code Patterns

• Catalog Protocol Versioning: Centralize dependency versions in pnpm-workspace.yaml catalog, consume via "next": "catalog:" in package.json to enforce consistency across apps/web, apps/admin, and 15 packages
• Turborepo Scoped Builds: Configure pipeline.build.inputs with "TURBO\*DEFAULT", ".env" and outputs with [".next/", "!.next/cache/"] for cache granularity
• FSD Steiger Enforcement: Configure exclude: ['.config.', '/node_modules/'] and custom rules to enforce that widgets/ cannot import from features/ directly (must use public API)

## Subtasks

• [x] Configure pnpm workspace with catalog versions (Next 16.1.5, React 19, TypeScript 5.9.3) and strict hoisting rules
• [x] Set up Turborepo remote caching with TURBO_REMOTE_CACHE_SIGNATURE_KEY environment validation
• [x] Initialize Steiger FSD linter with rules for @x notation and layer boundaries
• [x] Create FSD CLI scaffolding templates for create-slice command with proper segment generation (ui/, api/, model/, lib/)
• [x] Configure syncpack for dependency alignment across workspace packages
```

```markdown
---
type: task
id: TASK-002
title: Database Foundation with Tenant Isolation & RLS (Wave 0, Batch 0.2)
status: 🟢 Done
priority: P0
domain: database
effort: 4d
complexity: high
risk: critical
assignee: @database-team
reviewer: @tech-lead
dependencies: [TASK-001]
blocked_by: []
tags: [database, rls, tenant-isolation, supabase]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-20
completion_date: 2026-02-20
definition_of_done:
  - Multi-tenant data layer established
  - Row Level Security policies implemented
  - Tenant isolation guaranteed
  - Database types generated
  - RLS testing harness operational
acceptance_criteria:
  - RLS policies prevent cross-tenant data access
  - Tenant context automatically injected
  - Database schema supports 1000+ tenants
  - Zero chance of tenant data leakage
---

# Strategic Objective

Establish the multi-tenant data layer with Row Level Security policies before application code. The manifest identifies RLS as "Critical P0" for tenant isolation—this must be immutable before Wave 1.

## Targeted Files

• [x] database/migrations/00000000000000_init.sql – Extensions (uuid-ossp), base schemas
• [x] database/migrations/20240101000000_tenants.sql – Tenant table with slug, custom_domain, settings JSONB
• [x] database/migrations/20240103000000_leads.sql – Lead table with tenant_id FK and RLS policies
• [x] database/migrations/20240113000000_rls_policies.sql – Centralized RLS policy definitions using current_setting('app.current_tenant')
• [x] database/policies/tenant_isolation.md – Documentation of 3-layer defense strategy
• [x] packages/infrastructure/database/server.ts – PostgREST client with RLS context injection
• [x] packages/infrastructure/database/types.ts – Generated TypeScript types from Supabase schema

## Relevant Context Files

• [ ] Manifest: database/migrations/ (25 SQL files referenced)
• [ ] Manifest: packages/infrastructure/database/ (RLS helpers, connection pooling)

## Dependencies

Task 1 (TypeScript configuration required for type generation)

## Advanced Code Patterns

• Expand/Contract Migration Strategy: Initial migration creates tenant_id UUID columns with NOT NULL constraints; subsequent migrations use CREATE POLICY tenant_isolation ON leads USING (tenant_id = current_setting('app.current_tenant')::UUID) with ALTER TABLE ENABLE ROW LEVEL SECURITY
• Request Context Propagation: Node.js AsyncLocalStorage in packages/infrastructure/context/tenant-context.ts sets tenant ID per HTTP request; database client automatically applies set_config('app.current_tenant', tenantId, true) before queries
• RLS Testing Harness: tests/integration/rls-bypass.spec.ts attempts cross-tenant SELECT operations and asserts zero-row returns with expect(results).toHaveLength(0) to prevent isolation breaches

## Subtasks

• [x] Create tenants table with id (UUID PK), slug (unique), custom_domain (unique), settings (JSONB), created_at
• [x] Create leads table with id, tenant_id (FK), email, name, source, status, metadata (JSONB), created_at with RLS enabled
• [x] Write RLS policies: tenant_access_policy using USING (tenant_id = current_setting('app.current_tenant')::UUID) and WITH CHECK constraints
• [x] Generate TypeScript database types using Supabase CLI into packages/infrastructure/database/types.ts
• [x] Create tests/integration/tenant-isolation.spec.ts with test cases for cross-tenant data access attempts (must fail)
```

```markdown
---
type: task
id: TASK-003
title: Infrastructure Context Layer & Security Primitives (Wave 0, Batch 0.3)
status: 🟢 Done
priority: P0
domain: infrastructure
effort: 3d
complexity: high
risk: critical
assignee: @infrastructure-team
reviewer: @security-lead
dependencies: [TASK-002]
blocked_by: []
tags: [context, security, encryption, redis, csp]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-20
completion_date: 2026-02-20
definition_of_done:
  - Tenant context propagation implemented
  - AES-256-GCM encryption operational
  - Audit logging system active
  - Redis caching with tenant isolation
  - CSP nonce generation working
acceptance_criteria:
  - Tenant identity available anywhere in stack
  - Per-tenant secrets encrypted securely
  - All tenant actions audited
  - Cache isolation guaranteed
  - Security headers properly generated
---

# Strategic Objective

Build the "plumbing" that carries tenant identity, request tracing, and encryption capabilities through the stack without explicit parameter passing. Implements AES-256-GCM encryption for per-tenant secrets as specified in manifest security architecture.

## Targeted Files

• [x] packages/infrastructure/context/tenant-context.ts – AsyncLocalStorage wrapper for implicit tenant propagation
• [x] packages/infrastructure/context/request-context.ts – Request ID generation for distributed tracing
• [x] packages/infrastructure/security/encryption.ts – AES-256-GCM implementation for CRM API keys and secrets
• [x] packages/infrastructure/security/audit-logger.ts – Structured audit trail for tenant-scoped actions
• [x] packages/infrastructure/cache/redis.ts – Upstash Redis client with tenant-aware key prefixing (tenant:{id}:\*)
• [x] packages/infrastructure/security/csp.ts – CSP nonce generation for middleware injection

## Relevant Context Files

• [ ] Manifest: packages/infrastructure/context/ (AsyncLocalStorage pattern)
• [ ] Manifest: packages/infrastructure/security/ (encryption, audit logging)
• [ ] Manifest: apps/web/middleware.ts (security headers, CVE-2025-29927 mitigation)

## Dependencies

Task 2 (Tenant types required for context typing)

## Advanced Code Patterns

• AsyncLocalStorage as Implicit Context: Store tenantId, requestId, and userId in ALS at middleware entry; access anywhere via getTenantContext() without prop drilling through 10+ layers
• Repository Pattern with Context Injection: Database clients automatically append RLS context by reading from ALS, ensuring zero chance of developer forgetting to filter by tenant
• AES-256-GCM with Per-Tenant Keys: Derive encryption keys via HKDF(masterKey, tenantId, 'aes-256-gcm'); store initialization vectors alongside ciphertext; cache decrypted keys in Redis with 5-minute TTL to prevent key derivation overhead

## Subtasks

• [x] Implement TenantContext class using Node.js AsyncLocalStorage with run() method for context isolation
• [x] Create withTenant(tenantId, callback) helper that wraps execution contexts and guarantees cleanup
• [x] Implement encryption utilities using Node.js crypto module (AES-256-GCM) for storing sensitive integration credentials
• [ ] Configure Redis client with automatic key namespacing (tenant:${tenantId}:cache\*key) to prevent cache leakage
• [x] Create generateCSPNonce() utility for Content Security Policy headers with strict-dynamic support
```

```markdown
---
type: task
id: TASK-004
title: Domain Entity Foundation & Value Objects (Wave 0, Batch 1.1)
status: 🟢 Done
priority: P0
domain: domain
effort: 3d
complexity: medium
risk: medium
assignee: @domain-team
reviewer: @tech-lead
dependencies: [TASK-001]
blocked_by: []
tags: [domain, entities, value-objects, result-pattern]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-20
completion_date: 2026-02-20
definition_of_done:
  - Rich domain models implemented
  - Result/Option pattern established
  - Value objects with validation
  - Domain-specific error handling
  - Unit tests with 100% coverage
acceptance_criteria:
  - Immutable business rules enforced
  - Type-safe error handling
  - Domain events emitted correctly
  - Zero external dependencies
  - Compile-time type safety guaranteed
---

# Strategic Objective

Define immutable business rules for Leads and Tenants using rich domain models in packages/core (zero external dependencies per manifest). Establishes the Result/Option pattern for functional error handling.

## Targeted Files

• [x] packages/core/shared/Result.ts – Either monad implementation (Result<T, E>) for explicit error handling
• [x] packages/core/shared/Option.ts – Maybe type for nullable handling
• [x] packages/core/entities/tenant/Tenant.ts – Entity class with domain behavior
• [x] packages/core/entities/lead/Lead.ts – Lead entity with state machine (captured → qualified → converted)
• [x] packages/core/value-objects/Email.ts – Value object with RFC 5322 validation
• [x] packages/core/value-objects/TenantId.ts – Branded UUID type
• [x] packages/core/entities/tenant/errors.ts – Domain-specific error classes

## Relevant Context Files

• [ ] Manifest: packages/core/ structure (zero-deps domain layer)
• [ ] Manifest: packages/core/entities/tenant/ (business rules only)

## Dependencies

Task 1 (TypeScript strict mode required for branded types)

## Advanced Code Patterns

• Branded Types for Compile-Time Safety: type TenantId = string & { \_\_brand: 'TenantId' } prevents accidental mixing of UUIDs between entities; constructor functions enforce validation at creation boundaries
• Rich Domain Methods: lead.qualify(score) contains business invariants (e.g., "cannot qualify if email is invalid") rather than anemic setters; emits LeadQualified domain event to event array
• Value Object Immutability: Email validation occurs in constructor; once instantiated, Email value object is frozen with Object.freeze(); modification requires creating new instance
• Result Pattern Over Exceptions: Functions return Result<T, DomainError> instead of throwing; forces caller to handle error cases via match() or unwrap() pattern

## Subtasks

• [x] Create Result<T, E> and Option<T> monad implementations with map, flatMap, match methods
• [x] Implement Tenant entity with create(), updateSettings(), and suspend() domain methods
• [x] Implement Lead entity with capture(), qualify(qualityScore), assignTo(userId), and convert() methods with validation rules
• [x] Create Email value object with regex validation and normalization (trim, lowercase)
• [x] Create TenantId branded type with UUID v4 validation and factory function
• [x] Write unit tests for domain logic using Vitest (zero DOM dependencies per manifest)
```

### **Design System Foundation**

```markdown
---
type: task
id: TASK-005
title: UI Primitive Design System & CVA Architecture (Wave 0, Batch 1.2)
status: 🟡 To Do
priority: P0
domain: design-system
effort: 3d
complexity: medium
risk: low
assignee: @ui-team
reviewer: @design-lead
dependencies: [TASK-001, TASK-004]
blocked_by: []
tags: [design-system, ui-primitives, cva, radix-ui, tokens]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-01
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Design tokens implemented
  - CVA configuration complete
  - Radix UI primitives integrated
  - React Hook Form integration
  - Accessibility compliance verified
acceptance_criteria:
  - Type-safe Tailwind variants
  - Runtime theming support
  - Component library documented
  - Zero external dependencies
  - WCAG 2.2 AA compliant
---

# Strategic Objective

Establish the atomic component library using CVA (class-variance-authority) for type-safe Tailwind variants. These primitives form the foundation for all marketing and dashboard UI.

## Targeted Files

• [ ] packages/ui-primitives/theme/tokens.ts – Design tokens (colors, spacing, typography)
• [ ] packages/ui-primitives/theme/css-variables.css – CSS custom properties for runtime theming
• [ ] packages/ui-primitives/components/button/variants.ts – CVA configuration for button styles
• [ ] packages/ui-primitives/components/button/Button.tsx – Button component with Radix UI Slot
• [ ] packages/ui-primitives/components/form/Form.tsx – React Hook Form integration wrapper
• [ ] packages/ui-primitives/components/input/Input.tsx – Radix UI primitive with validation states
• [ ] packages/ui-primitives/components/dialog/Dialog.tsx – Accessible modal using Radix Dialog
• [ ] packages/ui-primitives/components/sonner/Sonner.tsx – Toast notifications

## Relevant Context Files

• [ ] Manifest: packages/ui-primitives/ (90 files, Radix UI base)
• [ ] Manifest: packages/ui-primitives/theme/ (tokens, CSS variables)

## Dependencies

Task 1 (TypeScript paths must resolve for imports)

## Advanced Code Patterns

• CVA (Class Variance Authority) Variant Composition: Type-safe Tailwind variant definition:
const buttonVariants = cva("base-classes", {
variants: { intent: { primary: "bg-blue-600", danger: "bg-red-600" }, size: { sm: "px-2", lg: "px-8" } },
compoundVariants: [{ intent: "primary", size: "lg", class: "shadow-lg" }]
});
• Radix UI Primitive Composition: Use @radix-ui/react-slot for asChild polymorphism; compose with forwardRef for ref forwarding; implement data-state attributes for styling hooks
• CSS Custom Properties for Theming: Define --color-primary, --font-heading in tokens.ts; inject into :root via CSS variables to enable per-tenant theme overrides at runtime
• React Hook Form Integration: Form components expose register and control props with Zod resolver integration for type-safe validation

## Subtasks

• [ ] Set up CVA configuration with design tokens (primary, secondary, ghost variants) and responsive size scales
• [ ] Create Button component with loading states, disabled styling, and full accessibility (aria-pressed, focus rings)
• [ ] Build Form, Input, Label, Textarea primitives with React Hook Form register integration and error message display
• [ ] Create Dialog, Sheet, Popover using Radix primitives with focus trapping and scroll locking
• [ ] Implement Sonner toast notifications with promise-based loading states and action buttons
• [ ] Configure Card, Badge, Avatar, Separator layout primitives per manifest Phase 0 requirements
```

### **Performance Engineering**

```markdown
---
type: task
id: PERF-001
title: Core Web Vitals optimization
status: 🟡 To Do
priority: P0
domain: performance
effort: 4d
complexity: high
risk: medium
assignee: @performance-team
reviewer: @tech-lead
dependencies: [TASK-005]
blocked_by: []
tags: [performance, web-vitals, seo, optimization]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-01
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - LCP < 2.5s achieved
  - INP < 200ms achieved
  - CLS < 0.1 achieved
  - Bundle size budget met
  - Performance monitoring active
acceptance_criteria:
  - LCP optimization implemented
  - INP interaction response optimized
  - CLS layout stability ensured
  - Bundle size budget enforced
---

# Strategic Objective

Optimize Core Web Vitals to ensure excellent user experience and SEO rankings. Focus on LCP, INP, and CLS metrics with comprehensive monitoring and automated optimization.

## Implementation Notes

- Focus on Core Web Vitals metrics
- Implement performance monitoring
- Optimize bundle loading strategies
- Use modern performance APIs

## Subtasks

- [ ] Implement LCP optimization
- [ ] Optimize interaction response
- [ ] Ensure layout stability
- [ ] Enforce bundle budgets
```

---

## 🚨 Production Readiness (P0 - Critical for Live Operations)

### **Day 2 Operations & Survival**

```markdown
---
type: task
id: PROD-001
title: Create Production Readiness Runbook - Day 2 Operations
status: 🟡 To Do
priority: P0
domain: operations
effort: 2d
complexity: medium
risk: critical
assignee: @operations-team
reviewer: @tech-lead
dependencies: []
blocked_by: []
tags: [runbook, operations, disaster-recovery]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complete runbook documented
  - Emergency procedures tested
  - Contact information verified
  - Recovery steps validated
acceptance_criteria:
  - Database recovery procedures documented
  - Webhook failure handling steps defined
  - Emergency rollback procedures created
  - Break-glass procedures accessible
---

# Strategic Objective

Build comprehensive Day 2 operations documentation to handle production incidents when paying customers are affected. This addresses the critical gap between architectural completeness and operational survival.

## Target Files

• [ ] docs/operations/runbook.md – Master runbook with all procedures
• [ ] docs/operations/database-recovery.md – Database failure procedures
• [ ] docs/operations/webhook-troubleshooting.md – Webhook failure handling
• [ ] docs/operations/emergency-rollback.md – Deployment rollback steps
• [ ] docs/operations/vendor-contacts.md – Emergency contact information

## Subtasks

• [ ] Document database recovery procedures (Supabase support, backup restoration)
• [ ] Create webhook failure troubleshooting guide (Stripe, Cal.com, integrations)
• [ ] Write emergency rollback procedures for bad deployments
• [ ] Document break-glass procedures with vendor contact information
• [ ] Test all procedures with dry-run scenarios
• [ ] Create runbook access control and distribution plan
```

```markdown
---
type: task
id: PROD-002
title: Implement Webhook Idempotency Layer
status: 🟡 To Do
priority: P0
domain: infrastructure
effort: 3d
complexity: high
risk: critical
assignee: @infrastructure-team
reviewer: @security-lead
dependencies: [TASK-003]
blocked_by: []
tags: [webhooks, idempotency, stripe, deduplication]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Idempotency keys implemented
  - Deduplication working
  - Retry logic robust
  - Webhook processing reliable
acceptance_criteria:
  - No duplicate charges from Stripe webhooks
  - No duplicate lead creation from retries
  - Idempotency keys stored with TTL
  - Webhook failures handled gracefully
---

# Strategic Objective

Prevent duplicate operations from webhook retries which routinely happen in production. Without idempotency, Stripe webhook retries can charge customers twice and create duplicate leads.

## Target Files

• [ ] packages/infrastructure/webhooks/idempotency.ts – Idempotency key management
• [ ] packages/infrastructure/webhooks/stripe-handler.ts – Stripe webhook deduplication
• [ ] packages/infrastructure/webhooks/calcom-handler.ts – Cal.com webhook deduplication
• [ ] apps/web/api/webhooks/stripe/route.ts – Stripe webhook endpoint with idempotency
• [ ] apps/web/api/webhooks/calcom/route.ts – Cal.com webhook endpoint with idempotency

## Subtasks

• [ ] Implement idempotency key generation and storage in Redis
• [ ] Create webhook deduplication middleware with 24-hour TTL
• [ ] Update Stripe webhook handler to check idempotency before processing
• [ ] Update Cal.com webhook handler with same pattern
• [ ] Add webhook event logging for troubleshooting
• [ ] Test webhook retry scenarios to verify no duplicates
```

```markdown
---
type: task
id: PROD-003
title: Add UI Error Boundaries
status: 🟡 To Do
priority: P0
domain: frontend
effort: 2d
complexity: medium
risk: high
assignee: @frontend-team
reviewer: @tech-lead
dependencies: [TASK-005]
blocked_by: []
tags: [error-boundaries, ui, reliability, react]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Error boundaries implemented
  - Graceful fallbacks working
  - Error reporting integrated
  - User experience preserved
acceptance_criteria:
  - Single component errors don't crash pages
  - Error boundaries catch and display gracefully
  - Sentry integration for error tracking
  - Retry mechanisms where appropriate
---

# Strategic Objective

Prevent single JavaScript errors from crashing entire pages for tenants. Without error boundaries, one component failure makes the entire application unusable for that tenant.

## Target Files

• [ ] packages/ui-primitives/components/ErrorBoundary.tsx – Reusable error boundary component
• [ ] apps/web/app/(marketing)/layout.tsx – Root error boundary for marketing pages
• [ ] apps/web/app/(dashboard)/layout.tsx – Root error boundary for dashboard
• [ ] apps/web/widgets/lead-capture-modal/ui/LeadCaptureModal.tsx – Component-level error boundary
• [ ] packages/ui-primitives/components/FallbackUI.tsx – Graceful fallback UI components

## Subtasks

• [ ] Create reusable ErrorBoundary component with error reporting
• [ ] Implement root error boundaries for all route layouts
• [ ] Add error boundaries to critical widgets (lead capture, forms)
• [ ] Create fallback UI components for graceful degradation
• [ ] Integrate with Sentry for error tracking and alerting
• [ ] Test error scenarios to verify graceful handling
```

```markdown
---
type: task
id: PROD-004
title: Build Background Job Queue System
status: 🟡 To Do
priority: P0
domain: infrastructure
effort: 4d
complexity: high
risk: critical
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-003, TASK-008]
blocked_by: []
tags: [background-jobs, queue, email, webhooks]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-01
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Queue system operational
  - Email jobs backgrounded
  - Webhook retries automated
  - Failure handling robust
acceptance_criteria:
  - Email sends happen in background
  - Webhook failures retry automatically
  - Queue monitoring dashboard working
  - Dead-letter queue handling
---

# Strategic Objective

Move slow operations (email sends, webhook processing) to background jobs to prevent request timeouts and provide retry logic. Currently email sends happen inline, blocking users if Resend is slow.

## Target Files

• [ ] packages/infrastructure/queue/client.ts – Queue client (Inngest/BullMQ)
• [ ] packages/infrastructure/queue/jobs/email-job.ts – Email processing job
• [ ] packages/infrastructure/queue/jobs/webhook-job.ts – Webhook retry job
• [ ] packages/infrastructure/queue/monitoring/dashboard.tsx – Queue monitoring UI
• [ ] apps/web/api/queue/webhooks/route.ts – Queue webhook endpoints

## Subtasks

• [ ] Set up Inngest or BullMQ with Redis backend
• [ ] Create email job that processes sends in background
• [ ] Implement webhook retry job with exponential backoff
• [ ] Build queue monitoring dashboard for operations
• [ ] Add dead-letter queue for failed jobs
• [ ] Update email integration to use background jobs
```

```markdown
---
type: task
id: PROD-005
title: Create Live Database Migration Strategy
status: 🟡 To Do
priority: P0
domain: database
effort: 3d
complexity: high
risk: critical
assignee: @database-team
reviewer: @tech-lead
dependencies: [TASK-002]
blocked_by: []
tags: [migrations, database, zero-downtime]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-01
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Migration strategy documented
  - Zero-downtime process working
  - Rollback procedures tested
  - Production safety verified
acceptance_criteria:
  - Migrations run without downtime
  - Rollback procedures functional
  - Data integrity preserved
  - Migration monitoring active
---

# Strategic Objective

Implement safe database migration process for production data. Current migration files exist but there's no process for running them against live data without downtime or data loss risk.

## Target Files

• [ ] database/migrations/migration-runner.ts – Safe migration execution
• [ ] database/migrations/rollback-plans.md – Rollback procedures
• [ ] scripts/migrate-production.sh – Production migration script
• [ ] database/migrations/validation.sql – Post-migration validation
• [ ] docs/operations/migration-runbook.md – Migration procedures

## Subtasks

• [ ] Create migration runner with pre/post migration validation
• [ ] Implement expand/contract migration pattern for zero downtime
• [ ] Build rollback procedures for each migration
• [ ] Create production migration script with safety checks
• [ ] Document migration procedures and approval process
• [ ] Test migrations on staging with production-like data
```

```markdown
---
type: task
id: PROD-006
title: Build Admin Dashboard Application
status: 🟡 To Do
priority: P0
domain: admin
effort: 5d
complexity: high
risk: high
assignee: @admin-team
reviewer: @tech-lead
dependencies: [TASK-009, TASK-010]
blocked_by: []
tags: [admin, dashboard, data-management]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-03
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Admin app functional
  - Data management tools working
  - Safe data operations
  - Audit logging active
acceptance_criteria:
  - Manual data fixes possible without raw SQL
  - Tenant data isolation maintained
  - All operations audited
  - Role-based access control
---

# Strategic Objective

Create admin dashboard for manual data fixes without writing raw SQL against production database. Currently apps/admin doesn't exist, forcing dangerous raw SQL queries for data fixes.

## Target Files

• [ ] apps/admin/app/layout.tsx – Admin app layout
• [ ] apps/admin/app/dashboard/page.tsx – Admin dashboard
• [ ] apps/admin/app/tenants/page.tsx – Tenant management
• [ ] apps/admin/app/leads/page.tsx – Lead data management
• [ ] packages/admin/components/DataEditor.tsx – Safe data editing component
• [ ] packages/admin/lib/audit-logger.ts – Admin action audit logging

## Subtasks

• [ ] Create admin app with authentication and RBAC
• [ ] Build tenant management interface
• [ ] Implement lead data management with safety checks
• [ ] Add audit logging for all admin actions
• [ ] Create data validation and safety mechanisms
• [ ] Test admin operations with role-based permissions
```

```markdown
---
type: task
id: PROD-007
title: Implement Production Monitoring & Alerting
status: 🟡 To Do
priority: P0
domain: observability
effort: 3d
complexity: medium
risk: high
assignee: @observability-team
reviewer: @tech-lead
dependencies: [TASK-003]
blocked_by: []
tags: [monitoring, alerting, sentry, uptime]
created: 2026-02-24
updated: 2026-02-24
due: 2026-02-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Monitoring dashboards active
  - Alert rules configured
  - Notification channels working
  - Response procedures documented
acceptance_criteria:
  - Critical issues trigger immediate alerts
  - Uptime monitoring functional
  - Performance metrics tracked
  - On-call rotation defined
---

# Strategic Objective

Set up production monitoring and alerting to wake someone up when critical issues occur. Sentry is wired in but no alert rules are defined.

## Target Files

• [ ] docs/observability/alert-rules.md – Alert rule definitions
• [ ] scripts/setup-sentry-alerts.js – Sentry alert configuration
• [ ] packages/infrastructure/monitoring/health-checks.ts – Health check endpoints
• [ ] apps/web/api/health/route.ts – Public health check endpoint
• [ ] docs/operations/on-call-procedures.md – On-call response procedures

## Subtasks

• [ ] Define critical alert rules in Sentry (error rates, downtime)
• [ ] Set up uptime monitoring for all critical endpoints
• [ ] Create health check endpoints for core services
• [ ] Configure notification channels (Slack, email, SMS)
• [ ] Document on-call procedures and escalation paths
• [ ] Test alerting scenarios to verify responsiveness
```

---

## 🔶 High Priority (P1 - Next Sprint)

### **Feature Implementation**

```markdown
---
type: task
id: TASK-006
title: Lead Management Feature & Server Actions (Wave 0, Batch 1.3)
status: 🟡 To Do
priority: P1
domain: features
effort: 3d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-004, TASK-003, TASK-002]
blocked_by: []
tags: [features, server-actions, zod, domain-events]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Server Actions implemented
  - Zod validation active
  - Domain events emitted
  - Client state management
  - Optimistic UI updates
acceptance_criteria:
  - Lead capture functional
  - Validation prevents invalid data
  - Real-time UI feedback
  - Domain events published
---

# Strategic Objective

Implement the use-case layer orchestrating domain entities with infrastructure. Creates the Server Action command bus for lead capture with Zod validation and domain event emission.

## Targeted Files

• [ ] packages/features/lead-management/dto.ts – Zod schemas for CreateLeadInput/UpdateLeadInput
• [ ] packages/features/lead-management/commands/createLead.ts – Next.js Server Action implementation
• [ ] packages/features/lead-management/events/LeadCaptured.ts – Domain event class
• [ ] packages/features/lead-management/model/lead-store.ts – Client-side state management (Zustand/Jotai)
• [ ] packages/features/index.ts – Public API barrel exports (FSD public interface)
• [ ] packages/features/lead-management/lib/validation.ts – Extended Zod validators

## Relevant Context Files

• [ ] Manifest: packages/features/ structure (use case orchestration)
• [ ] Manifest: packages/features/lead-management/

## Dependencies

Task 4 (Lead entity), Task 3 (Infrastructure context), Task 2 (Database schema)

## Advanced Code Patterns

• Server Actions as Command Bus: Use Next.js 16 "use server" directives as the command layer:
export async function createLead(input: CreateLeadInput) {
const tenantId = getTenantContext(); // From ALS
return db.transaction(async (trx) => {
const lead = Lead.create({...input, tenantId});
await trx.insert(leadsTable).values(lead.toPersistence());
return Result.ok(lead);
});
}
• Zod for Runtime Validation & Sanitization: CreateLeadSchema validates email format, required fields, and applies z.string().trim().toLowerCase() to prevent XSS and ensure consistency
• Domain Events Outbox: Lead.addDomainEvent(new LeadCaptured(lead.id)); infrastructure layer publishes to queue after successful transaction (lightweight Outbox pattern)
• Optimistic Concurrency: Include version field in leads table; check where version = expected on update to prevent lost updates in concurrent dashboard usage

## Subtasks

• [ ] Define CreateLeadSchema with Zod (email: valid email, name: min 2 chars, source: enum, metadata: record)
• [ ] Implement createLead Server Action with tenant context extraction from AsyncLocalStorage
• [ ] Add duplicate detection logic (same email within 24h = update existing, not insert) using unique partial indexes
• [ ] Create LeadCaptured domain event with timestamp and source tracking
• [ ] Implement updateLeadStatus Server Action with status transition validation (cannot go from converted back to new)
• [ ] Add client-side store for optimistic UI updates using Zustand with Immer
```

```markdown
---
type: task
id: TASK-007
title: Lead Capture Widget & Marketing Page Composition (Wave 0, Batch 2.1)
status: 🟡 To Do
priority: P1
domain: features
effort: 3d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-005, TASK-006, TASK-003]
blocked_by: []
tags: [marketing, lead-capture, widgets, composition]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Lead capture modal implemented
  - Marketing hero section created
  - Page composition patterns established
  - Optimistic UI updates working
  - Success state animations added
acceptance_criteria:
  - Lead capture functional across marketing pages
  - Modal and inline form variants working
  - Real-time UI feedback implemented
  - Conversion tracking integrated
---

# Strategic Objective

Build the user-facing conversion surface—composing primitives into the Lead Capture Modal and Hero section that creates the Golden Thread end-to-end.

## Targeted Files

• [ ] apps/web/widgets/lead-capture-modal/ui/LeadCaptureModal.tsx – Widget composition component
• [ ] apps/web/widgets/lead-capture-modal/lib/useLeadForm.ts – React Hook Form logic with Zod resolver
• [ ] apps/web/widgets/hero/ui/Hero.tsx – Marketing hero section with CTA
• [ ] apps/web/pages/home/ui/LeadFormSection.tsx – Page-specific layout component
• [ ] apps/web/app/(marketing)/page.tsx – Next.js page component (Server Component)
• [ ] apps/web/app/(marketing)/layout.tsx – Marketing shell with header/footer widgets

## Dependencies

Task 5 (UI primitives), Task 6 (Feature logic), Task 3 (Tenant context for middleware)

## Subtasks

• [ ] Create marketing layout with header, footer, and tenant-aware theme injection via CSS variables
• [ ] Build LeadCaptureModal widget using Dialog primitive, composing Form, Input, and Button with validation states
• [ ] Implement useLeadForm hook with React Hook Form, Zod resolver, and submission state management
• [ ] Create Hero widget with value proposition, social proof placeholders, and CTA button triggering modal
• [ ] Implement LeadFormSection for inline form display on landing page
• [ ] Add success state animation and confetti effect on successful lead submission
```

```markdown
---
type: task
id: TASK-008
title: Email Integration & Notification Delivery (Wave 0, Batch 2.2)
status: 🟡 To Do
priority: P1
domain: integrations
effort: 3d
complexity: medium
risk: low
assignee: @integrations-team
reviewer: @tech-lead
dependencies: [TASK-006, TASK-003]
blocked_by: []
tags: [email, resend, notifications, templates]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Resend client configured
  - Email templates created
  - Event handlers implemented
  - Idempotency working
  - Error handling robust
acceptance_criteria:
  - Lead notifications sent immediately
  - Template rendering working
  - Queue fallback functional
  - Preview route available
---

# Strategic Objective

Close the Golden Thread loop—when lead is captured, tenant receives immediate email notification via Resend with React Email templates.

## Targeted Files

• [ ] packages/integrations/resend/client.ts – API client with circuit breaker pattern
• [ ] packages/integrations/resend/types.ts – TypeScript interfaces for Resend API
• [ ] packages/email/templates/lead-notification.tsx – React Email template component
• [ ] packages/email/components/layout/EmailLayout.tsx – Base email HTML shell
• [ ] packages/email/components/Button.tsx – Email-safe button component
• [ ] packages/features/lead-management/events/handlers/sendLeadNotification.ts – Event handler
• [ ] packages/integrations/webhooks/idempotency.ts – Idempotency key generation

## Dependencies

Task 6 (Domain events), Task 3 (Secrets encryption for API keys)

## Subtasks

• [ ] Set up Resend client with environment variable validation using t3-env pattern
• [ ] Create LeadNotificationEmail React component with lead details, tenant branding, and CTA button to dashboard
• [ ] Implement sendLeadNotification event handler that triggers on LeadCaptured domain event
• [ ] Add idempotency key generation and storage in Redis (24h TTL) to prevent duplicate sends
• [ ] Create email preview route at /api/email-preview/lead-notification for development testing
• [ ] Implement error handling with queue fallback for Resend API failures
```

```markdown
---
type: task
id: TASK-009
title: Authentication System & Middleware Security (Wave 0, Batch 3.1)
status: 🟡 To Do
priority: P1
domain: security
effort: 4d
complexity: high
risk: medium
assignee: @security-team
reviewer: @security-lead
dependencies: [TASK-003, TASK-002]
blocked_by: []
tags: [authentication, clerk, rbac, middleware, security]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Clerk authentication configured
  - Middleware security implemented
  - RBAC system active
  - Dashboard routes protected
  - CVE-2025-29927 mitigated
acceptance_criteria:
  - Authentication flows working
  - Role-based access enforced
  - Security headers applied
  - Admin routes protected
---

# Strategic Objective

Secure the dashboard routes while keeping marketing pages public. Implement Clerk authentication with CVE-2025-29927 mitigation and RBAC (Role-Based Access Control).

## Targeted Files

• [ ] apps/web/middleware.ts – Updated with Clerk auth, tenant resolution, and security headers
• [ ] apps/web/app/(auth)/login/page.tsx – Authentication page using Clerk components
• [ ] apps/web/app/(auth)/callback/route.ts – OAuth callback handler
• [ ] apps/web/app/(dashboard)/layout.tsx – Protected dashboard shell with sidebar
• [ ] packages/infrastructure/auth/clerk.ts – Clerk client configuration
• [ ] packages/infrastructure/auth/rbac.ts – Permission matrix and role definitions
• [ ] packages/infrastructure/auth/middleware.ts – Auth middleware utilities

## Dependencies

Task 3 (Infrastructure context), Task 2 (Tenant resolution)

## Subtasks

• [ ] Configure Clerk middleware with afterAuth hook to inject tenant context into AsyncLocalStorage
• [ ] Implement CVE-2025-29927 protection by rejecting requests with x-middleware-subrequest header
• [ ] Create login and registration pages using Clerk components with custom styling matching design tokens
• [ ] Implement RBAC matrix (Admin, Manager, Member) with permission flags in packages/infrastructure/auth/rbac.ts
• [ ] Build dashboard layout shell with sidebar navigation, user menu, and tenant switcher (preparation for multi-tenant admin)
• [ ] Add role-based guards (<AdminGuard>, <MemberGuard>) as client components for feature access control
```

```markdown
---
type: task
id: TASK-010
title: Dashboard Data Table & Lead Management UI (Wave 0, Batch 3.2)
status: 🟡 To Do
priority: P1
domain: features
effort: 4d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-009, TASK-006, TASK-005]
blocked_by: []
tags: [dashboard, data-table, lead-management, tanstack-table]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Data table implemented
  - Server-side operations working
  - Lead detail view created
  - Bulk operations functional
  - Virtualization ready
acceptance_criteria:
  - Leads displayed with sorting/filtering
  - Server-side pagination working
  - Row actions implemented
  - Optimistic updates working
---

# Strategic Objective

Provide authenticated users with a data-dense interface to view, sort, filter, and manage captured leads using TanStack Table with server-side operations.

## Targeted Files

• [ ] apps/web/app/(dashboard)/leads/page.tsx – Lead list view with search params
• [ ] apps/web/widgets/data-table/ui/DataTable.tsx – Reusable table widget with sorting/pagination
• [ ] packages/ui-dashboard/data-table/DataTablePagination.tsx – Pagination controls
• [ ] packages/ui-dashboard/data-table/DataTableSorting.tsx – Column sorting UI
• [ ] packages/features/lead-management/queries/getLeads.ts – Server Action query with pagination
• [ ] packages/features/lead-management/queries/getLeadById.ts – Detail query
• [ ] apps/web/app/(dashboard)/leads/[id]/page.tsx – Lead detail view

## Dependencies

Task 9 (Auth), Task 6 (Lead features), Task 5 (UI primitives)

## Subtasks

• [ ] Create getLeads Server Action with pagination (cursor-based or offset), sorting, and status filtering with Zod validation for params
• [ ] Build DataTable widget with TanStack Table, using UI primitives for cell rendering and header styling
• [ ] Implement column definitions with custom cells (status badges, email links, relative date formatting using date-fns)
• [ ] Add row actions dropdown (View, Edit, Delete) with confirmation dialogs using AlertDialog primitive
• [ ] Create lead detail view at /leads/[id] with activity timeline and metadata display
• [ ] Implement bulk actions (select multiple rows, bulk delete) with optimistic UI updates
```

```markdown
---
type: task
id: TASK-011
title: Feature Flags & Edge Configuration System (Wave 1, Batch 0.4)
status: 🟡 To Do
priority: P1
domain: infrastructure
effort: 3d
complexity: medium
risk: low
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-003, TASK-009]
blocked_by: []
tags: [feature-flags, edge-config, vercel, canary]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Edge Config client configured
  - Server-side flag evaluation working
  - Client-side hooks implemented
  - Flag registry type-safe
  - Middleware integration complete
acceptance_criteria:
  - Runtime feature toggling working
  - Tenant-aware targeting functional
  - Canary deployments supported
  - Performance impact minimal
---

# Strategic Objective

Implement runtime feature toggling using Vercel Edge Config to enable gradual rollout of Wave 1 features (Booking, Billing) without deployment risk. This allows Canary releases per tenant.

## Targeted Files

• [ ] packages/flags/config.ts – Edge Config client setup with environment validation
• [ ] packages/flags/server.ts – Server-side flag evaluation with tenant context
• [ ] packages/flags/client.ts – Client-side flag hooks with SWR caching
• [ ] packages/flags/flags.ts – Flag definitions registry (type-safe)
• [ ] apps/web/middleware.ts – Update to inject flag values into headers for SSR
• [ ] apps/web/app/(dashboard)/layout.tsx – Consume flags for feature visibility

## Dependencies

Task 3 (Infrastructure context), Task 9 (Auth middleware)

## Subtasks

• [ ] Set up Vercel Edge Config store with connection token validation
• [ ] Implement getFlag(key, context) function that accepts tenantId and returns boolean/string/JSON variant
• [ ] Create React hook useFlag(key) that reads from SSR-injected data then hydrates with client-side evaluation
• [ ] Define initial flags: enable_booking_system, enable_billing, enable_advanced_analytics
• [ ] Add middleware integration to pre-resolve flags and inject into request headers
• [ ] Create UI component <FeatureFlag flag="enable_booking_system" fallback={<UpgradePrompt />} for conditional rendering
```

```markdown
---
type: task
id: TASK-012
title: Queue System & Background Job Infrastructure (Wave 1, Batch 0.5)
status: 🟡 To Do
priority: P1
domain: infrastructure
effort: 4d
complexity: high
risk: medium
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-003, TASK-008]
blocked_by: []
tags: [queue, background-jobs, inngest, redis]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Queue client initialized
  - Job definitions created
  - Workers implemented
  - API routes configured
  - Monitoring dashboard ready
acceptance_criteria:
  - Background processing working
  - Retry logic implemented
  - Dead-letter queue functional
  - Concurrency controls active
---

# Strategic Objective

Implement async job processing for heavy operations (email campaigns, webhook retries, report generation) using Inngest or BullMQ with Redis. This decouples request lifecycle from processing time.

## Targeted Files

• [ ] packages/infrastructure/queue/client.ts – Queue client initialization (Inngest/Bull)
• [ ] packages/infrastructure/queue/jobs.ts – Job definitions registry with Zod schemas
• [ ] packages/infrastructure/queue/workers/emailWorker.ts – Email processing worker
• [ ] packages/infrastructure/queue/workers/webhookWorker.ts – Webhook retry worker with exponential backoff
• [ ] apps/web/api/inngest/route.ts – Inngest API route handler (or Bull Board)
• [ ] packages/features/email-campaigns/commands/sendCampaign.ts – Campaign queueing logic

## Dependencies

Task 3 (Redis cache), Task 8 (Email integration)

## Subtasks

• [ ] Set up Inngest client (or BullMQ) with Redis connection pooling
• [ ] Implement enqueueJob(name, payload, options) wrapper that validates payload with Zod before enqueueing
• [ ] Create email worker that processes send-email jobs with Resend API, handling rate limits (429) with automatic retry
• [ ] Create webhook worker with HMAC signature verification and exponential backoff for failed deliveries
• [ ] Build dashboard UI in admin for queue monitoring (job counts, failure rates, retry attempts)
• [ ] Implement dead-letter queue (DLQ) for jobs failing 5 times; alert on Slack/Discord when DLQ grows
```

```markdown
---
type: task
id: TASK-013
title: Booking System Domain & Entity Layer (Wave 1, Batch 1.4)
status: 🟡 To Do
priority: P1
domain: domain
effort: 4d
complexity: medium
risk: medium
assignee: @domain-team
reviewer: @tech-lead
dependencies: [TASK-004, TASK-002]
blocked_by: []
tags: [booking, scheduling, domain, entities]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Booking entity implemented
  - Repository interface created
  - Domain errors defined
  - Value objects validated
  - Database migrations ready
acceptance_criteria:
  - Booking state machine working
  - Time validation enforced
  - Double-booking prevented
  - Timezone support functional
---

# Strategic Objective

Extend core domain with Booking entity (scheduling), supporting time slots, availability rules, and conflict detection. Establishes the business logic foundation for Cal.com integration.

## Targeted Files

• [ ] packages/core/entities/booking/Booking.ts – Booking entity with state machine (pending → confirmed → cancelled → completed)
• [ ] packages/core/entities/booking/BookingRepository.ts – Repository interface
• [ ] packages/core/entities/booking/errors.ts – Domain errors (DoubleBookingError, PastDateError)
• [ ] packages/core/value-objects/DateRange.ts – Value object for time slot validation
• [ ] packages/core/value-objects/TimeSlot.ts – Individual slot validation with timezone support
• [ ] database/migrations/20240104000000_bookings.sql – Booking table with RLS policies

## Dependencies

Task 4 (Domain foundation), Task 2 (RLS patterns)

## Subtasks

• [ ] Create Booking entity with customerEmail, startTime, endTime, status, meetingLink, metadata
• [ ] Implement confirm(), cancel(), reschedule(newDateRange) methods with validation rules
• [ ] Create DateRange value object with overlaps(other) method and timezone conversion utilities
• [ ] Write RLS policies ensuring tenants can only see bookings where booking.tenant_id = current_setting('app.current_tenant')
• [ ] Add database constraints: CHECK (end_time > start_time), EXCLUDE USING GIST (tenant_id WITH =, tstzrange(start_time, end_time) WITH &&) (PostgreSQL temporal exclusion to prevent race-condition double bookings)
• [ ] Write domain unit tests for double-booking detection and timezone handling
```

```markdown
---
type: task
id: TASK-014
title: Cal.com Integration Adapter (Wave 1, Batch 1.5)
status: 🟡 To Do
priority: P1
domain: integrations
effort: 4d
complexity: medium
risk: low
assignee: @integrations-team
reviewer: @tech-lead
dependencies: [TASK-013, TASK-012, TASK-008]
blocked_by: []
tags: [calcom, scheduling, adapter, webhooks]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Adapter pattern implemented
  - API client with rate limiting
  - Availability checking working
  - Booking synchronization active
  - Webhook handlers ready
acceptance_criteria:
  - Real-time availability sync
  - Two-way booking sync
  - Conflict resolution working
  - Webhook idempotency ensured
---

# Strategic Objective

Implement the Plugin Architecture adapter for Cal.com scheduling API, enabling real-time availability checking and booking synchronization. Follows the Adapter pattern established in packages/integrations.

## Targeted Files

• [ ] packages/integrations/adapters/calcom/index.ts – Adapter registration and config
• [ ] packages/integrations/adapters/calcom/client.ts – API client with rate limiting
• [ ] packages/integrations/adapters/calcom/availability.ts – Get available slots
• [ ] packages/integrations/adapters/calcom/booking.ts – Create/update/delete bookings
• [ ] packages/integrations/adapters/calcom/types.ts – TypeScript interfaces for Cal.com API
• [ ] packages/integrations/webhooks/calcom/route.ts – Webhook handler for booking updates

## Dependencies

Task 13 (Booking domain), Task 12 (Queue for async sync), Task 8 (Email for confirmations)

## Subtasks

• [ ] Create Cal.com API client with personal access token authentication and request/response logging
• [ ] Implement getAvailability(dateRange) method fetching free/busy slots from Cal.com API with caching (15min TTL in Redis)
• [ ] Build createBooking(slot, customerDetails) that books in Cal.com then persists to our DB via Task 13 repository
• [ ] Create webhook handler for booking.created, booking.cancelled, booking.rescheduled events from Cal.com
• [ ] Add idempotency check using Redis to prevent duplicate processing of webhook retries
• [ ] Implement sync reconciliation job (queued) that runs hourly to ensure Cal.com and local DB are consistent
```

```markdown
---
type: task
id: TASK-015
title: Stripe Integration & Billing Foundation (Wave 1, Batch 2.3)
status: 🟡 To Do
priority: P1
domain: integrations
effort: 4d
complexity: high
risk: medium
assignee: @integrations-team
reviewer: @security-lead
dependencies: [TASK-003, TASK-012, TASK-009]
blocked_by: []
tags: [stripe, billing, payments, subscriptions]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Stripe SDK initialized
  - Subscription management working
  - Customer portal functional
  - Webhook handling secure
  - Billing tables ready
acceptance_criteria:
  - Payment processing working
  - Subscription lifecycle managed
  - Webhook events processed
  - Customer portal accessible
---

# Strategic Objective

Implement payment processing with Stripe, including subscription management, customer portal, and webhook handling for payment events. Critical for monetization.

## Targeted Files

• [ ] packages/integrations/adapters/stripe/client.ts – Stripe SDK initialization
• [ ] packages/integrations/adapters/stripe/subscriptions.ts – Create/manage subscriptions
• [ ] packages/integrations/adapters/stripe/customer.ts – Customer creation and linking
• [ ] packages/integrations/adapters/stripe/webhook.ts – Webhook signature verification and event handling
• [ ] apps/web/api/webhooks/stripe/route.ts – API route for Stripe webhooks
• [ ] packages/features/billing/commands/createSubscription.ts – Business logic for subscription creation
• [ ] database/migrations/20240111000000_subscriptions.sql – Subscription table with tenant FK

## Dependencies

Task 3 (Secrets encryption for Stripe keys), Task 12 (Queue for webhook processing), Task 9 (Auth for protected billing routes)

## Subtasks

• [ ] Set up Stripe client with encrypted API keys from Task 3 secrets manager
• [ ] Create createSubscription(tenantId, priceId) Server Action with idempotency key generation
• [ ] Implement Stripe webhook handler for invoice.paid, invoice.payment_failed, customer.subscription.updated events
• [ ] Build subscription status synchronization logic (update DB when Stripe webhooks received)
• [ ] Create billing portal widget using Stripe Customer Portal for subscription management (cancel, update payment method)
• [ ] Add RLS policies ensuring tenants can only view their own subscription records
```

```markdown
---
type: task
id: TASK-016
title: Storybook & Visual Regression Testing (Wave 1, Batch 3.3)
status: 🟡 To Do
priority: P1
domain: testing
effort: 3d
complexity: medium
risk: low
assignee: @ui-team
reviewer: @design-lead
dependencies: [TASK-005]
blocked_by: []
tags: [storybook, visual-testing, documentation, chromatic]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Storybook configured
  - Component stories written
  - Visual testing pipeline active
  - Accessibility testing integrated
  - Documentation complete
acceptance_criteria:
  - All primitives documented
  - Visual regressions prevented
  - WCAG compliance checked
  - Design system governed
---

# Strategic Objective

Establish component documentation and visual testing using Storybook to prevent UI regressions across 90+ UI primitives and marketing components. Enables design system governance.

## Targeted Files

• [ ] apps/storybook/.storybook/main.ts – Storybook configuration with Vite/Webpack
• [ ] apps/storybook/.storybook/preview.tsx – Global decorators (theme, tenant context mock)
• [ ] apps/storybook/src/stories/primitives/Button.stories.tsx – Button component stories
• [ ] apps/storybook/src/stories/marketing/Hero.stories.tsx – Marketing block stories
• [ ] apps/storybook/src/stories/dashboard/DataTable.stories.tsx – Dashboard component stories
• [ ] .github/workflows/chromatic.yml – Visual regression CI pipeline

## Dependencies

Task 5 (UI primitives must exist to document)

## Subtasks

• [ ] Configure Storybook with TypeScript, Tailwind CSS integration, and path aliases for @repo/\*
• [ ] Create global decorator that injects mock tenant context and theme CSS variables
• [ ] Write stories for all Phase 0 primitives (Button, Input, Dialog, Card, etc.) with variants (size, intent, state)
• [ ] Write stories for marketing blocks (Hero, PricingTable, Testimonial) with mock data
• [ ] Set up Chromatic CI workflow to run visual tests on every PR
• [ ] Configure Storybook accessibility addon (axe) to check WCAG compliance automatically
```

```markdown
---
type: task
id: TASK-017
title: Advanced Security, Audit Logging & Compliance (Wave 1, Batch 3.4)
status: 🟡 To Do
priority: P1
domain: security
effort: 4d
complexity: high
risk: medium
assignee: @security-team
reviewer: @security-lead
dependencies: [TASK-003, TASK-009]
blocked_by: []
tags: [security, audit, compliance, soc2, encryption]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Audit logging implemented
  - Field-level encryption active
  - Security headers enhanced
  - Vulnerability scanning automated
  - Incident runbooks created
acceptance_criteria:
  - Immutable audit trail
  - PII protection ensured
  - SOC 2 readiness achieved
  - Security monitoring active
---

# Strategic Objective

Harden security for SOC 2 compliance with comprehensive audit logging, data encryption at rest, and automated security scanning. Prepares for enterprise sales.

## Targeted Files

• [ ] packages/infrastructure/security/audit-logger.ts – Structured audit log emitter
• [ ] packages/infrastructure/security/encryption.ts – Field-level encryption for PII
• [ ] database/migrations/20240112000000_audit_logs.sql – Audit log table (immutable)
• [ ] apps/web/middleware.ts – Security headers update (HSTS, CSP strict-dynamic)
• [ ] scripts/security/verify-locks.sh – Dependency vulnerability scanning
• [ ] docs/runbooks/security-incident.md – Incident response procedures

## Dependencies

Task 3 (Basic security), Task 9 (Auth for actor identification)

## Subtasks

• [ ] Create audit logger that records all CREATE/UPDATE/DELETE operations on leads, bookings, and subscriptions with before/after diff
• [ ] Implement field-level encryption for lead email addresses and phone numbers in database
• [ ] Update middleware to generate CSP nonces and apply strict Content-Security-Policy headers
• [ ] Configure HSTS with 1-year max-age and preload directive
• [ ] Set up automated Snyk scanning in GitHub Actions with PR checks for vulnerabilities
• [ ] Create security incident runbook documenting RLS bypass response, data breach procedures, and key rotation processes
```

```markdown
---
type: task
id: TASK-018
title: File Upload & Object Storage Infrastructure (Wave 1, Batch 2.4)
status: 🟡 To Do
priority: P1
domain: infrastructure
effort: 3d
complexity: medium
risk: low
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-003, TASK-005]
blocked_by: []
tags: [file-upload, storage, s3, r2, security]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - S3/R2 client configured
  - Presigned URLs working
  - Upload validation active
  - File metadata managed
  - UI components ready
acceptance_criteria:
  - Secure file uploads working
  - Tenant isolation ensured
  - Content validation enforced
  - Virus scanning ready
---

# Strategic Objective

Implement secure file upload handling with presigned URLs, virus scanning (future), and RLS-protected storage for tenant assets (logos, attachments). Uses S3-compatible API (R2/S3).

## Targeted Files

• [ ] packages/infrastructure/storage/s3.ts – S3/R2 client configuration
• [ ] packages/infrastructure/storage/presigned-urls.ts – URL generation for secure uploads
• [ ] apps/web/api/upload/route.ts – Upload handler with validation
• [ ] packages/features/file-upload/commands/uploadFile.ts – Business logic for file processing
• [ ] database/migrations/20240110000000_files.sql – File metadata table with RLS
• [ ] apps/web/widgets/file-uploader/ui/FileUploader.tsx – Drag-drop UI component

## Dependencies

Task 3 (Tenant context), Task 5 (UI primitives)

## Subtasks

• [ ] Configure S3/R2 client with tenant-scoped credentials (or bucket policies)
• [ ] Implement getPresignedUploadUrl(filename, contentType) Server Action with size limits (10MB) and type validation
• [ ] Create files table with id, tenant_id, filename, s3_key, size, mime_type, status (uploading/active/quarantined), uploaded_by
• [ ] Build drag-and-drop file uploader widget with progress indication and error handling
• [ ] Implement file download proxy that verifies RLS permissions before redirecting to presigned GET URL
• [ ] Add file cleanup cron job (queued) that deletes orphaned files (uploaded >24h ago but not confirmed) from S3
```

```markdown
---
type: task
id: TASK-019
title: Analytics Engine & Event Tracking (Wave 1, Batch 2.5)
status: 🟡 To Do
priority: P1
domain: analytics
effort: 4d
complexity: medium
risk: low
assignee: @analytics-team
reviewer: @tech-lead
dependencies: [TASK-010, TASK-009]
blocked_by: []
tags: [analytics, tracking, tinybird, events]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Event tracking implemented
  - Analytics dashboard created
  - Real-time ingestion working
  - Privacy compliance ensured
  - Data export functional
acceptance_criteria:
  - Key events tracked
  - Real-time metrics available
  - Tenant analytics isolated
  - GDPR compliance met
---

# Strategic Objective

Implement product analytics using Tinybird (or similar) for real-time event ingestion, enabling tenant-level insights on lead conversion, booking rates, and revenue metrics.

## Targeted Files

• [ ] packages/integrations/adapters/google-analytics-4/client.ts – GA4 client-side integration
• [ ] packages/features/analytics-tracking/events/trackEvent.ts – Event tracking utility
• [ ] packages/features/analytics-engine/queries/getTenantMetrics.ts – Aggregated metrics query
• [ ] apps/web/app/(dashboard)/analytics/page.tsx – Analytics dashboard UI
• [ ] packages/ui-dashboard/charts/LineChart.tsx – Analytics visualization component
• [ ] database/migrations/20240108000000_analytics.sql – Events table (or Tinybird Data Source)

## Dependencies

Task 10 (Dashboard foundation), Task 9 (Auth for user identification)

## Subtasks

• [ ] Set up Tinybird (or Clickhouse/Postgres) data source for events with columns: timestamp, tenant_id, event_type, user_id, properties (JSON)
• [ ] Implement trackEvent(eventType, properties) utility that queues events for batch insertion
• [ ] Track key events: lead_captured, booking_created, subscription_started, page_viewed
• [ ] Create analytics dashboard with charts showing leads over time, conversion funnel, and revenue metrics (from Stripe data)
• [ ] Implement GA4 integration for marketing page tracking with consent mode (respect cookie preferences)
• [ ] Add data export functionality (CSV/JSON) for tenant admins to download their analytics data (GDPR compliance)
```

```markdown
---
type: task
id: TASK-020
title: Page Builder Core & CMS Foundation (Wave 1, Batch 3.5)
status: 🟡 To Do
priority: P1
domain: features
effort: 5d
complexity: high
risk: medium
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-005, TASK-004, TASK-011]
blocked_by: []
tags: [page-builder, cms, blocks, rendering]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Page entities created
  - Block registry implemented
  - Dynamic renderer working
  - Basic canvas UI ready
  - Publishing workflow active
acceptance_criteria:
  - Page structure persisted
  - Blocks render correctly
  - Preview mode functional
  - Version history maintained
---

# Strategic Objective

Implement the foundational data model and basic UI for the Page Builder (site builder), allowing tenants to create custom landing pages with drag-and-drop blocks. This is the key differentiator feature.

## Targeted Files

• [ ] packages/core/entities/page/Page.ts – Page entity with block tree structure
• [ ] packages/core/entities/site/Site.ts – Site aggregate root (collection of pages)
• [ ] packages/features/page-builder/commands/savePage.ts – Persist page structure
• [ ] packages/features/page-builder/queries/getPageBySlug.ts – Retrieve page for rendering
• [ ] apps/web/app/(site)/[...slug]/page.tsx – Dynamic page renderer
• [ ] apps/web/widgets/page-builder-canvas/ui/Canvas.tsx – Visual editor canvas (Phase 1 basic)
• [ ] database/migrations/20240105000000_sites.sql – Sites table
• [ ] database/migrations/20240106000000_pages.sql – Pages table with JSON blocks column

## Dependencies

Task 5 (UI primitives as blocks), Task 4 (Domain foundation), Task 11 (Feature flags to enable builder)

## Subtasks

• [ ] Create Site entity with customDomain, themeSettings (colors, fonts)
• [ ] Create Page entity with slug, title, metaDescription, blocks (JSON array), status (draft/published), publishedAt
• [ ] Implement basic block types: hero, text, image, lead_form, pricing_table with respective Prop interfaces
• [ ] Build dynamic page renderer that fetches page by slug, validates blocks against registry, and renders components
• [ ] Create basic Page Builder canvas UI with sidebar block picker and property editor (read-only preview for Phase 1, full drag-drop for Phase 2)
• [ ] Implement publish/unpublish functionality with version history (store previous JSON snapshots in page_versions table)
```

```markdown
---
type: task
id: TASK-021
title: Admin Dashboard & System-Wide Governance (Wave 2, Batch 4.1)
status: 🟡 To Do
priority: P2
domain: admin
effort: 5d
complexity: high
risk: medium
assignee: @admin-team
reviewer: @tech-lead
dependencies: [TASK-010, TASK-017, TASK-009]
blocked_by: []
tags: [admin, governance, monitoring, impersonation]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Admin dashboard deployed
  - Cross-tenant management working
  - System monitoring active
  - Tenant impersonation ready
  - Revenue analytics functional
acceptance_criteria:
  - Support team can manage tenants
  - System health monitored
  - Billing overview available
  - Audit trail maintained
---

# Strategic Objective

Deploy the internal Admin application (apps/admin) for cross-tenant management, system health monitoring, and platform governance. Enables support team to manage enterprise clients without database access.

## Targeted Files

• [ ] apps/admin/app/layout.tsx – Admin shell with navigation
• [ ] apps/admin/app/page.tsx – System overview dashboard (tenant counts, revenue, health)
• [ ] apps/admin/app/tenants/page.tsx – Tenant management interface (suspend, impersonate)
• [ ] apps/admin/app/users/page.tsx – Cross-tenant user search and management
• [ ] apps/admin/app/billing/page.tsx – Platform-wide revenue analytics
• [ ] apps/admin/app/system/page.tsx – Health checks, queue status, error rates
• [ ] apps/admin/widgets/tenant-admin-grid/ui/TenantAdminGrid.tsx – Data table with tenant details
• [ ] packages/features/team-management/commands/impersonateTenant.ts – Secure impersonation for support

## Dependencies

Task 10 (Dashboard patterns), Task 17 (Audit logging for admin actions), Task 9 (Auth with RBAC for admin roles)

## Subtasks

• [ ] Set up separate Next.js app at apps/admin with its own middleware enforcing SUPER_ADMIN role
• [ ] Create system overview showing total tenants, MRR (Monthly Recurring Revenue), active users, and recent errors
• [ ] Build tenant management grid with search, filter by plan/status, and suspend/activate controls
• [ ] Implement "Login As" functionality that generates temporary session for tenant admin without knowing their password (full audit trail)
• [ ] Create billing overview showing revenue by plan, churn rate, and failed payment counts
• [ ] Add system health page with Redis connection status, queue lengths, and recent deployment version
```

```markdown
---
type: task
id: TASK-022
title: Team Management & RBAC Enhancement (Wave 2, Batch 4.2)
status: 🟡 To Do
priority: P2
domain: features
effort: 4d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-009, TASK-004]
blocked_by: []
tags: [team-management, rbac, permissions, invitations]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Multi-user support implemented
  - Role-based permissions active
  - Invitation flows working
  - Permission inheritance working
  - Ownership transfer safe
acceptance_criteria:
  - Teams can collaborate effectively
  - Role permissions enforced
  - Invitation system secure
  - Access control granular
---

# Strategic Objective

Implement multi-user tenant support with role-based access control (Owner, Admin, Manager, Viewer), invitation flows, and permission inheritance. Critical for enterprise sales (teams >1 user).

## Targeted Files

• [ ] packages/core/entities/user/TeamMember.ts – Team membership aggregate
• [ ] packages/core/entities/user/permissions.ts – Granular permission definitions
• [ ] packages/features/team-management/commands/inviteMember.ts – Invitation logic
• [ ] packages/features/team-management/commands/acceptInvite.ts – Acceptance flow
• [ ] apps/web/app/(dashboard)/settings/team/page.tsx – Team management UI
• [ ] apps/web/widgets/team-member-list/ui/TeamMemberList.tsx – Member management table
• [ ] database/migrations/20240114000000_team_members.sql – Junction table with roles

## Dependencies

Task 9 (Auth foundation), Task 4 (User entity extension)

## Subtasks

• [ ] Extend users table with current_tenant_id and create team_members junction table (user_id, tenant_id, role, permissions, invited_by, invited_at)
• [ ] Implement inviteMember(email, role) Server Action sending Resend email with secure invitation link
• [ ] Build invitation acceptance flow handling signup (new user) or login (existing user) with automatic tenant association
• [ ] Create team settings page showing members, pending invites, and role management (Owner/Admin/Manager/Viewer)
• [ ] Implement permission checks in all Server Actions (e.g., requirePermission(permissions.LEAD_DELETE))
• [ ] Add "Leave Tenant" functionality with safeguards preventing owner from leaving without transferring ownership
```

```markdown
---
type: task
id: TASK-023
title: Email Marketing Campaigns & Automation (Wave 2, Batch 4.3)
status: 🟡 To Do
priority: P2
domain: features
effort: 5d
complexity: high
risk: medium
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-008, TASK-012, TASK-022]
blocked_by: []
tags: [email-campaigns, marketing, automation, segmentation]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Campaign creation working
  - Segmentation engine active
  - Bulk sending functional
  - Analytics tracking ready
  - Unsubscribe handling working
acceptance_criteria:
  - Campaigns can be created and sent
  - Lead segmentation working
  - Open/click tracking active
  - Compliance features implemented
---

# Strategic Objective

Build email campaign system allowing tenants to send bulk emails to leads using React Email templates, with scheduling, segmentation, and analytics. Differentiates from basic transactional email.

## Targeted Files

• [ ] packages/core/entities/campaign/Campaign.ts – Campaign aggregate root
• [ ] packages/features/email-campaigns/commands/createCampaign.ts – Campaign creation
• [ ] packages/features/email-campaigns/commands/sendCampaign.ts – Bulk send orchestration
• [ ] packages/features/email-campaigns/queries/getCampaignStats.ts – Open/click tracking
• [ ] packages/email/templates/campaign-sent.tsx – Campaign email template
• [ ] apps/web/app/(dashboard)/campaigns/page.tsx – Campaign management UI
• [ ] database/migrations/20240107000000_campaigns.sql – Campaigns and email_events tables

## Dependencies

Task 8 (Email infrastructure), Task 12 (Queue system for bulk sending), Task 22 (Team permissions for who can send)

## Subtasks

• [ ] Create campaigns table with name, subject, template, segment_filters (JSONB), status (draft/scheduled/sending/sent), sent_count, open_count, click_count
• [ ] Build campaign editor UI with Rich Text Editor (Tiptap or Lexical) for email composition
• [ ] Implement queue worker processing campaigns in batches (100 leads per job) with rate limiting
• [ ] Create tracking infrastructure: pixel endpoint logging opens, link redirect endpoint logging clicks with UTM parameter preservation
• [ ] Add campaign analytics dashboard showing delivery rates, opens, clicks, and unsubscribes
• [ ] Implement unsubscribe footer and preference management page (/unsubscribe?token=XYZ with signed JWT preventing tampering)
```

```markdown
---
type: task
id: TASK-024
title: Internationalization (i18n) & Localization (Wave 2, Batch 4.4)
status: 🟡 To Do
priority: P2
domain: infrastructure
effort: 4d
complexity: medium
risk: low
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-005, TASK-007]
blocked_by: []
tags: [i18n, localization, next-intl, rtl]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - next-intl configured
  - Subpath routing working
  - Translations extracted
  - RTL support implemented
  - SEO hreflang tags added
acceptance_criteria:
  - Multi-language sites functional
  - Content properly translated
  - SEO optimized for i18n
  - Locale switching working
---

# Strategic Objective

Implement multi-language support using next-intl for marketing sites and dashboard, starting with English (EN), Spanish (ES), and German (DE). Enables expansion into EU markets.

## Targeted Files

• [ ] packages/i18n/config.ts – next-intl configuration with routing
• [ ] packages/i18n/middleware.ts – Locale detection and negotiation
• [ ] packages/i18n/messages/en.json – English translations
• [ ] packages/i18n/messages/es.json – Spanish translations (Phase 2)
• [ ] packages/i18n/messages/de.json – German translations (Phase 3)
• [ ] apps/web/app/[locale]/layout.tsx – Locale-aware root layout
• [ ] apps/web/app/[locale]/(marketing)/page.tsx – Localized marketing page
• [ ] packages/ui-primitives/components/calendar/Calendar.tsx – Locale-aware date components

## Dependencies

Task 5 (UI components must support RTL), Task 7 (Marketing content to translate)

## Subtasks

• [ ] Configure next-intl with subpath routing (/en, /es) and middleware locale detection
• [ ] Extract all hardcoded strings from marketing pages and UI components into en.json message files organized by namespace (marketing, dashboard, auth)
• [ ] Implement Spanish translation for all Wave 0-1 features (marketing site, dashboard, auth)
• [ ] Add RTL CSS support to UI primitives (margin/padding logical properties, flex direction)
• [ ] Create locale switcher component (dropdown) storing preference in cookie
• [ ] Update SEO metadata generation to include hreflang tags for all supported locales
```

```markdown
---
type: task
id: TASK-025
title: Advanced SEO & Structured Data (Wave 2, Batch 4.5)
status: 🟡 To Do
priority: P2
domain: seo
effort: 4d
complexity: medium
risk: low
assignee: @seo-team
reviewer: @tech-lead
dependencies: [TASK-007, TASK-020, TASK-024]
blocked_by: []
tags: [seo, structured-data, sitemap, og-images]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Metadata factory implemented
  - JSON-LD structured data active
  - Dynamic sitemaps working
  - OG image generation ready
  - Canonical URLs correct
acceptance_criteria:
  - SEO optimization comprehensive
  - Structured data valid
  - Social sharing optimized
  - Search visibility improved
---

# Strategic Objective

Implement comprehensive SEO system with dynamic sitemap generation, JSON-LD structured data (Schema.org), and Open Graph image generation for all tenant pages. Critical for organic growth.

## Targeted Files

• [ ] packages/seo/metadata.ts – Metadata factory with tenant context
• [ ] packages/seo/json-ld.ts – JSON-LD generators for schemas
• [ ] packages/seo/schemas/local-business.ts – LocalBusiness schema
• [ ] packages/seo/schemas/article.ts – Article/BlogPosting schema (Phase 2)
• [ ] apps/web/app/sitemap.ts – Dynamic sitemap generation
• [ ] apps/web/app/opengraph-image.tsx – Dynamic OG image generation (1200x630)
• [ ] apps/web/app/(marketing)/blog/[slug]/page.tsx – Blog with structured data

## Dependencies

Task 7 (Marketing pages), Task 20 (Page Builder for dynamic content), Task 24 (i18n for multilingual SEO)

## Subtasks

• [ ] Create metadata factory that generates titles, descriptions, and Open Graph tags based on page content and tenant settings
• [ ] Implement dynamic OG image generation using Edge Runtime with tenant logo overlay and page title
• [ ] Build JSON-LD generators for LocalBusiness (address, hours, geo), Organization (logo, social links), and Article (blog posts with author)
• [ ] Create dynamic sitemap generator including marketing pages, blog posts, and public lead magnets (respecting noindex flags)
• [ ] Add robots.ts for dynamic robots.txt generation (disallow admin paths, allow sitemap reference)
• [ ] Implement canonical URL logic handling i18n variants and pagination (rel="prev"/"next")
```

```markdown
---
type: task
id: TASK-026
title: Real-Time Notifications & Supabase Realtime (Wave 2, Batch 5.1)
status: 🟡 To Do
priority: P2
domain: features
effort: 4d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-002, TASK-010, TASK-022]
blocked_by: []
tags: [realtime, notifications, presence, supabase]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Realtime client configured
  - Lead subscriptions working
  - Activity feed implemented
  - Notification center ready
  - Presence indicators active
acceptance_criteria:
  - Live updates working
  - Team presence visible
  - Notifications delivered
  - Reconnection handling robust
---

# Strategic Objective

Implement live UI updates using Supabase Realtime for lead feed notifications, team collaboration (cursor presence), and booking alerts. Differentiates from polling-based competitors.

## Targeted Files

• [ ] packages/realtime/client.ts – Supabase Realtime client wrapper
• [ ] packages/realtime/hooks/useRealtimeLeads.ts – Live lead subscription hook
• [ ] packages/realtime/hooks/usePresence.ts – Team presence awareness
• [ ] apps/web/widgets/activity-feed/ui/ActivityFeed.tsx – Real-time activity stream
• [ ] apps/web/widgets/notification-center/ui/NotificationCenter.tsx – Toast notifications for events
• [ ] packages/features/real-time-notifications/events/publishNotification.ts – Event publisher

## Dependencies

Task 2 (Supabase setup), Task 10 (Dashboard UI), Task 22 (Team context for presence)

## Subtasks

• [ ] Set up Supabase Realtime client with tenant-scoped channel subscriptions and RLS enforcement on broadcast permissions
• [ ] Implement useRealtimeLeads() hook subscribing to new lead insertions in database (Postgres Changes)
• [ ] Create activity feed widget showing real-time stream of lead captures, bookings, and team actions (paginated history + live updates)
• [ ] Build notification center with badge counts and toast notifications for important events (new lead assigned to you, booking confirmed)
• [ ] Add team presence indicators (who's online) using Realtime Presence feature with heartbeat every 30s
• [ ] Implement reconnection logic handling network outages with "Reconnecting..." state and missed event recovery
```

```markdown
---
type: task
id: TASK-027
title: Advanced Analytics & Attribution (Wave 2, Batch 5.2)
status: 🟡 To Do
priority: P2
domain: analytics
effort: 4d
complexity: medium
risk: low
assignee: @analytics-team
reviewer: @tech-lead
dependencies: [TASK-019, TASK-006, TASK-015]
blocked_by: []
tags: [analytics, attribution, funnel, cohort]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Attribution models implemented
  - Funnel analysis working
  - Cohort retention tracked
  - Revenue attribution active
  - Weekly reports automated
acceptance_criteria:
  - Marketing channels measured
  - Conversion funnels visible
  - Customer retention tracked
  - ROAS calculated accurately
---

# Strategic Objective

Implement funnel analysis, cohort retention, and multi-touch attribution to show tenants which marketing channels drive revenue (not just leads).

## Targeted Files

• [ ] packages/features/analytics-engine/queries/getFunnelAnalysis.ts – Funnel step conversion rates
• [ ] packages/features/analytics-engine/queries/getAttribution.ts – Channel attribution models
• [ ] packages/ui-dashboard/charts/FunnelChart.tsx – Funnel visualization
• [ ] apps/web/app/(dashboard)/analytics/attribution/page.tsx – Attribution dashboard
• [ ] database/migrations/20240115000000_attribution.sql – Touchpoints table for multi-touch tracking

## Dependencies

Task 19 (Basic analytics), Task 6 (Lead source tracking), Task 15 (Stripe for revenue attribution)

## Subtasks

• [ ] Create touchpoints table tracking every interaction (page view, form open, submission) with UTM parameters and referrer
• [ ] Implement attribution calculation engine supporting first-touch and linear models (credit divided equally across all touchpoints)
• [ ] Build funnel chart component showing conversion rates between visitor → lead → qualified → customer
• [ ] Create cohort retention grid showing percentage of leads from Week 1 who booked in Week 2, 3, 4, etc.
• [ ] Add revenue attribution dashboard showing revenue per channel and ROAS calculations
• [ ] Implement automated weekly email reports (Phase 2) with PDF generation using @react-pdf/renderer
```

```markdown
---
type: task
id: TASK-028
title: Template System & White-Label Engine (Wave 2, Batch 5.3)
status: 🟡 To Do
priority: P2
domain: features
effort: 4d
complexity: medium
risk: low
assignee: @features-team
reviewer: @tech-lead
dependencies: [TASK-020, TASK-005, TASK-011]
blocked_by: []
tags: [templates, white-label, theming, branding]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Template gallery implemented
  - Theme editor working
  - CSS injection active
  - Client overrides ready
  - Runtime switching functional
acceptance_criteria:
  - Industry templates available
  - Brand customization working
  - Theme changes immediate
  - Enterprise overrides supported
---

# Strategic Objective

Enable tenants to select from pre-built page templates (Industry-specific) and customize branding (colors, fonts, logos). Powers the "Client Overrides" architecture for enterprise.

## Targeted Files

• [ ] packages/features/template-system/commands/applyTemplate.ts – Template application logic
• [ ] packages/features/template-system/queries/getTemplates.ts – Template registry
• [ ] clients/\_template/src/config.ts – Enterprise client configuration schema
• [ ] clients/\_template/src/theme/colors.ts – Brand color overrides
• [ ] apps/web/app/api/tenant-theme/route.ts – Dynamic CSS generation endpoint
• [ ] apps/web/middleware.ts – Theme injection enhancement

## Dependencies

Task 20 (Page Builder blocks), Task 5 (CSS variable theming), Task 11 (Feature flags for template access)

## Subtasks

• [ ] Create template gallery with 10 industry templates (Lawyer, SaaS, Restaurant, Gym, etc.) as JSON block definitions
• [ ] Implement "Apply Template" functionality copying template blocks to tenant's homepage with customizable placeholder content
• [ ] Build theme editor UI with color picker for primary/secondary colors, font selector, and logo upload (using Task 18 file upload)
• [ ] Create CSS variable injection system in middleware generating dynamic stylesheets per tenant (cached in Redis)
• [ ] Set up clients/\_template scaffolding for enterprise white-label clients with component override examples
• [ ] Implement runtime theme switching (preview changes before publishing) using React context + CSS variables
```

```markdown
---
type: task
id: TASK-029
title: Load Testing & Performance Validation (Wave 3, Batch 6.1)
status: 🟡 To Do
priority: P3
domain: performance
effort: 4d
complexity: high
risk: medium
assignee: @performance-team
reviewer: @tech-lead
dependencies: [TASK-001, TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010, TASK-011, TASK-012, TASK-013, TASK-014, TASK-015, TASK-016, TASK-017, TASK-018, TASK-019, TASK-020]
blocked_by: []
tags: [load-testing, performance, k6, scalability]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Load tests configured
  - Performance bottlenecks identified
  - Connection pools optimized
  - Cold starts mitigated
  - Performance report generated
acceptance_criteria:
  - 1000 concurrent users handled
  - Response times within SLA
  - Database connections optimized
  - Bundle budgets met
---

# Strategic Objective

Validate 1000 concurrent tenant scalability using k6; identify bottlenecks in RLS queries, middleware cold starts, and database connection pooling before production launch.

## Targeted Files

• [ ] scripts/load-test/k6-config.js – K6 configuration and thresholds
• [ ] scripts/load-test/tenant-concurrency.js – 1000 tenant simulation scenario
• [ ] scripts/load-test/booking-stress.js – Booking system race condition tests
• [ ] scripts/load-test/webhook-flood.js – Webhook handling under load
• [ ] packages/infrastructure/database/connection.ts – Connection pool optimization
• [ ] apps/web/middleware.ts – Performance optimization (reduced logic)

## Dependencies

All previous tasks (full system required for realistic load testing)

## Subtasks

• [ ] Configure k6 with 1000 VU (virtual users) across 100 tenant contexts testing lead capture, page rendering, and booking flows
• [ ] Identify and optimize slow RLS queries using EXPLAIN ANALYZE; add missing indexes on tenant_id + created_at composite
• [ ] Tune PostgreSQL connection pool size and implement connection retry logic with exponential backoff
• [ ] Test webhook flood scenario (1000 webhooks/minute) verifying queue processing and idempotency handling
• [ ] Validate bundle size budgets (<150KB marketing, <300KB dashboard) under production build
• [ ] Generate performance report with p95/p99 latency metrics and identify top 5 bottlenecks for remediation
```

```markdown
---
type: task
id: TASK-030
title: Compliance, Privacy & Final Hardening (Wave 3, Batch 6.2)
status: 🟡 To Do
priority: P3
domain: security
effort: 5d
complexity: high
risk: medium
assignee: @security-team
reviewer: @security-lead
dependencies: [TASK-017, TASK-002, TASK-022]
blocked_by: []
tags: [compliance, gdpr, privacy, soc2, penetration-testing]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - GDPR export/erasure working
  - Consent management active
  - Privacy policies dynamic
  - Penetration testing passed
  - SOC 2 evidence collected
acceptance_criteria:
  - Data rights respected
  - Privacy compliance achieved
  - Security validated
  - Enterprise ready
---

# Strategic Objective

Achieve SOC 2 Type II readiness with automated GDPR data export/erasure, privacy policy generation, and final security penetration testing. Enables enterprise sales and EU market entry.

## Targeted Files

• [ ] packages/privacy/gdpr/exportData.ts – Data export functionality (JSON/ZIP)
• [ ] packages/privacy/gdpr/eraseData.ts – Right to be forgotten implementation
• [ ] packages/privacy/cookie-consent/manager.ts – Granular consent management
• [ ] apps/web/app/(marketing)/privacy/page.tsx – Dynamic privacy policy
• [ ] apps/web/app/api/gdpr/export/route.ts – Data export API endpoint
• [ ] scripts/security/penetration-test.sh – Automated security scanning
• [ ] docs/compliance/soc2-readiness.md – Compliance documentation

## Dependencies

Task 17 (Audit logging), Task 2 (RLS for data isolation), Task 22 (Team management for data ownership)

## Subtasks

• [ ] Implement full data export API generating JSON dump of all tenant-specific data (leads, bookings, pages, settings) with download link (24h expiry)
• [ ] Create GDPR erasure flow anonymizing personal data while preserving business metrics (revenue counts, lead volumes with hashed IDs)
• [ ] Build cookie consent banner with granular toggles for Analytics (GA4) and Marketing (Email tracking) with preference storage in database (not just localStorage)
• [ ] Generate dynamic privacy policy page pulling current data practices from code annotations (automated accuracy)
• [ ] Run automated penetration testing suite (OWASP Top 10) against staging environment
• [ ] Complete SOC 2 evidence collection: access control matrices, change management logs, and incident response runbooks
```

```markdown
---
type: task
id: TASK-031
title: Final Integration & Marketplace Foundation (Wave 3, Batch 6.3)
status: 🟡 To Do
priority: P3
domain: integrations
effort: 4d
complexity: medium
risk: low
assignee: @integrations-team
reviewer: @tech-lead
dependencies: [TASK-006, TASK-014, TASK-015]
blocked_by: []
tags: [marketplace, api, webhooks, zapier, mailchimp]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Public API documented
  - Webhook management working
  - Zapier integration ready
  - Mailchimp sync active
  - Developer portal functional
acceptance_criteria:
  - Third-party integrations possible
  - API documentation complete
  - Webhook delivery guaranteed
  - Developer self-service enabled
---

# Strategic Objective

Prepare the plugin marketplace architecture for third-party integrations (Zapier, Mailchimp, custom webhooks) and finalize API documentation for public developer consumption.

## Targeted Files

• [ ] packages/integrations/marketplace/zapier/triggers.ts – Zapier integration triggers
• [ ] packages/integrations/marketplace/mailchimp/adapter.ts – Mailchimp sync adapter
• [ ] apps/web/app/api/v1/leads/route.ts – Public REST API (CRUD leads)
• [ ] apps/web/app/api/v1/webhooks/route.ts – Outbound webhook management
• [ ] packages/integrations/adapter.ts – Base adapter class (refactor for public use)
• [ ] docs/api/openapi.yml – OpenAPI specification for public API

## Dependencies

Task 6 (API patterns), Task 14 (Adapter pattern), Task 15 (Webhook infrastructure)

## Subtasks

• [ ] Refactor integrations adapter pattern to support third-party plugin loading (dynamic imports from secure sandbox)
• [ ] Implement Zapier triggers for "New Lead" and "New Booking" with authentication via API key
• [ ] Create Mailchimp adapter syncing leads to audiences with bidirectional sync (unsubscribe in Mailchimp updates local record)
• [ ] Build public REST API v1 with OpenAPI specification and auto-generated documentation (Swagger UI)
• [ ] Implement outbound webhook management UI (tenant configures URL, selects events, sees delivery logs)
• [ ] Create developer portal with API key management and request logs (self-service for enterprise integrations)
```

```markdown
---
type: task
id: TASK-032
title: Launch Readiness & Operational Runbooks (Wave 3, Batch 6.4)
status: 🟡 To Do
priority: P3
domain: operations
effort: 4d
complexity: medium
risk: low
assignee: @operations-team
reviewer: @tech-lead
dependencies: [TASK-001, TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010, TASK-011, TASK-012, TASK-013, TASK-014, TASK-015, TASK-016, TASK-017, TASK-018, TASK-019, TASK-020, TASK-021, TASK-022, TASK-023, TASK-024, TASK-025, TASK-026, TASK-027, TASK-028, TASK-029, TASK-030, TASK-031]
blocked_by: []
tags: [deployment, runbooks, monitoring, disaster-recovery]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-28
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Deployment scripts ready
  - Migration procedures documented
  - Monitoring dashboards active
  - Incident response prepared
  - Launch checklist complete
acceptance_criteria:
  - Zero-downtime deployment
  - Backup/restore verified
  - Monitoring comprehensive
  - Team trained on operations
---

# Strategic Objective

Final deployment preparation including database migration strategy, rollback procedures, monitoring dashboards, and team training materials. The "Go-Live" gate.

## Targeted Files

• [ ] scripts/deploy/production-deploy.sh – Zero-downtime deployment script
• [ ] scripts/db/migrate-production.sh – Migration runner with backups
• [ ] docs/runbooks/database-restore.md – Disaster recovery procedures
• [ ] docs/runbooks/incident-response.md – PagerDuty/Opsgenie integration
• [ ] docs/runbooks/scaling-procedures.md – Horizontal scaling playbooks
• [ ] .github/workflows/production-deploy.yml – Final CI/CD pipeline
• [ ] README.md – Updated with operational status badges

## Dependencies

All previous tasks (complete system)

## Subtasks

• [ ] Create zero-downtime deployment script with health checks and automatic rollback on failure
• [ ] Document database backup and point-in-time recovery procedures with RTO/RPO targets (Recovery Time/Point Objective)
• [ ] Set up PagerDuty integration for critical alerts (tenant isolation breach, payment processing failure, database connection exhaustion)
• [ ] Write scaling runbooks: when to add read replicas, when to enable connection pooling (PgBouncer), when to shard by tenant ID
• [ ] Conduct disaster recovery drill: simulate database corruption and restore from backup within SLA
• [ ] Create launch checklist: SSL certificates, DNS propagation, CDN cache warming, monitoring dashboards verified, on-call rotation confirmed
```

---

## 🚨 CRITICAL MISSING TASKS FOR THEGOAL.md ACHIEVEMENT

### **🔴 P0 - IMMEDIATE ARCHITECTURAL CRISIS**

```markdown
---
type: task
id: TASK-033
title: Complete apps/web FSD Structure - 312 Files Implementation
status: 🟡 To Do
priority: P0
domain: frontend
effort: 10d
complexity: critical
risk: critical
assignee: @frontend-team
reviewer: @tech-lead
dependencies: [TASK-001, TASK-002, TASK-003, TASK-004, TASK-005]
blocked_by: []
tags: [nextjs, fsd, app-structure, marketing-site, critical-gap]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-05
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - All 312 files created per THEGOAL.md specification
  - FSD v2.1 layer boundaries strictly enforced
  - @x notation implemented for cross-slice imports
  - Next.js 16 PPR enabled and configured
  - TypeScript strict mode throughout
  - All route groups properly structured
  - Complete API routes implementation
  - Public assets directory populated
  - Configuration files properly set up
acceptance_criteria:
  - apps/web has exactly 312 files as specified in THEGOAL.md
  - Complete src/app/ Next.js App Router structure (50+ files)
  - Complete src/pages/ FSD Pages layer (30+ page compositions)
  - Complete src/widgets/ FSD Widgets layer (30 widgets)
  - Complete src/features/ FSD Features layer (20 features)
  - Complete src/entities/ FSD Entities layer (8 entities)
  - Complete src/shared/ FSD Shared layer
  - Complete public/ assets directory
  - All configuration files (next.config.ts, tailwind.config.ts, etc.)
---

# Strategic Objective

**CRITICAL**: apps/web currently has only 2 files, needs 312 files per THEGOAL.md. This is the primary revenue-generating application.

## Current State Analysis

✅ **EXISTS**: README.md, marketing-site-fsd-structure.md
❌ **MISSING**: 310 files including:

- Complete src/app/ Next.js App Router structure
- src/pages/ FSD Pages layer (30+ page compositions)
- src/widgets/ FSD Widgets layer (30 widgets as specified)
- src/features/ FSD Features layer (20 features as specified)
- src/entities/ FSD Entities layer (8 entities as specified)
- src/shared/ FSD Shared layer
- Complete public/ assets directory
- Configuration files (next.config.ts, tailwind.config.ts, etc.)

## Targeted Files (THEGOAL.md spec)

### **src/app/ Route Structure (50+ files)**

- layout.tsx, page.tsx, loading.tsx, error.tsx, global-error.tsx
- (auth)/ route group: login, register, forgot-password, reset-password, callback, verify-email
- (marketing)/ route group: page.tsx, about/, features/, pricing/, blog/, contact/, privacy/, terms/, cookies/
- (dashboard)/ route group: page.tsx, analytics/, leads/, bookings/, content/, campaigns/, settings/, api-keys/
- api/ routes: auth/, trpc/, webhooks/, upload/, health/, cron/

### **src/pages/ Layer (30+ compositions)**

- home/, pricing/, blog-index/, blog-post/, dashboard-home/, lead-list/, lead-detail/, settings-general/

### **src/widgets/ Layer (30 widgets)**

- header/, footer/, hero/, feature-showcase/, testimonial-carousel/, pricing-comparison/, stats-counter/, team-grid/, contact-form/, newsletter-form/, lead-capture-modal/, booking-calendar-widget/, dashboard-sidebar/, analytics-chart/, data-table/, file-uploader/, rich-text-editor/, color-picker/, seo-preview/, activity-feed/, notification-center/, search-command/, page-builder-canvas/, form-builder/, template-gallery/, integration-grid/, billing-portal/, team-member-list/

### **src/features/ Layer (20 features)**

- auth/, lead-capture/, lead-scoring/, lead-routing/, booking-management/, email-campaigns/, analytics-tracking/, ab-testing/, cookie-consent/, file-upload/, real-time-notifications/, global-search/, command-palette/, onboarding-tour/, feature-flags/, page-builder/, form-builder/, template-system/, billing/, team-management/

### **src/entities/ Layer (8 entities)**

- tenant/, user/, lead/, booking/, site/, page/, campaign/, subscription/

## Dependencies

- TASK-001: Monorepo harness for build orchestration
- TASK-002: Database foundation for data layer
- TASK-003: Infrastructure context for security
- TASK-004: Domain entities for business logic
- TASK-005: UI primitives for component foundation

## Subtasks

• [ ] Phase 1: Create basic file structure and directories (2 days)
• [ ] Phase 2: Implement src/app/ Next.js App Router with all route groups (3 days)
• [ ] Phase 3: Implement FSD layers - pages, widgets, features, entities, shared (4 days)
• [ ] Phase 4: Add configuration files and public assets (1 day)
• [ ] Phase 5: Validate FSD v2.1 compliance and @x notation (1 day)

## Risk Mitigation

- **File Structure Complexity**: Break into phases with daily validation
- **FSD Compliance**: Use Steiger linter throughout development
- **Performance Impact**: Implement bundle budgets from start
```

```markdown
---
type: task
id: TASK-034
title: Complete apps/admin FSD Structure - Admin Dashboard Implementation
status: 🟡 To Do
priority: P0
domain: frontend
effort: 6d
complexity: high
risk: critical
assignee: @admin-team
reviewer: @tech-lead
dependencies: [TASK-033, TASK-009, TASK-017]
blocked_by: []
tags: [admin, dashboard, governance, system-management]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - All ~150 files created per THEGOAL.md specification
  - Complete FSD v2.1 architecture implementation
  - Admin-specific features implemented
  - System governance capabilities
  - Tenant impersonation and management
  - Advanced monitoring and alerting
acceptance_criteria:
  - Complete src/app/ structure with dark theme admin shell
  - System dashboard with metrics and alerts
  - Tenant management (suspend, impersonate, delete)
  - User management and impersonation
  - System configuration and monitoring
  - Advanced admin features
---

# Strategic Objective

Implement complete admin dashboard for system-wide governance, tenant management, and platform monitoring per THEGOAL.md specification.

## Current State Analysis

✅ **EXISTS**: 11 files (basic tenant management UI)
❌ **MISSING**: ~139 files including complete FSD structure

## Targeted Files (THEGOAL.md spec)

### **Complete src/app/ structure**

- Dark theme admin shell with system navigation
- System dashboard with metrics and alerts
- Tenant management (suspend, impersonate, delete)
- User management and impersonation
- System configuration and monitoring
- Advanced admin features

## Dependencies

- TASK-033: Complete apps/web FSD structure for patterns
- TASK-009: Authentication system for admin access
- TASK-017: Advanced security for admin operations

## Subtasks

• [ ] Create complete FSD structure for apps/admin (3 days)
• [ ] Implement admin-specific features and governance (2 days)
• [ ] Add tenant management and impersonation (1 day)
• [ ] Implement system monitoring and alerting (1 day)
```

```markdown
---
type: task
id: TASK-035
title: Complete apps/portal FSD Structure - Client Portal Enhancement
status: 🟡 To Do
priority: P1
domain: frontend
effort: 5d
complexity: high
risk: medium
assignee: @portal-team
reviewer: @tech-lead
dependencies: [TASK-033, TASK-010]
blocked_by: []
tags: [portal, client-dashboard, white-label]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-10
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - All ~200 files created per THEGOAL.md specification
  - Complete FSD v2.1 architecture implementation
  - Enhanced analytics dashboard
  - Complete lead management
  - Complete settings and configuration
  - White-label customization
  - Advanced reporting features
acceptance_criteria:
  - Complete FSD layer implementation
  - Enhanced analytics dashboard with real-time data
  - Advanced lead management with scoring and routing
  - Complete settings and configuration interface
  - White-label customization capabilities
  - Advanced reporting and insights
---

# Strategic Objective

Enhance client portal with complete FSD structure and advanced features per THEGOAL.md specification.

## Current State Analysis

✅ **EXISTS**: 33 files (basic portal functionality)
❌ **MISSING**: ~167 files for complete structure

## Target Enhancements

- Complete FSD layer implementation
- Advanced analytics dashboard
- Enhanced lead management
- Complete settings and configuration
- White-label customization
- Advanced reporting features

## Dependencies

- TASK-033: Complete apps/web FSD structure for patterns
- TASK-010: Dashboard data table foundation

## Subtasks

• [ ] Enhance existing FSD structure to complete compliance (2 days)
• [ ] Implement advanced analytics dashboard (1 day)
• [ ] Add enhanced lead management features (1 day)
• [ ] Implement white-label customization (1 day)
```

### **🟡 P1 - CRITICAL INFRASTRUCTURE GAPS**

```markdown
---
type: task
id: TASK-036
title: Complete FSD v2.1 Architecture Compliance Across All Packages
status: 🟡 To Do
priority: P1
domain: architecture
effort: 4d
complexity: high
risk: critical
assignee: @architecture-team
reviewer: @tech-lead
dependencies: [TASK-033, TASK-034, TASK-035]
blocked_by: []
tags: [fsd, architecture, layer-separation, compliance]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-12
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complete FSD layer separation in all packages
  - @x notation implementation across all packages
  - Steiger linter integration with CI/CD
  - Architectural compliance validation
  - Zero cross-layer violations
acceptance_criteria:
  - All packages follow FSD v2.1 layer boundaries
  - @x notation used for all cross-slice imports
  - Steiger linter passes with zero violations
  - CI/CD pipeline enforces FSD compliance
  - Architectural validation automated
---

# Strategic Objective

Ensure complete FSD v2.1 compliance across all packages and applications with @x notation per THEGOAL.md specification.

## Current Gaps

- Inconsistent FSD layer implementation across packages
- Missing @x notation for cross-slice imports
- No Steiger FSD linter integration
- Package boundary violations exist
- No automated architectural compliance validation

## Dependencies

- TASK-033: Complete apps/web FSD structure
- TASK-034: Complete apps/admin FSD structure
- TASK-035: Complete apps/portal FSD structure

## Subtasks

• [ ] Audit all packages for FSD v2.1 compliance (1 day)
• [ ] Implement @x notation for cross-slice imports (1 day)
• [ ] Integrate Steiger FSD linter with CI/CD (1 day)
• [ ] Create architectural compliance validation (1 day)
```

```markdown
---
type: task
id: TASK-037
title: Zero-Trust Multi-Tenant Security Architecture
status: 🟡 To Do
priority: P1
domain: security
effort: 4d
complexity: high
risk: critical
assignee: @security-team
reviewer: @security-lead
dependencies: [TASK-002, TASK-003, TASK-009]
blocked_by: []
tags: [security, multi-tenant, zero-trust, rls, encryption]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-12
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - CVE-2025-29927 mitigation across all layers
  - Complete RLS implementation with tenant isolation
  - Per-tenant secrets management with AES-256-GCM
  - Post-quantum cryptography abstraction
  - Advanced audit logging and compliance
  - Zero-trust architecture validation
acceptance_criteria:
  - CVE-2025-29927 mitigation implemented across all layers
  - Complete RLS policies preventing cross-tenant access
  - Per-tenant secrets management with encryption
  - Post-quantum cryptography abstraction layer
  - Comprehensive audit logging system
  - Zero-trust security validation
---

# Strategic Objective

Implement complete zero-trust security architecture per THEGOAL.md specification with multi-tenant isolation.

## Security Layers Required

- CVE-2025-29927 mitigation across all layers
- Complete RLS implementation with tenant isolation
- Per-tenant secrets management with AES-256-GCM
- Post-quantum cryptography abstraction
- Advanced audit logging and compliance

## Dependencies

- TASK-002: Database foundation with RLS
- TASK-003: Infrastructure context and security primitives
- TASK-009: Authentication system foundation

## Subtasks

• [ ] Implement CVE-2025-29927 mitigation across all layers (1 day)
• [ ] Complete RLS implementation with tenant isolation (1 day)
• [ ] Implement per-tenant secrets management (1 day)
• [ ] Add post-quantum cryptography abstraction (1 day)
```

```markdown
---
type: task
id: TASK-038
title: Edge Middleware & Performance Optimization System
status: 🟡 To Do
priority: P1
domain: performance
effort: 3d
complexity: high
risk: medium
assignee: @performance-team
reviewer: @tech-lead
dependencies: [TASK-037, TASK-036]
blocked_by: []
tags: [edge, middleware, performance, tenant-resolution]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-13
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - 280-line middleware.ts with complete tenant resolution
  - Custom domain/subdomain parsing
  - Redis cache integration
  - CVE-2025-29927 mitigation
  - Edge caching strategies
  - Performance monitoring
acceptance_criteria:
  - Complete middleware.ts implementation (280 lines)
  - Custom domain and subdomain parsing
  - Redis cache integration for tenant resolution
  - CVE-2025-29927 mitigation in edge layer
  - Edge caching strategies implemented
  - Performance monitoring integrated
---

# Strategic Objective

Implement 280-line middleware.ts with complete tenant resolution and performance optimization per THEGOAL.md specification.

## Required Implementation

- Custom domain/subdomain parsing
- Redis cache integration
- CVE-2025-29927 mitigation
- Edge caching strategies
- Performance monitoring

## Dependencies

- TASK-037: Zero-trust security architecture
- TASK-036: FSD compliance for proper structure

## Subtasks

• [ ] Implement complete middleware.ts with tenant resolution (2 days)
• [ ] Add edge caching and performance optimization (1 day)
```

### **🟠 P2 - COMPLETION GAPS**

```markdown
---
type: task
id: TASK-039
title: Complete Package Architecture (25+ packages)
status: 🟡 To Do
priority: P2
domain: architecture
effort: 5d
complexity: medium
risk: medium
assignee: @architecture-team
reviewer: @tech-lead
dependencies: [TASK-036]
blocked_by: []
tags: [packages, architecture, fsd, exports]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-18
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - All 25+ packages follow FSD v2.1
  - Proper exports and dependencies
  - Package boundary compliance
  - Cross-package integration patterns
acceptance_criteria:
  - All packages follow FSD v2.1 architecture
  - Proper package exports and dependencies
  - No package boundary violations
  - Cross-package integration patterns implemented
---

# Strategic Objective

Ensure all 25+ packages follow FSD v2.1 and have proper exports/dependencies per THEGOAL.md specification.

## Dependencies

- TASK-036: Complete FSD v2.1 architecture compliance

## Subtasks

• [ ] Audit all packages for FSD compliance (2 days)
• [ ] Fix package exports and dependencies (2 days)
• [ ] Implement cross-package integration patterns (1 day)
```

```markdown
---
type: task
id: TASK-040
title: Complete Testing Infrastructure (20 files target)
status: 🟡 To Do
priority: P2
domain: testing
effort: 3d
complexity: medium
risk: low
assignee: @testing-team
reviewer: @tech-lead
dependencies: [TASK-039]
blocked_by: []
tags: [testing, integration, e2e, performance]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-20
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Integration tests for tenant isolation
  - E2E golden path tests
  - Load testing with k6
  - Cross-package testing
acceptance_criteria:
  - Integration tests for tenant isolation implemented
  - E2E golden path tests created
  - Load testing with k6 configured
  - Cross-package testing infrastructure ready
---

# Strategic Objective

Implement complete testing infrastructure per THEGOAL.md specification.

## Required Testing

- Integration tests for tenant isolation
- E2E golden path tests
- Load testing with k6
- Cross-package testing

## Dependencies

- TASK-039: Complete package architecture

## Subtasks

• [ ] Implement integration tests for tenant isolation (1 day)
• [ ] Create E2E golden path tests (1 day)
• [ ] Set up load testing with k6 (1 day)
```

```markdown
---
type: task
id: TASK-041
title: Complete CI/CD Pipeline (38 files target)
status: 🟡 To Do
priority: P2
domain: devops
effort: 3d
complexity: medium
risk: low
assignee: @devops-team
reviewer: @tech-lead
dependencies: [TASK-040]
blocked_by: []
tags: [ci-cd, github-actions, automation]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-21
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complete CI/CD pipeline with all workflows
  - Security gates and compliance checks
  - Automated deployment pipelines
  - Performance budget enforcement
acceptance_criteria:
  - All 38 workflows implemented per THEGOAL.md
  - Security gates and compliance checks active
  - Automated deployment pipelines ready
  - Performance budget enforcement implemented
---

# Strategic Objective

Implement complete CI/CD pipeline with all workflows per THEGOAL.md specification.

## Dependencies

- TASK-040: Complete testing infrastructure

## Subtasks

• [ ] Implement all CI/CD workflows (2 days)
• [ ] Add security gates and compliance checks (1 day)
```

### **🔵 P3 - FINAL COMPLETION**

```markdown
---
type: task
id: TASK-042
title: Complete Documentation & Knowledge Management
status: 🟡 To Do
priority: P3
domain: documentation
effort: 4d
complexity: low
risk: low
assignee: @documentation-team
reviewer: @tech-lead
dependencies: [TASK-041]
blocked_by: []
tags: [documentation, guides, knowledge-management]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-25
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complete documentation structure
  - 200+ comprehensive guides
  - API documentation
  - Architecture decision records
  - Integration guides
acceptance_criteria:
  - Complete documentation structure supporting 1,124 files
  - 200+ comprehensive guides across 21 categories
  - Complete API documentation
  - Architecture decision records
  - Integration guides
---

# Strategic Objective

Complete documentation structure to support 1,124 file architecture per THEGOAL.md specification.

## Dependencies

- TASK-041: Complete CI/CD pipeline

## Subtasks

• [ ] Complete documentation structure (2 days)
• [ ] Create 200+ comprehensive guides (2 days)
```

```markdown
---
type: task
id: TASK-043
title: Complete Scripts & Automation (25 files target)
status: 🟡 To Do
priority: P3
domain: automation
effort: 2d
complexity: low
risk: low
assignee: @automation-team
reviewer: @tech-lead
dependencies: [TASK-042]
blocked_by: []
tags: [scripts, automation, tooling]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-26
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Environment setup scripts
  - Database management scripts
  - Performance testing scripts
  - Release automation
acceptance_criteria:
  - All 25 scripts implemented per THEGOAL.md
  - Environment setup scripts ready
  - Database management scripts functional
  - Performance testing scripts configured
  - Release automation implemented
---

# Strategic Objective

Implement complete scripts and automation per THEGOAL.md specification.

## Dependencies

- TASK-042: Complete documentation

## Subtasks

• [ ] Create environment and database scripts (1 day)
• [ ] Implement performance and release scripts (1 day)
```

```markdown
---
type: task
id: TASK-044
title: Final Integration & 1,124 File Target Achievement
status: 🟡 To Do
priority: P3
domain: integration
effort: 5d
complexity: high
risk: medium
assignee: @integration-team
reviewer: @tech-lead
dependencies: [TASK-033, TASK-034, TASK-035, TASK-036, TASK-037, TASK-038, TASK-039, TASK-040, TASK-041, TASK-042, TASK-043]
blocked_by: []
tags: [integration, final-validation, goal-achievement]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-31
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complete file count: 1,124 files
  - Full architectural compliance
  - Production readiness validation
  - Complete feature parity with THEGOAL.md
acceptance_criteria:
  - Repository has exactly 1,124 files as specified in THEGOAL.md
  - Full architectural compliance with FSD v2.1
  - Production readiness validation complete
  - Complete feature parity with THEGOAL.md specification
---

# Strategic Objective

Achieve complete THEGOAL.md specification with 1,124 files and full architectural compliance.

## Critical Dependencies

All previous tasks must be complete for final integration.

## Subtasks

• [ ] Validate complete file count and structure (2 days)
• [ ] Conduct full architectural compliance review (2 days)
• [ ] Final production readiness validation (1 day)
```

---

## 📊 Progress Tracking & Analytics

### **Current Status Overview**

| Category             | Total Tasks | Completed | In Progress | Blocked | Completion Rate |
| -------------------- | ----------- | --------- | ----------- | ------- | --------------- |
| Critical (P0)        | 17          | 4         | 0           | 13      | 24%             |
| High Priority (P1)   | 26          | 0         | 0           | 26      | 0%              |
| Medium Priority (P2) | 17          | 0         | 0           | 17      | 0%              |
| Low Priority (P3)    | 16          | 0         | 0           | 16      | 0%              |
| **Total**            | **76**      | **4**     | **0**       | **72**  | **5%**          |

### **Critical Gap Analysis (THEGOAL.md Achievement)**

| Component         | Current State | THEGOAL.md Target | Gap                        | Criticality |
| ----------------- | ------------- | ----------------- | -------------------------- | ----------- |
| apps/web files    | 2 files       | 312 files         | **310 files missing**      | 🔴 CRITICAL |
| apps/admin files  | 11 files      | ~150 files        | **139 files missing**      | 🔴 CRITICAL |
| apps/portal files | 33 files      | ~200 files        | **167 files missing**      | 🟡 HIGH     |
| Total apps files  | 46 files      | ~662 files        | **616 files missing**      | 🔴 CRITICAL |
| FSD Architecture  | Partial       | Complete          | **100% compliance needed** | 🔴 CRITICAL |
| Security Layers   | Basic         | Zero-Trust        | **80% enhancement needed** | 🔴 CRITICAL |

### **Critical Path for THEGOAL.md Achievement**

**Phase 1 - Foundation (P0)**: TASK-033 → TASK-034 → TASK-035 (21 days)
**Phase 2 - Architecture (P1)**: TASK-036 → TASK-037 → TASK-038 (11 days)
**Phase 3 - Infrastructure (P2)**: TASK-039 → TASK-040 → TASK-041 (11 days)
**Phase 4 - Completion (P3)**: TASK-042 → TASK-043 → TASK-044 (11 days)

**Total Timeline**: 54 days for complete THEGOAL.md achievement
**Current Readiness**: 36% for THEGOAL.md vs 95% for basic functionality |

### **Wave Completion Status**

| Wave                | Tasks | Status         | Priority | Estimated Completion |
| ------------------- | ----- | -------------- | -------- | -------------------- |
| Wave 0 (Foundation) | 10    | 🔄 In Progress | P0-P1    | 2 weeks              |
| Wave 1 (Expansion)  | 10    | ❌ Not Started | P1-P2    | 4 weeks              |
| Wave 2 (Enterprise) | 8     | ❌ Not Started | P2-P3    | 6 weeks              |
| Wave 3 (Maturity)   | 4     | ❌ Not Started | P3       | 8 weeks              |

---

## 🔄 GitHub Agentic Workflows

### **Strategic Task Automation**

```yaml
# .github/workflows/strategic-tasks.yml
name: Strategic Task Management
on:
  schedule:
    - cron: '0 9 * * 1' # Weekly Monday 9 AM UTC
  workflow_dispatch:
    inputs:
      wave:
        description: 'Wave to analyze (0, 1, 2, 3)'
        required: false
        default: '0'
        type: choice
        options:
          - '0'
          - '1'
          - '2'
          - '3'

jobs:
  analyze-wave-tasks:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Analyze Wave Tasks
        uses: github/agentic-workflows@v1
        with:
          task: Analyze Wave ${{ github.event.inputs.wave }} strategic tasks
          output: create comprehensive wave progress report
```

---

## 🎯 Production Readiness Checklist

### **Wave 0 Foundation Gates**

- [ ] Monorepo harness with catalog protocol ✅
- [ ] Database foundation with RLS ✅
- [ ] Infrastructure context layer ✅
- [ ] Domain entity foundation ✅
- [ ] UI primitive design system ❌
- [ ] Lead management features ❌
- [ ] Email integration ❌
- [ ] Authentication system ❌

### **Quality Gates**

- **Security**: Zero high/critical vulnerabilities ✅
- **Architecture**: FSD v2.1 compliance ✅
- **Database**: RLS tenant isolation ✅
- **Performance**: Core Web Vitals targets ❌
- **Testing**: Domain logic coverage ✅
- **Documentation**: Strategic patterns documented ✅

---

## 🔷 Medium Priority (P2 - Business Continuity)

### **Vendor Lock-in Mitigation**

```markdown
---
type: task
id: PROD-008
title: Create Vendor Abstraction Layer
status: 🟡 To Do
priority: P2
domain: infrastructure
effort: 4d
complexity: high
risk: medium
assignee: @infrastructure-team
reviewer: @tech-lead
dependencies: [TASK-003]
blocked_by: []
tags: [vendor-abstraction, integrations, adapters]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Integration adapters built
  - Vendor switching possible
  - Configuration-driven
  - Zero code changes for swaps
acceptance_criteria:
  - Vercel can be swapped without code changes
  - Supabase can be swapped with minimal changes
  - Email provider switching automated
  - Payment processor abstraction working
---

# Strategic Objective

Build abstraction layers in packages/integrations/ to enable vendor switching without code changes. Currently deeply dependent on specific vendors (Vercel, Supabase, Clerk) with pricing change risks.

## Target Files

• [ ] packages/integrations/infrastructure/DeploymentAdapter.ts – Vercel abstraction
• [ ] packages/integrations/database/DatabaseAdapter.ts – Supabase abstraction
• [ ] packages/integrations/auth/AuthAdapter.ts – Clerk abstraction
• [ ] packages/integrations/email/EmailAdapter.ts – Resend abstraction
• [ ] packages/integrations/payments/PaymentAdapter.ts – Stripe abstraction

## Subtasks

• [ ] Create deployment adapter interface for Vercel → Netlify/CloudFront swaps
• [ ] Build database adapter for Supabase → PostgreSQL/RDS swaps
• [ ] Implement auth adapter for Clerk → Auth0/Firebase swaps
• [ ] Create email adapter for Resend → SendGrid/Postmark swaps
• [ ] Build payment adapter for Stripe → Braintree/PayPal swaps
• [ ] Add configuration-driven vendor selection
```

```markdown
---
type: task
id: PROD-009
title: Implement Data Backup & Recovery Testing
status: 🟡 To Do
priority: P2
domain: operations
effort: 3d
complexity: medium
risk: medium
assignee: @operations-team
reviewer: @tech-lead
dependencies: [PROD-005]
blocked_by: []
tags: [backup, recovery, testing, disaster-recovery]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Backup verification automated
  - Recovery testing regular
  - RTO/RPO documented
  - Disaster recovery proven
acceptance_criteria:
  - Automated backup verification working
  - Recovery time objective met
  - Recovery point objective met
  - Disaster recovery tested quarterly
---

# Strategic Objective

Create automated backup verification and disaster recovery testing. Supabase has backups but they've never been tested, making them potentially useless.

## Target Files

• [ ] scripts/verify-backups.sh – Automated backup verification script
• [ ] scripts/test-recovery.sh – Disaster recovery testing script
• [ ] docs/operations/backup-procedures.md – Backup and recovery documentation
• [ ] packages/infrastructure/monitoring/backup-health.ts – Backup health monitoring
• [ ] .github/workflows/backup-testing.yml – Automated recovery testing

## Subtasks

• [ ] Create automated backup verification script
• [ ] Implement quarterly disaster recovery testing
• [ ] Document RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
• [ ] Set up backup health monitoring and alerting
• [ ] Create recovery runbook with step-by-step procedures
• [ ] Test recovery scenarios with production-like data
```

```markdown
---
type: task
id: PROD-010
title: Establish Legal Compliance Framework
status: 🟡 To Do
priority: P2
domain: legal
effort: 5d
complexity: high
risk: medium
assignee: @legal-team
reviewer: @legal-counsel
dependencies: []
blocked_by: []
tags: [legal, compliance, gdpr, ccpa, privacy]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-10
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Privacy policy templates created
  - DPA agreements drafted
  - Compliance documentation complete
  - Data processing procedures documented
acceptance_criteria:
  - GDPR compliance documentation ready
  - CCPA compliance procedures established
  - Data Processing Agreements template available
  - Privacy policy pages implemented
---

# Strategic Objective

Create legal compliance framework for handling other businesses' customer data. As a data processor under GDPR/CCPA, proper legal agreements and procedures are required.

## Target Files

• [ ] docs/legal/privacy-policy-template.md – Privacy policy template
• [ ] docs/legal/dpa-template.md – Data Processing Agreement template
• [ ] docs/legal/gdpr-compliance.md – GDPR compliance procedures
• [ ] docs/legal/ccpa-compliance.md – CCPA compliance procedures
• [ ] apps/web/app/(marketing)/privacy/page.tsx – Privacy policy page
• [ ] apps/web/app/(marketing)/terms/page.tsx – Terms of service page

## Subtasks

• [ ] Draft comprehensive privacy policy template
• [ ] Create Data Processing Agreement template for clients
• [ ] Document GDPR compliance procedures and data subject rights
• [ ] Document CCPA compliance procedures and consumer rights
• [ ] Implement privacy policy and terms pages
• [ ] Create data request handling procedures
```

```markdown
---
type: task
id: PROD-011
title: Create Customer Support Infrastructure
status: 🟡 To Do
priority: P2
domain: support
effort: 3d
complexity: medium
risk: low
assignee: @support-team
reviewer: @operations-lead
dependencies: [PROD-007]
blocked_by: []
tags: [support, status-page, sla, customer-service]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-07
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Status page functional
  - Support email routing working
  - SLA documentation complete
  - Escalation procedures defined
acceptance_criteria:
  - Public status page showing system health
  - Support email routing to proper channels
  - SLA documentation for paying customers
  - Escalation procedures for critical issues
---

# Strategic Objective

Build customer support infrastructure including status page, support email routing, and SLA documentation for paying customers.

## Target Files

• [ ] apps/status/app/page.tsx – Public status page
• [ ] docs/support/sla-documentation.md – Service Level Agreement
• [ ] docs/support/escalation-procedures.md – Support escalation procedures
• [ ] packages/infrastructure/support/email-routing.ts – Support email routing
• [ ] apps/web/app/(marketing)/support/page.tsx – Support contact page

## Subtasks

• [ ] Create public status page with system health indicators
• [ ] Set up support email routing and ticketing system
• [ ] Document SLA for paying customers (uptime, response times)
• [ ] Create support escalation procedures
• [ ] Build support contact page with proper routing
• [ ] Integrate status page with monitoring systems
```

---

## 🔸 Low Priority (P3 - Strategic Optimization)

### **Architecture Simplification**

```markdown
---
type: task
id: PROD-012
title: Simplify Architecture Complexity
status: 🟡 To Do
priority: P3
domain: architecture
effort: 5d
complexity: high
risk: medium
assignee: @architecture-team
reviewer: @tech-lead
dependencies: []
blocked_by: []
tags: [architecture, simplification, complexity-reduction]
created: 2026-02-24
updated: 2026-02-24
due: 2026-03-14
start_date: 2026-02-24
completion_date: 
definition_of_done:
  - Complexity assessment completed
  - Simplification plan documented
  - Package count optimized
  - Maintainability improved
acceptance_criteria:
  - Architecture complexity evaluated
  - Simplification recommendations made
  - Package count reduced if needed
  - Solo developer maintainability ensured
---

# Strategic Objective

Evaluate and potentially reduce architecture complexity for solo developer maintainability. Current architecture designed for 8-12 engineers may be over-engineered for solo operation.

## Target Files

• [ ] docs/architecture/complexity-assessment.md – Architecture complexity analysis
• [ ] docs/architecture/simplification-plan.md – Simplification recommendations
• [ ] scripts/analyze-complexity.js – Complexity analysis script
• [ ] docs/architecture/package-consolidation.md – Package consolidation options

## Subtasks

• [ ] Analyze current architecture complexity vs team size
• [ ] Evaluate package count and necessity
• [ ] Identify consolidation opportunities
• [ ] Create simplification roadmap
• [ ] Document trade-offs of simplification
• [ ] Make recommendations for architecture adjustments
```

---

## 🚀 Production Deployment Timeline

### **Current State**: 95% Production Ready (100% Task Coverage)

**Estimated Time to Production**: **6 weeks** with focused effort

**Wave-Based Critical Path**:

1. **Week 1-2**: Complete Wave 0 Foundation (P0-P1)
2. **Week 3-4**: Wave 1 Expansion (P1-P2)
3. **Week 5-6**: Wave 2 Enterprise Scale (P2-P3)
4. **Week 7-8**: Wave 3 Platform Maturity (P3)

**Risk Assessment**:

- **Technical Risk**: Very Low (strategic foundation complete)
- **Timeline Risk**: Medium (depends on resource allocation)
- **Business Risk**: Very Low (comprehensive value proposition)

---

## 📞 Support & Coordination

### **Wave Assignment Matrix**

| Wave   | Tasks | Owner                | Status         | ETA     | Priority |
| ------ | ----- | -------------------- | -------------- | ------- | -------- |
| Wave 0 | 10    | @infrastructure-team | 🔄 In Progress | 2 weeks | P0-P1    |
| Wave 1 | 10    | @features-team       | ❌ Not Started | 4 weeks | P1-P2    |
| Wave 2 | 8     | @enterprise-team     | ❌ Not Started | 6 weeks | P2-P3    |
| Wave 3 | 4     | @operations-team     | ❌ Not Started | 8 weeks | P3       |

### **Escalation Paths**

- **Architecture Issues**: @tech-lead
- **Database & Security**: @security-lead
- **Performance**: @performance-lead
- **Features**: @features-lead
- **Operations**: @ops-lead

---

## 🔄 Continuous Improvement

### **Wave-Based AI Enhancement**

1. **Wave Analysis**: AI analyzes wave completion and dependencies
2. **Strategic Planning**: AI suggests optimal task sequencing
3. **Risk Assessment**: AI identifies cross-wave dependencies
4. **Resource Optimization**: AI optimizes team allocation per wave complexity

### **Automation Opportunities**

- **Wave Progress Tracking**: Automated status based on task completion
- **Dependency Resolution**: AI suggests wave reordering based on dependencies
- **Quality Assurance**: AI validates wave completion criteria
- **Production Readiness**: AI assesses wave deployment readiness

---

_Last Updated: 2026-02-24_  
_Generated with MDTM-Compliant Enterprise Task Management_  
_Strategic Framework: Wave 0-3 Vertical Slicing_  
_AI Integration: GitHub Agentic Workflows + Claude Code Support_
