'use client';

/**
 * @file clients/starter-template/app/[locale]/ThemeToggle.tsx
 * [TRACE:FILE=clients.starter-template.app.locale.ThemeToggle]
 *
 * Purpose: Light/dark mode toggle button using the ThemeProvider context.
 *          Reads current colorMode from useTheme() and toggles between light/dark.
 *          Persisted via localStorage; respects system preference as default.
 *
 * Relationship: Depends on @repo/infrastructure-ui/theme (useTheme), lucide-react.
 * System role: UI control in Layer 3 (client-local component).
 * Assumptions: Must be rendered inside ThemeProvider (provided by LocaleProviders).
 *
 * Exports / Entry: ThemeToggle, ThemeToggleProps
 * Used by: Site navigation, header, settings panel
 *
 * Invariants:
 * - ThemeProvider must be an ancestor (useTheme() throws without it)
 * - Renders a <button> with Sun (light) or Moon (dark) icon based on current mode
 * - aria-label describes the action (switch to the OTHER mode)
 *
 * Status: @public
 * Features:
 * - [FEAT:THEME] Light/dark mode toggle
 * - [FEAT:ACCESSIBILITY] Accessible button with aria-label
 */

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@repo/infrastructure-ui/theme';
import { cn } from '@repo/utils';

export interface ThemeToggleProps {
  /** Additional CSS classes for the button */
  className?: string;
  /** Icon size in pixels (default: 20) */
  iconSize?: number;
}

/**
 * Toggle between light and dark color mode. Reads resolved colorMode from ThemeProvider
 * and calls toggleColorMode() on click. Persists preference to localStorage.
 *
 * @example
 * // In your nav:
 * <ThemeToggle className="ml-auto" />
 */
export function ThemeToggle({ className, iconSize = 20 }: ThemeToggleProps): React.ReactElement {
  const { colorMode, toggleColorMode } = useTheme();
  const isDark = colorMode === 'dark';

  return (
    <button
      type="button"
      onClick={toggleColorMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-foreground',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {isDark ? (
        <Sun size={iconSize} aria-hidden="true" />
      ) : (
        <Moon size={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}
