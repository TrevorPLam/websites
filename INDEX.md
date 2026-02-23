# Marketing Websites Monorepo - AI Navigation Index

> **AI-Optimized Repository Overview** | Last Updated: 2026-02-23  
> **Architecture**: Multi-tenant Next.js 16 + Feature-Sliced Design v2.1  
> **Scale**: 1000+ client sites, 36 domains, 285+ implementation files

---

## 🧭 AI Agent Navigation Guide

### **Cold Start Context Loading**

1. **Read**: `AGENTS.md` (master context - 53 lines)
2. **Read**: `CLAUDE.md` (sub-agent definitions - 31 lines)
3. **Read**: `docs/plan/PLANINDEX.md` (complete domain inventory)
4. **Check**: `TODO.md` (current task status)
5. **Verify**: Current branch and uncommitted changes

---

## 📁 Repository Architecture

### **Core Applications** (`apps/`)

```
apps/
├── admin/          # Super admin interface
├── portal/         # Client portal
└── web/           # Main marketing site
```

### **Client Sites** (`clients/`)

```
clients/
└── testing-not-a-client/    # Reference implementation
    ├── app/                 # Next.js app structure
    ├── content/             # Site content
    ├── site.config.ts       # Domain 2 configuration schema
    └── package.json         # Client dependencies
```

### **Shared Packages** (`packages/`)

```
packages/
├── config/                 # Build tooling configurations
│   ├── eslint-config/      # ESLint rules
│   ├── typescript-config/  # TypeScript configs
│   └── vitest-config/      # Test configuration
├── config-schema/          # Domain 2: Zod validation schemas
├── feature-flags/          # Feature flag management
├── features/               # Domain 3: FSD business logic
│   └── src/
│       ├── authentication/  # Auth flows
│       ├── booking/        # Booking system
│       ├── payment/        # Payment processing
│       ├── analytics/      # Analytics tracking
│       └── [20+ feature modules]
├── infra/                  # Infrastructure & security
│   ├── security/           # Security utilities
│   ├── middleware/         # Next.js middleware
│   ├── logger/            # Logging system
│   └── sentry/            # Error tracking
├── integrations/           # Third-party service adapters
│   ├── supabase/          # Database client
│   ├── convertkit/        # Email marketing
│   ├── google-maps/       # Maps integration
│   ├── scheduling/        # Cal.com integration
│   └── [8+ service adapters]
├── marketing-components/   # UI components for marketing
├── page-templates/        # Next.js page templates
├── ui/                    # Base UI component library
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── test-utils/            # Testing utilities
```

### **Development Tooling** (`tooling/`)

```
tooling/
├── create-client/          # Client site generator
├── create-site/           # Site creation CLI
├── generate-component/    # Component generator
└── validation/           # Configuration validation
```

---

## 📋 Planning & Task Management

### **Domain Planning** (`docs/plan/`)

```
docs/plan/
├── PLANINDEX.md           # Master domain inventory (998 lines)
├── README.md              # Planning overview
└── domain-[1-36]/         # 36 implementation domains
    ├── README.md          # Domain overview
    └── [task files].md    # Implementation tasks
```

**Domain Status Overview**:

- **✅ Complete (8/36)**: Domains 1-5 (Foundation)
- **🔄 Pending (28/36)**: Domains 6-36 (Advanced + Enterprise)

### **Task Execution** (`tasks/`)

```
tasks/
├── template.md            # Task template (11K lines)
├── RESEARCH-INVENTORY.md  # Research tracking
└── domain-[1-36]/         # Executable task files
```

**Task Completion**: 36/235 tasks completed (15%)

---

## 🤖 AI Orchestration System

### **Agent Coordination**

```
├── AGENTS.md              # Master AI context (53 lines)
├── CLAUDE.md              # Sub-agent definitions (31 lines)
├── MULTI-AGENT-GAME-PLAN.md  # Orchestration strategy
└── OPTIMIZATION-PLAN.md   # Execution optimization
```

### **Automation Scripts** (`scripts/`)

```
scripts/
├── batch-generate-docs.js     # Documentation automation
├── multi-agent-task-generator.js  # Task creation
├── domain-analysis-optimizer.js  # Domain analysis
├── validate-*.js               # Validation scripts
├── batch-*.js                  # Batch processing
└── [60+ automation scripts]
```

### **Execution Tracking**

```
├── TODO.md                    # Task status tracker (41K lines)
├── final-execution-report.json  # Latest execution results
├── execution-report*.json     # Historical reports
└── docs/testing-infrastructure-report.md  # Test setup
```

---

## 🔧 Development Infrastructure

### **CI/CD Pipeline** (`.github/workflows/`)

```
.github/workflows/
├── ci.yml                    # Main CI pipeline
├── dependency-integrity.yml  # Security scanning
├── docs-validation.yml       # Documentation checks
├── performance-audit.yml     # Performance testing
├── security-sast.yml         # Security scanning
├── sbom-generation.yml       # Supply chain security
└── [12 workflow files]
```

### **Configuration Files**

```
├── package.json              # Workspace configuration
├── pnpm-workspace.yaml       # pnpm workspace setup
├── turbo.json               # Build orchestration
├── tsconfig.base.json       # TypeScript base config
├── vitest.config.ts         # Test configuration
├── steiger.config.ts        # FSD linting
└── [20+ config files]
```

