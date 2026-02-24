# 🗺️ Code Map & Architecture Visualization

> **Interactive navigation and architectural diagrams for the marketing websites monorepo**

This document provides comprehensive code maps and architectural diagrams to help developers navigate, understand, and work with the marketing websites platform effectively.

---

## 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Edge Layer"
        E1[Vercel Edge Network]
        E2[Edge Middleware]
        E3[Tenant Resolution]
    end

    subgraph "Application Layer"
        A1[Admin Dashboard]
        A2[Client Portal]
        A3[Marketing Web]
    end

    subgraph "Package Layer"
        P1[UI Components]
        P2[Business Features]
        P3[Infrastructure]
        P4[Integrations]
        P5[Shared Utilities]
    end

    subgraph "Data Layer"
        D1[Supabase PostgreSQL]
        D2[Redis Cache]
        D3[Tinybird Analytics]
        D4[File Storage]
    end

    subgraph "Third-party Services"
        T1[Stripe Payments]
        T2[HubSpot CRM]
        T3[Cal.com Scheduling]
        T4[Resend Email]
        T5[Sentry Monitoring]
    end

    E1 --> E2
    E2 --> E3
    E3 --> A1
    E3 --> A2
    E3 --> A3

    A1 --> P1
    A1 --> P2
    A1 --> P3
    A2 --> P1
    A2 --> P2
    A2 --> P3
    A3 --> P1
    A3 --> P2
    A3 --> P3

    P2 --> P4
    P3 --> P5
    P4 --> D1
    P3 --> D2
    P2 --> D3
    P1 --> D4

    P4 --> T1
    P4 --> T2
    P4 --> T3
    P4 --> T4
    P3 --> T5
```

---

## 🎨 Feature-Sliced Design (FSD) Architecture

```mermaid
graph TD
    subgraph "App Layer"
        APP1[app/layout.tsx]
        APP2[app/page.tsx]
        APP3[app/dashboard/page.tsx]
        APP4[app/loading.tsx]
    end

    subgraph "Pages Layer"
        PAGE1[pages/HomePage/]
        PAGE2[pages/DashboardPage/]
        PAGE3[pages/BookingPage/]
        PAGE4[pages/_templates/]
    end

    subgraph "Widgets Layer"
        WIDGET1[widgets/BookingWidget/]
        WIDGET2[widgets/LeadFormWidget/]
        WIDGET3[widgets/AnalyticsWidget/]
        WIDGET4[widgets/_templates/]
    end

    subgraph "Features Layer"
        FEATURE1[features/booking/]
        FEATURE2[features/lead-management/]
        FEATURE3[features/analytics/]
        FEATURE4[features/auth/]
        FEATURE5[features/_templates/]
    end

    subgraph "Entities Layer"
        ENTITY1[entities/user/]
        ENTITY2[entities/tenant/]
        ENTITY3[entities/booking/]
        ENTITY4[entities/lead/]
        ENTITY5[entities/_templates/]
    end

    subgraph "Shared Layer"
        SHARED1[shared/lib/]
        SHARED2[shared/types/]
        SHARED3[shared/config/]
        SHARED4[shared/ui/]
    end

    APP1 --> PAGE1
    APP2 --> PAGE2
    APP3 --> PAGE3
    APP4 --> PAGE4

    PAGE1 --> WIDGET1
    PAGE2 --> WIDGET2
    PAGE3 --> WIDGET3
    PAGE4 --> WIDGET4

    WIDGET1 --> FEATURE1
    WIDGET2 --> FEATURE2
    WIDGET3 --> FEATURE3
    WIDGET4 --> FEATURE5

    FEATURE1 --> ENTITY3
    FEATURE2 --> ENTITY4
    FEATURE3 --> ENTITY1
    FEATURE4 --> ENTITY2
    FEATURE5 --> ENTITY5

    ENTITY1 --> SHARED1
    ENTITY2 --> SHARED2
    ENTITY3 --> SHARED3
    ENTITY4 --> SHARED4
    ENTITY5 --> SHARED1

    %% Cross-slice imports with @x notation
    WIDGET1 -.->|@x/ui/shared| SHARED4
    FEATURE1 -.->|@x/entities/booking| ENTITY3
    PAGE2 -.->|@x/features/analytics| FEATURE3
