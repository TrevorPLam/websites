/**
 * @file packages/design-tokens/src/index.ts
 * @summary Public exports for shared design token package.
 * @security Static token data only; no secret material.
 * @requirements GAP-DESIGN-001
 */

// Core design tokens
export {
  designTokens,
  semanticColors,
  colorTokens,
  typographyTokens,
  spacingTokens,
  borderRadiusTokens,
  shadowTokens,
  zIndexTokens,
  animationTokens,
  componentTokens,
  breakpointTokens,
} from './tokens';
export type {
  DesignTokens,
  SemanticColors,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  BorderRadiusTokens,
  ShadowTokens,
  ZIndexTokens,
  AnimationTokens,
  ComponentTokens,
  BreakpointTokens,
} from './tokens';

// Puck theme configuration
export { puckComponentCategories, puckTheme } from './puck-theme';
export type { PuckComponentCategories, PuckTheme } from './puck-theme';

// Tailwind CSS preset
export { tailwindPreset } from './tailwind-preset';
export type { TailwindPreset } from './tailwind-preset';

// Style Dictionary transforms
export { styleDictionaryTransforms } from './style-dictionary-transforms';
export type { StyleDictionaryTransforms } from './style-dictionary-transforms';
