import { describe, expect, it } from 'vitest';
import { buildAnonymizedEmail, normalizeEmail } from '../erasure';

describe('erasure helpers', () => {
  it('normalizes email', () => {
    expect(normalizeEmail('  USER@Example.com ')).toBe('user@example.com');
  });

  it('builds deterministic anonymized email', () => {
    expect(buildAnonymizedEmail('User@Example.com')).toMatch(
      /^deleted\+[a-f0-9]{12}@gdpr-erased\.local$/
    );
    expect(buildAnonymizedEmail('User@Example.com')).toBe(buildAnonymizedEmail('user@example.com'));
  });
});
