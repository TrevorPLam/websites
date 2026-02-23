import { useMemo } from 'react';
import { evaluateFeatureFlag } from '../evaluate';
import type { FeatureFlagContext, FeatureFlagRule } from '../types';

export function useFeatureFlag(flagName: string, rule: FeatureFlagRule, context: FeatureFlagContext): boolean {
  return useMemo(() => evaluateFeatureFlag(flagName, rule, context).enabled, [flagName, rule, context]);
}
