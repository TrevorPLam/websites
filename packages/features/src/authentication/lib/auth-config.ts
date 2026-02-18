/**
 * @file packages/features/src/authentication/lib/auth-config.ts
 * Purpose: Authentication feature configuration stub
 */

export type AuthProvider = 'oauth' | 'sso' | 'supabase' | 'custom' | 'none';

export interface AuthFeatureConfig {
  provider?: AuthProvider;
  enabled?: boolean;
}

export function createAuthConfig(overrides: Partial<AuthFeatureConfig> = {}): AuthFeatureConfig {
  return { provider: 'none', enabled: false, ...overrides };
}
