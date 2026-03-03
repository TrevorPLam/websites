/**
 * @file packages/core-engine/src/puck/theme-bridge.ts
 * @summary Bridge between design tokens and Puck editor theming.
 * @description Converts design token values to Puck-compatible CSS custom properties
 *   and inline styles, ensuring consistent theming across the page builder and
 *   rendered output.
 * @security Static mapping only; no external I/O or secret material.
 * @requirements TASK-PUCK-001, TASK-DS-001
 */

import type { CSSProperties } from 'react';
import { puckTheme, designTokens } from '@repo/design-tokens';

/**
 * Puck CSS variable map derived from design tokens.
 * Applied to the editor root so preview output matches rendered pages.
 */
export function buildPuckCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  // Map color tokens to CSS custom properties
  for (const [key, value] of Object.entries(puckTheme.colors)) {
    if (typeof value === 'string') {
      vars[`--puck-color-${key}`] = value;
    }
  }

  // Map spacing tokens
  for (const [key, value] of Object.entries(designTokens.spacing)) {
    if (typeof value === 'string') {
      vars[`--puck-spacing-${key}`] = value;
    }
  }

  // Map border-radius tokens
  for (const [key, value] of Object.entries(designTokens.borderRadius)) {
    if (typeof value === 'string') {
      vars[`--puck-radius-${key}`] = value;
    }
  }

  return vars;
}

/**
 * Returns inline style object applying design tokens to a Puck editor container.
 * Use on the wrapper div that hosts `<Puck>` to propagate tokens into previews.
 *
 * @example
 * ```tsx
 * <div style={getPuckEditorStyles()}>
 *   <Puck config={config} data={data} />
 * </div>
 * ```
 */
export function getPuckEditorStyles(): CSSProperties {
  return buildPuckCssVars() as CSSProperties;
}

/**
 * Typography configuration derived from design tokens for Puck component defaults.
 */
export const puckTypography = {
  fontFamily: {
    sans: designTokens.typography.fontFamily.sans,
    mono: designTokens.typography.fontFamily.mono,
  },
  fontSize: designTokens.typography.fontSize,
  fontWeight: designTokens.typography.fontWeight,
  lineHeight: designTokens.typography.lineHeight,
} as const;

export type PuckTypography = typeof puckTypography;

/**
 * Re-export puckTheme for convenience so consumers can import from one location.
 */
export { puckTheme };