### **Database & Infrastructure**

```
├── supabase/
│   └── migrations/          # Database migrations
├── docker-compose.yml       # Development environment
├── docker-compose.test.yml  # Test environment
└── .env.example            # Environment template
```

---

## 📚 Documentation System

### **Guides & Reference** (`docs/guides/`)

```
docs/guides/
├── 0000.md                 # Master guide index (37K lines)
├── ADDTHESE.md             # Auto-generated content (37K lines)
├── [categories]/
│   ├── accessibility-legal/     # WCAG & compliance
│   ├── ai-automation/           # AI integration
│   ├── architecture/            # System architecture
│   ├── backend-data/            # Database & APIs
│   ├── build-monorepo/          # Build system
│   ├── frontend/                # Frontend development
│   ├── infrastructure-devops/    # DevOps & infrastructure
│   ├── payments-billing/        # Payment systems
│   ├── security/                # Security patterns
│   ├── seo-metadata/            # SEO optimization
│   ├── standards-specs/          # Technical standards
│   ├── testing/                 # Testing strategies
│   └── uncategorized/           # [20+ miscellaneous guides]
└── qa-reports/            # Quality assurance reports
```

**Documentation Coverage**: 44/84 documents (52% complete)

---

## 🧪 Testing Infrastructure

### **Test Setup**

```
├── jest.config.js          # Jest configuration
├── jest.setup.js          # Test setup
├── vitest.config.ts       # Vitest configuration
├── packages/test-utils/   # Shared test utilities
└── e2e/tests/            # End-to-end tests
```

### **Test Environment**

```
├── docker-compose.test.yml  # Test database setup
├── test-db-init.sql        # Test data initialization
└── packages/*/src/__tests__/  # Unit tests per package
```

---

## 📊 Key Metrics & Status

### **Repository Scale**

- **Packages**: 47 workspace packages
- **Domains**: 36 planned implementation domains
- **Tasks**: 235 total tasks (36 completed)
- **Documentation**: 44 guides completed
- **Test Coverage**: 100% test success rate (780/780 tests)

### **AI Orchestration**

- **Automation Scripts**: 65+ scripts for task generation and validation
- **Documentation Generation**: 21 docs generated via automation
- **Multi-Agent Coordination**: 5 specialized AI agents
- **Execution Reports**: Comprehensive JSON tracking

### **Security Status**

- **Risk Classification**: Medium (Critical issues resolved)
- **Dependencies**: Zero vulnerabilities (pnpm audit)
- **Multi-tenant Isolation**: Complete RLS implementation
- **Authentication**: OAuth 2.1 + PKCE compliant

---

## 🎯 AI Agent Quick Reference

### **Critical Files for Context**

1. `AGENTS.md` - Repository overview and rules (53 lines)
2. `docs/plan/PLANINDEX.md` - Complete domain inventory (998 lines)
3. `TODO.md` - Current task status and progress
4. `CLAUDE.md` - Sub-agent definitions (31 lines)

### **Domain Implementation Order**

```
Phase 1 (P0): Domains 1-5  ✅ COMPLETE
Phase 2 (P1): Domains 6-19  🔄 IN PROGRESS
Phase 3 (P2): Domains 20-36 ⏳ PENDING
```

### **Common Commands**

```bash
pnpm lint                  # Lint all packages
pnpm test                  # Run all tests
pnpm validate:configs     # Validate configurations
pnpm validate-docs        # Validate documentation
```

### **Package Navigation Patterns**

- **Features**: `packages/features/src/[feature]/`
- **Integrations**: `packages/integrations/[service]/`
- **Infrastructure**: `packages/infra/src/[category]/`
- **UI Components**: `packages/ui/src/[component]/`

---

## 🔍 Search Patterns for AI Agents

### **Finding Implementation Details**

- **Domain Tasks**: `tasks/domain-{number}/`
- **Package Info**: `packages/{package}/AGENTS.md`
- **Configuration**: `packages/config-schema/`
- **Security**: `packages/infra/src/security/`

### **Finding Documentation**

- **Master Index**: `docs/guides/0000.md`
- **Domain Plans**: `docs/plan/domain-{number}/`
- **QA Reports**: `docs/qa-reports/`
- **Architecture**: `docs/architecture/`

### **Finding Automation**

- **Task Generation**: `scripts/multi-agent-task-generator.js`
- **Documentation**: `scripts/batch-generate-docs.js`
- **Validation**: `scripts/validate-*.js`
- **Execution Reports**: `*-execution-report.json`

---

## 📈 Development Workflow Integration

### **For Feature Development**

1. Check `docs/plan/domain-{relevant}/` for implementation details
2. Reference `packages/features/src/[feature]/` for existing patterns
3. Use `packages/test-utils/` for consistent testing
4. Follow FSD layer structure from Domain 3

### **For Package Development**

1. Read `packages/{package}/AGENTS.md` for package context
2. Follow export patterns from existing packages
3. Use `packages/config/` for build configuration
4. Test with `packages/test-utils/` utilities

### **For Infrastructure Changes**

1. Reference `packages/infra/` for existing patterns
2. Check `docs/plan/domain-4/` for security requirements
3. Update CI/CD in `.github/workflows/`
4. Test with `docker-compose.test.yml`

---

_This index is optimized for AI agent navigation and is automatically updated as part of the documentation generation workflow._
