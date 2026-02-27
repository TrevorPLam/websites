/**
 * @file packages/design-tokens/src/index.ts
 * @summary Public exports for shared design token package.
 * @security Static token data only; no secret material.
 * @requirements GAP-DESIGN-001
 */

// Core design tokens
export { designTokens, semanticColors } from './tokens';
export type { DesignTokens, SemanticColors } from './tokens';

// CSS variables
export * from './css-variables';

// Puck theme configuration
export { puckComponentCategories, puckTheme } from './puck-theme';
export type { PuckComponentCategories, PuckTheme } from './puck-theme';

// Tailwind CSS preset
export { tailwindPreset } from './tailwind-preset';
export type { TailwindPreset } from './tailwind-preset';

// Style Dictionary transforms
export { styleDictionaryTransforms } from './style-dictionary-transforms';
export type { StyleDictionaryTransforms } from './style-dictionary-transforms';

// Re-export commonly used utilities
export const colors = designTokens.colors;
export const typography = designTokens.typography;
export const spacing = designTokens.spacing;
export const borderRadius = designTokens.borderRadius;
export const shadows = designTokens.shadows;
export const zIndex = designTokens.zIndex;
export const animation = designTokens.animation;
export const breakpoints = designTokens.breakpoints;
export const components = designTokens.components;
