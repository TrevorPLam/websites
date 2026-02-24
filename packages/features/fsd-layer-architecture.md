# Fsd Layer Architecture

> **Reference Documentation — February 2026**

## Overview

Feature-Sliced Design (FSD) 2.1 organizes frontend code into six hierarchical **layers**, each subdivided into domain-specific **slices**, each slice containing technical **segments**. The single most important rule: **a module can only import from layers below it**. [feature-sliced](https://feature-sliced.design)

---

## Layer Hierarchy (Top to Bottom)

```
app/         ← Initialization, providers, global styles, router
pages/       ← Route-level composition (Next.js app/ directory maps here)
widgets/     ← Self-contained UI blocks composing features + entities
features/    ← User interactions, business operations (actions)
entities/    ← Business objects (Lead, Tenant, Booking)
shared/      ← Reusable primitives with no business logic
```

**Import rule:** A module in `features/` can import from `entities/` and `shared/` but **never** from `widgets/` or `pages/`. [feature-sliced](https://feature-sliced.design/docs/get-started/overview)

---

## Layer Responsibilities

### `shared/`

Infrastructure and utilities with zero business domain knowledge:

```
shared/
├── ui/               # Generic UI components (Button, Input, Modal)
├── api/              # Base HTTP client, fetch wrappers
├── lib/              # Pure utilities (dates, strings, numbers)
├── config/           # Environment variable accessors
├── types/            # Primitive TypeScript types
└── constants/        # Application-wide constants
```

### `entities/`

Business objects — the nouns of your domain:

```
entities/
├── lead/
│   ├── model/        # Zustand slice or React context for lead state
│   ├── api/          # CRUD queries for leads
│   ├── ui/           # Lead card, lead avatar, lead status badge
│   └── index.ts      # Public API (what other layers can import)
├── tenant/
├── booking/
└── user/
```

### `features/`

User-initiated operations — the verbs of your domain:

```
features/
├── submit-contact-form/
│   ├── ui/           # The form component itself
│   ├── model/        # Form state, validation, submission handler
│   ├── api/          # POST /api/contact
│   └── index.ts
├── update-lead-status/
├── book-appointment/
└── manage-service-areas/
```

### `widgets/`

Stateful compositions of features and entities (e.g., a sidebar combining the lead list + filter controls):

```
widgets/
├── lead-feed/        # RealtimeLeadFeed + filter bar + export button
├── site-header/      # Nav + CTA + mobile menu
├── booking-modal/    # Cal.com embed + trigger button
└── contact-cta/      # Contact section composing submit-contact-form
```

### `pages/` (= Next.js `app/` routes)

Route-level components that assemble widgets:

```
// In Next.js, each app/*/page.tsx IS the FSD pages/ layer
// Do not create a separate pages/ directory — use app/ directory directly
```

### `app/` (= Next.js `app/layout.tsx`)

Global initialization: providers, fonts, global CSS, root error boundaries.

---

## Segments (Technical Subdivisions)

Every slice has the same internal structure — **segments**:

| Segment   | Contains                                                |
| --------- | ------------------------------------------------------- |
| `ui/`     | React components for this slice                         |
| `model/`  | State management, business logic, custom hooks          |
| `api/`    | Data fetching, mutations (server actions or REST calls) |
| `lib/`    | Pure utilities specific to this slice                   |
| `config/` | Slice-specific constants and configuration              |

```
entities/lead/
├── ui/
│   ├── LeadCard.tsx
│   ├── LeadScoreBadge.tsx
│   └── LeadStatusSelect.tsx
├── model/
│   ├── use-lead-store.ts   # Zustand or Jotai slice
│   └── lead-helpers.ts
├── api/
│   ├── get-leads.ts
│   ├── update-lead-status.ts
│   └── delete-lead.ts
└── index.ts               # Public surface — ONLY export from here
```

---

## Public API (index.ts)

Each slice exposes **only** what other layers need via `index.ts`. Internal modules are private:

```typescript
// entities/lead/index.ts
// ✅ Export: public surface for the lead entity
export { LeadCard } from './ui/LeadCard';
export { LeadScoreBadge } from './ui/LeadScoreBadge';
export { useLeadStore } from './model/use-lead-store';
export { getLeads, updateLeadStatus } from './api';
export type { Lead, LeadStatus, LeadSource } from './model/types';

// ❌ NOT exported: internal implementation details
// do NOT re-export from LeadCard.tsx internals
```

---

## @x Cross-Slice Notation

When two slices on the same layer must communicate, use the `@x` notation to make the dependency explicit and auditable: [github](https://github.com/feature-sliced/documentation)

```typescript
// features/book-appointment/model/use-booking.ts

// ✅ Correct @x cross-slice import — explicit, visible to Steiger
import { useLeadStore } from 'entities/lead/@x/book-appointment';
//                                             ^^^^^^^^^^^^^^^^^^^
// entities/lead must explicitly expose this in @x/book-appointment.ts

// ❌ Wrong — direct deep import bypasses the public API
import { useLeadStore } from 'entities/lead/model/use-lead-store';
```

The slice being imported from must create the `@x/` file:

```typescript
// entities/lead/@x/book-appointment.ts
// Explicit cross-slice export for the book-appointment feature
export { useLeadStore } from '../model/use-lead-store';
```

---

## Layer Mapping in Next.js App Router

```
FSD Layer       Next.js Location
──────────────────────────────────────────────────
app/            src/app/layout.tsx (+ providers.tsx)
pages/          src/app/**/page.tsx (one-to-one mapping)
widgets/        src/widgets/ (imported by page.tsx)
features/       src/features/ (imported by widgets/)
entities/       src/entities/ (imported by features/ + widgets/)
shared/         src/shared/ (imported by all layers)
```

---

## References

- FSD Official Documentation — https://feature-sliced.design/docs/get-started/overview
- FSD GitHub Repository — https://github.com/feature-sliced/documentation
- FSD Tutorial (Real World App) — https://feature-sliced.design/docs/get-started/tutorial
- Mastering FSD: Lessons from Real Projects — https://dev.to/arjunsanthosh/mastering-feature-sliced-design-lessons-from-real-projects-2ida

---
