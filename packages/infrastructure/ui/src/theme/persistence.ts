/**
 * @file packages/infrastructure/ui/src/theme/persistence.ts
 * Task: [f-37] Theme System — theme persistence
 *
 * Purpose: Persist the user's color mode preference across sessions using
 *          localStorage. Server-safe and SSR-compatible.
 *
 * Exports / Entry: loadColorMode, saveColorMode, clearColorMode, usePersistedColorMode
 * Used by: ThemeProvider for initial preference loading
 *
 * Invariants:
 *   - localStorage is accessed only in browser (typeof window check)
 *   - Invalid stored values are silently discarded (default to 'system')
 *   - SSR always returns 'system' as the default preference
 *
 * Status: @public
 */

import * as React from 'react';
import type { ColorMode } from './system';

const STORAGE_KEY = 'theme-color-mode';
const VALID_MODES: ColorMode[] = ['light', 'dark', 'system'];

// ─── Storage utilities ────────────────────────────────────────────────────────

/**
 * Load the persisted color mode preference from localStorage.
 * Returns 'system' if no preference is stored or storage is unavailable.
 */
export function loadColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_MODES as string[]).includes(stored)) {
      return stored as ColorMode;
    }
  } catch {
    // localStorage may be blocked (e.g. private mode restrictions)
  }
  return 'system';
}

/**
 * Persist the color mode preference to localStorage.
 */
export function saveColorMode(mode: ColorMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore write failures
  }
}

/**
 * Remove the persisted color mode preference (resets to system default).
 */
export function clearColorMode(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * React hook that manages a persisted color mode preference.
 * On mount, loads from localStorage. On change, saves to localStorage.
 *
 * @returns [colorMode, setColorMode] — the current preference and a setter
 *
 * @example
 * const [colorMode, setColorMode] = usePersistedColorMode();
 * // colorMode: 'system' | 'light' | 'dark'
 * // toggle:
 * setColorMode(colorMode === 'dark' ? 'light' : 'dark');
 */
export function usePersistedColorMode(): [ColorMode, (mode: ColorMode) => void] {
  const [mode, setModeState] = React.useState<ColorMode>('system');

  // Load from storage after mount (avoids SSR mismatch)
  React.useEffect(() => {
    setModeState(loadColorMode());
  }, []);

  const setMode = React.useCallback((newMode: ColorMode) => {
    setModeState(newMode);
    saveColorMode(newMode);
  }, []);

  return [mode, setMode];
}

// ─── Script for flicker prevention ───────────────────────────────────────────

/**
 * Generate an inline script string that sets the color mode attribute before
 * React hydrates. Include this in <head> via dangerouslySetInnerHTML to prevent
 * the flash of incorrect theme on first render.
 *
 * @example
 * // In your layout.tsx:
 * <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
 */
export function getThemeInitScript(): string {
  return `
(function(){
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var valid = ['light','dark','system'];
    var pref = valid.indexOf(stored) !== -1 ? stored : 'system';
    var mode = pref === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : pref;
    document.documentElement.setAttribute('data-color-mode', mode);
  } catch(e) {}
})();
`.trim();
}
