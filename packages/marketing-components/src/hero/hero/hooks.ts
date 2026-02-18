/**
 * @file packages/marketing-components/src/hero/hero/hooks.ts
 * @role hooks
 * @summary Custom hooks for hero components
 *
 * Provides reusable hooks for hero component functionality.
 */

import * as React from 'react';

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for carousel auto-play functionality
 */
export function useCarouselAutoPlay(
  slidesCount: number,
  autoPlay: boolean,
  interval: number
): [number, (index: number) => void] {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!autoPlay || slidesCount <= 1 || prefersReducedMotion) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slidesCount);
    }, interval);

    return () => clearInterval(id);
  }, [autoPlay, interval, slidesCount, prefersReducedMotion]);

  return [activeIndex, setActiveIndex];
}
