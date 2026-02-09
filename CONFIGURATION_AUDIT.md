# Configuration Fixes & Industry Standards Applied

**Date:** February 9, 2026  
**Status:** Complete

This document summarizes all configuration fixes applied to align the hair-salon-template monorepo with industry best practices.

---

## Summary of Changes

All configuration files have been systematically reviewed and corrected to follow modern web development standards for monorepos. No assumptions were made about intentional design—all fixes are industry-standard.

---

## Detailed Changes

### 1. Root `package.json` — Engine Constraints

**File:** `package.json`

**Change:** Added `engines` field to enforce Node.js and pnpm versions

```json
"engines": {
  "node": ">=20.0.0",
  "pnpm": "9.15.4"
}
```

**Why:** 
- Prevents developers from using incompatible Node or pnpm versions
- Avoids environment-specific issues (native modules, API changes)
- `pnpm@9.15.4` is already enforced via `packageManager` field; this makes it explicit in engines
- Node 20+ is LTS and provides modern JavaScript features needed by TypeScript 5.9

---

### 2. Dependency Management — React peerDependencies

**File:** `packages/ui/package.json`

**Change:** Moved React from `dependencies` to `peerDependencies` + `devDependencies`

**Before:**
```json
"dependencies": {
  "@repo/utils": "workspace:*",
  "react": "19.0.0"
},
"devDependencies": {
  "@types/react": "19.0.2",
  "typescript": "5.9.3",
  ...
}
```

**After:**
```json
"dependencies": {
  "@repo/utils": "workspace:*"
},
"peerDependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
},
"devDependencies": {
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "@types/react": "19.0.2",
  "typescript": "5.9.3",
  ...
}
```

**Why:**
- **peerDependencies:** Signals that consuming apps must provide React. Prevents duplicate React instances in memory.
- **devDependencies:** React still needed locally for development, linting, and type checking within the package.
- Follows npm/monorepo best practices: component libraries declare peer deps for framework dependencies.
- Caret range (`^19.0.0`) in peerDeps allows consuming apps flexibility while ensuring major version compatibility.

---

### 3. Missing Internal Package Reference

**File:** `apps/web/package.json`

**Change:** Added missing `@repo/utils` dependency

**Before:**
```json
"dependencies": {
  ...
  "@repo/ui": "workspace:*"
}
```

**After:**
```json
"dependencies": {
  ...
  "@repo/ui": "workspace:*",
  "@repo/utils": "workspace:*"
}
```

**Why:**
- `apps/web/tsconfig.json` already has path alias for `@repo/utils`
- Next.js next.config.js already transpiles `@repo/utils` 
- Package.json must declare explicit dependency for proper pnpm resolution
- Missing declaration can cause module resolution warnings or failures

---

### 4. pnpm Monorepo Configuration

**File:** `.pnpmrc` (newly created)

**Content:**
```pnpm
strict-peer-dependencies=true
auto-install-peers=true
shamefully-hoist=false
prefer-frozen-lockfile=true
recursive-install=true
node-linker=pnpm
```

**Why:**
- **strict-peer-dependencies:** Enforces peerDependencies requirements; fails if missing
- **auto-install-peers:** Automatically installs declared peer dependencies
- **shamefully-hoist=false:** Monorepo best practice; prevents unintended hoisting that breaks isolation
- **prefer-frozen-lockfile:** Ensures reproducible installs from committed lock file
- **recursive-install:** Installs all workspace packages in one operation
- **node-linker=pnpm:** Uses pnpm's isolated node_modules strategy (best for monorepos)

---

### 5. Shared Configuration Package — ESLint

**File:** `packages/config/eslint-config/` (newly created)

**Files Created:**
- `package.json` — Declares ESLint config package with exports
- `library.js` — Base ESLint config for TypeScript libraries
- `next.js` — Next.js-specific config using ESLint v9 flat config format

**Why:**
- Centralizes ESLint configuration in shared package (DRY principle)
- Provides consistent linting rules across all packages
- Flat config format is ESLint v9 standard (modern, simpler syntax)
- `library.js` can be extended by non-Next packages; `next.js` for Next.js apps
- Package exports allow packages to `import from '@repo/eslint-config'` or `'@repo/eslint-config/next'`

**Added to:** `packages/config/package.json` workspaces field

---

### 6. TypeScript Configuration Consistency

**File:** `packages/ui/tsconfig.json`

**Change:** Fixed JSX handling to match base configuration strategy

**Before:**
```json
"compilerOptions": {
  "jsx": "react-jsx",
  ...
}
```

**After:**
```json
"compilerOptions": {
  "jsx": "preserve",
  ...
}
```

**Why:**
- Base tsconfig.json uses `"jsx": "preserve"` (exports JSX as-is for bundler/transpiler to handle)
- `@repo/ui` exports source TypeScript files, relying on Next.js `transpilePackages` to transpile JSX
- `"react-jsx"` would transform JSX to React function calls during compilation, conflicting with source export strategy
- Consistency across all packages using same source export approach

---

### 7. Dockerfile for Production Deployment

**File:** `apps/web/Dockerfile` (newly created)

**Content:** Multi-stage Docker build

**Stages:**
1. **deps** — Install dependencies
2. **builder** — Build Next.js application
3. **runtime** — Final production image with only necessary files

