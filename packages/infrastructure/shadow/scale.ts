// File: packages/infra/shadow/scale.ts  [TRACE:FILE=packages.infra.shadow.scale]
// Purpose: Box shadow scale constants matching Tailwind CSS shadow utilities.
//          Maps semantic shadow keys (none, sm, md, lg, xl, 2xl, inner) to CSS values
//          and Tailwind class names.
//
// System role: Single source of truth for box-shadow tokens.
// Entry point: import from '@repo/infrastructure/shadow'
//
// Exports / Entry: SHADOW_SCALE, ShadowKey, ShadowValue, ShadowConfig, getShadow
// Used by: UI components, ThemeInjector, card/modal components
//
// Invariants:
// - Keys match Tailwind's shadow-{key} classes exactly (except 'md' → 'shadow' in Tailwind)
// - CSS values use RGBA for cross-browser opacity support
// - 'none' key always maps to 'none' / 'shadow-none'
//
// Status: @public
// Features:
// - [FEAT:SHADOW] Box shadow scale constants

/** Shadow scale key identifiers */
export type ShadowKey = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

/** Shadow value definition */
export interface ShadowValue {
  /** CSS box-shadow value */
  css: string;
  /** Tailwind CSS class */
  tailwindClass: string;
  /** Human-readable description */
  description: string;
}

/** Site config shadow intensity tokens (from SiteConfig.theme.shadows) */
export type ShadowIntensity = 'none' | 'small' | 'medium' | 'large';

/** Box shadow scale matching Tailwind CSS defaults */
export const SHADOW_SCALE: Readonly<Record<ShadowKey, ShadowValue>> = {
  none: {
    css: 'none',
    tailwindClass: 'shadow-none',
    description: 'No shadow',
  },
  sm: {
    css: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    tailwindClass: 'shadow-sm',
    description: 'Small subtle shadow for inputs and inline elements',
  },
  md: {
    css: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    tailwindClass: 'shadow',
    description: 'Default card and panel shadow',
  },
  lg: {
    css: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    tailwindClass: 'shadow-lg',
    description: 'Large shadow for dropdowns and popovers',
  },
  xl: {
    css: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    tailwindClass: 'shadow-xl',
    description: 'Extra large shadow for modals and overlays',
  },
  '2xl': {
    css: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    tailwindClass: 'shadow-2xl',
    description: 'Maximum shadow for hero elements',
  },
  inner: {
    css: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    tailwindClass: 'shadow-inner',
    description: 'Inset shadow for pressed/sunken states',
  },
} as const;

/**
 * Map site config shadow intensity to the corresponding scale key.
 */
export const SHADOW_INTENSITY_MAP: Readonly<Record<ShadowIntensity, ShadowKey>> = {
  none: 'none',
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const;

/**
 * Get the shadow value for a given scale key.
 * @param key - Shadow scale key
 */
export function getShadow(key: ShadowKey): ShadowValue {
  return SHADOW_SCALE[key];
}

/**
 * Get the shadow scale key from a site config shadow intensity.
 * @param intensity - SiteConfig theme.shadows value
 */
export function shadowIntensityToKey(intensity: ShadowIntensity): ShadowKey {
  return SHADOW_INTENSITY_MAP[intensity];
}

/**
 * Get the Tailwind CSS class for a shadow key.
 * @param key - Shadow scale key
 */
export function getShadowClass(key: ShadowKey): string {
  return SHADOW_SCALE[key].tailwindClass;
}
