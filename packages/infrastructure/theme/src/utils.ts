/**
 * @file packages/infrastructure/theme/src/utils.ts
 * Task: [F.5] Theme extension system — token utility functions
 *
 * Purpose: Utility functions for working with design tokens.
 *          Includes HSL color parsing/manipulation, token resolution,
 *          and contrast ratio calculation.
 *
 * Exports: parseHSL, hslToHex, adjustLightness, contrastRatio,
 *          resolveToken, tokenVar
 *
 * Invariants:
 * - HSL values use the format "H S% L%" (no hsl() wrapper)
 * - All functions are pure — no side effects
 * - CSS variable references use the dt- prefix
 */

// ─── HSL utilities ────────────────────────────────────────────────────────────

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Parse an HSL string ("174 85% 33%") to a structured HSLColor object.
 * Returns null if the string is not a valid HSL token.
 *
 * @example
 * parseHSL('174 85% 33%') // → { h: 174, s: 85, l: 33 }
 */
export function parseHSL(value: string): HSLColor | null {
  const match = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/.exec(
    value.trim()
  );
  if (!match) return null;

  const h = parseFloat(match[1] ?? '0');
  const s = parseFloat(match[2] ?? '0');
  const l = parseFloat(match[3] ?? '0');

  if (isNaN(h) || isNaN(s) || isNaN(l)) return null;
  return { h, s, l };
}

/**
 * Stringify an HSLColor back to token format ("H S% L%").
 *
 * @example
 * stringifyHSL({ h: 174, s: 85, l: 33 }) // → '174 85% 33%'
 */
export function stringifyHSL({ h, s, l }: HSLColor): string {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

/**
 * Adjust the lightness of an HSL token value by a delta.
 *
 * @example
 * adjustLightness('174 85% 33%', +10) // → '174 85% 43%'
 */
export function adjustLightness(hslToken: string, delta: number): string {
  const parsed = parseHSL(hslToken);
  if (!parsed) return hslToken;
  return stringifyHSL({
    ...parsed,
    l: Math.max(0, Math.min(100, parsed.l + delta)),
  });
}

/**
 * Adjust the saturation of an HSL token value by a delta.
 */
export function adjustSaturation(hslToken: string, delta: number): string {
  const parsed = parseHSL(hslToken);
  if (!parsed) return hslToken;
  return stringifyHSL({
    ...parsed,
    s: Math.max(0, Math.min(100, parsed.s + delta)),
  });
}

// ─── CSS variable references ──────────────────────────────────────────────────

/**
 * Generate a CSS `var()` reference for a design token.
 *
 * @example
 * tokenVar('colors', 'primary') // → 'var(--dt-colors-primary)'
 * tokenVar('colors', 'primary', '174 85% 33%') // → 'var(--dt-colors-primary, 174 85% 33%)'
 */
export function tokenVar(
  category: string,
  key: string,
  fallback?: string
): string {
  const camelToKebab = (s: string) => s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
  const varName = `--dt-${camelToKebab(category)}-${camelToKebab(key)}`;
  return fallback !== undefined
    ? `var(${varName}, ${fallback})`
    : `var(${varName})`;
}

// ─── Contrast utilities ───────────────────────────────────────────────────────

/**
 * Estimate relative luminance from HSL (simplified, for contrast checks).
 * Precise WCAG luminance requires sRGB → linear conversion; this is approximate.
 */
function hslLuminance({ l }: HSLColor): number {
  const L = l / 100;
  return L <= 0.03928 ? L / 12.92 : Math.pow((L + 0.055) / 1.055, 2.4);
}

/**
 * Calculate contrast ratio between two HSL token strings.
 * Returns the WCAG contrast ratio (1–21). Returns null if either input is invalid.
 *
 * WCAG AA: 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA: 7:1 for normal text
 *
 * @example
 * contrastRatio('0 0% 100%', '0 0% 0%') // → 21
 */
export function contrastRatio(
  foreground: string,
  background: string
): number | null {
  const fg = parseHSL(foreground);
  const bg = parseHSL(background);
  if (!fg || !bg) return null;

  const L1 = hslLuminance(fg);
  const L2 = hslLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if two HSL token colors meet WCAG AA contrast requirements.
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  const ratio = contrastRatio(foreground, background);
  return ratio !== null && ratio >= 4.5;
}
