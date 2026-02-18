/**
 * @file packages/features/src/testimonials/index.ts
 * Purpose: Testimonials feature barrel export
 */

export { TestimonialsSection } from './components/TestimonialsSection';
export type { TestimonialsSectionProps } from './components/TestimonialsSection';
export * from './lib/testimonials-config';
export { getTestimonialsFromConfig } from './lib/adapters/config';
