// File: packages/infra/typography/utils.ts  [TRACE:FILE=packages.infra.typography.utils]
// Purpose: Typography utility functions: CSS variable generation, font loading checks,
//          text truncation helpers, and character-width estimation.
//
// System role: Pure utility functions with no side-effects.
// Entry point: import from '@repo/infrastructure/typography'
//
// Exports / Entry: getTypographyCssVars, isWebFontLoaded, truncateText, estimateTextWidth
// Used by: ThemeInjector, UI text components
//
// Invariants:
// - All functions are pure where possible
// - Font loading checks are client-only (guard with typeof window check)
//
// Status: @public
// Features:
// - [FEAT:TYPOGRAPHY] Typography utility functions

import type { TypeScaleKey } from './scale';
import { TYPE_SCALE } from './scale';
import type { LineHeightKey } from './line-height';
import { LINE_HEIGHT_SCALE } from './line-height';

/**
 * Generate CSS custom property declarations for the full type scale.
 * Suitable for injecting into a :root block.
 *
 * @example
 * // Returns: { '--font-size-xs': '0.75rem', '--font-size-base': '1rem', ... }
 */
export function getTypographyCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const entries = Object.entries(TYPE_SCALE) as [TypeScaleKey, (typeof TYPE_SCALE)[TypeScaleKey]][];
  for (const [key, value] of entries) {
    vars[`--font-size-${key}`] = `${value.rem}rem`;
  }
  const lhEntries = Object.entries(LINE_HEIGHT_SCALE) as [
    LineHeightKey,
    (typeof LINE_HEIGHT_SCALE)[LineHeightKey],
  ][];
  for (const [key, value] of lhEntries) {
    vars[`--line-height-${key}`] = value.value;
  }
  return vars;
}

/**
 * Check if a web font is loaded using the CSS Font Loading API.
 * Always returns false in SSR environments.
 *
 * @param fontFamily - Font family name to check (e.g. 'Inter')
 */
export async function isWebFontLoaded(fontFamily: string): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    await document.fonts.load(`16px "${fontFamily}"`);
    return document.fonts.check(`16px "${fontFamily}"`);
  } catch {
    return false;
  }
}

/**
 * Truncate text to a maximum number of characters with an ellipsis.
 * @param text - Text to truncate
 * @param maxLength - Maximum character count (default: 100)
 * @param ellipsis - Suffix when truncated (default: '…')
 */
export function truncateText(text: string, maxLength = 100, ellipsis = '…'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
}

/**
 * Estimate text width in pixels given font size and character count.
 * Uses an average character width ratio (0.6 for proportional fonts).
 * This is an approximation — for precise measurements use canvas measureText.
 *
 * @param text - Text string
 * @param fontSizePx - Font size in pixels
 * @param charWidthRatio - Average char width as fraction of font size (default: 0.6)
 */
export function estimateTextWidth(text: string, fontSizePx: number, charWidthRatio = 0.6): number {
  return text.length * fontSizePx * charWidthRatio;
}

/**
 * Convert a number to a font weight string.
 * @param weight - Numeric font weight (100–900)
 */
export function fontWeightToString(
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
): string {
  const names: Record<number, string> = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black',
  };
  return names[weight] ?? String(weight);
}
