/**
 * @file packages/infra/__tests__/typography.test.ts
 * Purpose: Unit tests for typography system (f-11)
 */

import {
  TYPE_SCALE,
  getTypeScale,
  getTailwindTextClass,
  nearestTypeScaleKey,
  LINE_HEIGHT_SCALE,
  getLineHeight,
  getLeadingClass,
  recommendedLineHeight,
  FONT_STACKS,
  getFontStack,
  getFontStacksByCategory,
  getTypographyCssVars,
  truncateText,
  estimateTextWidth,
  fontWeightToString,
} from '../typography';

describe('TYPE_SCALE', () => {
  it('contains base key with correct px', () => {
    expect(TYPE_SCALE['base'].px).toBe(16);
    expect(TYPE_SCALE['base'].rem).toBe(1);
  });

  it('has correct Tailwind class for xs', () => {
    expect(TYPE_SCALE['xs'].tailwindClass).toBe('text-xs');
  });

  it('has increasing size from xs to 9xl', () => {
    expect(TYPE_SCALE['9xl'].px).toBeGreaterThan(TYPE_SCALE['xs'].px);
  });
});

describe('getTypeScale', () => {
  it('returns correct value for lg', () => {
    const value = getTypeScale('lg');
    expect(value.px).toBe(18);
  });
});

describe('getTailwindTextClass', () => {
  it('returns correct class', () => {
    expect(getTailwindTextClass('2xl')).toBe('text-2xl');
  });
});

describe('nearestTypeScaleKey', () => {
  it('finds exact match', () => {
    expect(nearestTypeScaleKey(16)).toBe('base');
  });

  it('finds nearest for non-exact value', () => {
    expect(nearestTypeScaleKey(17)).toBe('base');
  });

  it('returns xs for very small', () => {
    expect(nearestTypeScaleKey(11)).toBe('xs');
  });
});

describe('LINE_HEIGHT_SCALE', () => {
  it('has correct value for normal', () => {
    expect(LINE_HEIGHT_SCALE['normal'].value).toBe('1.5');
    expect(LINE_HEIGHT_SCALE['normal'].tailwindClass).toBe('leading-normal');
  });
});

describe('getLineHeight', () => {
  it('returns correct value for relaxed', () => {
    const value = getLineHeight('relaxed');
    expect(value.value).toBe('1.625');
  });
});

describe('getLeadingClass', () => {
  it('returns Tailwind leading class', () => {
    expect(getLeadingClass('tight')).toBe('leading-tight');
  });
});

describe('recommendedLineHeight', () => {
  it('returns none for very large text', () => {
    expect(recommendedLineHeight(60)).toBe('none');
  });

  it('returns tight for heading text', () => {
    expect(recommendedLineHeight(36)).toBe('tight');
  });

  it('returns relaxed for small body text', () => {
    expect(recommendedLineHeight(14)).toBe('relaxed');
  });
});

describe('FONT_STACKS', () => {
  it('contains inter stack', () => {
    expect(FONT_STACKS['inter'].category).toBe('sans-serif');
    expect(FONT_STACKS['inter'].isSystemFont).toBe(false);
  });

  it('contains system-mono stack', () => {
    expect(FONT_STACKS['system-mono'].isSystemFont).toBe(true);
  });
});

describe('getFontStack', () => {
  it('returns CSS font-family string', () => {
    const stack = getFontStack('inter');
    expect(stack).toContain('Inter');
    expect(stack).toContain('sans-serif');
  });
});

describe('getFontStacksByCategory', () => {
  it('returns only sans-serif fonts', () => {
    const stacks = getFontStacksByCategory('sans-serif');
    expect(stacks.every((s) => s.category === 'sans-serif')).toBe(true);
    expect(stacks.length).toBeGreaterThan(0);
  });

  it('returns monospace fonts', () => {
    const stacks = getFontStacksByCategory('monospace');
    expect(stacks.length).toBeGreaterThan(0);
  });
});

describe('getTypographyCssVars', () => {
  it('returns font-size CSS vars', () => {
    const vars = getTypographyCssVars();
    expect(vars['--font-size-base']).toBe('1rem');
    expect(vars['--font-size-xs']).toBe('0.75rem');
  });

  it('returns line-height CSS vars', () => {
    const vars = getTypographyCssVars();
    expect(vars['--line-height-normal']).toBe('1.5');
  });
});

describe('truncateText', () => {
  it('does not truncate short text', () => {
    expect(truncateText('Hello', 100)).toBe('Hello');
  });

  it('truncates long text with ellipsis', () => {
    const long = 'a'.repeat(200);
    const result = truncateText(long, 50);
    expect(result.length).toBe(50);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('estimateTextWidth', () => {
  it('returns positive width', () => {
    expect(estimateTextWidth('Hello World', 16)).toBeGreaterThan(0);
  });

  it('scales with font size', () => {
    const small = estimateTextWidth('Hello', 14);
    const large = estimateTextWidth('Hello', 28);
    expect(large).toBeGreaterThan(small);
  });
});

describe('fontWeightToString', () => {
  it('returns Bold for 700', () => {
    expect(fontWeightToString(700)).toBe('Bold');
  });

  it('returns Regular for 400', () => {
    expect(fontWeightToString(400)).toBe('Regular');
  });
});
