// File: packages/infra/spacing/hooks.ts  [TRACE:FILE=packages.infra.spacing.hooks]
// Purpose: React hooks for responsive spacing. Provides hooks that observe viewport
//          breakpoints and return appropriate spacing scale values for fluid layouts.
//
// System role: Client-side hooks — requires 'use client' at call site.
// Entry point: import from '@repo/infrastructure/spacing'
//
// Exports / Entry: useResponsiveSpacing, useSpacingScale
// Used by: UI components needing responsive spacing logic in JavaScript
//
// Invariants:
// - Hooks must only be called inside React components or custom hooks
// - SSR-safe: returns default (mobile) spacing until hydration completes
// - Breakpoints match Tailwind CSS defaults (sm: 640, md: 768, lg: 1024, xl: 1280)
//
// Status: @public
// Features:
// - [FEAT:SPACING] Responsive spacing hooks

'use client';

import { useState, useEffect } from 'react';
import type { SemanticSpacingKey } from './scale';
import { getSemanticSpacing } from './utils';

/** Standard Tailwind breakpoints in pixels */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

/** Responsive spacing config: specify different spacing per breakpoint */
export interface ResponsiveSpacingConfig {
  base: SemanticSpacingKey;
  sm?: SemanticSpacingKey;
  md?: SemanticSpacingKey;
  lg?: SemanticSpacingKey;
  xl?: SemanticSpacingKey;
}

/**
 * Returns the active spacing alias based on the current viewport width.
 * Falls back to `base` during SSR.
 *
 * @example
 * const spacing = useResponsiveSpacing({ base: 'sm', md: 'md', lg: 'lg' });
 * // returns 'sm' on mobile, 'md' on tablet, 'lg' on desktop
 */
export function useResponsiveSpacing(config: ResponsiveSpacingConfig): SemanticSpacingKey {
  const [active, setActive] = useState<SemanticSpacingKey>(config.base);

  useEffect(() => {
    function resolve(): SemanticSpacingKey {
      const width = window.innerWidth;
      if (config.xl && width >= BREAKPOINTS.xl) return config.xl;
      if (config.lg && width >= BREAKPOINTS.lg) return config.lg;
      if (config.md && width >= BREAKPOINTS.md) return config.md;
      if (config.sm && width >= BREAKPOINTS.sm) return config.sm;
      return config.base;
    }

    setActive(resolve());

    const observer = new ResizeObserver(() => setActive(resolve()));
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [config.base, config.sm, config.md, config.lg, config.xl]);

  return active;
}

/**
 * Returns the raw spacing value (px and rem) for a semantic alias.
 * Useful when you need the numeric values rather than CSS class names.
 *
 * @example
 * const { px, rem } = useSpacingScale('md');
 * // { px: 16, rem: 1 }
 */
export function useSpacingScale(alias: SemanticSpacingKey) {
  return getSemanticSpacing(alias);
}

/**
 * Returns the current breakpoint name based on window width.
 * SSR-safe: returns 'base' until hydration.
 */
export function useBreakpoint(): Breakpoint | 'base' {
  const [bp, setBp] = useState<Breakpoint | 'base'>('base');

  useEffect(() => {
    function resolve(): Breakpoint | 'base' {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS['2xl']) return '2xl';
      if (width >= BREAKPOINTS.xl) return 'xl';
      if (width >= BREAKPOINTS.lg) return 'lg';
      if (width >= BREAKPOINTS.md) return 'md';
      if (width >= BREAKPOINTS.sm) return 'sm';
      return 'base';
    }

    setBp(resolve());
    const observer = new ResizeObserver(() => setBp(resolve()));
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return bp;
}
