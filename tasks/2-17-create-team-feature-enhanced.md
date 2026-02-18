# 2.17 Create Team Feature (Enhanced)

**Status:** [ ] TODO | **Batch:** E | **Effort:** 20h | **Deps:** 2.11, 2.3

**Related Research:** §2.1, §3.1 (RSC), §6 (Industry), §3.4 (CMS)

**Objective:** TeamSection with 5+ implementation patterns, CMS and API adapters. Uses 2.3 display components.

**Enhanced Requirements:**

- **Implementation Patterns:** Config-Based, API-Based, CMS-Based, Hybrid, Directory-Based (5+ total)
- **CMS Integration:** Sanity, Contentful, Strapi, MDX adapters
- **API Integration:** REST API, GraphQL, directory services
- **Features:** Schema validation, role filtering, department organization, social integration

**Files:** `packages/features/src/team/` (index, lib/schema, lib/adapters/config.ts, lib/adapters/api.ts, lib/adapters/cms.ts, lib/adapters/directory.ts, lib/team-config.ts, lib/filters.ts, components/TeamSection.tsx, components/TeamConfig.tsx, components/TeamAPI.tsx, components/TeamCMS.tsx, components/TeamHybrid.tsx)

**API:** `TeamSection`, `teamSchema`, `createTeamConfig`, `normalizeFromConfig`, `normalizeFromAPI`, `normalizeFromCMS`, `filterByRole`, `filterByDepartment`, `TeamConfig`, `TeamAPI`, `TeamCMS`, `TeamHybrid`

**Checklist:** Schema → adapters → implementation patterns → Section components → export. Copy pattern from testimonials.
**Done:** Builds; all patterns work; CMS integration functional; API adapters work; filtering works.
**Anti:** No CMS sync; Server Components for data; formatCurrency server-side.

---
