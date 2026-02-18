# Marketing Website Monorepo — Tasks

**Last Updated:** February 18, 2026  
**Goal:** Transform from template-based to feature-based, industry-agnostic marketing website platform  
**Timeline:** 12 weeks | **Current State:** Single hair-salon template → **Target:** 12 industries, 20+ components, config-driven

---

## Part 1: Overview & How to Use

### Status Convention

| Symbol | Status       |
| ------ | ------------ |
| `[ ]`  | TODO/Pending |
| `[🔄]` | IN_PROGRESS  |
| `[x]`  | COMPLETED    |
| `[🚫]` | BLOCKED      |
| `[⏸️]` | PAUSED       |

**To update a task:** change its status line and fill in Assigned To / Completed date.

```markdown
**Status:** [🔄] IN_PROGRESS | **Assigned To:** [AgentName] | **Completed:** [ ]
**Status:** [x] COMPLETED | **Assigned To:** [AgentName] | **Completed:** [2026-02-14]
```

### Conventions (from legacy 00-OVERVIEW)

- **Optional Modes** applied per task type: UI primitive → Radix; marketing → variant; feature → adapter; template → registry
- **Hard Constraints:** No cross-layer violations, no circular imports, no business logic in clients, everything typed, no dead exports

### Task Index

| ID                                                | Title                                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **UI Primitives (Enhanced)**                      |                                                                                          |
| 1.2                                               | Create Toast Component (Enhanced: 6 variants, 6 positions, actions, custom content)      |
| 1.3                                               | Create Tabs Component (Enhanced: 5 variants, URL sync, nested, scrollable)               |
| 1.4                                               | Create Dropdown Menu Component (Enhanced: typeahead, multi-select, checkbox/radio items) |
| 1.5                                               | Create Tooltip Component (Enhanced: 12 positions, 4 trigger modes, rich content)         |
| 1.6                                               | Create Popover Component (Enhanced: collision detection, slots, nested, animations)      |
| **UI Primitives (New 1.7-1.50)**                  |                                                                                          |
| 1.7                                               | Create Badge Component                                                                   |
| 1.8                                               | Create Avatar Component                                                                  |
| 1.9                                               | Create Skeleton Component                                                                |
| 1.10                                              | Create Separator Component                                                               |
| 1.11                                              | Create Switch Component                                                                  |
| 1.12                                              | Create Slider Component                                                                  |
| 1.13                                              | Create Progress Component                                                                |
| 1.14                                              | Create Breadcrumb Component                                                              |
| 1.15                                              | Create Command Palette Component                                                         |
| 1.16                                              | Create Context Menu Component                                                            |
| 1.17                                              | Create Hover Card Component                                                              |
| 1.18                                              | Create Menubar Component                                                                 |
| 1.19                                              | Create Navigation Menu Component                                                         |
| 1.20                                              | Create Radio Group Component                                                             |
| 1.21                                              | Create Checkbox Component                                                                |
| 1.22                                              | Create Label Component                                                                   |
| 1.23                                              | Create Form Component                                                                    |
| 1.24                                              | Create Alert Component                                                                   |
| 1.25                                              | Create Alert Dialog Component                                                            |
| 1.26                                              | Create Aspect Ratio Component                                                            |
| 1.27                                              | Create Collapsible Component                                                             |
| 1.28                                              | Create Resizable Component                                                               |
| 1.29                                              | Create Scroll Area Component                                                             |
| 1.30                                              | Create Select Component (Enhanced)                                                       |
| 1.31                                              | Create Sheet Component (Sidebar)                                                         |
| 1.32                                              | Create Table Component                                                                   |
| 1.33                                              | Create Toggle Component                                                                  |
| 1.34                                              | Create Toggle Group Component                                                            |
| 1.35                                              | Create Calendar Component                                                                |
| 1.36                                              | Create Date Picker Component                                                             |
| 1.37                                              | Create Time Picker Component                                                             |
| 1.38                                              | Create Color Picker Component                                                            |
| 1.39                                              | Create File Upload Component                                                             |
| 1.40                                              | Create Rating Component                                                                  |
| 1.41                                              | Create Pagination Component                                                              |
| 1.42                                              | Create Stepper Component                                                                 |
| 1.43                                              | Create Timeline Component                                                                |
| 1.44                                              | Create Tree View Component                                                               |
| 1.45                                              | Create Carousel Component                                                                |
| 1.46                                              | Create Masonry Component                                                                 |
| 1.47                                              | Create Virtual List Component                                                            |
| 1.48                                              | Create Infinite Scroll Component                                                         |
| 1.49                                              | Create Drag and Drop Component                                                           |
| 1.50                                              | Create Resizable Panel Component                                                         |
| **Marketing Components (Enhanced)**               |                                                                                          |
| 1.7                                               | Create @repo/marketing-components Package Scaffold                                       |
| 2.1                                               | Build HeroVariants Components (Expanded: 20+ variants, composition system)               |
| 2.2                                               | Build ServiceShowcase Components (Expanded: 20+ layouts, filtering, sorting)             |
| 2.3                                               | Build TeamDisplay Components (Expanded: 15+ layouts, role filtering, social)             |
| 2.4                                               | Build Testimonial Components (Expanded: 20+ variants, multi-source integration)          |
| 2.5                                               | Build Pricing Components (Expanded: 15+ variants, customization, comparison)             |
| 2.6                                               | Build Gallery Components (Expanded: 20+ variants, filtering, organization)               |
| 2.7                                               | Build Stats Counter Component (Expanded: 6 variants, animation customization)            |
| 2.8                                               | Build CTA Section Components (Expanded: 10+ variants, A/B testing)                       |
| 2.9                                               | Build FAQ Section Component (Expanded: 6 variants, search functionality)                 |
| 2.10                                              | Build Contact Form Variants (Expanded: 10+ variants, validation, integration)            |
| **Marketing Components (New Families 2.11-2.35)** |                                                                                          |
| 2.11                                              | Build Navigation Components (15+ variants, multi-level, mega menu)                       |
| 2.12                                              | Build Footer Components (10+ variants, newsletter, social-focused)                       |
| 2.13                                              | Build Blog Components (15+ variants, pagination, filtering, related posts)               |
| 2.14                                              | Build Product Components (15+ variants, e-commerce features)                             |
| 2.15                                              | Build Event Components (10+ variants, calendar, registration)                            |
| 2.16                                              | Build Location Components (10+ variants, maps integration)                               |
| 2.17                                              | Build Menu Components (Restaurant) (10+ variants, dietary info)                          |
| 2.18                                              | Build Portfolio Components (12+ variants, filtering, lightbox)                           |
| 2.19                                              | Build Case Study Components (10+ variants, metrics, downloads)                           |
| 2.20                                              | Build Job Listing Components (10+ variants, search, application)                         |
| 2.21                                              | Build Course Components (Education) (10+ variants, enrollment, progress)                 |
| 2.22                                              | Build Resource Components (8+ variants, download tracking)                               |
| 2.23                                              | Build Comparison Components (6+ variants, feature/price comparison)                      |
| 2.24                                              | Build Filter Components (8+ variants, presets, history)                                  |
| 2.25                                              | Build Search Components (8+ variants, autocomplete, suggestions)                         |
| 2.26                                              | Build Social Proof Components (8+ variants, trust badges, counts)                        |
| 2.27                                              | Build Video Components (10+ variants, playlists, analytics)                              |
| 2.28                                              | Build Audio Components (6+ variants, waveforms, transcripts)                             |
| 2.29                                              | Build Interactive Components (8+ variants, quizzes, calculators)                         |
| 2.30                                              | Build Widget Components (8+ variants, weather, clock, countdown)                         |
| **Feature Breadth (Enhanced)**                    |                                                                                          |
| 2.16                                              | Create Testimonials Feature (Enhanced: 5+ patterns, multi-source, filtering)             |
| 2.17                                              | Create Team Feature (Enhanced: 5+ patterns, CMS, API adapters)                           |
| 2.18                                              | Create Gallery Feature (Enhanced: 5+ patterns, CDN, optimization)                        |
| 2.19                                              | Create Pricing Feature (Enhanced: 5+ patterns, calculator, comparison)                   |
| **Feature Breadth (New 2.20-2.50)**               |                                                                                          |
| 2.20                                              | Create Search Feature (5+ patterns, AI-powered, semantic search)                         |
| 2.21                                              | Create Newsletter Feature (5+ patterns, segmentation, automation)                        |
| 2.22                                              | Create Social Media Integration Feature (5+ patterns, feeds, sharing)                    |
| 2.23                                              | Create Analytics Feature (5+ patterns, privacy-first, real-time)                         |
| 2.24                                              | Create A/B Testing Feature (5+ patterns, statistical analysis, ML)                       |
| 2.25                                              | Create Personalization Feature (5+ patterns, behavioral, AI-powered)                     |
| 2.26                                              | Create Chat Feature (5+ patterns, AI chatbot, live chat)                                 |
| 2.27                                              | Create Reviews Feature (5+ patterns, aggregation, moderation)                            |
| 2.28                                              | Create Booking Feature (Expanded: 5+ patterns, multi-provider)                           |
| 2.29                                              | Create E-commerce Feature (5+ patterns, headless commerce)                               |
| 2.30                                              | Create Content Management Feature (5+ patterns, CMS abstraction)                         |
| 2.31                                              | Create Form Builder Feature (5+ patterns, visual builder)                                |
| 2.32                                              | Create Payment Feature (5+ patterns, multi-gateway)                                      |
| 2.33                                              | Create Notification Feature (5+ patterns, multi-channel)                                 |
| 2.34                                              | Create Authentication Feature (5+ patterns, OAuth, SSO)                                  |
| 2.35                                              | Create File Upload Feature (5+ patterns, multi-provider storage)                         |
| 2.36                                              | Create Localization Feature (5+ patterns, AI translation, RTL)                           |
| 2.37                                              | Create SEO Feature (5+ patterns, structured data, sitemap)                               |
| 2.38                                              | Create Performance Feature (5+ patterns, optimization, monitoring)                       |
| 2.39                                              | Create Security Feature (5+ patterns, CSP, rate limiting)                                |
| 2.40                                              | Create Monitoring Feature (5+ patterns, error tracking, APM)                             |
| 2.41                                              | Create Backup Feature (5+ patterns, automated, cloud)                                    |
| 2.42                                              | Create Migration Feature (5+ patterns, validation, rollback)                             |
| 2.43                                              | Create API Feature (5+ patterns, REST, GraphQL, tRPC)                                    |
| 2.44                                              | Create Webhook Feature (5+ patterns, security, retry)                                    |
| 2.45                                              | Create Integration Feature (5+ patterns, CRM, email, payment)                            |
| 2.46                                              | Create Automation Feature (5+ patterns, workflow builder, AI)                            |
| 2.47                                              | Create Reporting Feature (5+ patterns, dashboards, visualization)                        |
| **Infrastructure Systems (F.1-F.40)**             |                                                                                          |
| F.1                                               | Component Composition System                                                             |
| F.2                                               | Variant System Infrastructure                                                            |
| F.3                                               | Customization Hook System                                                                |
| F.4                                               | Layout System                                                                            |
| F.5                                               | Theme Extension System                                                                   |
| F.6                                               | Animation System                                                                         |
| F.7                                               | Interaction System                                                                       |
| F.8                                               | Responsive System                                                                        |
| F.9                                               | Grid System                                                                              |
| F.10                                              | Spacing System                                                                           |
| F.11                                              | Typography System                                                                        |
| F.12                                              | Color System                                                                             |
| F.13                                              | Shadow System                                                                            |
| F.14                                              | Border System                                                                            |
| F.15                                              | Icon System                                                                              |
| F.16                                              | Image System                                                                             |
| F.17                                              | Media System                                                                             |
| F.18                                              | State Management System                                                                  |
| F.19                                              | Form System                                                                              |
| F.20                                              | Validation System                                                                        |
| F.21                                              | Error Handling System                                                                    |
| F.22                                              | Loading System                                                                           |
| F.23                                              | Accessibility System                                                                     |
| F.24                                              | Performance System                                                                       |
| F.25                                              | Testing System                                                                           |
| F.26                                              | Documentation System                                                                     |
| F.27                                              | Development System                                                                       |
| F.28                                              | Build System                                                                             |
| F.29                                              | Deployment System                                                                        |
| F.30                                              | Monitoring System                                                                        |
| F.31                                              | Slot System                                                                              |
| F.32                                              | Render Prop System                                                                       |
| F.33                                              | Higher-Order Component System                                                            |
| F.34                                              | Context System                                                                           |
| F.35                                              | Provider System                                                                          |
| F.36                                              | Style System                                                                             |
| F.37                                              | Theme System                                                                             |
| F.38                                              | Configuration System                                                                     |
| F.39                                              | Plugin System                                                                            |
| F.40                                              | Extension System                                                                         |
| **Page Templates**                                |                                                                                          |
| 3.1                                               | Create Page-Templates Registry and Package Scaffold                                      |
| 3.2                                               | Build HomePageTemplate                                                                   |
| 3.3                                               | Build ServicesPageTemplate                                                               |
| 3.4                                               | Build AboutPageTemplate                                                                  |
| 3.5                                               | Build ContactPageTemplate                                                                |
| 3.6                                               | Build BlogIndexTemplate                                                                  |
| 3.7                                               | Build BlogPostTemplate                                                                   |
| 3.8                                               | Build BookingPageTemplate                                                                |
| **Integrations**                                  |                                                                                          |
| 4.1                                               | Email Marketing Integrations                                                             |
| 4.2                                               | Scheduling Integrations                                                                  |
| 4.3                                               | Chat Support Integrations                                                                |
| 4.4                                               | Review Platform Integrations                                                             |
| 4.5                                               | Maps Integration                                                                         |
| 4.6                                               | Industry Schemas Package                                                                 |
| **Client Factory**                                |                                                                                          |
| 5.1                                               | Create Starter-Template in clients/                                                      |
| 5.2                                               | Luxe-Salon Example Client                                                                |
| 5.3                                               | Bistro-Central Example Client                                                            |
| 5.4                                               | Law Firm (Chen-Law) Example                                                              |
| 5.5                                               | Medical (Sunrise-Dental) Example                                                         |
| 5.6                                               | Retail (Urban-Outfitters) Example                                                        |
| **Cleanup & Docs**                                |                                                                                          |
| 6.1                                               | Migrate Template Content                                                                 |
| 6.2                                               | Create Migration Guide                                                                   |
| 6.2a                                              | Update clients/README                                                                    |
| 6.3                                               | Remove Templates Directory                                                               |
| 6.4                                               | Create Component Library Documentation                                                   |
| 6.5                                               | Create Configuration Reference                                                           |
| 6.6                                               | Create Feature Documentation                                                             |
| 6.7                                               | Create Architecture Decision Records                                                     |
| 6.8                                               | Create CLI Tooling                                                                       |
| 6.9                                               | Remove Dead Code and Unused Dependencies                                                 |
| 6.10a                                             | Add validate-client Script                                                               |
| 6.10b                                             | Add health-check Script                                                                  |
| 6.10c                                             | Add program:wave0–wave3 Scripts                                                          |
| **Governance**                                    |                                                                                          |
| C.1                                               | Enforce Circular Dependency and Layering Checks                                          |
| C.2                                               | Harden pnpm Policy and Workspace Determinism                                             |
| C.3                                               | Enable Turborepo Remote Cache                                                            |
| C.4                                               | Multi-Track Release Strategy (Canary + Stable)                                           |
| C.5                                               | Three-Layer Design Token Architecture                                                    |
| C.6                                               | Motion Primitives and Creative Interaction Standards                                     |
| C.7                                               | Storybook + Visual Regression Testing                                                    |
| C.8                                               | Experimentation Platform (A/B + Feature Flags)                                           |
| C.9                                               | Personalization Rules Engine                                                             |
| C.10                                              | CMS Abstraction Layer                                                                    |
| C.11                                              | Localization and RTL Foundation                                                          |
| C.12                                              | Standardize Conversion Event Taxonomy                                                    |
| C.13                                              | Continuous Security Program                                                              |
| C.14                                              | Performance and Reliability SLO Framework                                                |
| C.15                                              | Spec-Driven Development Workflow                                                         |
| C.16                                              | AI-Assisted Delivery Playbooks                                                           |
| C.17                                              | Industry Compliance Feature Pack Framework                                               |
| C.18                                              | Edge Personalization and Experiment Routing                                              |
| **Advanced Recommendations**                      |                                                                                          |
| D.1                                               | Schema Governance Program                                                                |
| D.2                                               | Experimentation Statistics and Guardrails                                                |
| D.3                                               | Editorial Workflow and Preview Governance                                                |
| D.4                                               | Tenant Operations and Capacity Playbook                                                  |
| D.5                                               | Incident Management and Error Budget Policy                                              |
| D.6                                               | Continuous Accessibility Gates                                                           |
| D.7                                               | Ownership and Escalation Matrix                                                          |
| D.8                                               | Software Supply Chain Security Program                                                   |
| **Innovation**                                    |                                                                                          |
| E.1–E.7                                           | Round 1 — Adjacency-Derived Innovation                                                   |
| F.1–F.12                                          | Round 2 — Non-Direct-Domain Innovation                                                   |
| **Future AOS**                                    |                                                                                          |
| 7.1–7.3, 8.1–8.2, 9.1, 10.1                       | Phase 7+                                                                                 |
| **Strategic Enhancements**                        |                                                                                          |
| Part 6                                            | AEO, Privacy/Sustainability, DevEx, Real-Time, FSD, Digital Twin — see Part 6 roadmap    |

---

## Part 2: Research Reference

### Executive Summary

Comprehensive research on marketing-first monorepo architecture for 2026: best practices, standards, and methodologies for building flexible, industry-agnostic marketing website systems. Aligned with this repo and [THEGOAL.md](THEGOAL.md).

---

## 1. Monorepo Fundamentals 2026

### 1.1 Core Monorepo Principles

**What is a Monorepo?**

- A single repository containing multiple distinct projects with well-defined relationships
- Not just "code colocation" - intentional architecture for code sharing and consistency
- Enables atomic commits across projects, one version of everything, and developer mobility

**Key Benefits for Marketing Websites:**

- No overhead to create new client projects (reuse CI/CD, configs)
- Atomic commits across templates and shared packages
- One version of all dependencies (no conflicting versions)
- Consistent tooling and code standards across all client sites
- Easy extraction of common patterns into shared components
- Cross-package refactoring with single commit

**2026 Monorepo Anti-Patterns to Avoid:**

- ❌ Tight coupling between unrelated packages
- ❌ Circular dependencies in workspace graph
- ❌ Monolithic build without proper caching
- ❌ Mixed versioning strategies
- ❌ Ignoring affected package detection

### 1.2 2026 Monorepo Tooling Landscape

**Leading Tools Comparison:**

| Tool                | Maintainer | Best For                                  | Learning Curve | Scale        |
| ------------------- | ---------- | ----------------------------------------- | -------------- | ------------ |
| **Turborepo**       | Vercel     | Next.js/React projects, remote caching    | Low            | Medium-Large |
| **Nx**              | Nrwl       | Enterprise scale, polyglot repos          | Medium         | Enterprise   |
| **pnpm Workspaces** | pnpm team  | Lightweight, fast package management      | Low            | All sizes    |
| **Rush**            | Microsoft  | Enterprise with strict versioning         | High           | Enterprise   |
| **Lage**            | Microsoft  | Incremental builds, pipeline optimization | Medium         | Large        |
| **Bazel**           | Google     | Polyglot, massive scale                   | Very High      | Massive      |

**2026 Recommended Stack:**

- **Package Manager:** pnpm 10+ (fastest, strictest, best workspace support)
- **Task Runner:** Turborepo 2.x (remote caching, pipeline visualization)
- **Build System:** Next.js 16 + React 19 + TypeScript 5.7

**This Repo:** See [pnpm-workspace.yaml](pnpm-workspace.yaml) (catalog), [package.json](package.json) (Turbo 2.8.9, Node >=22).

**Turborepo 2.x Key Features (2026):**

- **Remote Caching:** Share build cache across CI and team members
- **Pipeline Visualization:** Visual DAG of task dependencies
- **Affected Package Detection:** Only build what changed
- **Watch Mode:** Continuous builds during development
- **Daemon Mode:** Background process for faster subsequent runs
- **Scoped Tasks:** Run commands in specific packages

**pnpm 10+ Advanced Features:**

- **Catalogs:** Define dependency versions as reusable constants
  ```yaml
  # pnpm-workspace.yaml (this repo)
  catalog:
    react: '19.0.0'
    next: '16.1.0'
  ```
  ```json
  // package.json
  "dependencies": {
    "react": "catalog:"
  }
  ```
- **Strict Peer Dependencies:** Enforces peer dependency contracts
- **Workspace Protocol:** `workspace:*` for internal dependencies
- **Injection:** Symlink workspace dependencies when possible
- **Content-Addressable Store:** Deduplicates packages across projects

**Catalog Advantages:**

- Maintain unique versions across workspace
- Easier upgrades - change one line in pnpm-workspace.yaml
- Fewer merge conflicts in package.json files
- Automatic dependency synchronization

### 1.3 Monorepo Structural Patterns

**Standard Marketing Website Monorepo Structure (aligned with [THEGOAL.md](THEGOAL.md)):**

```
├── packages/                # Shared libraries
│   ├── config/              # ESLint, TypeScript, Tailwind presets
│   ├── utils/               # cn(), class merging
│   ├── types/               # SiteConfig, industry types (moved from templates/shared)
│   ├── ui/                  # UI primitives (atoms)
│   ├── infra/               # Security, middleware, logging, env schemas
│   ├── marketing-components/# Marketing organisms (dir + components; package.json needed)
│   ├── features/            # booking, contact, blog, services, search, etc.
│   ├── page-templates/      # Composable page shells
│   ├── integrations/        # analytics, hubspot, supabase, email, scheduling, etc.
│   └── industry-schemas/    # JSON-LD generators (planned)
│
├── templates/               # Industry templates (to be deprecated after 6.3)
│   └── hair-salon/          # Current production template
├── clients/                 # Thin Next.js shells (site.config.ts only)
├── scripts/                 # Validation, health, architecture checks
└── docs/                    # Architecture, guides, ADRs
```

**This Repo Workspace (pnpm-workspace.yaml):** `packages/*`, `packages/config/*`, `packages/integrations/*`, `packages/features/*`, `templates/*`, `clients/*`, `apps/*`

**Package Dependency Direction (from THEGOAL):**

```
config → utils → ui, infra, types → features → marketing-components → page-templates → clients
                                                        ↑
                                              integrations (L0)
```

**Catalog (this repo):** next 16.1.0, react 19.0.0, typescript 5.7.2, radix-ui ^1.0.0, sonner ^2.0.7

**Repo vs THEGOAL mapping:** Current packages align with THEGOAL dependency order. `marketing-components` has components on disk but needs package.json (task 1.7). `industry-schemas` planned. See Part 3 for current package status.

---

## 2. Marketing-First Architecture 2026

### 2.1 Marketing Website Core Requirements

**Conversion Optimization Stack:**

- **Performance-first (Core Web Vitals)**

  - LCP < 2.5s, INP < 200ms, CLS < 0.1
  - INP (Interaction to Next Paint) replaced FID as Core Web Vital (March 2024)
  - Performance budgets per component

- **SEO-optimized (semantic HTML, structured data)**

  - JSON-LD structured data for all business types
  - Dynamic sitemap generation
  - Meta tag automation from content
  - Core Web Vitals as ranking factor

- **Analytics integration (consent-gated, privacy-first)**

  - GDPR/CCPA compliant by default
  - Consent management platform (CMP) integration
  - Server-side tracking options
  - Cookieless analytics support

- **A/B testing infrastructure**

  - Feature flags for experiments
  - Traffic splitting at edge
  - Statistical significance tracking
  - Integration with Optimizely, VWO, or custom

- **Personalization capabilities**
  - Behavioral targeting
  - Geo-location customization
  - Return visitor recognition (privacy-safe)
  - Content recommendation engines

**Multi-Industry Support:**

- Configurable business types (salons, restaurants, law firms, etc.)
- Industry-specific schemas and structured data
- Flexible content models (services, products, team, etc.)
- Localization and multi-language support (i18n)
- Multi-currency support for e-commerce

**Client Customization:**

- Brand theming (colors, fonts, logos)
- Feature toggles (enable/disable modules)
- Content management (CMS integration)
- Custom domain support with SSL
- White-label capabilities

### 2.2 Component Architecture Patterns

**Atomic Design Methodology (Enhanced 2026):**

- **Atoms:** Basic building blocks (Button, Input, Text)

  - Must be themeable via CSS custom properties
  - Should support dark mode by default
  - Accessibility built-in (ARIA, keyboard nav)

- **Molecules:** Simple component groups (SearchBar, FormField)

  - Composed of 2-3 atoms
  - Self-contained validation logic
  - Responsive by default

- **Organisms:** Complex components (Header, Hero, FeatureGrid)

  - Business logic integration
  - Data fetching capabilities (Server Components)
  - Multiple layout variants

- **Templates:** Page-level layouts (HomeTemplate, ServiceTemplate)

  - Configurable section ordering
  - A/B testable layouts
  - Responsive breakpoints

- **Pages:** Specific instances with real content
  - Thin wrappers around templates
  - SEO metadata configuration
  - Analytics event tracking

**Headless/Composable Architecture:**

- Decoupled frontend from CMS/backend
- API-first content delivery (REST/GraphQL)
- Component-driven development
- Micro-frontend ready (Module Federation)
- Edge-rendered components

**2026 Best Practice: shadcn/ui Pattern Evolution**

**February 2026 Updates:**

- **Unified Radix UI Package:** New-york style now uses unified `radix-ui` package
- **Blocks for Radix and Base UI:** All blocks available for both libraries
- **RTL Support:** Full right-to-left language support
- **Base UI Documentation:** Now supports both Radix and Base UI primitives

**shadcn/ui Architecture:**

```
┌─────────────────────────────────────┐
│           Your Application          │
├─────────────────────────────────────┤
│         @repo/ui (your DS)           │
│  ┌─────────────────────────────┐   │
│  │    shadcn/ui patterns       │   │
│  │    ┌─────────────────┐      │   │
│  │    │  Radix/Base UI  │      │   │
│  │    │   Primitives    │      │   │
│  │    └─────────────────┘      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Key Principles:**

- Copy-paste components (not dependencies)
- Built on Radix UI or Base UI primitives
- Tailwind CSS for styling
- Fully customizable and ownable
- No runtime dependency on shadcn/ui package

### 2.3 Design System Architecture

**Design Token Architecture (Three-Layer Model):**

Based on Martin Fowler's Design Token-Based UI Architecture:

**1. Option Tokens (Foundation Layer)**

- Define what design options are available
- Raw values: colors, spacing, typography scales
- Platform-agnostic (can be used for web, iOS, Android)

**2. Decision Tokens (Semantic Layer)**

- Define how styles are applied across the UI
- Semantic names: primary, secondary, success, error
- Theme-agnostic (work for light, dark, high-contrast)

**3. Component Tokens (Application Layer)**

- Define where exactly styles are applied
- Component-specific: button-primary-bg, input-border-color
- Implementation-specific

**CSS Custom Properties Implementation:**

```css
/* Option Tokens (Raw) */
:root {
  --color-teal-500: 174 85% 33%;
  --color-slate-900: 220 20% 14%;
  --space-4: 1rem;
}

/* Decision Tokens (Semantic) */
:root {
  --primary: var(--color-teal-500);
  --secondary: var(--color-slate-900);
  --spacing-md: var(--space-4);
}

/* Component Tokens */
:root {
  --button-primary-bg: var(--primary);
  --button-padding: var(--spacing-md);
}
```

**Benefits of Three-Layer Model:**

- **Consistency:** Changes propagate systematically
- **Flexibility:** Theme at any level
- **Clarity:** Clear abstraction boundaries
- **Maintainability:** Easier updates and debugging

**2026 Design Token Trends:**

- W3C Design Tokens Community Group standardization
- Token Studio integration with Figma
- Automated token generation from design files
- Runtime theme switching (no rebuild required)

---

## 3. Technology Stack 2026

### 3.1 Frontend Framework

**Next.js 16 - Key Features (this repo uses 16.1.0):**

- React 19 features, Turbopack improvements, stabilized caching
- See [Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16)

**App Router (Stable):**

- Server Components by default
- Streaming SSR for progressive rendering
- Nested layouts with parallel routes
- Route groups for organization
- Intercepting routes for modals

**Partial Prerendering (PPR) - Experimental:**

```typescript
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
};
```

- Combines static and dynamic rendering
- Static shell pre-rendered at build time
- Dynamic content streams in at request time
- Uses React Suspense boundaries

**Caching Strategy (Next.js 16):**
| Cache Type | Duration | Use Case |
|------------|----------|----------|
| Request Memoization | Request lifecycle | Same data, multiple calls |
| Data Cache | Indefinite (revalidate) | fetch() results |
| Full Route Cache | Build/revalidate | Static route segments |
| Router Cache | Session | Client-side navigation |

**Turbopack (Dev Server):**

- Rust-based bundler
- 10x faster than Webpack for large apps
- Native TypeScript support
- Fast HMR (Hot Module Replacement)

**React 19 - New Features:**

**Actions (Stable):**

```typescript
// Server Action
async function submitForm(formData: FormData) {
  'use server';
  // Server-side logic
  await saveToDatabase(formData);
}

