'use client';

/**
 * @file packages/marketing-components/src/hero/HeroWithTestimonials.tsx
 * @role component
 * @summary Hero with testimonials display
 *
 * Hero variant that includes customer testimonials.
 */

import { Card, Rating } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroTestimonial } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroWithTestimonialsProps extends BaseHeroProps {
  /** Testimonials to display */
  testimonials: HeroTestimonial[];
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Hero section with testimonials display.
 *
 * @param props - HeroWithTestimonialsProps
 * @returns Hero section component
 */
export function HeroWithTestimonials({
  title,
  subtitle,
  description,
  testimonials,
  cta,
  dualCta,
  className,
  children,
}: HeroWithTestimonialsProps) {
  return (
    <Section className={cn('relative', className)}>
      <Container className="py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {testimonials.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} variant="testimonial">
                  {testimonial.rating && (
                    <Rating value={testimonial.rating} readOnly size="sm" className="mb-4" />
                  )}
                  <p className="text-sm leading-6">{testimonial.content}</p>
                  <div className="mt-4 flex items-center gap-3">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium">{testimonial.author}</div>
                      {testimonial.role && (
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            {dualCta ? (
              <>
                <HeroCTAButton
                  {...dualCta.primary}
                  variant={dualCta.primary.variant || 'primary'}
                  size={dualCta.primary.size || 'large'}
                />
                <HeroCTAButton
                  {...dualCta.secondary}
                  variant={dualCta.secondary.variant || 'outline'}
                  size={dualCta.secondary.size || 'large'}
                />
              </>
            ) : cta ? (
              <HeroCTAButton
                {...cta}
                variant={cta.variant || 'primary'}
                size={cta.size || 'large'}
              />
            ) : null}
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}
