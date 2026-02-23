# Cross Slice Import Patterns

> **Reference Documentation — February 2026**

## Overview

In Feature-Sliced Design, modules on the **same layer cannot import each other** by default. The `@x` (cross-import) notation provides a controlled, auditable escape hatch for necessary cross-slice dependencies within the same layer. [feature-sliced](https://feature-sliced.design/docs/get-started/overview)

---

## The Problem: Same-Layer Imports

```typescript
// ❌ VIOLATION — feature importing from another feature on the same layer
// features/book-appointment/model/use-booking.ts

import { useContactForm } from 'features/submit-contact-form';
// Steiger will flag this as: "no-cross-imports" violation
```

This creates hidden coupling between slices, making refactoring unpredictable.

---

## The Solution: @x Notation

The `@x/` directory creates an **explicit contract** between two slices:

```
entities/lead/
├── ...                         # Internal implementation
└── @x/
    ├── book-appointment.ts     # Exports only for book-appointment feature
    └── analytics-dashboard.ts  # Exports only for analytics-dashboard widget
```

**Consumer (importer):**

```typescript
// features/book-appointment/model/use-booking.ts

// ✅ Explicit @x import — visible in code review, tracked by Steiger
import { useLeadStore, type Lead } from 'entities/lead/@x/book-appointment';
```

**Provider (exporter) — must be explicit:**

```typescript
// entities/lead/@x/book-appointment.ts
// Only export what book-appointment legitimately needs.
// This file documents the dependency contract.

export { useLeadStore } from '../model/use-lead-store';
export type { Lead, LeadId } from '../model/types';

// Do NOT export UI components here — book-appointment has no right to render lead UI
```

---

## Dependency Flow Examples

### Valid: entity → shared

```typescript
// entities/lead/api/get-leads.ts
import { supabaseClient } from 'shared/api/supabase'; // ✅ entity → shared
```

### Valid: feature → entity (direct)

```typescript
// features/update-lead-status/api/update.ts
import { updateLeadStatus } from 'entities/lead'; // ✅ feature → entity public API
```

### Valid: feature → entity (cross-slice via @x)

```typescript
// features/book-appointment/model/use-booking.ts
import { type Lead } from 'entities/lead/@x/book-appointment'; // ✅ @x notation
```

### Invalid: feature → feature

```typescript
// features/book-appointment/model/use-booking.ts
import { formState } from 'features/submit-contact-form/model'; // ❌ same-layer import
```

**Resolution:** Extract the shared state to an `entity` or `shared` slice.

---

## Steiger Rule: `no-cross-imports`

Steiger's `no-cross-imports` rule enforces the `@x` pattern and fails CI for violations:

```typescript
// .steiger.config.ts
export default defineConfig({
  rules: {
    '@feature-sliced/no-cross-imports': [
      'error',
      {
        // Allow @x notation — it IS the sanctioned cross-import mechanism
        allowViaXNotation: true,
      },
    ],
  },
});
```

---

## When to Use @x vs. Lifting to Shared

| Situation                                           | Solution                                                    |
| --------------------------------------------------- | ----------------------------------------------------------- |
| One feature needs a type from another feature       | Lift the type to `entities/` or `shared/types/`             |
| One entity needs state from another entity          | Lift to `shared/model/` or create a new higher-level entity |
| Feature needs to call an entity's internal function | Expose via entity's `index.ts` public API                   |
| Two features need the same ephemeral state          | Extract to `entities/` slice                                |
| Cross-entity read for rendering (rare, audited)     | `@x` notation with explicit contract file                   |

**Rule of thumb:** If you need `@x` more than twice per feature, the feature should probably be split or the shared logic lifted to `entities/`.

---

## References

- FSD Cross-Import (@x notation) — https://feature-sliced.design/docs/reference/slices-segments#cross-imports
- FSD Overview — https://feature-sliced.design/docs/get-started/overview
- Steiger no-cross-imports rule — https://github.com/feature-sliced/steiger

---
