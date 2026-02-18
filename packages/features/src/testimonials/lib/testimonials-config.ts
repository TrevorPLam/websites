/**
 * @file packages/features/src/testimonials/lib/testimonials-config.ts
 * Purpose: Testimonials feature configuration
 */

import type { Testimonial } from '@repo/marketing-components';

export interface TestimonialsFeatureConfig {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Layout variant */
  layout?: 'carousel' | 'grid' | 'marquee';
  /** Testimonials (config-based source) */
  testimonials?: Testimonial[];
}

export function createTestimonialsConfig(
  overrides: Partial<TestimonialsFeatureConfig> = {}
): TestimonialsFeatureConfig {
  return {
    layout: 'carousel',
    ...overrides,
  };
}
