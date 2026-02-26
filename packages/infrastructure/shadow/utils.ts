// File: packages/infra/shadow/utils.ts  [TRACE:FILE=packages.infra.shadow.utils]
// Purpose: Shadow utility functions: CSS variable generation, color-aware shadow creation,
//          and shadow composition helpers.
//
// System role: Pure shadow manipulation functions with no side-effects.
// Entry point: import from '@repo/infrastructure/shadow'
//
// Exports / Entry: getShadowCssVars, coloredShadow, elevationToShadow, combineShadows
// Used by: ThemeInjector, component theming
//
// Invariants:
// - All functions are pure (no side-effects)
// - Combined shadows are valid CSS (comma-separated)
//
// Status: @public
// Features:
// - [FEAT:SHADOW] Shadow utility functions

import { SHADOW_SCALE } from './scale';
import type { ShadowKey } from './scale';

/**
 * Generate CSS custom property declarations for the shadow scale.
 * Suitable for injecting into a :root block.
 *
 * @example
 * // Returns: { '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)', ... }
 */
export function getShadowCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const entries = Object.entries(SHADOW_SCALE) as [ShadowKey, (typeof SHADOW_SCALE)[ShadowKey]][];
  for (const [key, value] of entries) {
    vars[`--shadow-${key}`] = value.css;
  }
  return vars;
}

/**
 * Create a colored shadow using an RGBA color.
 * Useful for creating brand-colored elevation effects.
 *
 * @param r - Red (0–255)
 * @param g - Green (0–255)
 * @param b - Blue (0–255)
 * @param alpha - Opacity (0–1)
 * @param offsetX - Horizontal offset in px (default: 0)
 * @param offsetY - Vertical offset in px (default: 4)
 * @param blur - Blur radius in px (default: 6)
 * @param spread - Spread radius in px (default: -1)
 */
export function coloredShadow(
  r: number,
  g: number,
  b: number,
  alpha: number,
  offsetX = 0,
  offsetY = 4,
  blur = 6,
  spread = -1
): string {
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Map an elevation level (0–5) to a shadow scale key.
 * Follows Material Design elevation metaphor.
 *
 * - 0: none (flat)
 * - 1: sm (raised)
 * - 2: md (card)
 * - 3: lg (dropdown)
 * - 4: xl (modal)
 * - 5: 2xl (hero)
 */
export function elevationToShadow(level: 0 | 1 | 2 | 3 | 4 | 5): ShadowKey {
  const map: Record<0 | 1 | 2 | 3 | 4 | 5, ShadowKey> = {
    0: 'none',
    1: 'sm',
    2: 'md',
    3: 'lg',
    4: 'xl',
    5: '2xl',
  };
  return map[level];
}

/**
 * Combine multiple shadow values into a single CSS box-shadow string.
 * Order: first shadow is on top (painted first in CSS).
 *
 * @param shadows - Array of CSS box-shadow values or scale keys
 */
export function combineShadows(...shadows: Array<ShadowKey | string>): string {
  return shadows
    .map((s) => {
      if (s in SHADOW_SCALE) {
        return SHADOW_SCALE[s as ShadowKey].css;
      }
      return s;
    })
    .filter((s) => s !== 'none')
    .join(', ');
}

/**
 * Get a CSS var reference for a shadow key.
 * @param key - Shadow scale key
 * @example shadowVar('md') → 'var(--shadow-md)'
 */
export function shadowVar(key: ShadowKey): string {
  return `var(--shadow-${key})`;
}
