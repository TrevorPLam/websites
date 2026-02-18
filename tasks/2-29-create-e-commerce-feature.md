# 2.29 Create E-commerce Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 28h | **Deps:** 2.11, 2.14

**Related Research:** §5.1 (Spec-driven), headless commerce

**Objective:** E-commerce feature with 5+ implementation patterns and headless commerce support.

**Implementation Patterns:** Config-Based, Headless-Commerce-Based, API-Based, CMS-Based, Hybrid (5+ total)

**Files:** `packages/features/src/ecommerce/` (index, lib/schema, lib/adapters, lib/ecommerce-config.ts, lib/headless.ts, lib/cart.ts, lib/checkout.ts, components/EcommerceSection.tsx, components/EcommerceConfig.tsx, components/EcommerceHeadless.tsx, components/EcommerceAPI.tsx, components/EcommerceCMS.tsx, components/EcommerceHybrid.tsx)

**API:** `EcommerceSection`, `ecommerceSchema`, `createEcommerceConfig`, `addToCart`, `checkout`, `processPayment`, `EcommerceConfig`, `EcommerceHeadless`, `EcommerceAPI`, `EcommerceCMS`, `EcommerceHybrid`

**Checklist:** Schema; adapters; headless commerce; cart; checkout; implementation patterns; export.
**Done:** Builds; all patterns work; headless commerce functional; cart and checkout work.
**Anti:** No payment processing; integration only.

---
