import { get } from '@vercel/edge-config';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// ============================================================================
// FEATURE FLAG SYSTEM
// Reads from Vercel Edge Config (instant, globally distributed, ~0ms).
// Falls back to Redis for tenant-specific overrides.
// Falls back to hardcoded defaults if both unavailable.
// Reference: https://docs.getunleash.io/guides/implement-feature-flags-in-nextjs
// ============================================================================

// Define feature flags as const tuple for type safety
const FEATURE_FLAGS = [
  'offline_lead_forms',
  'realtime_lead_feed',
  'ab_testing',
  'ai_chat_widget',
  'booking_calendar',
  'stripe_billing',
  'white_label_portal',
  'gdpr_tools',
  'api_access',
  'sso_enabled',
  'advanced_analytics',
  'multi_site',
  'custom_domain',
  'ghl_crm_sync',
  'hubspot_crm_sync',
] as const;

export type FeatureFlag = typeof FEATURE_FLAGS[number];

export function isValidFeatureFlag(flag: string): flag is FeatureFlag {
  return (FEATURE_FLAGS as readonly string[]).includes(flag);
}

// Tier-based defaults (what each plan includes out of the box)
const TIER_DEFAULTS: Record<string, Record<FeatureFlag, boolean>> = {
  starter: {
    offline_lead_forms: false,
    realtime_lead_feed: false,
    ab_testing: false,
    ai_chat_widget: false,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: false,
    gdpr_tools: false,
    api_access: false,
    sso_enabled: false,
    advanced_analytics: false,
    multi_site: false,
    custom_domain: true,
    ghl_crm_sync: false,
    hubspot_crm_sync: false,
  },
  professional: {
    offline_lead_forms: true,
    realtime_lead_feed: true,
    ab_testing: true,
    ai_chat_widget: true,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: false,
    gdpr_tools: true,
    api_access: false,
    sso_enabled: false,
    advanced_analytics: true,
    multi_site: true,
    custom_domain: true,
    ghl_crm_sync: true,
    hubspot_crm_sync: true,
  },
  enterprise: {
    offline_lead_forms: true,
    realtime_lead_feed: true,
    ab_testing: true,
    ai_chat_widget: true,
    booking_calendar: true,
    stripe_billing: true,
    white_label_portal: true,
    gdpr_tools: true,
    api_access: true,
    sso_enabled: true,
    advanced_analytics: true,
    multi_site: true,
    custom_domain: true,
    ghl_crm_sync: true,
    hubspot_crm_sync: true,
  },
};

// Global feature flag overrides (kill switches, beta features, gradual rollout)
// Stored in Vercel Edge Config — instant propagation without redeployment
type EdgeConfigFlags = {
  [K in FeatureFlag]?: boolean | { enabledTenants: string[]; enabledPercentage?: number };
};

export async function isFeatureEnabled(
  flag: FeatureFlag,
  context: {
    tenantId: string;
    billingTier: 'starter' | 'professional' | 'enterprise';
  }
): Promise<boolean> {
  // ── 1. Global kill switch (Edge Config — ~0ms read) ───────────────────────
  try {
    const globalFlags = await get<EdgeConfigFlags>('featureFlags');
    if (globalFlags?.[flag] !== undefined) {
      const flagConfig = globalFlags[flag];

      if (typeof flagConfig === 'boolean') {
        return flagConfig; // Global override (both kill switch and enable)
      } else if (typeof flagConfig === 'object') {
        // Tenant allowlist
        if (flagConfig.enabledTenants?.includes(context.tenantId)) return true;

        // Percentage rollout (deterministic by tenantId hash)
        if (flagConfig.enabledPercentage !== undefined) {
          const hash = hashTenantId(context.tenantId);
          return hash < flagConfig.enabledPercentage;
        }
      }
    }
  } catch {
    // Edge Config unavailable — fall through
  }

  // ── 2. Tenant-specific override (Redis) ───────────────────────────────────
  const tenantOverrideKey = `feature:${context.tenantId}:${flag}`;
  const tenantOverride = await redis.get<boolean>(tenantOverrideKey);
  if (tenantOverride !== null) return tenantOverride;

  // ── 3. Billing tier default ───────────────────────────────────────────────
  return TIER_DEFAULTS[context.billingTier]?.[flag] ?? false;
}

