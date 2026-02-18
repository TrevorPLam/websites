# 2.31 Create Form Builder Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 28h | **Deps:** 2.11, 1.23 (Form)

**Related Research:** §5.1 (Spec-driven), visual form builders

**Objective:** Form builder feature with 5+ implementation patterns and visual builder.

**Implementation Patterns:** Config-Based, Visual-Builder-Based, Schema-Based, API-Based, Hybrid (5+ total)

**Files:** `packages/features/src/form-builder/` (index, lib/schema, lib/adapters, lib/form-config.ts, lib/visual-builder.ts, lib/fields.ts, components/FormBuilderSection.tsx, components/FormBuilderConfig.tsx, components/FormBuilderVisual.tsx, components/FormBuilderSchema.tsx, components/FormBuilderAPI.tsx, components/FormBuilderHybrid.tsx)

**API:** `FormBuilderSection`, `formBuilderSchema`, `createFormConfig`, `buildForm`, `renderForm`, `FormBuilderConfig`, `FormBuilderVisual`, `FormBuilderSchema`, `FormBuilderAPI`, `FormBuilderHybrid`

**Checklist:** Schema; adapters; visual builder; field types; implementation patterns; export.
**Done:** Builds; all patterns work; visual builder functional; forms render.
**Anti:** No custom field types; standard inputs only.

---
