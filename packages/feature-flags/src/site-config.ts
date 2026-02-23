import { featureFlagsSchema } from './types';

export function readSiteConfigFeatureFlags(siteConfig: unknown) {
  const candidate =
    typeof siteConfig === 'object' && siteConfig !== null && 'featureFlags' in siteConfig
      ? (siteConfig as { featureFlags?: unknown }).featureFlags
      : {};

  return featureFlagsSchema.parse(candidate ?? {});
}
