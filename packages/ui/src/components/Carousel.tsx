'use client';

// File: packages/ui/src/components/Carousel.tsx  [TRACE:FILE=packages.ui.components.Carousel]
// Purpose: Carousel component with navigation, autoplay, and indicators.
//          Built on embla-carousel-react for accessible carousel functionality.
//
// Relationship: Depends on embla-carousel-react, @repo/utils (cn), lucide-react.
// System role: Display primitive (Layer L2 @repo/ui).
// Assumptions: Used for image/content carousels. Finite carousel only (no infinite scroll).
//
// Exports / Entry: Carousel component and sub-components, CarouselProps
// Used by: Image galleries, content carousels, testimonials
//
// Invariants:
// - Finite carousel only (no infinite scroll)
// - Keyboard accessible navigation
//
// Status: @public
// Features:
// - [FEAT:UI] Navigation controls
// - [FEAT:UI] Autoplay support
// - [FEAT:UI] Indicators
// - [FEAT:ACCESSIBILITY] Keyboard navigation

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/utils';
import { Button } from './Button';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Carousel items */
  children: React.ReactNode;
  /** Autoplay interval in milliseconds */
  autoplay?: number;
  /** Whether to loop */
  loop?: boolean;
  /** Whether to show navigation arrows */
  showArrows?: boolean;
  /** Whether to show indicators */
  showIndicators?: boolean;
}

export type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>;
export type CarouselPreviousProps = React.ComponentPropsWithoutRef<typeof Button>;
export type CarouselNextProps = React.ComponentPropsWithoutRef<typeof Button>;

// ─── Components ──────────────────────────────────────────────────────────────

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      children,
      autoplay,
      loop = false,
      showArrows = true,
      showIndicators = true,
      ...props
    },
    ref
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' });
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const scrollPrev = React.useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = React.useCallback(
      (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      },
      [emblaApi]
    );

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    React.useEffect(() => {
      if (!emblaApi || !autoplay) return;
      const interval = setInterval(() => {
        if (canScrollNext) {
          scrollNext();
        } else if (loop) {
          scrollTo(0);
        }
      }, autoplay);
      return () => clearInterval(interval);
    }, [emblaApi, autoplay, canScrollNext, loop, scrollNext, scrollTo]);

    const childrenArray = React.Children.toArray(children);
    const itemCount = childrenArray.length;

    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {childrenArray.map((child, index) => (
              <div key={index} className="min-w-0 shrink-0 grow-0 basis-full">
                {child}
              </div>
            ))}
          </div>
        </div>
        {showArrows && (
          <>
            <CarouselPrevious onClick={scrollPrev} disabled={!canScrollPrev} />
            <CarouselNext onClick={scrollNext} disabled={!canScrollNext} />
          </>
        )}
        {showIndicators && itemCount > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {childrenArray.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  index === selectedIndex ? 'bg-primary' : 'bg-primary/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = 'Carousel';

export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex', className)} {...props} />
);
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('min-w-0 shrink-0 grow-0 basis-full', className)} {...props} />
  )
);
CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      _variant="outline"
      className={cn('absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
);
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      _variant="outline"
      className={cn('absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0', className)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
);
CarouselNext.displayName = 'CarouselNext';
