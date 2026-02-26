import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
/**
 * @file packages/infra/__tests__/border.test.ts
 * Purpose: Unit tests for border system (f-14)
 */

import {
  RADIUS_SCALE,
  getRadius,
  radiusIntensityToKey,
  getRadiusClass,
  getRadiusCssVars,
  BORDER_WIDTH_SCALE,
  getBorderWidth,
  getBorderWidthClass,
  radiusVar,
  borderShorthand,
  getAllBorderCssVars,
} from '../border';

describe('RADIUS_SCALE', () => {
  it('contains all expected keys', () => {
    expect(RADIUS_SCALE['none']).toBeDefined();
    expect(RADIUS_SCALE['sm']).toBeDefined();
    expect(RADIUS_SCALE['md']).toBeDefined();
    expect(RADIUS_SCALE['full']).toBeDefined();
  });

  it('none has css value of "0px"', () => {
    expect(RADIUS_SCALE['none'].css).toBe('0px');
    expect(RADIUS_SCALE['none'].px).toBe(0);
  });

  it('full has very large px value', () => {
    expect(RADIUS_SCALE['full'].px).toBe(9999);
  });

  it('has Tailwind classes', () => {
    expect(RADIUS_SCALE['sm'].tailwindClass).toBe('rounded-sm');
    expect(RADIUS_SCALE['full'].tailwindClass).toBe('rounded-full');
  });
});

describe('getRadius', () => {
  it('returns radius value for md', () => {
    const radius = getRadius('md');
    expect(radius.css).toBe('0.375rem');
    expect(radius.px).toBe(6);
  });
});

describe('radiusIntensityToKey', () => {
  it('maps medium to md', () => {
    expect(radiusIntensityToKey('medium')).toBe('md');
  });

  it('maps none to none', () => {
    expect(radiusIntensityToKey('none')).toBe('none');
  });

  it('maps full to full', () => {
    expect(radiusIntensityToKey('full')).toBe('full');
  });
});

describe('getRadiusClass', () => {
  it('returns Tailwind class for xl', () => {
    expect(getRadiusClass('xl')).toBe('rounded-xl');
  });
});

describe('BORDER_WIDTH_SCALE', () => {
  it('contains all expected keys', () => {
    expect(BORDER_WIDTH_SCALE['0']).toBeDefined();
    expect(BORDER_WIDTH_SCALE['default']).toBeDefined();
    expect(BORDER_WIDTH_SCALE['2']).toBeDefined();
  });

  it('default is 1px', () => {
    expect(BORDER_WIDTH_SCALE['default'].px).toBe(1);
    expect(BORDER_WIDTH_SCALE['default'].css).toBe('1px');
    expect(BORDER_WIDTH_SCALE['default'].tailwindClass).toBe('border');
  });
});

describe('getBorderWidth', () => {
  it('returns border width for key 2', () => {
    const bw = getBorderWidth('2');
    expect(bw.px).toBe(2);
    expect(bw.css).toBe('2px');
  });
});

describe('getBorderWidthClass', () => {
  it('returns Tailwind class', () => {
    expect(getBorderWidthClass('4')).toBe('border-4');
  });
});

describe('getRadiusCssVars', () => {
  it('generates CSS variables for all radius keys', () => {
    const vars = getRadiusCssVars();
    expect(vars['--radius-md']).toBe('0.375rem');
    expect(vars['--radius-none']).toBe('0px');
  });
});

describe('getAllBorderCssVars', () => {
  it('generates CSS variables for border widths', () => {
    const vars = getAllBorderCssVars();
    expect(vars['--border-width-default']).toBe('1px');
    expect(vars['--border-width-2']).toBe('2px');
  });
});

describe('radiusVar', () => {
  it('generates CSS var reference', () => {
    expect(radiusVar('lg')).toBe('var(--radius-lg)');
  });
});

describe('borderShorthand', () => {
  it('creates border shorthand string', () => {
    const border = borderShorthand('1px', 'solid', 'hsl(var(--border))');
    expect(border).toBe('1px solid hsl(var(--border))');
  });

  it('uses defaults correctly', () => {
    const border = borderShorthand('2px');
    expect(border).toBe('2px solid currentColor');
  });
});

describe('getAllBorderCssVars', () => {
  it('contains both radius and border width vars', () => {
    const vars = getAllBorderCssVars();
    expect(vars['--radius-md']).toBeDefined();
    expect(vars['--border-width-default']).toBeDefined();
  });
});
