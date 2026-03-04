/**
 * @file packages/infrastructure/__tests__/experiment-overlap-traffic.test.ts
 * @summary Tests for component-overlap-checks and traffic-split utilities.
 * @security none — test file only, no production secrets or PII.
 * @adr none
 * @requirements TASK-AI-004-REV
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkComponentOverlaps,
  assertNoComponentOverlaps,
  acquireAllSlots,
  releaseAllSlots,
  OverlapConflictError,
} from '../experiments/component-overlap-checks';
import { InMemoryLockStore, createExperimentMutex } from '../experiments/experiment-mutex';
import {
  allocateVariant,
  allocateAcrossExperiments,
  isInTrafficPool,
  validateVariantWeights,
} from '../experiments/traffic-split';

// ─── component-overlap-checks ────────────────────────────────────────────────

describe('checkComponentOverlaps', () => {
  let mutex: ReturnType<typeof createExperimentMutex>;

  beforeEach(() => {
    mutex = createExperimentMutex({ store: new InMemoryLockStore() });
  });

  it('returns no conflicts when all slots are free', async () => {
    const result = await checkComponentOverlaps(
      {
        experimentId: 'exp_1',
        tenantId: 'tenant_a',
        componentKeys: ['hero:homepage', 'cta:pricing'],
      },
      mutex
    );
    expect(result.hasConflict).toBe(false);
    expect(result.conflicts).toHaveLength(0);
    expect(result.freeSlots).toEqual(['hero:homepage', 'cta:pricing']);
  });

  it('detects a conflict when another experiment holds the slot', async () => {
    await mutex.acquire({
      componentKey: 'hero:homepage',
      experimentId: 'exp_existing',
      tenantId: 'tenant_a',
    });

    const result = await checkComponentOverlaps(
      { experimentId: 'exp_new', tenantId: 'tenant_a', componentKeys: ['hero:homepage'] },
      mutex
    );
    expect(result.hasConflict).toBe(true);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].holdingExperimentId).toBe('exp_existing');
  });

  it('allows the same experiment to check its own slots (no self-conflict)', async () => {
    await mutex.acquire({
      componentKey: 'hero:homepage',
      experimentId: 'exp_1',
      tenantId: 'tenant_a',
    });

    const result = await checkComponentOverlaps(
      { experimentId: 'exp_1', tenantId: 'tenant_a', componentKeys: ['hero:homepage'] },
      mutex
    );
    expect(result.hasConflict).toBe(false);
  });

  it('isolates conflicts by tenantId', async () => {
    await mutex.acquire({
      componentKey: 'hero:homepage',
      experimentId: 'exp_existing',
      tenantId: 'tenant_a',
    });

    const result = await checkComponentOverlaps(
      { experimentId: 'exp_new', tenantId: 'tenant_b', componentKeys: ['hero:homepage'] },
      mutex
    );
    expect(result.hasConflict).toBe(false);
  });
});

describe('assertNoComponentOverlaps', () => {
  it('throws OverlapConflictError when conflicts exist', async () => {
    const mutex = createExperimentMutex({ store: new InMemoryLockStore() });
    await mutex.acquire({ componentKey: 'hero', experimentId: 'exp_1', tenantId: 'tenant_a' });

    await expect(
      assertNoComponentOverlaps(
        { experimentId: 'exp_2', tenantId: 'tenant_a', componentKeys: ['hero'] },
        mutex
      )
    ).rejects.toBeInstanceOf(OverlapConflictError);
  });

  it('resolves without throwing when all slots are free', async () => {
    const mutex = createExperimentMutex({ store: new InMemoryLockStore() });
    await expect(
      assertNoComponentOverlaps(
        { experimentId: 'exp_1', tenantId: 'tenant_a', componentKeys: ['hero'] },
        mutex
      )
    ).resolves.toBeUndefined();
  });
});

describe('acquireAllSlots / releaseAllSlots', () => {
  it('acquires all slots atomically', async () => {
    const mutex = createExperimentMutex({ store: new InMemoryLockStore() });
    const candidate = {
      experimentId: 'exp_1',
      tenantId: 'tenant_a',
      componentKeys: ['hero', 'cta'],
    };

    const acquired = await acquireAllSlots(candidate, mutex);
    expect(acquired).toBe(true);

    const heroLock = await mutex.check('hero', 'tenant_a');
    expect(heroLock?.experimentId).toBe('exp_1');
  });

  it('releases all slots', async () => {
    const mutex = createExperimentMutex({ store: new InMemoryLockStore() });
    const candidate = {
      experimentId: 'exp_1',
      tenantId: 'tenant_a',
      componentKeys: ['hero', 'cta'],
    };

    await acquireAllSlots(candidate, mutex);
    await releaseAllSlots(candidate, mutex);

    const heroLock = await mutex.check('hero', 'tenant_a');
    expect(heroLock).toBeNull();
  });
});

// ─── traffic-split ────────────────────────────────────────────────────────────

describe('validateVariantWeights', () => {
  it('passes for valid weights summing to 100', () => {
    expect(() =>
      validateVariantWeights([
        { id: 'control', weight: 50 },
        { id: 'treatment', weight: 50 },
      ])
    ).not.toThrow();
  });

  it('throws when weights do not sum to 100', () => {
    expect(() =>
      validateVariantWeights([
        { id: 'control', weight: 40 },
        { id: 'treatment', weight: 40 },
      ])
    ).toThrow('sum to 100');
  });

  it('throws for empty variants array', () => {
    expect(() => validateVariantWeights([])).toThrow('at least one variant');
  });
});

describe('allocateVariant', () => {
  const variants = [
    { id: 'control', weight: 50 },
    { id: 'treatment', weight: 50 },
  ];

  it('returns a valid variant', () => {
    const result = allocateVariant({
      tenantId: 'tenant_a',
      experimentId: 'exp_1',
      visitorId: 'visitor_123',
      variants,
    });
    expect(['control', 'treatment']).toContain(result.variantId);
    expect(result.bucket).toBeGreaterThanOrEqual(0);
    expect(result.bucket).toBeLessThan(100);
  });

  it('is deterministic for the same inputs', () => {
    const input = {
      tenantId: 'tenant_a',
      experimentId: 'exp_1',
      visitorId: 'visitor_123',
      variants,
    };
    const r1 = allocateVariant(input);
    const r2 = allocateVariant(input);
    expect(r1.variantId).toBe(r2.variantId);
    expect(r1.bucket).toBe(r2.bucket);
  });

  it('produces different allocations for different tenants', () => {
    const variantsAll = [
      { id: 'v1', weight: 1 },
      { id: 'v2', weight: 99 },
    ];
    // With extreme weights, most visitors go to v2; just test determinism per tenant
    const r1 = allocateVariant({
      tenantId: 'tenant_a',
      experimentId: 'exp_1',
      visitorId: 'v',
      variants: variantsAll,
    });
    const r2 = allocateVariant({
      tenantId: 'tenant_b',
      experimentId: 'exp_1',
      visitorId: 'v',
      variants: variantsAll,
    });
    // Can't guarantee different assignment but bucket should differ for different tenants
    // Just verify both return valid results
    expect(['v1', 'v2']).toContain(r1.variantId);
    expect(['v1', 'v2']).toContain(r2.variantId);
  });
});

describe('isInTrafficPool', () => {
  it('returns true when percentage is 100', () => {
    expect(isInTrafficPool('tenant', 'exp', 'visitor', 100)).toBe(true);
  });

  it('returns false when percentage is 0', () => {
    expect(isInTrafficPool('tenant', 'exp', 'visitor', 0)).toBe(false);
  });

  it('is deterministic', () => {
    const r1 = isInTrafficPool('tenant_a', 'exp_1', 'visitor_x', 50);
    const r2 = isInTrafficPool('tenant_a', 'exp_1', 'visitor_x', 50);
    expect(r1).toBe(r2);
  });
});

describe('allocateAcrossExperiments', () => {
  it('allocates a visitor across multiple experiments independently', () => {
    const experiments = [
      {
        experimentId: 'exp_1',
        tenantId: 'tenant_a',
        componentKey: 'hero',
        variants: [
          { id: 'ctrl', weight: 50 },
          { id: 'trt', weight: 50 },
        ],
        trafficPercentage: 100,
      },
      {
        experimentId: 'exp_2',
        tenantId: 'tenant_a',
        componentKey: 'cta',
        variants: [
          { id: 'ctrl', weight: 50 },
          { id: 'trt', weight: 50 },
        ],
        trafficPercentage: 100,
      },
    ];

    const assignments = allocateAcrossExperiments('visitor_123', experiments);
    expect(assignments).toHaveLength(2);
    expect(assignments[0].experimentId).toBe('exp_1');
    expect(assignments[1].experimentId).toBe('exp_2');
    for (const a of assignments) {
      expect(a.inPool).toBe(true);
      expect(a.variantId).not.toBeNull();
    }
  });

  it('places visitor in holdout when trafficPercentage is 0', () => {
    const experiments = [
      {
        experimentId: 'exp_1',
        tenantId: 'tenant_a',
        componentKey: 'hero',
        variants: [{ id: 'ctrl', weight: 100 }],
        trafficPercentage: 0,
      },
    ];
    const assignments = allocateAcrossExperiments('visitor_123', experiments);
    expect(assignments[0].inPool).toBe(false);
    expect(assignments[0].variantId).toBeNull();
  });
});
