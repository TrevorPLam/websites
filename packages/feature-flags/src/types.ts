import { z } from 'zod';

export const tierSchema = z.enum(['starter', 'professional', 'enterprise']);

export const featureFlagRuleSchema = z.object({
  enabled: z.boolean(),
  rollout: z.number().int().min(0).max(100).optional(),
  tenantIds: z.array(z.string()).optional(),
  tiers: z.array(tierSchema).optional(),
  envOverride: z.string().optional()
});

export const featureFlagsSchema = z.record(featureFlagRuleSchema);

export type TenantTier = z.infer<typeof tierSchema>;
export type FeatureFlagRule = z.infer<typeof featureFlagRuleSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

export type FeatureFlagContext = {
  tenantId: string;
  tier: TenantTier;
  env?: Record<string, string | undefined>;
};

export type FeatureFlagEvaluation = {
  enabled: boolean;
  reason: 'disabled' | 'enabled' | 'tenant-filtered' | 'tier-filtered' | 'rollout-filtered' | 'env-override';
};
