/**
 * @file packages/infrastructure/theme/src/__tests__/theme-extension.test.ts
 * Tests for: design tokens, theme extension, CSS variable generation, utils
 */

import { DEFAULT_TOKENS } from '../tokens';
import { extendTokens, mergeTokens, createThemeVariant } from '../extension';
import {
  tokensToCSSVars,
  tokensToStyleObject,
  generateThemeCSS,
  camelToKebab,
  cssVarName,
} from '../css-vars';
import {
  parseHSL,
  stringifyHSL,
  adjustLightness,
  adjustSaturation,
  contrastRatio,
  meetsWCAGAA,
  tokenVar,
} from '../utils';

// ─── DEFAULT_TOKENS ───────────────────────────────────────────────────────────

describe('DEFAULT_TOKENS', () => {
  it('has all required color keys', () => {
    const keys: (keyof typeof DEFAULT_TOKENS.colors)[] = [
      'primary', 'secondary', 'background', 'foreground',
      'accent', 'muted', 'card', 'border', 'ring', 'destructive',
    ];
    for (const key of keys) {
      expect(DEFAULT_TOKENS.colors[key]).toBeDefined();
    }
  });

  it('has darkColors overrides', () => {
    expect(DEFAULT_TOKENS.darkColors.background).toBeDefined();
  });

  it('has radius tokens', () => {
    expect(DEFAULT_TOKENS.radius.md).toBe('6px');
  });

  it('has animation tokens', () => {
    expect(DEFAULT_TOKENS.animation.durationNormal).toBe('200ms');
  });
});

// ─── extendTokens ─────────────────────────────────────────────────────────────

describe('extendTokens', () => {
  it('merges color overrides without mutating the base', () => {
    const basePrimary = DEFAULT_TOKENS.colors.primary;
    const extended = extendTokens(DEFAULT_TOKENS, {
      colors: { primary: '262 83% 58%' },
    });

    expect(extended.colors.primary).toBe('262 83% 58%');
    expect(DEFAULT_TOKENS.colors.primary).toBe(basePrimary); // base unchanged
  });

  it('preserves unoverridden colors', () => {
    const extended = extendTokens(DEFAULT_TOKENS, {
      colors: { primary: '0 0% 0%' },
    });
    expect(extended.colors.secondary).toBe(DEFAULT_TOKENS.colors.secondary);
  });

  it('merges radius overrides', () => {
    const extended = extendTokens(DEFAULT_TOKENS, { radius: { md: '999px' } });
    expect(extended.radius.md).toBe('999px');
    expect(extended.radius.sm).toBe(DEFAULT_TOKENS.radius.sm);
  });
});

// ─── mergeTokens ─────────────────────────────────────────────────────────────

describe('mergeTokens', () => {
  it('applies overrides left-to-right (last wins)', () => {
    const result = mergeTokens(
      DEFAULT_TOKENS,
      { colors: { primary: 'first' } },
      { colors: { primary: 'second' } }
    );
    expect(result.colors.primary).toBe('second');
  });

  it('handles zero overrides (returns base copy)', () => {
    const result = mergeTokens(DEFAULT_TOKENS);
    expect(result.colors.primary).toBe(DEFAULT_TOKENS.colors.primary);
  });
});

// ─── createThemeVariant ───────────────────────────────────────────────────────

describe('createThemeVariant', () => {
  it('creates a named variant', () => {
    const variant = createThemeVariant('my-theme', {
      colors: { primary: '287 54% 42%' },
    });
    expect(variant.name).toBe('my-theme');
    expect(variant.tokens.colors.primary).toBe('287 54% 42%');
  });

  it('falls back to DEFAULT_TOKENS as base', () => {
    const variant = createThemeVariant('test', {});
    expect(variant.tokens.colors.secondary).toBe(DEFAULT_TOKENS.colors.secondary);
  });
});

// ─── camelToKebab ────────────────────────────────────────────────────────────

describe('camelToKebab', () => {
  it('converts camelCase to kebab-case', () => {
    expect(camelToKebab('primaryForeground')).toBe('primary-foreground');
    expect(camelToKebab('fontSizeBase')).toBe('font-size-base');
  });

  it('leaves lowercase unchanged', () => {
    expect(camelToKebab('primary')).toBe('primary');
  });
});

// ─── cssVarName ───────────────────────────────────────────────────────────────

describe('cssVarName', () => {
  it('generates correct CSS variable name', () => {
    expect(cssVarName('colors', 'primary')).toBe('--dt-colors-primary');
    expect(cssVarName('colors', 'primaryForeground')).toBe('--dt-colors-primary-foreground');
  });
});

// ─── tokensToCSSVars ─────────────────────────────────────────────────────────

