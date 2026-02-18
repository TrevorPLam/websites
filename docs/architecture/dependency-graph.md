<!--
/**
 * @file docs/architecture/dependency-graph.md
 * @role docs
 * @summary Visual dependency mapping and relationship documentation for the monorepo.
 *
 * @entrypoints
 * - Architecture visualization for developers and system designers
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/architecture/README.md (architecture overview)
 * - docs/architecture/module-boundaries.md (dependency rules)
 * - TODO.md (package status and relationships)
 *
 * @used_by
 * - Developers, architects, system administrators
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: package configurations, dependency relationships
 * - outputs: visual understanding of system architecture
 *
 * @invariants
 * - Dependency graphs must reflect actual package.json files
 * - Visual representations must match module boundaries
 *
 * @gotchas
 * - Dependencies evolve with development; keep graphs updated
 * - Circular dependencies should be highlighted as errors
 *
 * @issues
 * - [severity:medium] Need automated graph generation (future enhancement)
 *
 * @opportunities
 * - Add interactive dependency visualization
 * - Include performance impact analysis
 *
 * @verification
 * - ✅ Verified: Graph structure matches current repository
 * - ✅ Verified: Dependencies align with module-boundaries.md
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Dependency Graph & Architecture Visualization

**Last Updated:** 2026-02-18  
**Status:** Active Documentation  
**Related:** [Architecture Overview](README.md), [Module Boundaries](module-boundaries.md)

---

## Overview

This document provides visual representations of the marketing-websites monorepo architecture, including dependency graphs, package relationships, and system flow diagrams. These visualizations help understand the complex relationships between templates, clients, and shared packages.

### Key Visualizations

- **Package Dependency Graph** - How packages depend on each other
- **Template-to-Package Flow** - How templates consume shared packages
- **Client Deployment Architecture** - Production deployment relationships
- **Data Flow Diagrams** - How data moves through the system
- **Component Hierarchy** - UI component relationships

---

## Package Dependency Graph

### High-Level Architecture

```mermaid
graph TD
    %% Infrastructure Layer (L0)
    Infra["@repo/infra"]
    Integrations["@repo/integrations-*"]
    
    %% Component Layer (L2)
    Types["@repo/types"]
    Utils["@repo/utils"]
    UI["@repo/ui"]
    Features["@repo/features"]
    Marketing["@repo/marketing-components"]
    PageTemplates["@repo/page-templates"]
    
    %% Experience Layer (L3)
    Templates["templates/*"]
    Clients["clients/*"]
    
    %% Dependencies
    Infra --> Types
    Infra --> Utils
    
    Types --> UI
    Types --> Features
    Types --> Marketing
    Types --> PageTemplates
    
    Utils --> UI
    Utils --> Features
    Utils --> Marketing
    
    UI --> Features
    UI --> Marketing
    UI --> PageTemplates
    
    Features --> Marketing
    Features --> PageTemplates
    
    Marketing --> PageTemplates
    
    Integrations --> Features
    Integrations --> Marketing
    
    Templates --> UI
    Templates --> Utils
    Templates --> Features
    Templates --> Marketing
    Templates --> PageTemplates
    Templates --> Infra
    Templates --> Types
    Templates --> Integrations
    
    Clients --> Templates
    Clients --> UI
    Clients --> Utils
    Clients --> Features
    Clients --> Marketing
    Clients --> PageTemplates
    Clients --> Infra
    Clients --> Types
    Clients --> Integrations
    
    %% Styling
    classDef infra fill:#e1f5fe
    classDef types fill:#f3e5f5
    classDef utils fill:#e8f5e8
    classDef ui fill:#fff3e0
    classDef features fill:#fce4ec
    classDef marketing fill:#f1f8e9
    classDef templates fill:#e0f2f1
    classDef clients fill:#fff8e1
    
    class Infra,Integrations infra
    class Types types
    class Utils utils
    class UI ui
    class Features features
    class Marketing marketing
    class PageTemplates marketing
    class Templates templates
    class Clients clients
```

### Package Relationships

```mermaid
graph LR
    %% Core Infrastructure
    Infra["@repo/infra"] --> |"Security, logging, env"| Packages
    
    %% Shared Libraries
    Types["@repo/types"] --> |"Type definitions"| UI["@repo/ui"]
    Types --> |"Config schemas"| Features["@repo/features"]
    Types --> |"Site config"| Templates["templates/*"]
    
    Utils["@repo/utils"] --> |"Helper functions"| UI
    Utils --> |"Utilities"| Features
    
    %% Component Libraries
    UI --> |"UI primitives"| Features
    UI --> |"Components"| Templates
    
    Features --> |"Business logic"| Marketing["@repo/marketing-components"]
    Features --> |"Feature components"| Templates
    
    Marketing --> |"Marketing components"| PageTemplates["@repo/page-templates"]
    
    %% Templates and Clients
    PageTemplates --> |"Page templates"| Templates
    Templates --> |"Template base"| Clients["clients/*"]
    
    %% Integrations
    Integrations["@repo/integrations-*"] --> |"Third-party services"| Features
    Integrations --> |"API adapters"| Marketing
    
    %% Package groups
    classDef infra fill:#e1f5fe,stroke:#0277bd
    classDef shared fill:#f3e5f5,stroke:#7b1fa2
    classDef components fill:#fff3e0,stroke:#ef6c00
    classDef experience fill:#e0f2f1,stroke:#00695c
    
    class Infra infra
    class Types,Utils shared
    class UI,Features,Marketing,PageTemplates components
    class Templates,Clients experience
```

---

## Template Architecture

### Template Structure

```mermaid
graph TD
    Template["Template (e.g., hair-salon)"]
    
    %% Core Template Files
    Template --> App["app/"]
    Template --> Components["components/"]
    Template --> Pages["pages/"]
    Template --> Styles["styles/"]
    Template --> Config["site.config.ts"]
    Template --> Env[".env.local"]
    
    %% App Structure
    App --> Layout["layout.tsx"]
    App --> Page["page.tsx"]
    App --> Loading["loading.tsx"]
    App --> Error["error.tsx"]
    App --> NotFound["not-found.tsx"]
    
    %% Component Structure
    Components --> UIComponents["UI Components"]
    Components --> FeatureComponents["Feature Components"]
    Components --> LayoutComponents["Layout Components"]
    
    %% Page Structure
    Pages --> HomePage["page.tsx"]
    Pages --> AboutPage["about/page.tsx"]
    Pages --> ServicesPage["services/page.tsx"]
    Pages --> ContactPage["contact/page.tsx"]
    Pages --> BookingPage["booking/page.tsx"]
    
    %% Dependencies
    UIComponents -.-> |"imports"| UI["@repo/ui"]
    FeatureComponents -.-> |"imports"| Features["@repo/features"]
    LayoutComponents -.-> |"imports"| UI
    
    Config --> |"validates"| Types["@repo/types"]
    
    %% Styling
    classDef template fill:#e8f5e8,stroke:#2e7d32
    classDef file fill:#fff3e0,stroke:#ef6c00
    classDef package fill:#e3f2fd,stroke:#1565c0
    
    class Template template
    class App,Components,Pages,Styles,Config,Env file
    class UI,Features,Types package
```

### Template Dependencies

```mermaid
graph TB
    %% Template
    Template["hair-salon template"]
    
    %% Shared Packages
    UI["@repo/ui"]
    Features["@repo/features"]
    Utils["@repo/utils"]
    Types["@repo/types"]
    Infra["@repo/infra"]
    
    %% Integration Points
    Template --> |"uses"| UI
    Template --> |"uses"| Features
    Template --> |"uses"| Utils
    Template --> |"validates"| Types
    Template --> |"configures"| Infra
    
    %% Package Dependencies
    UI --> |"depends on"| Utils
    UI --> |"depends on"| Types
    Features --> |"depends on"| UI
    Features --> |"depends on"| Utils
    Features --> |"depends on"| Types
    Features --> |"depends on"| Infra
    
    %% Styling
    classDef template fill:#e8f5e8,stroke:#2e7d32
    classDef package fill:#e3f2fd,stroke:#1565c0
    
    class Template template
    class UI,Features,Utils,Types,Infra package
```

---

## Client Deployment Architecture

### Client Creation Flow

```mermaid
flowchart TD
    Start["Start: New Client"]
    
    %% Selection Phase
    Start --> SelectTemplate["Select Template"]
    SelectTemplate --> CopyTemplate["Copy Template to clients/"]
    
    %% Configuration Phase
    CopyTemplate --> ConfigureEnv["Configure .env.local"]
    ConfigureEnv --> ConfigureSite["Configure site.config.ts"]
    ConfigureSite --> CustomizeContent["Customize Content"]
    
    %% Setup Phase
    CustomizeContent --> InstallDeps["Install Dependencies"]
    InstallDeps --> TestBuild["Test Build"]
    TestBuild --> Deploy["Deploy Client"]
    
    %% Completion
    Deploy --> Success["Client Live"]
    
    %% Error handling
    TestBuild --> |"fails"| FixIssues["Fix Issues"]
    FixIssues --> TestBuild
    
    %% Styling
    classDef start fill:#e8f5e8,stroke:#2e7d32
    classDef process fill:#fff3e0,stroke:#ef6c00
    classDef decision fill:#fce4ec,stroke:#c2185b
    classDef success fill:#e3f2fd,stroke:#1565c0
    
    class Start start
    class SelectTemplate,CopyTemplate,ConfigureEnv,ConfigureSite,CustomizeContent,InstallDeps,Deploy process
    class TestBuild decision
    class FixIssues process
    class Success success
```

### Client Dependencies

```mermaid
graph TD
    %% Client Instance
    Client["Client Website"]
    
    %% Template Base
    Template["Template Base"]
    Client --> |"based on"| Template
    
    %% Shared Dependencies
    UI["@repo/ui"]
    Features["@repo/features"]
    Utils["@repo/utils"]
    Infra["@repo/infra"]
    
    Template --> |"uses"| UI
    Template --> |"uses"| Features
    Template --> |"uses"| Utils
    Template --> |"uses"| Infra
    
    %% External Services
    Database[(Database)]
    Analytics[Analytics Service]
    CDN[CDN]
    
    Client --> |"stores data in"| Database
    Client --> |"sends events to"| Analytics
    Client --> |"served from"| CDN
    
    %% Infrastructure
    Infra --> |"manages"| Database
    Infra --> |"configures"| Analytics
    Infra --> |"optimizes"| CDN
    
    %% Styling
    classDef client fill:#fff8e1,stroke:#f57f17
    classDef template fill:#e8f5e8,stroke:#2e7d32
    classDef package fill:#e3f2fd,stroke:#1565c0
    classDef external fill:#fce4ec,stroke:#c2185b
    
    class Client client
    class Template template
    class UI,Features,Utils,Infra package
    class Database,Analytics,CDN external
```

---

## Data Flow Architecture

### Request Flow

```mermaid
sequenceDiagram
    participant User
    participant CDN
    participant Edge
    participant App as Next.js App
    participant Template
    participant Features
    participant Infra
    participant DB as Database
    participant API as External APIs
    
    User->>CDN: Request
    CDN->>Edge: Forward request
    Edge->>Edge: Security checks
    Edge->>App: Forward to app
    
    App->>Template: Render page
    Template->>Features: Load features
    Features->>Infra: Get configuration
    Infra->>DB: Query data
    
    Features->>API: Fetch external data
    API-->>Features: Return data
    DB-->>Infra: Return data
    Infra-->>Features: Return config
    Features-->>Template: Return components
    Template-->>App: Return page
    App-->>Edge: Return HTML
    Edge-->>CDN: Return response
    CDN-->>User: Deliver page
```

### Configuration Flow

```mermaid
flowchart LR
    %% Configuration Sources
    EnvVars["Environment Variables"]
    SiteConfig["site.config.ts"]
    PackageConfig["Package Configs"]
    
    %% Validation
    Types["@repo/types"]
    Infra["@repo/infra"]
    
    %% Processing
    ConfigProcessor["Configuration Processor"]
    
    %% Outputs
    Theme["Theme Variables"]
    FeatureFlags["Feature Flags"]
    APIConfig["API Configuration"]
    SecurityConfig["Security Settings"]
    
    %% Flow
    EnvVars --> ConfigProcessor
    SiteConfig --> ConfigProcessor
    PackageConfig --> ConfigProcessor
    
    ConfigProcessor --> Types
    Types --> |"validates"| ConfigProcessor
    
    ConfigProcessor --> Infra
    Infra --> |"applies security"| ConfigProcessor
    
    ConfigProcessor --> Theme
    ConfigProcessor --> FeatureFlags
    ConfigProcessor --> APIConfig
    ConfigProcessor --> SecurityConfig
    
    %% Styling
    classDef input fill:#e8f5e8,stroke:#2e7d32
    classDef process fill:#fff3e0,stroke:#ef6c00
    classDef output fill:#e3f2fd,stroke:#1565c0
    
    class EnvVars,SiteConfig,PackageConfig input
    class ConfigProcessor process
    class Types,Infra process
    class Theme,FeatureFlags,APIConfig,SecurityConfig output
```

---

## Component Hierarchy

### UI Component Tree

```mermaid
graph TD
    %% Root Components
    ThemeProvider["ThemeProvider"]
    Layout["Layout"]
    
    %% Layout Components
    Layout --> Header["Header"]
    Layout --> Main["Main"]
    Layout --> Footer["Footer"]
    
    %% Header Components
    Header --> Navigation["Navigation"]
    Header --> Logo["Logo"]
    Header --> CTA["CTA Button"]
    
    %% Main Components
    Main --> Hero["Hero Section"]
    Main --> Features["Features Section"]
    Main --> Testimonials["Testimonials"]
    Main --> Contact["Contact Section"]
    
    %% Feature Components
    Features --> FeatureCard["Feature Card"]
    Features --> ServiceList["Service List"]
    
    %% Contact Components
    Contact --> ContactForm["Contact Form"]
    Contact --> Map["Map Component"]
    
    %% UI Primitives
    Button["Button"]
    Input["Input"]
    Card["Card"]
    Modal["Modal"]
    Dialog["Dialog"]
    Tabs["Tabs"]
    Dropdown["Dropdown"]
    
    %% Relationships
    Navigation --> Button
    CTA --> Button
    FeatureCard --> Card
    ContactForm --> Input
    ContactForm --> Button
    
    %% Package Sources
    UI["@repo/ui"] --> Button
    UI --> Input
    UI --> Card
    UI --> Modal
    UI --> Dialog
    UI --> Tabs
    UI --> Dropdown
    
    Features["@repo/features"] --> Navigation
    Features --> Hero
    Features --> FeatureCard
    Features --> ContactForm
    Features --> Map
    
    %% Styling
    classDef layout fill:#e8f5e8,stroke:#2e7d32
    classDef section fill:#fff3e0,stroke:#ef6c00
    classDef primitive fill:#e3f2fd,stroke:#1565c0
    classDef package fill:#fce4ec,stroke:#c2185b
    
    class Layout,Header,Main,Footer layout
    class Hero,Features,Testimonials,Contact,Navigation,Logo,CTA,FeatureCard,ServiceList,ContactForm,Map section
    class Button,Input,Card,Modal,Dialog,Tabs,Dropdown primitive
    class UI,Features package
```

### Feature Component Dependencies

```mermaid
graph TB
    %% Feature Packages
    Booking["Booking Feature"]
    Contact["Contact Feature"]
    Blog["Blog Feature"]
    Services["Services Feature"]
    Search["Search Feature"]
    
    %% Shared Components
    Form["Form Components"]
    Validation["Validation Utils"]
    API["API Client"]
    
    %% UI Primitives
    Button["Button"]
    Input["Input"]
    Modal["Modal"]
    Card["Card"]
    
    %% Feature Dependencies
    Booking --> Form
    Booking --> Validation
    Booking --> API
    Booking --> Modal
    
    Contact --> Form
    Contact --> Validation
    Contact --> API
    
    Blog --> API
    Blog --> Card
    
    Services --> Card
    Services --> Button
    
    Search --> Input
    Search --> API
    
    %% Shared Dependencies
    Form --> Button
    Form --> Input
    Validation --> Utils["@repo/utils"]
    API --> Infra["@repo/infra"]
    
    %% UI Dependencies
    Button --> UI["@repo/ui"]
    Input --> UI
    Modal --> UI
    Card --> UI
    
    %% Styling
    classDef feature fill:#e8f5e8,stroke:#2e7d32
    classDef shared fill:#fff3e0,stroke:#ef6c00
    classDef primitive fill:#e3f2fd,stroke:#1565c0
    classDef package fill:#fce4ec,stroke:#c2185b
    
    class Booking,Contact,Blog,Services,Search feature
    class Form,Validation,API shared
    class Button,Input,Modal,Card primitive
    class UI,Utils,Infra package
```

---

## Integration Architecture

### Third-Party Integrations

```mermaid
graph TD
    %% Core Integration Package
    Integrations["@repo/integrations"]
    
    %% Specific Integrations
    HubSpot["HubSpot Integration"]
    Google["Google Analytics"]
    Supabase["Supabase"]
    Sentry["Sentry"]
    
    %% Integration Adapters
    HubSpotAdapter["HubSpot Adapter"]
    GoogleAdapter["Google Adapter"]
    SupabaseAdapter["Supabase Adapter"]
    SentryAdapter["Sentry Adapter"]
    
    %% External Services
    HubSpotAPI["HubSpot API"]
    GoogleAPI["Google Analytics API"]
    SupabaseAPI["Supabase API"]
    SentryAPI["Sentry API"]
    
    %% Usage in Features
    Features["@repo/features"]
    Templates["templates/*"]
    
    %% Connections
    Integrations --> HubSpot
    Integrations --> Google
    Integrations --> Supabase
    Integrations --> Sentry
    
    HubSpot --> HubSpotAdapter
    Google --> GoogleAdapter
    Supabase --> SupabaseAdapter
    Sentry --> SentryAdapter
    
    HubSpotAdapter --> HubSpotAPI
    GoogleAdapter --> GoogleAPI
    SupabaseAdapter --> SupabaseAPI
    SentryAdapter --> SentryAPI
    
    Features --> |"uses"| HubSpot
    Features --> |"uses"| Google
    Features --> |"uses"| Supabase
    Features --> |"uses"| Sentry
    
    Templates --> |"uses"| HubSpot
    Templates --> |"uses"| Google
    Templates --> |"uses"| Supabase
    Templates --> |"uses"| Sentry
    
    %% Styling
    classDef integration fill:#e8f5e8,stroke:#2e7d32
    classDef adapter fill:#fff3e0,stroke:#ef6c00
    classDef external fill:#e3f2fd,stroke:#1565c0
    classDef consumer fill:#fce4ec,stroke:#c2185b
    
    class Integrations,HubSpot,Google,Supabase,Sentry integration
    class HubSpotAdapter,GoogleAdapter,SupabaseAdapter,SentryAdapter adapter
    class HubSpotAPI,GoogleAPI,SupabaseAPI,SentryAPI external
    class Features,Templates consumer
```

---

## Performance Architecture

### Bundle Optimization

```mermaid
graph TD
    %% Source Code
    Source["Source Code"]
    
    %% Build Process
    Build["Next.js Build"]
    
    %% Optimization Steps
    CodeSplitting["Code Splitting"]
    TreeShaking["Tree Shaking"]
    Minification["Minification"]
    Compression["Compression"]
    
    %% Output Bundles
    MainBundle["Main Bundle"]
    RouteBundles["Route Bundles"]
    ComponentBundles["Component Bundles"]
    VendorBundles["Vendor Bundles"]
    
    %% Deployment
    CDN["CDN Distribution"]
    
    %% Flow
    Source --> Build
    Build --> CodeSplitting
    CodeSplitting --> TreeShaking
    TreeShaking --> Minification
    Minification --> Compression
    
    Compression --> MainBundle
    Compression --> RouteBundles
    Compression --> ComponentBundles
    Compression --> VendorBundles
    
    MainBundle --> CDN
    RouteBundles --> CDN
    ComponentBundles --> CDN
    VendorBundles --> CDN
    
    %% Styling
    classDef source fill:#e8f5e8,stroke:#2e7d32
    classDef process fill:#fff3e0,stroke:#ef6c00
    classDef bundle fill:#e3f2fd,stroke:#1565c0
    classDef deployment fill:#fce4ec,stroke:#c2185b
    
    class Source source
    class Build,CodeSplitting,TreeShaking,Minification,Compression process
    class MainBundle,RouteBundles,ComponentBundles,VendorBundles bundle
    class CDN deployment
```

### Caching Strategy

```mermaid
graph LR
    %% Browser
    Browser["Browser"]
    
    %% CDN Caching
    CDN["CDN Cache"]
    
    %% Edge Caching
    Edge["Edge Cache"]
    
    %% Application Caching
    AppCache["App Cache"]
    
    %% Data Caching
    DataCache["Data Cache"]
    
    %% Database
    Database[(Database)]
    
    %% Cache Flow
    Browser --> |"1. Check"| Browser
    Browser --> |"2. Miss"| CDN
    CDN --> |"3. Check"| CDN
    CDN --> |"4. Miss"| Edge
    Edge --> |"5. Check"| Edge
    Edge --> |"6. Miss"| AppCache
    AppCache --> |"7. Check"| AppCache
    AppCache --> |"8. Miss"| DataCache
    DataCache --> |"9. Check"| DataCache
    DataCache --> |"10. Miss"| Database
    
    %% Return Flow
    Database --> |"10. Store"| DataCache
    DataCache --> |"9. Store"| AppCache
    AppCache --> |"8. Store"| Edge
    Edge --> |"7. Store"| CDN
    CDN --> |"6. Store"| Browser
    
    %% Styling
    classDef cache fill:#e8f5e8,stroke:#2e7d32
    classDef storage fill:#e3f2fd,stroke:#1565c0
    
    class Browser,CDN,Edge,AppCache,DataCache cache
    class Database storage
```

---

## Security Architecture

### Security Layers

```mermaid
graph TD
    %% External Layer
    Internet["Internet"]
    
    %% Edge Security
    Edge["Edge Security"]
    DDoS["DDoS Protection"]
    WAF["Web Application Firewall"]
    
    %% Application Security
    Auth["Authentication"]
    AuthZ["Authorization"]
    Validation["Input Validation"]
    CSRF["CSRF Protection"]
    
    %% Infrastructure Security
    EnvVars["Environment Variables"]
    Secrets["Secret Management"]
    Logging["Security Logging"]
    
    %% Data Security
    Encryption["Encryption at Rest"]
    TLS["TLS in Transit"]
    RLS["Row Level Security"]
    
    %% Connections
    Internet --> Edge
    Edge --> DDoS
    Edge --> WAF
    
    WAF --> Auth
    Auth --> AuthZ
    AuthZ --> Validation
    Validation --> CSRF
    
    CSRF --> EnvVars
    EnvVars --> Secrets
    Secrets --> Logging
    
    Logging --> Encryption
    Encryption --> TLS
    TLS --> RLS
    
    %% Styling
    classDef external fill:#fce4ec,stroke:#c2185b
    classDef edge fill:#fff3e0,stroke:#ef6c00
    classDef app fill:#e8f5e8,stroke:#2e7d32
    classDef infra fill:#e3f2fd,stroke:#1565c0
    classDef data fill:#f3e5f5,stroke:#7b1fa2
    
    class Internet external
    class Edge,DDoS,WAF edge
    class Auth,AuthZ,Validation,CSRF app
    class EnvVars,Secrets,Logging infra
    class Encryption,TLS,RLS data
```

---

## Generating Graphs

### Automated Graph Generation

The dependency graphs can be automatically generated using the following tools:

#### Using Madge (Current)

```bash
# Install madge
npm install -g madge

# Generate dependency graph
madge --image docs/assets/images/dependency-graph.png packages/

# Generate circular dependency check
madge --circular packages/
```

#### Future: Skott Integration

```bash
# Install skott (planned upgrade)
npm install -g skott

# Generate enhanced dependency graph
skott --format json --output docs/assets/dependency-graph.json

# Generate visualization
skott --format svg --output docs/assets/images/dependency-graph.svg
```

### Custom Script Usage

```bash
# Generate all graphs
node scripts/generate-graphs.js

# Generate specific graph
node scripts/generate-graphs.js --type=dependencies

# Update graphs in documentation
node scripts/generate-graphs.js --update-docs
```

---

## Maintenance

### Keeping Graphs Updated

1. **Automated Updates**: CI/CD pipeline regenerates graphs on package changes
2. **Manual Updates**: Run `node scripts/generate-graphs.js` after structural changes
3. **Review Process**: Graph changes reviewed in pull requests
4. **Version Control**: Graph images committed to repository for versioning

### Graph Validation

- **Dependency Accuracy**: Graphs must match actual package.json dependencies
- **Boundary Compliance**: Graphs must respect module boundaries
- **Circular Dependencies**: Highlighted as errors requiring resolution
- **Performance Impact**: Large dependency trees flagged for optimization

---

_This dependency documentation evolves with the architecture. Last updated: 2026-02-18_
