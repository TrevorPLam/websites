/**
 * @file packages/infrastructure/experiments/traffic-split.ts
 * @summary Deterministic traffic allocation for A/B experiments.
 * @description Assigns visitors to experiment variants using a deterministic
 *   hash of `(tenantId, experimentId, visitorId)` so the same visitor always
 *   sees the same variant across sessions without requiring persistent state.
 *
 *   Key properties:
 *   - **Deterministic**: same inputs always produce the same variant.
 *   - **Uniform**: allocation respects configured variant weights.
 *   - **Tenant-isolated**: tenants share no hash space.
 *   - **Mutual exclusion**: integrates with {@link ExperimentMutex} to ensure
 *     a visitor participates in at most one experiment per component slot.
 *
 *   Traffic weights must sum to exactly 100. Partial weights (e.g. 33/33/34)
 *   are accepted.
 *
 * @security Hash key includes tenantId to ensure allocation is tenant-isolated; visitorId should be an opaque session or user ID (never PII directly).
 * @adr none
 * @requirements TASK-AI-004-REV
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single variant in a traffic-split definition. */
export interface TrafficVariant {
  /** Unique variant identifier within the experiment. */
  id: string;
  /**
   * Percentage of traffic allocated to this variant (0–100).
   * All variants in an experiment must sum to exactly 100.
   */
  weight: number;
}

/** Input to {@link allocateVariant}. */
export interface TrafficSplitInput {
  /** Tenant that owns the experiment (scopes the hash). */
  tenantId: string;
  /** Experiment identifier. */
  experimentId: string;
  /**
   * Stable visitor identifier (e.g. anonymous session ID or authenticated
   * user ID). Must be stable across requests for the same visitor.
   */
  visitorId: string;
  /** Variant definitions with their traffic weights. */
  variants: TrafficVariant[];
}

/** Result of {@link allocateVariant}. */
export interface TrafficAllocation {
  /** The assigned variant ID. */
  variantId: string;
  /** Hash bucket (0–99) used for this allocation. */
  bucket: number;
}

// ─── Hash utility ────────────────────────────────────────────────────────────

/**
 * djb2 hash of an arbitrary string, mapped into [0, 100).
 * Matches the algorithm used by `packages/feature-flags` for consistency.
 */
function hashToBucket(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return Math.abs(hash) % 100;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/** @throws When variant weights do not sum to 100 or when there are no variants. */
export function validateVariantWeights(variants: TrafficVariant[]): void {
  if (variants.length === 0) {
    throw new Error('traffic-split: at least one variant is required.');
  }

  const total = variants.reduce((sum, v) => sum + v.weight, 0);
  if (total !== 100) {
    throw new Error(`traffic-split: variant weights must sum to 100, got ${total}.`);
  }

  for (const v of variants) {
    if (v.weight < 0 || v.weight > 100) {
      throw new Error(
        `traffic-split: variant "${v.id}" has invalid weight ${v.weight} (must be 0–100).`
      );
    }
  }
}

// ─── Core allocation ──────────────────────────────────────────────────────────

/**
 * Deterministically allocate a visitor to an experiment variant.
 *
 * The hash key is `{tenantId}:{experimentId}:{visitorId}` to ensure:
 *   1. Different tenants with the same experiment ID produce independent
 *      allocations.
 *   2. The same visitor is consistently assigned to the same variant.
 *   3. Different experiments for the same visitor produce independent
 *      allocations (bucket re-use across experiments is fine, but not within).
 *
 * @throws {Error} When `variants` fails {@link validateVariantWeights}.
 */
export function allocateVariant(input: TrafficSplitInput): TrafficAllocation {
  validateVariantWeights(input.variants);

  const hashKey = `${input.tenantId}:${input.experimentId}:${input.visitorId}`;
  const bucket = hashToBucket(hashKey);

  let cumulative = 0;
  for (const variant of input.variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return { variantId: variant.id, bucket };
    }
  }

  // Fallback (should not be reached if weights sum to 100)
  const last = input.variants[input.variants.length - 1];
  return { variantId: last.id, bucket };
}

/**
 * Check whether a visitor is in the traffic pool for an experiment.
 *
 * Useful when an experiment only exposes a portion of visitors (holdout).
 * For example, a `trafficPercentage` of 80 means 20% of visitors are held
 * out and never assigned to any variant.
 *
 * @param tenantId           Tenant identifier.
 * @param experimentId       Experiment identifier.
 * @param visitorId          Stable visitor identifier.
 * @param trafficPercentage  Percentage of all visitors to include (0–100).
 */
export function isInTrafficPool(
  tenantId: string,
  experimentId: string,
  visitorId: string,
  trafficPercentage: number
): boolean {
  if (trafficPercentage <= 0) return false;
  if (trafficPercentage >= 100) return true;

  // Use a separate hash namespace (`pool:`) so the pool decision is
  // independent of the variant assignment decision.
  const hashKey = `pool:${tenantId}:${experimentId}:${visitorId}`;
  const bucket = hashToBucket(hashKey);
  return bucket < trafficPercentage;
}

// ─── Multi-experiment helper ──────────────────────────────────────────────────

/** A running experiment with its variants. */
export interface ActiveExperiment {
  experimentId: string;
  tenantId: string;
  /** Component slot this experiment targets (must be unique across active experiments). */
  componentKey: string;
  variants: TrafficVariant[];
  /** Percentage of visitors to include in the experiment (default 100). */
  trafficPercentage?: number;
}

/** Assignment for a single active experiment. */
export interface ExperimentAssignment {
  experimentId: string;
  componentKey: string;
  /** `null` when the visitor is in the holdout group. */
  variantId: string | null;
  bucket: number;
  inPool: boolean;
}

/**
 * Allocate a visitor across multiple concurrent experiments.
 *
 * Each experiment is resolved independently. The mutual-exclusion guarantee
 * (one experiment per component slot) is enforced at activation time via
 * {@link ExperimentMutex} — this function assumes the caller has already
 * validated that the active experiments do not target overlapping slots.
 */
export function allocateAcrossExperiments(
  visitorId: string,
  experiments: ActiveExperiment[]
): ExperimentAssignment[] {
  return experiments.map((exp) => {
    const trafficPct = exp.trafficPercentage ?? 100;
    const inPool = isInTrafficPool(exp.tenantId, exp.experimentId, visitorId, trafficPct);

    if (!inPool) {
      const bucket = hashToBucket(`pool:${exp.tenantId}:${exp.experimentId}:${visitorId}`);
      return {
        experimentId: exp.experimentId,
        componentKey: exp.componentKey,
        variantId: null,
        bucket,
        inPool: false,
      };
    }

    const allocation = allocateVariant({
      tenantId: exp.tenantId,
      experimentId: exp.experimentId,
      visitorId,
      variants: exp.variants,
    });

    return {
      experimentId: exp.experimentId,
      componentKey: exp.componentKey,
      variantId: allocation.variantId,
      bucket: allocation.bucket,
      inPool: true,
    };
  });
}