// Client Component with Action
function ContactForm() {
  return <form action={submitForm}>...</form>;
}
```

**New Hooks:**

- `useActionState`: Form submission state management

  ```typescript
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    // Action logic
    return { success: true };
  }, initialState);
  ```

- `useFormStatus`: Access form submission status from child components

  ```typescript
  const { pending, data, method, action } = useFormStatus();
  ```

- `useOptimistic`: Optimistic UI updates

  ```typescript
  const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, newItem) => [
    ...currentState,
    newItem,
  ]);
  ```

- `use`: Read resources (Promises, Context) during render
  ```typescript
  const data = use(promise);
  ```

**Server Components Deep Dive:**

- Zero client-side JavaScript for static content
- Direct backend access (databases, file systems)
- Automatic code splitting
- Streaming for improved perceived performance

### 3.2 Styling & UI

**Tailwind CSS 3.4+ Features (Project uses 3.4.17):**

- JIT (Just-In-Time) compiler for fast builds
- CSS custom property support
- Plugin ecosystem (forms, typography, aspect-ratio)
- Design token integration
- Container queries support

> **Note:** Tailwind CSS v4.0 was released January 2025 with a completely
> new engine, CSS-first configuration, native cascade layers, and zero-config
> content detection. The project currently uses v3.4.17. Migration to v4
> should be evaluated — it's a significant architectural change (no more
> `tailwind.config.js`, uses `@import "tailwindcss"` in CSS instead).
> See [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide).

**Component Library Strategy (2026 Updated):**

**Option 1: Radix UI Primitives (Current shadcn/ui default)**

- Mature, battle-tested
- Comprehensive primitive set
- Good accessibility out of the box

**Option 2: Base UI (New 2026 alternative)**

- Lighter weight than Radix
- Modern architecture
- Growing primitive set
- Better tree-shaking

**Comparison:**
| Feature | Radix UI | Base UI |
|---------|----------|---------|
| Bundle Size | Larger | Smaller |
| Primitives | 20+ | 15+ |
| Accessibility | Excellent | Excellent |
| Maturity | Very mature | Newer |
| shadcn Support | Full | Full |

### 3.3 Type Safety & Validation

**TypeScript 5.7+ Features:**

- Strict mode enabled (non-negotiable for production)
- Path mapping for monorepo
- Shared types packages
- Decorator metadata (stage 3)
- Improved type inference

**Zod Schema Validation (2026 Best Practices):**

**Why Zod:**

- TypeScript-first schema validation
- Static type inference
- Zero dependencies
- Tree-shakeable
- Great error messages

**React Hook Form + Zod Pattern:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return <form>...</form>;
}
```

**Advanced Zod Patterns:**

- Preprocessing for file uploads
- Transform for data normalization
- Refinement for custom validation
- Union types for conditional schemas
- Coercion for type conversion

### 3.4 Content Management

**Headless CMS Landscape 2026:**

**Market Growth:**

- Headless CMS market: $3.94B (2026) → $22.28B (2034)
- CAGR: 21%+
- Driven by multi-channel content needs

**Top Platforms (G2 Rankings):**

| Platform       | G2 Score | Best For                     | Deployment        |
| -------------- | -------- | ---------------------------- | ----------------- |
| **Sanity**     | 4.7/5    | Structured content, AI-ready | Cloud/Self-hosted |
| **Strapi**     | 4.5/5    | Open-source, full control    | Self-hosted       |
| **Storyblok**  | 4.4/5    | Visual editing               | Cloud             |
| **Kontent.ai** | 4.3/5    | Enterprise workflows         | Cloud             |
| **Contentful** | 4.2/5    | Enterprise scale             | Cloud             |

**Sanity (Content Operating System):**

- Real-time collaboration (no lockouts)
- Schema as Code (TypeScript/JavaScript)
- Customizable Studio (React-based)
- AI-ready structured content
- Content Lake architecture

**2026 CMS Trends:**

- AI-assisted content generation
- Real-time collaborative editing
- Visual editing for headless
- Multi-language AI translation
- Content federation (multiple sources)

**Git-Based Content (MDX):**

- Version controlled content
- Preview deployments
- No vendor lock-in
- Developer-friendly
- Code + content in one place

---

## 4. Security & Performance 2026

### 4.1 Security Best Practices

**Content Security Policy (CSP) - Strict CSP 2026:**

**Evolution from Allowlist to Strict CSP:**

- Old approach: Domain allowlists (easily bypassed)
- New approach: Nonce-based or hash-based strict CSP
- strict-dynamic for trusted scripts

**Recommended Strict CSP:**

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-{random}' 'strict-dynamic' https:;
  style-src 'self' 'nonce-{random}';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Nonce Generation (128-bit entropy):**

```typescript
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
```

**Security Headers (2026 Standards):**

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**OWASP Top 10 2026 Considerations:**

1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, XSS)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

**Privacy-First Analytics (2026 Landscape):**

| Tool                 | Type             | GDPR | Hosting        | Best For             |
| -------------------- | ---------------- | ---- | -------------- | -------------------- |
| **Plausible**        | Open-source      | ✅   | EU/Self        | Simple web analytics |
| **Umami**            | Open-source      | ✅   | Self           | Full control         |
| **Mitzu**            | Warehouse-native | ✅   | Your warehouse | Product analytics    |
| **Vercel Analytics** | Managed          | ✅   | Edge           | Next.js apps         |
| **PostHog**          | Open-source      | ✅   | EU/Self        | Full-featured        |

**Privacy Compliance Checklist:**

- [ ] No personal data collection without consent
- [ ] IP anonymization
- [ ] No cross-site tracking
- [ ] Cookie consent banner (if using cookies)
- [ ] Data retention policies
- [ ] Right to be forgotten implementation
- [ ] Data processing agreements (DPAs)

### 4.2 Performance Optimization

**Core Web Vitals 2026 (Updated):**

**INP (Interaction to Next Paint) - STABLE:**

- Replaced FID (First Input Delay) in **March 2024** (not 2026 — already in effect)
- Measures responsiveness to user interactions
- Target: < 200ms (Good), < 500ms (Poor)
- Measures time from interaction to next frame paint

**All Core Web Vitals Targets:**
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| INP | < 200ms | 200-500ms | > 500ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| TTFB | < 600ms | 600-1000ms | > 1000ms |
| FCP | < 1.8s | 1.8-3s | > 3s |

**INP Optimization Strategies:**

- Break up long tasks (< 50ms each)
- Use Web Workers for heavy computation
- Debounce/throttle event handlers
- Optimize event callbacks
- Reduce DOM size and depth

**Next.js Performance Features:**

- Image optimization (next/image): WebP, AVIF, responsive sizes
- Font optimization (next/font): Subsetting, font-display: swap
- Script optimization (next/script): Loading strategies
- Edge Runtime: Lower latency worldwide
- Streaming SSR: Progressive content delivery

**Performance Budgets (2026):**

```javascript
// next.config.js
module.exports = {
  performanceBudgets: {
    limits: [
      { type: 'script', maximum: 200000 }, // 200KB scripts
      { type: 'image', maximum: 500000 }, // 500KB images
      { type: 'css', maximum: 50000 }, // 50KB CSS
    ],
  },
};
```

---

## 5. Novel Methodologies & Techniques 2026

### 5.1 Spec-Driven Development

**Feature Specification Format (.kiro/specs/):**

```markdown
# Feature: Booking System

## Overview

Implement appointment booking functionality for service businesses.

## Acceptance Criteria

- [ ] Users can select service type
- [ ] Users can select date and time
- [ ] Users can provide contact information
- [ ] Form validates all inputs
- [ ] Confirmation email sent
- [ ] Admin receives notification

## Technical Requirements

- Server Actions for form submission
- Zod validation schemas
- Rate limiting (5 requests/hour)
- HubSpot CRM integration
- Calendar conflict checking

## Implementation Phases

1. Schema design and validation
2. UI component development
3. Server action implementation
4. Integration testing
5. E2E testing

## Architecture Decisions

- ADR-001: Use Server Actions over API routes
- ADR-002: Store bookings in Supabase
```

**Benefits:**

- Clear scope definition
- Documentation as artifact
- AI-assisted implementation ready
- Consistent feature delivery
- Historical decision tracking

### 5.2 Marketing-First Component Classification

**Extended Feature Tags System:**

```typescript
// Core Feature Tags
[FEAT:MARKETING]       // Conversion optimization
[FEAT:SEO]            // Search engine optimization
[FEAT:UX]             // User experience
[FEAT:ACCESSIBILITY]  // WCAG compliance
[FEAT:PERFORMANCE]    // Speed optimization
[FEAT:SECURITY]       // Security features
[FEAT:PRIVACY]       // Privacy/GDPR compliance
[FEAT:ANALYTICS]     // Tracking and measurement

// Extended Tags (2026)
[FEAT:MOBILE]        // Mobile/responsive
[FEAT:PWA]          // Progressive web app
[FEAT:DESIGN]       // Visual design
[FEAT:COMPONENTS]   // UI components
[FEAT:FORMS]        // Form handling
[FEAT:BOOKING]      // Appointment booking
[FEAT:ECOMMERCE]    // Shopping/payments
[FEAT:CONTENT]      // CMS/content
[FEAT:SOCIAL]       // Social features
[FEAT:LOCALIZATION] // i18n/l10n
[FEAT:AI]          // AI/ML integration
```

**Trace-Based Documentation:**

```typescript
// File-level
[TRACE:FILE=packages.ui.components.Button]

// Component-level
[TRACE:FUNC=packages.ui.components.Button]
[TRACE:INTERFACE=packages.ui.components.ButtonProps]
[TRACE:CONST=packages.ui.components.Button.variantStyles]
[TRACE:BLOCK=packages.ui.components.Button.renderLogic]
```

### 5.3 Multi-Tenant Client Architecture

**Site Configuration Pattern (Enhanced):**

```typescript
// site.config.ts
interface SiteConfig {
  // Identity
  id: string;
  name: string;
  tagline: string;
  industry: IndustryType;

  // Features (enables feature flags)
  features: {
    hero: HeroVariant;
    services: ServiceDisplayVariant;
    team: TeamDisplayVariant;
    testimonials: TestimonialVariant;
    pricing: PricingVariant;
    contact: ContactFormVariant;
    gallery: GalleryVariant;
    blog: boolean;
    booking: boolean;
    faq: boolean;
  };

  // Design System
  theme: {
    colors: ColorPalette;
    fonts: FontFamily;
    borderRadius: BorderRadiusScale;
    shadows: ShadowScale;
  };

  // Integrations
  integrations: {
    analytics?: AnalyticsConfig;
    crm?: CRMConfig;
    booking?: BookingProvider;
    email?: EmailProvider;
    chat?: ChatProvider;
    reviews?: ReviewProvider;
  };

  // SEO
  seo: {
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
    schemaType: SchemaType;
  };

  // Navigation
  navLinks: NavLink[];
  footer: FooterConfig;

  // Business Info
  contact: ContactInfo;
  hours: BusinessHours;

  // Conversion
  conversionFlow: ConversionConfig;
}
```

### 5.4 Template-to-Feature Extraction

**Migration Strategy (Detailed):**

**Phase 1: Inventory**

- Document all template components
- Map component dependencies
- Identify reusable patterns
- Catalog business logic

**Phase 2: Extract**

- Move components to `packages/`
- Refactor for configurability
- Maintain backward compatibility
- Extract shared utilities

**Phase 3: Configure**

- Replace hardcoded values with props
- Add variant support
- Implement feature flags
- Create configuration schemas

**Phase 4: Document**

- Usage guides per feature
- Configuration reference
- Migration instructions
- Best practices

**Phase 5: Deprecate**

- Mark templates as deprecated
- Migrate existing clients
- Remove templates/
- Update documentation

---

## 6. Industry-Specific Considerations

### 6.1 Service Businesses (Salons, Spas, Clinics)

**Core Features:**

- Online booking/scheduling (real-time availability)
- Service menu with pricing and duration
- Staff/professional profiles with specialties
- Before/after galleries
- Reviews and testimonials
- Location and hours
- Gift card sales
- Membership/subscription management

**Structured Data:**

```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Luxe Salon",
  "address": {...},
  "telephone": "...",
  "priceRange": "$$",
  "hasOfferCatalog": {...},
  "employee": [...],
  "aggregateRating": {...}
}
```

**Key Integrations:**

- Scheduling: Square Appointments, Acuity, Calendly
- POS: Square, Clover, Shopify POS
- Reviews: Google Business, Yelp

### 6.2 Restaurants & Hospitality

**Core Features:**

- Menu display with dietary info (vegan, gluten-free, allergens)
- Online ordering/reservations (OpenTable, Resy)
- Photo galleries (food, ambiance)
- Chef/team profiles
- Location and hours
- Event calendar (live music, specials)
- Catering information
- Gift cards

**Structured Data:**

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Bistro Central",
  "servesCuisine": ["French", "Italian"],
  "priceRange": "$$$",
  "menu": "https://...",
  "acceptsReservations": true,
  "aggregateRating": {...}
}
```

**Key Integrations:**

- Reservations: OpenTable, Resy, Tock
- Delivery: DoorDash, UberEats, Grubhub
- Reviews: Yelp, Google, TripAdvisor

### 6.3 Professional Services (Law, Dental, Consulting)

**Core Features:**

- Service descriptions and practice areas
- Team credentials/profiles (education, certifications)
- Case studies/portfolio (where permitted)
- Consultation booking (intake forms)
- Resources/blog (thought leadership)
- Trust indicators (certifications, awards, associations)
- FAQ (common client questions)
- Secure document upload

**Structured Data:**

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Chen Law Firm",
  "areaServed": {...},
  "hasMap": "...",
  "priceRange": "$$$",
  "aggregateRating": {...}
}
```

**Compliance Considerations:**

- Attorney advertising disclaimers
- HIPAA compliance (medical)
- Client confidentiality
- Professional liability insurance mentions

### 6.4 Retail & E-commerce

**Core Features:**

- Product catalogs with filtering
- Shopping cart and checkout
- Inventory management
- Reviews and ratings
- Related products
- Wishlist/favorites
- Order tracking
- Returns/exchanges

**Structured Data:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "image": "...",
  "description": "...",
  "brand": {...},
  "offers": {...},
  "aggregateRating": {...}
}
```

**Key Integrations:**

- Payments: Stripe, Square, PayPal
- Shipping: ShipStation, EasyPost
- Inventory: Shopify, BigCommerce
- Reviews: Yotpo, Trustpilot

### 6.5 Additional Industries (2026 Additions)

**Fitness & Wellness:**

- Class schedules and booking
- Trainer profiles
- Membership management
- Progress tracking
- Nutrition planning

**Real Estate:**

- Property listings
- Agent profiles
- Mortgage calculators
- Virtual tours
- Neighborhood guides

**Construction/Trades:**

- Project portfolios
- Service areas
- Free estimate forms
- License/insurance verification
- Before/after galleries

**Education:**

- Course listings
- Instructor profiles
- Enrollment forms
- Schedule/timetables
- Resource downloads

---

## 7. Development Workflow 2026

### 7.1 Modern Tooling

**Package Management (pnpm 10+):**

**Key Configuration (.npmrc):**

```ini
# Strict dependency management
strict-peer-dependencies=true
auto-install-peers=false

# Performance
node-linker=isolated
shamefully-hoist=false

# Workspace
prefer-workspace-packages=true
link-workspace-packages=true
```

**Workspace Commands:**

```bash
# Install all dependencies
pnpm install

# Add dependency to specific package
pnpm --filter @repo/ui add lodash

# Run script in all packages
pnpm -r run build

# Run script in changed packages only
pnpm --filter "...[origin/main]" run build

# Update all packages
pnpm up --latest --recursive
```

**Task Orchestration (Turborepo):**

**turbo.json Configuration:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Remote Caching Setup:**

```bash
# Environment variables
TURBO_TOKEN=your-token
TURBO_TEAM=your-team-slug

# Enable in CI
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Code Quality (ESLint 9 Flat Config):**

**ESLint 9 Migration:**

- New flat config format (eslint.config.js)
- No more .eslintrc files
- Better performance
- Native TypeScript support

**Monorepo ESLint Configuration:**

```javascript
// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
```

**TypeScript Monorepo Setup:**

**Root tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/utils" },
    { "path": "./packages/infra" }
  ]
}
```

### 7.2 CI/CD Best Practices

**GitHub Actions Workflow:**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: pnpm/action-setup@v3
        with:
          version: 10.29.2

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

**Caching Strategy:**

1. **pnpm store:** Cache ~/.local/share/pnpm/store
2. **Turborepo remote cache:** Cloud-based build caching
3. **GitHub Actions cache:** node_modules, .turbo
4. **Next.js build cache:** .next/cache

**Affected Package Detection:**

```bash
# Only test packages that changed
pnpm test --filter="...[origin/main]"

# Only build affected packages
pnpm build --filter="...[origin/main]"
```

**Deployment Strategy:**

| Environment | Trigger         | Caching | Preview |
| ----------- | --------------- | ------- | ------- |
| Production  | Push to main    | Full    | No      |
| Staging     | Manual/Schedule | Full    | No      |
| Preview     | PR open         | Partial | Yes     |
| Development | Local           | None    | N/A     |

### 7.3 Documentation Standards

**Documentation Types:**

| Document        | Location     | Audience     | Update Frequency |
| --------------- | ------------ | ------------ | ---------------- |
| README.md       | Root         | Everyone     | Major changes    |
| CONTRIBUTING.md | Root         | Contributors | Process changes  |
| ARCHITECTURE.md | docs/        | Developers   | Design changes   |
| COMPONENTS.md   | packages/ui/ | Developers   | New components   |
| API.md          | packages/\*/ | Integrators  | API changes      |
| CHANGELOG.md    | Root         | Users        | Releases         |

**Code Documentation Standards:**

- Metaheaders with TRACE annotations (project standard)
- JSDoc for public APIs
- Inline comments for complex logic
- TypeScript for type documentation
- Storybook for component documentation

**Documentation as Code:**

- MDX for guides and tutorials
- Version-controlled with code
- Reviewed in PR process
- Deployed with site

---

## 8. Agency Operating System (AOS) Architecture

**2026 Enterprise Architecture Pattern for Marketing Agencies**

The Agency Operating System model provides a layered architecture for building scalable, multi-tenant marketing platforms. While the current project scope focuses on layers 2-3 (Component Library and Experience Layer), understanding the full AOS architecture enables future expansion.

### 8.1 Seven-Layer Architecture Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive MRM) │
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)     │
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Editing)│
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)         │
│  LAYER 2: Component Library            (Atomic design system, 1000+ comps) │
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution, ML)    │
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Current Project Scope (Layers 2-3)

**LAYER 2: Component Ecosystem (Atomic Design)**

The project implements a focused Component Library layer aligned with [THEGOAL.md](THEGOAL.md):

```
packages/
├── @repo/ui (Primitives)           # Atoms: Button, Input, Dialog, etc.
├── @repo/marketing-components      # Molecules/Organisms: Hero, Services, etc.
├── @repo/features                  # Feature modules: Booking, Contact, Blog, etc.
└── @repo/page-templates            # Page-level layouts
```

**Current package status:** See Part 3 Package Status table.

**LAYER 3: Experience Composition**

The page template system enables experience composition:

- **Site Composer**: Configuration-driven page assembly via `site.config.ts`
- **Multi-Channel**: Next.js PWA support, responsive design
- **Localization**: i18n-ready structure
- **SEO Automation**: Structured data generators, meta optimization

### 8.3 Future Expansion Path (Layers 4-7)

**LAYER 4: Content & Asset Management (Future Phase)**

| Component            | Purpose                    | Timeline |
| -------------------- | -------------------------- | -------- |
| Headless CMS Unified | CMS-agnostic content layer | Phase 3  |
| Visual Editing       | Storyblok-like editor      | Phase 4  |
| DAM Core             | Asset management           | Phase 4  |
| AI Content Engine    | Generative copy/images     | Phase 5  |

**LAYER 5: Marketing Operations (Future Phase)**

| Component              | Purpose               | Timeline |
| ---------------------- | --------------------- | -------- |
| Campaign Orchestration | Campaign management   | Phase 6  |
| Resource Management    | Capacity planning     | Phase 6  |
| Budget ROI             | Spend tracking        | Phase 6  |
| Client Collaboration   | White-labeled portals | Phase 7  |

**LAYER 6: AI & Agentic Layer (Future Phase)**

| Component           | Purpose                          | Timeline  |
| ------------------- | -------------------------------- | --------- |
| Agent Orchestration | Autonomous campaign optimization | Phase 5-6 |
| Model Garden        | LLM gateway, fine-tuning         | Phase 5   |
| Predictive Engine   | Lead scoring, churn prevention   | Phase 6   |
| MCP Servers         | Model Context Protocol           | Phase 5   |

**LAYER 7: Client Delivery (Current)**

| Component          | Purpose                   | Status      |
| ------------------ | ------------------------- | ----------- |
| Client Instances   | Per-client deployed sites | In Progress |
| Component Showroom | Storybook docs            | Planned     |

### 8.4 Architectural Patterns from AOS

**Pattern 1: Edge-First Multi-Tenancy**

Resolve tenant context at the edge for performance:

```typescript
// middleware.ts (runs at edge)
export default async function middleware(req: NextRequest) {
  const tenant = await resolveTenant(req.headers.get('host'));
  const config = await getTenantConfig(tenant.id);

  // Inject tenant context into request
  req.headers.set('x-tenant-id', tenant.id);
  req.headers.set('x-feature-flags', JSON.stringify(config.features));

  return NextResponse.next({ request: req });
}
```

**Pattern 2: Composable DXP Assembly**

Clients assemble their stack via configuration:

```typescript
// site.config.ts
export const siteConfig: SiteConfig = {
  stack: {
    cms: 'sanity', // or 'contentful', 'strapi'
    analytics: 'plausible', // or 'google', 'segment'
    booking: 'internal', // or 'calendly', 'acuity'
    crm: 'hubspot', // or 'salesforce'
  },
  components: {
    include: ['@repo/healthcare-components'],
    exclude: ['@repo/gamification'],
  },
  ai_agents: {
    enabled: ['content-optimizer'],
  },
};
```

**Pattern 3: Zero-Copy Data Federation**

Query data where it lives rather than moving it:

```typescript
// Federated query pattern
const unifiedQuery = `
  SELECT customer_id, ltv_score, last_ad_click
  FROM snowflake.clients.orders
  JOIN cdp.profiles USING (customer_id)
  WHERE tenant_id = ${currentTenant.id}
`;
```

**Pattern 4: Agentic CMS Architecture**

Autonomous agents respond to data changes:

```typescript
// Agent configuration example
const inventoryAgent = {
  trigger: 'PIM.stock_level < 10',
  action: [
    'updateHeroBanner({ urgency: "low_stock" })',
    'triggerEmailCampaign({ segment: "waitlist" })',
  ],
};
```

### 8.5 Package Inventory by Layer (Full AOS)

**LAYER 0: Infrastructure & Multi-Tenancy**

```
packages/infrastructure/
├── tenant-core/                    # Multi-tenant isolation engine
│   ├── tenant-context/             # Request scoping, data isolation
│   ├── tenant-provisioning/        # Automated client onboarding
│   └── tenant-config/              # Per-client feature flags, theming
├── edge-platform/                  # Edge computing & global CDN
│   ├── edge-functions/             # Vercel/Cloudflare Workers
│   ├── geo-routing/                # Localization, compliance routing
│   └── edge-cache/                 # Multi-tenant caching strategies
├── security-governance/            # Zero-trust, PQC-ready security
│   ├── identity-federation/        # SSO, SAML, OIDC
│   ├── encryption-service/         # Client-side encryption (CSE)
│   └── compliance-engine/          # GDPR, CCPA, NIS2 automation
└── observability/                  # Unified monitoring across tenants
    ├── distributed-tracing/
    ├── cost-attribution/           # Per-client infrastructure costs
    └── performance-budgets/
```

**LAYER 1: Data & Real-Time Analytics**

```
packages/data-platform/
├── unified-cdp/                    # Customer Data Platform core
│   ├── identity-resolution/        # Cross-channel identity graph
│   ├── real-time-streaming/        # Event ingestion (<100ms latency)
│   ├── audience-engine/            # Segmentation, lookalikes
│   └── privacy-vault/              # Consent management, data residency
├── attribution-engine/             # Marketing mix modeling (MMM)
│   ├── multi-touch-attribution/    # Data-driven attribution models
│   ├── incrementality-testing/     # Causal inference, lift analysis
│   └── halo-effect-analyzer/       # Brand impact measurement
└── predictive-analytics/           # AI/ML model serving
    ├── churn-prediction/
    ├── ltv-forecasting/
    └── next-best-action/           # Real-time personalization
```

**LAYER 2: Component Ecosystem (Current Focus)**

```
packages/components/
├── @agency/primitives/             # Design tokens, icons, utilities
│   ├── tokens/                     # CSS custom properties
│   ├── icons/                      # Icon library (via lucide-react)
│   └── motion/                     # Animation primitives
├── @agency/atoms/                  # Atomic components
│   ├── button/                     # Variants, loading states
│   ├── input/                      # Validation, masking
│   ├── typography/                 # Fluid type, variable fonts
│   └── media/                      # Responsive images, lazy loading
├── @agency/molecules/              # Composed atoms
│   ├── forms/                      # Multi-step, conditional logic
│   ├── cards/                      # Content variants
│   ├── navigation/                 # Menus, breadcrumbs
│   └── feedback/                   # Toasts, modals, tooltips
├── @agency/organisms/              # Section components
│   ├── heroes/                     # Layout variants
│   ├── content-sections/           # Feature grids, split content
│   ├── commerce-sections/          # Product showcases, pricing
│   ├── trust-sections/             # Testimonials, logos
│   └── conversion-sections/        # CTAs, lead capture
├── @agency/templates/              # Page-level layouts
│   ├── landing-pages/              # SaaS, product templates
│   ├── content-pages/              # Blog, docs
│   └── commerce-pages/             # PLP, PDP
└── @agency/variants/               # Industry-specific packs
    ├── healthcare-components/      # HIPAA-compliant forms
    ├── fintech-components/         # Secure inputs
    └── b2b-components/             # ROI calculators
```

**LAYER 3: Experience Composition (Current Focus)**

```
packages/experience-layer/
├── site-composer/                  # Site assembly engine
│   ├── page-builder/               # Visual composition (future)
│   ├── a-b-testing/                # Built-in experimentation
│   ├── personalization-engine/     # Rule-based personalization
│   └── preview-service/            # Real-time previews
├── multi-channel/
│   ├── pwa-generator/              # PWA capabilities
│   ├── email-renderer/             # Email components
│   └── iot-adapter/                # Voice, smart displays
├── localization/
│   ├── i18n-core/                  # Translation management
│   ├── cultural-adaptation/        # RTL, formatting
│   └── geo-personalization/        # Location-based content
└── seo-automation/
    ├── technical-seo/              # Structured data, Core Web Vitals
    ├── content-optimization/       # AI-powered meta generation
    └── rank-tracking/              # SERP monitoring
