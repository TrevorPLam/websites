# 2.29 Build Interactive Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.23 (Form), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Interactive variants including quizzes and calculators. L2.

**Requirements:**

- **Variants:** Quiz, Calculator, Poll, Survey, Interactive Form, With Results, With Sharing, Minimal (8+ total)
- **Quizzes:** Question/answer format, scoring, results display
- **Calculators:** Custom calculators, form-based calculations, results display

**Files:** `packages/marketing-components/src/interactive/types.ts`, `Quiz.tsx`, `Calculator.tsx`, `Poll.tsx`, `Survey.tsx`, `interactive/quiz.tsx`, `interactive/calculator.tsx`, `index.ts`

**API:** `InteractiveDisplay`, `Quiz`, `Calculator`. Props: `variant`, `questions` (array), `onSubmit`, `showResults`, `shareable`.

**Checklist:** Types; variants; quiz logic; calculator logic; export.
**Done:** All 8+ variants render; quizzes work; calculators functional.
**Anti:** No custom logic; basic implementations only.

---
