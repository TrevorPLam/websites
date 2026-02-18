/**
 * @file packages/marketing-components/src/hero/HeroCarousel.tsx
 * @role component
 * @summary Rotating hero slides with auto-play
 *
 * Carousel hero variant with multiple slides and optional auto-play.
 * Uses Carousel component from @repo/ui for accessibility.
 */

import { Container, Section } from '@repo/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@repo/ui';
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
  /** Enable auto-play */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds */
  interval?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show navigation dots */
  showDots?: boolean;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Carousel hero section with rotating slides.
 * Supports auto-play, navigation arrows, and dots.
 *
 * @param props - HeroCarouselProps
 * @returns Hero carousel component
 */
export function HeroCarousel({
  slides,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots: _showDots = true,
  className,
}: HeroCarouselProps) {
  if (!slides.length) return null;

  return (
    <Section className={cn('relative', className)}>
      <Carousel className="w-full" loop autoplay={autoPlay ? interval : undefined} showArrows={showArrows} showIndicators={_showDots}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative flex min-h-[500px] flex-col items-center justify-center text-center md:min-h-[600px]">
                {slide.image && (
                  <div className="absolute inset-0 -z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image.src}
                      alt={slide.image.alt}
                      className="h-full w-full object-cover"
                      width={slide.image.width}
                      height={slide.image.height}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
                  </div>
                )}
                <Container className="relative z-10">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl md:text-2xl">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.description && (
                    <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
                      {slide.description}
                    </p>
                  )}
                  {slide.cta && (
                    <div className="mt-10">
                      <HeroCTAButton {...slide.cta} variant={slide.cta.variant || 'primary'} size={slide.cta.size || 'large'} />
                    </div>
                  )}
                </Container>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && slides.length > 1 && (
          <>
            <CarouselPrevious className="text-white" />
            <CarouselNext className="text-white" />
          </>
        )}
      </Carousel>
    </Section>
  );
}
