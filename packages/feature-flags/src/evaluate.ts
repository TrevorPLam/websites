import type { FeatureFlagContext, FeatureFlagEvaluation, FeatureFlagRule } from './types';
import { deterministicHash } from './utils/hash';

export function evaluateFeatureFlag(flagName: string, rule: FeatureFlagRule, context: FeatureFlagContext): FeatureFlagEvaluation {
  if (rule.envOverride && context.env?.[rule.envOverride] != null) {
    return {
      enabled: context.env[rule.envOverride] === 'true',
      reason: 'env-override'
    };
  }

  if (!rule.enabled) {
    return { enabled: false, reason: 'disabled' };
  }

  if (rule.tenantIds?.length && !rule.tenantIds.includes(context.tenantId)) {
    return { enabled: false, reason: 'tenant-filtered' };
  }

  if (rule.tiers?.length && !rule.tiers.includes(context.tier)) {
    return { enabled: false, reason: 'tier-filtered' };
  }

  if (typeof rule.rollout === 'number') {
    const bucket = deterministicHash(`${context.tenantId}:${flagName}`) % 100;
    if (bucket >= rule.rollout) {
      return { enabled: false, reason: 'rollout-filtered' };
    }
  }

  return { enabled: true, reason: 'enabled' };
}
