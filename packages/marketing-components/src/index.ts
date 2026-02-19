// Marketing components barrel export

// Types (TeamMember, Testimonial, GalleryItem, PricingPlan)
export * from './types';

// Gallery submodule — GalleryGrid (GalleryItem comes from ./types)
export { GalleryGrid } from './gallery/GalleryGrid';
export type { GalleryGridProps } from './gallery/GalleryGrid';

// Team submodule — uses member (singular) API on TeamDetailed; TeamMember comes from ./types
export { TeamGrid } from './team/TeamGrid';
export type { TeamGridProps } from './team/TeamGrid';
export { TeamCarousel } from './team/TeamCarousel';
export type { TeamCarouselProps } from './team/TeamCarousel';
export { TeamDetailed } from './team/TeamDetailed';
export type { TeamDetailedProps } from './team/TeamDetailed';

// Component families
export * from './components/Testimonials';
export * from './components/Gallery';
export * from './components/Pricing';
export * from './components/Hero';
export * from './components/CTA';
export * from './components/Services';
export * from './components/Blog';
export * from './components/Industry';