```

---

## 9. Emerging Technologies & Future Considerations

### 9.1 AI Integration (2026 Landscape)

**AI-Powered Development:**

- AI-assisted code generation (GitHub Copilot, Cursor)
- Automated test generation
- AI code review
- Documentation generation

**AI for Marketing Sites:**

- Personalized content generation
- A/B test variant creation
- SEO optimization suggestions
- Chatbot integration
- Image generation (DALL-E, Midjourney)

**Considerations:**

- Data privacy with AI services
- Hallucination risks
- Cost management
- Vendor lock-in

### 9.2 Edge Computing Trends

**Edge-First Architecture:**

- Vercel Edge Functions
- Cloudflare Workers
- AWS Lambda@Edge
- Google Cloud Edge

**Use Cases:**

- Geolocation personalization
- A/B testing at edge
- Authentication/authorization
- API aggregation
- Content transformation

**Performance Benefits:**

- Sub-50ms cold starts
- Global distribution
- Reduced origin load
- Better caching

### 9.3 WebAssembly (Wasm) Considerations

**When to Use:**

- Heavy computation (image processing)
- Cryptography operations
- Gaming/simulations
- Legacy code reuse (C++, Rust)

**2026 Maturity:**

- Browser support: Excellent
- Tooling: Improving rapidly
- Use in marketing sites: Niche but growing

---

## 10. Research Sources

### Primary Sources

- [monorepo.tools](https://monorepo.tools/) - Comprehensive monorepo guide
- [Turborepo Documentation](https://turbo.build/repo/docs) - Official docs
- [shadcn/ui](https://ui.shadcn.com/) - Component library patterns
- [Radix UI](https://www.radix-ui.com/) - Accessibility primitives
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [pnpm Catalogs](https://pnpm.io/catalogs) - Workspace dependency management
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/) - Security best practices
- [web.dev Core Web Vitals](https://web.dev/articles/inp) - Performance metrics
- [Sanity CMS](https://www.sanity.io/) - Headless CMS insights
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) - React features

### Industry Analysis

- G2 Headless CMS Rankings 2026
- Netlify Blog: Modular web design architecture
- Vercel Engineering: Monorepo patterns
- Martin Fowler: Design Token-Based UI Architecture
- Various technical blogs and conference talks

---

## 11. Research Gaps & Future Additions

**Status:** Analysis complete — 150+ research topics identified for addition  
**Reference:** See `RESEARCH_GAPS.md` for comprehensive analysis

### 11.1 High-Priority Research Additions Needed

**UI Primitives Deep Dive (§10 - NEW SECTION):**

- Advanced form components (Command Palette, Date/Time Pickers, File Upload, Color Picker)
- Data display components (Table, Tree View, Timeline, Stepper)
- Navigation & layout components (Breadcrumb, Pagination, Carousel, Masonry)
- Advanced interaction components (Drag and Drop, Resizable Panels, Virtual List, Infinite Scroll)
- Feedback & status components (Rating, Progress, Skeleton, Alert/Alert Dialog)
- Advanced input components (Slider, Switch, Radio/Checkbox Groups, Select Enhanced)
- Overlay & modal components (Sheet, Popover Enhanced, Tooltip Enhanced, Hover Card)
- Utility components (Aspect Ratio, Separator, Badge, Avatar)

**Marketing Component Patterns (§11 - NEW SECTION):**

- Navigation & structure components (Navigation Systems, Footer Components)
- Content display components (Blog, Portfolio, Case Study Components)
- E-commerce components (Product Components, E-commerce Patterns)
- Event & booking components (Event Components, Location Components)
- Restaurant & menu components (Menu Components, Restaurant Patterns)
- Education & course components (Course Components, Resource Components)
- Job & career components (Job Listing Components, Career Patterns)
- Interactive & engagement components (Interactive Components, Widget Components)
- Social & proof components (Social Proof Components, Social Media Integration)
- Media components (Video Components, Audio Components, Gallery Enhanced)
- Search & filter components (Search Components, Filter Components)
- Comparison & analysis components (Comparison Components)

**Feature Implementation Patterns (§12 - NEW SECTION):**

- Search & discovery features (Search Feature, Filter Feature)
- Communication features (Newsletter, Chat, Notification Features)
- Analytics & optimization features (Analytics, A/B Testing, Personalization Features)
- E-commerce features (E-commerce, Payment, Reviews Features)
- Content & management features (Content Management, Form Builder, File Upload Features)
- Authentication & security features (Authentication, Security Features)
- Localization & SEO features (Localization, SEO Features)
- Performance & monitoring features (Performance, Monitoring Features)
- Integration & automation features (Integration, Automation, Webhook Features)
- API & data features (API, Backup, Migration Features)
- Reporting & analytics features (Reporting Feature)

**Infrastructure Systems Research (§13 - NEW SECTION):**

- Composition systems (Slot, Render Prop, HOC, Context, Provider Systems)
- Variant & customization systems (Variant System, Customization Hooks, Theme Extension)
- Layout & responsive systems (Layout, Grid, Responsive, Spacing Systems)
- Design token systems (Typography, Color, Shadow, Border Systems)
- Media systems (Icon, Image, Media Systems)
- State management systems (State Management, Form, Validation Systems)
- Error & loading systems (Error Handling, Loading Systems)
- Accessibility systems (Accessibility System)
- Performance systems (Performance System)
- Testing systems (Testing System)
- Documentation systems (Documentation System)
- Development & build systems (Development, Build, Deployment Systems)
- Monitoring systems (Monitoring System)
- Configuration & extension systems (Configuration, Plugin, Extension Systems)
- Style systems (Style System)

### 11.2 Medium-Priority Research Additions

**Advanced Component Patterns (§14 - NEW SECTION):**

- Animation & motion patterns (Animation System, Interaction System)
- Advanced composition patterns (Compound Components, Controlled vs Uncontrolled)
- Performance optimization patterns (Code Splitting, Memoization, Virtualization)
- Accessibility advanced patterns (ARIA Advanced, Keyboard Navigation, Screen Reader Support)

**Industry-Specific Research Expansion (§15 - EXPAND §6):**

- Fitness & Wellness industry patterns
- Real Estate industry patterns
- Construction & Trades industry patterns
- Education & Training industry patterns
- Healthcare & Medical industry patterns
- Non-Profit & Organizations industry patterns
- Technology & SaaS industry patterns

**Testing & Quality Assurance (§18 - NEW SECTION):**

- Testing strategies (Testing Pyramid, Testing Tools, Testing Patterns)
- Component testing (Component Testing, Visual Regression)
- E2E testing (E2E Testing Patterns)
- Performance testing (Performance Testing)
- Accessibility testing (Accessibility Testing)

**Security & Privacy Advanced (§17 - EXPAND §4.1):**

- Advanced security patterns (Authentication, Authorization, API Security)
- Privacy compliance advanced (GDPR, CCPA/CPRA, LGPD)
- Security monitoring (Security Monitoring, Vulnerability Management)

### 11.3 Lower-Priority Research Additions

**Emerging Technologies Advanced (§16 - EXPAND §9):**

- AI integration advanced (AI-Powered Features, AI Providers, AI Patterns)
- Edge computing advanced (Edge Platforms, Edge Patterns, Edge Performance)
- WebAssembly advanced (Wasm Use Cases, Wasm Tools, Wasm Patterns)
- Progressive Web Apps (PWA Features, PWA Patterns, PWA Tools)
- Web Components & Micro Frontends (Web Components, Micro Frontends, Integration)
- Real-time technologies (WebSockets, Server-Sent Events, GraphQL Subscriptions)
- Advanced performance techniques (Resource Hints, HTTP/3 & QUIC, Streaming)

**Deployment & DevOps Advanced (§19 - EXPAND §7.2):**

- Deployment strategies (Deployment Patterns, Deployment Platforms)
- CI/CD advanced (CI/CD Patterns, CI/CD Tools)
- Monitoring & observability (Observability, Monitoring Tools)
- Infrastructure as Code (IaC Patterns, Containerization)

**Documentation & Developer Experience Advanced (§20 - EXPAND §7.3):**

- Documentation patterns (Documentation Types, Documentation Tools)
- Developer experience (DevEx Patterns, DevEx Metrics)

### 11.4 Research Addition Priority

| Priority   | Sections           | Estimated Effort | Timeline             |
| ---------- | ------------------ | ---------------- | -------------------- |
| **High**   | §10, §11, §12, §13 | 80-100 hours     | Phase 1 (Weeks 1-4)  |
| **Medium** | §14, §15, §18, §17 | 40-60 hours      | Phase 2 (Weeks 5-8)  |
| **Lower**  | §16, §19, §20      | 20-30 hours      | Phase 3 (Weeks 9-12) |

### 11.5 Research Sources to Add

**Academic & Standards:**

- W3C WCAG 2.2 Guidelines
- W3C Web Sustainability Guidelines (WSG)
- OWASP Top 10 2026
- Schema.org documentation
- ARIA Authoring Practices Guide

**Framework & Library Documentation:**

- React 19 documentation
- Next.js 16 documentation
- Radix UI documentation
- Tailwind CSS documentation
- Zod documentation
- React Hook Form documentation
- Framer Motion documentation

**Component Library References:**

- shadcn/ui components
- Radix UI primitives
- Base UI components
- Material UI patterns
- Chakra UI patterns

**Tool Documentation:**

- Turborepo documentation
- pnpm documentation
- Vitest documentation
- Playwright documentation
- Storybook documentation

**AI & Emerging Tech:**

- OpenAI API documentation
- Anthropic API documentation
- Vector database documentation
- Edge computing platforms documentation

---

## 12. Key Takeaways

1. **Marketing-first means conversion-optimized** - Every component should drive toward business goals
2. **Monorepo enables consistency** - Shared packages ensure all clients benefit from improvements
3. **Spec-driven development** - Clear specifications lead to better implementations
4. **CSS custom properties enable theming** - Runtime branding without code changes
5. **Headless CMS provides flexibility** - Content separate from presentation
6. **Security and privacy are non-negotiable** - 2026 requires privacy-first analytics
7. **Performance is a feature** - Core Web Vitals directly impact conversions
8. **INP is the new metric** - Interaction responsiveness matters more than ever
9. **AI is changing development** - Embrace AI-assisted tools responsibly
10. **Edge computing is mainstream** - Use edge for personalization and performance
11. **Comprehensive research foundation required** - 150+ research topics identified for 300+ tasks
12. **Research gaps prioritized** - High-priority sections needed for immediate implementation

---

_Research compiled: February 2026_
_Enhanced Edition_
_For: Marketing Website Templates Monorepo_
_Research Gaps Analysis: See RESEARCH_GAPS.md for detailed breakdown_

---

## Part 3: Architecture & Execution

> **Repo alignment:** Matches [THEGOAL.md](THEGOAL.md) target layout and dependency direction. Full AOS layers: Part 2 §8.

### Architecture Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)     │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)         │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)              │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)        │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security) │ ← @repo/infra
└─────────────────────────────────────────────────────────────────────────────┘
```

### Package Status (this repo)

| Layer  | Package                      | Status                       | Scope                                                                                       |
| ------ | ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| **--** | Housekeeping (Wave 0)        | Complete                     | Config fixes, tooling, CI, bug fixes done                                                   |
| **L2** | `@repo/ui`                   | 10 of 14                     | Container, Section, Button, Card, Input, Select, Textarea, Accordion, Dialog, ThemeInjector |
| **L2** | `@repo/marketing-components` | Dir + components; no package | Hero (4), Services (4), Team (3), Testimonials (3), Pricing (2); package.json needed (1.7)  |
| **L2** | `@repo/features`             | 5 of 9                       | booking, contact, blog, services, search                                                    |
| **L2** | `@repo/types`                | Complete                     | In packages; SiteConfig, industry types                                                     |
| **L3** | `@repo/page-templates`       | Scaffolded only              | 0 of 7 templates; add 3.1 then 3.2–3.8                                                      |
| **L3** | `clients/`                   | Not started                  | Add 5.1 (starter) then 5.2–5.6                                                              |
| **L0** | `@repo/infra`                | Complete                     | Security, middleware, logging, 7 env schemas                                                |
| **L0** | `@repo/integrations`         | Partial                      | 3 exist (analytics, hubspot, supabase), more planned                                        |

### Vision: Configuration-as-Code Architecture (CaCA)

Every aspect of a client website — theming, page composition, feature selection, SEO schema — is driven by a single validated `site.config.ts`. No code changes required to launch a new client. Config is the product. Code is the escape hatch.

### Wave Plan (Critical Path)

```
Wave 0 (Repo Integrity) ────────────────────────────────────────────────────────┐
├── Batch A (config fixes)         ───── parallel ─────┐                        │
├── Batch B (code fixes)           ───── parallel ─────┤                        │
├── Batch C (tooling)              ───── after A ──────┘                        │
└── Batch D (upgrades + CI)        ───── after A+B+C ──────────────────────────┘
    │
    ├──→ Wave 1 Track A: Config + Types (0.8 → 1.8 → 1.9)
    ├──→ Wave 1 Track B: Feature Extraction (2.11 → 2.12-2.20)
    ├──→ Wave 1 Track C: Testing (2.21 → 2.22)
    │
    └──→ Wave 2: Page Templates (3.1-3.8)
         │
         └──→ Wave 3: Client Factory (5.1-5.7, 6.10)
```

### Parallelization Model

| Track                            | Tasks                           | Outcome                        |
| -------------------------------- | ------------------------------- | ------------------------------ |
| **Track A (Core Platform)**      | 0.x → Config/Types → CI/release | Stable monorepo + typed config |
| **Track B (Feature Extraction)** | 2.11-2.22 + parity tests        | Reusable feature spine         |
| **Track C (Template Assembly)**  | 3.1-3.8 → starter client        | Launch-ready page assembly     |

### Dependency Health Matrix

| Dependency Path         | Execution Rule                                                           |
| ----------------------- | ------------------------------------------------------------------------ |
| `0.3 → 0.13`            | Ship CI gate immediately after Turbo upgrade                             |
| `0.8 → 1.8 → 1.9`       | Finish package move before config/industry expansion                     |
| `1.7 → 2.1-2.10`        | Create marketing-components package (1.7) before any marketing component |
| `2.11 → 2.12/13/15/20`  | Do not start extraction before feature skeleton exists                   |
| `2.21 → 2.22`           | Establish strategy first, then parity suite                              |
| `2.12-2.20 → 2.22`      | Add parity tests per extracted feature                                   |
| `3.1 → 3.2-3.8`         | Registry and package scaffold (3.1) before any page template             |
| `3.2/3.3/3.5/3.8 → 5.1` | Only start starter after minimum page set done                           |
| `5.1 → 5.2/5.3/5.7`     | Use starter as single source for first launch factory                    |
| `6.1/5.2-5.6 → 6.3`     | Never delete `templates/` until migration matrix complete                |
| `6.3/6.9/5.7 → 6.10`    | Require rollback rehearsal before cutover sign-off                       |

**Fast blocker checks before starting any task:**

1. Confirm all listed dependencies are marked complete
2. Confirm no dependency points to deferred NEXT/LATER work
3. Confirm CI gate requirements for the task's wave are already green
4. Confirm rollback path exists for any destructive or migration task

### Batching and Streamlining

| Batch | Tasks                              | Streamline approach                                                                                  |
| ----- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **A** | 1.2–1.6 (UI primitives)            | Implement 1.3 Tabs first as reference; scaffold Toast, Dropdown, Tooltip, Popover from same template |
| **B** | 2.1–2.10 (marketing components)    | Shared types first (2.1a, 2.2a); same folder structure per domain                                    |
| **C** | 3.2–3.8 (page templates)           | After 3.1, build 3.2 HomePageTemplate as reference; copy structure for others                        |
| **D** | 5.2–5.6 (example clients)          | Script: copy starter-template → clients/<name>; edit site.config.ts only                             |
| **E** | 2.16–2.19 (new features)           | Copy existing feature (e.g. contact/booking), find-replace name                                      |
| **F** | 4.1–4.5 (integrations)             | Adapter contract first; reuse retry/timeout pattern                                                  |
| **G** | 6.10a–6.10c (scripts)              | Do 6.10b (health) then 6.10a (validate-client); then 6.10c                                           |
| **H** | 6.4, 6.5, 6.6, 6.7 (documentation) | Storybook setup once; then doc sprint with shared template                                           |
| **I** | C.1–C.18, D.x (governance)         | Script-heavy: one pass to add check scripts + CI                                                     |

**Parent tasks with subtasks:** Mark parent complete only when all subtasks (e.g. 2.1a–2.1e) are done.

### Verified Findings (February 14 & 17, 2026 Audit)

> Corrections from 3 audit passes. Reference log.

**Corrections to Prior Analysis:**

| Claim                          | Actual                                                         |
| ------------------------------ | -------------------------------------------------------------- |
| "7 packages"                   | 5 top-level dirs → ~10 workspace packages                      |
| Search feature "no components" | Has SearchDialog (6.3KB) + SearchPage (3.5KB)                  |
| Services feature "1 component" | Has ServicesOverview + ServiceDetailLayout (8KB)               |
| conversionFlow "only booking"  | SiteConfig supports 4 flows: booking, contact, quote, dispatch |
| INP "replaces FID March 2026"  | INP replaced FID in **March 2024**                             |

**Key Discoveries:**

- **@repo/types** now in `packages/types/`. Defines `SiteConfig` with 4 conversion flow types.
- **7 env validation schemas** in `packages/infra/env/schemas/`.
- **Sonner catalog:** `sonner: '^2.0.7'` in pnpm catalog. BookingForm.tsx line 29 is current usage.
- **Radix UI:** Single `radix-ui` package (v1.4.3); import from `radix-ui`.
- **WCAG:** 2.2 current (24×24 px AA); 3.0 in Editor's Draft.
- **Vitest** preferred over Jest for new unit tests; Playwright for E2E.
- **TanStack Query:** Not in deps; optional. RSC + Server Actions preferred.

---

## Part 4: Tasks (with embedded specs + research)

> **Related Research:** Each task references Part 2 (Research Reference) sections. E.g. "§3.1" = Part 2, Section 3.1.

### UI Primitives (1.2–1.6)

#### 1.2 Create Toast Component (Enhanced)

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §3.1 (React 19), §4.2 (INP), §2.2 (shadcn/ui), §7.1 (pnpm catalog)

**Objective:** Non-blocking notification system with extensive customization. Sonner integration at L2 (@repo/ui). Current usage: `packages/features/src/booking/components/BookingForm.tsx` line 29.

**Enhanced Requirements:**

- **Variants:** success, error, warning, info, loading, custom (6 total)
- **Positions:** top-left, top-center, top-right, bottom-left, bottom-center, bottom-right (6 total)
- **Actions:** Action buttons, close button, dismiss on click, swipe to dismiss
- **Custom Content:** Rich HTML, icons, images, progress bars
- **Duration:** Auto-dismiss (configurable), persistent, manual dismiss
- **Queue Management:** Max visible toasts, stacking behavior, priority system
- **Animations:** Slide, fade, scale, bounce (4 animation types)
- **Accessibility:** ARIA live regions, keyboard navigation, screen reader announcements

**Files:** Create `packages/ui/src/components/Toast.tsx`, `Toaster.tsx`, `toast/types.ts`, `toast/hooks.ts`; update `index.ts`.

**API:** `Toaster(props?)`, `toast.success/error/warning/info/loading/custom`, `toast.promise(promise, {loading, success, error})`, `toast.dismiss(id)`, `toast.dismissAll()`, `useToast()`

**Checklist:**

- 1.2a: Create Toast base component with variant system (3h)
- 1.2b: Add position system and queue management (2h)
- 1.2c: Add actions and custom content support (2h)
- 1.2d: Add animations and accessibility features (1h)
- Add sonner to @repo/ui via catalog; create Toaster + Toast; export; migrate BookingForm import.

**Done:** Builds; all variants work; positions configurable; actions functional; animations smooth; a11y compliant; BookingForm uses @repo/ui.
**Anti:** No custom queue beyond sonner's built-in; no persistence across sessions; stop at sonner foundation.

---

#### 1.3 Create Tabs Component (Enhanced)

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), §4.2 (INP)

**Objective:** Tabbed content with accessible tablist, roving focus, and extensive customization. Layer L2 (@repo/ui).

**Enhanced Requirements:**

- **Variants:** default, underline, pills, enclosed, soft (5 total)
- **Sizes:** sm, md, lg, xl (4 total)
- **Orientations:** horizontal, vertical (2 total)
- **URL Sync:** Hash-based and query parameter sync
- **Nested Tabs:** Support for tabs within tabs
- **Scrollable:** Horizontal/vertical scrolling for many tabs
- **Icons:** Icon support in triggers
- **Animations:** Smooth transitions, indicator animations
- **Accessibility:** Full keyboard navigation, ARIA attributes, focus management

**Files:** Create `packages/ui/src/components/Tabs.tsx`, `tabs/types.ts`, `tabs/hooks.ts`; update `index.ts`. Import from unified `radix-ui`.

**API:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `TabsIndicator`. Props: `orientation`, `activationMode`, `variant`, `size`, `syncWithUrl`, `scrollable`, `nested`.

**Checklist:**

- 1.3a: Create base Tabs component with Radix UI (2h)
- 1.3b: Add variant system and sizes (2h)
- 1.3c: Add URL sync functionality (2h)
- 1.3d: Add nested tabs and scrollable support (2h)
- Import Tabs from radix-ui; CVA variants; prefers-reduced-motion; export; type-check; build.

**Done:** Builds; all variants render; keyboard nav works; URL sync functional; nested tabs work; scrollable tabs; controlled/uncontrolled.
**Anti:** No framer-motion animations (use CSS transitions); URL sync limited to hash/query params.

---

#### 1.4 Create Dropdown Menu Component (Enhanced)

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Clickable button revealing action list with advanced features. Full keyboard semantics, nested menus, typeahead, multi-select. Layer L2.

**Enhanced Requirements:**

- **Variants:** default, compact, spacious (3 total)
- **Typeahead:** Keyboard character matching for quick navigation
- **Multi-Select:** Checkbox items with multi-selection support
- **Checkbox/Radio Items:** Menu items with checkboxes or radio buttons
- **Icons:** Leading and trailing icons in items
- **Groups:** Visual grouping with labels
- **Submenus:** Nested dropdown menus with arrow indicators
- **Keyboard Shortcuts:** Display and handle keyboard shortcuts
- **Animations:** Smooth open/close animations
- **Accessibility:** Full ARIA support, keyboard navigation, focus management

**Files:** Create `packages/ui/src/components/DropdownMenu.tsx`, `dropdown-menu/types.ts`, `dropdown-menu/hooks.ts`; update `index.ts`.

**API:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuLabel`, `DropdownMenuShortcut`, etc. (full Radix set + enhancements)

**Checklist:**

- 1.4a: Create base DropdownMenu with Radix UI (3h)
- 1.4b: Add typeahead functionality (2h)
- 1.4c: Add checkbox and radio item variants (2h)
- 1.4d: Add multi-select support and keyboard shortcuts (2h)
- 1.4e: Add animations and accessibility enhancements (1h)
- Import from radix-ui; CVA variants; keyboard nav + typeahead; export; a11y tests.

**Done:** Builds; keyboard nav; nested menus; typeahead works; multi-select functional; checkbox/radio items; keyboard shortcuts display.
**Anti:** No custom positioning beyond Radix; stop at Radix foundation.

---

#### 1.5 Create Tooltip Component (Enhanced)

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), WCAG 1.4.13

**Objective:** Small popup on hover/focus with extensive positioning and customization. Layer L2. WCAG 2.2 1.4.13 compliance.

**Enhanced Requirements:**

- **Positions:** top, top-start, top-end, bottom, bottom-start, bottom-end, left, left-start, left-end, right, right-start, right-end (12 total)
- **Trigger Modes:** hover, focus, click, manual (4 total)
- **Rich Content:** Icons, formatted text, links (accessible)
- **Delays:** Show delay, hide delay (configurable)
- **Collision Detection:** Auto-adjust position when near viewport edge
- **Animations:** Fade, slide, scale (3 animation types)
- **Arrow:** Optional arrow pointing to trigger
- **Accessibility:** WCAG 1.4.13 compliance (hoverable, dismissible), ARIA attributes, keyboard support

**Files:** Create `packages/ui/src/components/Tooltip.tsx`, `tooltip/types.ts`, `tooltip/hooks.ts`; update `index.ts`.

**API:** `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipArrow`. Props: `side`, `align`, `sideOffset`, `alignOffset`, `delayDuration`, `disableHoverableContent`, `collisionPadding`.

**Checklist:**

- 1.5a: Create base Tooltip with Radix UI (2h)
- 1.5b: Add all 12 position variants (2h)
- 1.5c: Add multiple trigger modes (2h)
- 1.5d: Add rich content support and animations (2h)
- Import from radix-ui; provider for delay; WCAG 1.4.13 (hoverable, dismissible); export.

**Done:** Builds; all positions work; hover/focus/click triggers; rich content displays; escape dismissal; collision detection; animations smooth.
**Anti:** Rich HTML limited to accessible patterns; text-only fallback for screen readers.

---

#### 1.6 Create Popover Component (Enhanced)

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Rich interactive overlay with advanced positioning and composition. Click-outside dismissal, focus management. Layer L2. WCAG 2.2 Dialog pattern.

**Enhanced Requirements:**

- **Modes:** Modal, non-modal (2 total)
- **Positions:** All 12 positions (same as Tooltip)
- **Collision Detection:** Auto-adjust when near viewport edges
- **Slots:** Header, body, footer slots for composition
- **Nested Popovers:** Support for popovers within popovers
- **Animations:** Fade, slide, scale, zoom (4 animation types)
- **Arrow:** Optional arrow with positioning
- **Focus Management:** Focus trap in modal mode, return focus on close
- **Accessibility:** Full ARIA support, keyboard navigation, escape to close

**Files:** Create `packages/ui/src/components/Popover.tsx`, `popover/types.ts`, `popover/hooks.ts`; update `index.ts`.

**API:** `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverArrow`, `PopoverClose`, `PopoverHeader`, `PopoverBody`, `PopoverFooter`. Props: `side`, `align`, `modal`, `collisionPadding`, `animation`.

**Checklist:**

- 1.6a: Create base Popover with Radix UI (2h)
- 1.6b: Add collision detection and positioning (2h)
- 1.6c: Add slot system for composition (2h)
- 1.6d: Add nested popover support and animations (2h)
- Import from radix-ui; modal/non-modal modes; export; a11y tests.

**Done:** Builds; trigger works; modal focus trap; collision detection; slots functional; nested popovers; animations smooth.
**Anti:** No complex forms (use Dialog); stop at Radix foundation.

---

### UI Primitives (New 1.7–1.50)

#### 1.7 Create Badge Component

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Small status indicator with variants and sizes. Layer L2.

**Files:** Create `packages/ui/src/components/Badge.tsx`; update `index.ts`.

**API:** `Badge`. Props: `variant` (default, secondary, destructive, outline, ghost), `size` (sm, md, lg), `dot` (boolean).

**Checklist:** Create Badge component; CVA variants; export; type-check; build.
**Done:** Builds; all variants render; sizes work.
**Anti:** No animations; simple component only.

---

#### 1.8 Create Avatar Component

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** User avatar with image, fallback, and status indicator. Layer L2.

**Files:** Create `packages/ui/src/components/Avatar.tsx`; update `index.ts`.

**API:** `Avatar`, `AvatarImage`, `AvatarFallback`. Props: `size` (sm, md, lg, xl), `status` (online, offline, away, busy), `shape` (circle, square).

**Checklist:** Import Avatar from radix-ui; add status indicator; export; type-check; build.
**Done:** Builds; image/fallback work; status indicators display.
**Anti:** No custom status colors; stop at Radix.

---

#### 1.9 Create Skeleton Component

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §3.1 (React 19), §4.2 (Perceived performance)

**Objective:** Loading placeholder with shimmer animation. Layer L2.

**Files:** Create `packages/ui/src/components/Skeleton.tsx`; update `index.ts`.

**API:** `Skeleton`. Props: `variant` (text, circular, rectangular), `width`, `height`, `animate` (boolean).

**Checklist:** Create Skeleton component; add shimmer animation; export; type-check; build.
**Done:** Builds; shimmer animation works; variants render.
**Anti:** No custom animations; CSS-only shimmer.

---

#### 1.10 Create Separator Component

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Visual divider with horizontal/vertical orientation. Layer L2.

**Files:** Create `packages/ui/src/components/Separator.tsx`; update `index.ts`.

**API:** `Separator`. Props: `orientation` (horizontal, vertical), `decorative` (boolean).

**Checklist:** Import Separator from radix-ui; export; type-check; build.
**Done:** Builds; horizontal/vertical render.
**Anti:** No custom styling variants; stop at Radix.

---

#### 1.11 Create Switch Component

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Toggle switch with accessible states. Layer L2.

**Files:** Create `packages/ui/src/components/Switch.tsx`; update `index.ts`.

**API:** `Switch`. Props: `size` (sm, md, lg), `disabled`, `checked`, `onCheckedChange`, `variant` (default, destructive).

**Checklist:** Import Switch from radix-ui; CVA variants; export; type-check; build.
**Done:** Builds; toggle works; keyboard accessible.
**Anti:** No custom icons; stop at Radix.

---

#### 1.12 Create Slider Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 4h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Range input slider with single/multiple thumbs. Layer L2.

**Files:** Create `packages/ui/src/components/Slider.tsx`; update `index.ts`.

**API:** `Slider`. Props: `min`, `max`, `step`, `value`, `onValueChange`, `disabled`, `orientation` (horizontal, vertical), `multiple` (boolean).

**Checklist:** Import Slider from radix-ui; add multiple thumb support; export; type-check; build.
**Done:** Builds; single/multiple thumbs work; keyboard accessible.
**Anti:** No custom track styling; stop at Radix.

---

#### 1.13 Create Progress Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 2h | **Deps:** None

**Related Research:** §3.1 (React 19), §4.2 (Loading states)

**Objective:** Progress indicator with determinate/indeterminate states. Layer L2.

**Files:** Create `packages/ui/src/components/Progress.tsx`; update `index.ts`.

**API:** `Progress`. Props: `value` (0-100), `indeterminate` (boolean), `variant` (default, success, warning, error), `size` (sm, md, lg), `showLabel` (boolean).

**Checklist:** Create Progress component; add indeterminate state; export; type-check; build.
**Done:** Builds; determinate/indeterminate work; variants render.
**Anti:** No custom animations; CSS-only.

---

#### 1.14 Create Breadcrumb Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), SEO best practices

**Objective:** Navigation breadcrumb trail with separator customization. Layer L2.

**Files:** Create `packages/ui/src/components/Breadcrumb.tsx`; update `index.ts`.

**API:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbPage`. Props: `separator` (string | ReactNode), `maxItems` (number).

**Checklist:** Create Breadcrumb component; add separator customization; export; type-check; build.
**Done:** Builds; navigation works; separators customizable.
**Anti:** No auto-generation from route; manual items only.

---

#### 1.15 Create Command Palette Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), Command palette patterns

**Objective:** Command palette with search, keyboard navigation, and actions. Layer L2.

**Files:** Create `packages/ui/src/components/Command.tsx`; update `index.ts`.

**API:** `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`. Props: `shouldFilter` (boolean), `filter` (function), `loop` (boolean).

**Checklist:** Import Command from cmdk or build custom; add search functionality; keyboard navigation; export; type-check; build.
**Done:** Builds; search works; keyboard nav functional; actions execute.
**Anti:** No fuzzy search; basic string matching only.

---

#### 1.16 Create Context Menu Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 4h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Right-click context menu with nested submenus. Layer L2.

**Files:** Create `packages/ui/src/components/ContextMenu.tsx`; update `index.ts`.

**API:** `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuShortcut`. Full Radix set.

**Checklist:** Import ContextMenu from radix-ui; add nested submenu support; export; type-check; build.
**Done:** Builds; right-click works; nested menus functional; keyboard accessible.
**Anti:** No custom positioning; stop at Radix.

---

#### 1.17 Create Hover Card Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Card that appears on hover with rich content. Layer L2.

**Files:** Create `packages/ui/src/components/HoverCard.tsx`; update `index.ts`.

**API:** `HoverCard`, `HoverCardTrigger`, `HoverCardContent`. Props: `openDelay`, `closeDelay`, `side`, `align`.

**Checklist:** Import HoverCard from radix-ui; add delay configuration; export; type-check; build.
**Done:** Builds; hover works; delays configurable; rich content displays.
**Anti:** No custom animations; stop at Radix.

---

#### 1.18 Create Menubar Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Application menu bar with keyboard navigation. Layer L2.

**Files:** Create `packages/ui/src/components/Menubar.tsx`; update `index.ts`.

**API:** `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarSeparator`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarShortcut`. Full Radix set.

**Checklist:** Import Menubar from radix-ui; add keyboard navigation; export; type-check; build.
**Done:** Builds; menu bar renders; keyboard nav works; submenus functional.
**Anti:** No custom styling variants; stop at Radix.

---

#### 1.19 Create Navigation Menu Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Accessible navigation menu with mega menu support. Layer L2.

**Files:** Create `packages/ui/src/components/NavigationMenu.tsx`; update `index.ts`.

**API:** `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`. Full Radix set.

**Checklist:** Import NavigationMenu from radix-ui; add mega menu support; export; type-check; build.
**Done:** Builds; navigation works; mega menus functional; keyboard accessible.
**Anti:** No custom animations; stop at Radix.

---

#### 1.20 Create Radio Group Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Radio button group with accessible selection. Layer L2.

**Files:** Create `packages/ui/src/components/RadioGroup.tsx`; update `index.ts`.

**API:** `RadioGroup`, `RadioGroupItem`. Props: `value`, `onValueChange`, `disabled`, `orientation` (horizontal, vertical), `variant` (default, card).

**Checklist:** Import RadioGroup from radix-ui; add card variant; export; type-check; build.
**Done:** Builds; selection works; keyboard accessible; card variant renders.
**Anti:** No custom styling beyond variants; stop at Radix.

---

#### 1.21 Create Checkbox Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Checkbox input with indeterminate state. Layer L2.

**Files:** Create `packages/ui/src/components/Checkbox.tsx`; update `index.ts`.

**API:** `Checkbox`. Props: `checked`, `onCheckedChange`, `disabled`, `indeterminate` (boolean), `variant` (default, destructive).

**Checklist:** Import Checkbox from radix-ui; add indeterminate state; export; type-check; build.
**Done:** Builds; checked/unchecked/indeterminate work; keyboard accessible.
**Anti:** No custom icons; stop at Radix.

---

#### 1.22 Create Label Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 1h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Accessible form label with required indicator. Layer L2.

**Files:** Create `packages/ui/src/components/Label.tsx`; update `index.ts`.

**API:** `Label`. Props: `htmlFor`, `required` (boolean), `variant` (default, error).

**Checklist:** Import Label from radix-ui; add required indicator; export; type-check; build.
**Done:** Builds; label association works; required indicator displays.
**Anti:** No custom styling variants; stop at Radix.

---

#### 1.23 Create Form Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** 1.21, 1.22, 1.20

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), React Hook Form

**Objective:** Form wrapper with validation and error handling. Layer L2.

**Files:** Create `packages/ui/src/components/Form.tsx`; update `index.ts`.

**API:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`. Props: Integration with React Hook Form or Zod.

