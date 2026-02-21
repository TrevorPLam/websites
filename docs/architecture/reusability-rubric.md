<!--
@file docs/architecture/reusability-rubric.md
@role Architecture documentation — component and package reusability standards
@summary Decision framework for determining when code belongs in @repo/* packages vs
  client-local, and how to classify components on a reusability scale from 1 (one-off)
  to 5 (universal primitives). Implements docs-6-1.
@invariants
  - All new components must be scored before placement
  - Score ≥ 3 → candidate for @repo/ui or @repo/features
  - Score ≤ 2 → client-local or @repo/marketing-components family
  - Scores are advisory; senior judgment overrides
@gotchas
  - Marketing components (testimonials, hero, CTA) score 3-4 but live in @repo/marketing-components
    not @repo/ui — UI is for primitives, marketing-components for domain-specific families
  - Integration-specific types (HubSpotContact) must NOT cross into @repo/features
  - Client-specific business logic always stays in clients/*
@verification
  - Run this rubric during code review for all new components
  - Quarterly architecture review includes scoring audit
@status active — Task docs-6-1 implemented 2026-02-21
-->

# Component Reusability Rubric

## Purpose

This rubric guides the decision of where to place code in the monorepo.
Consistent placement decisions reduce coupling, enable reuse, and keep
the dependency graph clean.

## The 5-Point Reusability Scale

| Score | Label                    | Description                                                | Home                                       |
| ----- | ------------------------ | ---------------------------------------------------------- | ------------------------------------------ |
| 5     | Universal primitive      | Works across any web project. No domain knowledge.         | `@repo/ui`                                 |
| 4     | Domain-generic           | Works across any marketing site. Light domain awareness.   | `@repo/ui` or `@repo/features`             |
| 3     | Industry-adaptable       | Works across 3+ industries with minor config.              | `@repo/marketing-components`               |
| 2     | Client-category specific | Works within a single industry category (e.g. all salons). | `clients/` or `@repo/marketing-components` |
| 1     | Client-specific          | Tied to one client's brand/data/logic.                     | `clients/<name>/`                          |

## Scoring Dimensions

Score each dimension 1–5, then average to get the rubric score.

### 1. Dependency Generality

- 5: No external domain dependencies
- 3: Depends on @repo/types canonical types only
- 1: Depends on client-specific data shapes

### 2. Configuration Surface

- 5: All behaviour driven by props/config
- 3: Some hardcoded assumptions (extractable)
- 1: Hardcoded to one client's requirements

### 3. Cross-Industry Applicability

- 5: Applies to every industry (button, card, input)
- 3: Applies to 3+ industries (testimonials, hero, CTA)
- 1: Specific to one industry (dental appointment picker)

### 4. Coupling to Integration Providers

- 5: No integration coupling
- 3: Loose coupling via adapter interface
- 1: Direct dependency on HubSpot, Calendly, etc.

### 5. Test Coverage Feasibility

- 5: Easily unit tested in isolation
- 3: Requires mocking integration adapters
- 1: Requires full client environment

## Placement Decision Tree

```
Component scored?
    │
    ├── Score ≥ 4 → @repo/ui (primitive)
    │
    ├── Score 3–4, domain-specific → @repo/marketing-components (family)
    │
    ├── Score 3, feature-logic → @repo/features (feature module)
    │
    ├── Score 2, multi-client shared → Consider @repo/marketing-components
    │
    └── Score ≤ 2, client-only → clients/<name>/components/
```

## Layer Model Summary

```
L0: @repo/infra, @repo/integrations-*     (infrastructure)
L2: @repo/ui, @repo/features, @repo/types (components + domain)
L2: @repo/marketing-components            (marketing families)
L3: clients/*                             (client-specific)
```

**Allowed import direction:** L0 ← L2 ← L3 only. Never upward.

## Examples

### @repo/ui (Score 4–5)

- `Button`, `Input`, `Dialog`, `Card`, `Toast`
- No business logic. Props-only. Any project could use them.

### @repo/marketing-components (Score 3–4)

- `TestimonialsSection`, `HeroSection`, `CTASection`, `PricingSection`
- Marketing-specific but industry-agnostic. Configured via site.config.ts.

### @repo/features (Score 3–4, with logic)

- `BookingFeature`, `ContactFeature`, `BlogFeature`
- Contains business logic, validation, server actions.
- Must use canonical @repo/types, not integration-specific types.

### clients/<name>/components (Score 1–2)

- `LuxeSalonHeroVideo`, `BistroMenuAccordion`
- Brand-specific. Cannot be generalized without significant refactoring.

## Anti-Patterns

| Anti-Pattern                                     | Problem               | Fix                                            |
| ------------------------------------------------ | --------------------- | ---------------------------------------------- |
| HubSpotContact type in @repo/features            | Integration coupling  | Use CanonicalLead from @repo/types             |
| @clients/luxe-salon imported in @clients/bistro  | Cross-client coupling | Move shared code to @repo/marketing-components |
| @repo/ui/src/components/Button imported directly | Deep import violation | Use `@repo/ui` public export                   |
| Business logic in @repo/ui                       | Layer violation       | Move to @repo/features                         |

## Process: Adding a New Component

1. Score the component on all 5 dimensions
2. Average → placement decision
3. If borderline (score 2.5–3.5), discuss in PR with `architecture` label
4. Document placement rationale in file header (`@role` field)
5. Run `pnpm lint` to verify no boundary violations

## Related

- [Module Boundaries](./module-boundaries.md)
- [ESLint Boundary Rules](../../packages/config/eslint-config/boundaries.js)
- Task: `tasks/docs-6-1-reusability-rubric.md`
