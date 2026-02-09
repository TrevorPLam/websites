/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Next.js Configuration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Configure Next.js framework behavior and build settings
 * - Enable monorepo package transpilation for @repo/* packages
 * - Enforce TypeScript and ESLint checks during build
 *
 * Responsibilities:
 * - Owns: Build-time configuration (transpilation, checks)
 * - Owns: Package resolution for monorepo workspaces
 * - Does NOT own: Runtime behavior (use middleware or env vars)
 *
 * Key Flows:
 * - Build: Next.js reads config → transpiles packages → runs checks → generates output
 * - Dev: Next.js watches files → hot reloads → serves pages
 *
 * Inputs/Outputs:
 * - Input: Source files in app/, components/, features/
 * - Output: .next/ build directory with optimized bundles
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: next (framework)
 * - Internal: @repo/ui, @repo/utils (monorepo packages)
 *
 * State & Invariants:
 * - Invariant: transpilePackages must include all @repo/* dependencies
 * - Invariant: Both TS and ESLint checks enabled in production builds
 * - Assumption: All packages follow Next.js-compatible export patterns
 *
 * Error Handling:
 * - Missing transpilePackages: Build fails with "Cannot find module" error
 * - Type errors: Build fails if ignoreBuildErrors=false (intentional)
 * - Lint errors: Build fails if ignoreDuringBuilds=false (intentional)
 *
 * Performance Notes:
 * - transpilePackages adds ~500ms to build (one-time cost)
 * - Running checks during build prevents CI failures
 * - Production builds optimized with SWC compiler
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - Type/lint checks help prevent bugs
 *
 * Testing Notes:
 * - Test: Run `npm run build`, verify no errors
 * - Test: Verify @repo/* imports resolve correctly
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Disabling checks may allow bugs to reach production
 * - Missing transpilePackages breaks monorepo imports
 * - Invalid config syntax breaks all builds
 *
 * Owner Boundaries:
 * - Monorepo config: turbo.json, pnpm-workspace.yaml
 * - TypeScript config: tsconfig.json
 * - ESLint config: eslint.config.mjs
 *
 * AI Navigation Tags:
 * #nextjs #build #config #monorepo #transpile
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/utils'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