```

---

## 📦 Package Dependency Map

```mermaid
graph LR
    subgraph "Applications"
        APP_ADMIN[apps/admin]
        APP_PORTAL[apps/portal]
        APP_WEB[apps/web]
    end

    subgraph "Core Packages"
        PKG_UI[packages/ui]
        PKG_FEATURES[packages/features]
        PKG_INFRA[packages/infrastructure]
        PKG_SHARED[packages/shared]
    end

    subgraph "Integration Packages"
        PKG_INTEGRATIONS[packages/integrations]
        PKG_ANALYTICS[packages/analytics]
        PKG_BILLING[packages/billing]
        PKG_BOOKINGS[packages/bookings]
        PKG_EMAIL[packages/email]
    end

    subgraph "Config Packages"
        PKG_CONFIG[packages/config-schema]
        PKG_VALIDATION[packages/validation]
    end

    subgraph "External Dependencies"
        EXT_SUPABASE[Supabase]
        EXT_STRIPE[Stripe]
        EXT_HUBSPOT[HubSpot]
        EXT_CALCOM[Cal.com]
        EXT_RESEND[Resend]
        EXT_SENTRY[Sentry]
    end

    APP_ADMIN --> PKG_UI
    APP_ADMIN --> PKG_FEATURES
    APP_ADMIN --> PKG_INFRA

    APP_PORTAL --> PKG_UI
    APP_PORTAL --> PKG_FEATURES
    APP_PORTAL --> PKG_BOOKINGS
    APP_PORTAL --> PKG_ANALYTICS

    APP_WEB --> PKG_UI
    APP_WEB --> PKG_FEATURES
    APP_WEB --> PKG_CONFIG

    PKG_UI --> PKG_SHARED
    PKG_UI --> PKG_INFRA

    PKG_FEATURES --> PKG_BOOKINGS
    PKG_FEATURES --> PKG_ANALYTICS
    PKG_FEATURES --> PKG_EMAIL
    PKG_FEATURES --> PKG_SHARED

    PKG_INFRA --> PKG_SHARED
    PKG_INFRA --> EXT_SUPABASE
    PKG_INFRA --> EXT_SENTRY

    PKG_INTEGRATIONS --> EXT_STRIPE
    PKG_INTEGRATIONS --> EXT_HUBSPOT
    PKG_INTEGRATIONS --> EXT_CALCOM
    PKG_INTEGRATIONS --> EXT_RESEND

    PKG_BOOKINGS --> PKG_INFRA
    PKG_ANALYTICS --> PKG_INFRA
    PKG_BILLING --> PKG_INFRA
    PKG_EMAIL --> PKG_INFRA

    PKG_CONFIG --> PKG_VALIDATION
    PKG_VALIDATION --> PKG_SHARED
```

---

## 🔒 Security Architecture Diagram

```mermaid
graph TB
    subgraph "Layer 1: Edge Security"
        EDGE1[Edge Middleware]
        EDGE2[Tenant Resolution]
        EDGE3[Rate Limiting]
        EDGE4[Security Headers]
    end

    subgraph "Layer 2: Application Security"
        APP1[OAuth 2.1 + PKCE]
        APP2[Server Action Security]
        APP3[Tenant Context Validation]
        APP4[Input Validation]
    end

    subgraph "Layer 3: Database Security"
        DB1[Row Level Security]
        DB2[Tenant Isolation]
        DB3[Connection Pooling]
        DB4[Audit Logging]
    end

    subgraph "Layer 4: Infrastructure Security"
        INFRA1[Secrets Management]
        INFRA2[Network Isolation]
        INFRA3[Compliance Monitoring]
        INFRA4[Backup Encryption]
    end

    subgraph "External Security"
        EXT1[Sentry Monitoring]
        EXT2[Vulnerability Scanning]
        EXT3[Compliance Audits]
        EXT4[Security Headers]
    end

    EDGE1 --> EDGE2
    EDGE2 --> EDGE3
    EDGE3 --> EDGE4
    EDGE4 --> APP1

    APP1 --> APP2
    APP2 --> APP3
    APP3 --> APP4
    APP4 --> DB1

    DB1 --> DB2
    DB2 --> DB3
    DB3 --> DB4
    DB4 --> INFRA1

    INFRA1 --> INFRA2
    INFRA2 --> INFRA3
    INFRA3 --> INFRA4

    APP2 --> EXT1
    INFRA3 --> EXT2
    INFRA3 --> EXT3
    EDGE4 --> EXT4