**Checklist:** Create Form component; integrate with React Hook Form; add validation; export; type-check; build.
**Done:** Builds; form validation works; error messages display; accessible.
**Anti:** No custom validation library; React Hook Form or Zod only.

---

#### 1.24 Create Alert Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §3.1 (React 19), WCAG guidelines

**Objective:** Alert message with variants and icons. Layer L2.

**Files:** Create `packages/ui/src/components/Alert.tsx`; update `index.ts`.

**API:** `Alert`, `AlertTitle`, `AlertDescription`. Props: `variant` (default, destructive, warning, success, info), `icon` (ReactNode).

**Checklist:** Create Alert component; CVA variants; add icon support; export; type-check; build.
**Done:** Builds; all variants render; icons display; accessible.
**Anti:** No dismissible variant; static alerts only.

---

#### 1.25 Create Alert Dialog Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 4h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Modal alert dialog with actions. Layer L2.

**Files:** Create `packages/ui/src/components/AlertDialog.tsx`; update `index.ts`.

**API:** `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`. Full Radix set.

**Checklist:** Import AlertDialog from radix-ui; add action buttons; export; type-check; build.
**Done:** Builds; dialog opens; actions work; focus trap functional.
**Anti:** No custom styling variants; stop at Radix.

---

#### 1.26 Create Aspect Ratio Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 2h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Container that maintains aspect ratio. Layer L2.

**Files:** Create `packages/ui/src/components/AspectRatio.tsx`; update `index.ts`.

**API:** `AspectRatio`. Props: `ratio` (number, e.g., 16/9), `children`.

**Checklist:** Import AspectRatio from radix-ui; export; type-check; build.
**Done:** Builds; aspect ratio maintained; responsive.
**Anti:** No custom ratios beyond numeric; stop at Radix.

---

#### 1.27 Create Collapsible Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Collapsible content with smooth animations. Layer L2.

**Files:** Create `packages/ui/src/components/Collapsible.tsx`; update `index.ts`.

**API:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`. Props: `open`, `onOpenChange`, `disabled`.

**Checklist:** Import Collapsible from radix-ui; add animations; export; type-check; build.
**Done:** Builds; collapse/expand works; animations smooth; keyboard accessible.
**Anti:** No custom animations; CSS transitions only.

---

#### 1.28 Create Resizable Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Resizable panels with drag handles. Layer L2.

**Files:** Create `packages/ui/src/components/Resizable.tsx`; update `index.ts`.

**API:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`. Props: `direction` (horizontal, vertical), `defaultSizes`, `minSize`, `maxSize`, `collapsible` (boolean).

**Checklist:** Import Resizable from radix-ui; add panel group support; export; type-check; build.
**Done:** Builds; resizing works; handles functional; keyboard accessible.
**Anti:** No custom handle styling; stop at Radix.

---

#### 1.29 Create Scroll Area Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Custom scrollable area with styled scrollbars. Layer L2.

**Files:** Create `packages/ui/src/components/ScrollArea.tsx`; update `index.ts`.

**API:** `ScrollArea`, `ScrollBar`. Props: `orientation` (horizontal, vertical, both), `type` (auto, always, scroll, hover), `className`.

**Checklist:** Import ScrollArea from radix-ui; add scrollbar styling; export; type-check; build.
**Done:** Builds; scrolling works; custom scrollbars render; cross-browser compatible.
**Anti:** No custom scrollbar animations; stop at Radix.

---

#### 1.30 Create Select Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Enhanced select dropdown with search and multi-select. Layer L2.

**Files:** Create `packages/ui/src/components/Select.tsx`; update `index.ts`.

**API:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`. Props: `searchable` (boolean), `multiple` (boolean), `placeholder`.

**Checklist:** Import Select from radix-ui; add search functionality; add multi-select support; export; type-check; build.
**Done:** Builds; select works; search functional; multi-select works; keyboard accessible.
**Anti:** No virtual scrolling; basic search only.

---

#### 1.31 Create Sheet Component (Sidebar)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 5h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Slide-out panel (sidebar) with multiple positions. Layer L2.

**Files:** Create `packages/ui/src/components/Sheet.tsx`; update `index.ts`.

**API:** `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`. Props: `side` (top, right, bottom, left), `size` (sm, md, lg, xl, full), `modal` (boolean).

**Checklist:** Import Sheet from radix-ui; add all side positions; add size variants; export; type-check; build.
**Done:** Builds; sheet opens from all sides; sizes work; focus trap functional.
**Anti:** No custom animations; stop at Radix.

---

#### 1.32 Create Table Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), Table patterns

**Objective:** Data table with sorting, filtering, and pagination. Layer L2.

**Files:** Create `packages/ui/src/components/Table.tsx`; update `index.ts`.

**API:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. Props: `sortable` (boolean), `filterable` (boolean), `pagination` (boolean).

**Checklist:** Create Table component; add sorting functionality; add filtering; add pagination; export; type-check; build.
**Done:** Builds; table renders; sorting works; filtering works; pagination functional; accessible.
**Anti:** No virtual scrolling; basic table only.

---

#### 1.33 Create Toggle Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 2h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Toggle button with pressed state. Layer L2.

**Files:** Create `packages/ui/src/components/Toggle.tsx`; update `index.ts`.

**API:** `Toggle`. Props: `pressed`, `onPressedChange`, `disabled`, `variant` (default, outline, ghost), `size` (sm, md, lg).

**Checklist:** Import Toggle from radix-ui; CVA variants; export; type-check; build.
**Done:** Builds; toggle works; variants render; keyboard accessible.
**Anti:** No custom icons; stop at Radix.

---

#### 1.34 Create Toggle Group Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 3h | **Deps:** 1.33

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Group of toggle buttons with single/multiple selection. Layer L2.

**Files:** Create `packages/ui/src/components/ToggleGroup.tsx`; update `index.ts`.

**API:** `ToggleGroup`, `ToggleGroupItem`. Props: `type` (single, multiple), `value`, `onValueChange`, `disabled`, `orientation` (horizontal, vertical).

**Checklist:** Import ToggleGroup from radix-ui; add single/multiple modes; export; type-check; build.
**Done:** Builds; toggle group works; single/multiple selection functional; keyboard accessible.
**Anti:** No custom styling variants; stop at Radix.

---

#### 1.35 Create Calendar Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), date-fns or dayjs

**Objective:** Calendar view with date selection. Layer L2.

**Files:** Create `packages/ui/src/components/Calendar.tsx`; update `index.ts`.

**API:** `Calendar`. Props: `mode` (single, multiple, range), `selected`, `onSelect`, `disabled` (date | function), `locale`, `firstDayOfWeek`.

**Checklist:** Import Calendar from radix-ui or build custom; add date selection; add locale support; export; type-check; build.
**Done:** Builds; calendar renders; date selection works; locale support functional.
**Anti:** No custom date formatting; use date-fns or dayjs.

---

#### 1.36 Create Date Picker Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** 1.35, 1.30

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Date picker combining Calendar and Popover. Layer L2.

**Files:** Create `packages/ui/src/components/DatePicker.tsx`; update `index.ts`.

**API:** `DatePicker`, `DatePickerTrigger`, `DatePickerContent`. Props: `mode` (single, multiple, range), `format`, `placeholder`, `disabled`.

**Checklist:** Combine Calendar and Popover; add date formatting; export; type-check; build.
**Done:** Builds; date picker opens; date selection works; formatting functional.
**Anti:** No time selection; date only.

---

#### 1.37 Create Time Picker Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.30

**Related Research:** §3.1 (React 19), time picker patterns

**Objective:** Time picker with hour/minute/second selection. Layer L2.

**Files:** Create `packages/ui/src/components/TimePicker.tsx`; update `index.ts`.

**API:** `TimePicker`. Props: `value`, `onChange`, `format` (12h, 24h), `showSeconds` (boolean), `disabled`.

**Checklist:** Create TimePicker component; add hour/minute/second selection; add 12h/24h format; export; type-check; build.
**Done:** Builds; time selection works; formats switch; keyboard accessible.
**Anti:** No timezone support; local time only.

---

#### 1.38 Create Color Picker Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), color picker patterns

**Objective:** Color picker with multiple input methods. Layer L2.

**Files:** Create `packages/ui/src/components/ColorPicker.tsx`; update `index.ts`.

**API:** `ColorPicker`. Props: `value`, `onChange`, `format` (hex, rgb, hsl), `presets` (array), `alpha` (boolean).

**Checklist:** Create ColorPicker component; add hex/rgb/hsl formats; add presets; add alpha channel; export; type-check; build.
**Done:** Builds; color selection works; formats switch; presets functional; alpha channel works.
**Anti:** No custom color spaces; standard formats only.

---

#### 1.39 Create File Upload Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), file upload patterns

**Objective:** File upload with drag-and-drop and preview. Layer L2.

**Files:** Create `packages/ui/src/components/FileUpload.tsx`; update `index.ts`.

**API:** `FileUpload`, `FileUploadTrigger`, `FileUploadList`, `FileUploadItem`. Props: `accept`, `multiple` (boolean), `maxSize`, `maxFiles`, `onUpload`, `preview` (boolean).

**Checklist:** Create FileUpload component; add drag-and-drop; add file preview; add progress indicator; export; type-check; build.
**Done:** Builds; file selection works; drag-and-drop functional; preview displays; progress shows.
**Anti:** No actual upload implementation; file handling only.

---

#### 1.40 Create Rating Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 4h | **Deps:** None

**Related Research:** §3.1 (React 19), rating patterns

**Objective:** Star rating with read-only and interactive modes. Layer L2.

**Files:** Create `packages/ui/src/components/Rating.tsx`; update `index.ts`.

**API:** `Rating`. Props: `value`, `onChange`, `max` (number, default 5), `readOnly` (boolean), `size` (sm, md, lg), `allowHalf` (boolean), `showValue` (boolean).

**Checklist:** Create Rating component; add interactive mode; add half-star support; add read-only mode; export; type-check; build.
**Done:** Builds; rating displays; interactive selection works; half-stars functional; keyboard accessible.
**Anti:** No custom icons; stars only.

---

#### 1.41 Create Pagination Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 5h | **Deps:** None

**Related Research:** §3.1 (React 19), pagination patterns

**Objective:** Pagination controls with page navigation. Layer L2.

**Files:** Create `packages/ui/src/components/Pagination.tsx`; update `index.ts`.

**API:** `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`. Props: `currentPage`, `totalPages`, `onPageChange`, `showFirstLast` (boolean), `showPageNumbers` (boolean).

**Checklist:** Create Pagination component; add page navigation; add ellipsis for many pages; export; type-check; build.
**Done:** Builds; pagination renders; page navigation works; ellipsis displays; keyboard accessible.
**Anti:** No custom page size selector; page navigation only.

---

#### 1.42 Create Stepper Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §3.1 (React 19), stepper patterns

**Objective:** Multi-step progress indicator with navigation. Layer L2.

**Files:** Create `packages/ui/src/components/Stepper.tsx`; update `index.ts`.

**API:** `Stepper`, `StepperStep`, `StepperContent`, `StepperTrigger`. Props: `currentStep`, `orientation` (horizontal, vertical), `clickable` (boolean), `variant` (default, numbered, dots).

**Checklist:** Create Stepper component; add step navigation; add variants; export; type-check; build.
**Done:** Builds; stepper renders; step navigation works; variants display; keyboard accessible.
**Anti:** No custom step validation; visual indicator only.

---

#### 1.43 Create Timeline Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 5h | **Deps:** None

**Related Research:** §3.1 (React 19), timeline patterns

**Objective:** Timeline display with events and milestones. Layer L2.

**Files:** Create `packages/ui/src/components/Timeline.tsx`; update `index.ts`.

**API:** `Timeline`, `TimelineItem`, `TimelineHeader`, `TimelineContent`, `TimelineConnector`. Props: `orientation` (horizontal, vertical), `variant` (default, alternate), `showConnector` (boolean).

**Checklist:** Create Timeline component; add item rendering; add connector lines; add variants; export; type-check; build.
**Done:** Builds; timeline renders; items display; connectors show; variants work.
**Anti:** No custom date formatting; basic timeline only.

---

#### 1.44 Create Tree View Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Hierarchical tree view with expand/collapse. Layer L2.

**Files:** Create `packages/ui/src/components/TreeView.tsx`; update `index.ts`.

**API:** `Tree`, `TreeItem`, `TreeItemIndicator`, `TreeItemTrigger`, `TreeItemContent`. Props: `data` (array), `defaultExpanded` (array), `onSelect`, `selectable` (boolean), `multiSelect` (boolean).

**Checklist:** Import Tree from radix-ui or build custom; add expand/collapse; add selection; export; type-check; build.
**Done:** Builds; tree renders; expand/collapse works; selection functional; keyboard accessible.
**Anti:** No virtual scrolling; basic tree only.

---

#### 1.45 Create Carousel Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 10h | **Deps:** None

**Related Research:** §3.1 (React 19), carousel patterns, embla-carousel

**Objective:** Carousel with navigation, autoplay, and indicators. Layer L2.

**Files:** Create `packages/ui/src/components/Carousel.tsx`; update `index.ts`.

**API:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselIndicator`. Props: `autoplay` (boolean), `interval` (number), `loop` (boolean), `orientation` (horizontal, vertical), `showIndicators` (boolean).

**Checklist:** Create Carousel component (use embla-carousel); add navigation; add autoplay; add indicators; export; type-check; build.
**Done:** Builds; carousel renders; navigation works; autoplay functional; indicators display; keyboard accessible.
**Anti:** No infinite scroll; finite carousel only.

---

#### 1.46 Create Masonry Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), masonry layouts, CSS Grid

**Objective:** Masonry layout for variable-height items. Layer L2.

**Files:** Create `packages/ui/src/components/Masonry.tsx`; update `index.ts`.

**API:** `Masonry`, `MasonryItem`. Props: `columns` (number | responsive object), `gap`, `items` (array), `renderItem` (function).

**Checklist:** Create Masonry component; add column layout; add responsive columns; export; type-check; build.
**Done:** Builds; masonry renders; columns work; responsive layout functional.
**Anti:** No virtual scrolling; all items rendered.

---

#### 1.47 Create Virtual List Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 10h | **Deps:** None

**Related Research:** §3.1 (React 19), react-window or react-virtual

**Objective:** Virtualized list for large datasets. Layer L2.

**Files:** Create `packages/ui/src/components/VirtualList.tsx`; update `index.ts`.

**API:** `VirtualList`. Props: `items` (array), `itemHeight` (number | function), `overscan` (number), `orientation` (horizontal, vertical), `renderItem` (function).

**Checklist:** Create VirtualList component (use react-window or react-virtual); add virtualization; add dynamic heights; export; type-check; build.
**Done:** Builds; virtual list renders; scrolling smooth; large datasets performant.
**Anti:** No custom virtualization algorithm; use existing library.

---

#### 1.48 Create Infinite Scroll Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.47

**Related Research:** §3.1 (React 19), infinite scroll patterns

**Objective:** Infinite scroll with loading states. Layer L2.

**Files:** Create `packages/ui/src/components/InfiniteScroll.tsx`; update `index.ts`.

**API:** `InfiniteScroll`. Props: `hasMore` (boolean), `onLoadMore`, `loader` (ReactNode), `threshold` (number), `reverse` (boolean).

**Checklist:** Create InfiniteScroll component; add intersection observer; add loading state; export; type-check; build.
**Done:** Builds; infinite scroll works; loading triggers; loading state displays.
**Anti:** No custom loading logic; intersection observer only.

---

#### 1.49 Create Drag and Drop Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 12h | **Deps:** None

**Related Research:** §3.1 (React 19), @dnd-kit or react-beautiful-dnd

**Objective:** Drag and drop with sortable lists and reordering. Layer L2.

**Files:** Create `packages/ui/src/components/DragAndDrop.tsx`; update `index.ts`.

**API:** `DragAndDrop`, `Draggable`, `Droppable`, `DragHandle`. Props: `items` (array), `onReorder`, `disabled` (boolean), `axis` (x, y, both).

**Checklist:** Create DragAndDrop component (use @dnd-kit); add drag handles; add drop zones; add reordering; export; type-check; build.
**Done:** Builds; drag and drop works; reordering functional; keyboard accessible; touch support.
**Anti:** No custom drag preview; default preview only.

---

#### 1.50 Create Resizable Panel Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** 1.28

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Resizable panel system with multiple panels. Layer L2.

**Files:** Create `packages/ui/src/components/ResizablePanel.tsx`; update `index.ts`.

