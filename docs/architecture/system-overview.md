# System Architecture Overview

**Created:** 2026-02-21  
**Role:** Reference Documentation  
**Audience:** Developers, Architects, Contributors  
**Last Reviewed:** 2026-02-21  
**Review Interval:** 90 days

---

## Executive Summary

The marketing-websites platform is a **multi-industry template system** built on a **layered monorepo architecture**. The system enables rapid deployment of client websites through reusable templates, shared components, and configuration-as-code (CaCA) patterns.

### Key Architectural Principles

- **Configuration-as-Code Architecture (CaCA):** Every aspect driven by `site.config.ts`
- **Layered Architecture:** Clear separation of concerns across 7 layers
- **Template-Based Composition:** Industry-specific templates with shared components
- **Multi-Tenancy:** Single codebase serving multiple clients
- **Component-First Development:** Atomic design system with reusable components

---

## System Layers

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)    │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)        │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)             │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)       │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│ ← CURRENT
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### **Layer 0: Infrastructure Layer** `@repo/infra`

- **Multi-tenant SaaS** foundation with security boundaries
- **Edge computing** and global CDN distribution
- **Authentication & Authorization** with OAuth 2.1 + PKCE
- **Middleware** for security headers, CSP, and request processing
- **Logging & Monitoring** with structured telemetry

#### **Layer 1: Data & Analytics Layer** (Future)

- **Real-time Customer Data Platform (CDP)**
- **Attribution tracking** and conversion analytics
- **Behavioral analytics** and user insights
- **Data warehousing** and business intelligence

#### **Layer 2: Component Library** `@repo/ui`, `@repo/marketing-components`

- **Atomic design system** with 68+ UI primitives
- **Marketing components** (Hero, Services, Testimonials)
- **Design tokens** and theme system
- **Component composition patterns** and guidelines

#### **Layer 3: Experience Layer** `@repo/page-templates`, `clients/`

- **Page templates** and routing system
- **Client implementations** and customizations
- **Progressive Web App** capabilities
- **Internationalization** and localization

#### **Layer 4: Content & Asset Layer** (Future)

- **Digital Asset Management (DAM)**
- **Headless CMS** integration
- **Visual editor** for content creation
- **Media optimization** and delivery

#### **Layer 5: Orchestration Layer** (Future)

- **Campaign management** and automation
- **Marketing Resource Management (MRM)**
- **Customer Data Platform (CDP)**
- **Workflow orchestration**

#### **Layer 6: AI & Intelligence Layer** (Future)

- **Agentic workflows** and automation
- **Predictive analytics** and recommendations
- **Content generation** and optimization
- **Personalization engines**

#### **Layer 7: Client Experience Layer** (Future)

- **White-labeled client portals**
- **Custom dashboards** and reporting
- **Client-specific integrations**
- **Multi-brand management**

---

## Repository Structure

```text
marketing-websites/
├── clients/                      # Client implementations
│   ├── testing-not-a-client/     # Single working template
│   └── [future-clients]/         # Industry-specific templates
├── packages/                     # Shared libraries (Layer 0-2)
│   ├── ui/                      # @repo/ui - 68+ UI primitives
│   ├── marketing-components/    # @repo/marketing-components
│   ├── features/                 # @repo/features - 20+ feature modules
│   ├── infra/                   # @repo/infra - Security, middleware
│   ├── integrations/            # 21 integration packages
│   ├── ai-platform/             # AI and content platforms
│   └── config/                  # Build and development config
├── tooling/                     # Development tools
│   ├── create-client/           # Client scaffolding
│   ├── generate-component/     # Component generation
│   └── validation/              # Quality assurance
├── docs/                        # Comprehensive documentation
├── tasks/                       # Task specifications (187+ files)
└── scripts/                     # Build and validation scripts
```

---

## Architecture Patterns

### **Configuration-as-Code (CaCA)**

Every client website is driven by a single `site.config.ts` file:

```typescript
export default {
  // Branding and theming
  brand: {
    name: 'Client Name',
    colors: { primary: '#3b82f6', secondary: '#64748b' },
    typography: { fontFamily: 'Inter, sans-serif' },
  },

  // Feature activation
  features: {
    booking: { enabled: true, provider: 'calendly' },
    blog: { enabled: true, postsPerPage: 10 },
    contact: { enabled: true, provider: 'hubspot' },
  },

  // Integrations
  integrations: {
    analytics: { provider: 'google', trackingId: 'G-XXXXXXXXXX' },
    crm: { provider: 'hubspot', apiKey: 'hubspot-key' },
  },
} satisfies SiteConfig;
```

### **Multi-Tenant Architecture**

**Tenant Isolation Strategy:**

- **Database Level:** Row-Level Security (RLS) with `tenant_id` constraints
- **Application Level:** Required tenant context in all operations
- **API Level:** JWT-based tenant identification
- **Infrastructure Level:** Edge routing and isolation

**Security Boundaries:**

```typescript
// Required tenant context
export async function getBookings(tenantId: string) {
  // Tenant validation and isolation
  validateTenantId(tenantId);
  return await bookingRepository.findByTenant(tenantId);
}
```

### **Component Architecture**

**Atomic Design System:**

```
🧩 Atoms (Button, Input, Icon)
   ↓
🧱 Molecules (FormField, SearchBox)
   ↓
🏗️ Organisms (Header, Footer, Navigation)
   ↓
🎨 Templates (HomePage, ContactPage)
   ↓
📱 Pages (Client-specific implementations)
```

**Component Patterns:**

- **Server Components** by default for performance
- **Client Components** only for interactivity
- **Composition over inheritance**
- **Theme-aware** styling with CSS variables

---

## Technology Stack

### **Core Technologies**

