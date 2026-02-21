<!--
@file docs/plans/2026-02-21-full-platform-buildout-design.md
@role Design document for complete platform build-out
@summary Parallel-track sprint plan covering all 49 P1 issues + 26-week evolution roadmap
@status Active
-->

# Full Platform Build-Out — Design Document

**Date:** 2026-02-21
**Approach:** Parallel Batch Sprints
**Scope:** All 49 P1 issues + evol-1 through evol-12
**Goal:** Production-ready platform before first client

---

## Sprint Architecture

```
Sprint 1 (All 6 batches run in parallel)
├── Batch A: Functional Foundation
├── Batch B: Performance + Accessibility
├── Batch C: Security Hardening
├── Batch D: Reliability
├── Batch E: Compatibility
└── Batch F: evol-1 Architecture Police + inf-1 Dynamic Registry

Sprint 2 (Parallel, after Sprint 1)
├── Batch G: evol-2 CVA + Token System + UI Primitives
└── Batch H: Integration Wiring

Sprint 3: evol-3 Registry Hardening
Sprint 4: evol-4, evol-5, evol-6 (Data Contracts)
Sprint 5: evol-7, evol-8 (Capability Core)
Sprint 6: evol-9, evol-10 (Universal Renderer)
Sprint 7: evol-11, evol-12 (Platform Convergence)
```

---

## Batch A — Functional Foundation

- A1: Add `<Toaster />` to providers.tsx in all clients
- A2: Implement `createContactHandler(siteConfig)` Server Action factory
- A3: Add Zod schema parse in contact server action (server-side validation)
- A4: Wire BlogPostContentAdapter to slug + getAllPosts/getPostBySlug
- A5: Implement `getBookingRepository()` factory (Supabase when env present, in-memory fallback)
- A6: Implement ServiceTabs (TabsList + TabsTrigger + TabsContent)
- A7: Fix HeroWithForm (add phone to schema, FormField wiring, submit loading state)
- A8: Wire HeroCarousel to real `@repo/ui` Carousel
- A9: Guard PricingTable null crash + unify PricingPlan types
- A10: Fix useNewsletter false success
- A11: Guard empty timeSlots before z.enum() construction
- A12: Fix 4 failing booking test call signatures
- A13: Add error.tsx + global-error.tsx to all clients
- A14: Add empty states to BlogGrid and PricingCards

## Batch B — Performance + Accessibility

- B1: Replace 48 raw `<img>` with Next.js `<Image>`
- B2: Add descriptive alt text to 8 content image components
- B3: Fix dynamic Tailwind class purge bug in 7 components
- B4: Convert static section imports to dynamic() with SSR
- B5: Add loading.tsx to all client route segments
- B6: Create section-specific skeleton variants
- B7: Enable cacheComponents + dynamicIO with use cache annotations

## Batch C — Security Hardening

- C1: Sanitize secureAction validation error output
- C2: Escape </script> in JSON-LD dangerouslySetInnerHTML
- C3: Validate/sanitize ThemeInjector CSS property values
- C4: Fix CSRF bypass when NEXT_PUBLIC_SITE_URL missing
- C5: Add frame-src to CSP for YouTube/Vimeo
- C6: Redact email/IP before booking log
- C7: Fix logger Windows path regex
- C8: Apply sanitizeUrl() to VideoEmbed/AudioPlayer src
- C9: Map integration errors to generic user-facing messages

## Batch D — Reliability

- D1: Replace HubSpot raw fetch with ResilientHttpClient
- D2: Add 10s AbortController timeout to all external fetch
- D3: Add dependency probes to /api/health (Supabase + Redis)
- D4: Replace empty catch blocks with console.warn/structured logger
- D5: Add Redis persistence path to DLQ
- D6: Fix Supabase singleton race condition
- D7: Add AbortController timeout to ResilientHttpClient

## Batch E — Compatibility

- E1: Create unified middleware (security + next-intl)
- E2: Remove @repo/database phantom path from tsconfig.base.json
- E3: Align all client layouts (ConsentProvider, ThemeProvider, Toaster)
- E4: Standardize next.config to .ts across all clients
- E5: Promote version-drifted deps to catalog
- E6: Add Windows alternatives to Unix docs commands

## Batch F — evol-1 + inf-1

- F1: Custom ESLint 9 rule blocking packages→clients imports
- F2: Custom ESLint 9 rule blocking deep internal imports
- F3: ESLint rule enforcing catalog: versions
- F4: Dynamic section registry with lazy-loaded resolvers (inf-1)
