---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-1-003
title: 'Implement complete directory structure for monorepo'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-1-003-directory-structure
allowed-tools: Bash(git:*) Read Write Bash(mkdir:*) Bash(touch:*)
---

# DOMAIN-1-003 · Implement complete directory structure for monorepo

## Objective

Create the complete directory structure as specified in section 1.4, including apps/, sites/, e2e/, infrastructure/, and all required package directories with proper AGENTS.md files.

---

## Context

**Documentation Reference:**

- Pnpm Workspaces Documentation: `docs/guides/build-monorepo/pnpm-workspaces-documentation.md` ✅ COMPLETED
- Turborepo Documentation: `docs/guides/build-monorepo/turborepo-documentation.md` ✅ COMPLETED
- Turborepo Remote Caching: `docs/guides/build-monorepo/turborepo-remote-caching.md` ✅ COMPLETED
- Pnpm Deploy Documentation: `docs/guides/infrastructure-devops/pnpm-deploy-documentation.md` ✅ COMPLETED
- Pnpm Vs Yarn Vs Npm Benchmarks: `docs/guides/build-monorepo/pnpm-vs-yarn-vs-npm-benchmarks.md` ✅ COMPLETED
- Renovate Configuration Documentation: `docs/guides/best-practices/renovate-configuration-documentation.md` ✅ COMPLETED
- Git Branching Strategies: `docs/guides/best-practices/git-branching-strategies.md` ✅ COMPLETED
- Feature Flags System: `docs/guides/build-monorepo/feature-flags-system.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Root directory structure — foundation for entire monorepo architecture

**Related files:** `pnpm-workspace.yaml`, `turbo.json`, all package configurations

**Dependencies:** Directory structure must match workspace globs in pnpm-workspace.yaml

**Prior work:** Basic packages/ and clients/ structure exists, missing apps/, sites/, e2e/

**Constraints:** Must maintain existing packages/ structure while adding new directories

---

## Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Filesystem    | Standard Unix directory structure |
| Context Files | AGENTS.md (40-60 lines each)      |
| Configuration | package.json for each new package |
| Build System  | Turborepo task orchestration      |

---

## Acceptance Criteria

- [ ] **[Agent]** Create `apps/` directory with web/, admin/, portal/ subdirectories
- [ ] **[Agent]** Create `sites/` directory for individual client site configurations
- [ ] **[Agent]** Create `e2e/` directory with tests/ and playwright.config.ts
- [ ] **[Agent]** Create `infrastructure/` directory with terraform/ and scripts/
- [ ] **[Agent]** Create missing packages/ directories: auth/, database/, seo/, analytics/
- [ ] **[Agent]** Create AGENTS.md file in each package directory (40-60 lines)
- [ ] **[Agent]** Create package.json files for all new packages
- [ ] **[Agent]** Update pnpm-workspace.yaml globs to match new structure
- [ ] **[Human]** Verify structure matches section 1.4 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Create apps/ structure** — Add apps/web/, apps/admin/, apps/portal/ with basic files
- [ ] **[Agent]** **Create sites/ directory** — Add empty sites/ directory for client configurations
- [ ] **[Agent]** **Create e2e/ structure** — Add e2e/tests/ directories and playwright configuration
- [ ] **[Agent]** **Create infrastructure/ structure** — Add terraform/ and scripts/ directories
- [ ] **[Agent]** **Create missing packages/ directories** — Add auth/, database/, seo/, analytics/, etc.
- [ ] **[Agent]** **Generate AGENTS.md files** — Create 40-60 line context files for each package
- [ ] **[Agent]** **Create package.json files** — Add basic package.json for all new packages
- [ ] **[Agent]** **Update workspace configuration** — Ensure pnpm-workspace.yaml includes new directories
- [ ] **[Human]** **Validate structure completeness** — Compare against section 1.4 specification

> ⚠️ **Agent Question**: Ask human before proceeding if any existing directories conflict with new structure.

---

## Commands

```bash
# Create directory structure
mkdir -p apps/web apps/admin apps/portal
mkdir -p sites
mkdir -p e2e/tests
mkdir -p infrastructure/terraform infrastructure/scripts
mkdir -p packages/auth packages/database packages/seo packages/analytics
mkdir -p packages/cms-adapters packages/email packages/crypto-provider
mkdir -p packages/server-actions packages/multi-tenant packages/ab-testing
mkdir -p packages/lead-capture packages/design-tokens packages/testing-utils
mkdir -p packages/feature-flags packages/org-assets

