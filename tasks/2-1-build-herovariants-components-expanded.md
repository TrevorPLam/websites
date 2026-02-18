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

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-PERF**: LCP, INP, CLS, bundle budgets — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-perf) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-PERF](RESEARCH-INVENTORY.md#r-perf) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

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

### R-MARKETING — Hero section with composition slots
```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  children?: React.ReactNode;
}
export function HeroSection({ title, subtitle, primaryCta, secondaryCta, children }: HeroProps) {
  return (
    <section>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {primaryCta && <a href={primaryCta.href}>{primaryCta.label}</a>}
      {secondaryCta && <a href={secondaryCta.href}>{secondaryCta.label}</a>}
      {children}
    </section>
  );
}
```

### R-A11Y — Touch targets and reduced motion
```css
.hero-cta { min-width: 24px; min-height: 24px; }
```
Honor `prefers-reduced-motion` for any hero animations.

### R-PERF — LCP
- Hero &lt; 40 KB; use `next/image` with `priority` for above-the-fold hero image.

### Related Patterns
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-PERF - Research Findings](RESEARCH-INVENTORY.md#r-perf) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples

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

