// File: packages/infra/typography/fonts.ts  [TRACE:FILE=packages.infra.typography.fonts]
// Purpose: Font stack definitions and web-safe font fallback stacks.
//          Provides typed font family constants for system UI, serif, mono, and common web fonts.
//
// System role: Font definitions consumed by ThemeInjector and CSS variable generation.
// Entry point: import from '@repo/infrastructure/typography'
//
// Exports / Entry: FONT_STACKS, FontStackKey, SystemFontStack, getFontStack
// Used by: ThemeInjector, site.config.ts theme validation, UI components
//
// Invariants:
// - All stacks end with a generic family keyword (sans-serif, serif, monospace)
// - Fallback stacks are ordered: named font → system UI → generic
//
// Status: @public
// Features:
// - [FEAT:TYPOGRAPHY] Font stack definitions

/** Font stack key identifiers */
export type FontStackKey =
  | 'system-sans'
  | 'system-serif'
  | 'system-mono'
  | 'inter'
  | 'geist'
  | 'roboto'
  | 'open-sans'
  | 'lato'
  | 'poppins'
  | 'playfair-display'
  | 'merriweather'
  | 'source-code-pro'
  | 'fira-code';

/** Font category */
export type FontCategory = 'sans-serif' | 'serif' | 'monospace';

/** Font stack definition */
export interface FontStack {
  /** CSS font-family string */
  value: string;
  /** Font category */
  category: FontCategory;
  /** Whether this is a web-safe (system) font */
  isSystemFont: boolean;
  /** Human-readable display name */
  displayName: string;
}

/** Standard font stacks with proper fallbacks */
export const FONT_STACKS: Readonly<Record<FontStackKey, FontStack>> = {
  'system-sans': {
    value:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    category: 'sans-serif',
    isSystemFont: true,
    displayName: 'System Sans-Serif',
  },
  'system-serif': {
    value: 'Georgia, Cambria, "Times New Roman", Times, serif',
    category: 'serif',
    isSystemFont: true,
    displayName: 'System Serif',
  },
  'system-mono': {
    value:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    category: 'monospace',
    isSystemFont: true,
    displayName: 'System Monospace',
  },
  inter: {
    value: 'Inter, system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Inter',
  },
  geist: {
    value: '"Geist", system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Geist',
  },
  roboto: {
    value: 'Roboto, system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Roboto',
  },
  'open-sans': {
    value: '"Open Sans", system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Open Sans',
  },
  lato: {
    value: 'Lato, system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Lato',
  },
  poppins: {
    value: 'Poppins, system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    isSystemFont: false,
    displayName: 'Poppins',
  },
  'playfair-display': {
    value: '"Playfair Display", Georgia, serif',
    category: 'serif',
    isSystemFont: false,
    displayName: 'Playfair Display',
  },
  merriweather: {
    value: 'Merriweather, Georgia, serif',
    category: 'serif',
    isSystemFont: false,
    displayName: 'Merriweather',
  },
  'source-code-pro': {
    value: '"Source Code Pro", "SF Mono", Menlo, monospace',
    category: 'monospace',
    isSystemFont: false,
    displayName: 'Source Code Pro',
  },
  'fira-code': {
    value: '"Fira Code", "SF Mono", Menlo, monospace',
    category: 'monospace',
    isSystemFont: false,
    displayName: 'Fira Code',
  },
} as const;

/**
 * Get a font stack value by key.
 * @param key - Font stack identifier
 */
export function getFontStack(key: FontStackKey): string {
  return FONT_STACKS[key].value;
}

/**
 * Get all font stacks of a given category.
 * @param category - 'sans-serif' | 'serif' | 'monospace'
 */
export function getFontStacksByCategory(category: FontCategory): FontStack[] {
  return Object.values(FONT_STACKS).filter((f) => f.category === category);
}
