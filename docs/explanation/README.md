# Explanations

*Understanding-oriented conceptual background and architecture decisions*

## Architecture Decisions

### Architecture Decision Records (ADRs)
- [ADR-001: Adopt Next.js 16 with App Router](./adr/001-nextjs-16.md) - Framework selection rationale
- [ADR-002: Multi-Tenant Architecture](./adr/002-multi-tenant.md) - Tenant isolation strategy
- [ADR-003: Feature-Sliced Design (FSD)](./adr/003-fsd-architecture.md) - Code organization principles
- [ADR-004: Supabase as Database Provider](./adr/004-supabase.md) - Database technology choice
- [ADR-005: OAuth 2.1 with PKCE](./adr/005-oauth-21.md) - Authentication strategy

### System Architecture
- [Multi-Tenant SaaS Architecture](./architecture/multi-tenant-saas.md) - Overall system design
- [Feature-Sliced Design Implementation](./architecture/fsd-implementation.md) - FSD layer isolation
- [Database Architecture](./architecture/database.md) - Data persistence strategy
- [Security Architecture](./architecture/security.md) - Security design principles

## Design Principles

### Core Principles
- [Documentation-First Development](./principles/docs-first.md) - Documentation as prerequisite
- [Security by Design](./principles/security-first.md) - Security as foundational requirement
- [Performance by Design](./principles/performance-first.md) - Performance optimization principles
- [Accessibility by Design](./principles/a11y-first.md) - Accessibility as default

### Development Philosophy
- [Feature-Sliced Design Philosophy](./philosophy/fsd.md) - FSD methodology and benefits
- [Multi-Agent Orchestration](./philosophy/agent-orchestration.md) - AI agent coordination
- [Zero-Trust Architecture](./philosophy/zero-trust.md) - Security model philosophy
- [Progressive Enhancement](./philosophy/progressive-enhancement.md) - Enhancement strategy

## Technical Context

### Technology Stack
- [Next.js 16 Rationale](./technology/nextjs-16.md) - Framework selection and benefits
- [React 19 Server Components](./technology/react-19-server.md) - Server component strategy
- [TypeScript Strict Mode](./technology/typescript-strict.md) - Type safety philosophy
- [Turborepo Build System](./technology/turborepo.md) - Monorepo build strategy

### Integration Patterns
- [OAuth 2.1 Integration Patterns](./patterns/oauth-21.md) - Modern authentication patterns
- [Multi-Tenant Data Isolation](./patterns/tenant-isolation.md) - Data separation strategies
- [API Gateway Patterns](./patterns/api-gateway.md) - API management patterns
- [Event-Driven Architecture](./patterns/event-driven.md) - Asynchronous communication

## Business Context

### Business Model
- [Multi-Tenant SaaS Model](./business/multi-tenant-saas.md) - Business architecture
- [Agency Client Model](./business/agency-client.md) - Client management strategy
- [Platform-as-a-Service (PaaS)](./business/paas.md) - Platform strategy
- [Revenue Model](./business/revenue.md) - Monetization strategy

### Compliance & Governance
- [GDPR Compliance Strategy](./compliance/gdpr.md) - Data protection compliance
- [SOC 2 Compliance](./compliance/soc2.md) - Security compliance framework
- [HIPAA Considerations](./compliance/hipaa.md) - Healthcare data protection
- [Accessibility Compliance (WCAG 2.2)](./compliance/wcag-22.md) - Accessibility legal requirements

## Operational Context

### Development Operations
- [CI/CD Pipeline Philosophy](./operations/ci-cd.md) - Automation strategy
- [Testing Philosophy](./operations/testing.md) - Quality assurance approach
- [Monitoring Strategy](./operations/monitoring.md) - Observability philosophy
- [Incident Response Philosophy](./operations/incident-response.md) - Incident handling approach

### Performance & Scalability
- [Performance Optimization Philosophy](./performance/optimization.md) - Performance strategy
- [Scalability Architecture](./performance/scalability.md) - Scaling strategy
- [Core Web Vitals Strategy](./performance/core-web-vitals.md) - User experience metrics
- [Bundle Size Optimization](./performance/bundle-size.md) - Asset optimization strategy