**API:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`. Props: `direction` (horizontal, vertical), `defaultSizes`, `minSize`, `maxSize`, `collapsible` (boolean), `onResize`.

**Checklist:** Enhance Resizable component; add panel group; add resize callbacks; export; type-check; build.
**Done:** Builds; resizable panels work; group functional; resize callbacks fire; keyboard accessible.
**Anti:** No custom handle styling; stop at Radix.

---

### Marketing Components (1.7, 2.1–2.10)

#### 1.7 Create @repo/marketing-components Package Scaffold

**Status:** [x] COMPLETED | **Assigned To:** [Claude] | **Completed:** [2026-02-18]

**Related Research:** §1.3 (Monorepo structure), §2.1 (Atomic design)

**Objective:** No target package for 2.1–2.10. Create package scaffold, no runtime logic.

**Files:** Create `packages/marketing-components/package.json`, `tsconfig.json`, `src/index.ts` (barrel with `export {}`).

**Checklist:** package.json (deps: @repo/ui, @repo/utils, @repo/types); tsconfig; src/index.ts; pnpm install; build.
**Done:** Package exists; builds; 2.1 can add hero.
**Anti:** No components; no Storybook; scaffold only.

---

#### 2.1 Build HeroVariants Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel)

**Related Research:** §2.1 (Atomic design, LCP), §4.2 (Core Web Vitals), §2.2 (Component patterns)

**Objective:** 20+ Hero variants with advanced composition system. Shared HeroProps with extensive customization. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, Video, Carousel, Image Background, Gradient Background, Animated Background, Minimal, Bold, Overlay, Split Image Left, Split Image Right, Split Content Left, Split Content Right, Fullscreen, Contained, With Stats, With Testimonials, With Features, With Form (20+ total)
- **Composition System:** Slots for header, content, footer, background, overlay, CTA area
- **Layout Options:** Full-width, contained, edge-to-edge, with sidebar
- **Content Variants:** Single CTA, dual CTA, no CTA, CTA with form, CTA with video
- **Image Options:** Single image, image gallery, parallax, lazy loading, responsive images
- **Video Options:** Background video, embedded video, YouTube/Vimeo integration, autoplay controls
- **Animation Options:** Fade in, slide up, zoom, parallax scroll, typewriter effect
- **Responsive Breakpoints:** Mobile-first, tablet, desktop, large desktop variants

**Files:** `packages/marketing-components/src/hero/types.ts`, `HeroCentered.tsx`, `HeroSplit.tsx`, `HeroVideo.tsx`, `HeroCarousel.tsx`, `HeroImageBackground.tsx`, `HeroGradient.tsx`, `HeroAnimated.tsx`, `HeroMinimal.tsx`, `HeroBold.tsx`, `HeroOverlay.tsx`, `HeroWithStats.tsx`, `HeroWithTestimonials.tsx`, `HeroWithFeatures.tsx`, `HeroWithForm.tsx`, `hero/composition.tsx`, `hero/hooks.ts`, `index.ts`

**API:** Discriminated unions `HeroProps`. Base: title, subtitle, primaryCta, secondaryCta, description, background, overlay. Variant-specific: image, video, carouselItems, stats, testimonials, features, form. Composition: `HeroHeader`, `HeroContent`, `HeroFooter`, `HeroBackground`, `HeroOverlay`, `HeroCTA`.

**Checklist:**

- 2.1a: Create types and composition system (4h)
- 2.1b: Build core variants (Centered, Split, Video, Carousel) (6h)
- 2.1c: Build background variants (Image, Gradient, Animated) (4h)
- 2.1d: Build content-enhanced variants (With Stats, With Testimonials, With Features, With Form) (6h)
- 2.1e: Add animations and responsive breakpoints (4h)
- next/image; lazy video; barrel; export.

**Done:** All 20+ variants render; composition system functional; LCP optimized; animations smooth; responsive breakpoints work.
**Anti:** No CMS adapter; variants defined in code only.

---

#### 2.2 Build ServiceShowcase Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.3, 1.24, 1.25

**Related Research:** §2.1, §4.2, §2.2. Uses Tabs, Accordion, Alert, AlertDialog from @repo/ui.

**Objective:** 20+ Service layout variants with filtering, sorting, and advanced composition. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Tabs, Accordion, Masonry, Card Grid, Featured + Grid, Carousel, Sidebar + Content, Comparison Table, Timeline, Stepper, Filterable Grid, Searchable List, Category Tabs, Tagged Grid, Featured Service, Service Showcase, Service Directory, Service Map (20+ total)
- **Filtering:** By category, tag, price range, rating, featured status
- **Sorting:** By name, price, rating, date added, popularity
- **Composition:** Service cards with image, title, description, price, CTA, tags, rating, badges
- **Responsive:** Mobile-first, breakpoint-specific layouts
- **Interactive:** Hover effects, expandable details, quick view modal

**Files:** `packages/marketing-components/src/services/types.ts`, `ServiceGrid.tsx`, `ServiceList.tsx`, `ServiceTabs.tsx`, `ServiceAccordion.tsx`, `ServiceMasonry.tsx`, `ServiceCarousel.tsx`, `ServiceComparison.tsx`, `ServiceTimeline.tsx`, `ServiceFilterable.tsx`, `ServiceSearchable.tsx`, `services/filters.tsx`, `services/sorting.tsx`, `services/composition.tsx`, `index.ts`

**API:** `ServiceShowcase`, `ServiceCard`, `ServiceFilter`, `ServiceSort`. Props: `layout`, `services` (array), `filters`, `sortBy`, `onServiceClick`, `showPrice`, `showRating`, `showTags`.

**Checklist:**

- 2.2a: Create types and composition system (4h)
- 2.2b: Build core layouts (Grid, List, Tabs, Accordion) (6h)
- 2.2c: Build advanced layouts (Masonry, Carousel, Comparison, Timeline) (6h)
- 2.2d: Add filtering and sorting functionality (4h)
- 2.2e: Add responsive breakpoints and interactions (4h)
- Types; Grid; List; Tabs (uses 1.3); Accordion; barrel.

**Done:** All 20+ layouts render; filtering works; sorting functional; RSC where static; responsive breakpoints work.
**Anti:** No CMS wiring; data from props only.

---

#### 2.3 Build TeamDisplay Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.8 (Avatar)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 15+ Team layout variants with role filtering and social integration. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Card Grid, Featured + Grid, Carousel, Sidebar + Grid, Masonry, Timeline, Accordion, Filterable Grid, Role-based Grid, Department Tabs, Social-focused, Minimal Cards, Detailed Cards (15+ total)
- **Role Filtering:** Filter by role, department, team
- **Social Integration:** Social media links, LinkedIn, Twitter, GitHub integration
- **Composition:** Team member cards with avatar, name, role, bio, social links, contact info
- **Interactive:** Hover effects, expandable bios, modal details

**Files:** `packages/marketing-components/src/team/types.ts`, `TeamGrid.tsx`, `TeamList.tsx`, `TeamCarousel.tsx`, `TeamMasonry.tsx`, `TeamFilterable.tsx`, `TeamRoleBased.tsx`, `team/filters.tsx`, `team/social.tsx`, `index.ts`

**API:** `TeamDisplay`, `TeamMemberCard`. Props: `layout`, `members` (array), `filterByRole`, `showSocial`, `showBio`, `showContact`.

**Checklist:** Types; layouts; role filtering; social integration; export.
**Done:** All 15+ layouts render; role filtering works; social links functional; RSC where static.
**Anti:** No CMS wiring; data from props only.

---

#### 2.4 Build Testimonial Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel), 1.40 (Rating)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 20+ Testimonial variants with multi-source integration. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col), Carousel, Slider, List, Featured + Grid, Card Grid, Quote Cards, Minimal, Bold, With Images, With Videos, Filterable, Searchable, Star Ratings, Review Cards, Trust Badges, Social Proof, Testimonial Wall, Rotating Quotes, Side-by-Side (20+ total)
- **Multi-Source Integration:** Google Reviews, Yelp, Trustpilot, custom config, API adapters
- **Composition:** Testimonial cards with quote, author, role, company, image, rating, date, source badge
- **Filtering:** By rating, source, date, featured
- **Animations:** Fade, slide, rotate, typewriter

**Files:** `packages/marketing-components/src/testimonials/types.ts`, `TestimonialGrid.tsx`, `TestimonialCarousel.tsx`, `TestimonialSlider.tsx`, `TestimonialList.tsx`, `TestimonialCard.tsx`, `TestimonialFilterable.tsx`, `testimonials/sources.tsx`, `testimonials/filters.tsx`, `index.ts`

**API:** `TestimonialDisplay`, `TestimonialCard`. Props: `variant`, `testimonials` (array), `source`, `filterByRating`, `showRating`, `showImage`, `showSource`.

**Checklist:** Types; variants; multi-source adapters; filtering; export.
**Done:** All 20+ variants render; multi-source integration works; filtering functional; animations smooth.
**Anti:** No live API keys; mock data for external sources.

---

#### 2.5 Build Pricing Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.2 (Button), 1.24 (Alert)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 15+ Pricing variants with advanced customization and comparison. L2.

**Enhanced Requirements:**

- **Variants:** Three Column, Four Column, Two Column, Single Featured, Comparison Table, Tabs, Accordion, Toggle (Monthly/Yearly), With Features, Minimal, Bold, Card Grid, Side-by-Side, With Calculator, Customizable (15+ total)
- **Customization:** Feature lists, CTA buttons, badges (Popular, Best Value), tooltips, icons
- **Comparison:** Side-by-side comparison, feature comparison table, highlight differences
- **Interactive:** Toggle between pricing periods, expandable features, hover effects

**Files:** `packages/marketing-components/src/pricing/types.ts`, `PricingThreeColumn.tsx`, `PricingFourColumn.tsx`, `PricingComparison.tsx`, `PricingTabs.tsx`, `PricingToggle.tsx`, `PricingWithFeatures.tsx`, `PricingCard.tsx`, `pricing/comparison.tsx`, `pricing/customization.tsx`, `index.ts`

**API:** `PricingDisplay`, `PricingCard`, `PricingComparison`. Props: `variant`, `plans` (array), `showComparison`, `togglePeriod`, `currency`, `highlightedPlan`.

**Checklist:** Types; variants; comparison system; customization; export.
**Done:** All 15+ variants render; comparison works; customization functional; toggle period works.
**Anti:** No payment integration; display only.

---

#### 2.6 Build Gallery Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel), 1.46 (Masonry)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 20+ Gallery variants with advanced filtering and organization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), Masonry, Carousel, Slider, Lightbox, Filterable Grid, Tagged Grid, Category Tabs, Timeline, Before/After, Portfolio Grid, Featured + Grid, With Captions, Minimal, Bold, Sidebar + Grid, Searchable, Infinite Scroll, With Filters, Custom Layout (20+ total)
- **Filtering:** By category, tag, date, featured status
- **Organization:** Categories, tags, albums, collections
- **Interactive:** Lightbox, zoom, fullscreen, slideshow, share

**Files:** `packages/marketing-components/src/gallery/types.ts`, `GalleryGrid.tsx`, `GalleryMasonry.tsx`, `GalleryCarousel.tsx`, `GalleryLightbox.tsx`, `GalleryFilterable.tsx`, `GalleryTagged.tsx`, `gallery/filters.tsx`, `gallery/lightbox.tsx`, `index.ts`

**API:** `GalleryDisplay`, `GalleryItem`. Props: `variant`, `items` (array), `filterByCategory`, `filterByTag`, `showLightbox`, `showCaptions`, `columns`.

**Checklist:** Types; variants; filtering; lightbox; export.
**Done:** All 20+ variants render; filtering works; lightbox functional; responsive breakpoints work.
**Anti:** No image optimization; use next/image.

---

#### 2.7 Build Stats Counter Component (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6 Stats Counter variants with animation customization. L2.

**Enhanced Requirements:**

- **Variants:** Grid (2-col, 3-col, 4-col), List, Carousel, With Icons (6 total)
- **Animation:** Count-up animation, duration control, easing functions
- **Composition:** Stat cards with number, label, icon, description, trend indicator

**Files:** `packages/marketing-components/src/stats/types.ts`, `StatsGrid.tsx`, `StatsList.tsx`, `StatsCarousel.tsx`, `StatsCard.tsx`, `stats/animations.tsx`, `index.ts`

**API:** `StatsCounter`, `StatCard`. Props: `variant`, `stats` (array), `animate`, `duration`, `showIcons`, `showTrend`.

**Checklist:** Types; variants; animations; export.
**Done:** All 6 variants render; count-up animations work; responsive breakpoints work.
**Anti:** No custom easing functions; CSS animations only.

---

#### 2.8 Build CTA Section Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ CTA Section variants with A/B testing support. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, With Image, With Video, With Form, Minimal, Bold, With Stats, With Testimonials, Sidebar (10+ total)
- **A/B Testing:** Variant selection, conversion tracking, analytics integration
- **Composition:** CTA sections with headline, description, primary CTA, secondary CTA, image/video, form

**Files:** `packages/marketing-components/src/cta/types.ts`, `CTACentered.tsx`, `CTASplit.tsx`, `CTAWithImage.tsx`, `CTAWithVideo.tsx`, `CTAWithForm.tsx`, `cta/ab-testing.tsx`, `index.ts`

**API:** `CTASection`. Props: `variant`, `headline`, `description`, `primaryCta`, `secondaryCta`, `image`, `video`, `form`, `abTestVariant`.

**Checklist:** Types; variants; A/B testing integration; export.
**Done:** All 10+ variants render; A/B testing functional; conversion tracking works.
**Anti:** No analytics provider integration; basic tracking only.

---

#### 2.9 Build FAQ Section Component (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.27 (Accordion)

**Related Research:** §2.1, §4.2, §2.2, SEO best practices

**Objective:** 6 FAQ Section variants with search functionality. L2.

**Enhanced Requirements:**

- **Variants:** Accordion, List, Tabs, Searchable, With Categories, Minimal (6 total)
- **Search:** Full-text search, highlight matches, filter by category
- **Composition:** FAQ items with question, answer, category, tags

**Files:** `packages/marketing-components/src/faq/types.ts`, `FAQAccordion.tsx`, `FAQList.tsx`, `FAQTabs.tsx`, `FAQSearchable.tsx`, `FAQWithCategories.tsx`, `faq/search.tsx`, `index.ts`

**API:** `FAQSection`, `FAQItem`. Props: `variant`, `items` (array), `searchable`, `filterByCategory`, `showCategories`.

**Checklist:** Types; variants; search functionality; export.
**Done:** All 6 variants render; search works; filtering functional; SEO-friendly.
**Anti:** No fuzzy search; basic string matching only.

---

#### 2.10 Build Contact Form Variants (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.23 (Form), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2, form validation patterns

**Objective:** 10+ Contact Form variants with validation and integration. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Map, With Office Info, Multi-Step, With File Upload, With Calendar, With Chat, Sidebar, Full Page (10+ total)
- **Validation:** Client-side validation, error messages, success states
- **Integration:** Email service, CRM integration, webhook support

**Files:** `packages/marketing-components/src/contact/types.ts`, `ContactFormStandard.tsx`, `ContactFormMinimal.tsx`, `ContactFormWithMap.tsx`, `ContactFormMultiStep.tsx`, `ContactFormWithUpload.tsx`, `contact/validation.tsx`, `contact/integration.tsx`, `index.ts`

**API:** `ContactForm`. Props: `variant`, `fields` (array), `onSubmit`, `showMap`, `showOfficeInfo`, `integrations`.

**Checklist:** Types; variants; validation; integration; export.
**Done:** All 10+ variants render; validation works; integrations functional; accessible.
**Anti:** No custom field types; standard inputs only.

---

### Marketing Components (New Families 2.11–2.35)

#### 2.11 Build Navigation Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.19 (Navigation Menu)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 15+ Navigation variants with multi-level and mega menu support. L2.

**Requirements:**

- **Variants:** Horizontal, Vertical, Sidebar, Sticky, Transparent, With Logo, With Search, Mega Menu, Dropdown, Mobile Drawer, Breadcrumb Nav, Footer Nav, Tab Nav, Accordion Nav, Minimal (15+ total)
- **Multi-Level:** Nested navigation, submenus, mega menus
- **Features:** Search integration, mobile responsive, keyboard navigation

**Files:** `packages/marketing-components/src/navigation/types.ts`, `NavigationHorizontal.tsx`, `NavigationVertical.tsx`, `NavigationMegaMenu.tsx`, `NavigationMobile.tsx`, `navigation/mega-menu.tsx`, `index.ts`

**API:** `Navigation`, `NavItem`, `NavLink`. Props: `variant`, `items` (array), `showSearch`, `sticky`, `mobileBreakpoint`.

**Checklist:** Types; variants; mega menu; mobile responsive; export.
**Done:** All 15+ variants render; mega menus work; mobile responsive; keyboard accessible.
**Anti:** No custom animations; CSS transitions only.

---

#### 2.12 Build Footer Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Footer variants with newsletter and social-focused layouts. L2.

**Requirements:**

- **Variants:** Standard, Minimal, With Newsletter, Social-Focused, Multi-Column, With Map, With Contact, With Links, With Logo, Sticky (10+ total)
- **Newsletter Integration:** Email signup, validation, integration
- **Social Integration:** Social media links, icons, follow buttons

**Files:** `packages/marketing-components/src/footer/types.ts`, `FooterStandard.tsx`, `FooterMinimal.tsx`, `FooterWithNewsletter.tsx`, `FooterSocial.tsx`, `footer/newsletter.tsx`, `index.ts`

**API:** `Footer`. Props: `variant`, `links` (array), `showNewsletter`, `showSocial`, `showMap`, `showContact`.

**Checklist:** Types; variants; newsletter integration; social integration; export.
**Done:** All 10+ variants render; newsletter works; social links functional.
**Anti:** No custom styling; standard layouts only.

---

#### 2.13 Build Blog Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.41 (Pagination)

**Related Research:** §2.1, §4.2, §2.2, SEO best practices

**Objective:** 15+ Blog variants with pagination, filtering, and related posts. L2.

**Requirements:**

- **Variants:** Grid, List, Featured + Grid, Card Grid, Masonry, With Sidebar, Minimal, Magazine, Timeline, Category Tabs, Tagged, Searchable, With Author, With Date, Infinite Scroll (15+ total)
- **Pagination:** Page-based, infinite scroll, load more
- **Filtering:** By category, tag, author, date
- **Related Posts:** Algorithm-based, manual selection

**Files:** `packages/marketing-components/src/blog/types.ts`, `BlogGrid.tsx`, `BlogList.tsx`, `BlogMasonry.tsx`, `BlogWithSidebar.tsx`, `BlogPostCard.tsx`, `blog/pagination.tsx`, `blog/filters.tsx`, `blog/related.tsx`, `index.ts`

**API:** `BlogDisplay`, `BlogPostCard`. Props: `variant`, `posts` (array), `pagination`, `filterByCategory`, `showRelated`, `showAuthor`.

**Checklist:** Types; variants; pagination; filtering; related posts; export.
**Done:** All 15+ variants render; pagination works; filtering functional; related posts display.
**Anti:** No CMS integration; data from props only.

---

#### 2.14 Build Product Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel), 1.40 (Rating)

**Related Research:** §2.1, §4.2, §2.2, e-commerce patterns

**Objective:** 15+ Product variants with e-commerce features. L2.

**Requirements:**

- **Variants:** Grid, List, Featured Product, Product Card, Product Detail, With Gallery, With Reviews, Comparison, Related Products, Upsell, Cross-sell, Category Grid, Searchable, Filterable, With Wishlist (15+ total)
- **E-commerce Features:** Add to cart, wishlist, quick view, product comparison, reviews integration

**Files:** `packages/marketing-components/src/product/types.ts`, `ProductGrid.tsx`, `ProductCard.tsx`, `ProductDetail.tsx`, `ProductComparison.tsx`, `product/cart.tsx`, `product/wishlist.tsx`, `product/reviews.tsx`, `index.ts`

**API:** `ProductDisplay`, `ProductCard`, `ProductDetail`. Props: `variant`, `products` (array), `showCart`, `showWishlist`, `showReviews`, `onAddToCart`.

**Checklist:** Types; variants; e-commerce features; export.
**Done:** All 15+ variants render; cart integration works; wishlist functional; reviews display.
**Anti:** No payment processing; display and cart actions only.

---

#### 2.15 Build Event Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.35 (Calendar), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Event variants with calendar and registration. L2.

**Requirements:**

- **Variants:** Grid, List, Calendar View, Timeline, Featured Event, Event Card, With Registration, With Map, Upcoming Events, Past Events (10+ total)
- **Calendar Integration:** Calendar view, date filtering, recurring events
- **Registration:** Registration form, ticket selection, confirmation

**Files:** `packages/marketing-components/src/event/types.ts`, `EventGrid.tsx`, `EventCalendar.tsx`, `EventTimeline.tsx`, `EventCard.tsx`, `EventRegistration.tsx`, `event/calendar.tsx`, `event/registration.tsx`, `index.ts`

**API:** `EventDisplay`, `EventCard`, `EventCalendar`. Props: `variant`, `events` (array), `showCalendar`, `showRegistration`, `filterByDate`.

**Checklist:** Types; variants; calendar integration; registration; export.
**Done:** All 10+ variants render; calendar works; registration functional.
**Anti:** No payment processing; registration form only.

---

#### 2.16 Build Location Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 4.5 (Maps Integration)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Location variants with maps integration. L2.

**Requirements:**

- **Variants:** With Map, List, Grid, Single Location, Multiple Locations, With Directions, With Contact, With Hours, With Reviews, Minimal (10+ total)
- **Maps Integration:** Google Maps, Mapbox, interactive maps, markers, directions

**Files:** `packages/marketing-components/src/location/types.ts`, `LocationWithMap.tsx`, `LocationList.tsx`, `LocationGrid.tsx`, `LocationCard.tsx`, `location/maps.tsx`, `index.ts`

**API:** `LocationDisplay`, `LocationCard`. Props: `variant`, `locations` (array), `showMap`, `showDirections`, `mapProvider`.

**Checklist:** Types; variants; maps integration; export.
**Done:** All 10+ variants render; maps display; directions work.
**Anti:** No custom map styling; standard providers only.

---

#### 2.17 Build Menu Components (Restaurant)

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.3 (Tabs)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Menu variants with dietary information. L2.

**Requirements:**

- **Variants:** Grid, List, Tabs, Accordion, With Images, With Prices, With Descriptions, Category Tabs, Filterable, With Dietary Info (10+ total)
- **Dietary Information:** Vegetarian, vegan, gluten-free, allergen labels
- **Filtering:** By category, dietary restrictions, price range

**Files:** `packages/marketing-components/src/menu/types.ts`, `MenuGrid.tsx`, `MenuTabs.tsx`, `MenuAccordion.tsx`, `MenuItemCard.tsx`, `menu/dietary.tsx`, `menu/filters.tsx`, `index.ts`

**API:** `MenuDisplay`, `MenuItemCard`. Props: `variant`, `items` (array), `showDietaryInfo`, `filterByCategory`, `filterByDietary`.

**Checklist:** Types; variants; dietary info; filtering; export.
**Done:** All 10+ variants render; dietary info displays; filtering works.
**Anti:** No custom dietary labels; standard options only.

---

#### 2.18 Build Portfolio Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.46 (Masonry), 2.6 (Gallery)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 12+ Portfolio variants with filtering and lightbox. L2.

**Requirements:**

- **Variants:** Grid, Masonry, Carousel, Filterable Grid, Tagged Grid, Category Tabs, With Details, Minimal, Bold, With Case Studies, With Testimonials, With Stats (12+ total)
- **Filtering:** By category, tag, project type, client
- **Lightbox:** Image lightbox, project details modal

**Files:** `packages/marketing-components/src/portfolio/types.ts`, `PortfolioGrid.tsx`, `PortfolioMasonry.tsx`, `PortfolioFilterable.tsx`, `PortfolioCard.tsx`, `portfolio/filters.tsx`, `portfolio/lightbox.tsx`, `index.ts`

**API:** `PortfolioDisplay`, `PortfolioCard`. Props: `variant`, `items` (array), `filterByCategory`, `showLightbox`, `showDetails`.

**Checklist:** Types; variants; filtering; lightbox; export.
**Done:** All 12+ variants render; filtering works; lightbox functional.
**Anti:** No custom project templates; standard cards only.

---

#### 2.19 Build Case Study Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 2.18 (Portfolio)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Case Study variants with metrics and downloads. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, Detail Page, With Metrics, With Testimonials, With Timeline, With Downloads, Minimal, With Images (10+ total)
- **Metrics:** Key metrics display, charts, statistics
- **Downloads:** PDF downloads, resource links

**Files:** `packages/marketing-components/src/case-study/types.ts`, `CaseStudyGrid.tsx`, `CaseStudyDetail.tsx`, `CaseStudyCard.tsx`, `case-study/metrics.tsx`, `case-study/downloads.tsx`, `index.ts`

**API:** `CaseStudyDisplay`, `CaseStudyCard`, `CaseStudyDetail`. Props: `variant`, `caseStudies` (array), `showMetrics`, `showDownloads`, `showTimeline`.

**Checklist:** Types; variants; metrics display; downloads; export.
**Done:** All 10+ variants render; metrics display; downloads work.
**Anti:** No custom chart library; basic metrics only.

---

#### 2.20 Build Job Listing Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.2 (Button), 1.23 (Form)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Job Listing variants with search and application. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, With Filters, Searchable, Category Tabs, With Application Form, Minimal, Detailed, With Company Info (10+ total)
- **Search:** Full-text search, filter by location, department, type
- **Application:** Application form, file upload, integration

**Files:** `packages/marketing-components/src/job-listing/types.ts`, `JobListingGrid.tsx`, `JobListingList.tsx`, `JobListingCard.tsx`, `JobApplication.tsx`, `job-listing/search.tsx`, `job-listing/filters.tsx`, `index.ts`

**API:** `JobListingDisplay`, `JobListingCard`, `JobApplication`. Props: `variant`, `jobs` (array), `searchable`, `filterByLocation`, `showApplication`.

**Checklist:** Types; variants; search; filters; application form; export.
**Done:** All 10+ variants render; search works; filters functional; application form works.
**Anti:** No ATS integration; basic form only.

---

#### 2.21 Build Course Components (Education)

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.2 (Button), 1.40 (Rating)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Course variants with enrollment and progress. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, With Enrollment, With Progress, Category Tabs, With Reviews, With Curriculum, Minimal, Detailed (10+ total)
- **Enrollment:** Enrollment form, payment integration, confirmation
- **Progress:** Progress tracking, completion status, certificates

**Files:** `packages/marketing-components/src/course/types.ts`, `CourseGrid.tsx`, `CourseCard.tsx`, `CourseDetail.tsx`, `CourseEnrollment.tsx`, `course/progress.tsx`, `course/enrollment.tsx`, `index.ts`

**API:** `CourseDisplay`, `CourseCard`, `CourseEnrollment`. Props: `variant`, `courses` (array), `showEnrollment`, `showProgress`, `showReviews`.

**Checklist:** Types; variants; enrollment; progress tracking; export.
**Done:** All 10+ variants render; enrollment works; progress displays.
**Anti:** No LMS integration; basic tracking only.

---

#### 2.22 Build Resource Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.39 (File Upload)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Resource variants with download tracking. L2.

**Requirements:**

- **Variants:** Grid, List, With Downloads, Category Tabs, Searchable, With Previews, Minimal, Featured (8+ total)
- **Download Tracking:** Download counts, analytics, file types

**Files:** `packages/marketing-components/src/resource/types.ts`, `ResourceGrid.tsx`, `ResourceList.tsx`, `ResourceCard.tsx`, `resource/downloads.tsx`, `index.ts`

**API:** `ResourceDisplay`, `ResourceCard`. Props: `variant`, `resources` (array), `showDownloads`, `trackDownloads`, `filterByType`.

**Checklist:** Types; variants; download tracking; export.
**Done:** All 8+ variants render; downloads work; tracking functional.
**Anti:** No custom analytics; basic tracking only.

---

#### 2.23 Build Comparison Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.32 (Table)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6+ Comparison variants for features and pricing. L2.

**Requirements:**

- **Variants:** Table, Side-by-Side, Feature Comparison, Price Comparison, With Highlights, Minimal (6+ total)
- **Features:** Highlight differences, feature checkmarks, tooltips

**Files:** `packages/marketing-components/src/comparison/types.ts`, `ComparisonTable.tsx`, `ComparisonSideBySide.tsx`, `ComparisonFeature.tsx`, `comparison/highlights.tsx`, `index.ts`

**API:** `ComparisonDisplay`. Props: `variant`, `items` (array), `highlightDifferences`, `showTooltips`.

**Checklist:** Types; variants; highlight system; export.
**Done:** All 6+ variants render; highlights work; tooltips display.
**Anti:** No custom comparison logic; manual configuration only.

---

#### 2.24 Build Filter Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.11 (Switch), 1.21 (Checkbox)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Filter variants with presets and history. L2.

**Requirements:**

- **Variants:** Sidebar, Top Bar, Accordion, Dropdown, With Presets, With History, Minimal, Advanced (8+ total)
- **Presets:** Saved filter presets, quick filters
- **History:** Recent filters, filter suggestions

**Files:** `packages/marketing-components/src/filter/types.ts`, `FilterSidebar.tsx`, `FilterTopBar.tsx`, `FilterAccordion.tsx`, `filter/presets.tsx`, `filter/history.tsx`, `index.ts`

**API:** `FilterDisplay`. Props: `variant`, `filters` (array), `showPresets`, `showHistory`, `onFilterChange`.

**Checklist:** Types; variants; presets; history; export.
**Done:** All 8+ variants render; presets work; history functional.
**Anti:** No persistence; session-only.

---

#### 2.25 Build Search Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 1.15 (Command Palette), 2.20 (Search Feature)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Search variants with autocomplete and suggestions. L2.

**Requirements:**

- **Variants:** Standard, With Autocomplete, With Suggestions, With Filters, Global Search, Mobile Search, Minimal, Advanced (8+ total)
- **Autocomplete:** Real-time suggestions, recent searches, popular searches
- **Suggestions:** Search suggestions, related searches, typo correction

**Files:** `packages/marketing-components/src/search/types.ts`, `SearchStandard.tsx`, `SearchAutocomplete.tsx`, `SearchWithSuggestions.tsx`, `search/autocomplete.tsx`, `search/suggestions.tsx`, `index.ts`

**API:** `SearchDisplay`. Props: `variant`, `onSearch`, `showAutocomplete`, `showSuggestions`, `debounceMs`.

**Checklist:** Types; variants; autocomplete; suggestions; export.
**Done:** All 8+ variants render; autocomplete works; suggestions display.
**Anti:** No fuzzy search; basic matching only.

---

#### 2.26 Build Social Proof Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 1.40 (Rating), 2.4 (Testimonials)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Social Proof variants with trust badges and counts. L2.

**Requirements:**

- **Variants:** Trust Badges, Review Counts, Customer Counts, Logo Wall, Testimonial Carousel, Star Ratings, Social Shares, Minimal (8+ total)
- **Trust Badges:** Security badges, certifications, guarantees
- **Counts:** Customer counts, review counts, social media followers

**Files:** `packages/marketing-components/src/social-proof/types.ts`, `TrustBadges.tsx`, `ReviewCounts.tsx`, `LogoWall.tsx`, `social-proof/badges.tsx`, `index.ts`

**API:** `SocialProofDisplay`. Props: `variant`, `badges` (array), `showCounts`, `showLogos`, `counts`.

**Checklist:** Types; variants; badges; counts; export.
**Done:** All 8+ variants render; badges display; counts show.
**Anti:** No live API integration; static data only.

---

#### 2.27 Build Video Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 2.1 (Hero Video)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Video variants with playlists and analytics. L2.

**Requirements:**

- **Variants:** Single Video, Video Gallery, Playlist, With Controls, Autoplay, Background Video, Embedded, With Captions, With Transcript, Minimal (10+ total)
- **Playlists:** Video playlists, next/previous navigation
- **Analytics:** View tracking, engagement metrics, completion rates

**Files:** `packages/marketing-components/src/video/types.ts`, `VideoSingle.tsx`, `VideoGallery.tsx`, `VideoPlaylist.tsx`, `video/playlist.tsx`, `video/analytics.tsx`, `index.ts`

**API:** `VideoDisplay`, `VideoPlayer`. Props: `variant`, `videos` (array), `showPlaylist`, `autoplay`, `trackAnalytics`.

**Checklist:** Types; variants; playlists; analytics; export.
**Done:** All 10+ variants render; playlists work; analytics track.
**Anti:** No custom video player; HTML5 video only.

---

#### 2.28 Build Audio Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6+ Audio variants with waveforms and transcripts. L2.

**Requirements:**

- **Variants:** Single Audio, Playlist, With Waveform, With Transcript, With Controls, Minimal (6+ total)
- **Waveforms:** Audio waveform visualization, progress indicator
- **Transcripts:** Audio transcripts, synchronized highlighting

**Files:** `packages/marketing-components/src/audio/types.ts`, `AudioPlayer.tsx`, `AudioPlaylist.tsx`, `AudioWithWaveform.tsx`, `audio/waveform.tsx`, `audio/transcript.tsx`, `index.ts`

**API:** `AudioDisplay`, `AudioPlayer`. Props: `variant`, `audio` (array), `showWaveform`, `showTranscript`, `autoplay`.

**Checklist:** Types; variants; waveforms; transcripts; export.
**Done:** All 6+ variants render; waveforms display; transcripts show.
**Anti:** No custom audio processing; HTML5 audio only.

---

#### 2.29 Build Interactive Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.23 (Form), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Interactive variants including quizzes and calculators. L2.

**Requirements:**

- **Variants:** Quiz, Calculator, Poll, Survey, Interactive Form, With Results, With Sharing, Minimal (8+ total)
- **Quizzes:** Question/answer format, scoring, results display
- **Calculators:** Custom calculators, form-based calculations, results display

**Files:** `packages/marketing-components/src/interactive/types.ts`, `Quiz.tsx`, `Calculator.tsx`, `Poll.tsx`, `Survey.tsx`, `interactive/quiz.tsx`, `interactive/calculator.tsx`, `index.ts`

**API:** `InteractiveDisplay`, `Quiz`, `Calculator`. Props: `variant`, `questions` (array), `onSubmit`, `showResults`, `shareable`.

**Checklist:** Types; variants; quiz logic; calculator logic; export.
**Done:** All 8+ variants render; quizzes work; calculators functional.
**Anti:** No custom logic; basic implementations only.

---

#### 2.30 Build Widget Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Widget variants including weather, clock, and countdown. L2.

**Requirements:**

- **Variants:** Weather, Clock, Countdown, Stock Ticker, News Feed, Social Feed, Calendar Widget, Minimal (8+ total)
- **Real-Time Updates:** Live data, auto-refresh, API integration

**Files:** `packages/marketing-components/src/widget/types.ts`, `WeatherWidget.tsx`, `ClockWidget.tsx`, `CountdownWidget.tsx`, `widget/updates.tsx`, `index.ts`

**API:** `WidgetDisplay`. Props: `variant`, `config`, `autoRefresh`, `updateInterval`.

**Checklist:** Types; variants; real-time updates; export.
**Done:** All 8+ variants render; updates work; API integration functional.
**Anti:** No custom APIs; standard providers only.

---

### Feature Breadth (2.16–2.19)

#### 2.16 Create Testimonials Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.4

**Related Research:** §5.1 (Spec-driven), §3.4 (CMS), adapter patterns

**Objective:** TestimonialsSection with 5+ implementation patterns, multi-source integration, and filtering. Uses 2.4 display variants.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Calculator-Based (5+ total)
- **Multi-Source:** Google Reviews, Yelp, Trustpilot, Facebook, custom config, API adapters
- **Filtering:** By rating, source, date, featured, category
- **Features:** Schema validation, adapter pattern, normalization, caching

**Files:** `packages/features/src/testimonials/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/google.ts, lib/adapters/yelp.ts, lib/adapters/trustpilot.ts, lib/adapters/cms.ts, lib/testimonials-config.ts, lib/filters.ts, components/TestimonialsSection.tsx, components/TestimonialsConfig.tsx, components/TestimonialsAPI.tsx, components/TestimonialsCMS.tsx, components/TestimonialsHybrid.tsx)

**API:** `TestimonialsSection`, `testimonialsSchema`, `createTestimonialsConfig`, `normalizeGoogleReviews`, `normalizeYelp`, `normalizeTrustpilot`, `normalizeFromConfig`, `normalizeFromCMS`, `filterTestimonials`, `TestimonialsConfig`, `TestimonialsAPI`, `TestimonialsCMS`, `TestimonialsHybrid`

**Checklist:**

- 2.16a: Schema and base adapters (config, Google, Yelp) (6h)
- 2.16b: Additional adapters (Trustpilot, CMS) (4h)
- 2.16c: Implementation patterns (Config, API, CMS, Hybrid) (6h)
- 2.16d: Filtering and normalization (4h)
- Schema; adapters; TestimonialsSection; createTestimonialsConfig; export; tests.

**Done:** Builds; all adapters normalize; all patterns work; filtering functional; section renders.
**Anti:** No live API keys; mock data for external sources; TanStack Query optional.

---

#### 2.17 Create Team Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.3

**Related Research:** §2.1, §3.1 (RSC), §6 (Industry), §3.4 (CMS)

**Objective:** TeamSection with 5+ implementation patterns, CMS and API adapters. Uses 2.3 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Directory-Based (5+ total)
- **CMS Integration:** Sanity, Contentful, Strapi, MDX adapters
- **API Integration:** REST API, GraphQL, directory services
- **Features:** Schema validation, role filtering, department organization, social integration

**Files:** `packages/features/src/team/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/api.ts, lib/adapters/cms.ts, lib/adapters/directory.ts, lib/team-config.ts, lib/filters.ts, components/TeamSection.tsx, components/TeamConfig.tsx, components/TeamAPI.tsx, components/TeamCMS.tsx, components/TeamHybrid.tsx)

**API:** `TeamSection`, `teamSchema`, `createTeamConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `filterByRole`, `filterByDepartment`, `TeamConfig`, `TeamAPI`, `TeamCMS`, `TeamHybrid`

**Checklist:** Schema → adapters → implementation patterns → Section components → export. Copy pattern from testimonials.
**Done:** Builds; all patterns work; CMS integration functional; API adapters work; filtering works.
**Anti:** No CMS sync; Server Components for data; formatCurrency server-side.

---

#### 2.18 Create Gallery Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.6

**Related Research:** §2.1, §3.1 (RSC), §6 (Industry), §3.4 (CMS)

**Objective:** GallerySection with 5+ implementation patterns, CDN integration, and optimization. Uses 2.6 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, CDN-Based, Hybrid (5+ total)
- **CDN Integration:** Cloudinary, ImageKit, Cloudflare Images, AWS S3
- **Optimization:** Image optimization, lazy loading, responsive images, WebP support
- **Features:** Schema validation, filtering, categorization, lightbox integration

**Files:** `packages/features/src/gallery/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/api.ts, lib/adapters/cms.ts, lib/adapters/cdn.ts, lib/gallery-config.ts, lib/filters.ts, lib/optimization.ts, components/GallerySection.tsx, components/GalleryConfig.tsx, components/GalleryAPI.tsx, components/GalleryCMS.tsx, components/GalleryCDN.tsx, components/GalleryHybrid.tsx)

**API:** `GallerySection`, `gallerySchema`, `createGalleryConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `normalizeFromCDN`, `optimizeImage`, `filterByCategory`, `filterByTag`, `GalleryConfig`, `GalleryAPI`, `GalleryCMS`, `GalleryCDN`, `GalleryHybrid`

**Checklist:** Schema → adapters → implementation patterns → optimization → Section components → export.
**Done:** Builds; all patterns work; CDN integration functional; optimization works; filtering works.
**Anti:** No custom CDN; standard providers only.

---

#### 2.19 Create Pricing Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.5

**Related Research:** §2.1, §3.1 (RSC), §6 (Industry), §3.4 (CMS)

**Objective:** PricingSection with 5+ implementation patterns, calculator integration, and comparison. Uses 2.5 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Calculator-Based, Hybrid (5+ total)
- **Calculator Integration:** Price calculator, feature calculator, usage-based calculator
- **Comparison:** Feature comparison, price comparison, plan recommendations
- **Features:** Schema validation, currency formatting, localization, plan recommendations

**Files:** `packages/features/src/pricing/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/api.ts, lib/adapters/cms.ts, lib/pricing-config.ts, lib/calculator.ts, lib/comparison.ts, lib/formatting.ts, components/PricingSection.tsx, components/PricingConfig.tsx, components/PricingAPI.tsx, components/PricingCMS.tsx, components/PricingCalculator.tsx, components/PricingHybrid.tsx)

**API:** `PricingSection`, `pricingSchema`, `createPricingConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `calculatePrice`, `comparePlans`, `formatCurrency`, `recommendPlan`, `PricingConfig`, `PricingAPI`, `PricingCMS`, `PricingCalculator`, `PricingHybrid`

**Checklist:** Schema → adapters → implementation patterns → calculator → comparison → Section components → export.
**Done:** Builds; all patterns work; calculator functional; comparison works; currency formatting works.
**Anti:** No payment processing; display and calculation only.

---

### Feature Breadth (New Features 2.20–2.50)

#### 2.20 Create Search Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.25

**Related Research:** §5.1 (Spec-driven), §3.4 (CMS), search patterns

**Objective:** Search feature with 5+ implementation patterns, AI-powered search, and semantic search.

**Implementation Patterns:** Config-Based, API-Based, CMS-Based, AI-Powered, Hybrid (5+ total)

**Files:** `packages/features/src/search/` (index, lib/schema, lib/adapters, lib/search-config.ts, lib/ai-search.ts, lib/semantic-search.ts, components/SearchSection.tsx, components/SearchConfig.tsx, components/SearchAPI.tsx, components/SearchCMS.tsx, components/SearchAI.tsx, components/SearchHybrid.tsx)

**API:** `SearchSection`, `searchSchema`, `createSearchConfig`, `performSearch`, `aiSearch`, `semanticSearch`, `SearchConfig`, `SearchAPI`, `SearchCMS`, `SearchAI`, `SearchHybrid`

**Checklist:** Schema; adapters; AI integration; semantic search; implementation patterns; export.
**Done:** Builds; all patterns work; AI search functional; semantic search works.
**Anti:** No custom AI models; use existing APIs.

---

#### 2.21 Create Newsletter Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 4.1

**Related Research:** §5.1 (Spec-driven), §4.1 (Email integrations)

**Objective:** Newsletter feature with 5+ implementation patterns, segmentation, and automation.

