/**
 * @file packages/infrastructure/layout/src/responsive.ts
 * Task: [F.4] Layout system — responsive breakpoints and hooks
 *
 * Purpose: Breakpoint definitions, useBreakpoint hook, responsive value resolution.
 *          Follows Tailwind CSS default breakpoints. SSR-safe (returns false
 *          for all breakpoints on the server until hydration).
 *
 * Exports: BREAKPOINTS, Breakpoint, useBreakpoint, useMediaQuery,
 *          resolveResponsiveValue, ResponsiveValue
 *
 * Invariants:
 * - Breakpoints match Tailwind CSS v4 defaults exactly
 * - All hooks are SSR-safe: return defaults before hydration
 * - `resolveResponsiveValue` is pure — no side effects
 */

'use client';

import { useState, useEffect } from 'react';

// ─── Breakpoint constants ─────────────────────────────────────────────────────

/** Tailwind CSS default breakpoints in pixels */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Ordered from smallest to largest */
export const BREAKPOINT_ORDER: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];

// ─── useMediaQuery ────────────────────────────────────────────────────────────

/**
 * Returns true when the given CSS media query matches.
 * SSR-safe: returns `defaultValue` (default false) until mounted.
 *
 * @example
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ─── useBreakpoint ────────────────────────────────────────────────────────────

export interface BreakpointState {
  /** Active breakpoints (all that are currently ≥ min-width) */
  active: Set<Breakpoint>;
  /** The largest currently-active breakpoint, or null on small screens */
  current: Breakpoint | null;
  /** True when viewport width ≥ sm (640px) */
  sm: boolean;
  /** True when viewport width ≥ md (768px) */
  md: boolean;
  /** True when viewport width ≥ lg (1024px) */
  lg: boolean;
  /** True when viewport width ≥ xl (1280px) */
  xl: boolean;
  /** True when viewport width ≥ 2xl (1536px) */
  '2xl': boolean;
}

const DEFAULT_BREAKPOINT_STATE: BreakpointState = {
  active: new Set(),
  current: null,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  '2xl': false,
};

/**
 * Tracks which Tailwind breakpoints are active based on viewport width.
 * Uses a single ResizeObserver (falling back to window resize) for efficiency.
 *
 * @example
 * const { lg, current } = useBreakpoint();
 * return <div className={lg ? 'grid-cols-3' : 'grid-cols-1'} />;
 */
export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(DEFAULT_BREAKPOINT_STATE);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      const active = new Set<Breakpoint>();
      let current: Breakpoint | null = null;

      for (const bp of BREAKPOINT_ORDER) {
        if (width >= BREAKPOINTS[bp]) {
          active.add(bp);
          current = bp;
        }
      }

      setState({
        active,
        current,
        sm: active.has('sm'),
        md: active.has('md'),
        lg: active.has('lg'),
        xl: active.has('xl'),
        '2xl': active.has('2xl'),
      });
    }

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return state;
}

// ─── Responsive value resolution ─────────────────────────────────────────────

/**
 * A value that can differ across breakpoints.
 * Use a plain value for all breakpoints, or an object for per-breakpoint values.
 *
 * @example
 * const cols: ResponsiveValue<number> = { base: 1, md: 2, lg: 3 };
 */
export type ResponsiveValue<T> =
  | T
  | Partial<Record<Breakpoint, T>> & { base: T };

/**
 * Resolves a `ResponsiveValue<T>` to a concrete value given the active breakpoints.
 * Walks breakpoints from largest to smallest and returns the first match.
 *
 * @example
 * resolveResponsiveValue({ base: 1, md: 2, lg: 3 }, new Set(['sm', 'md']))
 * // → 2  (md is active, lg is not)
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  active: Set<Breakpoint>
): T {
  if (typeof value !== 'object' || value === null || !('base' in value)) {
    return value as T;
  }

  const responsive = value as Partial<Record<Breakpoint, T>> & { base: T };

  // Walk from largest to smallest
  for (let i = BREAKPOINT_ORDER.length - 1; i >= 0; i--) {
    const bp = BREAKPOINT_ORDER[i];
    if (bp !== undefined && active.has(bp) && bp in responsive) {
      const resolved = responsive[bp];
      if (resolved !== undefined) return resolved;
    }
  }

  return responsive.base;
}

/**
 * Hook that resolves a `ResponsiveValue<T>` reactively.
 *
 * @example
 * const cols = useResponsiveValue({ base: 1, md: 2, lg: 3 });
 */
export function useResponsiveValue<T>(value: ResponsiveValue<T>): T {
  const { active } = useBreakpoint();
  return resolveResponsiveValue(value, active);
}
