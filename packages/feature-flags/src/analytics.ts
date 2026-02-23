import type { FeatureFlagEvaluation } from './types';

export type FeatureFlagEvent = {
  flagName: string;
  tenantId: string;
  result: FeatureFlagEvaluation;
  timestamp: string;
};

export function createFeatureFlagEvent(flagName: string, tenantId: string, result: FeatureFlagEvaluation): FeatureFlagEvent {
  return {
    flagName,
    tenantId,
    result,
    timestamp: new Date().toISOString()
  };
}
