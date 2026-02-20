# Golden Path: Adding a New Feature

**Last Updated:** 2026-02-20  
**Related:** [Architecture Overview](../architecture/README.md), [evolution-roadmap](../architecture/evolution-roadmap.md)

---

## Overview

This guide describes how to add a new feature to the platform. Two approaches exist:

- **Classic approach** — Add sections to the registry, wire feature flags in `site.config.ts`. Works today.
- **Capability approach** — Use `defineFeature` and register with `featureRegistry`. Phase 3+ (evol-7, evol-8).

---

## Classic Approach (Current)

1. **Define feature in site config types** — Add to `SiteConfig.features` in `@repo/types`.
2. **Create section components** — Add to `packages/page-templates/src/sections/` under the appropriate family.
3. **Register sections** — Call `registerSection(id, Adapter)` in the section family's index.
4. **Wire page template** — Update `composePage()` logic to include the section when the feature is enabled.
5. **Document** — Add usage to docs/features/ and site-config-reference.

Example: Adding a "testimonials" section — create `sections/home/testimonials-adapter.tsx`, register as `hero-testimonials` or similar, and add to HomePageTemplate's section derivation.

---

## Capability Approach (Phase 3+)

When the capability layer is implemented (evol-7, evol-8):

1. **Define the feature**:
   ```ts
   defineFeature('my-feature', {
     id: 'my-feature',
     provides: { sections: ['my-section-id'], integrations: [] },
     dataContracts: [],
   });
   ```
2. **Register with featureRegistry** — The feature self-declares what it provides.
3. **Enable in site config** — `capabilities: { 'my-feature': true }` (or via features in classic mode during transition).
4. **Universal renderer** — Capabilities are activated; sections and integrations flow from the registry.

See [evolution-roadmap](../architecture/evolution-roadmap.md) and tasks/evol-7, evol-8 for specs.

---

## Checklist

- [ ] Feature types updated in @repo/types
- [ ] Section(s) implemented and registered
- [ ] Page template derivation updated (classic) or capability registered (future)
- [ ] site.config.ts / site-config-reference.md updated
- [ ] Tests and documentation added
