# 2.1 Build HeroVariants Components (Expanded)

**Status:** [🚫] BLOCKED | **Batch:** B | **Effort:** 24h | **Deps:** 1.7, 1.45 (Carousel)

**Related Research:** §2.1 (Atomic design, LCP), §4.2 (Core Web Vitals), §2.2 (Component patterns)

**Objective:** 20+ Hero variants with advanced composition system. Shared HeroProps with extensive customization. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, Video, Carousel, Image Background, Gradient Background, Animated Background, Minimal, Bold, Overlay, Split Image Left, Split Image Right, Split Content Left, Split Content Right, Fullscreen, Contained, With Stats, With Testimonials, With Features, With Form (20+ total)
- **Composition System:** Slots for header, content, footer, background, overlay, CTA area
- **Layout Options:** Full-width, contained, edge-to-edge, with sidebar
- **Content Variants:** Single CTA, dual CTA, no CTA, CTA with form, CTA with video
- **Image Options:** Single image, image gallery, parallax, lazy loading, responsive images
- **Video Options:** Background video, embedded video, YouTube/Vimeo integration, autoplay controls
- **Animation Options:** Fade in, slide up, zoom, parallax scroll, typewriter effect
- **Responsive Breakpoints:** Mobile-first, tablet, desktop, large desktop variants

**Files:** `packages/marketing-components/src/hero/types.ts`, `HeroCentered.tsx`, `HeroSplit.tsx`, `HeroVideo.tsx`, `HeroCarousel.tsx`, `HeroImageBackground.tsx`, `HeroGradient.tsx`, `HeroAnimated.tsx`, `HeroMinimal.tsx`, `HeroBold.tsx`, `HeroOverlay.tsx`, `HeroWithStats.tsx`, `HeroWithTestimonials.tsx`, `HeroWithFeatures.tsx`, `HeroWithForm.tsx`, `hero/composition.tsx`, `hero/hooks.ts`, `index.ts`

**API:** Discriminated unions `HeroProps`. Base: title, subtitle, primaryCta, secondaryCta, description, background, overlay. Variant-specific: image, video, carouselItems, stats, testimonials, features, form. Composition: `HeroHeader`, `HeroContent`, `HeroFooter`, `HeroBackground`, `HeroOverlay`, `HeroCTA`.

**Checklist:**

- 2.1a: Create types and composition system (4h)
- 2.1b: Build core variants (Centered, Split, Video, Carousel) (6h)
- 2.1c: Build background variants (Image, Gradient, Animated) (4h)
- 2.1d: Build content-enhanced variants (With Stats, With Testimonials, With Features, With Form) (6h)
- 2.1e: Add animations and responsive breakpoints (4h)
- next/image; lazy video; barrel; export.

**Done:** All 20+ variants render; composition system functional; LCP optimized; animations smooth; responsive breakpoints work.
**Anti:** No CMS adapter; variants defined in code only.

---
