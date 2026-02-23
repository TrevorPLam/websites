<!--
/**
 * @file feature-sliced-design-docs.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for feature sliced design docs.
 * @entrypoints docs/guides/feature-sliced-design-docs.md
 * @exports feature sliced design docs
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# Feature-Sliced Design (FSD) 2.1: Official Documentation

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Introduction

Feature-Sliced Design (FSD) is an architectural methodology for structuring frontend applications. It aims to bring order to projects by establishing conventions for separating business logic from UI components, enforcing modularity, and managing dependencies. Version 2.1 introduces a significant shift in thinking, moving from an entity-first decomposition to a "pages-first" approach .

## 1. Core Philosophy: "Pages-First"

In FSD 2.0, developers were encouraged to identify the smallest pieces of business logic (`entities` and `features`) first and then compose them into `widgets` and `pages`. Version 2.1 flips this model on its head.

The new recommendation is to start development from the **pages** . Most developers naturally think in terms of pages (e.g., a product page, a checkout page, a settings page). By keeping more code within the page itself—its UI, forms, and data logic—you achieve higher cohesion. Code that is only used on a single page should stay there, even if it represents what was previously considered a "feature" .

This approach simplifies onboarding, reduces the need for abstract business modeling, and makes code navigation more intuitive. The goal is to only extract code to lower layers (`features`, `entities`, `shared`) when it is demonstrably reused across multiple pages .

## 2. Project Structure: Layers and Slices

An FSD project is organized into a strict hierarchy of **layers**. Each layer contains **slices**, which are modules grouped by business domain. Slices are further divided into **segments** for technical code organization.

### 2.1 The Standard Layers (from top to bottom)

The layers are rigid and define the direction of imports: code can only be imported by layers above it.

1.  **app:** The application's core. Contains global styles, providers, routing, and the main application entry point. This layer is the composition root.
2.  **pages:** Represents entire pages of the application. In FSD 2.1, pages are the primary unit of decomposition and contain most of the application's logic.
3.  **widgets:** Standalone UI components that are complex and used across different pages (e.g., a header, a sidebar, a product card grid). They can now contain their own logic if not reused elsewhere .
4.  **features:** Reusable user interactions and business logic that implement a specific use case (e.g., `AddToCart`, `UserLoginForm`, `ProductSearch`). These are extracted from pages when reuse is needed.
5.  **entities:** Business entities that represent the core data model (e.g., `User`, `Product`, `Order`). These define the structure and logic for interacting with core business objects.
6.  **shared:** Reusable technical kit, independent of the business domain. Contains UI kit components, helpers, API clients, configurations, and utilities. This layer has the strictest rules: it cannot import from any other layer.

### 2.2 Segments: Organizing Code Within a Slice

Within each slice (e.g., `features/add-to-cart`), code is organized by its technical purpose into **segments**. Common segment names include:

- `ui/`: UI components
- `model/`: Business logic, stores, and hooks (e.g., Zustand stores, TanStack Query logic)
- `lib/`: Helper functions and utilities specific to the slice
- `api/`: Server interaction logic (e.g., API functions)
- `config/`: Configuration specific to the slice

This internal organization provides consistency and makes it easy to find different types of code within a module.

### 2.3 Shared Layer Clarifications

In FSD 2.1, it's explicitly allowed to store application-aware code in the `shared` layer, as long as it is not **business logic**. This includes things like route constants, a company logo, or the base configuration for an API client. The rule is about reusability without domain context, not about being completely agnostic .

## 3. Cross-Communication: The `@x` Notation

One of the key additions in FSD 2.1 is the standardization of cross-imports between slices on the same layer using the `@x` notation . While generally discouraged, there are legitimate cases where one feature (e.g., `feature/A`) needs to use a type from another feature (e.g., `feature/B`).

To make these exceptions explicit and searchable, FSD introduced the `@x` convention. The importing slice creates a special public API file specifically for cross-imports.

**Example Directory Structure:**

```
src/
├── entities/
│   ├── A/
│   │   ├── @x/
│   │   │   └── B.ts        # Re-exports types from A for use in B
│   │   ├── index.ts        # Main public API
│   │   └── ...
│   └── B/
│       ├── some-file.ts
│       └── ...
```

**Example Usage in `entities/B/some-file.ts`:**

```typescript
// Explicitly importing a type from the cross-import API of 'A'
import type { EntityA } from 'entities/A/@x/B';
```

This notation makes the cross-dependency visually distinct and easier to manage or refactor later .

## 4. Migration Guide

For teams migrating from FSD 2.0 to 2.1, the official migration guide is available at [feature-sliced.design/docs/guides/migration/from-v2-0](https://feature-sliced.design/docs/guides/migration/from-v2-0). Key migration steps include:

1. **Start with new pages** - Apply pages-first thinking to new features first
2. **Gradual refactoring** - Move page-specific code from features/widgets back to pages over time
3. **Update team training** - Focus on page-based decomposition rather than entity identification
4. **Review Shared layer** - Move appropriate application-aware code to Shared as now explicitly allowed

This is a non-breaking change, so existing FSD 2.0 projects can continue working while teams adopt the new mental model incrementally.

## 5. Conclusion

FSD 2.1 is a pragmatic evolution of the methodology. By prioritizing the "pages-first" mental model, it lowers the barrier to entry while still providing the necessary structure for scalable, maintainable frontend applications. The introduction of tools like Steiger and conventions like the `@x` notation provide the necessary support to enforce and navigate this architecture.


--- 

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns


## Overview

[Add content here]


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