```

---

## 📊 Multi-Tenant Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client as Client Request
    participant Edge as Edge Middleware
    participant Cache as Redis Cache
    participant Auth as Auth Service
    participant DB as Supabase DB
    participant Analytics as Tinybird
    participant Monitor as Sentry

    Client->>Edge: HTTP Request
    Edge->>Edge: Extract Tenant Info
    Edge->>Cache: Check Tenant Cache

    alt Cache Hit
        Cache-->>Edge: Tenant Data
    else Cache Miss
        Edge->>DB: Query Tenant
        DB-->>Edge: Tenant Data
        Edge->>Cache: Cache Tenant (5min TTL)
    end

    Edge->>Auth: Validate JWT
    Auth-->>Edge: Tenant Context

    Edge->>DB: Execute Query (RLS)
    DB->>DB: Apply RLS Policy
    DB-->>Edge: Tenant-Isolated Data

    Edge->>Analytics: Log Event
    Edge->>Monitor: Track Performance

    Edge-->>Client: Response (Tenant-Scoped)
```

---

## 🔌 Integration Flow Diagram

```mermaid
graph TB
    subgraph "OAuth Integration Flow"
        OAUTH1[Client Request]
        OAUTH2[Auth URL Generation]
        OAUTH3[User Redirect]
        OAUTH4[Callback Handling]
        OAUTH5[Token Exchange]
        OAUTH6[Token Storage]
    end

    subgraph "Webhook Processing"
        WEB1[Incoming Webhook]
        WEB2[Signature Verification]
        WEB3[Event Processing]
        WEB4[Business Logic]
        WEB5[Audit Logging]
    end

    subgraph "API Integration"
        API1[API Request]
        API2[Rate Limiting]
        API3[Authentication]
        API4[Data Processing]
        API5[Response Formatting]
    end

    subgraph "Data Synchronization"
        SYNC1[Trigger Event]
        SYNC2[Queue Message]
        SYNC3[Process Data]
        SYNC4[Update Local]
        SYNC5[Notify Systems]
    end

    OAUTH1 --> OAUTH2
    OAUTH2 --> OAUTH3
    OAUTH3 --> OAUTH4
    OAUTH4 --> OAUTH5
    OAUTH5 --> OAUTH6

    WEB1 --> WEB2
    WEB2 --> WEB3
    WEB3 --> WEB4
    WEB4 --> WEB5

    API1 --> API2
    API2 --> API3
    API3 --> API4
    API4 --> API5

    SYNC1 --> SYNC2
    SYNC2 --> SYNC3
    SYNC3 --> SYNC4
    SYNC4 --> SYNC5
```

---

## 📁 File Structure Map

### **Applications (`apps/`)**

```
apps/
├── admin/                    # Admin dashboard
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Admin-specific components
│   │   └── lib/             # Admin utilities
│   ├── package.json
│   └── README.md
├── portal/                   # Client portal
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── features/        # Portal features
│   │   └── api/             # API routes
│   ├── package.json
│   └── README.md
└── web/                      # Marketing site template
    ├── src/
    │   ├── app/             # App Router
    │   ├── components/      # Web components
    │   └── styles/          # Global styles
    ├── package.json
    └── README.md
```

### **Packages (`packages/`)**