**Implementation Patterns:** Config-Based, API-Based, Email-Service-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/newsletter/` (index, lib/schema, lib/adapters, lib/newsletter-config.ts, lib/segmentation.ts, lib/automation.ts, components/NewsletterSection.tsx, components/NewsletterConfig.tsx, components/NewsletterAPI.tsx, components/NewsletterEmail.tsx, components/NewsletterCMS.tsx, components/NewsletterHybrid.tsx)

**API:** `NewsletterSection`, `newsletterSchema`, `createNewsletterConfig`, `subscribe`, `segmentSubscribers`, `automateCampaigns`, `NewsletterConfig`, `NewsletterAPI`, `NewsletterEmail`, `NewsletterCMS`, `NewsletterHybrid`

**Checklist:** Schema; adapters; segmentation; automation; implementation patterns; export.
**Done:** Builds; all patterns work; segmentation functional; automation works.
**Anti:** No custom email service; use existing providers.

---

#### 2.22 Create Social Media Integration Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), social media APIs

**Objective:** Social media integration with 5+ implementation patterns, feeds, and sharing.

**Implementation Patterns:** Config-Based, API-Based, OEmbed-Based, Widget-Based, Hybrid (5+ total)

**Files:** `packages/features/src/social-media/` (index, lib/schema, lib/adapters, lib/social-config.ts, lib/feeds.ts, lib/sharing.ts, components/SocialMediaSection.tsx, components/SocialConfig.tsx, components/SocialAPI.tsx, components/SocialOEmbed.tsx, components/SocialWidget.tsx, components/SocialHybrid.tsx)

**API:** `SocialMediaSection`, `socialMediaSchema`, `createSocialConfig`, `fetchFeed`, `shareContent`, `SocialConfig`, `SocialAPI`, `SocialOEmbed`, `SocialWidget`, `SocialHybrid`

**Checklist:** Schema; adapters; feeds; sharing; implementation patterns; export.
**Done:** Builds; all patterns work; feeds display; sharing functional.
**Anti:** No custom social networks; standard platforms only.

---

#### 2.23 Create Analytics Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), privacy-first analytics

**Objective:** Analytics feature with 5+ implementation patterns, privacy-first approach, and real-time tracking.

**Implementation Patterns:** Config-Based, Google-Analytics-Based, Privacy-First-Based, Self-Hosted-Based, Hybrid (5+ total)

**Files:** `packages/features/src/analytics/` (index, lib/schema, lib/adapters, lib/analytics-config.ts, lib/tracking.ts, lib/privacy.ts, components/AnalyticsSection.tsx, components/AnalyticsConfig.tsx, components/AnalyticsGoogle.tsx, components/AnalyticsPrivacy.tsx, components/AnalyticsSelfHosted.tsx, components/AnalyticsHybrid.tsx)

**API:** `AnalyticsSection`, `analyticsSchema`, `createAnalyticsConfig`, `trackEvent`, `trackPageView`, `privacyCompliant`, `AnalyticsConfig`, `AnalyticsGoogle`, `AnalyticsPrivacy`, `AnalyticsSelfHosted`, `AnalyticsHybrid`

**Checklist:** Schema; adapters; tracking; privacy compliance; implementation patterns; export.
**Done:** Builds; all patterns work; tracking functional; privacy compliant.
**Anti:** No custom analytics engine; use existing providers.

---

#### 2.24 Create A/B Testing Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, C.8

**Related Research:** §5.1 (Spec-driven), §C.8 (A/B testing), statistical analysis

**Objective:** A/B testing feature with 5+ implementation patterns, statistical analysis, and ML recommendations.

**Implementation Patterns:** Config-Based, API-Based, Self-Hosted-Based, ML-Based, Hybrid (5+ total)

**Files:** `packages/features/src/ab-testing/` (index, lib/schema, lib/adapters, lib/ab-config.ts, lib/statistics.ts, lib/ml.ts, components/ABTestingSection.tsx, components/ABConfig.tsx, components/ABAPI.tsx, components/ABSelfHosted.tsx, components/ABML.tsx, components/ABHybrid.tsx)

**API:** `ABTestingSection`, `abTestingSchema`, `createABConfig`, `runTest`, `analyzeResults`, `mlRecommend`, `ABConfig`, `ABAPI`, `ABSelfHosted`, `ABML`, `ABHybrid`

**Checklist:** Schema; adapters; statistics; ML integration; implementation patterns; export.
**Done:** Builds; all patterns work; statistics functional; ML recommendations work.
**Anti:** No custom ML models; use existing services.

---

#### 2.25 Create Personalization Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, C.9

**Related Research:** §5.1 (Spec-driven), §C.9 (Personalization), behavioral tracking

**Objective:** Personalization feature with 5+ implementation patterns, behavioral tracking, and AI-powered recommendations.

**Implementation Patterns:** Config-Based, Rule-Based, Behavioral-Based, AI-Powered-Based, Hybrid (5+ total)

**Files:** `packages/features/src/personalization/` (index, lib/schema, lib/adapters, lib/personalization-config.ts, lib/rules.ts, lib/behavioral.ts, lib/ai.ts, components/PersonalizationSection.tsx, components/PersonalizationConfig.tsx, components/PersonalizationRule.tsx, components/PersonalizationBehavioral.tsx, components/PersonalizationAI.tsx, components/PersonalizationHybrid.tsx)

**API:** `PersonalizationSection`, `personalizationSchema`, `createPersonalizationConfig`, `personalizeContent`, `trackBehavior`, `aiRecommend`, `PersonalizationConfig`, `PersonalizationRule`, `PersonalizationBehavioral`, `PersonalizationAI`, `PersonalizationHybrid`

**Checklist:** Schema; adapters; rules engine; behavioral tracking; AI integration; implementation patterns; export.
**Done:** Builds; all patterns work; rules functional; behavioral tracking works; AI recommendations work.
**Anti:** No custom AI models; use existing services.

---

#### 2.26 Create Chat Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), chat patterns, AI chatbots

**Objective:** Chat feature with 5+ implementation patterns, AI chatbot, and live chat integration.

**Implementation Patterns:** Config-Based, AI-Chatbot-Based, Live-Chat-Based, Widget-Based, Hybrid (5+ total)

**Files:** `packages/features/src/chat/` (index, lib/schema, lib/adapters, lib/chat-config.ts, lib/ai-chatbot.ts, lib/live-chat.ts, components/ChatSection.tsx, components/ChatConfig.tsx, components/ChatAI.tsx, components/ChatLive.tsx, components/ChatWidget.tsx, components/ChatHybrid.tsx)

**API:** `ChatSection`, `chatSchema`, `createChatConfig`, `sendMessage`, `aiChat`, `liveChat`, `ChatConfig`, `ChatAI`, `ChatLive`, `ChatWidget`, `ChatHybrid`

**Checklist:** Schema; adapters; AI chatbot; live chat; implementation patterns; export.
**Done:** Builds; all patterns work; AI chatbot functional; live chat works.
**Anti:** No custom AI models; use existing services.

---

#### 2.27 Create Reviews Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.4

**Related Research:** §5.1 (Spec-driven), review aggregation, moderation

**Objective:** Reviews feature with 5+ implementation patterns, aggregation, and moderation.

**Implementation Patterns:** Config-Based, API-Based, Aggregation-Based, Moderation-Based, Hybrid (5+ total)

**Files:** `packages/features/src/reviews/` (index, lib/schema, lib/adapters, lib/reviews-config.ts, lib/aggregation.ts, lib/moderation.ts, components/ReviewsSection.tsx, components/ReviewsConfig.tsx, components/ReviewsAPI.tsx, components/ReviewsAggregation.tsx, components/ReviewsModeration.tsx, components/ReviewsHybrid.tsx)

**API:** `ReviewsSection`, `reviewsSchema`, `createReviewsConfig`, `aggregateReviews`, `moderateReview`, `ReviewsConfig`, `ReviewsAPI`, `ReviewsAggregation`, `ReviewsModeration`, `ReviewsHybrid`

**Checklist:** Schema; adapters; aggregation; moderation; implementation patterns; export.
**Done:** Builds; all patterns work; aggregation functional; moderation works.
**Anti:** No custom moderation AI; manual moderation only.

---

#### 2.28 Create Booking Feature (Expanded)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, 4.2

**Related Research:** §5.1 (Spec-driven), §4.2 (Scheduling integrations)

**Objective:** Booking feature with 5+ implementation patterns and multi-provider support.

**Implementation Patterns:** Config-Based, API-Based, Provider-Based, Calendar-Based, Hybrid (5+ total)

**Files:** `packages/features/src/booking/` (index, lib/schema, lib/adapters, lib/booking-config.ts, lib/providers.ts, lib/calendar.ts, components/BookingSection.tsx, components/BookingConfig.tsx, components/BookingAPI.tsx, components/BookingProvider.tsx, components/BookingCalendar.tsx, components/BookingHybrid.tsx)

**API:** `BookingSection`, `bookingSchema`, `createBookingConfig`, `bookAppointment`, `checkAvailability`, `syncCalendar`, `BookingConfig`, `BookingAPI`, `BookingProvider`, `BookingCalendar`, `BookingHybrid`

**Checklist:** Schema; adapters; multi-provider support; calendar integration; implementation patterns; export.
**Done:** Builds; all patterns work; multi-provider functional; calendar sync works.
**Anti:** No custom booking system; use existing providers.

---

#### 2.29 Create E-commerce Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 28h | **Deps:** 2.11, 2.14

**Related Research:** §5.1 (Spec-driven), headless commerce

**Objective:** E-commerce feature with 5+ implementation patterns and headless commerce support.

**Implementation Patterns:** Config-Based, Headless-Commerce-Based, API-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/ecommerce/` (index, lib/schema, lib/adapters, lib/ecommerce-config.ts, lib/headless.ts, lib/cart.ts, lib/checkout.ts, components/EcommerceSection.tsx, components/EcommerceConfig.tsx, components/EcommerceHeadless.tsx, components/EcommerceAPI.tsx, components/EcommerceCMS.tsx, components/EcommerceHybrid.tsx)

**API:** `EcommerceSection`, `ecommerceSchema`, `createEcommerceConfig`, `addToCart`, `checkout`, `processPayment`, `EcommerceConfig`, `EcommerceHeadless`, `EcommerceAPI`, `EcommerceCMS`, `EcommerceHybrid`

**Checklist:** Schema; adapters; headless commerce; cart; checkout; implementation patterns; export.
**Done:** Builds; all patterns work; headless commerce functional; cart and checkout work.
**Anti:** No payment processing; integration only.

---

#### 2.30 Create Content Management Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, C.10

**Related Research:** §5.1 (Spec-driven), §C.10 (CMS abstraction)

**Objective:** Content management feature with 5+ implementation patterns and CMS abstraction layer.

**Implementation Patterns:** Config-Based, CMS-Adapter-Based, Headless-CMS-Based, Git-Based, Hybrid (5+ total)

**Files:** `packages/features/src/content-management/` (index, lib/schema, lib/adapters, lib/content-config.ts, lib/cms-adapter.ts, lib/git.ts, components/ContentSection.tsx, components/ContentConfig.tsx, components/ContentCMS.tsx, components/ContentHeadless.tsx, components/ContentGit.tsx, components/ContentHybrid.tsx)

**API:** `ContentSection`, `contentSchema`, `createContentConfig`, `fetchContent`, `updateContent`, `publishContent`, `ContentConfig`, `ContentCMS`, `ContentHeadless`, `ContentGit`, `ContentHybrid`

**Checklist:** Schema; adapters; CMS abstraction; git integration; implementation patterns; export.
**Done:** Builds; all patterns work; CMS abstraction functional; git integration works.
**Anti:** No custom CMS; use existing providers.

---

#### 2.31 Create Form Builder Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 28h | **Deps:** 2.11, 1.23 (Form)

**Related Research:** §5.1 (Spec-driven), visual form builders

**Objective:** Form builder feature with 5+ implementation patterns and visual builder.

**Implementation Patterns:** Config-Based, Visual-Builder-Based, Schema-Based, API-Based, Hybrid (5+ total)

**Files:** `packages/features/src/form-builder/` (index, lib/schema, lib/adapters, lib/form-config.ts, lib/visual-builder.ts, lib/fields.ts, components/FormBuilderSection.tsx, components/FormBuilderConfig.tsx, components/FormBuilderVisual.tsx, components/FormBuilderSchema.tsx, components/FormBuilderAPI.tsx, components/FormBuilderHybrid.tsx)

**API:** `FormBuilderSection`, `formBuilderSchema`, `createFormConfig`, `buildForm`, `renderForm`, `FormBuilderConfig`, `FormBuilderVisual`, `FormBuilderSchema`, `FormBuilderAPI`, `FormBuilderHybrid`

**Checklist:** Schema; adapters; visual builder; field types; implementation patterns; export.
**Done:** Builds; all patterns work; visual builder functional; forms render.
**Anti:** No custom field types; standard inputs only.

---

#### 2.32 Create Payment Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, 2.29

**Related Research:** §5.1 (Spec-driven), payment gateways

**Objective:** Payment feature with 5+ implementation patterns and multi-gateway support.

**Implementation Patterns:** Config-Based, Stripe-Based, PayPal-Based, Multi-Gateway-Based, Hybrid (5+ total)

**Files:** `packages/features/src/payment/` (index, lib/schema, lib/adapters, lib/payment-config.ts, lib/gateways.ts, lib/processing.ts, components/PaymentSection.tsx, components/PaymentConfig.tsx, components/PaymentStripe.tsx, components/PaymentPayPal.tsx, components/PaymentMultiGateway.tsx, components/PaymentHybrid.tsx)

**API:** `PaymentSection`, `paymentSchema`, `createPaymentConfig`, `processPayment`, `handleWebhook`, `PaymentConfig`, `PaymentStripe`, `PaymentPayPal`, `PaymentMultiGateway`, `PaymentHybrid`

**Checklist:** Schema; adapters; payment gateways; processing; webhooks; implementation patterns; export.
**Done:** Builds; all patterns work; payment processing functional; webhooks work.
**Anti:** No custom payment processing; use existing gateways.

---

#### 2.33 Create Notification Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 1.2 (Toast)

**Related Research:** §5.1 (Spec-driven), multi-channel notifications

**Objective:** Notification feature with 5+ implementation patterns and multi-channel support.

**Implementation Patterns:** Config-Based, Email-Based, Push-Based, SMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/notification/` (index, lib/schema, lib/adapters, lib/notification-config.ts, lib/channels.ts, lib/templates.ts, components/NotificationSection.tsx, components/NotificationConfig.tsx, components/NotificationEmail.tsx, components/NotificationPush.tsx, components/NotificationSMS.tsx, components/NotificationHybrid.tsx)

**API:** `NotificationSection`, `notificationSchema`, `createNotificationConfig`, `sendNotification`, `scheduleNotification`, `NotificationConfig`, `NotificationEmail`, `NotificationPush`, `NotificationSMS`, `NotificationHybrid`

**Checklist:** Schema; adapters; multi-channel; templates; implementation patterns; export.
**Done:** Builds; all patterns work; multi-channel functional; templates work.
**Anti:** No custom notification service; use existing providers.

---

#### 2.34 Create Authentication Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), OAuth, SSO

**Objective:** Authentication feature with 5+ implementation patterns, OAuth, and SSO support.

**Implementation Patterns:** Config-Based, OAuth-Based, SSO-Based, JWT-Based, Hybrid (5+ total)

**Files:** `packages/features/src/authentication/` (index, lib/schema, lib/adapters, lib/auth-config.ts, lib/oauth.ts, lib/sso.ts, lib/jwt.ts, components/AuthSection.tsx, components/AuthConfig.tsx, components/AuthOAuth.tsx, components/AuthSSO.tsx, components/AuthJWT.tsx, components/AuthHybrid.tsx)

**API:** `AuthSection`, `authSchema`, `createAuthConfig`, `login`, `logout`, `register`, `oauthLogin`, `ssoLogin`, `AuthConfig`, `AuthOAuth`, `AuthSSO`, `AuthJWT`, `AuthHybrid`

**Checklist:** Schema; adapters; OAuth; SSO; JWT; implementation patterns; export.
**Done:** Builds; all patterns work; OAuth functional; SSO works; JWT works.
**Anti:** No custom auth system; use existing providers.

---

#### 2.35 Create File Upload Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 1.39 (File Upload)

**Related Research:** §5.1 (Spec-driven), multi-provider storage

**Objective:** File upload feature with 5+ implementation patterns and multi-provider storage.

**Implementation Patterns:** Config-Based, S3-Based, Cloudinary-Based, Local-Based, Hybrid (5+ total)

**Files:** `packages/features/src/file-upload/` (index, lib/schema, lib/adapters, lib/upload-config.ts, lib/storage.ts, lib/processing.ts, components/FileUploadSection.tsx, components/FileUploadConfig.tsx, components/FileUploadS3.tsx, components/FileUploadCloudinary.tsx, components/FileUploadLocal.tsx, components/FileUploadHybrid.tsx)

**API:** `FileUploadSection`, `fileUploadSchema`, `createUploadConfig`, `uploadFile`, `processFile`, `FileUploadConfig`, `FileUploadS3`, `FileUploadCloudinary`, `FileUploadLocal`, `FileUploadHybrid`

**Checklist:** Schema; adapters; multi-provider storage; processing; implementation patterns; export.
**Done:** Builds; all patterns work; multi-provider functional; processing works.
**Anti:** No custom storage; use existing providers.

---

#### 2.36 Create Localization Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, C.11

**Related Research:** §5.1 (Spec-driven), §C.11 (i18n/RTL), AI translation

**Objective:** Localization feature with 5+ implementation patterns, AI translation, and RTL support.

**Implementation Patterns:** Config-Based, i18n-Based, AI-Translation-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/localization/` (index, lib/schema, lib/adapters, lib/locale-config.ts, lib/i18n.ts, lib/translation.ts, lib/rtl.ts, components/LocalizationSection.tsx, components/LocalizationConfig.tsx, components/LocalizationI18n.tsx, components/LocalizationAI.tsx, components/LocalizationCMS.tsx, components/LocalizationHybrid.tsx)

**API:** `LocalizationSection`, `localizationSchema`, `createLocaleConfig`, `translate`, `switchLocale`, `rtlSupport`, `LocalizationConfig`, `LocalizationI18n`, `LocalizationAI`, `LocalizationCMS`, `LocalizationHybrid`

**Checklist:** Schema; adapters; i18n; AI translation; RTL support; implementation patterns; export.
**Done:** Builds; all patterns work; i18n functional; AI translation works; RTL works.
**Anti:** No custom translation models; use existing services.

---

#### 2.37 Create SEO Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), SEO best practices, structured data

**Objective:** SEO feature with 5+ implementation patterns, structured data, and sitemap generation.

**Implementation Patterns:** Config-Based, Schema-Based, Sitemap-Based, Analytics-Based, Hybrid (5+ total)

**Files:** `packages/features/src/seo/` (index, lib/schema, lib/adapters, lib/seo-config.ts, lib/structured-data.ts, lib/sitemap.ts, components/SEOSection.tsx, components/SEOConfig.tsx, components/SEOSchema.tsx, components/SEOSitemap.tsx, components/SEOAnalytics.tsx, components/SEOHybrid.tsx)

**API:** `SEOSection`, `seoSchema`, `createSEOConfig`, `generateStructuredData`, `generateSitemap`, `analyzeSEO`, `SEOConfig`, `SEOSchema`, `SEOSitemap`, `SEOAnalytics`, `SEOHybrid`

**Checklist:** Schema; adapters; structured data; sitemap; analytics; implementation patterns; export.
**Done:** Builds; all patterns work; structured data functional; sitemap works; analytics work.
**Anti:** No custom SEO engine; standard practices only.

---

#### 2.38 Create Performance Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, C.14

**Related Research:** §5.1 (Spec-driven), §C.14 (Performance SLOs), optimization

**Objective:** Performance feature with 5+ implementation patterns, optimization, and monitoring.

**Implementation Patterns:** Config-Based, Optimization-Based, Monitoring-Based, CDN-Based, Hybrid (5+ total)

**Files:** `packages/features/src/performance/` (index, lib/schema, lib/adapters, lib/performance-config.ts, lib/optimization.ts, lib/monitoring.ts, components/PerformanceSection.tsx, components/PerformanceConfig.tsx, components/PerformanceOptimization.tsx, components/PerformanceMonitoring.tsx, components/PerformanceCDN.tsx, components/PerformanceHybrid.tsx)

**API:** `PerformanceSection`, `performanceSchema`, `createPerformanceConfig`, `optimize`, `monitor`, `analyzePerformance`, `PerformanceConfig`, `PerformanceOptimization`, `PerformanceMonitoring`, `PerformanceCDN`, `PerformanceHybrid`

**Checklist:** Schema; adapters; optimization; monitoring; CDN; implementation patterns; export.
**Done:** Builds; all patterns work; optimization functional; monitoring works.
**Anti:** No custom optimization; standard techniques only.

---

#### 2.39 Create Security Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, C.13

**Related Research:** §5.1 (Spec-driven), §C.13 (Security), CSP, rate limiting

**Objective:** Security feature with 5+ implementation patterns, CSP, and rate limiting.

**Implementation Patterns:** Config-Based, CSP-Based, Rate-Limiting-Based, WAF-Based, Hybrid (5+ total)

**Files:** `packages/features/src/security/` (index, lib/schema, lib/adapters, lib/security-config.ts, lib/csp.ts, lib/rate-limiting.ts, components/SecuritySection.tsx, components/SecurityConfig.tsx, components/SecurityCSP.tsx, components/SecurityRateLimit.tsx, components/SecurityWAF.tsx, components/SecurityHybrid.tsx)

**API:** `SecuritySection`, `securitySchema`, `createSecurityConfig`, `enforceCSP`, `rateLimit`, `SecurityConfig`, `SecurityCSP`, `SecurityRateLimit`, `SecurityWAF`, `SecurityHybrid`

**Checklist:** Schema; adapters; CSP; rate limiting; WAF; implementation patterns; export.
**Done:** Builds; all patterns work; CSP functional; rate limiting works.
**Anti:** No custom security engine; standard practices only.

---

#### 2.40 Create Monitoring Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), error tracking, APM

**Objective:** Monitoring feature with 5+ implementation patterns, error tracking, and APM.

**Implementation Patterns:** Config-Based, Error-Tracking-Based, APM-Based, Logging-Based, Hybrid (5+ total)

**Files:** `packages/features/src/monitoring/` (index, lib/schema, lib/adapters, lib/monitoring-config.ts, lib/error-tracking.ts, lib/apm.ts, components/MonitoringSection.tsx, components/MonitoringConfig.tsx, components/MonitoringError.tsx, components/MonitoringAPM.tsx, components/MonitoringLogging.tsx, components/MonitoringHybrid.tsx)

**API:** `MonitoringSection`, `monitoringSchema`, `createMonitoringConfig`, `trackError`, `trackPerformance`, `logEvent`, `MonitoringConfig`, `MonitoringError`, `MonitoringAPM`, `MonitoringLogging`, `MonitoringHybrid`

**Checklist:** Schema; adapters; error tracking; APM; logging; implementation patterns; export.
**Done:** Builds; all patterns work; error tracking functional; APM works.
**Anti:** No custom monitoring; use existing providers.

---

#### 2.41 Create Backup Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 16h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), automated backups, cloud storage

**Objective:** Backup feature with 5+ implementation patterns, automated backups, and cloud storage.

**Implementation Patterns:** Config-Based, Automated-Based, Cloud-Based, Local-Based, Hybrid (5+ total)

**Files:** `packages/features/src/backup/` (index, lib/schema, lib/adapters, lib/backup-config.ts, lib/automation.ts, lib/storage.ts, components/BackupSection.tsx, components/BackupConfig.tsx, components/BackupAutomated.tsx, components/BackupCloud.tsx, components/BackupLocal.tsx, components/BackupHybrid.tsx)

**API:** `BackupSection`, `backupSchema`, `createBackupConfig`, `createBackup`, `restoreBackup`, `scheduleBackup`, `BackupConfig`, `BackupAutomated`, `BackupCloud`, `BackupLocal`, `BackupHybrid`

**Checklist:** Schema; adapters; automation; cloud storage; implementation patterns; export.
**Done:** Builds; all patterns work; automation functional; cloud storage works.
**Anti:** No custom backup system; use existing providers.

---

#### 2.42 Create Migration Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), data migration, validation

**Objective:** Migration feature with 5+ implementation patterns, validation, and rollback support.

**Implementation Patterns:** Config-Based, Data-Based, Schema-Based, Validation-Based, Hybrid (5+ total)

**Files:** `packages/features/src/migration/` (index, lib/schema, lib/adapters, lib/migration-config.ts, lib/data.ts, lib/validation.ts, lib/rollback.ts, components/MigrationSection.tsx, components/MigrationConfig.tsx, components/MigrationData.tsx, components/MigrationSchema.tsx, components/MigrationValidation.tsx, components/MigrationHybrid.tsx)

**API:** `MigrationSection`, `migrationSchema`, `createMigrationConfig`, `migrate`, `validateMigration`, `rollback`, `MigrationConfig`, `MigrationData`, `MigrationSchema`, `MigrationValidation`, `MigrationHybrid`

**Checklist:** Schema; adapters; data migration; validation; rollback; implementation patterns; export.
**Done:** Builds; all patterns work; migration functional; validation works; rollback works.
**Anti:** No custom migration engine; standard patterns only.

---

#### 2.43 Create API Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), REST, GraphQL, tRPC

**Objective:** API feature with 5+ implementation patterns supporting REST, GraphQL, and tRPC.

**Implementation Patterns:** Config-Based, REST-Based, GraphQL-Based, tRPC-Based, Hybrid (5+ total)

**Files:** `packages/features/src/api/` (index, lib/schema, lib/adapters, lib/api-config.ts, lib/rest.ts, lib/graphql.ts, lib/trpc.ts, components/APISection.tsx, components/APIConfig.tsx, components/APIREST.tsx, components/APIGraphQL.tsx, components/APItRPC.tsx, components/APIHybrid.tsx)

**API:** `APISection`, `apiSchema`, `createAPIConfig`, `createRESTEndpoint`, `createGraphQLEndpoint`, `createTRPCEndpoint`, `APIConfig`, `APIREST`, `APIGraphQL`, `APItRPC`, `APIHybrid`

**Checklist:** Schema; adapters; REST; GraphQL; tRPC; implementation patterns; export.
**Done:** Builds; all patterns work; REST functional; GraphQL works; tRPC works.
**Anti:** No custom API framework; use existing libraries.

---

#### 2.44 Create Webhook Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 16h | **Deps:** 2.11, 2.43

**Related Research:** §5.1 (Spec-driven), webhook security, retry logic

**Objective:** Webhook feature with 5+ implementation patterns, security, and retry logic.

**Implementation Patterns:** Config-Based, Secure-Based, Retry-Based, Queue-Based, Hybrid (5+ total)

**Files:** `packages/features/src/webhook/` (index, lib/schema, lib/adapters, lib/webhook-config.ts, lib/security.ts, lib/retry.ts, components/WebhookSection.tsx, components/WebhookConfig.tsx, components/WebhookSecure.tsx, components/WebhookRetry.tsx, components/WebhookQueue.tsx, components/WebhookHybrid.tsx)

**API:** `WebhookSection`, `webhookSchema`, `createWebhookConfig`, `sendWebhook`, `retryWebhook`, `secureWebhook`, `WebhookConfig`, `WebhookSecure`, `WebhookRetry`, `WebhookQueue`, `WebhookHybrid`

**Checklist:** Schema; adapters; security; retry logic; queue; implementation patterns; export.
**Done:** Builds; all patterns work; security functional; retry works.
**Anti:** No custom webhook service; standard patterns only.

---

#### 2.45 Create Integration Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11, 4.1-4.6

**Related Research:** §5.1 (Spec-driven), CRM, email, payment integrations

**Objective:** Integration feature with 5+ implementation patterns for CRM, email, and payment systems.

**Implementation Patterns:** Config-Based, CRM-Based, Email-Based, Payment-Based, Hybrid (5+ total)

**Files:** `packages/features/src/integration/` (index, lib/schema, lib/adapters, lib/integration-config.ts, lib/crm.ts, lib/email.ts, lib/payment.ts, components/IntegrationSection.tsx, components/IntegrationConfig.tsx, components/IntegrationCRM.tsx, components/IntegrationEmail.tsx, components/IntegrationPayment.tsx, components/IntegrationHybrid.tsx)

**API:** `IntegrationSection`, `integrationSchema`, `createIntegrationConfig`, `integrateCRM`, `integrateEmail`, `integratePayment`, `IntegrationConfig`, `IntegrationCRM`, `IntegrationEmail`, `IntegrationPayment`, `IntegrationHybrid`

**Checklist:** Schema; adapters; CRM; email; payment; implementation patterns; export.
**Done:** Builds; all patterns work; CRM integration functional; email works; payment works.
**Anti:** No custom integrations; use existing providers.

---

#### 2.46 Create Automation Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), workflow builder, AI automation

**Objective:** Automation feature with 5+ implementation patterns, workflow builder, and AI automation.

**Implementation Patterns:** Config-Based, Workflow-Based, AI-Based, Rule-Based, Hybrid (5+ total)

**Files:** `packages/features/src/automation/` (index, lib/schema, lib/adapters, lib/automation-config.ts, lib/workflow.ts, lib/ai.ts, lib/rules.ts, components/AutomationSection.tsx, components/AutomationConfig.tsx, components/AutomationWorkflow.tsx, components/AutomationAI.tsx, components/AutomationRule.tsx, components/AutomationHybrid.tsx)

**API:** `AutomationSection`, `automationSchema`, `createAutomationConfig`, `createWorkflow`, `runAutomation`, `aiAutomate`, `AutomationConfig`, `AutomationWorkflow`, `AutomationAI`, `AutomationRule`, `AutomationHybrid`

**Checklist:** Schema; adapters; workflow builder; AI automation; rules; implementation patterns; export.
**Done:** Builds; all patterns work; workflow builder functional; AI automation works.
**Anti:** No custom AI models; use existing services.

---

#### 2.47 Create Reporting Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.23

**Related Research:** §5.1 (Spec-driven), dashboards, data visualization

**Objective:** Reporting feature with 5+ implementation patterns, dashboards, and visualization.

**Implementation Patterns:** Config-Based, Dashboard-Based, Visualization-Based, Analytics-Based, Hybrid (5+ total)

**Files:** `packages/features/src/reporting/` (index, lib/schema, lib/adapters, lib/reporting-config.ts, lib/dashboard.ts, lib/visualization.ts, components/ReportingSection.tsx, components/ReportingConfig.tsx, components/ReportingDashboard.tsx, components/ReportingVisualization.tsx, components/ReportingAnalytics.tsx, components/ReportingHybrid.tsx)

**API:** `ReportingSection`, `reportingSchema`, `createReportingConfig`, `generateReport`, `createDashboard`, `visualizeData`, `ReportingConfig`, `ReportingDashboard`, `ReportingVisualization`, `ReportingAnalytics`, `ReportingHybrid`

