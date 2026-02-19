// File: packages/infra/color/contrast.ts  [TRACE:FILE=packages.infra.color.contrast]
// Purpose: WCAG 2.2 contrast ratio calculation and accessibility level checking.
//          Validates color pairs against AA and AAA contrast requirements.
//
// System role: Pure WCAG compliance utilities — no side-effects.
// Entry point: import from '@repo/infra/color'
//
// Exports / Entry: getRelativeLuminance, getContrastRatio, meetsWcagAA, meetsWcagAAA,
//                  getWcagLevel, WcagLevel, WcagContext
// Used by: ThemeInjector validation, design system tooling, accessibility testing
//
// Invariants:
// - Contrast ratio formula follows WCAG 2.2 spec (IEC 61966-2-1 gamma correction)
// - AA requires 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold)
// - AAA requires 7:1 for normal text, 4.5:1 for large text
//
// Status: @public
// Features:
// - [FEAT:COLOR] WCAG contrast ratio utilities

import { hslToRgb } from './utils';

/** WCAG conformance level */
export type WcagLevel = 'AA' | 'AAA' | 'fail';

/** Text context for contrast requirements */
export type WcagContext = 'normal-text' | 'large-text' | 'ui-component';

/**
 * Calculate the relative luminance of an RGB color.
 * Follows WCAG 2.2 formula with IEC 61966-2-1 gamma correction.
 *
 * @param r - Red component (0–255)
 * @param g - Green component (0–255)
 * @param b - Blue component (0–255)
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const linearize = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate the WCAG contrast ratio between two HSL colors.
 * Returns a value between 1 (no contrast) and 21 (maximum contrast).
 *
 * @param hslForeground - Foreground color in project HSL format
 * @param hslBackground - Background color in project HSL format
 */
export function getContrastRatio(hslForeground: string, hslBackground: string): number {
  const fg = hslToRgb(hslForeground);
  const bg = hslToRgb(hslBackground);

  const lFg = getRelativeLuminance(fg.r, fg.g, fg.b);
  const lBg = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color pair meets WCAG 2.2 AA requirements.
 *
 * @param hslForeground - Foreground HSL color
 * @param hslBackground - Background HSL color
 * @param context - Text size context (normal-text: 4.5:1, large-text/ui: 3:1)
 */
export function meetsWcagAA(
  hslForeground: string,
  hslBackground: string,
  context: WcagContext = 'normal-text'
): boolean {
  const ratio = getContrastRatio(hslForeground, hslBackground);
  const threshold = context === 'normal-text' ? 4.5 : 3;
  return ratio >= threshold;
}

/**
 * Check if a color pair meets WCAG 2.2 AAA requirements.
 *
 * @param hslForeground - Foreground HSL color
 * @param hslBackground - Background HSL color
 * @param context - Text size context (normal-text: 7:1, large-text: 4.5:1)
 */
export function meetsWcagAAA(
  hslForeground: string,
  hslBackground: string,
  context: WcagContext = 'normal-text'
): boolean {
  const ratio = getContrastRatio(hslForeground, hslBackground);
  const threshold = context === 'normal-text' ? 7 : 4.5;
  return ratio >= threshold;
}

/**
 * Get the WCAG conformance level for a color pair.
 *
 * @param hslForeground - Foreground HSL color
 * @param hslBackground - Background HSL color
 * @param context - Text size context
 * @returns 'AAA' | 'AA' | 'fail'
 */
export function getWcagLevel(
  hslForeground: string,
  hslBackground: string,
  context: WcagContext = 'normal-text'
): WcagLevel {
  if (meetsWcagAAA(hslForeground, hslBackground, context)) return 'AAA';
  if (meetsWcagAA(hslForeground, hslBackground, context)) return 'AA';
  return 'fail';
}

/**
 * Suggest a foreground color (black or white) that maximizes contrast
 * against the given background.
 *
 * @param hslBackground - Background color in project HSL format
 * @returns '0 0% 0%' (black) or '0 0% 100%' (white)
 */
export function suggestForeground(hslBackground: string): string {
  const whiteRatio = getContrastRatio('0 0% 100%', hslBackground);
  const blackRatio = getContrastRatio('0 0% 0%', hslBackground);
  return whiteRatio >= blackRatio ? '0 0% 100%' : '0 0% 0%';
}
