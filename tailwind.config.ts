/**
 * @file tailwind.config.ts
 * @summary Central Tailwind config extending theme with shared design tokens.
 * @security Configuration-only module; does not process sensitive data.
 * @requirements GAP-CONFIG-001
 */

import type { Config } from 'tailwindcss';
import { designTokens } from './packages/design-tokens/src';

const config: Config = {
  content: ['./clients/**/*.{ts,tsx}', './packages/**/*.{ts,tsx}', './apps/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: `hsl(${designTokens.color.primary})`,
        foreground: `hsl(${designTokens.color.foreground})`,
        border: `hsl(${designTokens.color.border})`,
      },
      spacing: designTokens.spacing,
      borderRadius: designTokens.radius,
      fontFamily: {
        sans: designTokens.typography.fontFamilySans,
        mono: designTokens.typography.fontFamilyMono,
      },
    },
  },
};

export default config;