**Checklist:** Schema; adapters; dashboards; visualization; analytics; implementation patterns; export.
**Done:** Builds; all patterns work; dashboards functional; visualization works.
**Anti:** No custom visualization library; use existing libraries.

---

### Infrastructure Systems (F.1–F.40)

#### F.1 Component Composition System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** §2.1 (Atomic design), composition patterns

**Objective:** Foundation system for component composition with slots, render props, and HOCs.

**Files:** `packages/infrastructure/composition/` (index, slots.ts, render-props.ts, hocs.ts, context.ts, provider.ts)

**API:** `useSlots`, `useRenderProps`, `withComposition`, `CompositionProvider`, `Slot`, `RenderProp`

**Checklist:** Slots system; render props; HOCs; context; provider; export.
**Done:** Builds; composition system functional; all patterns work.
**Anti:** No custom composition; standard React patterns only.

---

#### F.2 Variant System Infrastructure

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** None

**Related Research:** §2.2 (Component patterns), CVA, variant systems

**Objective:** Centralized variant system with type-safe variant definitions and composition.

**Files:** `packages/infrastructure/variants/` (index, types.ts, cva.ts, compose.ts, utils.ts)

**API:** `createVariant`, `composeVariants`, `variantSchema`, `useVariant`

**Checklist:** Variant types; CVA integration; composition; utilities; export.
**Done:** Builds; variant system functional; type-safe variants work.
**Anti:** No custom variant engine; CVA-based only.

---

#### F.3 Customization Hook System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.1

**Related Research:** §2.2 (Component patterns), React hooks

**Objective:** Customization hooks for runtime component customization.

**Files:** `packages/infrastructure/customization/` (index, hooks.ts, styles.ts, theme.ts, config.ts)

**API:** `useCustomization`, `useStyleOverride`, `useThemeExtension`, `useConfigOverride`

**Checklist:** Customization hooks; style overrides; theme extensions; config overrides; export.
**Done:** Builds; customization hooks functional; runtime customization works.
**Anti:** No custom hook engine; standard React hooks only.

---

#### F.4 Layout System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** §2.1 (Atomic design), layout patterns

**Objective:** Layout system with grid, flexbox, and responsive utilities.

**Files:** `packages/infrastructure/layout/` (index, grid.ts, flexbox.ts, responsive.ts, utils.ts)

**API:** `LayoutGrid`, `LayoutFlex`, `useResponsive`, `useBreakpoint`, `LayoutProvider`

**Checklist:** Grid system; flexbox utilities; responsive hooks; breakpoints; export.
**Done:** Builds; layout system functional; responsive utilities work.
**Anti:** No custom layout engine; CSS Grid/Flexbox only.

---

#### F.5 Theme Extension System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.2

**Related Research:** §C.5 (Design tokens), theme systems

**Objective:** Theme extension system for runtime theme customization.

**Files:** `packages/infrastructure/theme/` (index, extension.ts, tokens.ts, css-vars.ts, utils.ts)

**API:** `extendTheme`, `useTheme`, `ThemeProvider`, `generateCSSVars`, `applyTheme`

**Checklist:** Theme extension; tokens; CSS vars generation; provider; export.
**Done:** Builds; theme system functional; runtime theme changes work.
**Anti:** No custom theme engine; CSS variables only.

---

#### F.6 Animation System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** §C.6 (Motion primitives), animation patterns

**Objective:** Animation system with presets, easing functions, and transitions.

**Files:** `packages/infrastructure/animation/` (index, presets.ts, easing.ts, transitions.ts, hooks.ts)

**API:** `useAnimation`, `animate`, `AnimationPreset`, `EasingFunction`, `Transition`

**Checklist:** Animation presets; easing functions; transitions; hooks; export.
**Done:** Builds; animation system functional; presets work; transitions smooth.
**Anti:** No custom animation engine; CSS animations + Framer Motion only.

---

#### F.7 Interaction System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.6

**Related Research:** §C.6 (Creative interactions), interaction patterns

**Objective:** Interaction system for hover, focus, click, and gesture interactions.

**Files:** `packages/infrastructure/interaction/` (index, hover.ts, focus.ts, click.ts, gestures.ts, hooks.ts)

**API:** `useInteraction`, `useHover`, `useFocus`, `useClick`, `useGesture`

**Checklist:** Interaction hooks; hover; focus; click; gestures; export.
**Done:** Builds; interaction system functional; all interactions work.
**Anti:** No custom gesture engine; standard events only.

---

#### F.8 Responsive System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.4

**Related Research:** §2.1 (Responsive design), breakpoint systems

**Objective:** Responsive system with breakpoints, media queries, and responsive utilities.

**Files:** `packages/infrastructure/responsive/` (index, breakpoints.ts, media-queries.ts, hooks.ts, utils.ts)

**API:** `useBreakpoint`, `useMediaQuery`, `ResponsiveProvider`, `BreakpointConfig`, `matchBreakpoint`

**Checklist:** Breakpoints; media queries; hooks; utilities; export.
**Done:** Builds; responsive system functional; breakpoints work; media queries work.
**Anti:** No custom breakpoint engine; standard breakpoints only.

---

#### F.9 Grid System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.4

**Related Research:** §2.1 (Grid layouts), CSS Grid

**Objective:** Grid system with column layouts, gaps, and responsive grids.

**Files:** `packages/infrastructure/grid/` (index, columns.ts, gaps.ts, responsive.ts, utils.ts)

**API:** `Grid`, `GridItem`, `useGrid`, `GridConfig`, `generateGridClasses`

**Checklist:** Grid component; column system; gaps; responsive grids; export.
**Done:** Builds; grid system functional; columns work; responsive grids work.
**Anti:** No custom grid engine; CSS Grid only.

---

#### F.10 Spacing System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 8h | **Deps:** None

**Related Research:** §C.5 (Design tokens), spacing scales

**Objective:** Spacing system with consistent spacing scale and utilities.

**Files:** `packages/infrastructure/spacing/` (index, scale.ts, utils.ts, hooks.ts)

**API:** `spacing`, `useSpacing`, `SpacingScale`, `getSpacing`

**Checklist:** Spacing scale; utilities; hooks; export.
**Done:** Builds; spacing system functional; scale works; utilities work.
**Anti:** No custom spacing engine; standard scale only.

---

#### F.11 Typography System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** §C.5 (Design tokens), typography scales

**Objective:** Typography system with font scales, line heights, and text utilities.

**Files:** `packages/infrastructure/typography/` (index, fonts.ts, scale.ts, line-height.ts, utils.ts)

**API:** `Typography`, `useTypography`, `FontScale`, `LineHeightScale`, `getTypography`

**Checklist:** Typography component; font scales; line heights; utilities; export.
**Done:** Builds; typography system functional; scales work; utilities work.
**Anti:** No custom font engine; web fonts only.

---

#### F.12 Color System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.5

**Related Research:** §C.5 (Design tokens), color systems

**Objective:** Color system with palettes, contrast checking, and accessibility.

**Files:** `packages/infrastructure/color/` (index, palette.ts, contrast.ts, accessibility.ts, utils.ts)

**API:** `ColorPalette`, `useColor`, `checkContrast`, `getAccessibleColor`, `generatePalette`

**Checklist:** Color palette; contrast checking; accessibility; utilities; export.
**Done:** Builds; color system functional; palettes work; contrast checking works.
**Anti:** No custom color engine; standard color spaces only.

---

#### F.13 Shadow System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 8h | **Deps:** F.5

**Related Research:** §C.5 (Design tokens), shadow scales

**Objective:** Shadow system with elevation levels and shadow presets.

**Files:** `packages/infrastructure/shadow/` (index, scale.ts, presets.ts, utils.ts)

**API:** `ShadowScale`, `useShadow`, `getShadow`, `ShadowPreset`

**Checklist:** Shadow scale; presets; utilities; export.
**Done:** Builds; shadow system functional; scale works; presets work.
**Anti:** No custom shadow engine; CSS shadows only.

---

#### F.14 Border System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 8h | **Deps:** F.5

**Related Research:** §C.5 (Design tokens), border scales

**Objective:** Border system with radius scales and border utilities.

**Files:** `packages/infrastructure/border/` (index, radius.ts, width.ts, utils.ts)

**API:** `BorderRadius`, `useBorder`, `getBorderRadius`, `BorderWidth`

**Checklist:** Border radius; width; utilities; export.
**Done:** Builds; border system functional; radius works; width works.
**Anti:** No custom border engine; CSS borders only.

---

#### F.15 Icon System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** None

**Related Research:** Icon libraries, icon patterns

**Objective:** Icon system with icon library integration and custom icons.

**Files:** `packages/infrastructure/icon/` (index, library.ts, custom.ts, utils.ts, hooks.ts)

**API:** `Icon`, `useIcon`, `IconLibrary`, `registerIcon`, `getIcon`

**Checklist:** Icon component; library integration; custom icons; utilities; export.
**Done:** Builds; icon system functional; libraries work; custom icons work.
**Anti:** No custom icon engine; Lucide React + custom SVGs only.

---

#### F.16 Image System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** Image optimization, Next.js Image

**Objective:** Image system with optimization, lazy loading, and responsive images.

**Files:** `packages/infrastructure/image/` (index, optimization.ts, lazy-loading.ts, responsive.ts, utils.ts)

**API:** `OptimizedImage`, `useImage`, `optimizeImage`, `lazyLoadImage`, `getResponsiveSrc`

**Checklist:** Image component; optimization; lazy loading; responsive images; export.
**Done:** Builds; image system functional; optimization works; lazy loading works.
**Anti:** No custom optimization; Next.js Image + standard techniques only.

---

#### F.17 Media System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.16

**Related Research:** Media handling, video/audio patterns

**Objective:** Media system for video, audio, and other media types.

**Files:** `packages/infrastructure/media/` (index, video.ts, audio.ts, utils.ts, hooks.ts)

**API:** `MediaPlayer`, `useMedia`, `VideoPlayer`, `AudioPlayer`, `MediaConfig`

**Checklist:** Media components; video; audio; utilities; export.
**Done:** Builds; media system functional; video works; audio works.
**Anti:** No custom media engine; HTML5 media only.

---

#### F.18 State Management System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** None

**Related Research:** State management patterns, Zustand, Jotai

**Objective:** State management system with global state, local state, and persistence.

**Files:** `packages/infrastructure/state/` (index, global.ts, local.ts, persistence.ts, hooks.ts)

**API:** `useGlobalState`, `useLocalState`, `usePersistedState`, `StateProvider`, `createStore`

**Checklist:** Global state; local state; persistence; hooks; export.
**Done:** Builds; state system functional; global state works; persistence works.
**Anti:** No custom state engine; Zustand/Jotai only.

---

#### F.19 Form System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** 1.23, F.18

**Related Research:** Form patterns, React Hook Form, Zod

**Objective:** Form system with validation, error handling, and field management.

**Files:** `packages/infrastructure/form/` (index, validation.ts, errors.ts, fields.ts, hooks.ts)

**API:** `useForm`, `FormProvider`, `FormField`, `validateForm`, `FormError`

**Checklist:** Form hooks; validation; error handling; fields; export.
**Done:** Builds; form system functional; validation works; errors display.
**Anti:** No custom form engine; React Hook Form + Zod only.

---

#### F.20 Validation System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.19

**Related Research:** Validation patterns, Zod, Yup

**Objective:** Validation system with schema validation and custom validators.

**Files:** `packages/infrastructure/validation/` (index, schema.ts, validators.ts, errors.ts, utils.ts)

**API:** `validate`, `createValidator`, `ValidationSchema`, `ValidationError`, `useValidation`

**Checklist:** Schema validation; custom validators; error handling; utilities; export.
**Done:** Builds; validation system functional; schemas work; validators work.
**Anti:** No custom validation engine; Zod only.

---

#### F.21 Error Handling System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** None

**Related Research:** Error handling patterns, error boundaries

**Objective:** Error handling system with error boundaries, error logging, and user-friendly errors.

**Files:** `packages/infrastructure/error/` (index, boundary.ts, logging.ts, display.ts, hooks.ts)

**API:** `ErrorBoundary`, `useError`, `logError`, `ErrorDisplay`, `ErrorProvider`

**Checklist:** Error boundary; logging; display; hooks; export.
**Done:** Builds; error system functional; boundaries work; logging works.
**Anti:** No custom error engine; React error boundaries only.

---

#### F.22 Loading System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** 1.9

**Related Research:** Loading patterns, suspense, loading states

**Objective:** Loading system with loading states, skeletons, and suspense integration.

**Files:** `packages/infrastructure/loading/` (index, states.ts, skeletons.ts, suspense.ts, hooks.ts)

**API:** `useLoading`, `LoadingProvider`, `Skeleton`, `LoadingState`, `withSuspense`

**Checklist:** Loading states; skeletons; suspense; hooks; export.
**Done:** Builds; loading system functional; states work; skeletons work.
**Anti:** No custom loading engine; React Suspense only.

---

#### F.23 Accessibility System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** None

**Related Research:** WCAG 2.2, accessibility patterns, ARIA

**Objective:** Accessibility system with ARIA utilities, keyboard navigation, and screen reader support.

**Files:** `packages/infrastructure/accessibility/` (index, aria.ts, keyboard.ts, screen-reader.ts, hooks.ts)

**API:** `useAria`, `useKeyboard`, `useScreenReader`, `AriaProvider`, `AccessibilityUtils`

**Checklist:** ARIA utilities; keyboard navigation; screen reader; hooks; export.
**Done:** Builds; accessibility system functional; ARIA works; keyboard works.
**Anti:** No custom accessibility engine; standard ARIA only.

---

#### F.24 Performance System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** F.16, F.22

**Related Research:** Performance optimization, Core Web Vitals, lazy loading

**Objective:** Performance system with optimization utilities, monitoring, and best practices.

**Files:** `packages/infrastructure/performance/` (index, optimization.ts, monitoring.ts, metrics.ts, hooks.ts)

**API:** `usePerformance`, `optimizeComponent`, `trackPerformance`, `PerformanceMetrics`, `PerformanceProvider`

**Checklist:** Optimization utilities; monitoring; metrics; hooks; export.
**Done:** Builds; performance system functional; optimization works; monitoring works.
**Anti:** No custom performance engine; standard techniques only.

---

#### F.25 Testing System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** None

**Related Research:** Testing patterns, Jest, Vitest, Playwright

**Objective:** Testing system with unit tests, integration tests, and E2E tests.

**Files:** `packages/infrastructure/testing/` (index, unit.ts, integration.ts, e2e.ts, utils.ts, fixtures.ts)

**API:** `testUtils`, `renderComponent`, `mockAPI`, `testFixtures`, `TestingProvider`

**Checklist:** Unit test utilities; integration test utilities; E2E utilities; fixtures; export.
**Done:** Builds; testing system functional; unit tests work; E2E tests work.
**Anti:** No custom test engine; Jest/Vitest/Playwright only.

---

#### F.26 Documentation System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** Documentation patterns, MDX, Storybook

**Objective:** Documentation system with auto-generated docs, MDX support, and Storybook integration.

**Files:** `packages/infrastructure/documentation/` (index, mdx.ts, storybook.ts, auto-generate.ts, utils.ts)

**API:** `DocumentationProvider`, `MDXComponent`, `generateDocs`, `StorybookConfig`, `useDocs`

**Checklist:** MDX support; Storybook integration; auto-generation; utilities; export.
**Done:** Builds; documentation system functional; MDX works; Storybook works.
**Anti:** No custom doc engine; MDX + Storybook only.

---

#### F.27 Development System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** None

**Related Research:** Development tools, hot reload, dev server

**Objective:** Development system with dev tools, hot reload, and development utilities.

**Files:** `packages/infrastructure/development/` (index, dev-tools.ts, hot-reload.ts, utils.ts, hooks.ts)

**API:** `useDevTools`, `DevToolsProvider`, `hotReload`, `DevelopmentUtils`

**Checklist:** Dev tools; hot reload; utilities; hooks; export.
**Done:** Builds; development system functional; dev tools work; hot reload works.
**Anti:** No custom dev engine; standard dev tools only.

---

#### F.28 Build System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** Build tools, Turborepo, bundling

**Objective:** Build system with bundling, optimization, and build utilities.

**Files:** `packages/infrastructure/build/` (index, bundling.ts, optimization.ts, utils.ts, config.ts)

**API:** `buildPackage`, `optimizeBundle`, `BuildConfig`, `BuildUtils`, `BuildProvider`

**Checklist:** Bundling; optimization; utilities; config; export.
**Done:** Builds; build system functional; bundling works; optimization works.
**Anti:** No custom build engine; Turborepo + standard bundlers only.

---

#### F.29 Deployment System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.28

**Related Research:** Deployment patterns, CI/CD, deployment platforms

**Objective:** Deployment system with CI/CD integration and deployment utilities.

**Files:** `packages/infrastructure/deployment/` (index, ci-cd.ts, platforms.ts, utils.ts, config.ts)

**API:** `deploy`, `DeploymentConfig`, `CICDProvider`, `DeploymentUtils`, `useDeployment`

**Checklist:** CI/CD integration; platforms; utilities; config; export.
**Done:** Builds; deployment system functional; CI/CD works; platforms work.
**Anti:** No custom deployment engine; standard CI/CD only.

---

#### F.30 Monitoring System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.21, F.24

**Related Research:** Monitoring patterns, error tracking, performance monitoring

**Objective:** Monitoring system with error tracking, performance monitoring, and analytics.

**Files:** `packages/infrastructure/monitoring/` (index, errors.ts, performance.ts, analytics.ts, hooks.ts)

**API:** `useMonitoring`, `trackError`, `trackPerformance`, `MonitoringProvider`, `MonitoringUtils`

**Checklist:** Error tracking; performance monitoring; analytics; hooks; export.
**Done:** Builds; monitoring system functional; error tracking works; performance monitoring works.
**Anti:** No custom monitoring engine; standard providers only.

---

#### F.31 Slot System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.1

**Related Research:** Slot patterns, composition

**Objective:** Slot system for component composition with named slots and slot fallbacks.

**Files:** `packages/infrastructure/slots/` (index, slots.ts, named-slots.ts, fallbacks.ts, hooks.ts)

**API:** `Slot`, `useSlot`, `NamedSlot`, `SlotFallback`, `SlotProvider`

**Checklist:** Slot component; named slots; fallbacks; hooks; export.
**Done:** Builds; slot system functional; named slots work; fallbacks work.
**Anti:** No custom slot engine; React children + context only.

---

#### F.32 Render Prop System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.1

**Related Research:** Render prop patterns, composition

**Objective:** Render prop system for flexible component composition.

**Files:** `packages/infrastructure/render-props/` (index, render-props.ts, composition.ts, hooks.ts)

**API:** `RenderProp`, `useRenderProp`, `withRenderProp`, `RenderPropProvider`

**Checklist:** Render prop component; composition; hooks; export.
**Done:** Builds; render prop system functional; composition works.
**Anti:** No custom render prop engine; standard React patterns only.

---

#### F.33 Higher-Order Component System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.1

**Related Research:** HOC patterns, composition

**Objective:** HOC system for component enhancement and composition.

**Files:** `packages/infrastructure/hoc/` (index, hocs.ts, composition.ts, utils.ts)

**API:** `withHOC`, `composeHOCs`, `HOCProvider`, `createHOC`

**Checklist:** HOC utilities; composition; provider; export.
**Done:** Builds; HOC system functional; composition works.
**Anti:** No custom HOC engine; standard React HOCs only.

---

#### F.34 Context System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.1

**Related Research:** Context patterns, React Context

**Objective:** Context system for shared state and component communication.

**Files:** `packages/infrastructure/context/` (index, context.ts, providers.ts, hooks.ts)

**API:** `createContext`, `useContext`, `ContextProvider`, `withContext`

**Checklist:** Context utilities; providers; hooks; export.
**Done:** Builds; context system functional; providers work; hooks work.
**Anti:** No custom context engine; React Context only.

---

#### F.35 Provider System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 12h | **Deps:** F.34

**Related Research:** Provider patterns, composition

**Objective:** Provider system for composing multiple providers and context.

**Files:** `packages/infrastructure/provider/` (index, providers.ts, composition.ts, hooks.ts)

**API:** `Provider`, `composeProviders`, `useProvider`, `ProviderProvider`

**Checklist:** Provider component; composition; hooks; export.
**Done:** Builds; provider system functional; composition works.
**Anti:** No custom provider engine; React Context only.

---

#### F.36 Style System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.5

**Related Research:** Styling patterns, CSS-in-JS, Tailwind

**Objective:** Style system with CSS-in-JS support, Tailwind integration, and style utilities.

**Files:** `packages/infrastructure/style/` (index, css-in-js.ts, tailwind.ts, utilities.ts, hooks.ts)

**API:** `useStyle`, `StyleProvider`, `css`, `styled`, `StyleUtils`

**Checklist:** CSS-in-JS; Tailwind integration; utilities; hooks; export.
**Done:** Builds; style system functional; CSS-in-JS works; Tailwind works.
**Anti:** No custom style engine; Tailwind + CSS-in-JS only.

---

#### F.37 Theme System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** F.5, F.36

**Related Research:** Theme patterns, dark mode, theme switching

**Objective:** Theme system with theme switching, dark mode, and theme persistence.

**Files:** `packages/infrastructure/theme-system/` (index, switching.ts, dark-mode.ts, persistence.ts, hooks.ts)

**API:** `useTheme`, `ThemeProvider`, `switchTheme`, `toggleDarkMode`, `ThemeUtils`

**Checklist:** Theme switching; dark mode; persistence; hooks; export.
**Done:** Builds; theme system functional; switching works; dark mode works.
**Anti:** No custom theme engine; CSS variables only.

---

#### F.38 Configuration System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 16h | **Deps:** None

**Related Research:** Configuration patterns, config validation, site.config.ts

**Objective:** Configuration system with validation, type safety, and runtime configuration.

**Files:** `packages/infrastructure/config/` (index, validation.ts, types.ts, runtime.ts, hooks.ts)

**API:** `useConfig`, `ConfigProvider`, `validateConfig`, `ConfigUtils`, `createConfig`

**Checklist:** Config validation; type safety; runtime config; hooks; export.
**Done:** Builds; config system functional; validation works; type safety works.
**Anti:** No custom config engine; Zod + TypeScript only.

---

#### F.39 Plugin System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** F.1, F.38

**Related Research:** Plugin patterns, extensibility

**Objective:** Plugin system for extending functionality with plugins and middleware.

**Files:** `packages/infrastructure/plugin/` (index, plugins.ts, middleware.ts, hooks.ts, registry.ts)

**API:** `usePlugin`, `PluginProvider`, `registerPlugin`, `PluginRegistry`, `PluginUtils`

**Checklist:** Plugin registry; middleware; hooks; export.
**Done:** Builds; plugin system functional; plugins work; middleware works.
**Anti:** No custom plugin engine; standard plugin pattern only.

---

#### F.40 Extension System

**Status:** [ ] TODO | **Batch:** Infrastructure | **Effort:** 20h | **Deps:** F.39

**Related Research:** Extension patterns, extensibility

**Objective:** Extension system for runtime extensions and feature flags.

**Files:** `packages/infrastructure/extension/` (index, extensions.ts, feature-flags.ts, hooks.ts, registry.ts)

**API:** `useExtension`, `ExtensionProvider`, `registerExtension`, `ExtensionRegistry`, `useFeatureFlag`

**Checklist:** Extension registry; feature flags; hooks; export.
**Done:** Builds; extension system functional; extensions work; feature flags work.
**Anti:** No custom extension engine; standard extension pattern only.

---

### Page Templates (3.1–3.8)

#### 3.1 Create Page-Templates Registry and Package Scaffold

**Status:** [ ] TODO | **Batch:** C | **Effort:** 3h | **Deps:** None

**Related Research:** §2.1 (Templates), §3.1 (React 19), §8 (AOS)

**Objective:** Registry (Map), SectionProps, TemplateConfig, composePage. No switch-based section selection. L3.

**Files:** `packages/page-templates/src/registry.ts`, `types.ts`, `index.ts`, `templates/` (empty)

**API:** `sectionRegistry`, `SectionProps`, `TemplateConfig`, `composePage(config, siteConfig)`

**Checklist:** registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.
**Done:** Registry exists; composePage works with stubs; 3.2 can add HomePageTemplate.
**Anti:** No CMS section definitions; config from siteConfig only.

---

#### 3.2 HomePageTemplate | 3.3 ServicesPageTemplate | 3.4 AboutPageTemplate | 3.5 ContactPageTemplate | 3.6 BlogIndexTemplate | 3.7 BlogPostTemplate | 3.8 BookingPageTemplate

**Status:** [ ] TODO each | **Batch:** C | **Deps:** 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)

**Related Research:** §2.1, §3.1, §8.2

**Objective:** Each template reads siteConfig.pages.<page>.sections, renders composePage. Registers sections in registry.

**Checklist:** Register sections; create Template.tsx; use composePage; export.
**Done:** Template renders; config-driven sections.
**Anti:** No hardcoded industry content; all from config.

---

### Integrations (4.1–4.6)

#### 4.1 Email Marketing Integrations

**Status:** [ ] TODO | **Batch:** F | **Effort:** 6h | **Deps:** None

**Related Research:** §4.1 (Security, OAuth 2.1), §7.1 (Retry patterns)

**Objective:** EmailAdapter interface. Mailchimp, SendGrid, ConvertKit. Retry(3) + timeout(10s). OAuth 2.1 PKCE optional.

**Files:** `packages/integrations/email/contract.ts`, `mailchimp.ts`, `sendgrid.ts`, `convertkit.ts`, `index.ts`

**API:** `EmailAdapter { subscribe, health }`, `createMailchimpAdapter`, etc.

**Checklist:** 4.1a contract; 4.1b–d providers; export; tests.
**Done:** Adapters implement interface; subscribe works.
**Anti:** No double opt-in; stop at 3 providers.

---

#### 4.2 Scheduling | 4.3 Chat | 4.4 Review Platform | 4.5 Maps | 4.6 Industry Schemas

**Status:** [ ] TODO each | **Batch:** F | **Deps:** None (4.4 feeds 2.16)

**Related Research:** §4.1 (TCF v2.3, consent), §4.2 (WebP, edge), §6 (Industry schemas)

**Objective:** Adapter contracts. Calendly/Acuity/Cal.com; Intercom/Crisp/Tidio; Google/Yelp/Trustpilot; Google Maps (static + interactive); JSON-LD generators per industry.

**Checklist:** Contract first; adapters; export; consent gate where needed.
**Done:** Adapters work; schemas generate valid JSON-LD.
**Anti:** No calendar sync (4.2); no review response (4.4); limit 12 industries (4.6).

---

### Client Factory (5.1–5.6)

#### 5.1 Create Starter-Template in clients/

**Status:** [ ] TODO | **Batch:** — | **Effort:** 6h | **Deps:** 3.1, 3.2, 3.3, 3.5, 3.8

**Related Research:** §3.1 (Next.js, RSC), §4.2 (Performance), §8.2 (Site Composer)

**Objective:** Thin Next.js shell. Routes: home, about, services, contact, blog, book. site.config.ts ONLY file client changes. L3.

**Files:** `clients/starter-template/` — package.json, next.config, app/layout.tsx, app/page.tsx, app/about/page.tsx, etc., site.config.ts, api/health/route.ts

**Checklist:** 5.1a layout (ThemeInjector, providers); 5.1b routes; 5.1c site.config + README; api/health; validate-client when 6.10a exists.
**Done:** Builds; all routes render; siteConfig-only customization.
**Anti:** No CMS; no custom API beyond health/OG; config drives all.

---

#### 5.2 Luxe-Salon | 5.3 Bistro-Central | 5.4 Chen-Law | 5.5 Sunrise-Dental | 5.6 Urban-Outfitters

**Status:** [ ] TODO each | **Batch:** D | **Deps:** 5.1

**Related Research:** §6 (Industry: salons, restaurants, legal, medical, retail)

**Objective:** Copy starter-template → clients/<name>. Edit site.config.ts only. Industry, conversionFlow, layout options.

**Checklist:** Copy; edit site.config (industry, features); validate-client; build; smoke.
**Done:** Client builds; config-driven; no custom components.
**Anti:** No custom components; config only.

---

### Cleanup & Documentation (6.1–6.10)

#### 6.1 Migrate Template Content

**Status:** [ ] TODO | **Effort:** 4h | **Deps:** 5.1, 2.1–2.10

**Objective:** Move reusable hair-salon components to @repo/marketing-components. Define reusability rubric. docs/reusability-rubric.md.

**Checklist:** Update templates/hair-salon imports; create rubric (config-driven, no industry logic).
**Anti:** Only components matching marketing-components API.

---

#### 6.2 Create Migration Guide | 6.2a Update clients/README

**Status:** [ ] TODO | **Deps:** 5.1

**Objective:** docs/migration/template-to-client.md. clients/README.md for CaCA, starter as golden path, remove templates/shared refs.

---

#### 6.3 Remove Templates Directory

**Status:** [ ] TODO | **Deps:** 6.1, 5.2–5.6

**Objective:** Delete templates/ after migration matrix sign-off. grep for refs = 0.

**Anti:** Do not delete until migration complete; rollback = git revert.

---

#### 6.4 Component Library Documentation | 6.5 Configuration Reference | 6.6 Feature Documentation | 6.7 Architecture Decision Records

**Status:** [ ] TODO each | **Batch:** H | **Deps:** Components/features complete

**Objective:** Storybook or docs/; site.config reference; per-feature guides; ADRs.

---

#### 6.8 Create CLI Tooling | 6.9 Remove Dead Code | 6.10a validate-client | 6.10b health-check | 6.10c program:wave\*

**Status:** [ ] TODO each | **Batch:** G (6.10) | **Deps:** 6.3 (6.8), 6.1+6.3 (6.9), 5.1 (6.10a)

**Objective:** pnpm create-client, validate-config, generate-component; knip/depcheck; validate-client script; pnpm health; program:wave0–wave3 scripts.

**CLI:** `pnpm validate-client [path]`, `pnpm health`, `pnpm program:wave0` etc. Exit 0/1.

---

### Governance (C.1–C.18, D.1–D.8)

#### C.1–C.18, D.1–D.8

**Status:** [ ] TODO each | **Batch:** I

