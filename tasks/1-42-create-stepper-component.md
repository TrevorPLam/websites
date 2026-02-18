# 1.42 Create Stepper Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 6h | **Deps:** None

**Related Research:** §3.1 (React 19), stepper patterns

**Objective:** Multi-step progress indicator with navigation. Layer L2.

**Files:** Create `packages/ui/src/components/Stepper.tsx`; update `index.ts`.

**API:** `Stepper`, `StepperStep`, `StepperContent`, `StepperTrigger`. Props: `currentStep`, `orientation` (horizontal, vertical), `clickable` (boolean), `variant` (default, numbered, dots).

**Checklist:** Create Stepper component; add step navigation; add variants; export; type-check; build.
**Done:** Builds; stepper renders; step navigation works; variants display; keyboard accessible.
**Anti:** No custom step validation; visual indicator only.

---
