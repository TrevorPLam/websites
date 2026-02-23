/**
 * @file packages/infra/__tests__/color.test.ts
 * Purpose: Unit tests for color system (f-12) — HSL parsing, WCAG contrast
 */

import {
  parseHsl,
  formatHsl,
  hslToCss,
  hslToCssVar,
  adjustLightness,
  adjustSaturation,
  hslToRgb,
  toHexFromHsl,
  mixColors,
  getRelativeLuminance,
  getContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  getWcagLevel,
  suggestForeground,
  validateThemeColors,
  mergeWithDefaults,
  DEFAULT_THEME_COLORS,
  REQUIRED_COLOR_KEYS,
} from '../color';

describe('parseHsl', () => {
  it('parses valid HSL string', () => {
    const result = parseHsl('174 85% 33%');
    expect(result).toEqual({ h: 174, s: 85, l: 33 });
  });

  it('parses integer values', () => {
    const result = parseHsl('0 0% 100%');
    expect(result).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('throws on invalid format', () => {
    expect(() => parseHsl('hsl(174, 85%, 33%)')).toThrow();
    expect(() => parseHsl('#ffffff')).toThrow();
    expect(() => parseHsl('174 85 33')).toThrow();
  });
});

describe('formatHsl', () => {
  it('formats HSL components to project format', () => {
    expect(formatHsl({ h: 174, s: 85, l: 33 })).toBe('174 85% 33%');
  });

  it('rounds fractional values', () => {
    expect(formatHsl({ h: 174.6, s: 85.4, l: 33.1 })).toBe('175 85% 33%');
  });
});

describe('hslToCss', () => {
  it('converts project format to CSS hsl()', () => {
    expect(hslToCss('174 85% 33%')).toBe('hsl(174 85% 33%)');
  });
});

describe('hslToCssVar', () => {
  it('generates CSS var reference', () => {
    expect(hslToCssVar('primary')).toBe('hsl(var(--primary))');
  });
});

describe('adjustLightness', () => {
  it('increases lightness', () => {
    const result = parseHsl(adjustLightness('174 85% 33%', 10));
    expect(result.l).toBe(43);
  });

  it('clamps at 100', () => {
    const result = parseHsl(adjustLightness('174 85% 95%', 20));
    expect(result.l).toBe(100);
  });

  it('clamps at 0', () => {
    const result = parseHsl(adjustLightness('174 85% 5%', -20));
    expect(result.l).toBe(0);
  });
});

describe('adjustSaturation', () => {
  it('decreases saturation', () => {
    const result = parseHsl(adjustSaturation('174 85% 33%', -10));
    expect(result.s).toBe(75);
  });
});

describe('hslToRgb', () => {
  it('converts white correctly', () => {
    const result = hslToRgb('0 0% 100%');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts black correctly', () => {
    const result = hslToRgb('0 0% 0%');
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('toHexFromHsl', () => {
  it('converts white to #ffffff', () => {
    expect(toHexFromHsl('0 0% 100%')).toBe('#ffffff');
  });

  it('converts black to #000000', () => {
    expect(toHexFromHsl('0 0% 0%')).toBe('#000000');
  });
});

describe('mixColors', () => {
  it('returns first color at ratio 0', () => {
    const result = parseHsl(mixColors('0 100% 50%', '240 100% 50%', 0));
    expect(result.h).toBe(0);
  });

  it('returns second color at ratio 1', () => {
    const result = parseHsl(mixColors('0 100% 50%', '240 100% 50%', 1));
    expect(result.h).toBe(240);
  });
});

describe('getRelativeLuminance', () => {
  it('returns 1 for white', () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 2);
  });

  it('returns 0 for black', () => {
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 2);
  });
});

describe('getContrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    const ratio = getContrastRatio('0 0% 0%', '0 0% 100%');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('returns 1:1 for same color', () => {
    const ratio = getContrastRatio('0 0% 50%', '0 0% 50%');
    expect(ratio).toBeCloseTo(1, 1);
  });
});

describe('meetsWcagAA', () => {
  it('black on white passes AA normal text', () => {
    expect(meetsWcagAA('0 0% 0%', '0 0% 100%', 'normal-text')).toBe(true);
  });

  it('light gray on white fails AA normal text', () => {
    expect(meetsWcagAA('0 0% 80%', '0 0% 100%', 'normal-text')).toBe(false);
  });
});

describe('meetsWcagAAA', () => {
  it('black on white passes AAA normal text', () => {
    expect(meetsWcagAAA('0 0% 0%', '0 0% 100%', 'normal-text')).toBe(true);
  });
});

describe('getWcagLevel', () => {
  it('returns AAA for black on white', () => {
    expect(getWcagLevel('0 0% 0%', '0 0% 100%')).toBe('AAA');
  });

  it('returns fail for low-contrast pair', () => {
    expect(getWcagLevel('0 0% 80%', '0 0% 100%')).toBe('fail');
  });
});

describe('suggestForeground', () => {
  it('suggests white for dark background', () => {
    expect(suggestForeground('0 0% 10%')).toBe('0 0% 100%');
  });

  it('suggests black for light background', () => {
    expect(suggestForeground('0 0% 90%')).toBe('0 0% 0%');
  });
});

describe('validateThemeColors', () => {
  it('returns empty array for complete theme', () => {
    expect(validateThemeColors(DEFAULT_THEME_COLORS)).toHaveLength(0);
  });

  it('returns missing keys for incomplete theme', () => {
    const missing = validateThemeColors({ primary: '0 0% 0%' });
    expect(missing.length).toBeGreaterThan(0);
    expect(missing).toContain('background');
  });
});

describe('mergeWithDefaults', () => {
  it('fills missing keys with defaults', () => {
    const merged = mergeWithDefaults({ primary: '200 80% 40%' });
    expect(merged.primary).toBe('200 80% 40%');
    expect(merged.background).toBe(DEFAULT_THEME_COLORS.background);
  });

  it('contains all required keys', () => {
    const merged = mergeWithDefaults({});
    for (const key of REQUIRED_COLOR_KEYS) {
      expect(merged[key]).toBeDefined();
    }
  });
});
