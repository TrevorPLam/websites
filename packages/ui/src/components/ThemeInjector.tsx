// File: packages/ui/src/components/ThemeInjector.tsx  [TRACE:FILE=packages.ui.components.ThemeInjector]
// Purpose: Server component that generates CSS custom properties from site.config.ts theme values,
//          enabling config-driven theming. Injects a <style> tag into <head> that overrides
//          globals.css defaults with values from the site configuration.
//
// Relationship: Depends on @repo/types (ThemeColors). Used by template app/layout.tsx.
// System role: Bridges site.config.theme.colors to :root CSS variables; server-only.
// Assumptions: Theme values are HSL strings or full CSS colors; globals.css defines --* fallbacks.
//
// Exports / Entry: ThemeInjector component
// Used by: Root layout (app/layout.tsx) — must render inside <head> or early in <body>
//
// Invariants:
// - Must be a React Server Component (no client-side JS)
// - CSS custom properties must match the names in globals.css and tailwind-preset.js
// - HSL values from config are wrapped in hsl() for valid CSS
// - globals.css values serve as fallback when no config override exists
// - Must not cause hydration mismatch (server-rendered only)
//
// Status: @public
// Features:
// - [FEAT:THEMING] Config-driven CSS custom property generation
// - [FEAT:PERFORMANCE] Zero client-side JS — server-rendered <style> tag
// - [Task 0.14] Bridges the gap between site.config.ts theme and visual output
// - ThemeColors from @repo/types (single source of truth); docs in docs/theming/theme-injector.md
//
// 2026 Best Practices:
// - Server Component eliminates client-side bundle cost
// - CSS custom properties provide runtime theming without JS
// - hsl() color format provides broad browser support (all modern browsers)
// - Specificity: :root style from ThemeInjector overrides globals.css :root defaults

import type { ThemeColors as ThemeColorsFromTypes } from '@repo/types';
import { DEFAULT_THEME_COLORS } from '@repo/types';

/**
 * Theme color map matching the CSS custom property names in globals.css and tailwind-preset.js.
 * Values should be CSS-valid color strings. The component accepts either:
 * - HSL space-separated values (e.g., '174 85% 33%') — wrapped in hsl() automatically
 * - Full CSS color values (e.g., '#0ea5a4', 'hsl(174, 85%, 33%)') — used as-is
 *
 * Uses @repo/types ThemeColors; partial theme allowed for incremental override.
 */
export type ThemeColors = Partial<ThemeColorsFromTypes>;

export interface ThemeInjectorProps {
  /** Theme color values from site.config.ts */
  theme: ThemeColors;
  /** Optional CSS selector to scope theme (default: ':root') */
  selector?: string;
}

/**
 * Detects whether a color string is a bare HSL value (space-separated H S% L%)
 * vs. a full CSS color (hex, rgb(), hsl(), named color, etc.)
 *
 * @param value - Theme color string from config
 * @returns true if format is "H S% L%" (e.g. "174 85% 33%")
 */
function isBareHslValue(value: string): boolean {
  return /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(value.trim());
}

/**
 * Converts a theme color value to a valid CSS color string. Bare HSL wrapped in hsl().
 *
 * @param value - Theme color string (bare HSL or full CSS color)
 * @returns CSS color string for use in custom property
 */
function toCssColor(value: string): string {
  if (isBareHslValue(value)) {
    return `hsl(${value.trim()})`;
  }
  return value;
}

/**
 * ThemeInjector — Server component that generates CSS custom properties from config.
 *
 * Renders a <style> tag with CSS custom properties derived from the theme object.
 * This overrides the fallback values in globals.css, making site.config.ts theme
 * values take visual effect.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { ThemeInjector } from '@repo/ui';
 * import siteConfig from '@/site.config';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <ThemeInjector theme={siteConfig.theme} />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeInjector({ theme, selector = ':root' }: ThemeInjectorProps) {
  // Merge partial overrides with base tokens (inf-4)
  const merged = { ...DEFAULT_THEME_COLORS, ...theme };
  // Filter out undefined values and convert to CSS custom properties
  const cssProperties = Object.entries(merged)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `  --${key}: ${toCssColor(value)};`)
    .join('\n');

  if (!cssProperties) {
    return null;
  }

  const css = `${selector} {\n${cssProperties}\n}`;

  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      // [Task 0.14] Server-rendered CSS custom properties from site.config.ts theme
      // No hydration mismatch: this is a Server Component, no client JS involved
    />
  );
}
