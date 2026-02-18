# 1.38 Create Color Picker Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), color picker patterns

**Objective:** Color picker with multiple input methods. Layer L2.

**Files:** Create `packages/ui/src/components/ColorPicker.tsx`; update `index.ts`.

**API:** `ColorPicker`. Props: `value`, `onChange`, `format` (hex, rgb, hsl), `presets` (array), `alpha` (boolean).

**Checklist:** Create ColorPicker component; add hex/rgb/hsl formats; add presets; add alpha channel; export; type-check; build.
**Done:** Builds; color selection works; formats switch; presets functional; alpha channel works.
**Anti:** No custom color spaces; standard formats only.

---
