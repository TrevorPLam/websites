/**
 * @file packages/marketing-components/src/utils/dynamic-imports.tsx
 * @role utility
 * @summary Dynamic import utilities for code splitting
 */

import React, { lazy, ComponentType } from 'react';

/**
 * Creates a lazy-loaded component with loading fallback
 * @param importFn - Function that imports the component
 * @param fallback - Optional fallback component to show while loading
 * @returns Lazy-loaded component
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(importFn);
}

/**
 * Predefined lazy-loaded components for optimal bundle splitting
 * Only includes components that exist and have default exports
 */

// Heavy hero components that are not always needed
export const LazyHeroCarousel = lazy(() =>
  import('../hero/HeroCarousel').then((mod) => ({ default: mod.HeroCarousel }))
);
export const LazyHeroVideo = lazy(() =>
  import('../hero/HeroVideo').then((mod) => ({ default: mod.HeroVideo }))
);
export const LazyHeroAnimated = lazy(() =>
  import('../hero/HeroAnimated').then((mod) => ({ default: mod.HeroAnimated }))
);
export const LazyHeroWithForm = lazy(() =>
  import('../hero/HeroWithForm').then((mod) => ({ default: mod.HeroWithForm }))
);

// Complex gallery components
export const LazyGalleryGrid = lazy(() =>
  import('../gallery/GalleryGrid').then((mod) => ({ default: mod.GalleryGrid }))
);

// Interactive components
export const LazyServiceTabs = lazy(() =>
  import('../services/ServiceTabs').then((mod) => ({ default: mod.ServiceTabs }))
);
export const LazyServiceAccordion = lazy(() =>
  import('../services/ServiceAccordion').then((mod) => ({ default: mod.ServiceAccordion }))
);

// Blog components that might not be on every page
export const LazyBlogMasonry = lazy(() =>
  import('../blog/BlogMasonry').then((mod) => ({ default: mod.BlogMasonry }))
);

// E-commerce components
export const LazyProductDetail = lazy(() =>
  import('../product/ProductDetail').then((mod) => ({ default: mod.ProductDetail }))
);

/**
 * Component loader with loading state management
 */
export interface ComponentLoaderProps {
  component: ComponentType<any>;
  isLoading?: boolean;
  fallback?: ComponentType<any>;
  props?: any;
}

export function ComponentLoader({
  component: Component,
  isLoading = false,
  fallback,
  props,
}: ComponentLoaderProps) {
  if (isLoading && fallback) {
    return React.createElement(fallback);
  }

  return React.createElement(Component, props);
}
