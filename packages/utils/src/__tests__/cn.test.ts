/**
 * cn() utility tests.
 * Verifies CSS class merging, Tailwind deduplication, and edge cases.
 */

import { cn } from '../cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    const isHidden = false;
    expect(cn('base', isHidden && 'hidden')).toBe('base');
    const isVisible = true;
    expect(cn('base', isVisible && 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn(undefined, null, 'x')).toBe('x');
  });

  it('handles empty string', () => {
    expect(cn('', 'a')).toBe('a');
  });

  it('handles array of classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('handles object syntax for conditional classes', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });
});
