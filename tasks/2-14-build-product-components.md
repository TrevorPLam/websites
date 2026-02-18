# 2.14 Build Product Components

## Metadata

- **Task ID**: 2-14-build-product-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.45 (Carousel), 1.40 (Rating)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

15+ Product variants with e-commerce features. L2.

**Enhanced Requirements:**

- **Variants:** Grid, List, Featured Product, Product Card, Product Detail, With Gallery, With Reviews, Comparison, Related Products, Upsell, Cross-sell, Category Grid, Searchable, Filterable, With Wishlist (15+ total)
- **E-commerce Features:** Add to cart, wishlist, quick view, product comparison, reviews integration

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Upstream Task**: 1.40 (Rating) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.45 (Carousel), 1.40 (Rating)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2, e-commerce patterns

## Related Files

- `packages/marketing-components/src/product/types.ts` – modify – (see task objective)
- `ProductGrid.tsx` – modify – (see task objective)
- `ProductCard.tsx` – modify – (see task objective)
- `ProductDetail.tsx` – modify – (see task objective)
- `ProductComparison.tsx` – modify – (see task objective)
- `product/cart.tsx` – modify – (see task objective)
- `product/wishlist.tsx` – modify – (see task objective)
- `product/reviews.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `ProductDisplay`, `ProductCard`, `ProductDetail`. Props: `variant`, `products` (array), `showCart`, `showWishlist`, `showReviews`, `onAddToCart`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; e-commerce features; export.
- [ ] All 15+ variants render
- [ ] cart integration works
- [ ] wishlist functional
- [ ] reviews display.

## Technical Constraints

- No payment processing
- display and cart actions only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; e-commerce features; export.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

