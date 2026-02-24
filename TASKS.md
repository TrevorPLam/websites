Strategic Implementation Roadmap: Wave 0 Vertical Slicing
Reasoning: Based on the manifest, I have resequenced to prioritize Infrastructure Bedrock over Business Logic. The 1,124-file scope requires that FSD v2.1 enforcement (Steiger), Catalog Protocol dependency management, and RLS (Row Level Security) policies exist before any feature code. I have inserted explicit Batch identifiers (Wave.Batch notation) to support the automation scripting requested, and added Security Hardening (CVE-2025-29927 mitigation) as a explicit deliverable given the manifest's emphasis on zero-trust architecture. The sequencing follows: Tooling → Data Isolation → Domain Rules → Presentation → Integration → Protection.
**[x] Task 1: Initialize Monorepo Harness & Build Orchestration (Wave 0, Batch 0.1)**
Strategic Objective: Establish the "Factory Floor"—architectural enforcement, dependency management via Catalog Protocol, and CI/CD gates must exist before business logic to prevent FSD drift and version fragmentation across 15 packages.
Targeted Files:
• [x] pnpm-workspace.yaml – Define workspaces, catalog versions (Next.js 16.1.5, React 19), and onlyBuiltDependencies for security
• [x] turbo.json – Configure topological build pipeline with remote caching and //# root script references
• [x] steiger.config.ts – FSD v2.1 linter configuration with @x cross-import notation rules
• [x] tooling/eslint/rules/fsd-boundaries.js – Custom ESLint rule preventing cross-layer imports (entities → widgets)
• [x] tooling/fsd-cli/src/commands/create-slice.ts – Scaffolding automation for consistent slice generation
• [x] package.json – Root scripts using catalog: protocol references
Relevant Context Files:
• [x] Manifest: Root configuration files (.npmrc strict mode, .nvmrc v20.11.0)
• [x] Manifest: tooling/fsd-cli/ templates (component.tsx.hbs, feature.ts.hbs)
Dependencies: None (Ground Zero)
Advanced Code Patterns:
• Catalog Protocol Versioning: Centralize dependency versions in pnpm-workspace.yaml catalog, consume via "next": "catalog:" in package.json to enforce consistency across apps/web, apps/admin, and 15 packages
• Turborepo Scoped Builds: Configure pipeline.build.inputs with "TURBO*DEFAULT", ".env" and outputs with [".next/", "!.next/cache/"] for cache granularity
• FSD Steiger Enforcement: Configure exclude: ['.config.', '/node_modules/'] and custom rules to enforce that widgets/ cannot import from features/ directly (must use public API)
Sub-tasks:
• [x] Configure pnpm workspace with catalog versions (Next 16.1.5, React 19, TypeScript 5.9.3) and strict hoisting rules
• [x] Set up Turborepo remote caching with TURBO_REMOTE_CACHE_SIGNATURE_KEY environment validation
• [x] Initialize Steiger FSD linter with rules for @x notation and layer boundaries
• [x] Create FSD CLI scaffolding templates for create-slice command with proper segment generation (ui/, api/, model/, lib/)
• [x] Configure syncpack for dependency alignment across workspace packages
**[x] Task 2: Database Foundation with Tenant Isolation & RLS (Wave 0, Batch 0.2)**
Strategic Objective: Establish the multi-tenant data layer with Row Level Security policies before application code. The manifest identifies RLS as "Critical P0" for tenant isolation—this must be immutable before Wave 1.
Targeted Files:
• [x] database/migrations/00000000000000_init.sql – Extensions (uuid-ossp), base schemas
• [x] database/migrations/20240101000000_tenants.sql – Tenant table with slug, custom_domain, settings JSONB
• [x] database/migrations/20240103000000_leads.sql – Lead table with tenant_id FK and RLS policies
• [x] database/migrations/20240113000000_rls_policies.sql – Centralized RLS policy definitions using current_setting('app.current_tenant')
• [x] database/policies/tenant_isolation.md – Documentation of 3-layer defense strategy
• [x] packages/infrastructure/database/server.ts – PostgREST client with RLS context injection
• [x] packages/infrastructure/database/types.ts – Generated TypeScript types from Supabase schema
Relevant Context Files:
• [ ] Manifest: database/migrations/ (25 SQL files referenced)
• [ ] Manifest: packages/infrastructure/database/ (RLS helpers, connection pooling)
Dependencies: Task 1 (TypeScript configuration required for type generation)
Advanced Code Patterns:
• Expand/Contract Migration Strategy: Initial migration creates tenant_id UUID columns with NOT NULL constraints; subsequent migrations use CREATE POLICY tenant_isolation ON leads USING (tenant_id = current_setting('app.current_tenant')::UUID) with ALTER TABLE ENABLE ROW LEVEL SECURITY
• Request Context Propagation: Node.js AsyncLocalStorage in packages/infrastructure/context/tenant-context.ts sets tenant ID per HTTP request; database client automatically applies set_config('app.current_tenant', tenantId, true) before queries
• RLS Testing Harness: tests/integration/rls-bypass.spec.ts attempts cross-tenant SELECT operations and asserts zero-row returns with expect(results).toHaveLength(0) to prevent isolation breaches
Sub-tasks:
• [x] Create tenants table with id (UUID PK), slug (unique), custom_domain (unique), settings (JSONB), created_at
• [x] Create leads table with id, tenant_id (FK), email, name, source, status, metadata (JSONB), created_at with RLS enabled
• [x] Write RLS policies: tenant_access_policy using USING (tenant_id = current_setting('app.current_tenant')::UUID) and WITH CHECK constraints
• [x] Generate TypeScript database types using Supabase CLI into packages/infrastructure/database/types.ts
• [x] Create tests/integration/tenant-isolation.spec.ts with test cases for cross-tenant data access attempts (must fail)
**[x] Task 3: Infrastructure Context Layer & Security Primitives (Wave 0, Batch 0.3)**
Strategic Objective: Build the "plumbing" that carries tenant identity, request tracing, and encryption capabilities through the stack without explicit parameter passing. Implements AES-256-GCM encryption for per-tenant secrets as specified in manifest security architecture.
Targeted Files:
• [x] packages/infrastructure/context/tenant-context.ts – AsyncLocalStorage wrapper for implicit tenant propagation
• [x] packages/infrastructure/context/request-context.ts – Request ID generation for distributed tracing
• [x] packages/infrastructure/security/encryption.ts – AES-256-GCM implementation for CRM API keys and secrets
• [x] packages/infrastructure/security/audit-logger.ts – Structured audit trail for tenant-scoped actions
• [x] packages/infrastructure/cache/redis.ts – Upstash Redis client with tenant-aware key prefixing (tenant:{id}:*)
• [x] packages/infrastructure/security/csp.ts – CSP nonce generation for middleware injection
Relevant Context Files:
• [ ] Manifest: packages/infrastructure/context/ (AsyncLocalStorage pattern)
• [ ] Manifest: packages/infrastructure/security/ (encryption, audit logging)
• [ ] Manifest: apps/web/middleware.ts (security headers, CVE-2025-29927 mitigation)
Dependencies: Task 2 (Tenant types required for context typing)
Advanced Code Patterns:
• AsyncLocalStorage as Implicit Context: Store tenantId, requestId, and userId in ALS at middleware entry; access anywhere via getTenantContext() without prop drilling through 10+ layers
• Repository Pattern with Context Injection: Database clients automatically append RLS context by reading from ALS, ensuring zero chance of developer forgetting to filter by tenant
• AES-256-GCM with Per-Tenant Keys: Derive encryption keys via HKDF(masterKey, tenantId, 'aes-256-gcm'); store initialization vectors alongside ciphertext; cache decrypted keys in Redis with 5-minute TTL to prevent key derivation overhead
Sub-tasks:
• [x] Implement TenantContext class using Node.js AsyncLocalStorage with run() method for context isolation
• [x] Create withTenant(tenantId, callback) helper that wraps execution contexts and guarantees cleanup
• [x] Implement encryption utilities using Node.js crypto module (AES-256-GCM) for storing sensitive integration credentials
• [ ] Configure Redis client with automatic key namespacing (tenant:${tenantId}:cache*key) to prevent cache leakage
• [x] Create generateCSPNonce() utility for Content Security Policy headers with strict-dynamic support
**[x] Task 4: Domain Entity Foundation & Value Objects (Wave 0, Batch 1.1)**
Strategic Objective: Define immutable business rules for Leads and Tenants using rich domain models in packages/core (zero external dependencies per manifest). Establishes the Result/Option pattern for functional error handling.
Targeted Files:
• [x] packages/core/shared/Result.ts – Either monad implementation (Result<T, E>) for explicit error handling
• [x] packages/core/shared/Option.ts – Maybe type for nullable handling
• [x] packages/core/entities/tenant/Tenant.ts – Entity class with domain behavior
• [x] packages/core/entities/lead/Lead.ts – Lead entity with state machine (captured → qualified → converted)
• [x] packages/core/value-objects/Email.ts – Value object with RFC 5322 validation
• [x] packages/core/value-objects/TenantId.ts – Branded UUID type
• [x] packages/core/entities/tenant/errors.ts – Domain-specific error classes
Relevant Context Files:
• [ ] Manifest: packages/core/ structure (zero-deps domain layer)
• [ ] Manifest: packages/core/entities/tenant/ (business rules only)
Dependencies: Task 1 (TypeScript strict mode required for branded types)
Advanced Code Patterns:
• Branded Types for Compile-Time Safety: type TenantId = string & { \_\_brand: 'TenantId' } prevents accidental mixing of UUIDs between entities; constructor functions enforce validation at creation boundaries
• Rich Domain Methods: lead.qualify(score) contains business invariants (e.g., "cannot qualify if email is invalid") rather than anemic setters; emits LeadQualified domain event to event array
• Value Object Immutability: Email validation occurs in constructor; once instantiated, Email value object is frozen with Object.freeze(); modification requires creating new instance
• Result Pattern Over Exceptions: Functions return Result<T, DomainError> instead of throwing; forces caller to handle error cases via match() or unwrap() pattern
Sub-tasks:
• [x] Create Result<T, E> and Option<T> monad implementations with map, flatMap, match methods
• [x] Implement Tenant entity with create(), updateSettings(), and suspend() domain methods
• [x] Implement Lead entity with capture(), qualify(qualityScore), assignTo(userId), and convert() methods with validation rules
• [x] Create Email value object with regex validation and normalization (trim, lowercase)
• [x] Create TenantId branded type with UUID v4 validation and factory function
• [x] Write unit tests for domain logic using Vitest (zero DOM dependencies per manifest)
**[ ] Task 5: UI Primitive Design System & CVA Architecture (Wave 0, Batch 1.2)**
Strategic Objective: Establish the atomic component library using CVA (class-variance-authority) for type-safe Tailwind variants. These primitives form the foundation for all marketing and dashboard UI.
Targeted Files:
• [ ] packages/ui-primitives/theme/tokens.ts – Design tokens (colors, spacing, typography)
• [ ] packages/ui-primitives/theme/css-variables.css – CSS custom properties for runtime theming
• [ ] packages/ui-primitives/components/button/variants.ts – CVA configuration for button styles
• [ ] packages/ui-primitives/components/button/Button.tsx – Button component with Radix UI Slot
• [ ] packages/ui-primitives/components/form/Form.tsx – React Hook Form integration wrapper
• [ ] packages/ui-primitives/components/input/Input.tsx – Radix UI primitive with validation states
• [ ] packages/ui-primitives/components/dialog/Dialog.tsx – Accessible modal using Radix Dialog
• [ ] packages/ui-primitives/components/sonner/Sonner.tsx – Toast notifications
Relevant Context Files:
• [ ] Manifest: packages/ui-primitives/ (90 files, Radix UI base)
• [ ] Manifest: packages/ui-primitives/theme/ (tokens, CSS variables)
Dependencies: Task 1 (TypeScript paths must resolve for imports)
Advanced Code Patterns:
• CVA (Class Variance Authority) Variant Composition: Type-safe Tailwind variant definition:
const buttonVariants = cva("base-classes", {
variants: { intent: { primary: "bg-blue-600", danger: "bg-red-600" }, size: { sm: "px-2", lg: "px-8" } },
compoundVariants: [{ intent: "primary", size: "lg", class: "shadow-lg" }]
});
• Radix UI Primitive Composition: Use @radix-ui/react-slot for asChild polymorphism; compose with forwardRef for ref forwarding; implement data-state attributes for styling hooks
• CSS Custom Properties for Theming: Define --color-primary, --font-heading in tokens.ts; inject into :root via CSS variables to enable per-tenant theme overrides at runtime
• React Hook Form Integration: Form components expose register and control props with Zod resolver integration for type-safe validation
Sub-tasks:
• [ ] Set up CVA configuration with design tokens (primary, secondary, ghost variants) and responsive size scales
• [ ] Create Button component with loading states, disabled styling, and full accessibility (aria-pressed, focus rings)
• [ ] Build Form, Input, Label, Textarea primitives with React Hook Form register integration and error message display
• [ ] Create Dialog, Sheet, Popover using Radix primitives with focus trapping and scroll locking
• [ ] Implement Sonner toast notifications with promise-based loading states and action buttons
• [ ] Configure Card, Badge, Avatar, Separator layout primitives per manifest Phase 0 requirements
**[ ] Task 6: Lead Management Feature & Server Actions (Wave 0, Batch 1.3)**
Strategic Objective: Implement the use-case layer orchestrating domain entities with infrastructure. Creates the Server Action command bus for lead capture with Zod validation and domain event emission.
Targeted Files:
• [ ] packages/features/lead-management/dto.ts – Zod schemas for CreateLeadInput/UpdateLeadInput
• [ ] packages/features/lead-management/commands/createLead.ts – Next.js Server Action implementation
• [ ] packages/features/lead-management/events/LeadCaptured.ts – Domain event class
• [ ] packages/features/lead-management/model/lead-store.ts – Client-side state management (Zustand/Jotai)
• [ ] packages/features/index.ts – Public API barrel exports (FSD public interface)
• [ ] packages/features/lead-management/lib/validation.ts – Extended Zod validators
Relevant Context Files:
• [ ] Manifest: packages/features/ structure (use case orchestration)
• [ ] Manifest: packages/features/lead-management/
Dependencies: Task 4 (Lead entity), Task 3 (Infrastructure context), Task 2 (Database schema)
Advanced Code Patterns:
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
Sub-tasks:
• [ ] Define CreateLeadSchema with Zod (email: valid email, name: min 2 chars, source: enum, metadata: record)
• [ ] Implement createLead Server Action with tenant context extraction from AsyncLocalStorage
• [ ] Add duplicate detection logic (same email within 24h = update existing, not insert) using unique partial indexes
• [ ] Create LeadCaptured domain event with timestamp and source tracking
• [ ] Implement updateLeadStatus Server Action with status transition validation (cannot go from converted back to new)
• [ ] Add client-side store for optimistic UI updates using Zustand with Immer
**[ ] Task 7: Lead Capture Widget & Marketing Page Composition (Wave 0, Batch 2.1)**
Strategic Objective: Build the user-facing conversion surface—composing primitives into the Lead Capture Modal and Hero section that creates the Golden Thread end-to-end.
Targeted Files:
• [ ] apps/web/widgets/lead-capture-modal/ui/LeadCaptureModal.tsx – Widget composition component
• [ ] apps/web/widgets/lead-capture-modal/lib/useLeadForm.ts – React Hook Form logic with Zod resolver
• [ ] apps/web/widgets/hero/ui/Hero.tsx – Marketing hero section with CTA
• [ ] apps/web/pages/home/ui/LeadFormSection.tsx – Page-specific layout component
• [ ] apps/web/app/(marketing)/page.tsx – Next.js page component (Server Component)
• [ ] apps/web/app/(marketing)/layout.tsx – Marketing shell with header/footer widgets
Relevant Context Files:
• [ ] Manifest: apps/web/widgets/lead-capture-modal/
• [ ] Manifest: apps/web/pages/home/
• [ ] Manifest: apps/web/app/(marketing)/
Dependencies: Task 5 (UI primitives), Task 6 (Feature logic), Task 3 (Tenant context for middleware)
Advanced Code Patterns:
• Server Components by Default: Marketing page is Server Component for zero JS payload; Lead form uses Client Component only for interactive parts (progressive enhancement pattern)
• Streaming SSR with Suspense: Wrap lead form in }> for instant visual feedback while client JS hydrates
• Widget Composition Pattern: Widgets import from features/ (business logic) and shared/ui (primitives), never from entities/ directly (FSD strict layer enforcement)
• Optimistic UI with useOptimistic: Use React 19 useOptimistic hook to show "Submitting..." state immediately before Server Action confirmation, rolling back on error with toast notification
Sub-tasks:
• [ ] Create marketing layout with header, footer, and tenant-aware theme injection via CSS variables
• [ ] Build LeadCaptureModal widget using Dialog primitive, composing Form, Input, and Button with validation states
• [ ] Implement useLeadForm hook with React Hook Form, Zod resolver, and submission state management
• [ ] Create Hero widget with value proposition, social proof placeholders, and CTA button triggering modal
• [ ] Implement LeadFormSection for inline form display on landing page
• [ ] Add success state animation and confetti effect on successful lead submission
**[ ] Task 8: Email Integration & Notification Delivery (Wave 0, Batch 2.2)**
Strategic Objective: Close the Golden Thread loop—when lead is captured, tenant receives immediate email notification via Resend with React Email templates.
Targeted Files:
• [ ] packages/integrations/resend/client.ts – API client with circuit breaker pattern
• [ ] packages/integrations/resend/types.ts – TypeScript interfaces for Resend API
• [ ] packages/email/templates/lead-notification.tsx – React Email template component
• [ ] packages/email/components/layout/EmailLayout.tsx – Base email HTML shell
• [ ] packages/email/components/Button.tsx – Email-safe button component
• [ ] packages/features/lead-management/events/handlers/sendLeadNotification.ts – Event handler
• [ ] packages/integrations/webhooks/idempotency.ts – Idempotency key generation
Relevant Context Files:
• [ ] Manifest: packages/integrations/resend/ (Phase 0)
• [ ] Manifest: packages/email/ (42 files, React Email 5)
• [ ] Manifest: packages/integrations/webhooks/ (idempotency)
Dependencies: Task 6 (Domain events), Task 3 (Secrets encryption for API keys)
Advanced Code Patterns:
• React Email for Type-Safe Templates: Use @react-email/components (Section, Row, Column, Text, Button) to create responsive email HTML with Tailwind-like styling, compiled to static HTML before sending
• Idempotency Keys: Generate idempotency-key from tenantId:leadId:templateType:timestamp to prevent duplicate emails if event handler retries due to network timeout
• Circuit Breaker Pattern: Wrap Resend API calls in opossum circuit breaker; if API is down or rate-limited (429), queue to packages/infrastructure/queue/jobs.ts (Bull/Inngest stub) for exponential backoff retry
• Tenant-Aware From Addresses: Configure sending domain via notifications@{tenant.customDomain} with SPF/DKIM verification; fallback to noreply@platform.com with [Tenant Name] prefix in subject line
Sub-tasks:
• [ ] Set up Resend client with environment variable validation using t3-env pattern
• [ ] Create LeadNotificationEmail React component with lead details, tenant branding, and CTA button to dashboard
• [ ] Implement sendLeadNotification event handler that triggers on LeadCaptured domain event
• [ ] Add idempotency key generation and storage in Redis (24h TTL) to prevent duplicate sends
• [ ] Create email preview route at /api/email-preview/lead-notification for development testing
• [ ] Implement error handling with queue fallback for Resend API failures
**[ ] Task 9: Authentication System & Middleware Security (Wave 0, Batch 3.1)**
Strategic Objective: Secure the dashboard routes while keeping marketing pages public. Implement Clerk authentication with CVE-2025-29927 mitigation and RBAC (Role-Based Access Control).
Targeted Files:
• [ ] apps/web/middleware.ts – Updated with Clerk auth, tenant resolution, and security headers
• [ ] apps/web/app/(auth)/login/page.tsx – Authentication page using Clerk components
• [ ] apps/web/app/(auth)/callback/route.ts – OAuth callback handler
• [ ] apps/web/app/(dashboard)/layout.tsx – Protected dashboard shell with sidebar
• [ ] packages/infrastructure/auth/clerk.ts – Clerk client configuration
• [ ] packages/infrastructure/auth/rbac.ts – Permission matrix and role definitions
• [ ] packages/infrastructure/auth/middleware.ts – Auth middleware utilities
Relevant Context Files:
• [ ] Manifest: apps/web/middleware.ts (280 lines, security headers)
• [ ] Manifest: apps/web/app/(auth)/ and (dashboard)/
• [ ] Manifest: Security architecture (CVE-2025-29927 mitigation)
Dependencies: Task 3 (Infrastructure context), Task 2 (Tenant resolution)
Advanced Code Patterns:
• Middleware Chaining: Decompose 280-line middleware into composable HOFs: withSecurityHeaders, withTenantResolution, withAuth (conditional based on route matcher), withCSPNonce
• CVE-2025-29927 Mitigation: Explicitly check for x-middleware-subrequest header and return 403 if present to prevent middleware bypass attacks
• JWT Tenant Claims Enrichment: Enrich Clerk JWT session with tenantId and role claims via auth() helper; verify in Server Actions using verifyToken() with JWKS
• RBAC Bitwise Permissions: Define permissions as bitwise flags (Permissions.LEAD_READ = 1 << 0, LEAD_WRITE = 1 << 1, ADMIN = 1 << 7); check via hasPermission(user.role, Permissions.LEAD_WRITE) for efficient authorization
• Route Protection Bypass: Ensure /api/webhooks/* and /api/health routes skip auth middleware but retain tenant resolution and signature verification (HMAC)
Sub-tasks:
• [ ] Configure Clerk middleware with afterAuth hook to inject tenant context into AsyncLocalStorage
• [ ] Implement CVE-2025-29927 protection by rejecting requests with x-middleware-subrequest header
• [ ] Create login and registration pages using Clerk components with custom styling matching design tokens
• [ ] Implement RBAC matrix (Admin, Manager, Member) with permission flags in packages/infrastructure/auth/rbac.ts
• [ ] Build dashboard layout shell with sidebar navigation, user menu, and tenant switcher (preparation for multi-tenant admin)
• [ ] Add role-based guards (<AdminGuard>, <MemberGuard>) as client components for feature access control
**[ ] Task 10: Dashboard Data Table & Lead Management UI (Wave 0, Batch 3.2)**
Strategic Objective: Provide authenticated users with a data-dense interface to view, sort, filter, and manage captured leads using TanStack Table with server-side operations.
Targeted Files:
• [ ] apps/web/app/(dashboard)/leads/page.tsx – Lead list view with search params
• [ ] apps/web/widgets/data-table/ui/DataTable.tsx – Reusable table widget with sorting/pagination
• [ ] packages/ui-dashboard/data-table/DataTablePagination.tsx – Pagination controls
• [ ] packages/ui-dashboard/data-table/DataTableSorting.tsx – Column sorting UI
• [ ] packages/features/lead-management/queries/getLeads.ts – Server Action query with pagination
• [ ] packages/features/lead-management/queries/getLeadById.ts – Detail query
• [ ] apps/web/app/(dashboard)/leads/[id]/page.tsx – Lead detail view
Relevant Context Files:
• [ ] Manifest: packages/ui-dashboard/ (45 files, data-dense components)
• [ ] Manifest: apps/web/app/(dashboard)/leads/
• [ ] Manifest: FSD Widgets layer (composed UI units)
Dependencies: Task 9 (Auth), Task 6 (Lead features), Task 5 (UI primitives)
Advanced Code Patterns:
• TanStack Table v8 Headless Logic: Use @tanstack/react-table for server-side pagination, sorting, and filtering; combine with Server Actions and useTransition for pending states
• URL as State Source: Use Next.js searchParams as source of truth for table state (?page=2&sort=email:desc&filter=status:new); parse in Server Component and pass to query function for shareable/bookmarkable filter states
• Virtualization for Scale: Implement @tanstack/react-virtual when lead count exceeds 100 rows to maintain 60fps scrolling performance
• Optimistic Updates: Use useOptimistic hook for delete operations—remove row from UI immediately, show toast with "Undo" action, revert if Server Action fails
• RLS-Aware Queries: Server Actions automatically apply tenant context from ALS; queries use db.select().from(leads).where(eq(leads.tenantId, getTenantContext())) to ensure data isolation
Sub-tasks:
• [ ] Create getLeads Server Action with pagination (cursor-based or offset), sorting, and status filtering with Zod validation for params
• [ ] Build DataTable widget with TanStack Table, using UI primitives for cell rendering and header styling
• [ ] Implement column definitions with custom cells (status badges, email links, relative date formatting using date-fns)
• [ ] Add row actions dropdown (View, Edit, Delete) with confirmation dialogs using AlertDialog primitive
• [ ] Create lead detail view at /leads/[id] with activity timeline and metadata display
• [ ] Implement bulk actions (select multiple rows, bulk delete) with optimistic UI updates

Strategic Implementation Roadmap: Wave 1 Expansion & Platform Hardening (Tasks 11-20)
Strategic Context: Having established the Golden Thread (Lead Capture), we now harden the platform for scale and introduce monetization capabilities. This wave focuses on Background Processing (queues), Revenue (Stripe), Operations (Scheduling), and Quality (Storybook, Testing). We implement the Feature Flag system early to enable safe deployment of Wave 1 capabilities without breaking Wave 0 stability.
**[ ] Task 11: Feature Flags & Edge Configuration System (Wave 1, Batch 0.4)**
Strategic Objective: Implement runtime feature toggling using Vercel Edge Config to enable gradual rollout of Wave 1 features (Booking, Billing) without deployment risk. This allows Canary releases per tenant.
Targeted Files:
• [ ] packages/flags/config.ts – Edge Config client setup with environment validation
• [ ] packages/flags/server.ts – Server-side flag evaluation with tenant context
• [ ] packages/flags/client.ts – Client-side flag hooks with SWR caching
• [ ] packages/flags/flags.ts – Flag definitions registry (type-safe)
• [ ] apps/web/middleware.ts – Update to inject flag values into headers for SSR
• [ ] apps/web/app/(dashboard)/layout.tsx – Consume flags for feature visibility
Relevant Context Files:
• [ ] Manifest: packages/flags/ (Edge Config setup, Phase 1)
• [ ] Manifest: apps/web/middleware.ts (tenant resolution extension point)
Dependencies: Task 3 (Infrastructure context), Task 9 (Auth middleware)
Advanced Code Patterns:
• Edge Config for Sub-15ms Latency: Use Vercel Edge Config (KV) for flag resolution at the Edge; cache responses with stale-while-revalidate to minimize latency impact on cold starts
• Tenant-Aware Flag Targeting: Flag definitions support defaultValue, tenantIds[] whitelist, and percentage rollouts; evaluation order: Tenant Override → Percentage Rollout → Default
• Type-Safe Flag Registry: TypeScript record ensures all flags referenced in code exist in registry; compile-time checking prevents orphaned flag checks
• Middleware Injection: Middleware resolves flags based on tenant + user role, injects serialized flags into request.headers['x-feature-flags'] for Server Components to consume without additional I/O
Sub-tasks:
• [ ] Set up Vercel Edge Config store with connection token validation
• [ ] Implement getFlag(key, context) function that accepts tenantId and returns boolean/string/JSON variant
• [ ] Create React hook useFlag(key) that reads from SSR-injected data then hydrates with client-side evaluation
• [ ] Define initial flags: enable_booking_system, enable_billing, enable_advanced_analytics
• [ ] Add middleware integration to pre-resolve flags and inject into request headers
• [ ] Create UI component }> for conditional rendering
**[ ] Task 12: Queue System & Background Job Infrastructure (Wave 1, Batch 0.5)**
Strategic Objective: Implement async job processing for heavy operations (email campaigns, webhook retries, report generation) using Inngest or BullMQ with Redis. This decouples request lifecycle from processing time.
Targeted Files:
• [ ] packages/infrastructure/queue/client.ts – Queue client initialization (Inngest/Bull)
• [ ] packages/infrastructure/queue/jobs.ts – Job definitions registry with Zod schemas
• [ ] packages/infrastructure/queue/workers/emailWorker.ts – Email processing worker
• [ ] packages/infrastructure/queue/workers/webhookWorker.ts – Webhook retry worker with exponential backoff
• [ ] apps/web/api/inngest/route.ts – Inngest API route handler (or Bull Board)
• [ ] packages/features/email-campaigns/commands/sendCampaign.ts – Campaign queueing logic
Relevant Context Files:
• [ ] Manifest: packages/infrastructure/queue/ (Inngest/Bull setup, Phase 2)
• [ ] Manifest: packages/email/ (templates for email worker)
Dependencies: Task 3 (Redis cache), Task 8 (Email integration)
Advanced Code Patterns:
• Outbox Pattern for Reliability: Database transaction writes job to outbox table; separate process polls outbox and enqueues to Redis; ensures at-least-once delivery even if queue is temporarily down
• Idempotency via Job Keys: Jobs include idempotencyKey (hash of payload + tenant); queue deduplicates identical jobs within 24h window to prevent duplicate emails/charges
• Exponential Backoff with Jitter: Failed webhooks retry at 1min, 5min, 25min, 2hr, 6hr with random jitter to prevent thundering herd
• Tenant-Scoped Concurrency: Limit concurrent jobs per tenant (e.g., max 5 simultaneous email sends per tenant) to prevent noisy neighbor issues; use Redis semaphores
Sub-tasks:
• [ ] Set up Inngest client (or BullMQ) with Redis connection pooling
• [ ] Implement enqueueJob(name, payload, options) wrapper that validates payload with Zod before enqueueing
• [ ] Create email worker that processes send-email jobs with Resend API, handling rate limits (429) with automatic retry
• [ ] Create webhook worker with HMAC signature verification and exponential backoff for failed deliveries
• [ ] Build dashboard UI in admin for queue monitoring (job counts, failure rates, retry attempts)
• [ ] Implement dead-letter queue (DLQ) for jobs failing 5 times; alert on Slack/Discord when DLQ grows
**[ ] Task 13: Booking System Domain & Entity Layer (Wave 1, Batch 1.4)**
Strategic Objective: Extend core domain with Booking entity (scheduling), supporting time slots, availability rules, and conflict detection. Establishes the business logic foundation for Cal.com integration.
Targeted Files:
• [ ] packages/core/entities/booking/Booking.ts – Booking entity with state machine (pending → confirmed → cancelled → completed)
• [ ] packages/core/entities/booking/BookingRepository.ts – Repository interface
• [ ] packages/core/entities/booking/errors.ts – Domain errors (DoubleBookingError, PastDateError)
• [ ] packages/core/value-objects/DateRange.ts – Value object for time slot validation
• [ ] packages/core/value-objects/TimeSlot.ts – Individual slot validation with timezone support
• [ ] database/migrations/20240104000000_bookings.sql – Booking table with RLS policies
Relevant Context Files:
• [ ] Manifest: packages/core/entities/booking/ (Phase 1)
• [ ] Manifest: Database migrations for bookings
Dependencies: Task 4 (Domain foundation), Task 2 (RLS patterns)
Advanced Code Patterns:
• Temporal Validation: DateRange value object ensures end-time > start-time, both in future (configurable), and respects business hours (9-5 constraints)
• Double-Booking Prevention: Booking.create() queries existing bookings for overlapping DateRange with same tenant; throws DoubleBookingError if overlap detected (optimistic locking with version field)
• Timezone Awareness: Store all times in UTC in database; DateRange accepts IANA timezone (e.g., "America/New_York") and converts for display; booking confirmation emails include timezone-localized times
• Aggregate Roots: Booking aggregate includes BookingSlots collection; external systems (Cal.com) synchronize via repository pattern, not direct DB access
Sub-tasks:
• [ ] Create Booking entity with customerEmail, startTime, endTime, status, meetingLink, metadata
• [ ] Implement confirm(), cancel(), reschedule(newDateRange) methods with validation rules
• [ ] Create DateRange value object with overlaps(other) method and timezone conversion utilities
• [ ] Write RLS policies ensuring tenants can only see bookings where booking.tenant_id = current_setting('app.current_tenant')
• [ ] Add database constraints: CHECK (end_time > start_time), EXCLUDE USING GIST (tenant_id WITH =, tstzrange(start_time, end_time) WITH &&) (PostgreSQL temporal exclusion to prevent race-condition double bookings)
• [ ] Write domain unit tests for double-booking detection and timezone handling
**[ ] Task 14: Cal.com Integration Adapter (Wave 1, Batch 1.5)**
Strategic Objective: Implement the Plugin Architecture adapter for Cal.com scheduling API, enabling real-time availability checking and booking synchronization. Follows the Adapter pattern established in packages/integrations.
Targeted Files:
• [ ] packages/integrations/adapters/calcom/index.ts – Adapter registration and config
• [ ] packages/integrations/adapters/calcom/client.ts – API client with rate limiting
• [ ] packages/integrations/adapters/calcom/availability.ts – Get available slots
• [ ] packages/integrations/adapters/calcom/booking.ts – Create/update/delete bookings
• [ ] packages/integrations/adapters/calcom/types.ts – TypeScript interfaces for Cal.com API
• [ ] packages/integrations/webhooks/calcom/route.ts – Webhook handler for booking updates
Relevant Context Files:
• [ ] Manifest: packages/integrations/adapters/calcom/ (Phase 1)
• [ ] Manifest: packages/integrations/webhooks/ (idempotency, signature verification)
Dependencies: Task 13 (Booking domain), Task 12 (Queue for async sync), Task 8 (Email for confirmations)
Advanced Code Patterns:
• Adapter Pattern with Interface Segregation: Implement SchedulingAdapter interface with getAvailability(), createBooking(), cancelBooking(); Cal.com is one implementation; future supports Acuity or SavvyCal
• Circuit Breaker for API Resilience: Wrap Cal.com API calls in circuit breaker (5 failures = open circuit for 60s); fallback to cached availability or queue for retry
• Webhook Idempotency: Cal.com webhooks include unique bookingId + triggerEvent; store processed webhook IDs in Redis (24h TTL) to prevent duplicate processing of booking updates
• Two-Way Sync with Conflict Resolution: Platform is source of truth for "who booked"; Cal.com is source of truth for "available slots"; conflicts resolved by timestamp (last write wins) with audit log entry
Sub-tasks:
• [ ] Create Cal.com API client with personal access token authentication and request/response logging
• [ ] Implement getAvailability(dateRange) method fetching free/busy slots from Cal.com API with caching (15min TTL in Redis)
• [ ] Build createBooking(slot, customerDetails) that books in Cal.com then persists to our DB via Task 13 repository
• [ ] Create webhook handler for booking.created, booking.cancelled, booking.rescheduled events from Cal.com
• [ ] Add idempotency check using Redis to prevent duplicate processing of webhook retries
• [ ] Implement sync reconciliation job (queued) that runs hourly to ensure Cal.com and local DB are consistent
**[ ] Task 15: Stripe Integration & Billing Foundation (Wave 1, Batch 2.3)**
Strategic Objective: Implement payment processing with Stripe, including subscription management, customer portal, and webhook handling for payment events. Critical for monetization.
Targeted Files:
• [ ] packages/integrations/adapters/stripe/client.ts – Stripe SDK initialization
• [ ] packages/integrations/adapters/stripe/subscriptions.ts – Create/manage subscriptions
• [ ] packages/integrations/adapters/stripe/customer.ts – Customer creation and linking
• [ ] packages/integrations/adapters/stripe/webhook.ts – Webhook signature verification and event handling
• [ ] apps/web/api/webhooks/stripe/route.ts – API route for Stripe webhooks
• [ ] packages/features/billing/commands/createSubscription.ts – Business logic for subscription creation
• [ ] database/migrations/20240111000000_subscriptions.sql – Subscription table with tenant FK
Relevant Context Files:
• [ ] Manifest: packages/integrations/adapters/stripe/ (Phase 0)
• [ ] Manifest: apps/web/api/webhooks/stripe/ (webhook handling)
• [ ] Manifest: packages/features/billing/
Dependencies: Task 3 (Secrets encryption for Stripe keys), Task 12 (Queue for webhook processing), Task 9 (Auth for protected billing routes)
Advanced Code Patterns:
• Stripe Customer ↔ Tenant Linking: Each tenant gets Stripe customerId stored encrypted in DB; never expose Stripe IDs to frontend, use our internal subscriptionId as indirection
• Webhook Signature Verification: Use Stripe's constructEvent() with webhook secret; verify timestamp to prevent replay attacks (>5min old = reject)
• Idempotent Subscription Creation: Use idempotencyKey (tenantId + planId + timestamp) on Stripe API calls to prevent double-charges on network retries
• Expand/Contract for Plan Changes: Database schema supports both old and new plan fields during migration; Stripe webhook updates local state; atomic cutover only after confirmation
• Graceful Degradation: If Stripe API is down (circuit breaker open), queue subscription creation for retry; show user "Payment processing" state
Sub-tasks:
• [ ] Set up Stripe client with encrypted API keys from Task 3 secrets manager
• [ ] Create createSubscription(tenantId, priceId) Server Action with idempotency key generation
• [ ] Implement Stripe webhook handler for invoice.paid, invoice.payment_failed, customer.subscription.updated events
• [ ] Build subscription status synchronization logic (update DB when Stripe webhooks received)
• [ ] Create billing portal widget using Stripe Customer Portal for subscription management (cancel, update payment method)
• [ ] Add RLS policies ensuring tenants can only view their own subscription records
**[ ] Task 16: Storybook & Visual Regression Testing (Wave 1, Batch 3.3)**
Strategic Objective: Establish component documentation and visual testing using Storybook to prevent UI regressions across 90+ UI primitives and marketing components. Enables design system governance.
Targeted Files:
• [ ] apps/storybook/.storybook/main.ts – Storybook configuration with Vite/Webpack
• [ ] apps/storybook/.storybook/preview.tsx – Global decorators (theme, tenant context mock)
• [ ] apps/storybook/src/stories/primitives/Button.stories.tsx – Button component stories
• [ ] apps/storybook/src/stories/marketing/Hero.stories.tsx – Marketing block stories
• [ ] apps/storybook/src/stories/dashboard/DataTable.stories.tsx – Dashboard component stories
• [ ] .github/workflows/chromatic.yml – Visual regression CI pipeline
Relevant Context Files:
• [ ] Manifest: apps/storybook/ (65 files, Phase 1)
• [ ] Manifest: packages/ui-primitives/ (component source)
• [ ] Manifest: packages/ui-marketing/ (marketing blocks)
Dependencies: Task 5 (UI primitives must exist to document)
Advanced Code Patterns:
• FSD Story Organization: Stories mirror FSD structure: Primitives/, Widgets/, Features/; each story file imports from package public APIs (@repo/ui-primitives) not internal paths, enforcing boundary rules
• Tenant Context Mocking: Storybook decorator wraps components with mock TenantContext.Provider allowing toggling between different tenant themes (colors, fonts) to test white-label capabilities
• Interaction Testing: Use @storybook/testing-library to test component interactions (form submission, modal opening) within stories
• Chromatic Visual Testing: Integrate Chromatic (or Storybook Test Runner with Playwright) to capture component screenshots on PR; reject if pixel diff >threshold
Sub-tasks:
• [ ] Configure Storybook with TypeScript, Tailwind CSS integration, and path aliases for @repo/\*
• [ ] Create global decorator that injects mock tenant context and theme CSS variables
• [ ] Write stories for all Phase 0 primitives (Button, Input, Dialog, Card, etc.) with variants (size, intent, state)
• [ ] Write stories for marketing blocks (Hero, PricingTable, Testimonial) with mock data
• [ ] Set up Chromatic CI workflow to run visual tests on every PR
• [ ] Configure Storybook accessibility addon (axe) to check WCAG compliance automatically
**[ ] Task 17: Advanced Security, Audit Logging & Compliance (Wave 1, Batch 3.4)**
Strategic Objective: Harden security for SOC 2 compliance with comprehensive audit logging, data encryption at rest, and automated security scanning. Prepares for enterprise sales.
Targeted Files:
• [x] packages/infrastructure/security/audit-logger.ts – Structured audit log emitter
• [x] packages/infrastructure/security/encryption.ts – Field-level encryption for PII
• [ ] database/migrations/20240112000000_audit_logs.sql – Audit log table (immutable)
• [ ] apps/web/middleware.ts – Security headers update (HSTS, CSP strict-dynamic)
• [ ] scripts/security/verify-locks.sh – Dependency vulnerability scanning
• [ ] docs/runbooks/security-incident.md – Incident response procedures
Relevant Context Files:
• [ ] Manifest: packages/infrastructure/security/ (audit, encryption)
• [ ] Manifest: database/migrations/20240112000000_audit_logs.sql
• [ ] Manifest: Security architecture (Defense in depth)
Dependencies: Task 3 (Basic security), Task 9 (Auth for actor identification)
Advanced Code Patterns:
• Immutable Audit Trail: Append-only audit_logs table with id, actor_id, tenant_id, action (ENUM), resource, changes (JSONB diff), ip_address, user_agent, timestamp; no UPDATE/DELETE privileges granted to application user
• Structured Audit Logging: Use Pino to emit audit events to stdout ( ingested by Datadog/ELK) and simultaneously write to DB; dual recording prevents log loss
• Field-Level Encryption: Encrypt PII (email, phone) in database using AES-256-GCM before saving; decrypt on read in repository layer; keys rotated via envelope encryption (master key encrypts data keys)
• CSP Nonce Generation: Generate unique nonce per request in middleware; inject into <script nonce={nonce}>; store nonce in Content-Security-Policy header with strict-dynamic
• Dependency Pinning & Scanning: Use pnpm audit + snyk in CI; fail build on high/critical vulnerabilities; use syncpack to ensure consistent dependency versions across workspace (prevents lockfile confusion attacks)
Sub-tasks:
• [ ] Create audit logger that records all CREATE/UPDATE/DELETE operations on leads, bookings, and subscriptions with before/after diff
• [ ] Implement field-level encryption for lead email addresses and phone numbers in database
• [ ] Update middleware to generate CSP nonces and apply strict Content-Security-Policy headers
• [ ] Configure HSTS with 1-year max-age and preload directive
• [ ] Set up automated Snyk scanning in GitHub Actions with PR checks for vulnerabilities
• [ ] Create security incident runbook documenting RLS bypass response, data breach procedures, and key rotation processes
**[ ] Task 18: File Upload & Object Storage Infrastructure (Wave 1, Batch 2.4)**
Strategic Objective: Implement secure file upload handling with presigned URLs, virus scanning (future), and RLS-protected storage for tenant assets (logos, attachments). Uses S3-compatible API (R2/S3).
Targeted Files:
• [ ] packages/infrastructure/storage/s3.ts – S3/R2 client configuration
• [ ] packages/infrastructure/storage/presigned-urls.ts – URL generation for secure uploads
• [ ] apps/web/api/upload/route.ts – Upload handler with validation
• [ ] packages/features/file-upload/commands/uploadFile.ts – Business logic for file processing
• [ ] database/migrations/20240110000000_files.sql – File metadata table with RLS
• [ ] apps/web/widgets/file-uploader/ui/FileUploader.tsx – Drag-drop UI component
Relevant Context Files:
• [ ] Manifest: packages/infrastructure/storage/ (Phase 1)
• [ ] Manifest: apps/web/widgets/file-uploader/
• [ ] Manifest: Database migrations for files
Dependencies: Task 3 (Tenant context), Task 5 (UI primitives)
Advanced Code Patterns:
• Presigned URL Pattern: Client requests upload URL from Server Action → Server validates auth + generates S3 presigned PUT URL (expires 5min) → Client uploads directly to S3 → Client confirms completion → Server verifies file exists in S3 and records metadata
• Tenant Isolation in Object Storage: S3 keys prefixed with tenants/{tenantId}/files/{fileId}; IAM policy restricts listing to prefix; RLS in DB ensures metadata access control
• Content Validation: Verify Content-Type and file signatures (magic numbers) match allowed types (PNG, PDF); reject executable MIME types at edge
• Virus Scanning Placeholder: Queue file for scanning after upload (ClamAV or Cloudmersive); mark as quarantined until clean; block downloads of quarantined files
Sub-tasks:
• [ ] Configure S3/R2 client with tenant-scoped credentials (or bucket policies)
• [ ] Implement getPresignedUploadUrl(filename, contentType) Server Action with size limits (10MB) and type validation
• [ ] Create files table with id, tenant_id, filename, s3_key, size, mime_type, status (uploading/active/quarantined), uploaded_by
• [ ] Build drag-and-drop file uploader widget with progress indication and error handling
• [ ] Implement file download proxy that verifies RLS permissions before redirecting to presigned GET URL
• [ ] Add file cleanup cron job (queued) that deletes orphaned files (uploaded >24h ago but not confirmed) from S3
**[ ] Task 19: Analytics Engine & Event Tracking (Wave 1, Batch 2.5)**
Strategic Objective: Implement product analytics using Tinybird (or similar) for real-time event ingestion, enabling tenant-level insights on lead conversion, booking rates, and revenue metrics.
Targeted Files:
• [ ] packages/integrations/adapters/google-analytics-4/client.ts – GA4 client-side integration
• [ ] packages/features/analytics-tracking/events/trackEvent.ts – Event tracking utility
• [ ] packages/features/analytics-engine/queries/getTenantMetrics.ts – Aggregated metrics query
• [ ] apps/web/app/(dashboard)/analytics/page.tsx – Analytics dashboard UI
• [ ] packages/ui-dashboard/charts/LineChart.tsx – Analytics visualization component
• [ ] database/migrations/20240108000000_analytics.sql – Events table (or Tinybird Data Source)
Relevant Context Files:
• [ ] Manifest: packages/integrations/adapters/google-analytics-4/ (Phase 0)
• [ ] Manifest: packages/features/analytics-engine/ (Phase 1)
• [ ] Manifest: apps/web/app/(dashboard)/analytics/
Dependencies: Task 10 (Dashboard foundation), Task 9 (Auth for user identification)
Advanced Code Patterns:
• Server-Side Event Ingestion: Track events in Server Actions (more reliable than client-side); emit to Tinybird via HTTP API with batching (queue if failed)
• Privacy-First Tracking: Respect navigator.doNotTrack and cookie consent; anonymize IP addresses; provide data export/deletion endpoints for GDPR
• Real-Time Materialized Views: Use Tinybird Pipes to create rolling 7-day conversion rates, MRR (Monthly Recurring Revenue) calculations, and lead velocity metrics
• Event Schema Validation: Use Zod to validate event payloads before sending to analytics backend; version event schemas to handle breaking changes gracefully
Sub-tasks:
• [ ] Set up Tinybird (or Clickhouse/Postgres) data source for events with columns: timestamp, tenant_id, event_type, user_id, properties (JSON)
• [ ] Implement trackEvent(eventType, properties) utility that queues events for batch insertion
• [ ] Track key events: lead_captured, booking_created, subscription_started, page_viewed
• [ ] Create analytics dashboard with charts showing leads over time, conversion funnel, and revenue metrics (from Stripe data)
• [ ] Implement GA4 integration for marketing page tracking with consent mode (respect cookie preferences)
• [ ] Add data export functionality (CSV/JSON) for tenant admins to download their analytics data (GDPR compliance)
**[ ] Task 20: Page Builder Core & CMS Foundation (Wave 1, Batch 3.5)**
Strategic Objective: Implement the foundational data model and basic UI for the Page Builder (site builder), allowing tenants to create custom landing pages with drag-and-drop blocks. This is the key differentiator feature.
Targeted Files:
• [ ] packages/core/entities/page/Page.ts – Page entity with block tree structure
• [ ] packages/core/entities/site/Site.ts – Site aggregate root (collection of pages)
• [ ] packages/features/page-builder/commands/savePage.ts – Persist page structure
• [ ] packages/features/page-builder/queries/getPageBySlug.ts – Retrieve page for rendering
• [ ] apps/web/app/(site)/[...slug]/page.tsx – Dynamic page renderer
• [ ] apps/web/widgets/page-builder-canvas/ui/Canvas.tsx – Visual editor canvas (Phase 1 basic)
• [ ] database/migrations/20240105000000_sites.sql – Sites table
• [ ] database/migrations/20240106000000_pages.sql – Pages table with JSON blocks column
Relevant Context Files:
• [ ] Manifest: packages/core/entities/site/, packages/core/entities/page/ (Phase 1)
• [ ] Manifest: packages/features/page-builder/ (Phase 1)
• [ ] Manifest: apps/web/widgets/page-builder-canvas/
Dependencies: Task 5 (UI primitives as blocks), Task 4 (Domain foundation), Task 11 (Feature flags to enable builder)
Advanced Code Patterns:
• Block-Based Content Model: Page entity contains blocks: Block[] array where Block is discriminated union (HeroBlock, FeatureGridBlock, LeadFormBlock); each block has type, id, props, and children; stored as JSONB in Postgres
• Atomic Publishing: Pages have draft and published states; edits save to draft; publish creates new version; renderer always serves published version; supports rollback to previous versions
• Component Registry Pattern: Dynamic component lookup blockRegistry[block.type] maps block type to React component; validates block props with Zod before rendering to prevent XSS via stored JSON
• Incremental Static Regeneration (ISR): Dynamic pages use Next.js ISR with revalidate: 60; webhook on page publish triggers revalidateTag('page:${pageId}') for instant cache purge
• Preview Mode: Middleware checks for ?preview=true + valid preview token (JWT) to render draft versions for authenticated editors only
Sub-tasks:
• [ ] Create Site entity with customDomain, themeSettings (colors, fonts)
• [ ] Create Page entity with slug, title, metaDescription, blocks (JSON array), status (draft/published), publishedAt
• [ ] Implement basic block types: hero, text, image, lead_form, pricing_table with respective Prop interfaces
• [ ] Build dynamic page renderer that fetches page by slug, validates blocks against registry, and renders components
• [ ] Create basic Page Builder canvas UI with sidebar block picker and property editor (read-only preview for Phase 1, full drag-drop for Phase 2)
• [ ] Implement publish/unpublish functionality with version history (store previous JSON snapshots in page_versions table)

Strategic Implementation Roadmap: Wave 2 (Enterprise Scale) & Wave 3 (Platform Maturity)
Strategic Context: Having established monetization (Stripe) and core CMS (Page Builder), we now focus on Multi-User Collaboration (Team Management), Marketing Automation (Email Campaigns), Global Expansion (i18n), and Enterprise Governance (Admin, Compliance). Wave 3 addresses Performance at Scale (1000 tenant simulation) and Operational Excellence (Chaos Engineering, Advanced Monitoring).
**[ ] Task 21: Admin Dashboard & System-Wide Governance (Wave 2, Batch 4.1)**
Strategic Objective: Deploy the internal Admin application (apps/admin) for cross-tenant management, system health monitoring, and platform governance. Enables support team to manage enterprise clients without database access.
Targeted Files:
• [ ] apps/admin/app/layout.tsx – Admin shell with navigation
• [ ] apps/admin/app/page.tsx – System overview dashboard (tenant counts, revenue, health)
• [ ] apps/admin/app/tenants/page.tsx – Tenant management interface (suspend, impersonate)
• [ ] apps/admin/app/users/page.tsx – Cross-tenant user search and management
• [ ] apps/admin/app/billing/page.tsx – Platform-wide revenue analytics
• [ ] apps/admin/app/system/page.tsx – Health checks, queue status, error rates
• [ ] apps/admin/widgets/tenant-admin-grid/ui/TenantAdminGrid.tsx – Data table with tenant details
• [ ] packages/features/team-management/commands/impersonateTenant.ts – Secure impersonation for support
Relevant Context Files:
• [ ] Manifest: apps/admin/ (148 files, Phase 2)
• [ ] Manifest: apps/admin/widgets/ (15 admin-specific widgets)
• [ ] Manifest: packages/features/team-collaboration/
Dependencies: Task 10 (Dashboard patterns), Task 17 (Audit logging for admin actions), Task 9 (Auth with RBAC for admin roles)
Advanced Code Patterns:
• Super Admin RBAC: Role SUPER_ADMIN bypasses tenant context checks but logs all actions to immutable audit trail; uses separate database connection pool with elevated privileges for cross-tenant queries
• Tenant Impersonation: Support staff can "become" tenant admin for debugging via impersonateTenant(tenantId) which sets x-impersonated-by header and logs all actions under both tenant and support staff IDs
• Cross-Tenant Aggregation: Use materialized views or read-replicas for cross-tenant analytics to prevent heavy queries from impacting production OLTP performance
• Real-Time System Metrics: WebSocket connection (Supabase Realtime or Socket.io) streaming queue depths, error rates, and active user counts to admin dashboard
Sub-tasks:
• [ ] Set up separate Next.js app at apps/admin with its own middleware enforcing SUPER_ADMIN role
• [ ] Create system overview showing total tenants, MRR (Monthly Recurring Revenue), active users, and recent errors
• [ ] Build tenant management grid with search, filter by plan/status, and suspend/activate controls
• [ ] Implement "Login As" functionality that generates temporary session for tenant admin without knowing their password (full audit trail)
• [ ] Create billing overview showing revenue by plan, churn rate, and failed payment counts
• [ ] Add system health page with Redis connection status, queue lengths, and recent deployment version
**[ ] Task 22: Team Management & RBAC Enhancement (Wave 2, Batch 4.2)**
Strategic Objective: Implement multi-user tenant support with role-based access control (Owner, Admin, Manager, Viewer), invitation flows, and permission inheritance. Critical for enterprise sales (teams >1 user).
Targeted Files:
• [ ] packages/core/entities/user/TeamMember.ts – Team membership aggregate
• [ ] packages/core/entities/user/permissions.ts – Granular permission definitions
• [ ] packages/features/team-management/commands/inviteMember.ts – Invitation logic
• [ ] packages/features/team-management/commands/acceptInvite.ts – Acceptance flow
• [ ] apps/web/app/(dashboard)/settings/team/page.tsx – Team management UI
• [ ] apps/web/widgets/team-member-list/ui/TeamMemberList.tsx – Member management table
• [ ] database/migrations/20240114000000_team_members.sql – Junction table with roles
Relevant Context Files:
• [ ] Manifest: apps/web/app/(dashboard)/settings/team/ (Phase 2)
• [ ] Manifest: packages/features/team-management/ (Phase 2)
• [ ] Manifest: apps/web/widgets/team-member-list/
Dependencies: Task 9 (Auth foundation), Task 4 (User entity extension)
Advanced Code Patterns:
• Attribute-Based Access Control (ABAC): Extend RBAC with resource-level permissions (e.g., "can edit leads assigned to me" vs "can edit all leads"); store permissions as bitwise flags in team_members table with permissions integer column
• Invitation Token Security: Invite links use JWT with tenantId, email, role claims, signed with tenant-specific secret; expire in 7 days; single-use (token hash stored in Redis until accepted or revoked)
• Ownership Transfer: Atomic transaction ensuring at least one owner always exists; previous owner demoted to admin only after new owner confirms acceptance
• Cascade Permissions: Changes to team member role trigger cache invalidation for all their active sessions (Redis session key pattern session:{userId}:\* deletion)
Sub-tasks:
• [ ] Extend users table with current_tenant_id and create team_members junction table (user_id, tenant_id, role, permissions, invited_by, invited_at)
• [ ] Implement inviteMember(email, role) Server Action sending Resend email with secure invitation link
• [ ] Build invitation acceptance flow handling signup (new user) or login (existing user) with automatic tenant association
• [ ] Create team settings page showing members, pending invites, and role management (Owner/Admin/Manager/Viewer)
• [ ] Implement permission checks in all Server Actions (e.g., requirePermission(permissions.LEAD_DELETE))
• [ ] Add "Leave Tenant" functionality with safeguards preventing owner from leaving without transferring ownership
**[ ] Task 23: Email Marketing Campaigns & Automation (Wave 2, Batch 4.3)**
Strategic Objective: Build email campaign system allowing tenants to send bulk emails to leads using React Email templates, with scheduling, segmentation, and analytics. Differentiates from basic transactional email.
Targeted Files:
• [ ] packages/core/entities/campaign/Campaign.ts – Campaign aggregate root
• [ ] packages/features/email-campaigns/commands/createCampaign.ts – Campaign creation
• [ ] packages/features/email-campaigns/commands/sendCampaign.ts – Bulk send orchestration
• [ ] packages/features/email-campaigns/queries/getCampaignStats.ts – Open/click tracking
• [ ] packages/email/templates/campaign-sent.tsx – Campaign email template
• [ ] apps/web/app/(dashboard)/campaigns/page.tsx – Campaign management UI
• [ ] database/migrations/20240107000000_campaigns.sql – Campaigns and email_events tables
Relevant Context Files:
• [ ] Manifest: packages/features/email-campaigns/ (Phase 3)
• [ ] Manifest: packages/email/templates/campaign-sent.tsx (Phase 3)
• [ ] Manifest: apps/web/app/(dashboard)/campaigns/
Dependencies: Task 8 (Email infrastructure), Task 12 (Queue system for bulk sending), Task 22 (Team permissions for who can send)
Advanced Code Patterns:
• Segmentation Engine: Campaign targets leads based on filters (status=new, source=web, created>30days ago); compile to SQL WHERE clause dynamically with RLS enforcement; limit to 10,000 leads per campaign initially (cursor-based pagination for scale)
• Throttling & Rate Limiting: Use queue concurrency controls to limit tenant to 100 emails/minute (prevent spam reputation damage); exponential backoff on 429 errors from Resend
• Tracking Pixel & Link Wrapping: Emails include 1x1 transparent pixel with unique trackingId (UUID) logging opens; links rewritten to tracking domain then redirecting to original URL with click logging
• Unsubscribe Handling: One-click unsubscribe headers (List-Unsubscribe) and preference center updating lead.email_preferences (automated suppression list compliance with CAN-SPAM/GDPR)
• A/B Testing Foundation: Campaign entity supports variants array (A/B test content); queue splits send 50/50; stats tracked per variant for winner determination
Sub-tasks:
• [ ] Create campaigns table with name, subject, template, segment_filters (JSONB), status (draft/scheduled/sending/sent), sent_count, open_count, click_count
• [ ] Build campaign editor UI with Rich Text Editor (Tiptap or Lexical) for email composition
• [ ] Implement queue worker processing campaigns in batches (100 leads per job) with rate limiting
• [ ] Create tracking infrastructure: pixel endpoint logging opens, link redirect endpoint logging clicks with UTM parameter preservation
• [ ] Add campaign analytics dashboard showing delivery rates, opens, clicks, and unsubscribes
• [ ] Implement unsubscribe footer and preference management page (/unsubscribe?token=XYZ with signed JWT preventing tampering)
**[ ] Task 24: Internationalization (i18n) & Localization (Wave 2, Batch 4.4)**
Strategic Objective: Implement multi-language support using next-intl for marketing sites and dashboard, starting with English (EN), Spanish (ES), and German (DE). Enables expansion into EU markets.
Targeted Files:
• [ ] packages/i18n/config.ts – next-intl configuration with routing
• [ ] packages/i18n/middleware.ts – Locale detection and negotiation
• [ ] packages/i18n/messages/en.json – English translations
• [ ] packages/i18n/messages/es.json – Spanish translations (Phase 2)
• [ ] packages/i18n/messages/de.json – German translations (Phase 3)
• [ ] apps/web/app/[locale]/layout.tsx – Locale-aware root layout
• [ ] apps/web/app/[locale]/(marketing)/page.tsx – Localized marketing page
• [ ] packages/ui-primitives/components/calendar/Calendar.tsx – Locale-aware date components
Relevant Context Files:
• [ ] Manifest: packages/i18n/ (18 files, Phase 1)
• [ ] Manifest: apps/web/app/(marketing)/ (marketing pages to translate)
Dependencies: Task 5 (UI components must support RTL), Task 7 (Marketing content to translate)
Advanced Code Patterns:
• Subpath Routing with Middleware: URLs as /en/pricing, /es/pricing; middleware detects locale from Accept-Language header or cookie, redirects to appropriate subpath; default locale (EN) without prefix optional but recommended for SEO
• Message Formatting (ICU): Use ICU message syntax for pluralization ({count, plural, one {# lead} other {# leads}}) and gender in translation files; validate with intl-messageformat-parser
• RTL (Right-to-Left) Support: Configure Tailwind with rtl: variants; use dir="rtl" on html element for Arabic/Hebrew (future); mirror flex layouts and padding directions automatically
• Tenant-Specific Overrides: Allow tenants to override specific translation keys in tenant.settings.translations (JSONB) for industry-specific terminology (e.g., "patient" vs "client" vs "lead")
• SEO Hreflang Tags: Automatically generate <link rel="alternate" hreflang="es" href="..." /> tags in metadata for all localized pages to prevent duplicate content penalties
Sub-tasks:
• [ ] Configure next-intl with subpath routing (/en, /es) and middleware locale detection
• [ ] Extract all hardcoded strings from marketing pages and UI components into en.json message files organized by namespace (marketing, dashboard, auth)
• [ ] Implement Spanish translation for all Wave 0-1 features (marketing site, dashboard, auth)
• [ ] Add RTL CSS support to UI primitives (margin/padding logical properties, flex direction)
• [ ] Create locale switcher component (dropdown) storing preference in cookie
• [ ] Update SEO metadata generation to include hreflang tags for all supported locales
**[ ] Task 25: Advanced SEO & Structured Data (Wave 2, Batch 4.5)**
Strategic Objective: Implement comprehensive SEO system with dynamic sitemap generation, JSON-LD structured data (Schema.org), and Open Graph image generation for all tenant pages. Critical for organic growth.
Targeted Files:
• [ ] packages/seo/metadata.ts – Metadata factory with tenant context
• [ ] packages/seo/json-ld.ts – JSON-LD generators for schemas
• [ ] packages/seo/schemas/local-business.ts – LocalBusiness schema
• [ ] packages/seo/schemas/article.ts – Article/BlogPosting schema (Phase 2)
• [ ] apps/web/app/sitemap.ts – Dynamic sitemap generation
• [ ] apps/web/app/opengraph-image.tsx – Dynamic OG image generation (1200x630)
• [ ] apps/web/app/(marketing)/blog/[slug]/page.tsx – Blog with structured data
Relevant Context Files:
• [ ] Manifest: packages/seo/ (24 files, Phase 1-2)
• [ ] Manifest: apps/web/app/sitemap.ts, opengraph-image.tsx
• [ ] Manifest: apps/web/app/(marketing)/blog/
Dependencies: Task 7 (Marketing pages), Task 20 (Page Builder for dynamic content), Task 24 (i18n for multilingual SEO)
Advanced Code Patterns:
• Dynamic OG Images: Use @vercel/og (Edge) to generate images with tenant branding (logo, colors), page title, and author photo; cache generated images in Redis (24h) to reduce compute; support both PNG and SVG formats
• Schema.org Markup: Generate <script type="application/ld+json"> for Organization, Website, LocalBusiness, and BlogPosting schemas; include tenant-specific data (address, phone, geo-coordinates from tenant settings)
• Sitemap Index Segmentation: Generate sitemap index at /sitemap.xml pointing to sub-sitemaps by type (sitemap-pages.xml, sitemap-blog.xml, sitemap-leads.xml if public); respect robots.txt disallow rules
• Canonical URLs with Localization: Ensure /es/page has canonical pointing to /page (or vice versa based on strategy) to prevent duplicate content; use x-default for language switcher pages
• Core Web Vitals Optimization: Implement critical CSS inlining for above-the-fold content; use next/font with display: swap; preload LCP images with priority prop
Sub-tasks:
• [ ] Create metadata factory that generates titles, descriptions, and Open Graph tags based on page content and tenant settings
• [ ] Implement dynamic OG image generation using Edge Runtime with tenant logo overlay and page title
• [ ] Build JSON-LD generators for LocalBusiness (address, hours, geo), Organization (logo, social links), and Article (blog posts with author)
• [ ] Create dynamic sitemap generator including marketing pages, blog posts, and public lead magnets (respecting noindex flags)
• [ ] Add robots.ts for dynamic robots.txt generation (disallow admin paths, allow sitemap reference)
• [ ] Implement canonical URL logic handling i18n variants and pagination (rel="prev"/"next")
**[ ] Task 26: Real-Time Notifications & Supabase Realtime (Wave 2, Batch 5.1)**
Strategic Objective: Implement live UI updates using Supabase Realtime for lead feed notifications, team collaboration (cursor presence), and booking alerts. Differentiates from polling-based competitors.
Targeted Files:
• [ ] packages/realtime/client.ts – Supabase Realtime client wrapper
• [ ] packages/realtime/hooks/useRealtimeLeads.ts – Live lead subscription hook
• [ ] packages/realtime/hooks/usePresence.ts – Team presence awareness
• [ ] apps/web/widgets/activity-feed/ui/ActivityFeed.tsx – Real-time activity stream
• [ ] apps/web/widgets/notification-center/ui/NotificationCenter.tsx – Toast notifications for events
• [ ] packages/features/real-time-notifications/events/publishNotification.ts – Event publisher
Relevant Context Files:
• [ ] Manifest: packages/realtime/ (Phase 2)
• [ ] Manifest: apps/web/widgets/activity-feed/, notification-center/
• [ ] Manifest: packages/features/real-time-notifications/
Dependencies: Task 2 (Supabase setup), Task 10 (Dashboard UI), Task 22 (Team context for presence)
Advanced Code Patterns:
• Broadcast vs. Postgres Changes: Use Postgres Changes (database triggers → Realtime) for data updates (new leads, bookings); use Broadcast for ephemeral events (user typing, cursor position) to reduce database load
• Tenant-Scoped Channels: Subscribe to tenant:${tenantId}:leads channel; RLS ensures users only receive events for their tenant; handle reconnections with exponential backoff and state reconciliation (fetch missed data since last event timestamp)
•  Optimistic UI with Reconciliation: Show new lead immediately on creator's screen via optimistic update; Realtime confirms to other team members; if conflict detected (rare), merge strategies prioritize server state
•  Smart Batching: Debounce rapid Realtime events (e.g., cursor movements) to 100ms batches; throttle lead notifications to max 1/sec to prevent UI jank during high-volume periods
•  Mobile Push Preparation: Abstract Realtime client behind interface; future implementation adds Firebase/APNs push notification bridge for mobile apps without changing business logic
Sub-tasks:
•  [ ] Set up Supabase Realtime client with tenant-scoped channel subscriptions and RLS enforcement on broadcast permissions
•  [ ] Implement useRealtimeLeads() hook subscribing to new lead insertions in database (Postgres Changes)
•  [ ] Create activity feed widget showing real-time stream of lead captures, bookings, and team actions (paginated history + live updates)
•  [ ] Build notification center with badge counts and toast notifications for important events (new lead assigned to you, booking confirmed)
•  [ ] Add team presence indicators (who's online) using Realtime Presence feature with heartbeat every 30s
•  [ ] Implement reconnection logic handling network outages with "Reconnecting..." state and missed event recovery
**[ ] Task 27: Advanced Analytics & Attribution (Wave 2, Batch 5.2)**
Strategic Objective: Implement funnel analysis, cohort retention, and multi-touch attribution to show tenants which marketing channels drive revenue (not just leads).
Targeted Files:
•  [ ] packages/features/analytics-engine/queries/getFunnelAnalysis.ts – Funnel step conversion rates
•  [ ] packages/features/analytics-engine/queries/getAttribution.ts – Channel attribution models
•  [ ] packages/ui-dashboard/charts/FunnelChart.tsx – Funnel visualization
•  [ ] apps/web/app/(dashboard)/analytics/attribution/page.tsx – Attribution dashboard
•  [ ] database/migrations/20240115000000_attribution.sql – Touchpoints table for multi-touch tracking
Relevant Context Files:
•  [ ] Manifest: packages/features/analytics-engine/ (Phase 1-2)
•  [ ] Manifest: apps/web/app/(dashboard)/analytics/
•  [ ] Manifest: packages/ui-dashboard/charts/
Dependencies: Task 19 (Basic analytics), Task 6 (Lead source tracking), Task 15 (Stripe for revenue attribution)
Advanced Code Patterns:
•  Multi-Touch Attribution Models: Implement first-touch, last-touch, and linear attribution algorithms; store touchpoints table with lead_id, channel, timestamp, metadata (UTM params); calculate weighted credit per channel leading to conversion
•  Cohort Analysis SQL: Use window functions and date_trunc to group users by acquisition week and calculate retention rates week-over-week; materialized view refreshes nightly
•  Funnel Step Definition: Flexible funnel configuration (Step 1: Visit, Step 2: Lead Capture, Step 3: Booking, Step 4: Payment); SQL generates conversion rates between each step with drop-off analysis
•  Revenue Attribution: Join Stripe payment events with lead touchpoints to calculate ROAS (Return on Ad Spend) per channel; handle subscription renewals (recurring revenue attribution to original channel vs re-attribution)
Sub-tasks:
•  [ ] Create touchpoints table tracking every interaction (page view, form open, submission) with UTM parameters and referrer
•  [ ] Implement attribution calculation engine supporting first-touch and linear models (credit divided equally across all touchpoints)
•  [ ] Build funnel chart component showing conversion rates between visitor → lead → qualified → customer
•  [ ] Create cohort retention grid showing percentage of leads from Week 1 who booked in Week 2, 3, 4, etc.
•  [ ] Add revenue attribution dashboard showing revenue per channel and ROAS calculations
•  [ ] Implement automated weekly email reports (Phase 2) with PDF generation using @react-pdf/renderer
**[ ] Task 28: Template System & White-Label Engine (Wave 2, Batch 5.3)**
Strategic Objective: Enable tenants to select from pre-built page templates (Industry-specific) and customize branding (colors, fonts, logos). Powers the "Client Overrides" architecture for enterprise.
Targeted Files:
•  [ ] packages/features/template-system/commands/applyTemplate.ts – Template application logic
•  [ ] packages/features/template-system/queries/getTemplates.ts – Template registry
•  [ ] clients/_template/src/config.ts – Enterprise client configuration schema
•  [ ] clients/_template/src/theme/colors.ts – Brand color overrides
•  [ ] apps/web/app/api/tenant-theme/route.ts – Dynamic CSS generation endpoint
•  [ ] apps/web/middleware.ts – Theme injection enhancement
Relevant Context Files:
•  [ ] Manifest: clients/ folder (45 files, Phase 2-3)
•  [ ] Manifest: packages/features/template-system/ (Phase 2)
•  [ ] Manifest: apps/web/widgets/template-gallery/
Dependencies: Task 20 (Page Builder blocks), Task 5 (CSS variable theming), Task 11 (Feature flags for template access)
Advanced Code Patterns:
•  Template as Block Tree: Templates are JSON files containing arrays of pre-configured blocks (from Task 20) with default content; applying template instantiates these blocks into tenant's page with deep copy (isolated from template updates)
•  CSS Variable Injection: Middleware injects <style>:root{--brand-primary:${tenant.theme.primaryColor}}</style> into HTML <head> based on tenant.settings.theme; UI components use bg-primary (mapped to CSS var) enabling runtime theme changes without rebuild
• Font Loading Strategy: Support Google Fonts or custom font files; use next/font for optimization; store font family in tenant settings; apply via CSS variable --font-heading
• Client Overrides Architecture: Enterprise clients in clients/{clientName}/ folder contain React component overrides (e.g., custom calculator); build system uses webpack/vite aliases to replace default components with client-specific versions based on tenant.slug at build time (static) or dynamic imports (runtime)
Sub-tasks:
• [ ] Create template gallery with 10 industry templates (Lawyer, SaaS, Restaurant, Gym, etc.) as JSON block definitions
• [ ] Implement "Apply Template" functionality copying template blocks to tenant's homepage with customizable placeholder content
• [ ] Build theme editor UI with color picker for primary/secondary colors, font selector, and logo upload (using Task 18 file upload)
• [ ] Create CSS variable injection system in middleware generating dynamic stylesheets per tenant (cached in Redis)
• [ ] Set up clients/\_template scaffolding for enterprise white-label clients with component override examples
• [ ] Implement runtime theme switching (preview changes before publishing) using React context + CSS variables
**[ ] Task 29: Load Testing & Performance Validation (Wave 3, Batch 6.1)**
Strategic Objective: Validate 1000 concurrent tenant scalability using k6; identify bottlenecks in RLS queries, middleware cold starts, and database connection pooling before production launch.
Targeted Files:
• [ ] scripts/load-test/k6-config.js – K6 configuration and thresholds
• [ ] scripts/load-test/tenant-concurrency.js – 1000 tenant simulation scenario
• [ ] scripts/load-test/booking-stress.js – Booking system race condition tests
• [ ] scripts/load-test/webhook-flood.js – Webhook handling under load
• [ ] packages/infrastructure/database/connection.ts – Connection pool optimization
• [ ] apps/web/middleware.ts – Performance optimization (reduced logic)
Relevant Context Files:
• [ ] Manifest: scripts/load-test/ (Phase 3)
• [ ] Manifest: Performance budgets in .size-limit.json and Lighthouse CI
Dependencies: All previous tasks (full system required for realistic load testing)
Advanced Code Patterns:
• Synthetic Tenant Generation: Script creates 1000 tenant records with unique domains, then simulates concurrent traffic patterns (some high traffic, some idle) to test RLS performance under realistic skew (Pareto distribution: 20% tenants generate 80% load)
• Connection Pool Tuning: PostgreSQL connection pool sized to max_connections / (app_instances); use PgBouncer for transaction pooling if direct connections exceed 100; monitor active_connections vs waiting_queries
• Cold Start Mitigation: Middleware optimized to minimize edge function execution time; use Edge Config (Task 11) for tenant resolution instead of database lookups; warm functions via scheduled ping every 5 minutes
• Race Condition Testing: k6 scenarios specifically test double-booking prevention (Task 13) by sending simultaneous booking requests for same slot from different users; verify database constraints prevent overbooking
• Chaos Engineering (Lite): Randomly kill database connections and verify retry logic; simulate Redis failover; verify circuit breakers (Task 14, 15) open/close correctly under stress
Sub-tasks:
• [ ] Configure k6 with 1000 VU (virtual users) across 100 tenant contexts testing lead capture, page rendering, and booking flows
• [ ] Identify and optimize slow RLS queries using EXPLAIN ANALYZE; add missing indexes on tenant_id + created_at composite
• [ ] Tune PostgreSQL connection pool size and implement connection retry logic with exponential backoff
• [ ] Test webhook flood scenario (1000 webhooks/minute) verifying queue processing and idempotency handling
• [ ] Validate bundle size budgets (<150KB marketing, <300KB dashboard) under production build
• [ ] Generate performance report with p95/p99 latency metrics and identify top 5 bottlenecks for remediation
**[ ] Task 30: Compliance, Privacy & Final Hardening (Wave 3, Batch 6.2)**
Strategic Objective: Achieve SOC 2 Type II readiness with automated GDPR data export/erasure, privacy policy generation, and final security penetration testing. Enables enterprise sales and EU market entry.
Targeted Files:
• [ ] packages/privacy/gdpr/exportData.ts – Data export functionality (JSON/ZIP)
• [ ] packages/privacy/gdpr/eraseData.ts – Right to be forgotten implementation
• [ ] packages/privacy/cookie-consent/manager.ts – Granular consent management
• [ ] apps/web/app/(marketing)/privacy/page.tsx – Dynamic privacy policy
• [ ] apps/web/app/api/gdpr/export/route.ts – Data export API endpoint
• [ ] scripts/security/penetration-test.sh – Automated security scanning
• [ ] docs/compliance/soc2-readiness.md – Compliance documentation
Relevant Context Files:
• [ ] Manifest: packages/privacy/ (GDPR, cookie consent)
• [ ] Manifest: apps/web/app/(marketing)/privacy/, /cookies/
• [ ] Manifest: Security audit workflows and runbooks
Dependencies: Task 17 (Audit logging), Task 2 (RLS for data isolation), Task 22 (Team management for data ownership)
Advanced Code Patterns:
• GDPR Data Portability: Export function compiles all tenant data (leads, bookings, pages, analytics) into structured JSON or machine-readable format (CSV ZIP); respects RLS ensuring users only export their own tenant data
• Cascading Erasure: eraseData(tenantId) anonymizes PII (email→hash, name→[redacted]) while preserving analytics aggregates; hard deletes after 30-day retention period (configurable); logs erasure in immutable audit log for compliance proof
• Consent Management Platform (CMP): Granular consent categories (Necessary, Analytics, Marketing); store consent decisions with timestamp and version; block GA4/tracking scripts until consent granted; support consent withdrawal with data deletion
• Automated Penetration Testing: Integrate OWASP ZAP or Burp Suite Enterprise into CI/CD pipeline; scan for XSS, SQL injection, broken auth; fail builds on high-severity findings
• Dependency Vulnerability Management: Renovate bot with auto-merge for patches, manual review for minors; pnpm audit in CI with --audit-level moderate; Software Bill of Materials (SBOM) generation for enterprise clients
Sub-tasks:
• [ ] Implement full data export API generating JSON dump of all tenant-specific data (leads, bookings, pages, settings) with download link (24h expiry)
• [ ] Create GDPR erasure flow anonymizing personal data while preserving business metrics (revenue counts, lead volumes with hashed IDs)
• [ ] Build cookie consent banner with granular toggles for Analytics (GA4) and Marketing (Email tracking) with preference storage in database (not just localStorage)
• [ ] Generate dynamic privacy policy page pulling current data practices from code annotations (automated accuracy)
• [ ] Run automated penetration testing suite (OWASP Top 10) against staging environment
• [ ] Complete SOC 2 evidence collection: access control matrices, change management logs, and incident response runbooks
**[ ] Task 31: Final Integration & Marketplace Foundation (Wave 3, Batch 6.3)**
Strategic Objective: Prepare the plugin marketplace architecture for third-party integrations (Zapier, Mailchimp, custom webhooks) and finalize API documentation for public developer consumption.
Targeted Files:
• [ ] packages/integrations/marketplace/zapier/triggers.ts – Zapier integration triggers
• [ ] packages/integrations/marketplace/mailchimp/adapter.ts – Mailchimp sync adapter
• [ ] apps/web/app/api/v1/leads/route.ts – Public REST API (CRUD leads)
• [ ] apps/web/app/api/v1/webhooks/route.ts – Outbound webhook management
• [ ] packages/integrations/adapter.ts – Base adapter class (refactor for public use)
• [ ] docs/api/openapi.yml – OpenAPI specification for public API
Relevant Context Files:
• [ ] Manifest: packages/integrations/marketplace/ (Phase 3)
• [ ] Manifest: packages/integrations/types.ts (adapter interface)
• [ ] Manifest: API routes in apps/web/app/api/
Dependencies: Task 6 (API patterns), Task 14 (Adapter pattern), Task 15 (Webhook infrastructure)
Advanced Code Patterns:
• Public API Versioning: URL versioning (/api/v1/) with backwards compatibility guarantees; deprecation headers for old versions; SDK generation from OpenAPI spec (TypeScript, Python)
• API Key Authentication: HMAC-SHA256 signed requests or Bearer tokens scoped to tenant; keys stored hashed in database; rotation mechanism with grace period (old key valid for 24h after new key generated)
• Webhook Delivery Guarantees: Outbound webhooks to customer endpoints include idempotency keys, exponential backoff retries (5 attempts over 24h), and signature verification (HMAC); dead letter queue for failed deliveries
• Zapier Integration: REST Hooks pattern for instant triggers (new lead, booking created); polling fallback for legacy support; authentication via API key with Zapier UI fields
• Rate Limiting per API Key: 1000 requests/hour per key (configurable per plan); Redis sliding window counter; 429 responses with Retry-After header
Sub-tasks:
• [ ] Refactor integrations adapter pattern to support third-party plugin loading (dynamic imports from secure sandbox)
• [ ] Implement Zapier triggers for "New Lead" and "New Booking" with authentication via API key
• [ ] Create Mailchimp adapter syncing leads to audiences with bidirectional sync (unsubscribe in Mailchimp updates local record)
• [ ] Build public REST API v1 with OpenAPI specification and auto-generated documentation (Swagger UI)
• [ ] Implement outbound webhook management UI (tenant configures URL, selects events, sees delivery logs)
• [ ] Create developer portal with API key management and request logs (self-service for enterprise integrations)
**[ ] Task 32: Launch Readiness & Operational Runbooks (Wave 3, Batch 6.4)**
Strategic Objective: Final deployment preparation including database migration strategy, rollback procedures, monitoring dashboards, and team training materials. The "Go-Live" gate.
Targeted Files:
• [ ] scripts/deploy/production-deploy.sh – Zero-downtime deployment script
• [ ] scripts/db/migrate-production.sh – Migration runner with backups
• [ ] docs/runbooks/database-restore.md – Disaster recovery procedures
• [ ] docs/runbooks/incident-response.md – PagerDuty/Opsgenie integration
• [ ] docs/runbooks/scaling-procedures.md – Horizontal scaling playbooks
• [ ] .github/workflows/production-deploy.yml – Final CI/CD pipeline
• [ ] README.md – Updated with operational status badges
Relevant Context Files:
• [ ] Manifest: scripts/ (deployment, db management)
• [ ] Manifest: docs/runbooks/ (SOC-2 operations)
• [ ] Manifest: .github/workflows/ (CI/CD)
Dependencies: All previous tasks (complete system)
Advanced Code Patterns:
• Blue-Green Deployment: Deploy new version to "green" environment; run smoke tests; switch traffic via Vercel aliases or DNS; keep "blue" running for instant rollback (database schema must be backwards compatible during transition)
• Expand/Contract Database Migrations: Migrations add new columns/tables (expand); application code updates to use new structure; subsequent deployment removes old columns (contract); zero-downtime guarantee
• Database Backup Verification: Automated daily backup restores to staging environment to verify backup integrity; point-in-time recovery (PITR) testing monthly
• Incident Command System: Defined roles (Incident Commander, Scribe, Communications); automated Slack channel creation on P1 incidents; post-mortem template with 24h/48h deadlines
• Graceful Degradation: Feature flags to disable non-critical features (analytics, email campaigns) during high load; circuit breakers to fail fast on external dependencies (Stripe, Cal.com down)
Sub-tasks:
• [ ] Create zero-downtime deployment script with health checks and automatic rollback on failure
• [ ] Document database backup and point-in-time recovery procedures with RTO/RPO targets (Recovery Time/Point Objective)
• [ ] Set up PagerDuty integration for critical alerts (tenant isolation breach, payment processing failure, database connection exhaustion)
• [ ] Write scaling runbooks: when to add read replicas, when to enable connection pooling (PgBouncer), when to shard by tenant ID
• [ ] Conduct disaster recovery drill: simulate database corruption and restore from backup within SLA
• [ ] Create launch checklist: SSL certificates, DNS propagation, CDN cache warming, monitoring dashboards verified, on-call rotation confirmed
End of Strategic Roadmap. Total strategic coverage: 32 major tasks spanning 1,124 files across 24 weeks (6 months), organized into Waves 0-3 with explicit dependencies, automation hooks, and enterprise-grade patterns.
