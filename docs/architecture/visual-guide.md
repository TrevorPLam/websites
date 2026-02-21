<!--
/**
 * @file docs/architecture/visual-guide.md
 * @role docs
 * @summary Visual guides and diagrams for understanding the platform architecture.
 *
 * @entrypoints
 * - Referenced from architecture overview
 * - Visual learning resource
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/architecture/README.md (architecture overview)
 * - docs/architecture/module-boundaries.md (dependency rules)
 *
 * @used_by
 * - Developers learning the architecture
 * - Architects making design decisions
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: architecture concepts
 * - outputs: visual understanding
 *
 * @invariants
 * - Diagrams must accurately represent the system
 * - Visual guides must be kept up-to-date
 *
 * @gotchas
 * - Diagrams are simplified representations
 * - Actual implementation may have additional details
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add interactive diagrams
 * - Create video walkthroughs
 *
 * @verification
 * - ✅ Diagrams verified against codebase structure
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Visual Architecture Guide

**Last Updated:** 2026-02-18  
**Status:** Active Guide  
**Related:** [Architecture Overview](README.md), [Module Boundaries](module-boundaries.md)

---

This guide provides visual representations of key architectural concepts, flows, and relationships in the marketing-websites platform.

## Layer Architecture

### Seven-Layer Model

```mermaid
graph TB
    subgraph L7[Layer 7: Client Experience]
        CE[White-labeled Client Portals]
    end

    subgraph L6[Layer 6: AI & Intelligence]
        AI[Agentic Workflows, Predictive]
    end

    subgraph L5[Layer 5: Orchestration]
        ORCH[Campaign Management, MRM, CDP]
    end

    subgraph L4[Layer 4: Content & Asset]
        DAM[DAM, Headless CMS, Visual Edit]
    end

    subgraph L3[Layer 3: Experience]
        EXP[Composed Sites, Apps, PWA]
    end

    subgraph L2[Layer 2: Component Library]
        COMP[Atomic Design System]
    end

    subgraph L1[Layer 1: Data & Analytics]
        DATA[Real-time CDP, Attribution]
    end

    subgraph L0[Layer 0: Infrastructure]
        INFRA[Multi-tenant SaaS, Edge, Security]
    end

    L7 --> L6
    L6 --> L5
    L5 --> L4
    L4 --> L3
    L3 --> L2
    L2 --> L1
    L1 --> L0

    style L0 fill:#e8f5e9
    style L1 fill:#f1f8e9
    style L2 fill:#fff9c4
    style L3 fill:#fff3e0
    style L4 fill:#fce4ec
    style L5 fill:#f3e5f5
    style L6 fill:#e1f5fe
    style L7 fill:#e0f2f1
```

**Current Implementation Status:**

- ✅ Layer 0: Infrastructure (@repo/infra)
- ✅ Layer 2: Component Library (@repo/ui)
- ✅ Layer 3: Experience (Templates/Clients)
- 🔄 Layer 1, 4, 5, 6, 7: Future phases

## Package Relationships

### Package Dependency Graph

```mermaid
graph LR
    subgraph Templates[Templates]
        T1[Hair Salon]
        T2[Restaurant]
        T3[Law Firm]
    end

    subgraph Clients[Clients]
        C1[Client A]
        C2[Client B]
    end

    subgraph Packages[Shared Packages]
        UI[@repo/ui]
        FEAT[@repo/features]
        INFRA[@repo/infra]
        TYPES[@repo/types]
        INTEG[@repo/integrations]
        UTILS[@repo/utils]
    end

    T1 --> UI
    T1 --> FEAT
    T1 --> INFRA
    T1 --> TYPES
    T1 --> INTEG

    T2 --> UI
    T2 --> FEAT
    T2 --> INFRA

    C1 --> T1
    C2 --> T2

    FEAT --> UI
    FEAT --> TYPES
    FEAT --> INFRA

    INTEG --> INFRA

    style Templates fill:#e3f2fd
    style Clients fill:#c8e6c9
    style Packages fill:#fff3e0
```

## Request Lifecycle

### Complete Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Browser
    participant CDN as CDN/Edge
    participant MW as Edge Middleware
    participant NextJS as Next.js App Router
    participant Page as Page Template
    participant Feature as Feature Component
    participant UI as UI Component
    participant Infra as Infrastructure
    participant DB as Database
    participant API as External API

    User->>Browser: Navigate to URL
    Browser->>CDN: Request Page
    CDN->>MW: Forward Request
    MW->>MW: Authenticate
    MW->>MW: Rate Limit Check
    MW->>NextJS: Route Request
    NextJS->>Page: Load Page Template
    Page->>Feature: Load Features
    Feature->>UI: Render Components
    UI->>Infra: Request Data
    Infra->>DB: Query Database
    DB-->>Infra: Return Data
    Infra->>API: External API Call
    API-->>Infra: API Response
    Infra-->>UI: Processed Data
    UI-->>Feature: Rendered UI
    Feature-->>Page: Page Content
    Page-->>NextJS: HTML Stream
    NextJS-->>MW: Response
    MW-->>CDN: Cached Response
    CDN-->>Browser: Deliver Content
    Browser-->>User: Display Page
```

## Configuration Flow

### Site Configuration Processing

```mermaid
flowchart TD
    Start([site.config.ts]) --> Validate[Type Validation]
    Validate -->|Invalid| Error[Show Error]
    Validate -->|Valid| Parse[Parse Configuration]
    Parse --> Theme[Extract Theme]
    Parse --> Features[Extract Features]
    Parse --> Pages[Extract Pages]

    Theme --> Inject[Inject Theme Variables]
    Features --> Select[Select Feature Components]
    Pages --> Compose[Compose Page Structure]

    Inject --> Build[Build Process]
    Select --> Build
    Compose --> Build

    Build --> Optimize[Optimize Assets]
    Optimize --> Deploy[Deploy to Production]

    Error --> Fix[Fix Configuration]
    Fix --> Start

    style Start fill:#e1f5ff
    style Deploy fill:#c8e6c9
    style Error fill:#ffcdd2
```

## Component Composition

### Atomic Design Hierarchy

```mermaid
graph TD
    subgraph Atoms[Atoms - UI Primitives]
        Button[Button]
        Input[Input]
        Label[Label]
        Icon[Icon]
    end

    subgraph Molecules[Molecules - Simple Components]
        FormField[FormField]
        Card[Card]
        Badge[Badge]
    end

    subgraph Organisms[Organisms - Complex Components]
        ContactForm[ContactForm]
        BookingWidget[BookingWidget]
        BlogPost[BlogPost]
    end

    subgraph Features[Features - Business Logic]
        BookingFeature[Booking Feature]
        ContactFeature[Contact Feature]
        BlogFeature[Blog Feature]
    end

    subgraph Templates[Templates - Page Layouts]
        HomePage[Home Page]
        ServicesPage[Services Page]
        ContactPage[Contact Page]
    end

    FormField --> Button
    FormField --> Input
    FormField --> Label

    ContactForm --> FormField
    ContactForm --> Button

    BookingWidget --> FormField
    BookingWidget --> Card

    ContactFeature --> ContactForm
    BookingFeature --> BookingWidget
    BlogFeature --> BlogPost

    HomePage --> BookingFeature
    HomePage --> ContactFeature
    ServicesPage --> BookingFeature
    ContactPage --> ContactFeature

    style Atoms fill:#e8f5e9
    style Molecules fill:#fff9c4
    style Organisms fill:#fff3e0
    style Features fill:#fce4ec
    style Templates fill:#e3f2fd
```

## Deployment Architecture

### Multi-Client Deployment Model

```mermaid
graph TB
    subgraph Repo[Git Repository]
        Code[Source Code]
        Config[Configurations]
    end

    subgraph Build[Build Pipeline]
        CI[CI/CD]
        Test[Tests]
        Build[Build Process]
    end

    subgraph Deploy[Deployment]
        Vercel[Vercel]
        Netlify[Netlify]
        Docker[Docker]
        SelfHost[Self-Hosted]
    end

    subgraph Clients[Client Websites]
        C1[client-a.com]
        C2[client-b.com]
        C3[client-c.com]
        C4[client-d.com]
    end

    Code --> CI
    Config --> CI
    CI --> Test
    Test --> Build
    Build --> Vercel
    Build --> Netlify
    Build --> Docker
    Build --> SelfHost

    Vercel --> C1
    Netlify --> C2
    Docker --> C3
    SelfHost --> C4

    style Repo fill:#e3f2fd
    style Build fill:#fff3e0
    style Deploy fill:#f1f8e9
    style Clients fill:#c8e6c9
```

## Security Layers

### Multi-Layer Security Model

```mermaid
graph TD
    subgraph Edge[Edge Layer]
        CDN[CDN Protection]
        WAF[Web Application Firewall]
        RateLimit[Rate Limiting]
    end

    subgraph App[Application Layer]
        Auth[Authentication]
        Authz[Authorization]
        Validate[Input Validation]
        Sanitize[Output Sanitization]
    end

    subgraph Data[Data Layer]
        RLS[Row-Level Security]
        Encrypt[Encryption]
        Audit[Audit Logging]
    end

    Request[Incoming Request] --> CDN
    CDN --> WAF
    WAF --> RateLimit
    RateLimit --> Auth
    Auth --> Authz
    Authz --> Validate
    Validate --> Sanitize
    Sanitize --> RLS
    RLS --> Encrypt
    Encrypt --> Audit
    Audit --> Response[Response]

    style Edge fill:#ffebee
    style App fill:#fff3e0
    style Data fill:#e8f5e9
```

## Integration Flow

### Third-Party Service Integration

```mermaid
sequenceDiagram
    participant App as Application
    participant Config as site.config.ts
    participant Adapter as Integration Adapter
    participant API as External API
    participant Cache as Cache Layer
    participant DB as Database

    App->>Config: Read Integration Config
    Config-->>App: Integration Settings
    App->>Adapter: Initialize Integration
    Adapter->>Adapter: Validate Config
    Adapter->>Cache: Check Cache
    Cache-->>Adapter: Cache Hit/Miss

    alt Cache Miss
        Adapter->>API: API Request
        API-->>Adapter: Response
        Adapter->>Cache: Store in Cache
        Adapter->>DB: Store Data (if needed)
    end

    Adapter-->>App: Processed Data
    App-->>App: Use Data in UI
```

---

## Related Documentation

- [Architecture Overview](README.md) - Complete architecture documentation
- [Module Boundaries](module-boundaries.md) - Dependency rules and constraints
- [Dependency Graph](dependency-graph.md) - Detailed dependency visualization

---

**Note:** These diagrams are simplified representations. For detailed implementation, refer to the source code and specific documentation.
