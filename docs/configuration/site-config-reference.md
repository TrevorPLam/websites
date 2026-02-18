# Site Config Reference

**Last Updated:** 2026-02-18  
**Status:** Stub — full reference in `packages/types/src/site-config.ts`

## Overview

The `SiteConfig` interface and Zod schema are defined in `@repo/types`. Each client has a `site.config.ts` at its root that implements this config. Key sections:

- **features** — Hero layout, services grid, team, testimonials, pricing, gallery, FAQ, blog, booking
- **integrations** — analytics, crm, booking, email, chat providers
- **navLinks** / **footer** — Navigation structure
- **contact** — Business info, hours
- **theme** — Colors (HSL), fonts, border radius, shadows
- **conversionFlow** — Booking service categories, time slots
- **seo** — Title template, default description

See `clients/starter-template/site.config.ts` for a complete example.
