// File: packages/infra/border/utils.ts  [TRACE:FILE=packages.infra.border.utils]
// Purpose: Border utility functions: CSS variable generation, logical border property helpers,
//          and border shorthand constructors.
//
// System role: Pure border manipulation functions with no side-effects.
// Entry point: import from '@repo/infrastructure/border'
//
// Exports / Entry: getBorderCssVars, borderShorthand, getRadiusCssVars, radiusVar
// Used by: ThemeInjector, UI component styling
//
// Invariants:
// - All functions are pure (no side-effects)
// - CSS custom properties follow the project's --border-* and --radius-* naming convention
//
// Status: @public
// Features:
// - [FEAT:BORDER] Border utility functions

import { RADIUS_SCALE } from './radius';
import { BORDER_WIDTH_SCALE } from './width';
import type { RadiusKey } from './radius';
import type { BorderWidthKey } from './width';

/**
 * Generate CSS custom property declarations for the border radius scale.
 * Suitable for injecting into a :root block.
 *
 * @example
 * // Returns: { '--radius-sm': '0.125rem', '--radius-md': '0.375rem', ... }
 */
export function getRadiusCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const entries = Object.entries(RADIUS_SCALE) as [RadiusKey, (typeof RADIUS_SCALE)[RadiusKey]][];
  for (const [key, value] of entries) {
    vars[`--radius-${key}`] = value.css;
  }
  return vars;
}

/**
 * Generate CSS custom property declarations for the border width scale.
 * Suitable for injecting into a :root block.
 *
 * @example
 * // Returns: { '--border-width-default': '1px', '--border-width-2': '2px', ... }
 */
export function getBorderCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const entries = Object.entries(BORDER_WIDTH_SCALE) as [
    BorderWidthKey,
    (typeof BORDER_WIDTH_SCALE)[BorderWidthKey],
  ][];
  for (const [key, value] of entries) {
    vars[`--border-width-${key}`] = value.css;
  }
  return vars;
}

/**
 * Get a CSS var reference for a radius key.
 * @param key - Radius scale key
 * @example radiusVar('md') → 'var(--radius-md)'
 */
export function radiusVar(key: RadiusKey): string {
  return `var(--radius-${key})`;
}

/**
 * Build a CSS border shorthand string.
 * @param width - CSS width string (e.g. '1px', '2px')
 * @param style - Border style (default: 'solid')
 * @param color - CSS color value or CSS var (default: 'currentColor')
 */
export function borderShorthand(
  width: string,
  style: 'solid' | 'dashed' | 'dotted' | 'none' = 'solid',
  color = 'currentColor'
): string {
  return `${width} ${style} ${color}`;
}

/**
 * Generate all border and radius CSS variables combined.
 * Convenience helper for ThemeInjector.
 */
export function getAllBorderCssVars(): Record<string, string> {
  return {
    ...getRadiusCssVars(),
    ...getBorderCssVars(),
  };
}
