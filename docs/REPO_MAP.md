# Repository Map

> Last Updated: 2026-01-03  
> Canonical Status: Canonical  
> Purpose: High-level overview of repository structure and file organization

## 📁 Repository Structure

```
Your-Dedicated-Marketer/
├── app/                     # Next.js 14 App Router pages
│   ├── about/              # About page
│   ├── api/                # API routes (contact form, etc.)
│   ├── blog/               # Blog pages and MDX rendering
│   ├── case-studies/       # Case study pages
│   ├── contact/            # Contact form page
│   ├── pricing/            # Pricing page
│   ├── services/           # Service pages (SEO, content, social, email)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
│
├── components/             # React components
│   └── ui/                 # Reusable UI components
│
├── content/                # Content files
│   └── blog/               # MDX blog posts
│
├── lib/                    # Utility libraries
│   ├── logger.ts           # Logging utilities
│   └── email.ts            # Email utilities (Resend integration)
│
├── public/                 # Static assets
│   └── images/             # Image assets
│
├── __tests__/              # Unit tests (Vitest)
│   ├── components/         # Component tests
│   └── lib/                # Library tests
│
├── tests/                  # End-to-end tests
│   └── e2e/                # Playwright E2E tests
│
└── docs/                   # Documentation (organized by category)
    ├── architecture/       # Architecture and design docs
    ├── product/            # Product and planning docs
    ├── ops/                # Operations and deployment docs
    ├── workflows/          # Workflow and process docs
    ├── ARCHIVE/            # Deprecated documentation
    ├── DOCS_INDEX.md       # Documentation navigation hub
    ├── REPO_MAP.md         # This file
    ├── GAME-PLAN-100.md    # Strategic planning
    ├── PWA-ICONS.md        # PWA icon specifications
    └── SENTRY-SETUP.md     # Sentry configuration
```

## 📄 Root Level Documentation

Control plane and essential operator docs (see [DOCS_ROOT.md](../DOCS_ROOT.md) for governance):

- **README.md** - Project overview and getting started
- **DOCS_ROOT.md** - Documentation organization rules
- **CODE_AUDIT.md** - Code audit pipeline
- **TODO.md** - Current tasks and priorities
- **CHANGELOG.md** - Version history
- **DECISIONS.md** - Architectural decisions
- **SECURITY.md** - Security policy
- **SECURITY_REVIEW.md** - Security review procedures
- **DEPENDENCY_HEALTH.md** - Dependency management
- **RELEASE_CHECKLIST.md** - Release procedures

## 🗂️ Documentation Categories

### `/docs/architecture/`
Technical architecture, system design, and component specifications:
- CODEBASE-ANALYSIS.md - Technical architecture overview
- COMPONENT-SPECS.md - Component specifications
- DESIGN-SYSTEM.md - Design system documentation

### `/docs/product/`
Product strategy, planning, and service definitions:
- SERVICES.md - Service catalog
- CONTENT-STRATEGY.md - Content strategy
- DEVELOPMENT-ROADMAP.md - Product roadmap

### `/docs/ops/`
Operations, deployment, and maintenance:
- DEPLOYMENT.md - Deployment procedures
- IMPROVEMENTS-SUMMARY.md - System improvements and enhancements

### `/docs/workflows/`
Process documentation and workflow guides:
- USERTODO.md - User workflow tasks

## 🏗️ Key Technical Directories

### `/app` - Next.js Application
- **App Router**: Next.js 14 with server and client components
- **Route Organization**: Each route in its own directory with `page.tsx`
- **API Routes**: Located in `app/api/`
- **Layouts**: Shared layouts at various levels

### `/components` - UI Components
- **Reusable Components**: Shared across pages
- **UI Directory**: Base UI components following design system
- **Server & Client Components**: Mixed usage based on needs

### `/lib` - Utilities
- **Logger**: Centralized logging with Sentry integration
- **Email**: Email sending via Resend
- **Utilities**: Shared helper functions

### `/content` - Content Files
- **Blog Posts**: MDX files with frontmatter
- **Structured Content**: Metadata and rich formatting

## 🧪 Testing Structure

### Unit Tests (`/__tests__`)
- **Vitest**: Component and utility testing
- **Coverage**: Maintained for critical paths
- **Location**: Mirrors source structure

### E2E Tests (`/tests/e2e`)
- **Playwright**: Browser automation
- **User Flows**: Critical user journeys tested
- **Configuration**: `playwright.config.ts`

## ⚙️ Configuration Files

Root level configuration:
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E configuration
- `package.json` - Dependencies and scripts
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting
- `sentry.*.config.ts` - Sentry monitoring configs

## 🔍 Finding What You Need

1. **For code**: Check `/app`, `/components`, or `/lib`
2. **For content**: Check `/content`
3. **For tests**: Check `/__tests__` (unit) or `/tests` (E2E)
4. **For docs**: Check [docs/DOCS_INDEX.md](./DOCS_INDEX.md)
5. **For tasks**: Check [TODO.md](../TODO.md)

## 📊 Metrics

- **Total Directories**: 27 main directories
- **Documentation Categories**: 5 organized categories
- **Root Control Docs**: 10 essential files

---

For detailed navigation of all documentation, see [DOCS_INDEX.md](./DOCS_INDEX.md).
