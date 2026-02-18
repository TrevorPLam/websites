# 2.3 Build TeamDisplay Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.8 (Avatar)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 15+ Team layout variants with role filtering and social integration. L2.

**Enhanced Requirements:**

- **Layout Variants:** Grid (2-col, 3-col, 4-col), List (vertical, horizontal), Card Grid, Featured + Grid, Carousel, Sidebar + Grid, Masonry, Timeline, Accordion, Filterable Grid, Role-based Grid, Department Tabs, Social-focused, Minimal Cards, Detailed Cards (15+ total)
- **Role Filtering:** Filter by role, department, team
- **Social Integration:** Social media links, LinkedIn, Twitter, GitHub integration
- **Composition:** Team member cards with avatar, name, role, bio, social links, contact info
- **Interactive:** Hover effects, expandable bios, modal details

**Files:** `packages/marketing-components/src/team/types.ts`, `TeamGrid.tsx`, `TeamList.tsx`, `TeamCarousel.tsx`, `TeamMasonry.tsx`, `TeamFilterable.tsx`, `TeamRoleBased.tsx`, `team/filters.tsx`, `team/social.tsx`, `index.ts`

**API:** `TeamDisplay`, `TeamMemberCard`. Props: `layout`, `members` (array), `filterByRole`, `showSocial`, `showBio`, `showContact`.

**Checklist:** Types; layouts; role filtering; social integration; export.
**Done:** All 15+ layouts render; role filtering works; social links functional; RSC where static.
**Anti:** No CMS wiring; data from props only.

---