// ── Server Component gate ────────────────────────────────────────────────────

export async function FeatureGate({
  flag,
  tenantId,
  billingTier,
  children,
  fallback = null,
}: {
  flag: FeatureFlag;
  tenantId: string;
  billingTier: 'starter' | 'professional' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}): Promise<React.ReactNode> {
  const enabled = await isFeatureEnabled(flag, { tenantId, billingTier });
  return enabled ? children : fallback;
}

// ── Client hook (reads from cookie set during SSR) ──────────────────────────
// Feature flags are injected into a cookie in middleware to avoid client waterfalls

export function useFeatureFlag(flag: FeatureFlag): boolean {
  if (typeof document === 'undefined') return false;

  const cookieKey = `ff_${flag}`;

  // Use URLSearchParams for robust cookie parsing
  const cookieString = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(`${cookieKey}=`));

  if (!cookieString) return false;

  // Extract value after the first '='
  const value = cookieString.substring(cookieKey.length + 1);
  return value === 'true';
}

// Deterministic hash for percentage rollouts (djb2)
function hashTenantId(tenantId: string): number {
  let hash = 5381;
  for (const char of tenantId) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }
  return Math.abs(hash) % 100;
}

// ── Admin API: override feature for specific tenant ───────────────────────────

export async function setTenantFeatureOverride(
  tenantId: string,
  flag: FeatureFlag,
  enabled: boolean
): Promise<void> {
  const key = `feature:${tenantId}:${flag}`;
  // Set with 90-day TTL to prevent indefinite overrides
  await redis.set(key, enabled, { ex: 90 * 24 * 60 * 60 }); // 90 days in seconds
}

export async function clearTenantFeatureOverride(
  tenantId: string,
  flag: FeatureFlag
): Promise<void> {
  await redis.del(`feature:${tenantId}:${flag}`);
}

// ── Feature flag analytics and tracking ─────────────────────────────────────

export async function getFeatureFlagUsageStats(_flag: FeatureFlag): Promise<{
  totalTenants: number;
  enabledTenants: number;
  enabledByTier: Record<string, number>;
  rolloutPercentage: number;
}> {
  // This would typically query your analytics database
  // For now, return a placeholder implementation
  return {
    totalTenants: 0,
    enabledTenants: 0,
    enabledByTier: { starter: 0, professional: 0, enterprise: 0 },
    rolloutPercentage: 0,
  };
}


// ── Feature flag middleware helper ───────────────────────────────────────────

export async function injectFeatureFlagsIntoCookie(
  context: {
    tenantId: string;
    billingTier: 'starter' | 'professional' | 'enterprise';
  },
  response: Response
): Promise<void> {
  const flags: FeatureFlag[] = [
    'offline_lead_forms',
    'realtime_lead_feed',
    'ab_testing',
    'ai_chat_widget',
    'booking_calendar',
    'stripe_billing',
    'white_label_portal',
    'gdpr_tools',
    'api_access',
    'sso_enabled',
    'advanced_analytics',
    'multi_site',
    'custom_domain',
    'ghl_crm_sync',
    'hubspot_crm_sync',
  ];

  // Check all flags in parallel for performance
  const flagPromises = flags.map(async (flag) => ({
    flag,
    enabled: await isFeatureEnabled(flag, context),
  }));

  const flagResults = await Promise.all(flagPromises);

  // Set each flag as a separate cookie (HTTP allows multiple Set-Cookie headers)
  for (const { flag, enabled } of flagResults) {
    const cookieValue = `ff_${flag}=${enabled ? 'true' : 'false'}; Path=/; HttpOnly; Secure; SameSite=Lax`;
    response.headers.append('Set-Cookie', cookieValue);
  }
}
