# 1.3 Complete Turborepo Configuration with Composable Tasks

**File:** `turbo.jsonc`

```jsonc
{
  "$schema": "https://turbo.build/schema.jsonc",

  // Composable configuration feature from Turborepo 2.7
  // Allows package-specific turbo.json to extend this base config
  "extends": [],

  // Global environment variables that affect ALL tasks
  "globalEnv": [
    "NODE_ENV",
    "VERCEL",
    "VERCEL_ENV",
    "CI",
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ],

  // Global pass-through environment variables
  "globalPassThroughEnv": ["NODE_OPTIONS", "AWS_*", "VERCEL_*", "OTEL_*"],

  // Files that invalidate ALL task caches
  "globalDependencies": [".env", "tsconfig.json", "pnpm-workspace.yaml"],

  // UI configuration for turbo commands
  "ui": "stream",

  // Remote caching configuration (Vercel Remote Cache)
  "remoteCache": {
    "enabled": true,
    "signature": true, // Verify cache integrity
  },

  // Experimental: Turborepo 2.7 browser devtools
  "experimentalUI": true,

  // Cache directory (default: .turbo)
  "cacheDir": ".turbo",

  // Task definitions with composable inheritance using $TURBO_EXTENDS$
  "tasks": {
    // Build task: compiles TypeScript, bundles Next.js
    "build": {
      "dependsOn": ["^build"], // Wait for dependencies to build first
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**", // Exclude Next.js cache from Turbo cache
        "build/**",
        "out/**",
      ],
      "env": [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "DATABASE_URL",
        "NEXT_PUBLIC_*",
        "SANITY_*",
        "STRIPE_*",
        "POSTMARK_*",
      ],
      "cache": true,
      "inputs": [
        "src/**",
        "public/**",
        "package.json",
        "next.config.ts",
        "tailwind.config.ts",
        "tsconfig.json",
      ],
    },

    // Type-check: runs in parallel across all packages
    "typecheck": {
      "dependsOn": ["^build"], // Needs types from dependencies
      "cache": true,
      "outputs": ["*.tsbuildinfo"],
      "inputs": ["**/*.ts", "**/*.tsx", "tsconfig.json"],
    },

    // Lint: runs in parallel with type-check (no dependencies)
    "lint": {
      "dependsOn": [],
      "cache": true,
      "outputs": [],
      "inputs": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", ".eslintrc.js", ".eslintignore"],
    },

    // Test: unit tests with Vitest
    "test": {
      "dependsOn": ["^build"],
      "cache": true,
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV"],
      "inputs": ["**/*.test.ts", "**/*.test.tsx", "vitest.config.ts"],
    },

    // Test E2E: Playwright tests (no cache, always run)
    "test:e2e": {
      "dependsOn": ["build"],
      "cache": false, // E2E tests should always run fresh
      "outputs": ["test-results/**", "playwright-report/**"],
      "env": ["PLAYWRIGHT_BASE_URL", "TEST_USER_EMAIL", "TEST_USER_PASSWORD"],
    },

    // Dev: persistent task for development server
    "dev": {
      "cache": false, // Never cache dev server
      "persistent": true, // Keeps running in watch mode
      "dependsOn": ["^build"], // Wait for packages to build
      "ui": "tui",
    },

    // Clean: remove build artifacts
    "clean": {
      "cache": false,
      "outputs": [],
    },

    // Validate:configs: custom task to validate site.config.ts files
    "validate:configs": {
      "dependsOn": [],
      "cache": true,
      "outputs": [],
      "inputs": ["sites/*/site.config.ts"],
    },

    // FSD lint: Steiger checks for Feature-Sliced Design violations
    "lint:fsd": {
      "dependsOn": [],
      "cache": true,
      "outputs": [],
    },

    // Bundle size checking
    "analyze": {
      "dependsOn": ["build"],
      "outputs": [".next/analyze/**"],
      "cache": true,
    },

    // Generate: code generation tasks
    "generate": {
      "cache": false,
    },
  },
}
```

**Package-specific extension example:**

**File:** `apps/web/turbo.json`

```json
{
  "extends": ["$TURBO_EXTENDS$"],
  "tasks": {
    "build": {
      "env": ["$TURBO_EXTENDS$", "TINYBIRD_TOKEN", "POSTMARK_API_KEY"],
      "outputs": ["$TURBO_EXTENDS$", "public/static/**"]
    },
    "prebuild": {
      "outputs": ["generated/**"]
    }
  }
}
```

**Another package extending from `web`:**

**File:** `apps/portal/turbo.json`

```json
{
  "extends": ["@repo/web"],
  "tasks": {
    "build": {
      "$TURBO_EXTENDS$": ["dependsOn", "outputs", "env"]
    }
  }
}
```

**Why Composable Configuration:**

- `$TURBO_EXTENDS$` merges base config with package-specific overrides
- Prevents duplication across 50+ packages
- Introduced in Turborepo 2.7 (December 2025)

**Turborepo 2.7 Devtools:**

```bash
# Visualize package and task graphs
turbo devtools
# Opens browser at turborepo.dev/devtools
# Hot-reloads on turbo.json changes
# Answers: "Which packages miss cache when I change utilities?"
```

**When to Build:** P0 (Day 1)
