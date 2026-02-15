// File: packages/config/tailwind-preset.js  [TRACE:FILE=packages.config.tailwindPreset]
// @deprecated Task 0.4 (2026-02-15): Replaced by tailwind-theme.css for Tailwind v4.
//            Tailwind v4 removes tailwind.config.js; use @import "@repo/config/tailwind-theme.css" instead.
// Purpose: [LEGACY] Shared Tailwind CSS preset for v3. Replaced by packages/config/tailwind-theme.css.
// Exports / Entry: N/A (deprecated)
//
// Invariants:
// - Must provide semantic color mappings (primary, secondary, muted, etc.)
// - Must include border radius, typography, and spacing configurations
// - All colors must map to CSS custom properties for theming flexibility
// - Configuration must be compatible with Tailwind CSS v3+ standards
// - Components should never reference hardcoded colors, only semantic classes
//
// Status: @public
// Features:
// - [FEAT:DESIGN] Design system configuration and semantic color mapping
// - [FEAT:THEMING] CSS custom properties for dynamic theming
// - [FEAT:CONFIGURATION] Reusable preset for all templates
// - [FEAT:RESPONSIVE] Responsive design tokens and breakpoints
// - [FEAT:TYPOGRAPHY] Font family and text sizing configuration

/** @type {import('tailwindcss').Config} */
// [TRACE:FUNC=packages.config.tailwindPreset.preset]
// [FEAT:DESIGN] [FEAT:THEMING] [FEAT:CONFIGURATION]
// NOTE: Main Tailwind preset - provides semantic color mappings and design system configuration.
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // [TRACE:BLOCK=packages.config.tailwindPreset.primaryColors]
        // [FEAT:THEMING]
        // NOTE: Primary color palette - maps semantic colors to CSS custom properties.
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },

        // [TRACE:BLOCK=packages.config.tailwindPreset.secondaryColors]
        // [FEAT:THEMING]
        // NOTE: Secondary color palette - provides alternative primary color scheme.
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        // [TRACE:BLOCK=packages.config.tailwindPreset.neutralColors]
        // [FEAT:THEMING]
        // NOTE: Neutral color palette - includes muted, accent, and card colors.
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // [TRACE:BLOCK=packages.config.tailwindPreset.statusColors]
        // [FEAT:THEMING]
        // NOTE: Status color palette - includes destructive and border colors.
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },

      // [TRACE:BLOCK=packages.config.tailwindPreset.spacing]
      // [FEAT:RESPONSIVE]
      // NOTE: Border radius configuration - provides consistent rounding across components.
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        md: 'calc(var(--radius) + 2px)',
        sm: 'calc(var(--radius) - 2px)',
      },

      // [TRACE:BLOCK=packages.config.tailwindPreset.typography]
      // [FEAT:TYPOGRAPHY]
      // NOTE: Font family configuration - defines heading and body text fonts.
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
    },
  },
};
