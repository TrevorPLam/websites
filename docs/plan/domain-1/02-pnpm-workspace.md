# 1.2 Complete pnpm Workspace Configuration

**File:** `pnpm-workspace.yaml`

```yaml
# pnpm-workspace.yaml
# pnpm v10.x with catalog strict mode for centralized dependency management

packages:
  # Client-facing applications
  - 'apps/*'

  # Individual client sites (scales to 1000+)
  - 'sites/*'

  # Shared packages
  - 'packages/*'

  # End-to-end tests
  - 'e2e/*'

  # Documentation
  - 'docs'

# Catalog mode enforces single version for all dependencies
# "strict": true prevents any package from overriding catalog versions
catalog:
  # Framework (Next.js 16.1 stable)
  next: ^16.1.0
  react: ^19.2.0
  react-dom: ^19.2.0

  # TypeScript
  typescript: ^5.7.2
  '@types/node': ^22.10.0
  '@types/react': ^19.0.0
  '@types/react-dom': ^19.0.0

  # Supabase
  '@supabase/supabase-js': ^2.48.0
  '@supabase/ssr': ^0.7.0

  # Validation
  zod: ^3.24.0

  # Styling (Tailwind v4)
  tailwindcss: ^4.0.0
  '@tailwindcss/typography': ^0.6.0

  # Testing
  '@playwright/test': ^1.49.0
  vitest: ^2.2.0
  '@testing-library/react': ^16.1.0
  '@testing-library/jest-dom': ^6.6.3

  # Observability
  '@opentelemetry/sdk-node': ^1.30.0
  '@opentelemetry/auto-instrumentations-node': ^0.54.0
  '@opentelemetry/exporter-trace-otlp-http': ^0.56.0
  '@opentelemetry/api': ^1.9.0
  '@sentry/nextjs': ^8.47.0

  # Rate limiting
  '@upstash/ratelimit': ^2.0.4
  '@upstash/redis': ^1.38.0

  # Build tooling
  turbo: ^2.7.0

  # Code quality
  eslint: ^9.18.0
  prettier: ^3.4.2

  # Feature-Sliced Design linting
  '@feature-sliced/steiger': ^0.5.0

  # Changesets for versioning
  '@changesets/cli': ^2.28.0

  # Content Management
  '@sanity/client': ^6.26.0
  next-sanity: ^9.11.0

  # Date/Time
  date-fns: ^4.1.0

  # Forms
  react-hook-form: ^7.54.0
  '@hookform/resolvers': ^3.9.1

  # Analytics
  '@tinybird/client': ^2.3.0

  # Email
  '@postmarkapp/postmark': ^4.0.5
  resend: ^4.0.2

  # Payments
  stripe: ^17.5.0

  # Post-Quantum Crypto (NIST PQC readiness)
  '@noble/post-quantum': ^0.3.0

# Catalog mode: enforce catalog usage (pnpm 10.x)
catalog-strict: true
auto-install-peers: true
strict-peer-dependencies: false
shamefully-hoist: false
node-linker: isolated

# Prevent hoisting issues with singleton dependencies
public-hoist-pattern:
  - '*eslint*'
  - '*prettier*'

# Node.js version constraint (LTS 22.x)
engines:
  node: '>=22.0.0'
  pnpm: '>=10.0.0'
```

**Why This Configuration:**

- Catalog mode eliminates version conflicts across 50+ packages
- `strict: true` prevents individual packages from overriding catalog versions (critical for monorepo consistency)
- Workspace globs support scaling to 1000+ client sites without config changes
- Engines constraint ensures local dev matches production (Vercel runs Node 22.x)
- Isolated node modules prevent phantom dependencies

**Catalog Strict Mode Behavior:**

- `pnpm add react` → Automatically installs `catalog:` version
- Attempting to install `react@18.0.0` → Error: "catalogMode:strict requires catalog version"
- Adding new dependency → Auto-adds to catalog with latest version

**Migration from pnpm 9.x:**

```bash
# Convert existing package.json dependencies to catalog
pnpm dlx @pnpm/catalog-converter
# Verify catalog usage
pnpm audit --catalog-strict
```

**When to Build:** P0 (Day 1)
