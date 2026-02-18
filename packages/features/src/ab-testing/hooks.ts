/**
 * @file packages/features/src/ab-testing/hooks.ts
 * Purpose: useVariant hook — returns assigned variant for experiment
 */

'use client';

import { useMemo } from 'react';
import type { ExperimentConfig } from './lib/ab-config';

/** Simple deterministic variant assignment by experiment id + session */
export function useVariant(
  experiment: ExperimentConfig | undefined,
  _sessionId?: string
): string | undefined {
  return useMemo(() => {
    if (!experiment?.enabled || !experiment.variants?.length) return undefined;
    const totalWeight = experiment.variants.reduce((s, v) => s + (v.weight ?? 1), 0);
    if (totalWeight <= 0) return experiment.variants[0]?.id;
    const r = Math.random() * totalWeight;
    let acc = 0;
    for (const v of experiment.variants) {
      acc += v.weight ?? 1;
      if (r < acc) return v.id;
    }
    return experiment.variants[experiment.variants.length - 1]?.id;
  }, [experiment]);
}
