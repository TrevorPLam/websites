import { describe, expect, it } from 'vitest';
import { evaluateFeatureFlag } from '../evaluate';
import { readSiteConfigFeatureFlags } from '../site-config';

describe('evaluateFeatureFlag', () => {
  it('supports tenant targeting', () => {
    const result = evaluateFeatureFlag(
      'newCheckout',
      { enabled: true, tenantIds: ['tenant-1'] },
      { tenantId: 'tenant-1', tier: 'starter' }
    );

    expect(result.enabled).toBe(true);
  });

  it('supports tier checks', () => {
    const result = evaluateFeatureFlag(
      'premiumFeature',
      { enabled: true, tiers: ['enterprise'] },
      { tenantId: 'tenant-1', tier: 'starter' }
    );

    expect(result.enabled).toBe(false);
    expect(result.reason).toBe('tier-filtered');
  });

  it('supports deterministic rollout', () => {
    const context = { tenantId: 'tenant-1', tier: 'starter' } as const;
    const first = evaluateFeatureFlag('rollout', { enabled: true, rollout: 50 }, context);
    const second = evaluateFeatureFlag('rollout', { enabled: true, rollout: 50 }, context);

    expect(first.enabled).toBe(second.enabled);
  });

  it('supports env kill switch', () => {
    const result = evaluateFeatureFlag(
      'killSwitch',
      { enabled: true, envOverride: 'NEXT_PUBLIC_FF_KILL_SWITCH' },
      { tenantId: 'tenant-1', tier: 'starter', env: { NEXT_PUBLIC_FF_KILL_SWITCH: 'false' } }
    );

    expect(result.enabled).toBe(false);
    expect(result.reason).toBe('env-override');
  });
});

describe('readSiteConfigFeatureFlags', () => {
  it('parses site config feature flags', () => {
    const flags = readSiteConfigFeatureFlags({
      featureFlags: {
        featureA: { enabled: true, rollout: 20 }
      }
    });

    expect(flags.featureA.enabled).toBe(true);
    expect(flags.featureA.rollout).toBe(20);
  });
});
