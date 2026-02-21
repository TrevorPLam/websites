/**
 * @file packages/infrastructure/ui/src/theme/system.ts
 * Task: [f-37] Theme System
 *
 * Purpose: CSS-variable-based theme system with theme switching, dark mode support,
 *          and persistence. No custom theme engine — uses CSS custom properties only.
 *
 * Exports / Entry: ThemeSystem, ThemeConfig, DEFAULT_THEME
 * Used by: ThemeProvider, useTheme hook, ThemeToggle component
 *
 * Invariants:
 *   - CSS variables only; no runtime style injection outside CSS vars
 *   - HSL color format without hsl() wrapper: "174 100% 26%"
 *   - Theme is applied via data-theme attribute on document.documentElement
 *   - Server-safe: no window/document access at module level
 *
 * Status: @public
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Color token name map — matches the CSS custom properties in the design system */
export interface ThemeColors {
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  card: string;
  'card-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  border: string;
  input: string;
  ring: string;
}

export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  /** Theme identifier — used as data-theme attribute value */
  id: string;
  /** Display name for UI */
  name: string;
  /** Light mode color tokens (HSL without hsl() wrapper) */
  colors: ThemeColors;
  /** Dark mode color token overrides (partial) */
  darkColors?: Partial<ThemeColors>;
  /** Border radius scale */
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  /** Shadow scale */
  shadows?: 'none' | 'small' | 'medium' | 'large';
}

/** Default light theme — matches starter-template colors */
export const DEFAULT_THEME: ThemeConfig = {
  id: 'default',
  name: 'Default',
  colors: {
    primary: '174 85% 33%',
    'primary-foreground': '0 0% 100%',
    secondary: '220 20% 14%',
    'secondary-foreground': '0 0% 100%',
    accent: '174 85% 93%',
    'accent-foreground': '174 85% 20%',
    background: '220 14% 96%',
    foreground: '220 20% 8%',
    muted: '220 14% 92%',
    'muted-foreground': '220 10% 40%',
    card: '0 0% 100%',
    'card-foreground': '220 20% 8%',
    destructive: '0 72% 38%',
    'destructive-foreground': '0 0% 100%',
    border: '220 14% 88%',
    input: '220 14% 88%',
    ring: '174 85% 33%',
  },
  darkColors: {
    background: '220 20% 8%',
    foreground: '220 14% 96%',
    card: '220 20% 12%',
    'card-foreground': '220 14% 96%',
    muted: '220 20% 16%',
    'muted-foreground': '220 10% 60%',
    border: '220 14% 20%',
    input: '220 14% 20%',
    accent: '174 85% 15%',
    'accent-foreground': '174 85% 93%',
  },
  borderRadius: 'medium',
  shadows: 'medium',
};

// ─── CSS variable generation ──────────────────────────────────────────────────

/**
 * Convert a ThemeConfig to a CSS custom properties object.
 * Suitable for injecting into a style attribute or a <style> tag.
 */
export function themeToCSS(theme: ThemeConfig, mode: 'light' | 'dark' = 'light'): string {
  const colors =
    mode === 'dark' && theme.darkColors ? { ...theme.colors, ...theme.darkColors } : theme.colors;

  const vars = Object.entries(colors)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');

  const radiusMap: Record<string, string> = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
    full: '9999px',
  };
  const shadowMap: Record<string, string> = {
    none: 'none',
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  };

  const radius = theme.borderRadius ? `  --radius: ${radiusMap[theme.borderRadius] ?? '8px'};` : '';
  const shadow = theme.shadows ? `  --shadow-md: ${shadowMap[theme.shadows] ?? 'none'};` : '';

  return [vars, radius, shadow].filter(Boolean).join('\n');
}

/**
 * Apply a theme to the document root element via CSS custom properties.
 * Server-safe: checks for browser environment before accessing `document`.
 */
export function applyTheme(theme: ThemeConfig, mode: 'light' | 'dark' = 'light'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const colors =
    mode === 'dark' && theme.darkColors ? { ...theme.colors, ...theme.darkColors } : theme.colors;

  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--color-${key}`, value);
  }

  if (theme.borderRadius) {
    const radiusMap: Record<string, string> = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '12px',
      full: '9999px',
    };
    root.style.setProperty('--radius', radiusMap[theme.borderRadius] ?? '8px');
  }

  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-color-mode', mode);
}

/** Remove theme variables applied by applyTheme() */
export function removeTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const key of Object.keys(theme.colors)) {
    root.style.removeProperty(`--color-${key}`);
  }
  root.removeAttribute('data-theme');
  root.removeAttribute('data-color-mode');
}
