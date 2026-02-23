# Marketing Websites Monorepo - Domain Structure

This directory contains the complete breakdown of the 2026 Definitive Strategy Guide, organized by domains for easier navigation and implementation.

## Domain Structure

### Domain 1: Monorepo Foundation

- **Focus:** Workspace configuration, build tooling, directory structure
- **Priority:** P0 (Week 1)
- **Sections:** Core Philosophy, pnpm Workspace, Turborepo, Directory Structure, Renovate, Git Branching, Turborepo vs Nx

### Domain 2: The Complete `site.config.ts` Schema

- **Focus:** Configuration-as-code for tenant customization
- **Priority:** P0 (Week 1)
- **Sections:** Philosophy, Full Zod Schema, Schema Validation, AI Agent Integration

### Domain 3: Feature-Sliced Design v2.1

- **Focus:** Architectural pattern for scalable feature development
- **Priority:** P0 (Week 1)
- **Sections:** Why FSD, Layer Structure, Slices, Public API, Steiger Linting

### Domain 4: Security (Defense in Depth)

- **Focus:** Multi-layered security architecture
- **Priority:** P0 (Week 1)
- **Sections:** Middleware, Server Actions, RLS Policies, Audit Logging, Rate Limiting

### Domain 5: Performance Engineering

- **Focus:** Core Web Vitals optimization and perceived performance
- **Priority:** P0 (Week 1)
- **Sections:** Next.js Config, Bundle Analysis, Image Optimization, Caching Strategy

### Domain 6: Data Architecture

- **Focus:** Database design, connection pooling, data modeling
- **Priority:** P0 (Week 1)
- **Sections:** Philosophy, Connection Pooling, Schema Design, Migrations

### Domain 7: Multi-Tenancy

- **Focus:** Tenant isolation, context management, security
- **Priority:** P0 (Week 1)
- **Sections:** Philosophy, Tenant Resolution, Context Propagation, RLS Implementation

### Domain 8: SEO & GEO Engineering

- **Focus:** Search optimization, local SEO, structured data
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Schema.org, Local SEO, Core Web Vitals Impact

### Domain 9: Lead Capture & Attribution

- **Focus:** Conversion tracking, lead management, analytics
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Form Strategy, Attribution Models, CRM Integration

### Domain 10: Real-time Dashboard

- **Focus:** Live data visualization, monitoring
- **Priority:** P1 (Week 2)
- **Sections:** Supabase Realtime, Dashboard Components, Data Streaming

### Domain 11: Billing & Subscriptions

- **Focus:** Stripe integration, subscription management
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Stripe Setup, Webhook Handling, Billing Logic

### Domain 12: Background Jobs & Async Processing

- **Focus:** Queue management, scheduled tasks
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Queue Setup, Job Types, Error Handling

### Domain 13: Observability & Error Tracking

- **Focus:** Monitoring, logging, error tracking
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, OpenTelemetry, Sentry Integration, Dashboard Setup

### Domain 14: Accessibility (WCAG 2.2 AA + ADA Title II)

- **Focus:** Compliance, inclusive design
- **Priority:** P0 (Week 1)
- **Sections:** Why P0 in 2026, Compliance Checklist, Testing Strategy

### Domain 15: Security Hardening

- **Focus:** Advanced security measures
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Hardening Checklist, Security Headers

### Domain 16: CI/CD Pipeline

- **Focus:** Automated deployment, testing
- **Priority:** P0 (Week 1)
- **Sections:** Philosophy, GitHub Actions, Deployment Strategy

### Domain 17: Client Onboarding Wizard

- **Focus:** New tenant setup process
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Wizard Steps, Automation

### Domain 18: Super Admin Panel

- **Focus:** Agency management interface
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Admin Features, User Management

### Domain 19: Booking Calendar System

- **Focus:** Cal.com integration, scheduling
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Cal.com Setup, Webhook Processing

### Domain 20: Email System (Resend + React Email 5)

- **Focus:** Email templates, delivery
- **Priority:** P0 (Week 1)
- **Sections:** Philosophy, Template Design, Delivery Configuration

### Domain 21: Asset Management (Images + Uploads)

- **Focus:** File handling, optimization
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, Storage Setup, Image Processing

### Domain 22: AI Chat Widget

- **Focus:** AI integration, chat functionality
- **Priority:** P1 (Week 2)
- **Sections:** Philosophy, AI Setup, RAG Implementation

## Implementation Priority

**Week 1 (P0):** Domains 1, 2, 3, 4, 5, 6, 7, 14, 16, 20
**Week 2 (P1):** Domains 8, 9, 10, 11, 12, 13, 15, 17, 18, 19, 21, 22

## Usage

Each domain folder contains:

- `README.md` - Domain overview and navigation
- Individual section files (e.g., `01-core-philosophy.md`)
- Implementation-ready code examples
- Configuration files
- Testing strategies

Start with Domain 1 and work through domains in priority order for optimal development workflow.
