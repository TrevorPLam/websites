'use client';

/**
 * @file packages/infrastructure/ui/src/theme/dark-mode.ts
 * Task: [f-37] Theme System — dark mode detection and control
 *
 * Purpose: Dark mode detection (prefers-color-scheme), manual override,
 *          and synchronization with CSS data-color-mode attribute.
 *          Server-safe: no window/document access at module level.
 *
 * Exports / Entry: detectSystemColorMode, useSystemColorMode, ColorMode
 * Used by: ThemeProvider, useTheme hook, theme switcher UI
 *
 * Invariants:
 *   - CSS variables only; no class-based dark mode (e.g. no "dark" class)
 *   - data-color-mode="dark"|"light" drives dark/light theme via CSS selectors
 *   - System preference is detected via matchMedia and kept in sync
 *
 * Status: @public
 */

import * as React from 'react';
import type { ColorMode } from './system';

// ─── Detection ────────────────────────────────────────────────────────────────

/**
 * Detect the OS/browser color scheme preference.
 * Returns 'dark' or 'light'. Safe to call on the server (returns 'light').
 */
export function detectSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * React hook that tracks the system color scheme preference in real-time.
 * Subscribes to the media query change event and re-renders on change.
 *
 * @example
 * const systemMode = useSystemColorMode();
 * // 'dark' or 'light', updates automatically
 */
export function useSystemColorMode(): 'light' | 'dark' {
  const [mode, setMode] = React.useState<'light' | 'dark'>(() => detectSystemColorMode());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    // Modern API
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      // Legacy Safari
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  return mode;
}

// ─── Resolved mode ────────────────────────────────────────────────────────────

/**
 * Resolve the effective color mode given a user preference and system default.
 * - 'system' → follows OS preference
 * - 'light' | 'dark' → explicit override
 */
export function resolveColorMode(
  preference: ColorMode,
  systemMode: 'light' | 'dark'
): 'light' | 'dark' {
  if (preference === 'system') return systemMode;
  return preference;
}

/**
 * React hook that tracks the resolved color mode (accounting for 'system' preference).
 *
 * @example
 * const [preference, setPreference] = useState<ColorMode>('system');
 * const resolved = useResolvedColorMode(preference);
 * // resolved is always 'light' or 'dark', never 'system'
 */
export function useResolvedColorMode(preference: ColorMode): 'light' | 'dark' {
  const systemMode = useSystemColorMode();
  return resolveColorMode(preference, systemMode);
}

// ─── Prefers-reduced-motion ───────────────────────────────────────────────────

/**
 * Detect whether the user prefers reduced motion.
 * Returns false on the server (conservative default — no motion reduction).
 */
export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * React hook that tracks the prefers-reduced-motion media query.
 * Use to disable or simplify animations for accessibility.
 *
 * @example
 * const reduced = usePrefersReducedMotion();
 * const duration = reduced ? 0 : 300;
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState<boolean>(() => detectReducedMotion());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  return reduced;
}
