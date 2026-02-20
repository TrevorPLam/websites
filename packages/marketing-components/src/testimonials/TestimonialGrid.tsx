'use client';

/**
 * @file packages/marketing-components/src/testimonials/TestimonialGrid.tsx
 * @role component
 * @summary Testimonial cards grid layout
 */

import { Card, Rating } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Testimonial } from './types';

export interface TestimonialGridProps {
  /** Section title */
  title?: string;
  /** Testimonials */
  testimonials: Testimonial[];
  /** Columns */
  columns?: 2 | 3;
  /** Custom CSS class name */
  className?: string;
}

function getContent(t: Testimonial): string {
  return t.quote ?? t.content ?? '';
}

export function TestimonialGrid({
  title,
  testimonials,
  columns = 3,
  className,
}: TestimonialGridProps) {
  const gridClasses = cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 md:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  );

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className={gridClasses}>
          {testimonials.map((t) => (
            <Card key={t.id} variant="testimonial">
              {t.rating != null && <Rating value={t.rating} readOnly size="sm" className="mb-4" />}
              <blockquote className="text-base">"{getContent(t)}"</blockquote>
              <footer className="mt-4">
                <cite className="font-semibold not-italic">{t.author.name}</cite>
                {t.author.role && <span className="text-muted-foreground"> — {t.author.role}</span>}
              </footer>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
