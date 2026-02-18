# 2.1 Build HeroVariants Components (Expanded)

## Metadata

- **Task ID**: 2-1-build-herovariants-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.45 (Carousel)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

20+ Hero variants with advanced composition system. Shared HeroProps with extensive customization. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, Video, Carousel, Image Background, Gradient Background, Animated Background, Minimal, Bold, Overlay, Split Image Left, Split Image Right, Split Content Left, Split Content Right, Fullscreen, Contained, With Stats, With Testimonials, With Features, With Form (20+ total)
- **Composition System:** Slots for header, content, footer, background, overlay, CTA area
- **Layout Options:** Full-width, contained, edge-to-edge, with sidebar
- **Content Variants:** Single CTA, dual CTA, no CTA, CTA with form, CTA with video
- **Image Options:** Single image, image gallery, parallax, lazy loading, responsive images
- **Video Options:** Background video, embedded video, YouTube/Vimeo integration, autoplay controls
- **Animation Options:** Fade in, slide up, zoom, parallax scroll, typewriter effect
- **Responsive Breakpoints:** Mobile-first, tablet, desktop, large desktop variants

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.45 (Carousel) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.45 (Carousel); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/hero/types.ts` – modify – (see task objective)
- `HeroCentered.tsx` – modify – (see task objective)
- `HeroSplit.tsx` – modify – (see task objective)
- `HeroVideo.tsx` – modify – (see task objective)
- `HeroCarousel.tsx` – modify – (see task objective)
- `HeroImageBackground.tsx` – modify – (see task objective)
- `HeroGradient.tsx` – modify – (see task objective)
- `HeroAnimated.tsx` – modify – (see task objective)
- `HeroMinimal.tsx` – modify – (see task objective)
- `HeroBold.tsx` – modify – (see task objective)
- `HeroOverlay.tsx` – modify – (see task objective)
- `HeroWithStats.tsx` – modify – (see task objective)
- `HeroWithTestimonials.tsx` – modify – (see task objective)
- `HeroWithFeatures.tsx` – modify – (see task objective)
- `HeroWithForm.tsx` – modify – (see task objective)
- `hero/composition.tsx` – modify – (see task objective)
- `hero/hooks.ts` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// Discriminated unions `HeroProps`. Base: title, subtitle, primaryCta, secondaryCta, description, background, overlay. Variant-specific: image, video, carouselItems, stats, testimonials, features, form. Composition: `HeroHeader`, `HeroContent`, `HeroFooter`, `HeroBackground`, `HeroOverlay`, `HeroCTA`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] All 20+ variants render
- [ ] composition system functional
- [ ] LCP optimized
- [ ] animations smooth
- [ ] responsive breakpoints work.

## Technical Constraints

- No CMS adapter
- variants defined in code only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

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

