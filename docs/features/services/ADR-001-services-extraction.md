# ADR-001: Services Feature Extraction

**Status:** Accepted  
**Date:** 2026-02-17  
**Deciders:** Auto (Task 2.15)

## Context

The hair-salon template had a services feature with `ServicesOverview` (homepage grid) and `ServiceDetailLayout` (detail pages). Both were template-local with hardcoded content and direct imports of `siteConfig` and `getPublicBaseUrl()`. To support multiple industries and shared reuse, the feature needed extraction to `@repo/features/services`.

## Decision

1. **Props-driven components** — No direct site config or env imports. `ServicesOverview` receives `services`, `heading`, `subheading`. `ServiceDetailLayout` receives `siteName` and `baseUrl` for structured data.

2. **Template config layer** — Each template defines its service taxonomy (e.g. `lib/services-config.ts`) and passes data into the shared components. This enables salon, restaurant, law-firm, etc. to use the same components with different content.

3. **Structured data** — `ServiceDetailLayout` emits Schema.org Service and FAQPage JSON-LD. Provider and URL fields come from props, keeping the feature decoupled from env/config.

4. **Backward compatibility** — Template `features/services/index.ts` re-exports from `@repo/features/services` so existing `@/features/services` imports continue to work during migration.

## Consequences

- **Positive:** Components are reusable across industries; no env/config coupling in the package
- **Positive:** Template controls service taxonomy and detail content
- **Neutral:** Template pages must pass `siteName` and `baseUrl` explicitly
- **Negative:** Slight increase in template boilerplate for each service detail page
