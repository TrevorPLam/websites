# Repository Index - Multi-Industry Template Architecture

**Version:** 2.0  
**Date:** 2026-02-10  
**Status:** Active

This index provides an overview of the restructured repository that supports marketing website templates across all industries and enables multi-client project management.

## Quick Navigation

- [Templates](#templates) - Business-specific website templates
- [Clients](#clients) - Production client implementations
- [Packages](#packages) - Shared utilities and components
- [Documentation](#documentation) - Guides and architecture docs
- [Configuration](#configuration) - Build and development configs

---

## Templates

Industry-specific marketing website templates that serve as starting points for client projects.

### Hair Salon Template (Service Business Example)

**Location:** `templates/hair-salon/`  
**Status:** ✅ Active - Migrated  
**Port:** 3100  
**Description:** Complete hair salon website template

**Features:**

- Online booking system
- Service showcase pages
- Team member profiles
- Blog with MDX support
- Gallery/portfolio
- Contact forms with CRM integration
- SEO optimized

**Documentation:** [docs/templates/hair-salon.md](docs/templates/hair-salon.md)

### Additional Service Business Templates

**Nail Salon** - `templates/nail-salon/` - 🔄 Planned  
**Tanning Salon** - `templates/tanning-salon/` - 🔄 Planned

### Planned Industry Templates

**Restaurant/Hospitality** - `templates/restaurant/` - 🔄 Planned  
**Law Firm/Professional Services** - `templates/law-firm/` - 🔄 Planned  
**Dental Practice** - `templates/dental/` - 🔄 Planned  
**Real Estate Agency** - `templates/real-estate/` - 🔄 Planned  
**Fitness Center** - `templates/fitness/` - 🔄 Planned  
**Retail Store** - `templates/retail/` - 🔄 Planned

### Shared Template Components

**Location:** `templates/shared/`  
**Status:** ✅ Active  
**Description:** Reusable components and features shared across templates

**Includes:**

- Booking form components
- Contact form logic
- Analytics integration
- CRM connectors
- Search functionality
- Authentication helpers
- Security utilities

**Documentation:** [templates/shared/README.md](templates/shared/README.md)

---

## Clients

Production client websites based on templates.

### Example Client

**Location:** `clients/example-client/`  
**Status:** ✅ Active - Reference Implementation  
**Template:** Hair Salon v1.0.0  
**Port:** 3001  
**Description:** Example client project demonstrating template customization and setup

**Documentation:** [clients/example-client/README.md](clients/example-client/README.md)

### Client Projects

**Location:** `clients/[client-name]/`  
**Description:** Individual client production websites

Each client project:

- Based on a template
- Independently deployable
- Customized branding and content
- Unique environment configuration

**Setup Guide:** [docs/clients/README.md](docs/clients/README.md)

---

## Packages

Shared utilities and components used across all templates and clients.

### UI Package

**Location:** `packages/ui/`  
**Package:** `@repo/ui`  
**Description:** Core React UI component library

### Utils Package

**Location:** `packages/utils/`  
**Package:** `@repo/utils`  
**Description:** Shared utility functions

### Config Packages

**Location:** `packages/config/`  
**Description:** Shared configuration packages

- **TypeScript Config** (`typescript-config/`) - TypeScript configurations
- **ESLint Config** (`eslint-config/`) - ESLint rules

---

## Documentation

Comprehensive documentation for templates, clients, and architecture.

### Template Documentation

**Location:** `docs/templates/`

- [README.md](docs/templates/README.md) - Template overview and guides
- [hair-salon.md](docs/templates/hair-salon.md) - Hair salon template docs

### Client Documentation

**Location:** `docs/clients/`

- [README.md](docs/clients/README.md) - Client implementation guide

### Architecture Documentation

**Location:** `docs/architecture/`

- [TEMPLATE_ARCHITECTURE.md](docs/architecture/TEMPLATE_ARCHITECTURE.md) - Multi-template architecture
- [README.md](docs/architecture/README.md) - System architecture

### Core Documentation

**Location:** `docs/`

- [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) - Migration from legacy structure
- [TESTING_STATUS.md](docs/TESTING_STATUS.md) - Testing verification
- [SECURITY_MONITORING_STATUS.md](docs/SECURITY_MONITORING_STATUS.md) - Security status

### Root Documentation

- [README.md](../README.md) - Project overview
- [CONFIG.md](CONFIG.md) - Configuration docs
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [TODO.md](../TODO.md) - Implementation backlog
- [ARCHIVE.md](../ARCHIVE.md) - Completed tasks

### Specifications

**Location:** `.kiro/specs/`

- **[marketing-first-enhancements](../.kiro/specs/marketing-first-enhancements/)** - Conversion optimization features
  - Status: Requirements & Design Complete | Tasks Pending
  - 20 major requirements for social proof, portfolio, trust indicators, conversion optimization
  - Integration platform with consent gating and default-off integrations

---

## Configuration

Build, development, and tooling configuration files.

### Workspace Configuration

- [package.json](package.json) - Root package configuration
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - Workspace definition
- [turbo.json](turbo.json) - Turbo build pipeline

### TypeScript & Linting

- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [.prettierrc](.prettierrc) - Prettier rules
- [.editorconfig](.editorconfig) - Editor defaults

### Testing

- [jest.config.js](jest.config.js) - Jest configuration
- [jest.setup.js](jest.setup.js) - Jest setup

---

## Directory Structure

```
hair-salon/
├── templates/              # Business templates
│   ├── hair-salon/        # Hair salon template
│   ├── shared/            # Shared components
│   └── README.md
│
├── clients/               # Client implementations
│   ├── example-client/    # Reference client
│   └── README.md
│
├── packages/              # Shared utilities
│   ├── ui/               # UI components
│   ├── utils/            # Utilities
│   └── config/           # Configurations
│
├── apps/                 # Internal apps (optional)
│
├── docs/                 # Documentation
│   ├── templates/        # Template docs
│   ├── clients/          # Client guides
│   └── architecture/     # Architecture docs
│
├── package.json          # Root configuration
└── README.md             # Project overview
```

---

## Quick Start

### For New Client Projects

```bash
# 1. Copy template
cp -r templates/hair-salon clients/my-client

# 2. Configure
cd clients/my-client
cp .env.example .env.local

# 3. Install & run
pnpm install
pnpm dev --port 3001
```

### For Template Development

```bash
# Install dependencies
pnpm install

# Work on template
cd templates/hair-salon
pnpm dev --port 3100
```

---

## Next Steps

1. **✅ Migration Complete:** `apps/web` successfully moved to `templates/hair-salon`
2. **✅ Example client created:** Reference implementation in `clients/example-client`
3. **Plan additional templates:** Design nail salon and tanning salon templates
4. **Extract shared code:** Move common features to `templates/shared/` as patterns emerge

See [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) for detailed migration instructions.

---

**Last Updated:** 2026-02-10  
**Repository Version:** 2.0  
**Structure:** Multi-Template Multi-Client