# Create basic package.json files
for dir in apps/*/ packages/*/; do
  if [ ! -f "$dir/package.json" ]; then
    echo '{"name": "@repo/'$(basename "$dir")'", "version": "0.1.0"}' > "$dir/package.json"
  fi
done

# Verify structure
find . -type d -name "*" | head -20
```

---

## Code Style

```bash
# ✅ Correct — Directory creation with proper structure
mkdir -p apps/web/app/\(marketing\)/\[domain\]/page.tsx
mkdir -p apps/web/app/api/leads/route.ts
mkdir -p apps/web/app/api/webhooks/stripe/route.ts

# ✅ Correct — AGENTS.md template
cat > packages/auth/AGENTS.md << 'EOF'
# Auth Package

## Purpose
Multi-tenant authentication utilities and middleware.

## Key Components
- Server-only auth utilities
- Client component helpers
- Auth middleware helpers
- RLS helpers for Supabase

## Usage Patterns
- Import server utilities in API routes
- Use client helpers in components
- Middleware for route protection
- RLS helpers for database security

## Dependencies
- @supabase/supabase-js
- jose (JWT handling)
- next-auth (optional)

## Security Notes
- Never expose server secrets to client
- Use proper tenant isolation
- Validate all JWT tokens
- Implement proper session management
EOF
```

**Directory principles:**

- Follow Feature-Sliced Design for packages/
- Use Next.js App Router structure for apps/
- Separate concerns (apps vs packages vs sites)
- Include AGENTS.md for context in every package

---

## Boundaries

| Tier             | Scope                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Create directories as specified; add AGENTS.md files; create basic package.json; follow section 1.4 structure exactly          |
| ⚠️ **Ask first** | Modifying existing package directories; changing current file locations; updating build configurations                         |
| 🚫 **Never**     | Delete existing packages/ content; modify clients/ directory; break existing workspace globs; ignore AGENTS.md template format |

---

## Success Verification

- [ ] **[Agent]** Run `find . -type d -name "apps" -o -name "sites" -o -name "e2e"` — all directories exist
- [ ] **[Agent]** Run `find packages/ -maxdepth 1 -type d | wc -l` — confirms 15+ packages
- [ ] **[Agent]** Run `find . -name "AGENTS.md" | wc -l` — all packages have AGENTS.md files
- [ ] **[Agent]** Run `pnpm install` — workspace recognizes all new packages
- [ ] **[Human]** Compare directory tree with section 1.4 specification — 100% match
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Workspace conflicts:** Ensure new directories don't conflict with existing pnpm-workspace.yaml globs
- **File permissions:** Ensure proper permissions on created directories and files
- **AGENTS.md length:** Keep each AGENTS.md between 40-60 lines as specified
- **Package naming:** Use consistent @repo/ naming convention for all packages
- **Empty directories:** Some directories may remain empty initially (like sites/)

---

## Out of Scope

- Implementation of actual package code (only structure and stub files)
- Configuration of individual apps (Next.js setup, etc.)
- E2E test implementation (only directory structure)
- Infrastructure as code implementation (only directory structure)

---

## References

- [Section 1.4 Complete Directory Structure](docs/plan/domain-1/1.4-complete-directory-structure.md)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Next.js App Router Structure](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
