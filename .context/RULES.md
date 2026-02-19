# AI Assistant Rules for marketing-websites

This file defines guardrails and conventions for AI assistants working in this repository.

**Last Updated:** 2026-02-19  
**Source:** Migrated from CLAUDE.md

---

## Core Principles

### Configuration-as-Code Architecture (CaCA)
- **Rule:** `site.config.ts` is the single source of truth for all client behavior
- **Action:** Never hardcode client-specific values in components
- **Validation:** Use `pnpm validate-client [path]` to verify CaCA contract

### Package Dependency Rules
- **Allowed:** `clients/` → `@repo/*` packages via public exports only
- **Forbidden:** `packages/` → `clients/` (never)
- **Forbidden:** `clients/A` → `clients/B` (cross-client isolation)
- **Forbidden:** Deep imports like `@repo/infra/src/internal` (use public exports only)

### Version Management
- **Rule:** Use `pnpm-workspace.yaml` catalog versions when available
- **Action:** Prefer `catalog:react` over pinning `^19.0.0`
- **Validation:** Run `pnpm syncpack:check` to verify consistency

---

## Technology Stack Constraints

### Required Versions
- **Node.js:** >=22.0.0 (strictly enforced via `engines`)
- **pnpm:** 10.29.2 (strictly enforced via `packageManager`)
- **Next.js:** 16.1.5 (App Router)
- **React:** 19.0.0
- **TypeScript:** 5.9.3 (strict mode)

### Package Manager Rules
- **Rule:** Always use pnpm, never npm or yarn
- **Action:** Run commands with `pnpm --filter` for package-specific operations
- **Validation:** `pnpm install` must succeed without errors

---

## Code Quality Standards

### TypeScript Rules
- **Strict Mode:** No `any` types allowed
- **Compiler Options:** `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- **Imports:** Use package public exports, never internal paths
- **Peer Dependencies:** `@repo/ui` declares React as peer, not direct dependency

### React Conventions
- **Components:** Functional components with hooks only (no classes)
- **Server Components:** Use React 19 Server Components where possible
- **Styling:** Tailwind CSS 4 utilities with `cn()` from `@repo/utils`

### ESLint Configuration
- **Format:** ESLint 9 flat config (`eslint.config.mjs`, not `.eslintrc.*`)
- **Inheritance:** Extend `@repo/eslint-config` for new packages
- **Validation:** Run `pnpm lint` before commits

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

---

## Testing Requirements

### Test Environments
- **Node Environment:** Server utilities, infra, server actions, lib/ code
- **jsdom Environment:** React components, UI primitives
- **Configuration:** Root `jest.config.js` defines both environments

### Test File Organization
- **Location:** `__tests__/` subdirectory or co-located `*.test.ts`
- **Naming:** `ComponentName.test.tsx` or `functionName.test.ts`
- **UI Components:** Use `@testing-library/react`, `jest-axe` for accessibility

### Required Test Coverage
- **UI Components:** Rendering, accessibility, user interactions
- **Server Actions:** Input validation, rate limiting, error handling
- **Utilities:** Input/output correctness, edge cases

---

## Development Workflow Rules

### Package Creation
1. Create `packages/your-package/` directory
2. Set `package.json` name as `@repo/your-package`
3. Extend `@repo/typescript-config` in `tsconfig.json`
4. Add `eslint.config.mjs` extending `@repo/eslint-config`
5. Export from `src/index.ts`
6. Declare React as `peerDependencies` if used

### Client Creation
1. Copy `clients/starter-template/` to `clients/my-client`
2. Update package name to `@clients/my-client`
3. Modify `site.config.ts` for client-specific settings
4. Copy `.env.example` to `.env.local` and configure
5. Use unique port (e.g., `--port 3001`)

### Validation Commands
```bash
# Required before commits
pnpm lint                  # ESLint
pnpm type-check            # TypeScript
pnpm test                  # Jest tests
pnpm validate-exports      # Package exports
pnpm validate-client [path] # Client configuration

