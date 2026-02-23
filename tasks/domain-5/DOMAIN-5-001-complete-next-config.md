---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-001
title: 'Complete next.config.ts with Next.js 16 optimization'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-001-next-config
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-001 · Complete next.config.ts with Next.js 16 optimization

## Objective

Implement complete next.config.ts following section 5.1 specification with Next.js 16 core features, PPR configuration, React Compiler, Turbopack, image optimization, and deployment settings for optimal performance.

---

## Context

**Codebase area:** `sites/*/next.config.ts` and `apps/*/next.config.ts` — Next.js configuration

**Related files:** Existing Next.js configurations, image optimization, deployment infrastructure

**Dependencies:** Next.js 16, React 19, image optimization libraries, deployment adapters

**Prior work:** Basic Next.js configurations may exist but lack Next.js 16 optimizations

**Constraints:** Must follow section 5.1 specification with all performance optimizations enabled

---

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 with PPR and React Compiler            |
| Build Tools  | Turbopack for development, Webpack for production |
| Optimization | Image optimization, bundle analysis               |
| Deployment   | Standalone output, build adapters                 |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement complete next.config.ts following section 5.1 specification
- [ ] **[Agent]** Enable PPR (cacheComponents) with proper configuration
- [ ] **[Agent]** Configure React Compiler with annotation mode rollout
- [ ] **[Agent]** Add Turbopack configuration for development builds
- [ ] **[Agent]** Implement comprehensive image optimization with AVIF/WebP
- [ ] **[Agent]** Configure standalone output and build adapters
- [ ] **[Agent]** Add performance headers and caching strategies
- [ ] **[Agent]** Test configuration with build and development modes
- [ ] **[Human]** Verify configuration follows section 5.1 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.1 specification** — Extract all Next.js 16 requirements
- [ ] **[Agent]** **Create base configuration** — Implement core Next.js 16 features
- [ ] **[Agent]** **Add PPR configuration** — Enable cacheComponents with proper settings
- [ ] **[Agent]** **Configure React Compiler** — Set up annotation mode for safe rollout
- [ ] **[Agent]** **Add Turbopack** — Configure for development builds
- [ ] **[Agent]** **Implement image optimization** — AVIF/WebP formats, remote patterns
- [ ] **[Agent]** **Configure deployment** — Standalone output, build adapters
- [ ] **[Agent]** **Add performance headers** — Caching strategies and optimization
- [ ] **[Agent]** **Test configuration** — Verify build and development modes

> ⚠️ **Agent Question**: Ask human before proceeding if any existing Next.js configurations need migration.

---

## Commands

```bash
# Test Next.js configuration
pnpm build --filter="@repo/ui"
pnpm build --filter="@repo/features"

# Test Turbopack development
pnpm dev --turbo

# Test image optimization
pnpm next build --experimental-images

# Verify React Compiler
pnpm build --trace
```

---

## Code Style

```typescript
// ✅ Correct — Complete Next.js 16 configuration following section 5.1
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ============================================================================
  // NEXT.JS 16 CORE
  // ============================================================================

  // Cache Components (PPR stable in Next.js 16) — replaces experimental.ppr
  cacheComponents: true,

  // React Compiler (stable in Next.js 16, opt-in recommended for safety)
  // Phase 1: annotation mode (opt-in per component)
  // Phase 2: 'all' (global) after audit
  reactCompiler: {
    compilationMode: 'annotation', // Start with opt-in
  },

  // Turbopack (stable in Next.js 16 — 2-5x faster dev builds)
  turbopack: {
    // Environment variable handling
    resolveAlias: {},
    // Enable for dev; prod uses Webpack by default
  },

  // ============================================================================
  // OUTPUT & DEPLOYMENT
  // ============================================================================

  output: 'standalone', // Required for Docker/Vercel deployments

  // Build Adapters API (Next.js 16 — enables AWS Lambda / Cloudflare Workers)
  // Leave undefined for Vercel (auto-detected); set for self-hosting
  // experimental: { deploymentId: process.env.DEPLOYMENT_ID }

  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================

  images: {
    // AVIF first (35-50% smaller than WebP), WebP fallback
    formats: ['image/avif', 'image/webp'],

    // Per-tenant CDN domains
    remotePatterns: [
      // Supabase Storage (per-tenant uploads)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Sanity CDN
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Client logos and assets
      {
        protocol: 'https',
        hostname: '*.youragency.com',
      },
    ],

    // Device sizes for responsive images (matches common breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for layout="fixed" and layout="intrinsic"
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize layout shift from images (requires explicit width/height)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days

    // Dangerous — only enable if you fully control all image sources
    dangerouslyAllowSVG: false,
  },

  // ============================================================================
  // HEADERS (Supplemental — middleware.ts handles most security headers)
  // ============================================================================

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache static assets aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // HTML pages: no cache (SSR/PPR pages must be fresh)
        source: '/(?:(?!_next/static|_next/image|api/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // ============================================================================
  // EXPERIMENTAL FEATURES
  // ============================================================================

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Enable logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

**Next.js configuration principles:**

- Enable all Next.js 16 performance features for optimal speed
- Use PPR for static components with dynamic content
- Roll out React Compiler safely with annotation mode
- Optimize images with modern formats (AVIF > WebP)
- Configure standalone output for container deployment
- Add performance headers for optimal caching

---

## Boundaries

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.1 specification; enable all Next.js 16 features; optimize for performance; configure for deployment                         |
| ⚠️ **Ask first** | Changing existing build processes; modifying deployment infrastructure; updating image optimization strategies                               |
| 🚫 **Never**     | Skip performance optimizations; use deprecated features; ignore security best practices; break existing functionality without migration path |

---

## Success Verification

- [ ] **[Agent]** Run `pnpm build` — Configuration builds successfully
- [ ] **[Agent]** Test Turbopack development — `pnpm dev --turbo` works correctly
- [ ] **[Agent]** Verify PPR functionality — Static components are cached
- [ ] **[Agent]** Test React Compiler — Annotation mode works for opt-in components
- [ ] **[Agent]** Verify image optimization — AVIF/WebP formats are generated
- [ ] **[Agent]** Test deployment output — Standalone build works
- [ ] **[Human]** Test with real site deployment — Configuration works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **React Compiler rollout**: Start with annotation mode to avoid breaking changes
- **Image optimization**: Ensure all image sources are trusted before enabling SVG
- **Turbopack compatibility**: Some Next.js features may not be fully supported in Turbopack
- **Deployment adapters**: Choose appropriate adapter for target platform
- **Performance headers**: Balance caching with freshness requirements

---

## Out of Scope

- Application-level performance optimization (handled in separate tasks)
- Database performance optimization (handled in separate domain)
- Third-party integration performance (handled in integration tasks)
- Monitoring and analytics setup (handled in separate tasks)

---

## References

- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [PPR Documentation](https://nextjs.org/docs/app/getting-started/cache-components)
- [React Compiler Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- [Turbopack Documentation](https://nextjs.org/docs/architecture/turbopack)
