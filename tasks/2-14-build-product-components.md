# 2.14 Build Product Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel), 1.40 (Rating)

**Related Research:** §2.1, §4.2, §2.2, e-commerce patterns

**Objective:** 15+ Product variants with e-commerce features. L2.

**Requirements:**

- **Variants:** Grid, List, Featured Product, Product Card, Product Detail, With Gallery, With Reviews, Comparison, Related Products, Upsell, Cross-sell, Category Grid, Searchable, Filterable, With Wishlist (15+ total)
- **E-commerce Features:** Add to cart, wishlist, quick view, product comparison, reviews integration

**Files:** `packages/marketing-components/src/product/types.ts`, `ProductGrid.tsx`, `ProductCard.tsx`, `ProductDetail.tsx`, `ProductComparison.tsx`, `product/cart.tsx`, `product/wishlist.tsx`, `product/reviews.tsx`, `index.ts`

**API:** `ProductDisplay`, `ProductCard`, `ProductDetail`. Props: `variant`, `products` (array), `showCart`, `showWishlist`, `showReviews`, `onAddToCart`.

**Checklist:** Types; variants; e-commerce features; export.
**Done:** All 15+ variants render; cart integration works; wishlist functional; reviews display.
**Anti:** No payment processing; display and cart actions only.

---