# Package-specific operations
pnpm --filter @repo/ui lint
pnpm --filter @clients/starter-template dev
```

---

## Environment Variable Rules

### Configuration
- **Local Development:** All variables are optional with sensible defaults
- **Template:** Copy `.env.example` to `.env.local` in client directory
- **Pairs:** Some variables require both (Supabase, Upstash Redis, booking providers)

### Key Variables
- `NEXT_PUBLIC_SITE_URL`: Public site URL
- `NEXT_PUBLIC_SENTRY_DSN`: Error tracking
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`: Database/auth pair
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`: Rate limiting pair

### Schema Validation
- **Location:** `packages/infra/env/schemas/*.ts`
- **Validation:** Environment variables validated at runtime

---

## CI/CD Requirements

### Quality Gates (Blocking)
1. ESLint (affected packages only on PRs)
2. TypeScript type checking
3. Package export map validation
4. Circular dependency detection
5. Dependency version consistency
6. Full build verification
7. Test coverage

### Quality Audit (Non-blocking)
- Dead code detection (`pnpm knip`)
- SBOM generation
- Dependency vulnerability scan

### Turbo Optimization
- **PRs:** `--filter="...[origin/main]"` for affected packages only
- **Main Push:** Full pipeline runs

---

## Documentation Standards

### File Headers
All source files in packages use structured comment blocks:
```typescript
/**
 * @file path/to/file.ts
 * @role package|docs|script
 * @summary Brief description
 * @exports Exported items
 * @depends_on Dependencies
 * @used_by Consumers
 * @runtime node|browser|universal
 * @side_effects none|yes
 * @data_flow Input → Output
 * @invariants What must remain true
 * @gotchas Common pitfalls
 * @issues Known problems
 * @opportunities Improvements
 * @verification Validation status
 * @status confidence|last_audited
 */
```

### Documentation Validation
```bash
pnpm validate-docs           # Standard validation
pnpm validate-docs:strict    # Strict mode
```

---

## Common Pitfalls to Avoid

### Critical Issues
- **Wrong pnpm version:** Must use exactly 10.29.2
- **Deep imports:** Never import internal package paths
- **Cross-template imports:** Templates must remain isolated
- **React dependency:** `@repo/ui` uses peer dependencies, not direct

### TypeScript Issues
- **Unchecked access:** `noUncheckedIndexedAccess` requires handling undefined
- **Build errors:** TypeScript errors block CI (`ignoreBuildErrors: false`)
- **Server-only modules:** `@repo/infra` uses `server-only` import

### Environment Issues
- **Missing pairs:** Supabase, Upstash, booking providers need both variables
- **Port conflicts:** Each client uses unique port (starter-template: 3101)
- **Workspace sync:** Package workspaces must match `pnpm-workspace.yaml`

---

## Security and Performance

### Security Rules
- **No hardcoded secrets:** Use environment variables
- **Input validation:** All user inputs validated via Zod schemas
- **Rate limiting:** Implemented in `@repo/infra`
- **CSP headers:** Configured per deployment

### Performance Requirements
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1
- **Bundle optimization:** Code splitting and lazy loading
- **Image optimization:** Next.js Image component with proper sizing

---

## AI Assistant Guidelines

### Before Making Changes
1. **Read existing code:** Understand patterns and conventions
2. **Check dependencies:** Verify allowed import directions
3. **Run validation:** Ensure quality gates pass
4. **Update documentation:** Add file headers and update relevant docs

### When Adding Features
1. **Follow CaCA:** Configure via `site.config.ts` when possible
2. **Add tests:** Cover unit and integration scenarios
3. **Consider accessibility:** Include ARIA attributes and keyboard navigation
4. **Update exports:** Add to package `index.ts` and validate exports

### When Fixing Bugs
1. **Root cause analysis:** Don't just treat symptoms
2. **Add regression tests:** Prevent future occurrences
3. **Update documentation:** Record lessons learned
4. **Validate across packages:** Ensure no breaking changes

---

## Emergency Procedures

### Build Failures
1. Check TypeScript errors first
2. Verify dependency versions with `pnpm syncpack:check`
3. Validate package exports with `pnpm validate-exports`
4. Check for circular dependencies

### Test Failures
1. Run tests in isolation: `pnpm --filter @package/test`
2. Check Jest configuration for environment mismatches
3. Verify mock implementations
4. Check for async timing issues

### Dependency Issues
1. Clear pnpm cache: `pnpm store prune`
2. Remove node_modules and reinstall
3. Check workspace configuration
4. Verify catalog versions

---

*These rules ensure consistency, quality, and maintainability across the marketing-websites platform.*
