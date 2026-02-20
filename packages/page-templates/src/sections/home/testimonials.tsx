/**
 * @file packages/page-templates/src/sections/home/testimonials.tsx
 * Purpose: Testimonials section adapter and registration.
 */
import { TestimonialCarousel } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function TestimonialsAdapter(_props: SectionProps) {
  return <TestimonialCarousel title="What Our Clients Say" testimonials={[]} />;
}

registerSection('testimonials', TestimonialsAdapter);
