# 2.21 Build Course Components (Education)

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.2 (Button), 1.40 (Rating)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Course variants with enrollment and progress. L2.

**Requirements:**

- **Variants:** Grid, List, Featured, With Enrollment, With Progress, Category Tabs, With Reviews, With Curriculum, Minimal, Detailed (10+ total)
- **Enrollment:** Enrollment form, payment integration, confirmation
- **Progress:** Progress tracking, completion status, certificates

**Files:** `packages/marketing-components/src/course/types.ts`, `CourseGrid.tsx`, `CourseCard.tsx`, `CourseDetail.tsx`, `CourseEnrollment.tsx`, `course/progress.tsx`, `course/enrollment.tsx`, `index.ts`

**API:** `CourseDisplay`, `CourseCard`, `CourseEnrollment`. Props: `variant`, `courses` (array), `showEnrollment`, `showProgress`, `showReviews`.

**Checklist:** Types; variants; enrollment; progress tracking; export.
**Done:** All 10+ variants render; enrollment works; progress displays.
**Anti:** No LMS integration; basic tracking only.

---
