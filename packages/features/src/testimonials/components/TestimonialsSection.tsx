/**
 * @file packages/features/src/testimonials/components/TestimonialsSection.tsx
 * Purpose: Testimonials section using marketing-components display variants
 */

import {
  TestimonialCarousel,
  TestimonialGrid,
  TestimonialMarquee,
} from '@repo/marketing-components';
import type { Testimonial } from '@repo/marketing-components';
import type { TestimonialsFeatureConfig } from '../lib/testimonials-config';

export interface TestimonialsSectionProps extends TestimonialsFeatureConfig {
  /** Pre-loaded testimonials (overrides config when provided) */
  testimonials?: Testimonial[];
}

export function TestimonialsSection({
  title,
  description,
  layout = 'carousel',
  testimonials: propsTestimonials,
  ...rest
}: TestimonialsSectionProps) {
  const config = rest as TestimonialsFeatureConfig;
  const items = propsTestimonials ?? config.testimonials ?? [];

  if (items.length === 0) return null;

  const common = { title, testimonials: items };

  switch (layout) {
    case 'grid':
      return <TestimonialGrid {...common} />;
    case 'marquee':
      return <TestimonialMarquee {...common} />;
    default:
      return <TestimonialCarousel {...common} />;
  }
}
