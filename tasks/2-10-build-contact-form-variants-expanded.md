# 2.10 Build Contact Form Variants (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 20h | **Deps:** 1.7, 1.23 (Form), 1.2 (Button)

**Related Research:** §2.1, §4.2, §2.2, form validation patterns

**Objective:** 10+ Contact Form variants with validation and integration. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Map, With Office Info, Multi-Step, With File Upload, With Calendar, With Chat, Sidebar, Full Page (10+ total)
- **Validation:** Client-side validation, error messages, success states
- **Integration:** Email service, CRM integration, webhook support

**Files:** `packages/marketing-components/src/contact/types.ts`, `ContactFormStandard.tsx`, `ContactFormMinimal.tsx`, `ContactFormWithMap.tsx`, `ContactFormMultiStep.tsx`, `ContactFormWithUpload.tsx`, `contact/validation.tsx`, `contact/integration.tsx`, `index.ts`

**API:** `ContactForm`. Props: `variant`, `fields` (array), `onSubmit`, `showMap`, `showOfficeInfo`, `integrations`.

**Checklist:** Types; variants; validation; integration; export.
**Done:** All 10+ variants render; validation works; integrations functional; accessible.
**Anti:** No custom field types; standard inputs only.

---

### Marketing Components (New Families 2.11–2.35)