```
packages/
├── ui/                       # UI components library
│   ├── src/
│   │   ├── app/             # App layer components
│   │   ├── pages/           # Pages layer
│   │   ├── widgets/         # Widgets layer
│   │   ├── features/        # Features layer
│   │   ├── entities/        # Entities layer
│   │   └── shared/          # Shared layer
│   ├── package.json
│   └── README.md
├── infrastructure/           # Core infrastructure
│   ├── src/
│   │   ├── auth/            # Authentication
│   │   ├── security/        # Security utilities
│   │   ├── monitoring/      # Monitoring setup
│   │   └── context/         # Request context
│   ├── package.json
│   └── README.md
├── features/                 # Business features
│   ├── src/
│   │   ├── booking/         # Booking system
│   │   ├── lead-management/  # Lead management
│   │   ├── analytics/       # Analytics features
│   │   └── auth/            # Authentication features
│   ├── package.json
│   └── README.md
├── integrations/             # Third-party integrations
│   ├── stripe/              # Payment processing
│   ├── hubspot/             # CRM integration
│   ├── calcom/              # Scheduling
│   ├── resend/              # Email service
│   └── analytics/           # Analytics providers
├── shared/                   # Shared utilities
│   ├── src/
│   │   ├── lib/             # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration
│   │   └── ui/              # UI utilities
│   ├── package.json
│   └── README.md
└── [other packages...]       # Additional packages
```

### **Clients (`clients/`)**

```
clients/
├── client-name-1/            # Individual client site
│   ├── app/                 # Next.js application
│   ├── content/             # Client content
│   ├── site.config.ts       # Client configuration
│   ├── package.json
│   └── README.md
├── client-name-2/            # Another client site
└── testing-not-a-client/     # Test client
```

---

## 🔄 Request Flow Diagram

```mermaid
flowchart TD
    A[Client Request] --> B{Request Type}

    B -->|Static Content| C[Edge Cache]
    B -->|Dynamic Content| D[Edge Middleware]
    B -->|API Request| E[API Route]

    C --> F[CDN Response]

    D --> G[Tenant Resolution]
    G --> H[Rate Limiting]
    H --> I[Security Headers]
    I --> J[Next.js App Router]

    J --> K{Page Type}
    K -->|Server Component| L[Direct Rendering]
    K -->|Client Component| M[Client Hydration]

    L --> N[Data Fetching]
    M --> O[Client-Side Logic]

    N --> P[Database Query]
    O --> Q[API Calls]

    P --> R[Supabase RLS]
    Q --> S[External APIs]

    R --> T[Tenant-Scoped Data]
    S --> U[Integration Response]

    T --> V[Response Assembly]
    U --> V
    V --> W[HTTP Response]

    E --> X[Server Action]
    X --> Y[Security Validation]
    Y --> Z[Business Logic]
    Z --> AA[Database Update]
    AA --> BB[JSON Response]

    F --> CC[Client]
    W --> CC
    BB --> CC
```

---

## 🎯 Component Interaction Map

```mermaid
graph LR
    subgraph "UI Components"
        UI1[Button]
        UI2[Input]
        UI3[Modal]
        UI4[Form]
        UI5[Table]
    end

    subgraph "Business Components"
        BIZ1[BookingWidget]
        BIZ2[LeadFormWidget]
        BIZ3[AnalyticsWidget]
        BIZ4[UserDashboard]
        BIZ5[TenantSettings]
    end

    subgraph "Data Components"
        DATA1[DataTable]
        DATA2[Chart]
        DATA3[Calendar]
        DATA4[KPICard]
        DATA5[StatusIndicator]
    end

    subgraph "Layout Components"
        LAYOUT1[Header]
        LAYOUT2[Sidebar]
        LAYOUT3[Footer]
        LAYOUT4[Container]
        LAYOUT5[Grid]
    end

    UI1 --> BIZ1
    UI2 --> BIZ2
    UI3 --> BIZ3
    UI4 --> BIZ4
    UI5 --> BIZ5

    BIZ1 --> DATA1
    BIZ2 --> DATA3
    BIZ3 --> DATA2
    BIZ4 --> DATA4
    BIZ5 --> DATA5

    DATA1 --> LAYOUT4
    DATA2 --> LAYOUT5
    DATA3 --> LAYOUT4
    DATA4 --> LAYOUT4
    DATA5 --> LAYOUT4

    LAYOUT1 --> LAYOUT4
    LAYOUT2 --> LAYOUT4
    LAYOUT3 --> LAYOUT4
```

---

## 📊 Performance Architecture

