/**
 * @file packages/features/src/content-management/lib/cms-config.ts
 * Purpose: Content management feature configuration stub
 */

export type CMSProvider = 'sanity' | 'contentful' | 'mdx' | 'custom' | 'none';

export interface ContentManagementFeatureConfig {
  provider?: CMSProvider;
  enabled?: boolean;
}

export function createCMSConfig(overrides: Partial<ContentManagementFeatureConfig> = {}): ContentManagementFeatureConfig {
  return { provider: 'none', enabled: false, ...overrides };
}
