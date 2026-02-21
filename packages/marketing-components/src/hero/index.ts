/**
 * @file packages/marketing-components/src/hero/index.ts
 * @role barrel
 * @summary Hero component variants barrel export
 *
 * Exports all hero component variants and related types/utilities.
 */

// Main hero variants
export { HeroCentered } from './HeroCentered';
export type { HeroCenteredProps } from './HeroCentered';

export { HeroSplit } from './HeroSplit';
export type { HeroSplitProps } from './HeroSplit';

export { HeroSplitImageLeft } from './HeroSplitImageLeft';
export { HeroSplitImageRight } from './HeroSplitImageRight';

export { HeroVideo } from './HeroVideo';
export type { HeroVideoProps } from './HeroVideo';

export { HeroCarousel } from './HeroCarousel';
export type { HeroCarouselProps, HeroSlide } from './HeroCarousel';

export { HeroImageBackground } from './HeroImageBackground';
export type { HeroImageBackgroundProps } from './HeroImageBackground';

export { HeroGradient } from './HeroGradient';
export type { HeroGradientProps } from './HeroGradient';

export { HeroAnimated } from './HeroAnimated';
export type { HeroAnimatedProps } from './HeroAnimated';

export { HeroMinimal } from './HeroMinimal';
export type { HeroMinimalProps } from './HeroMinimal';

export { HeroBold } from './HeroBold';
export type { HeroBoldProps } from './HeroBold';

export { HeroOverlay } from './HeroOverlay';
export type { HeroOverlayProps } from './HeroOverlay';

export { HeroWithStats } from './HeroWithStats';
export type { HeroWithStatsProps } from './HeroWithStats';

export { HeroWithTestimonials } from './HeroWithTestimonials';
export type { HeroWithTestimonialsProps } from './HeroWithTestimonials';

export { HeroWithFeatures } from './HeroWithFeatures';
export type { HeroWithFeaturesProps } from './HeroWithFeatures';

export { HeroWithForm } from './HeroWithForm';
export type { HeroWithFormProps } from './HeroWithForm';

export { HeroFullscreen } from './HeroFullscreen';
export type { HeroFullscreenProps } from './HeroFullscreen';

export { HeroContained } from './HeroContained';
export type { HeroContainedProps } from './HeroContained';

// Loading skeletons
export { HeroSkeleton } from './HeroSkeleton';
export type { HeroSkeletonProps } from './HeroSkeleton';

// Types
export type {
  BaseHeroProps,
  HeroCTA,
  HeroDualCTA,
  HeroImage,
  HeroVideo as HeroVideoConfig,
  HeroEmbeddedVideo,
  HeroLayout,
  HeroAnimation,
  HeroSlots,
  HeroStat,
  HeroTestimonial,
  HeroFeature,
} from './types';

// Composition helpers
export {
  HeroHeader,
  HeroContent,
  HeroFooter,
  HeroBackground,
  HeroOverlaySlot,
  HeroCTAArea,
} from './hero/composition';

// Hooks
export { useReducedMotion, useCarouselAutoPlay } from './hero/hooks';
