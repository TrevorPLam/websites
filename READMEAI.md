# READMEAI - Repository Entrypoint

> **Last Updated:** 2026-01-05  
> **Status:** Canonical  
> **Purpose:** Primary navigation hub for developers and operators working in this repository

---

## 🎯 Quick Start

**New to this repository?** Start here:

1. **[Project README](docs/start-here/README.md)** - Overview, setup instructions, and features
2. **[docs/DOCS_INDEX.md](docs/DOCS_INDEX.md)** - Complete documentation navigation
3. **[docs/REPO_MAP.md](docs/REPO_MAP.md)** - Repository structure overview
4. **[TODO.md](TODO.md)** - Current task backlog and priorities

**Package manager:** npm (use `package-lock.json` as the canonical lockfile)

---

## 📚 Essential Documentation

### Core Documents
- **[CODEBASECONSTITUTION.md](CODEBASECONSTITUTION.md)** - Repository rules and standards *(if exists)*
- **[DECISIONS.md](DECISIONS.md)** - Architecture Decision Records (ADRs)
- **[CODE_AUDIT.md](CODE_AUDIT.md)** - Code audit pipeline and process
- **[DOCS_ROOT.md](DOCS_ROOT.md)** - Documentation management rules

### Task Management
- **[TODO.md](TODO.md)** - Active task backlog (source of truth)
- **[TODO_COMPLETED.md](TODO_COMPLETED.md)** - Completed tasks archive

### Security & Operations
- **[SECURITY.md](SECURITY.md)** - Security policy and best practices
- **[SECURITY_REVIEW.md](SECURITY_REVIEW.md)** - Security review findings
- **[DEPENDENCY_HEALTH.md](DEPENDENCY_HEALTH.md)** - Dependency management policy
- **[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)** - Pre-deployment checklist

### Changes & History
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and notable changes

---

## 🗂️ Documentation Structure

```
Your-Dedicated-Marketer/
├── READMEAI.md              ← You are here (entrypoint)
├── DOCS_ROOT.md             ← Documentation governance
├── TODO.md                  ← Task backlog
├── TODO_COMPLETED.md        ← Completed tasks
├── DECISIONS.md             ← Architecture decisions
├── SECURITY.md              ← Security policy
├── docs/
│   ├── start-here/          ← User-facing README + onboarding
│   ├── DOCS_INDEX.md        ← Documentation navigation hub
│   ├── REPO_MAP.md          ← Repository structure guide
│   ├── workflows/           ← Development workflows
│   ├── architecture/        ← System design documents
│   ├── ops/                 ← Operations and deployment
│   ├── product/             ← Product documentation
│   └── ARCHIVE/             ← Deprecated documentation
├── app/                     ← Next.js app router pages
├── components/              ← React components
├── lib/                     ← Utilities and business logic
└── content/                 ← Blog posts and content
```

---

## 🚀 Common Tasks

### Setting Up Development Environment
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy environment variables
cp env.example .env.local

# 3. Start development server
npm run dev
```

**More details:** [Project README - Getting Started](docs/start-here/README.md#getting-started)

### Running Quality Checks
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm test

# E2E tests
npm run test:e2e
```

### Pre-commit Hooks
```bash
# Install hook scripts once
pre-commit install

# Run the hooks manually (uses npm run type-check)
pre-commit run --all-files
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm run start
```

