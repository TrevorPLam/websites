/**
 * @file packages/marketing-components/src/testimonials/types.ts
 * @role types
 * @summary Shared types for testimonial components
 */

export interface Testimonial {
  id: string;
  quote?: string;
  content?: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    photo?: { src: string; alt: string };
    avatar?: string;
  };
  rating?: number;
}
