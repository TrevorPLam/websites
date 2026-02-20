'use client';

/**
 * @file packages/marketing-components/src/testimonials/TestimonialCarousel.tsx
 * @role component
 * @summary Auto-rotating testimonial quotes carousel
 */

import { Card, Rating } from '@repo/ui';
import { Carousel, CarouselContent, CarouselItem } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import type { Testimonial } from './types';

export interface TestimonialCarouselProps {
  /** Section title */
  title?: string;
  /** Testimonials */
  testimonials: Testimonial[];
  /** Auto-play interval (ms); 0 to disable */
  autoPlay?: number;
  /** Custom CSS class name */
  className?: string;
}

function getContent(t: Testimonial): string {
  return t.quote ?? t.content ?? '';
}

/**
 * Testimonial carousel component.
 *
 * @param props - TestimonialCarouselProps
 * @returns Testimonial carousel component
 */
export function TestimonialCarousel({
  title,
  testimonials,
  autoPlay,
  className,
}: TestimonialCarouselProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <Carousel className="w-full" loop autoplay={autoPlay} showArrows showIndicators>
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.id}>
                <Card variant="testimonial">
                  {t.rating != null && (
                    <Rating value={t.rating} readOnly size="sm" className="mb-4" />
                  )}
                  <blockquote className="text-lg">"{getContent(t)}"</blockquote>
                  <footer className="mt-4">
                    <cite className="font-semibold not-italic">{t.author.name}</cite>
                    {t.author.role && (
                      <span className="text-muted-foreground"> — {t.author.role}</span>
                    )}
                  </footer>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </Section>
  );
}
