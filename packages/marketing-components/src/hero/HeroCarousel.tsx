'use client';

/**
 * @file packages/marketing-components/src/hero/HeroCarousel.tsx
 * @role component
 * @summary Rotating hero slides with auto-play
 *
 * Carousel hero variant with multiple slides and optional auto-play.
 * Uses Carousel component from @repo/ui for accessibility.
 */

import { Container, Section } from '@repo/ui';
import { Carousel, CarouselContent, CarouselItem } from '@repo/ui';
import { HeroCTAButton } from './hero/cta';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroImage } from './types';

export interface HeroSlide extends BaseHeroProps {
  /** Slide image */
  image?: HeroImage;
  /** Single CTA button */
  cta?: HeroCTA;
}

export interface HeroCarouselProps {
  /** Array of hero slides */
  slides: HeroSlide[];
  /**
   * Enable auto-play. When true, slides advance automatically every `interval` ms.
   * Passed to Carousel as `autoplay={interval}` (number) or `undefined` (disabled).
   */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds (default: 5000). Only used when autoPlay=true. */
  interval?: number;
  /**
   * Show navigation arrows.
   * Forwarded directly to Carousel's `showArrows` prop.
   */
  showArrows?: boolean;
  /**
   * Show navigation dots / indicators.
   * FIX: was destructured as `_showDots` (underscore prefix = intentionally unused)
   * but the value must be forwarded to Carousel's `showIndicators` prop.
   * Renamed to `showDots` and now correctly wired through.
   */
  showDots?: boolean;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Carousel hero section with rotating slides.
 * Supports auto-play, navigation arrows, and dot indicators.
 *
 * FIX summary (HeroCarousel props -> Carousel props mapping):
 *   autoPlay (boolean) + interval (ms) -> autoplay?: number   (pass interval when enabled)
 *   showArrows (boolean)               -> showArrows?: boolean (was not forwarded)
 *   showDots (boolean)                 -> showIndicators?: boolean (was aliased _showDots, never forwarded)
 *
 * CarouselNext / CarouselPrevious sub-components are removed: Carousel handles
 * its own arrows internally via showArrows. Rendering them externally caused
 * duplicate arrow buttons with no Embla API context.
 *
 * @param props - HeroCarouselProps
 * @returns Hero carousel component
 */
export function HeroCarousel({
  slides,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className,
}: HeroCarouselProps) {
  if (!slides.length) return null;

  return (
    <Section className={cn('relative overflow-hidden', className)}>
      <Carousel
        loop
        autoplay={autoPlay ? interval : undefined}
        showArrows={showArrows}
        showIndicators={showDots}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative flex min-h-[500px] flex-col items-center justify-center">
                {slide.image && (
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image.src}
                      alt={slide.image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <Container className="relative z-10 text-center">
                  <h1 className="text-4xl font-bold">{slide.title}</h1>
                  {slide.subtitle && <p className="mt-2 text-xl">{slide.subtitle}</p>}
                  {slide.description && <p className="mt-4 text-base">{slide.description}</p>}
                  {slide.cta && (
                    <div className="mt-6">
                      <HeroCTAButton {...slide.cta} />
                    </div>
                  )}
                </Container>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}