describe('tokensToCSSVars', () => {
  it('generates :root block for light mode', () => {
    const css = tokensToCSSVars(DEFAULT_TOKENS, 'light');
    expect(css).toContain(':root {');
    expect(css).toContain('--dt-colors-primary:');
    expect(css).toContain('--dt-radius-md:');
    expect(css).toContain('--dt-animation-duration-normal:');
  });

  it('uses darkColors overrides in dark mode', () => {
    const css = tokensToCSSVars(DEFAULT_TOKENS, 'dark');
    expect(css).toContain(DEFAULT_TOKENS.darkColors.background ?? '');
  });

  it('uses custom selector', () => {
    const css = tokensToCSSVars(DEFAULT_TOKENS, 'light', '.my-scope');
    expect(css).toContain('.my-scope {');
  });
});

// ─── tokensToStyleObject ─────────────────────────────────────────────────────

describe('tokensToStyleObject', () => {
  it('returns a plain object of CSS variable declarations', () => {
    const style = tokensToStyleObject(DEFAULT_TOKENS, 'light');
    expect(typeof style['--dt-colors-primary']).toBe('string');
  });

  it('applies dark color overrides', () => {
    const light = tokensToStyleObject(DEFAULT_TOKENS, 'light');
    const dark = tokensToStyleObject(DEFAULT_TOKENS, 'dark');
    expect(dark['--dt-colors-background']).toBe(DEFAULT_TOKENS.darkColors.background);
    expect(light['--dt-colors-background']).toBe(DEFAULT_TOKENS.colors.background);
  });
});

// ─── generateThemeCSS ────────────────────────────────────────────────────────

describe('generateThemeCSS', () => {
  it('contains both :root and dark mode selectors', () => {
    const css = generateThemeCSS(DEFAULT_TOKENS);
    expect(css).toContain(':root {');
    expect(css).toContain('[data-color-mode="dark"] {');
  });
});

// ─── parseHSL / stringifyHSL ─────────────────────────────────────────────────

describe('parseHSL', () => {
  it('parses valid HSL string', () => {
    const result = parseHSL('174 85% 33%');
    expect(result).toEqual({ h: 174, s: 85, l: 33 });
  });

  it('returns null for invalid input', () => {
    expect(parseHSL('not-a-color')).toBeNull();
    expect(parseHSL('hsl(174, 85%, 33%)')).toBeNull();
  });

  it('handles decimals', () => {
    const result = parseHSL('174.5 85.2% 33.1%');
    expect(result?.h).toBeCloseTo(174.5);
  });
});

describe('stringifyHSL', () => {
  it('formats correctly', () => {
    expect(stringifyHSL({ h: 174, s: 85, l: 33 })).toBe('174 85% 33%');
  });
});

// ─── adjustLightness ─────────────────────────────────────────────────────────

describe('adjustLightness', () => {
  it('increases lightness', () => {
    const result = adjustLightness('174 85% 33%', 10);
    expect(result).toBe('174 85% 43%');
  });

  it('clamps to 0–100', () => {
    expect(adjustLightness('174 85% 95%', 20)).toBe('174 85% 100%');
    expect(adjustLightness('174 85% 5%', -20)).toBe('174 85% 0%');
  });

  it('returns original for invalid input', () => {
    expect(adjustLightness('invalid', 10)).toBe('invalid');
  });
});

// ─── adjustSaturation ────────────────────────────────────────────────────────

describe('adjustSaturation', () => {
  it('decreases saturation', () => {
    const result = adjustSaturation('174 85% 33%', -10);
    expect(result).toBe('174 75% 33%');
  });
});

// ─── tokenVar ────────────────────────────────────────────────────────────────

describe('tokenVar', () => {
  it('generates var() reference', () => {
    expect(tokenVar('colors', 'primary')).toBe('var(--dt-colors-primary)');
  });

  it('includes fallback when provided', () => {
    expect(tokenVar('colors', 'primary', '174 85% 33%')).toBe(
      'var(--dt-colors-primary, 174 85% 33%)'
    );
  });
});

// ─── contrastRatio ───────────────────────────────────────────────────────────

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    // white: 0 0% 100%, black: 0 0% 0%
    const ratio = contrastRatio('0 0% 100%', '0 0% 0%');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('returns 1 for same color', () => {
    const ratio = contrastRatio('0 0% 50%', '0 0% 50%');
    expect(ratio).toBeCloseTo(1, 0);
  });

  it('returns null for invalid input', () => {
    expect(contrastRatio('invalid', '0 0% 100%')).toBeNull();
  });
});

// ─── meetsWCAGAA ─────────────────────────────────────────────────────────────

describe('meetsWCAGAA', () => {
  it('passes for high-contrast colors', () => {
    expect(meetsWCAGAA('0 0% 0%', '0 0% 100%')).toBe(true);
  });

  it('fails for low-contrast colors', () => {
    expect(meetsWCAGAA('0 0% 60%', '0 0% 50%')).toBe(false);
  });
});