**More details:** [Project README - Deployment](docs/start-here/README.md#deployment)

---

## 🎯 Working with Tasks

### Viewing Tasks
- **All tasks:** See [TODO.md](TODO.md)
- **Completed tasks:** See [TODO_COMPLETED.md](TODO_COMPLETED.md)
- **Task format:** Defined in [CODE_AUDIT.md](CODE_AUDIT.md)

### Task Priorities
- **P0 (Critical):** Build failures, security vulnerabilities, blockers
- **P1 (High):** Production readiness, core security, maintainability
- **P2 (Medium):** Hardening, polish, documentation, enhancements

### Task Categories
- **SEC:** Security-related
- **DEP:** Dependency health
- **REL:** Reliability
- **PERF:** Performance
- **UX:** User experience
- **DX:** Developer experience

---

## 📖 Key Concepts

### Next.js 14 App Router
This project uses Next.js 14 with the App Router, featuring:
- Static Site Generation (SSG) for optimal performance
- Server Actions for form handling
- MDX support for content
- TypeScript throughout

**More details:** [DECISIONS.md - ADR-001](DECISIONS.md)

### Security Approach
- Server-side form validation with Zod
- Content Security Policy (CSP) headers
- Rate limiting on contact form
- Input sanitization and output encoding
- No client-side secrets

**More details:** [SECURITY.md](SECURITY.md)

### Content Management
- Blog posts: MDX files in `content/blog/`
- Case studies: Data in `lib/case-studies.ts`
- Static pages: React components in `app/`

**More details:** [Project README - Content Management](docs/start-here/README.md#content-management)

---

## 🔍 Finding Information

### By Topic
- **Setup & Installation:** [Project README](docs/start-here/README.md)
- **Architecture Decisions:** [DECISIONS.md](DECISIONS.md)
- **Security Practices:** [SECURITY.md](SECURITY.md)
- **Code Standards:** [CODE_AUDIT.md](CODE_AUDIT.md)
- **Workflows:** [docs/workflows/](docs/workflows/)
- **Deployment:** [docs/ops/](docs/ops/)

### By Role
- **Developer:** Start with [Project README](docs/start-here/README.md) → [docs/REPO_MAP.md](docs/REPO_MAP.md)
- **Operator/Maintainer:** Review [TODO.md](TODO.md) → [SECURITY_REVIEW.md](SECURITY_REVIEW.md)
- **Contributor:** Read [docs/workflows/CONTRIBUTING.md](docs/workflows/CONTRIBUTING.md)

### Full Navigation
For complete documentation index: **[docs/DOCS_INDEX.md](docs/DOCS_INDEX.md)**

---

## 🆘 Getting Help

### Common Issues
1. **Build errors:** Check [Project README - Troubleshooting](docs/start-here/README.md#troubleshooting)
2. **ESLint warnings:** Review [CODE_AUDIT.md](CODE_AUDIT.md)
3. **Dependency issues:** See [DEPENDENCY_HEALTH.md](DEPENDENCY_HEALTH.md)
4. **Security concerns:** Follow [SECURITY.md](SECURITY.md) reporting process

### Support
- Email: contact@yourdedicatedmarketer.com
- Security issues: security@ydFirms.com (parent company security team)

---

## 📋 Document Precedence

When information conflicts between documents, follow this precedence order:

1. **CODEBASECONSTITUTION.md** (if exists) - Foundational rules
2. **READMEAI.md** (this file) - Navigation and structure
3. **specs/*** - Specifications and requirements
4. **Other documentation** - Supporting materials

---

## 🔄 Maintenance

### Keeping Documentation Fresh
- Update **Last Updated** date when making changes
- Archive outdated docs to `docs/ARCHIVE/`
- Update links in [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) when moving files
- Convert doc tasks to TODO.md entries

### Review Cadence
- **Monthly:** Review TODO.md priorities
- **Quarterly:** Audit documentation for accuracy
- **Per Release:** Update CHANGELOG.md and verify docs

---

## 📝 Contributing

Before contributing:
1. Review [docs/workflows/CONTRIBUTING.md](docs/workflows/CONTRIBUTING.md) *(if exists)*
2. Check [TODO.md](TODO.md) for current priorities
3. Follow patterns in [DECISIONS.md](DECISIONS.md)
4. Maintain security standards from [SECURITY.md](SECURITY.md)

---

## 🏛️ Repository Governance

This repository follows structured documentation practices:
- **Single source of truth** for each topic
- **No task leakage** in documentation (use TODO.md)
- **Explicit canonical documents** to prevent drift
- **Archive old versions** instead of deleting

**Full governance rules:** [DOCS_ROOT.md](DOCS_ROOT.md)

---

*This document serves as the primary entrypoint for all repository documentation. When in doubt, start here.*