**Summary:** C.1 dep graph check; C.2 pnpm policy; C.3 Turborepo remote cache; C.4 release strategy; C.5 design tokens; C.6 motion; C.7 Storybook; C.8 A/B + flags; C.9 personalization; C.10 CMS abstraction; C.11 i18n/RTL; C.12 event taxonomy; C.13 security; C.14 SLOs; C.15 spec-driven; C.16 AI playbooks; C.17 compliance packs; C.18 edge routing. D.1 schema governance; D.2 experiment stats; D.3 editorial workflow; D.4 tenant ops; D.5 incident mgmt; D.6 a11y gates; D.7 ownership matrix; D.8 supply chain.

**Related Research:** Part 2 §1 (Monorepo), §4 (Security), §5 (Methodologies), §7 (Workflow), §8 (AOS).

---

### Innovation & Future (E.1–E.7, F.1–F.12, Phase 7+)

**Status:** [ ] TODO (deferred to LATER)

**Summary:** E: Perceived performance, conversion blueprints, error-budget gate, golden paths, PR/FAQ, progressive UX, queue governance. F: Preflight, Cynefin, leverage scoring, peak-end, framing experiments, participatory personalization, wayfinding, SPC, mission-command, Kanban, knowledge-conversion, service recovery. Phase 7+: AI Content Engine, LLM Gateway, Agent Orchestration, Visual Page Builder, DAM, Campaign Orchestration, Advanced Multi-Tenancy.

**Related Research:** Part 2 §9 (Emerging Tech), §8 (AOS future layers).

---

## Part 5: Reference

### Code Patterns

**Component Pattern (Radix + CVA):** Import from `radix-ui` (unified package). Use `cva` for variants. `cn` from @repo/utils. `forwardRef` pattern. See `packages/ui/src/components/Dialog.tsx`, `Button.tsx`.

**Metaheader Template:** File path, TRACE, Purpose, Exports, Used by, Invariants, Status, Features tags.

**Package.json Template:** name `@repo/<pkg>`, workspace deps, peer react/react-dom catalog:, exports, scripts lint/type-check.

**Feature Package Structure:** `index.ts` exports Form, schema, actions, providers. Schema in lib/schema, actions in lib/actions.

### File Reference Guide

| Area           | Files                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| UI Components  | `packages/ui/src/components/Button.tsx`, `Input.tsx`, `Accordion.tsx`, `Dialog.tsx`               |
| Configuration  | `packages/types/src/site-config.ts`, `templates/hair-salon/site.config.ts`, `pnpm-workspace.yaml` |
| Features       | `packages/features/src/` (booking, contact, blog, services, search)                               |
| Env Validation | `packages/infra/env/schemas/` (7 Zod schemas)                                                     |
| Security       | `packages/infra/security/csp.ts`                                                                  |
| Package Setup  | `packages/ui/package.json`, `packages/infra/package.json`                                         |

### Radix UI (Unified Package)

Use `radix-ui` (unified). Import: `import { Dialog, Tabs, Popover } from 'radix-ui'`. Sonner for Toast (separate). No @radix-ui/react-\* individual packages.

### Scripted Execution (Planned)

```bash
pnpm program:wave0   # repo integrity
pnpm program:wave1   # feature extraction + parity
pnpm program:wave2   # template assembly
pnpm program:wave3   # starter/client verification
pnpm health          # lint + type-check + build + test
pnpm validate-client [path]  # config + routes + build smoke
```

### Quick Commands

```bash
pnpm install
pnpm --filter @repo/ui add <pkg>
pnpm -r run build
pnpm --filter "...[origin/main]" run build
pnpm turbo lint type-check test build
```

### Program Cadence

- **Daily:** WIP limit 1 in-progress per lane
- **Twice weekly:** Unblock + dependency review
- **Weekly:** Ship from completed NOW only; defer NEXT/LATER unless blocking

### Success Criteria (End of Week 12)

- No templates directory
- At least 5 example clients
- All features in packages/features/
- 20+ components (14 UI + 10 marketing + variants)
- Configuration-driven (site.config.ts only)
- Documentation complete
- pnpm build && pnpm test green
- CWV: LCP < 2.5s, INP < 200ms, CLS < 0.1

### Missing Research & Analysis Gaps

- Comprehensive API Documentation
- Migration Playbooks
- Performance Benchmarking Suite (Lighthouse CI)
- Security Hardening Guide
- Multi-tenant Architecture Patterns
- Edge Computing Implementation Guide
- i18n Strategy
- Bundle Size Analysis
- Dependency Security Audit
- Local Development Environment (Docker)
- A/B Testing Framework
- Monitoring & Alerting
- Competitive Analysis
- _(Full list retained from TODO.md — 80+ items across Documentation, Technical Debt, Developer Experience, Business Features, Infrastructure, Innovation)_

---

## Part 6: Strategic Enhancements & Future Roadmap

**Date:** February 18, 2026  
**Purpose:** Research-backed enhancements to evolve the platform from feature-rich to industry-defining. Five pillars: Intelligent Content & Discovery, Privacy & Sustainability, DevEx as Product, Real-Time Adaptation, Future-Proof Architecture.

### Executive Summary

Platform foundation is robust: layered architecture, CaCA, React 19, RSC-first, comprehensive governance. Enhancements focus on:

1. **Intelligent Content & Discovery** — AEO, digital twins, intent marketplaces
2. **Privacy & Sustainability as Competitive Advantages** — consent lifecycle, W3C WSG
3. **Developer Experience (DevEx) as Product** — platform intelligence, golden paths ROI
4. **Real-Time Adaptation & Feedback Loops** — edge personalization, signal-based optimization
5. **Future-Proof Architecture** — everything-as-code, Feature-Sliced Design, Git-based CMS

Each enhancement maps to existing tasks with concrete steps, file paths, and integration points.

---

### 6.1 Intelligent Content & Discovery: AEO & Zero-Click Era

Shift from SEO to Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO). Platform must become the definitive source of answers for AI agents.

#### 6.1.1 Evolve Industry Schemas into AEO Engine (Refine 4.6)

**Current:** `packages/industry-schemas/` generates static JSON-LD.  
**Target:** Dynamic knowledge graph for AI agents (Google SGE, ChatGPT, Perplexity, voice assistants).

| Step | Implementation                                       | Files                                                                                                     |
| ---- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1    | Add `SpeakableSpecification` for blog, services, FAQ | `packages/industry-schemas/src/schemas/speakable.ts`; extend `generateArticleSchema`, `generateFAQSchema` |
| 2    | Build AEO Audit Tool                                 | `scripts/aeo-audit.ts`; integrate with `validate-client.ts` (6.10a); output `docs/aeo/`                   |
| 3    | Entity Authority Building                            | `packages/features/seo/entity-graph.ts` — crawl content, build knowledge graph, enrich schema             |
| 4    | AEO-Pro Compliance Pack                              | C.17 `aeo-pro`: dynamic FAQ from trends, citation building, Knowledge Graph API                           |

#### 6.1.2 Autonomous Content Refresher Agent (Extend 7.3)

| Step | Implementation                                                                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Agent workflow in `packages/ai-platform/agent-orchestration/src/agents/content-optimizer.ts`; subscribes to page views, conversions, rankings |
| 2    | Integrate conversion events (C.12): `content.optimization.suggested`, `content.optimization.applied`, `content.optimization.impact`           |
| 3    | Admin UI in `apps/admin-dashboard` for approve/decline, A/B integration (C.8)                                                                 |

#### 6.1.3 Consumer-Controlled Intent Marketplaces (Future)

| Step | Implementation                                                                  |
| ---- | ------------------------------------------------------------------------------- |
| 1    | New package `packages/intake/intent-receiver` — Webhooks/SSE for intent signals |
| 2    | Extend personalization engine (C.9) with intent-based segments                  |
| 3    | Document in `docs/strategy/intent-marketplaces.md`                              |

---

### 6.2 Privacy & Sustainability as Competitive Advantages

#### 6.2.1 Centralized Consent Lifecycle (Enhance C.13)

**Target:** Auditable consent logs, real-time enforcement, automated subject rights.

| Step | Implementation          | Files                                                                                 |
| ---- | ----------------------- | ------------------------------------------------------------------------------------- |
| 1    | Consent Service         | `packages/infra/consent/`: `service.ts`, `store.ts`, `middleware.ts`                  |
| 2    | Integrate with tracking | Wrap analytics, chat, email adapters: `if (consentService.checkConsent('analytics'))` |
| 3    | SRR Automation          | `scripts/srr-handler.ts` — collect/export/delete user data across packages            |
| 4    | Privacy-Pro Pack (C.17) | Regional consent variants (GDPR, CCPA, LGPD), anonymization, audit reports            |

#### 6.2.2 W3C Web Sustainability Guidelines (WSG)

**Note:** W3C WSG published January 2026. See [w3c.github.io/sustainableweb-wsg](https://w3c.github.io/sustainableweb-wsg/).

| Step | Implementation                 |
| ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Green Code ESLint rules        | `packages/config/eslint-config`: `no-autoplay-video-without-poster`, `prefer-css-animations`, `ensure-image-optimization`; CI gate (C.13) |
| 2    | Sustainable component variants | `HeroVideo.sustainable.tsx`, Gallery variants — AVIF/WebP, deferred JS, CSS transitions                                                   |
| 3    | Docs                           | Storybook "Sustainability Note"; `docs/sustainability/`                                                                                   |
| 4    | CO₂ metrics                    | Extend C.14 with per-page CO₂ estimates; "Green Score" dashboard                                                                          |

---

### 6.3 Developer Experience (DevEx) as Product

#### 6.3.1 Instrument CLI Tools (Enhance 6.8, E.4)

| Step | Implementation              |
| ---- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1    | Anonymous telemetry for CLI | `create-client.ts`, `validate-config.ts` → `packages/telemetry`; command, success/fail, duration (no PII) |
| 2    | CLI Health Dashboard        | `apps/internal-dashboard` — success rates, duration, common errors, feature adoption                      |
| 3    | Friction Alerts             | Slack/email when commands fail frequently or run abnormally long                                          |

#### 6.3.2 Developer Satisfaction Scorecard — SPACE Framework

**Note:** SPACE (Satisfaction, Performance, Activity, Communication, Efficiency) — Microsoft research 2021; multidimensional productivity.

| Step | Implementation   |
| ---- | ---------------- | ---------------------------------------------------------------- |
| 1    | Quarterly survey | `scripts/developer-survey.ts` — SPACE questions; store in DB     |
| 2    | eNPS             | Promoters 9–10, Passives 7–8, Detractors 0–6; trend in dashboard |
| 3    | Correlate        | eNPS vs time-to-market, bugs, adoption — demonstrate ROI         |

#### 6.3.3 Golden Paths to Business ROI (E.4)

| Metric               | Measurement                           |
| -------------------- | ------------------------------------- |
| Time-to-Market       | `create-client` → production launch   |
| Cost of Change       | Spec → merged PR (component update)   |
| Maintenance Overhead | Dependency upgrades, security patches |

Use GitHub API + CI logs; present in quarterly reviews.

---

### 6.4 Real-Time Adaptation & Feedback Loops

#### 6.4.1 Real-Time Feedback Loop Architecture

| Step | Implementation             |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------- |
| 1    | Micro-signals              | Extend C.12: `element.view`, `video.pause`, `form.field.focus` → stream (BullMQ)            |
| 2    | Signal Processor           | `packages/realtime/signal-processor` — consume events, update Redis profiles, trigger rules |
| 3    | Personalization (C.9)      | React to signals (e.g. >30s on pricing → chat offer)                                        |
| 4    | Predictive prefetch (C.18) | Predict next action; prefetch at edge                                                       |

#### 6.4.2 Signal Quality Scoring

| Metric           | Definition                  |
| ---------------- | --------------------------- |
| Predictive power | Correlation with conversion |
| Freshness        | Recency                     |
| Uniqueness       | New information added       |

Add `signalQuality` to user profile; weight personalization rules.

---

### 6.5 Future-Proof Architecture

#### 6.5.1 Everything-as-Code (Extend CaCA)

| Step | Implementation          |
| ---- | ----------------------- | ----------------------------------------------------------------------------------- |
| 1    | Docs in packages        | Per-feature `README.md`, `docs/`; `scripts/build-docs-site.ts` (Docusaurus/Next.js) |
| 2    | Blog as code            | MDX in `content/blog/`; TinaCMS or Git-based editor                                 |
| 3    | Infra in repo           | Terraform/Pulumi in `infrastructure/`; PR process                                   |
| 4    | Unified knowledge graph | AI agents (7.3) access code, docs, content, config, infra                           |

#### 6.5.2 Feature-Sliced Design (FSD)

**Note:** FSD organizes by business domain; [steiger](https://feature-sliced.design/) enforces architecture.

| Step | Implementation    |
| ---- | ----------------- | --------------------------------------------------------- |
| 1    | Refactor features | `booking/{ui,api,model,lib,config}/`; unidirectional flow |
| 2    | Add steiger to CI | Prevent cross-import violations                           |
| 3    | Document          | `docs/architecture/feature-sliced-design.md`              |

#### 6.5.3 Digital Twin Learning Layer (Future Phase)

| Step | Implementation           |
| ---- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| 1    | Data schema              | Anonymized aggregates: page views, conversions, component usage; warehouse (BigQuery/Snowflake) |
| 2    | Insights Engine          | `packages/intelligence/insights-engine` — scheduled pattern detection                           |
| 3    | Auto suggestions         | Create issues/PRs for affected clients                                                          |
| 4    | A/B Testing as a Service | Integrate C.8; deploy winning variants across clients                                           |

---

### 6.6 Strategic Enhancement Roadmap

| Priority                     | Enhancement                       | Existing Task | New Work                                            | Effort |
| ---------------------------- | --------------------------------- | ------------- | --------------------------------------------------- | ------ |
| **Immediate (2 weeks)**      |                                   |               |                                                     |        |
| 1                            | AEO Audit Tool                    | 6.10a         | `scripts/aeo-audit.ts`, validate-client integration | 8h     |
| 2                            | Green Code Linting                | C.13          | Custom ESLint rules                                 | 6h     |
| 3                            | Consent Service MVP               | C.13          | `packages/infra/consent/`, adapter changes          | 16h    |
| 4                            | CLI Telemetry                     | 6.8           | Add telemetry to CLI tools                          | 8h     |
| **Short-Term (3–6 weeks)**   |                                   |               |                                                     |        |
| 5                            | FSD Refactor & Linter             | —             | Refactor features, add steiger to CI                | 20h    |
| 6                            | Developer Satisfaction Scorecard  | E.4           | Survey script, dashboard                            | 12h    |
| 7                            | Sustainability Component Variants | 2.x           | `sustainable` variants                              | 16h    |
| 8                            | Content Refresher Agent MVP       | 7.3           | `content-optimizer` agent                           | 24h    |
| **Medium-Term (7–12 weeks)** |                                   |               |                                                     |        |
| 9                            | Everything-as-Code (Docs, Blog)   | 6.6           | Docs in packages, build docs site                   | 20h    |
| 10                           | SRR Automation                    | C.13          | `scripts/srr-handler.ts`                            | 12h    |
| 11                           | Real-Time Signal Processing       | C.9, C.18     | `signal-processor`, edge integration                | 24h    |
| 12                           | Privacy Pro Compliance Pack       | C.17          | Enhanced consent, anonymization                     | 16h    |
| **Long-Term (Post–Wave 3)**  |                                   |               |                                                     |        |
| 13                           | Digital Twin Insights Engine      | —             | Warehouse, pattern detection                        | 40h    |
| 14                           | Intent Marketplace APIs           | C.9           | `intent-receiver` package                           | 16h    |
| 15                           | A/B Testing as a Service          | C.8           | Integration with insights engine                    | 32h    |

---

## 10. UI Primitives Deep Dive (NEW)

> Applies to `packages/ui`, `packages/features`, and template consumers. Use Radix/Base UI primitives copied into @repo/ui (shadcn pattern) with Tailwind tokens.

### 10.1 Advanced Form Components

| Primitive             | 2026 Patterns                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Command Palette**   | `cmdk` + fuzzy search (Fuse.js/TanStack Match Sorter), <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd> binding, keyboard-only navigation, action registry living beside feature adapters, optimistic optimistic updates for AI actions (LogRocket Linear clone ref, Feb 2026). |
| **Form System**       | React Hook Form 7 + Zod 3 (`@hookform/resolvers/zod`) for field-level validation, `useFormState` for async errors, `useFieldArray` for dynamic blocks, schema-driven form builder for Feature 2.31.                                                           |
| **Date/Time Pickers** | React Aria DatePicker or `react-day-picker@^9` with timezone normalization (Luxon/Temporal polyfill), locale-aware parsing, keyboard grid navigation, screen-reader hints for range selection.                                                                |
| **File Upload**       | `react-dropzone` or Uploady for drag/drop, chunked uploads, pause/resume (Tus), progress events, virus scanning hook (Cloudflare R2/S3).                                                                                                                      |
| **Color Picker**      | `react-colorful` + accessible presets, color-blind safe palettes (WCAG 2.2 contrast), Oklch token export to Tailwind.                                                                                                                                         |

### 10.2 Data Display Components

- **Table**: TanStack Table v8 headless core + TanStack Virtual for 10k+ rows, server-driven pagination/sorting for CMS adapters, row selection synced to Zustand store.
- **Tree View**: Roving tabindex, aria-expanded states, virtualization for deep hierarchies (docs navigation, schema explorer).
- **Timeline / Stepper**: Use CSS Scroll Snap + IntersectionObserver to pin progress, INP-friendly transitions (<100 ms).

### 10.3 Navigation & Layout

- **Breadcrumbs**: JSON-LD `BreadcrumbList`, Next.js `generateMetadata` hook integration, aria-label="breadcrumb".
- **Pagination**: SEO-friendly pattern (Strapi case study) limiting to two clicks from landing page, `rel="prev"/"next"`, canonical URLs.
- **Carousel/Masonry**: Prefers-reduced-motion support, pointer/keyboard controls, CSS masonry via `grid-template-rows: masonry` fallback to JS layout for Safari.

### 10.4 Interaction & Utility

- **Drag & Drop**: `@dnd-kit` sortable contexts, custom collision detection for multi-column marketing layouts, pointer + keyboard sensors.
- **Resizable Panels / Virtual Lists / Infinite Scroll**: TanStack Virtual headless virtualization, suspense-friendly loaders, loader rows for chat-like experiences.
- **Skeleton / Progress / Status**: Component-level performance budgets (skeleton widths mirror final layout), optimistic UI defaults per Part E.6.

### 10.5 Accessibility Guarantees

- Minimum 24×24 px hit targets, focus outlines ≥2px w/ 3:1 contrast, ARIA live regions for alerts/rating updates, `prefers-reduced-motion` fallbacks.

## 11. Marketing Component Patterns (NEW)

> Scope: `packages/marketing-components` (Task 1.7) and downstream template registries. Each family ships registry metadata (variants, industries, metrics) plus analytics hooks.

| Family                                      | Key Research Items                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Navigation Systems**                      | Responsive mega menu (LogRocket 2026): desktop hover panels + mobile drawer (Sheet) with focus trapping, analytics on menu depth, TTL caching of nav config. |
| **Footers**                                 | Multi-column grid, CTA slot, newsletter embed (ConvertKit/Mailchimp), trust badges, legal links (WCAG link contrast).                                        |
| **Blog / Portfolio / Case Studies**         | Pagination with canonical URLs, facet filters, MDX + CMS adapters, lightbox using `next/image` blur placeholders, downloadable PDFs tracked via events.      |
| **Product / E-commerce**                    | Comparison tables, quick-view modals with Suspense streaming, cart badges tied to Zustand store, price localization (Intl.NumberFormat).                     |
| **Event / Location**                        | Calendar sync (ICS), ticket tiers, Mapbox/Google Maps w/ IntersectionObserver lazy loading + WebP tiles, structured data (`Event`, `Place`).                 |
| **Menu (Restaurant)**                       | Dietary/allergen chips, filtering, photo galleries, ordering CTAs hooking into Feature 2.28.                                                                 |
| **Education / Course / Resource**           | Progress meters, curriculum accordions, certificate CTA, download tracking with signed URLs.                                                                 |
| **Jobs / Careers**                          | Search & filters (location, department), ATS webhook integration (Greenhouse/Lever), algorithmic sorting by freshness.                                       |
| **Interactive / Widgets**                   | Quiz/calculator frameworks using Zod validation + optimistic updates, poll results w/ SSE fallback, embedding guardrails (TCF v2.3).                         |
| **Social Proof / Media / Gallery Enhanced** | Logo walls, testimonial sliders, review aggregation (Trustpilot/Yelp quotas), video playlists with transcript sync.                                          |
| **Search / Filter / Comparison**            | Autocomplete w/ semantic ranking, multi-select filter chips, saved filter presets (URL state), comparison matrices with tooltip clarifications.              |

## 12. Feature Implementation Patterns (NEW)

- **Search (2.20)**: AI semantic search pipeline (Encore + OpenAI embeddings + Qdrant) w/ vector cache per client, hybrid keyword reranking, analytics on zero-result queries.
- **Newsletter (2.21)**: ConvertKit/Mailchimp adapters using OAuth 2.1 + PKCE, double opt-in flows, CMP gating before script load, segmentation metadata stored in `features/newsletter`.
- **Chat (2.26)**: Live chat provider abstraction + AI co-pilot; optimistic message queue, typing indicators, ARIA live updates, consent-first SDK loading.
- **Analytics / A/B / Personalization (2.23-2.25)**: Privacy-first trackers (Plausible, Umami, custom warehouse), server actions to enqueue experiments, edge flag resolution (Vercel Edge Config / Cloudflare KV).
- **E-commerce / Payment / Reviews (2.28-2.32)**: Headless commerce connectors (Shopify Storefront API, Commerce.js), PCI-scoped webhook relays, review ingestion with moderation queue.
- **Automation / Webhook / Integration (2.44-2.46)**: Durable workflows (Temporal/Trigger.dev) for CRM sync, signed webhook verification (Stripe-style), retry/backoff policies.
- **Security / Monitoring / Performance (2.38-2.40)**: SLO dashboards, INP monitors, synthetic checks via Playwright, CSP/report-to endpoints.

Each feature spec includes: adapter interfaces (`packages/features/src/*/adapters`), server action contract, analytics taxonomy, performance budget (component + endpoint), regression tests (Vitest + Playwright).

## 13. Infrastructure Systems Research (NEW)

| System                                            | 2026 Guidance                                                                                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slot / Render Prop / Provider Systems**         | Slot-based composition for page templates (named slots w/ TypeScript generics), render-prop fallbacks for legacy clients, provider tree optimizer (Context memoization + React Compiler hints). |
| **Variant / Theme / Style**                       | CVA for variants, Design Token pipeline (DTCG v1.0) exporting to Tailwind v4 + CSS vars, multi-brand theming with CSS cascade layers.                                                           |
| **Layout / Grid / Responsive / Spacing**          | Container queries (`@container`), logical properties for RTL, spacing scales tied to tokens, `packages/config/tailwind-theme.css`.                                                              |
| **Typography / Color / Shadow / Border**          | Variable fonts (Inter Variable fallback), display-P3 colors, shadow elevation levels, border radius matrices per brand.                                                                         |
| **Media / Icon / Image**                          | Lucide icon registry, Next.js Image CDN presets, video streaming via Mux/site CDN, audio waveform visualizers.                                                                                  |
| **State / Form / Validation**                     | Zustand slices per feature; Jotai for fine-grained states (e.g., Command Palette), Zod schemas shared between server actions + client forms.                                                    |
| **Error / Loading / Accessibility**               | Error boundaries per route group, Suspense skeleton registry, accessibility checklist automation (axe-core CI).                                                                                 |
| **Performance / Testing / Documentation**         | Performance budgets enforced via `scripts/validate-performance.ts`, Vitest component suites, Playwright smoke tests, Storybook/MDX docs.                                                        |
| **Development / Build / Deployment / Monitoring** | Turborepo pipelines w/ remote cache, Next.js partial prerendering, Skott for dependency graphs (C.1), Sentry/Datadog instrumentation, IaC via Terraform modules.                                |
| **Configuration / Plugin / Extension**            | Zod-validated config loader, plugin architecture for feature packs (e.g., industries), feature-flag SDK (LaunchDarkly, Statsig) wrapping edge middleware.                                       |

## 14. Advanced Component Patterns

1. **Animation & Motion**: Framer Motion 11 presets, reduced-motion guards, Activity component gating expensive renders.
2. **Composition**: Compound components with context selectors, controlled/uncontrolled hybrids for Select/Combobox.
3. **Performance**: Code-splitting via `next/dynamic`, React Compiler auto-memoization adoption, virtualization checklists.
4. **Accessibility**: ARIA live regions, roving tabindex utilities, Escape key + inert overlays for sheets/menus.

## 15. Industry-Specific Research Expansion

- **Fitness & Wellness**: Class schedulers (Calendly/Mindbody adapters), progress dashboards, FitnessCenter schema, trainer bios.
- **Real Estate**: MLS ingestion, mortgage calculators, 3D tour embeds, RealEstateAgent + Offer schemas.
- **Construction & Trades**: Project timelines, license verification banners, service area maps, integration with Jobber/ServiceTitan.
- **Education & Training**: Course catalogs, instructor credentials, SCORM/LMS webhooks.
- **Healthcare & Medical**: HIPAA-safe contact forms (BAA storage), telehealth CTAs, schema for MedicalProcedure, location-based provider filters.
- **Non-Profit & Organizations**: Donation widgets (Stripe Giving, GiveWP), volunteer CRM sync, impact metrics showcases.
- **Technology & SaaS**: Product tour components, ROI calculators, API docs teasers, SOC2/compliance trust stamps.

## 16. Emerging Technologies & Advanced Patterns

1. **AI Integration**: Multi-provider LLM orchestration (Vercel AI SDK router) with fallback tiers, Retrieval-Augmented Generation for search/personalization, cost telemetry per tenant.
2. **Edge Computing**: Vercel Edge Functions / Cloudflare Workers for personalization, edge A/B tests, predictive prefetchers using Network Information API.
3. **WebAssembly**: Wasm modules for image processing (Squoosh pipeline), crypto, heavy analytics, loaded via dynamic import with feature detection.
4. **PWA**: Workbox recipes for offline caching, background sync for forms, push notifications gated by CMP.
5. **Web Components & Micro Frontends**: Module Federation for vendor widgets, custom elements bridging to Next.js via `use client` wrappers.
6. **Real-Time Tech**: WebSockets (Socket.IO), Server-Sent Events for analytics dashboards, GraphQL subscriptions for booking availability.
7. **Advanced Performance**: Resource hints (preload/prefetch), HTTP/3 adoption, streaming server components with Suspense boundaries.

## 17. Security & Privacy Advanced

- **Authentication**: OAuth 2.1 + PKCE, OIDC clients, passkey/passwordless options, biometric fallbacks on mobile.
- **Authorization**: RBAC/ABAC policies via `@repo/infra/authz`, policy-as-code (Cedar/Oso) for tenant isolation.
- **API Security**: HMAC-signed webhooks, rate limiting via edge middleware, schema validation for inbound payloads.
- **Privacy Compliance**: GDPR/CCPA/LGPD checklists, CMP integration (TCF v2.3), consent-first third-party embeds, data deletion workflows.
- **Security Monitoring**: SIEM integrations, dependency scanning (GitHub Advanced Security/OWASP Dependency-Track), threat modeling playbooks.

## 18. Testing & Quality Assurance

| Layer                 | Tooling & Patterns                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Unit / Component**  | Vitest + React Testing Library, MSW for network stubs, Storybook interaction tests.                         |
| **Integration**       | Playwright component tests (experimental) + Next.js app router harness, contract tests for adapters (Pact). |
| **E2E**               | Playwright/Cypress suites per template, Lighthouse CI for performance budgets, synthetic user journeys.     |
| **Visual Regression** | Chromatic/Applitools with UI tokens, gating merges for marketing components.                                |
| **Accessibility**     | axe-core CI, manual screen-reader checklists, focus management tests.                                       |
| **Performance**       | WebPageTest + Lighthouse, Next.js `next/script` timings, custom INP logger.                                 |

## 19. Deployment & DevOps Advanced

- **Strategies**: Blue/green + canary on Vercel/Netlify, feature flags for progressive delivery, rollback scripts.
- **CI/CD**: Turborepo pipeline stages (lint → test → build → deploy), remote cache, selective package builds via `turbo run build --filter`.
- **Observability**: OpenTelemetry tracing, Datadog/Sentry/LogRocket for errors + INP, dashboards per client.
- **IaC / Containers**: Terraform modules for shared infra, Dockerized preview environments, container security scans, edge config automation.

## 20. Documentation & Developer Experience

- **Docs**: MDX handbooks per package, Docusaurus or Next.js docs site fed by `scripts/build-docs-site.ts`, auto-generated prop tables via TS compiler API.
- **DevEx**: pnpm workspace scripts (`pnpm new:feature`), scaffolding templates, internal developer portal (Backstage) tracking golden paths + DX Core metrics.

---

## Part 3: Architecture & Execution — Expanded

### 3.1 Package Dependency Graph

- Adopt Skott for graph generation (`scripts/analyze-deps.ts`) covering new UI primitives, marketing families, features, and infra systems.
- Enforce layered graph: config → utils → ui → features → marketing-components → page-templates → clients; integrations shared at L0.

### 3.2 Implementation Patterns Reference

- Provide code samples for Adapter, Factory, Strategy, Observer, Composition patterns in `docs/architecture/patterns.md` referencing current packages.
- Tag each feature task with required pattern(s) to speed onboarding.

### 3.3 Testing Strategy

- Testing pyramid per package (unit 60%, integration 30%, e2e 10%), coverage gates in CI, shared fixtures in `packages/test-utils`.

### 3.4 Performance Budgets

- Component budgets (e.g., hero <40 KB JS), feature-level budgets (Search <120 KB), page budgets (<250 KB JS gz). Track via Lighthouse CI + custom `scripts/check-bundlesize.ts`.

### 3.5 Accessibility Standards

- WCAG 2.2 AA checklist template, component-level a11y specs, keyboard navigation requirements, screen-reader smoke tests recorded in Playwright.

---

_Consolidated from TODO.md, RESEARCH_ENHANCED.md, docs/task-specs/, RESEARCH_GAPS.md analysis, and Strategic Enhancement Report — February 18, 2026_
