# 2.16 Build Location Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7, 4.5 (Maps Integration)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Location variants with maps integration. L2.

**Requirements:**

- **Variants:** With Map, List, Grid, Single Location, Multiple Locations, With Directions, With Contact, With Hours, With Reviews, Minimal (10+ total)
- **Maps Integration:** Google Maps, Mapbox, interactive maps, markers, directions

**Files:** `packages/marketing-components/src/location/types.ts`, `LocationWithMap.tsx`, `LocationList.tsx`, `LocationGrid.tsx`, `LocationCard.tsx`, `location/maps.tsx`, `index.ts`

**API:** `LocationDisplay`, `LocationCard`. Props: `variant`, `locations` (array), `showMap`, `showDirections`, `mapProvider`.

**Checklist:** Types; variants; maps integration; export.
**Done:** All 10+ variants render; maps display; directions work.
**Anti:** No custom map styling; standard providers only.

---
