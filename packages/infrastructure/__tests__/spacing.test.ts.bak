/**
 * @file packages/infra/__tests__/spacing.test.ts
 * Purpose: Unit tests for spacing system (f-10)
 */

import {
  SPACING_SCALE,
  SEMANTIC_SPACING,
  spacingTailwindSuffix,
  pxToRem,
  remToPx,
  getSpacingValue,
  getSemanticSpacing,
  spacingVar,
  getSpacingCssVars,
  clampSpacing,
  scaleSpacing,
} from '../spacing';

describe('SPACING_SCALE', () => {
  it('contains all expected keys', () => {
    expect(SPACING_SCALE['0']).toBeDefined();
    expect(SPACING_SCALE['4']).toBeDefined();
    expect(SPACING_SCALE['16']).toBeDefined();
    expect(SPACING_SCALE['96']).toBeDefined();
  });

  it('has correct px values', () => {
    expect(SPACING_SCALE['4'].px).toBe(16);
    expect(SPACING_SCALE['8'].px).toBe(32);
    expect(SPACING_SCALE['0'].px).toBe(0);
  });

  it('has correct rem values', () => {
    expect(SPACING_SCALE['4'].rem).toBe(1);
    expect(SPACING_SCALE['8'].rem).toBe(2);
  });
});

describe('SEMANTIC_SPACING', () => {
  it('maps md to spacing key 4 (16px)', () => {
    expect(SEMANTIC_SPACING['md']).toBe('4');
  });

  it('maps none to 0', () => {
    expect(SEMANTIC_SPACING['none']).toBe('0');
  });
});

describe('spacingTailwindSuffix', () => {
  it('returns correct suffix for md', () => {
    expect(spacingTailwindSuffix('md')).toBe('4');
  });

  it('returns correct suffix for lg', () => {
    expect(spacingTailwindSuffix('lg')).toBe('6');
  });
});

describe('pxToRem', () => {
  it('converts 16px to 1rem', () => {
    expect(pxToRem(16)).toBe('1rem');
  });

  it('converts 8px to 0.5rem', () => {
    expect(pxToRem(8)).toBe('0.5rem');
  });

  it('uses custom base font size', () => {
    expect(pxToRem(18, 18)).toBe('1rem');
  });
});

describe('remToPx', () => {
  it('converts 1rem to 16px', () => {
    expect(remToPx(1)).toBe(16);
  });

  it('converts 2rem to 32px', () => {
    expect(remToPx(2)).toBe(32);
  });
});

describe('getSpacingValue', () => {
  it('returns spacing value for valid key', () => {
    const value = getSpacingValue('4');
    expect(value.px).toBe(16);
    expect(value.rem).toBe(1);
  });

  it('throws for invalid key', () => {
    expect(() => getSpacingValue('invalid' as never)).toThrow();
  });
});

describe('getSemanticSpacing', () => {
  it('returns correct value for md', () => {
    const value = getSemanticSpacing('md');
    expect(value.px).toBe(16);
  });
});

describe('spacingVar', () => {
  it('returns CSS variable reference', () => {
    expect(spacingVar('md')).toBe('var(--spacing-md)');
  });
});

describe('getSpacingCssVars', () => {
  it('returns object with CSS variables', () => {
    const vars = getSpacingCssVars();
    expect(vars['--spacing-md']).toBe('1rem');
    expect(vars['--spacing-none']).toBe('0rem');
  });
});

describe('clampSpacing', () => {
  it('clamps value within range', () => {
    const result = clampSpacing(5, '2', '8'); // min=8, max=32
    expect(result).toBe(8); // below min, clamps to 8
  });

  it('passes through value within range', () => {
    const result = clampSpacing(16, '2', '8'); // min=8, max=32
    expect(result).toBe(16);
  });
});

describe('scaleSpacing', () => {
  it('scales spacing by multiplier', () => {
    const result = scaleSpacing('4', 2); // 16px * 2 = 32px
    expect(result).toBe(32);
  });
});
