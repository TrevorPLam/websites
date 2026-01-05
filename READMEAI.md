# READMEAI - AI Operating Console (Root)

Document Type: Governance
Version: 3.1.0
Last Updated: 2026-01-07
Status: Canonical
Purpose: Make work in this repo deterministic, auditable, and agent-executable while staying readable for a non-coder owner.

## 📋 Document Precedence
1. **CODEBASECONSTITUTION.md** (foundational rules)
2. **READMEAI.md** (this file)
3. **TODO.md** (task truth source) → **TODOCOMPLETED.md** (archive)
4. Audit runbooks: **CODEAUDIT.md**, **SECURITYAUDIT.md**, **DEPENDENCYAUDIT.md**, **RELEASEAUDIT.md**, **DOCSAUDIT.md**
5. Supporting docs/specs (specs/, docs/, DECISIONS.md, etc.)

## 🎯 Start Here (required read order)
1. `CODEBASECONSTITUTION.md`
2. `AGENTS.md`
3. `TODO.md` (task truth source)
4. Runbooks (use when instructed): `CODEAUDIT.md`, `SECURITYAUDIT.md`, `DEPENDENCYAUDIT.md`, `RELEASEAUDIT.md`, `DOCSAUDIT.md`
5. `repo.manifest.yaml` (how to run/verify this repo)
6. `PROJECT_STATUS.md` (current state + next step)

## 🧭 Task Truth Model
- **Authoritative:** `TODO.md`
- **Archive:** `TODOCOMPLETED.md`
- **Non-binding notes:** `specs/` (must be converted into tasks to be actionable)
- Optional helper: scripts may generate `TODO.generated.md` (informational only)

## 🛠️ Modes
- **Planner:** propose plan + questions; no code edits
- **Builder:** implement exactly one task (or a small, linked set)
- **Auditor:** inspect + create tasks; do not refactor blindly
- **Status-Sync:** update `PROJECT_STATUS.md` and move completed tasks to `TODOCOMPLETED.md`
- **Emergency:** stop-the-bleed (secrets/auth/payment)

## ✅ Verification (minimum)
- Prefer existing repo commands (see `repo.manifest.yaml`).
- If commands are missing, record **UNKNOWN** and create a task to add them.
- For UI changes: verify **mobile** behavior explicitly.

## 🚦 GitHub Actions (cost control)
GitHub Actions are stored under `githubactions/` and are **disabled by default**. See `githubactions/README.md` to enable/disable.

---

## 🎯 Quick Start

**New to this repository?** Start here:

1. **[Project README](docs/start-here/README.md)** - Overview, setup instructions, and features
2. **[docs/DOCS_INDEX.md](docs/DOCS_INDEX.md)** - Complete documentation navigation
3. **[docs/REPO_MAP.md](docs/REPO_MAP.md)** - Repository structure overview
4. **[TODO.md](TODO.md)** - Current task backlog and priorities
5. **Node version:** Use Node.js 20.x (`.nvmrc` provided; run `nvm use`)
6. **Registry check (if installs fail):** `npm run check:npm-registry` (current environment returns HTTP 403 to npm ping; see `DEPENDENCY_HEALTH.md` for details)

**Quick command cheatsheet**

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Lint, format, and type-check
npm run lint
npm run format:check
npm run type-check
# Run tests
npm test
npm run test:e2e

# Validate npm registry connectivity (useful if installs fail)
npm run check:npm-registry
```

**Package manager:** npm (use `package-lock.json` as the canonical lockfile)

---

## 📚 Essential Documentation

### Core Documents
- **[CODEBASECONSTITUTION.md](CODEBASECONSTITUTION.md)** - Repository rules and standards
- **[DECISIONS.md](DECISIONS.md)** - Architecture Decision Records (ADRs)
- **[CODEAUDIT.md](CODEAUDIT.md)** - Code audit pipeline and process
- **[DOCSAUDIT.md](DOCSAUDIT.md)** - Documentation management rules

### Task Management
- **[TODO.md](TODO.md)** - Active task backlog (source of truth)
- **[TODOCOMPLETED.md](TODOCOMPLETED.md)** - Completed tasks archive

### Security & Operations
- **[SECURITY.md](SECURITY.md)** - Security policy and best practices
- **[SECURITY_REVIEW.md](SECURITY_REVIEW.md)** - Security review findings
- **[DEPENDENCYAUDIT.md](DEPENDENCYAUDIT.md)** (and legacy **DEPENDENCY_HEALTH.md**) - Dependency management policy
- **[RELEASEAUDIT.md](RELEASEAUDIT.md)** (and legacy **RELEASE_CHECKLIST.md**) - Pre-deployment checklist

### Changes & History
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and notable changes

---

## 🗂️ Documentation Structure

```
Your-Dedicated-Marketer/
├── READMEAI.md              ← You are here (entrypoint)
├── DOCS_ROOT.md             ← Documentation governance
├── TODO.md                  ← Task backlog
├── TODOCOMPLETED.md         ← Completed tasks
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
# Formatting
npm run format:check
npm run format

# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm test
npm run test:e2e
```

### Task Categories (legacy reference)
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
- **Code Standards:** [CODEAUDIT.md](CODEAUDIT.md)
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
2. **ESLint warnings:** Review [CODEAUDIT.md](CODEAUDIT.md)
3. **Dependency or npm registry issues:** Run `npm run check:npm-registry` to verify connectivity/proxy settings, then review [DEPENDENCY_HEALTH.md](DEPENDENCY_HEALTH.md) and TODO_COMPLETED entries (T-030, T-031) if connectivity errors persist.
4. **Security concerns:** Follow [SECURITY.md](SECURITY.md) reporting process

### Support
- Email: contact@yourdedicatedmarketer.com
- Security issues: security@ydFirms.com (parent company security team)

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
