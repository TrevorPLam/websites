/**
 * @file packages/infrastructure/experiments/guardrails.ts
 * @summary A/B experiment statistical guardrails — SRM detection, minimum
 *   sample size validation, and significance testing.
 * @description Provides the statistical machinery needed to safely conclude
 *   A/B experiments:
 *
 *   1. **Sample Ratio Mismatch (SRM) check** — detects instrumentation bugs
 *      where variants receive traffic far outside their configured weights.
 *   2. **Minimum sample size** — blocks premature conclusions that would
 *      otherwise inflate the false-positive rate.
 *   3. **Statistical significance** — two-proportion Z-test at a configurable
 *      alpha threshold (default 0.05). Returns the winner variant ID if one
 *      achieves significance.
 *
 *   All computation is pure TypeScript with no external dependencies, making
 *   the functions safe to call in Edge Runtime and easy to unit-test.
 *
 * @requirements TASK-AI-004-REV
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VariantStats {
  variantId: string;
  impressions: number;
  conversions: number;
}

export interface SRMResult {
  /** Whether a sample ratio mismatch was detected. */
  srmDetected: boolean;
  /** Chi-squared test statistic. */
  chiSquared: number;
  /** p-value for the chi-squared test (1 degree of freedom per variant pair). */
  pValue: number;
}

export interface SignificanceResult {
  /** Whether the experiment has reached statistical significance. */
  significant: boolean;
  /** Winning variant ID if significant, otherwise `null`. */
  winnerVariantId: string | null;
  /** Z-score of the best performing variant vs. control. */
  zScore: number;
  /** Two-tailed p-value for the best performing variant vs. control. */
  pValue: number;
  /** Relative lift of winner vs. control (e.g. 0.12 = 12% improvement). */
  relativeLift: number;
}

