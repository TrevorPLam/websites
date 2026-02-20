'use client';

/**
 * @file packages/infrastructure/ui/src/theme/hooks.ts
 * Task: [f-37] Theme System — useTheme hook and ThemeProvider
 *
 * Purpose: React hook and provider for the theme system. Combines persistence,
 *          dark-mode detection, and theme application into a single API.
 *
 * Exports / Entry: ThemeProvider, useTheme, ThemeProviderProps
 * Used by: App roots (layout.tsx), theme toggles, config-driven theme injection
 *
 * Invariants:
 *   - ThemeProvider must wrap any component that calls useTheme()
 *   - Theme is applied via CSS custom properties (no class-based switching)
 *   - Persists color mode preference in localStorage between sessions
 *
 * Status: @public
 */

import * as React from 'react';
import { applyTheme, DEFAULT_THEME, type ThemeConfig, type ColorMode } from './system';
import { useResolvedColorMode, usePrefersReducedMotion } from './dark-mode';
import { usePersistedColorMode, getThemeInitScript } from './persistence';
import { createStrictContext } from '../composition/context';

// ─── Context ──────────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The active ThemeConfig object */
  theme: ThemeConfig;
  /** The resolved effective color mode ('light' or 'dark') */
  colorMode: 'light' | 'dark';
  /** The user's stored preference ('system' | 'light' | 'dark') */
  colorModePreference: ColorMode;
  /** Set the color mode preference (persisted) */
  setColorMode: (mode: ColorMode) => void;
  /** Toggle between light and dark (sets an explicit preference) */
  toggleColorMode: () => void;
  /** Whether the user prefers reduced motion */
  prefersReducedMotion: boolean;
}

const [ThemeCtx, useThemeContext] = createStrictContext<ThemeContextValue>('ThemeContext');

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  /** The theme configuration to apply */
  theme?: ThemeConfig;
  /** Children to render within the theme context */
  children: React.ReactNode;
}

/**
 * ThemeProvider — wraps the application (or subtree) with theme context.
 * Applies CSS custom properties to the document root and tracks color mode.
 *
 * @example
 * <ThemeProvider theme={siteConfig.theme ? buildTheme(siteConfig.theme) : DEFAULT_THEME}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  theme = DEFAULT_THEME,
  children,
}: ThemeProviderProps): React.ReactElement {
  const [preference, setPreference] = usePersistedColorMode();
  const resolved = useResolvedColorMode(preference);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Apply theme CSS vars whenever theme or color mode changes
  React.useEffect(() => {
    applyTheme(theme, resolved);
  }, [theme, resolved]);

  const toggleColorMode = React.useCallback(() => {
    setPreference(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setPreference]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      colorMode: resolved,
      colorModePreference: preference,
      setColorMode: setPreference,
      toggleColorMode,
      prefersReducedMotion,
    }),
    [theme, resolved, preference, setPreference, toggleColorMode, prefersReducedMotion]
  );

  return React.createElement(ThemeCtx.Provider, { value }, children);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the current theme and color mode controls.
 * Must be called inside a ThemeProvider.
 *
 * @example
 * const { colorMode, toggleColorMode, theme } = useTheme();
 */
export const useTheme = useThemeContext;

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Re-export for convenience */
export { getThemeInitScript };
