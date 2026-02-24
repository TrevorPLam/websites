import { describe, expect, it } from 'vitest';
import { assignVariant, pathMatchesPattern } from '../experiments/ab-testing';

describe('ab-testing helpers', () => {
  it('assignVariant is deterministic for the same visitor + experiment', () => {
    const variants = [
      { id: 'control', weight: 50 },
      { id: 'variant-b', weight: 50 },
    ];

    const first = assignVariant('203.0.113.10', 'hero-layout-test-v1', variants);
    const second = assignVariant('203.0.113.10', 'hero-layout-test-v1', variants);

    expect(first).toBe(second);
  });

  it('pathMatchesPattern supports exact, wildcard, and prefix rules', () => {
    expect(pathMatchesPattern('/', '/')).toBe(true);
    expect(pathMatchesPattern('/services/plumbing', '/services/*')).toBe(true);
    expect(pathMatchesPattern('/about', '*')).toBe(true);
    expect(pathMatchesPattern('/contact', '/services/*')).toBe(false);
  });
});
