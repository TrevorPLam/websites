// File: packages/infra/border/radius.ts  [TRACE:FILE=packages.infra.border.radius]
// Purpose: Border radius scale constants matching Tailwind CSS rounded utilities.
//          Maps semantic radius keys to CSS values, rem values, and Tailwind classes.
//          Includes site.config.ts borderRadius token mapping.
//
// System role: Single source of truth for border-radius tokens.
// Entry point: import from '@repo/infra/border'
//
// Exports / Entry: RADIUS_SCALE, RadiusKey, RadiusValue, BorderRadiusIntensity,
//                  getRadius, radiusIntensityToKey
// Used by: UI components, ThemeInjector, site.config.ts validation
//
// Invariants:
// - Keys match Tailwind's rounded-{key} classes
// - 'full' key maps to 9999px (pill shape)
// - 'none' always maps to 0
//
// Status: @public
// Features:
// - [FEAT:BORDER] Border radius scale

/** Border radius scale key identifiers */
export type RadiusKey =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

/** Border radius value definition */
export interface RadiusValue {
  /** CSS value string */
  css: string;
  /** Rem value (for calculation) */
  rem: number;
  /** Tailwind CSS class */
  tailwindClass: string;
  /** Pixel equivalent */
  px: number;
}

/** Site config border radius tokens (from SiteConfig.theme.borderRadius) */
export type BorderRadiusIntensity = 'none' | 'small' | 'medium' | 'large' | 'full';

/** Border radius scale matching Tailwind CSS defaults */
export const RADIUS_SCALE: Readonly<Record<RadiusKey, RadiusValue>> = {
  none: { css: '0px', rem: 0, tailwindClass: 'rounded-none', px: 0 },
  sm: { css: '0.125rem', rem: 0.125, tailwindClass: 'rounded-sm', px: 2 },
  md: { css: '0.375rem', rem: 0.375, tailwindClass: 'rounded-md', px: 6 },
  lg: { css: '0.5rem', rem: 0.5, tailwindClass: 'rounded-lg', px: 8 },
  xl: { css: '0.75rem', rem: 0.75, tailwindClass: 'rounded-xl', px: 12 },
  '2xl': { css: '1rem', rem: 1, tailwindClass: 'rounded-2xl', px: 16 },
  '3xl': { css: '1.5rem', rem: 1.5, tailwindClass: 'rounded-3xl', px: 24 },
  full: { css: '9999px', rem: 624.9375, tailwindClass: 'rounded-full', px: 9999 },
} as const;

/**
 * Map site config border radius intensity to the corresponding scale key.
 */
export const RADIUS_INTENSITY_MAP: Readonly<Record<BorderRadiusIntensity, RadiusKey>> = {
  none: 'none',
  small: 'sm',
  medium: 'md',
  large: 'xl',
  full: 'full',
} as const;

/**
 * Get the radius value for a given scale key.
 * @param key - Radius scale key
 */
export function getRadius(key: RadiusKey): RadiusValue {
  return RADIUS_SCALE[key];
}

/**
 * Get the radius scale key from a site config border radius intensity.
 * @param intensity - SiteConfig theme.borderRadius value
 */
export function radiusIntensityToKey(intensity: BorderRadiusIntensity): RadiusKey {
  return RADIUS_INTENSITY_MAP[intensity];
}

/**
 * Get the Tailwind CSS class for a radius key.
 * @param key - Radius scale key
 */
export function getRadiusClass(key: RadiusKey): string {
  return RADIUS_SCALE[key].tailwindClass;
}
