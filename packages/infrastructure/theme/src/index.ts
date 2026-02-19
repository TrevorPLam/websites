/**
 * @file packages/infrastructure/theme/src/index.ts
 * Task: [F.5] Theme extension system — barrel export
 *
 * Purpose: Public API for @repo/infrastructure-theme.
 *          Exports design tokens, extension utilities, CSS variable
 *          generation, and token manipulation helpers.
 *
 * Usage:
 *   import { DEFAULT_TOKENS, extendTokens, tokensToCSSVars } from '@repo/infrastructure-theme';
 */

export * from './tokens';
export * from './extension';
export * from './css-vars';
export * from './utils';
