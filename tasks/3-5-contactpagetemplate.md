# 3.5 ContactPageTemplate

_Shared specification originally defined for: 3.2 HomePageTemplate | 3.3 ServicesPageTemplate | 3.4 AboutPageTemplate | 3.5 ContactPageTemplate | 3.6 BlogIndexTemplate | 3.7 BlogPostTemplate | 3.8 BookingPageTemplate_

**Status:** [ ] TODO each | **Batch:** C | **Deps:** 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)

**Related Research:** §2.1, §3.1, §8.2

**Objective:** Each template reads siteConfig.pages.<page>.sections, renders composePage. Registers sections in registry.

**Checklist:** Register sections; create Template.tsx; use composePage; export.
**Done:** Template renders; config-driven sections.
**Anti:** No hardcoded industry content; all from config.

---

### Integrations (4.1–4.6)