export interface GuardrailsCheckResult {
  /** Whether it is safe to conclude the experiment. */
  canConclude: boolean;
  /** Reason it cannot be concluded yet (if any). */
  blockReason?: string;
  srm: SRMResult;
  significance: SignificanceResult;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Standard normal CDF approximation (Abramowitz & Stegun 26.2.17).
 * Accurate to ±1.5 × 10⁻⁷ for |z| ≤ 6.
 */
function standardNormalCDF(z: number): number {
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const poly =
    t *
    (0.319381530 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * absZ * absZ) * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

/**
 * Two-tailed p-value from a Z-score.
 */
function twoTailedPValue(z: number): number {
  return 2 * (1 - standardNormalCDF(Math.abs(z)));
}

/**
 * Chi-squared CDF approximation for 1 degree of freedom.
 * Uses the regularised incomplete gamma function via the Wilson–Hilferty
 * cube-root transformation (accurate for chi2 > 0).
 */
function chi2PValue(chi2: number): number {
  if (chi2 <= 0) return 1;
  // P(X > chi2) for chi2 distribution with df=1
  // Use: P = 2 * P(Z > sqrt(chi2)) for df=1
  return twoTailedPValue(Math.sqrt(chi2));
}

// ─── SRM check ───────────────────────────────────────────────────────────────

/**
 * Detect a Sample Ratio Mismatch using a chi-squared goodness-of-fit test.
 *
 * A significant SRM (p < 0.01) suggests that the randomisation or event
 * collection has a bug and the experiment results should not be trusted.
 *
 * @param stats    Observed per-variant impression counts.
 * @param weights  Expected traffic allocation (must match `stats` variant IDs).
 *                 Weights are normalised internally so they do not need to sum
 *                 to any specific value.
 */
export function checkSRM(
  stats: VariantStats[],
  weights: Record<string, number>,
): SRMResult {
  const totalObserved = stats.reduce((s, v) => s + v.impressions, 0);
  const totalWeight = stats.reduce((s, v) => s + (weights[v.variantId] ?? 1), 0);

  if (totalObserved === 0 || totalWeight === 0) {
    return { srmDetected: false, chiSquared: 0, pValue: 1 };
  }

  let chiSquared = 0;

  for (const variant of stats) {
    const expectedFraction = (weights[variant.variantId] ?? 1) / totalWeight;
    const expected = totalObserved * expectedFraction;

    if (expected > 0) {
      const diff = variant.impressions - expected;
      chiSquared += (diff * diff) / expected;
    }
  }

  const pValue = chi2PValue(chiSquared);

  return {
    srmDetected: pValue < 0.01,
    chiSquared,
    pValue,
  };
}

// ─── Statistical significance ─────────────────────────────────────────────────

/**
 * Run a two-proportion Z-test comparing each treatment variant against the
 * control (the first variant in `stats`).
 *
 * @param stats              Per-variant impression + conversion counts.
 * @param alphaThreshold     Significance level (default 0.05).
 * @param minSampleSize      Minimum impressions required per variant before
 *                           the test will fire.
 */
export function checkSignificance(
  stats: VariantStats[],
  alphaThreshold = 0.05,
  minSampleSize = 100,
): SignificanceResult {
  const noResult: SignificanceResult = {
    significant: false,
    winnerVariantId: null,
    zScore: 0,
    pValue: 1,
    relativeLift: 0,
  };

  if (stats.length < 2) return noResult;

  const control = stats[0];
  if (!control || control.impressions < minSampleSize) return noResult;

  const controlRate =
    control.impressions > 0 ? control.conversions / control.impressions : 0;

  let bestZ = 0;
  let bestVariant: string | null = null;
  let bestPValue = 1;
  let bestLift = 0;

  for (const treatment of stats.slice(1)) {
    if (treatment.impressions < minSampleSize) continue;

    const treatmentRate =
      treatment.impressions > 0 ? treatment.conversions / treatment.impressions : 0;

    // Two-proportion Z-test
    const pooledRate =
      (control.conversions + treatment.conversions) /
      (control.impressions + treatment.impressions);

    const se = Math.sqrt(
      pooledRate * (1 - pooledRate) * (1 / control.impressions + 1 / treatment.impressions),
    );

    if (se === 0) continue;

    const z = (treatmentRate - controlRate) / se;
    const p = twoTailedPValue(z);
    const lift = controlRate > 0 ? (treatmentRate - controlRate) / controlRate : 0;

    if (p < bestPValue && Math.abs(z) > Math.abs(bestZ)) {
      bestZ = z;
      bestPValue = p;
      bestLift = lift;
      bestVariant = treatment.variantId;
    }
  }

  const significant = bestPValue < alphaThreshold && bestVariant !== null;
  // Only declare winner if the treatment is better than control
  const winner = significant && bestLift > 0 ? bestVariant : null;

  return {
    significant,
    winnerVariantId: winner,
    zScore: bestZ,
    pValue: bestPValue,
    relativeLift: bestLift,
  };
}

// ─── Combined guardrails check ────────────────────────────────────────────────

/**
 * Run all guardrails and return a combined conclusion decision.
 *
 * @param stats              Per-variant impression + conversion counts.
 * @param weights            Configured traffic weights (e.g. `{ control: 50, variant_b: 50 }`).
 * @param alphaThreshold     Significance threshold (default 0.05).
 * @param minSampleSize      Minimum impressions per variant (default 100).
 */
export function runGuardrails(
  stats: VariantStats[],
  weights: Record<string, number>,
  alphaThreshold = 0.05,
  minSampleSize = 100,
): GuardrailsCheckResult {
  const srm = checkSRM(stats, weights);
  const significance = checkSignificance(stats, alphaThreshold, minSampleSize);

  const totalImpressions = stats.reduce((s, v) => s + v.impressions, 0);
  const minRequired = stats.length * minSampleSize;

  let canConclude = false;
  let blockReason: string | undefined;

  if (srm.srmDetected) {
    blockReason = `Sample ratio mismatch detected (chi-sq=${srm.chiSquared.toFixed(2)}, p=${srm.pValue.toFixed(4)}). Fix instrumentation before concluding.`;
  } else if (totalImpressions < minRequired) {
    blockReason = `Insufficient sample size: ${totalImpressions} impressions collected, ${minRequired} required (${minSampleSize} per variant).`;
  } else if (!significance.significant) {
    blockReason = `No significant winner yet (best p=${significance.pValue.toFixed(4)}, threshold=${alphaThreshold}).`;
  } else {
    canConclude = true;
  }

  return { canConclude, blockReason, srm, significance };
}
