/**
 * @file packages/features/src/gallery/index.ts
 * Purpose: Gallery feature barrel export
 */

export { GallerySection } from './components/GallerySection';
export type { GallerySectionProps } from './components/GallerySection';
export * from './lib/gallery-config';
export { getGalleryFromConfig } from './lib/adapters/config';