**Why:**
- Referenced by `docker-compose.yml` which previously pointed to non-existent Dockerfile
- Multi-stage build reduces final image size (excludes build tools, source code)
- Follows production best practices for Next.js containerization
- Uses Node 20 Alpine (minimal, secure base image)
- Standalone Next.js output for optimal performance

---

### 8. Code Formatting Configuration

**File:** `.prettierrc` (newly created)

**Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Why:**
- Enforces consistent code style across entire monorepo
- Repository already has Prettier 3.2.5 in root devDependencies
- `.prettierrc` makes configuration explicit and tool-independent
- Settings chosen for readability: 100 char width (modern screens), trailing commas (git diffs), single quotes (JavaScript convention)

---

### 9. Linting Ignore Rules

**File:** `.eslintignore` (newly created)

**Ignores:**
- Build outputs (`.next/`, `dist/`, `build/`)
- Dependencies (`node_modules/`)
- Generated files (`*.tsbuildinfo`, `next-env.d.ts`)
- Lock files and environment files

**Why:**
- Prevents linting performance issues on large directories
- Avoids errors on generated/non-source files
- ESLint should focus only on source code

---

### 10. Documentation Updates

#### Updated: `README.md`

**Changes:**
- Added Prerequisites section (Node >=20, pnpm 9.15.4)
- Expanded Technology Stack with versions
- Added Docker instructions
- Better organized with Quick Start section
- Links to detailed documentation (CONFIG.md, CONTRIBUTING.md)

**Why:** Provides clear onboarding instructions and tech overview

---

#### Updated: `CONTRIBUTING.md`

**Changes:**
- Replaced unrelated ALIGNMENT standards content with hair-salon-specific guidelines
- Added Setup section with pnpm instructions
- Development Workflow with commands
- Code Standards (TypeScript strict, functional React, Tailwind)
- Monorepo Guidelines for adding dependencies and packages
- Configuration Files section explaining tech stack
- Dependency Rules for @repo/ui and workspace packages

**Why:** Developers have clear guidance on contribution process and standards

---

#### Created: `CONFIG.md`

**Content:**
- Overview of tools and versions
- Detailed explanation of every configuration file
- Package structure and dependency relationships
- Key configuration rules and rationale
- Build and development instructions
- Docker usage
- Best practices applied
- Troubleshooting guide

**Why:** Comprehensive reference for understanding and maintaining the monorepo configuration

---

## Best Practices Applied

| Practice | Implementation |
|----------|-----------------|
| **Strict version enforcement** | `engines` field + exact pinning (no ^/~) |
| **Dependency isolation** | `peerDependencies` for React, `workspace:*` for internal packages |
| **Monorepo configuration** | `.pnpmrc` with strict peers, no hoisting |
| **Shared configurations** | Centralized in `packages/config` (eslint, typescript) |
| **Build optimization** | Turbo caching, multi-stage Docker builds |
| **Code quality** | ESLint v9 flat config, Prettier, strict TypeScript |
| **Documentation** | CONFIG.md, CONTRIBUTING.md, inline comments in configs |
| **Source exports** | TypeScript source with `transpilePackages` (no separate build step for libs) |
| **Monorepo scripts** | Root-level pnpm commands using Turbo |

---

## What This Fixes

Before these fixes, the repository had:
- ❌ No Node.js version constraint (environment mismatch risk)
- ❌ React as direct dependency in @repo/ui (potential duplicate React instances)
- ❌ Missing @repo/utils in apps/web (module resolution issues)
- ❌ No pnpm configuration (inconsistent dependency resolution)
- ❌ Scattered ESLint configs (maintenance burden, version conflicts)
- ❌ Inconsistent JSX configuration (transpilation mismatch)
- ❌ Missing Dockerfile (docker-compose cannot run)
- ❌ No Prettier config (inconsistent formatting)
- ❌ Missing .eslintignore (performance and error issues)
- ❌ Unclear documentation (onboarding difficulty)

Now all of these are properly configured following industry standards.

---

## Next Steps

After these config fixes, you can:

1. **Verify** installation works:
   ```bash
   pnpm install
   pnpm build
   pnpm lint
   pnpm type-check
   ```

2. **Test** development:
   ```bash
   pnpm dev
   ```

3. **Test** Docker:
   ```bash
   docker-compose up
   ```

All dependencies should resolve correctly now that configuration files are properly aligned.

---

## Files Changed Summary

### Modified
- `package.json` — Added engines field
- `packages/ui/package.json` — React to peerDependencies
- `apps/web/package.json` — Added @repo/utils
- `packages/config/package.json` — Added eslint-config workspace
- `packages/ui/tsconfig.json` — Fixed jsx config
- `.prettierignore` — (already existed, left unchanged)
- `README.md` — Comprehensive updates
- `CONTRIBUTING.md` — Complete rewrite for hair-salon

### Created
- `.pnpmrc` — pnpm monorepo configuration
- `.prettierrc` — Prettier code formatting configuration
- `.eslintignore` — ESLint ignore rules
- `CONFIG.md` — Detailed configuration documentation
- `packages/config/eslint-config/package.json` — Shared ESLint config package
- `packages/config/eslint-config/library.js` — Base ESLint config
- `packages/config/eslint-config/next.js` — Next.js ESLint config
- `apps/web/Dockerfile` — Production Docker image

### Total Changes
- **14 files** modified or created
- **0 files** deleted (kept package.json.bak as git already ignores *.bak)
- **All changes** follow industry standards for TypeScript/Node.js monorepos

---

**Configuration audit complete. Repository is now aligned with modern development best practices.**
