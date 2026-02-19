/**
 * @file packages/infra/__tests__/shadow.test.ts
 * Purpose: Unit tests for shadow system (f-13)
 */

import {
  SHADOW_SCALE,
  SHADOW_INTENSITY_MAP,
  getShadow,
  shadowIntensityToKey,
  getShadowClass,
  getShadowCssVars,
  coloredShadow,
  elevationToShadow,
  combineShadows,
  shadowVar,
} from '../shadow';

describe('SHADOW_SCALE', () => {
  it('contains all expected keys', () => {
    expect(SHADOW_SCALE['none']).toBeDefined();
    expect(SHADOW_SCALE['sm']).toBeDefined();
    expect(SHADOW_SCALE['md']).toBeDefined();
    expect(SHADOW_SCALE['lg']).toBeDefined();
    expect(SHADOW_SCALE['xl']).toBeDefined();
    expect(SHADOW_SCALE['2xl']).toBeDefined();
    expect(SHADOW_SCALE['inner']).toBeDefined();
  });

  it('none has css value of "none"', () => {
    expect(SHADOW_SCALE['none'].css).toBe('none');
  });

  it('has Tailwind classes', () => {
    expect(SHADOW_SCALE['sm'].tailwindClass).toBe('shadow-sm');
    expect(SHADOW_SCALE['md'].tailwindClass).toBe('shadow');
    expect(SHADOW_SCALE['lg'].tailwindClass).toBe('shadow-lg');
  });
});

describe('getShadow', () => {
  it('returns shadow value for valid key', () => {
    const shadow = getShadow('md');
    expect(shadow.tailwindClass).toBe('shadow');
    expect(shadow.css).toContain('rgb');
  });
});

describe('shadowIntensityToKey', () => {
  it('maps medium to md', () => {
    expect(shadowIntensityToKey('medium')).toBe('md');
  });

  it('maps none to none', () => {
    expect(shadowIntensityToKey('none')).toBe('none');
  });

  it('maps large to lg', () => {
    expect(shadowIntensityToKey('large')).toBe('lg');
  });
});

describe('getShadowClass', () => {
  it('returns Tailwind class', () => {
    expect(getShadowClass('xl')).toBe('shadow-xl');
  });
});

describe('getShadowCssVars', () => {
  it('returns CSS variable object', () => {
    const vars = getShadowCssVars();
    expect(vars['--shadow-sm']).toBeDefined();
    expect(vars['--shadow-none']).toBe('none');
  });
});

describe('coloredShadow', () => {
  it('generates valid CSS box-shadow string', () => {
    const shadow = coloredShadow(0, 0, 0, 0.1);
    expect(shadow).toContain('rgba(0, 0, 0, 0.1)');
    expect(shadow).toContain('px');
  });
});

describe('elevationToShadow', () => {
  it('maps 0 to none', () => {
    expect(elevationToShadow(0)).toBe('none');
  });

  it('maps 2 to md', () => {
    expect(elevationToShadow(2)).toBe('md');
  });

  it('maps 5 to 2xl', () => {
    expect(elevationToShadow(5)).toBe('2xl');
  });
});

describe('combineShadows', () => {
  it('combines two shadows', () => {
    const result = combineShadows('sm', 'lg');
    expect(result).toContain(',');
  });

  it('filters out none', () => {
    const result = combineShadows('none', 'sm');
    expect(result).not.toContain('none');
  });
});

describe('shadowVar', () => {
  it('generates CSS var reference', () => {
    expect(shadowVar('md')).toBe('var(--shadow-md)');
  });
});
