/**
 * @file packages/infrastructure/theme/src/tokens.ts
 * Task: [F.5] Theme extension system — design token definitions
 *
 * Purpose: Strongly-typed design token system. Tokens are the atomic
 *          units of a design system: colors, spacing, radius, shadows,
 *          typography, and animation durations.
 *
 *          Tokens are resolution-independent string values. CSS variable
 *          generation is handled by css-vars.ts.
 *
 * Exports: TokenCategory, TokenMap, ColorTokens, SpacingTokens,
 *          RadiusTokens, ShadowTokens, TypographyTokens, AnimationTokens,
 *          DesignTokens, DEFAULT_TOKENS
 *
 * Invariants:
 * - All token values are strings (CSS-compatible)
 * - Color values use HSL without hsl() wrapper: "174 100% 26%"
 * - Spacing/radius use CSS units (px, rem)
 */

// ─── Token categories ─────────────────────────────────────────────────────────

/** Color tokens — HSL without wrapper */
export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
}

/** Border radius tokens */
export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/** Box shadow tokens */
export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/** Typography scale tokens */
export interface TypographyTokens {
  fontSizeBase: string;
  fontSizeSm: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontWeightNormal: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;
  fontWeightBold: string;
  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
}

/** Animation/transition tokens */
export interface AnimationTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingDefault: string;
  easingEaseIn: string;
  easingEaseOut: string;
}

/** Complete design token set */
export interface DesignTokens {
  colors: ColorTokens;
  darkColors: Partial<ColorTokens>;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  typography: TypographyTokens;
  animation: AnimationTokens;
}

// ─── Default tokens ───────────────────────────────────────────────────────────

/** Default design tokens — matches the starter-template theme */
export const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    primary: '174 85% 33%',
    primaryForeground: '0 0% 98%',
    secondary: '221 39% 11%',
    secondaryForeground: '0 0% 98%',
    accent: '174 60% 90%',
    accentForeground: '221 39% 11%',
    background: '0 0% 100%',
    foreground: '221 39% 11%',
    muted: '210 20% 96%',
    mutedForeground: '215 16% 47%',
    card: '0 0% 100%',
    cardForeground: '221 39% 11%',
    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '174 85% 33%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 98%',
  },
  darkColors: {
    background: '220 20% 8%',
    foreground: '210 20% 98%',
    card: '220 20% 11%',
    cardForeground: '210 20% 98%',
    muted: '220 20% 15%',
    mutedForeground: '215 16% 64%',
    border: '220 20% 18%',
    input: '220 20% 18%',
  },
  radius: {
    none: '0px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontSizeBase: '1rem',
    fontSizeSm: '0.875rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.25rem',
    fontSize2xl: '1.5rem',
    fontSize3xl: '1.875rem',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightSemibold: '600',
    fontWeightBold: '700',
    lineHeightTight: '1.25',
    lineHeightNormal: '1.5',
    lineHeightRelaxed: '1.75',
  },
  animation: {
    durationFast: '150ms',
    durationNormal: '200ms',
    durationSlow: '300ms',
    easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easingEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};
