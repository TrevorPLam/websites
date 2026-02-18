/**
 * @file packages/features/src/ab-testing/lib/ab-config.ts
 * Purpose: A/B testing feature configuration
 */

export interface ExperimentVariant {
  id: string;
  name: string;
  weight?: number;
}

export interface ExperimentConfig {
  id: string;
  name: string;
  variants: ExperimentVariant[];
  /** Whether experiment is active */
  enabled?: boolean;
}

export interface ABTestingFeatureConfig {
  experiments?: ExperimentConfig[];
}

export function createABTestingConfig(
  overrides: Partial<ABTestingFeatureConfig> = {}
): ABTestingFeatureConfig {
  return {
    ...overrides,
  };
}
