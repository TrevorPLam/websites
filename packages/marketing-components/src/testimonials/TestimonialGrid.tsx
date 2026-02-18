// File: packages/marketing-components/src/testimonials/TestimonialGrid.tsx
// Purpose: Static testimonial card grid
// Task: 2.4
// Status: Scaffolded - TODO: Implement

import * as React from 'react';
import type { Testimonial } from './TestimonialCarousel';

export interface TestimonialGridProps {
  testimonials: Testimonial[];
  columns?: 2 | 3;
  className?: string;
}

export function TestimonialGrid({ testimonials, columns = 3, className }: TestimonialGridProps) {
  // TODO: Implement grid layout
  return (
    <div className={className}>
      {testimonials.map((testimonial) => (
        <div key={testimonial.id}>
          <blockquote>{testimonial.quote}</blockquote>
          <cite>{testimonial.author.name}</cite>
        </div>
      ))}
    </div>
  );
}