- **Runtime:** Node.js 22+ with pnpm 10.29.2
- **Framework:** Next.js 16.1.5 with App Router
- **UI Library:** React 19.0.0 with Server Components
- **Language:** TypeScript 5.9.3 with strict mode
- **Styling:** Tailwind CSS 4.1.0 with design tokens

### **Infrastructure**

- **Database:** Supabase (PostgreSQL) with RLS
- **Authentication:** OAuth 2.1 with PKCE
- **Deployment:** Edge computing with global CDN
- **Monitoring:** OpenTelemetry and structured logging
- **Security:** CSP headers, rate limiting, audit logging

### **Development Tools**

- **Monorepo:** Turborepo 2.8.10 with caching
- **Linting:** ESLint 9.18.0 with strict rules
- **Testing:** Jest 30.2.0 with React Testing Library
- **Build:** Next.js optimized builds with code splitting
- **Validation:** Automated export and type checking

---

## Design Decisions

### **Why Monorepo?**

- **Shared Code:** Single source of truth for components and features
- **Consistent Tooling:** Unified build, test, and lint processes
- **Atomic Commits:** Coordinated changes across packages
- **Developer Experience:** Simplified dependency management

### **Why Configuration-as-Code?**

- **Repeatability:** Consistent deployments across environments
- **Version Control:** Configuration changes tracked in Git
- **Validation:** Type-safe configuration with TypeScript
- **Flexibility:** Runtime feature activation and deactivation

### **Why Multi-Tenant?**

- **Cost Efficiency:** Shared infrastructure reduces overhead
- **Rapid Deployment:** Single codebase serves multiple clients
- **Consistent Updates:** Security and feature updates applied universally
- **Scalability:** Horizontal scaling with tenant isolation

---

## Performance Architecture

### **Core Web Vitals Optimization**

- **LCP (< 2.5s):** Optimized images, font loading, and critical CSS
- **INP (< 200ms):** Efficient event handling and code splitting
- **CLS (< 0.1):** Stable layout with dimension attributes

### **Rendering Strategy**

- **Server Components:** Default for static content and SEO
- **Client Components:** Interactive elements with 'use client'
- **Streaming:** Progressive content loading with Suspense
- **Edge Computing:** Global distribution for latency reduction

### **Bundle Optimization**

- **Code Splitting:** Route-based and component-based splitting
- **Tree Shaking:** Elimination of unused code
- **Dynamic Imports:** Lazy loading of heavy components
- **Asset Optimization:** Image compression and modern formats

---

## Security Architecture

### **Multi-Layer Security**

1. **Infrastructure Layer:** Edge security, DDoS protection
2. **Application Layer:** Authentication, authorization, input validation
3. **Data Layer:** Encryption at rest and in transit, RLS policies
4. **Network Layer:** HTTPS only, security headers, CSP

### **Authentication & Authorization**

```typescript
// OAuth 2.1 with PKCE flow
export const authConfig = {
  providers: [google, github],
  callbacks: {
    jwt: ({ token, account }) => ({
      ...token,
      tenantId: account.tenantId, // Multi-tenant context
    }),
  },
} satisfies NextAuthConfig;
```

### **Tenant Isolation**

- **Database RLS:** `WHERE tenant_id = auth.tenant_id()`
- **API Validation:** Required tenant context in all endpoints
- **File Storage:** Tenant-isolated storage paths
- **Cache Isolation:** Tenant-specific cache keys

---

## Evolution Roadmap

### **Current State (Layer 0-3)**

✅ **Infrastructure:** Multi-tenant SaaS with security  
✅ **Components:** 68+ UI primitives with design system  
✅ **Experience:** Page templates and client implementations

### **Near Future (Layer 4)**

🔄 **Content Layer:** DAM integration and visual editing  
🔄 **Headless CMS:** Content management and workflow  
🔄 **Media Optimization:** Automated image and video processing

### **Mid Future (Layer 5-6)**

📋 **Orchestration:** Campaign management and automation  
📋 **AI Integration:** Content generation and personalization  
📋 **Analytics:** Real-time CDP and attribution

### **Long Term (Layer 7)**

🎯 **Client Portals:** White-labeled dashboards  
🎯 **Multi-Brand:** Advanced brand management  
🎯 **Enterprise:** Advanced security and compliance

---

## Related Documentation

### **Architecture Deep Dives**

- [**Design Patterns**](design-patterns.md) - Component and system patterns
- [**Infrastructure**](infrastructure.md) - Security, middleware, and deployment
- [**Dependency Management**](dependency-management.md) - Package relationships

### **Implementation Guides**

- [**Module Boundaries**](module-boundaries.md) - Dependency rules and constraints
- [**Dependency Graph**](dependency-graph.md) - Package visualization
- [**Migration Guides**](../migration/) - System evolution paths

### **Security Documentation**

- [**Security Overview**](../security/overview.md) - Security architecture
- [**Multi-Tenant Isolation**](../security/multi-tenant-isolation.md) - Tenant boundaries
- [**Audit Reports**](../security/audit-reports.md) - Security assessments

---

## Contributing to Architecture

### **Design Process**

1. **Proposal:** Create ADR (Architecture Decision Record)
2. **Review:** Technical review with stakeholders
3. **Implementation:** Follow established patterns
4. **Documentation:** Update relevant architecture docs
5. **Validation:** Ensure compliance with architectural principles

### **Change Management**

- **Backward Compatibility:** Maintain API stability
- **Migration Paths:** Provide upgrade documentation
- **Deprecation:** Clear deprecation timelines and guidance
- **Communication:** Announce changes through appropriate channels

---

**Document Last Updated:** 2026-02-21  
**Next Review:** 2026-05-21  
**Maintainers:** Architecture Team  
**Questions:** Create GitHub issue with `architecture` label
