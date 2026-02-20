/**
 * @file packages/page-templates/src/sections/about/about-testimonials.tsx
 * Purpose: About testimonials section adapter and registration.
 */
import { TestimonialCarousel } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function AboutTestimonialsAdapter(_props: SectionProps) {
  return <TestimonialCarousel testimonials={[]} />;
}

registerSection('about-testimonials', AboutTestimonialsAdapter);
