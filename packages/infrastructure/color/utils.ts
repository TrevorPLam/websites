// File: packages/infra/color/utils.ts  [TRACE:FILE=packages.infra.color.utils]
// Purpose: HSL color parsing, formatting, and manipulation utilities.
//          Supports the project's HSL format ("H S% L%" without hsl() wrapper)
//          as used in site.config.ts theme.colors and ThemeInjector.
//
// System role: Pure color manipulation functions with no side-effects.
// Entry point: import from '@repo/infrastructure/color'
//
// Exports / Entry: parseHsl, formatHsl, hslToCssVar, adjustHsl, toHexFromHsl, mixColors
// Used by: ThemeInjector, color contrast checker, site config validation
//
// Invariants:
// - Project HSL format: "H S% L%" (e.g. "174 85% 33%") — no hsl() wrapper
// - H is 0–360, S is 0–100%, L is 0–100%
// - All parsing functions throw on invalid input
//
// Status: @public
// Features:
// - [FEAT:COLOR] HSL color parsing and manipulation

/** Parsed HSL color components */
export interface HslColor {
  h: number; // 0–360
  s: number; // 0–100
  l: number; // 0–100
}

/**
 * Parse the project HSL format string ("H S% L%") into components.
 * @param hslString - HSL string, e.g. "174 85% 33%"
 * @throws Error if the format is invalid or values are out of the allowed ranges
 */
export function parseHsl(hslString: string): HslColor {
  const match = hslString.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);

  if (!match) {
    throw new Error(`Invalid HSL format: "${hslString}". Expected "H S% L%" (e.g. "174 85% 33%")`);
  }

  const [, hStr, sStr, lStr] = match;
  const h = Number(hStr);
  const s = Number(sStr);
  const l = Number(lStr);

  if (
    !Number.isFinite(h) ||
    !Number.isFinite(s) ||
    !Number.isFinite(l) ||
    h < 0 ||
    h > 360 ||
    s < 0 ||
    s > 100 ||
    l < 0 ||
    l > 100
  ) {
    throw new Error(
      `Invalid HSL range: "${hslString}". Expected H in [0, 360] and S/L in [0, 100].`
    );
  }

  return { h, s, l };
}

/**
 * Format HSL components into the project format string ("H S% L%").
 * @param color - HSL color object
 */
export function formatHsl(color: HslColor): string {
  return `${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}%`;
}

/**
 * Convert project HSL format to a CSS hsl() function string.
 * @param hslString - Project HSL format, e.g. "174 85% 33%"
 * @returns CSS value, e.g. "hsl(174 85% 33%)"
 */
export function hslToCss(hslString: string): string {
  const { h, s, l } = parseHsl(hslString);
  return `hsl(${h} ${s}% ${l}%)`;
}

/**
 * Generate a CSS custom property reference for a theme color.
 * @param colorKey - Theme color key (e.g. 'primary', 'secondary')
 * @example hslToCssVar('primary') → 'hsl(var(--primary))'
 */
export function hslToCssVar(colorKey: string): string {
  return `hsl(var(--${colorKey}))`;
}

/**
 * Adjust the lightness of an HSL color.
 * @param hslString - Project HSL format string
 * @param lightnessDelta - Amount to add/subtract from L (-100 to 100)
 */
export function adjustLightness(hslString: string, lightnessDelta: number): string {
  const color = parseHsl(hslString);
  const newL = Math.max(0, Math.min(100, color.l + lightnessDelta));
  return formatHsl({ ...color, l: newL });
}

/**
 * Adjust the saturation of an HSL color.
 * @param hslString - Project HSL format string
 * @param saturationDelta - Amount to add/subtract from S (-100 to 100)
 */
export function adjustSaturation(hslString: string, saturationDelta: number): string {
  const color = parseHsl(hslString);
  const newS = Math.max(0, Math.min(100, color.s + saturationDelta));
  return formatHsl({ ...color, s: newS });
}

/**
 * Convert HSL (project format) to RGB components.
 * @param hslString - Project HSL format string
 */
export function hslToRgb(hslString: string): { r: number; g: number; b: number } {
  const { h, s, l } = parseHsl(hslString);
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert HSL (project format) to a hex color string.
 * @param hslString - Project HSL format string
 * @example toHexFromHsl("174 85% 33%") → "#0d7a6b"
 */
export function toHexFromHsl(hslString: string): string {
  const { r, g, b } = hslToRgb(hslString);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Mix two HSL colors by a given ratio.
 * @param colorA - First HSL format string
 * @param colorB - Second HSL format string
 * @param ratio - Mix ratio (0 = all A, 1 = all B)
 */
export function mixColors(colorA: string, colorB: string, ratio: number): string {
  const a = parseHsl(colorA);
  const b = parseHsl(colorB);
  const r = Math.max(0, Math.min(1, ratio));

  const d = b.h - a.h;
  const h = Math.abs(d) > 180 ? a.h + (d > 0 ? d - 360 : d + 360) * r : a.h + d * r;

  return formatHsl({
    h: (h + 360) % 360,
    s: a.s + (b.s - a.s) * r,
    l: a.l + (b.l - a.l) * r,
  });
}
