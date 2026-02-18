# 5.1 Create Starter-Template in clients/

**Status:** [ ] TODO | **Batch:** — | **Effort:** 6h | **Deps:** 3.1, 3.2, 3.3, 3.5, 3.8

**Related Research:** §3.1 (Next.js, RSC), §4.2 (Performance), §8.2 (Site Composer)

**Objective:** Thin Next.js shell. Routes: home, about, services, contact, blog, book. site.config.ts ONLY file client changes. L3.

**Files:** `clients/starter-template/` — package.json, next.config, app/layout.tsx, app/page.tsx, app/about/page.tsx, etc., site.config.ts, api/health/route.ts

**Checklist:** 5.1a layout (ThemeInjector, providers); 5.1b routes; 5.1c site.config + README; api/health; validate-client when 6.10a exists.
**Done:** Builds; all routes render; siteConfig-only customization.
**Anti:** No CMS; no custom API beyond health/OG; config drives all.

---