```mermaid
graph TB
    subgraph "Edge Performance"
        EDGE1[Global CDN]
        EDGE2[Edge Functions]
        EDGE3[Cache Headers]
        EDGE4[Image Optimization]
    end

    subgraph "Application Performance"
        APP1[Code Splitting]
        APP2[Lazy Loading]
        APP3[Tree Shaking]
        APP4[Bundle Analysis]
    end

    subgraph "Database Performance"
        DB1[Connection Pooling]
        DB2[Query Optimization]
        DB3[Index Strategy]
        DB4[Read Replicas]
    end

    subgraph "Cache Performance"
        CACHE1[Redis Cache]
        CACHE2[Browser Cache]
        CACHE3[CDN Cache]
        CACHE4[Application Cache]
    end

    subgraph "Monitoring"
        MON1[Core Web Vitals]
        MON2[Performance Budgets]
        MON3[Real User Monitoring]
        MON4[Synthetic Monitoring]
    end

    EDGE1 --> APP1
    EDGE2 --> APP2
    EDGE3 --> APP3
    EDGE4 --> APP4

    APP1 --> DB1
    APP2 --> DB2
    APP3 --> DB3
    APP4 --> DB4

    DB1 --> CACHE1
    DB2 --> CACHE2
    DB3 --> CACHE3
    DB4 --> CACHE4

    CACHE1 --> MON1
    CACHE2 --> MON2
    CACHE3 --> MON3
    CACHE4 --> MON4
```

---

## 🔍 Development Workflow

```mermaid
graph LR
    subgraph "Development"
        DEV1[Local Development]
        DEV2[Hot Reload]
        DEV3[Type Checking]
        DEV4[Linting]
    end

    subgraph "Testing"
        TEST1[Unit Tests]
        TEST2[Integration Tests]
        TEST3[E2E Tests]
        TEST4[Accessibility Tests]
    end

    subgraph "Build & Deploy"
        BUILD1[Turbo Build]
        BUILD2[Bundle Analysis]
        BUILD3[Security Scan]
        BUILD4[Deploy to Vercel]
    end

    subgraph "Monitoring"
        MON1[Error Tracking]
        MON2[Performance Monitoring]
        MON3[Uptime Monitoring]
        MON4[Analytics]
    end

    DEV1 --> TEST1
    DEV2 --> TEST2
    DEV3 --> TEST3
    DEV4 --> TEST4

    TEST1 --> BUILD1
    TEST2 --> BUILD2
    TEST3 --> BUILD3
    TEST4 --> BUILD4

    BUILD1 --> MON1
    BUILD2 --> MON2
    BUILD3 --> MON3
    BUILD4 --> MON4
```

---

## 📋 Quick Navigation Guide

### **For New Developers**

1. **Start with README.md** - Project overview and setup
2. **Review DESIGN.md** - Architecture and patterns
3. **Explore CODEMAP.md** - This file for navigation
4. **Check TODO.md** - Current tasks and priorities

### **For Feature Development**

1. **Identify FSD layer** for your feature
2. **Check package dependencies** in dependency map
3. **Review security patterns** in security diagram
4. **Follow integration flows** for external services

### **For Bug Fixing**

1. **Use request flow diagram** to trace issues
2. **Check component interactions** for UI problems
3. **Review data flow** for data-related issues
4. **Consult performance architecture** for optimization

### **For Operations**

1. **Monitor security architecture** for threats
2. **Review performance metrics** for optimization
3. **Check integration flows** for service issues
4. **Use development workflow** for deployments

---

## 🛠️ Tools and Commands

### **Code Navigation**

```bash
# Find package dependencies
pnpm why <package-name>

# Check circular dependencies
pnpm madge:circular

# Validate FSD architecture
pnpm lint:fsd

# Analyze bundle size
pnpm analyze
```

### **Architecture Validation**

```bash
# Validate workspace structure
pnpm validate:workspaces

# Check package exports
pnpm validate-exports

# Validate configurations
pnpm validate:configs

# Check documentation
pnpm validate-docs
```

### **Performance Analysis**

```bash
# Build performance report
pnpm build:workaround

# Test performance
pnpm test:e2e

# Accessibility test
pnpm test:a11y

# Bundle analysis
pnpm analyze
```

---

_This code map provides comprehensive navigation and architectural visualization. Regular updates ensure it stays synchronized with the evolving codebase._
