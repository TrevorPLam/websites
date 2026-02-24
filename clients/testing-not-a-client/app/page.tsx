import { getABVariant } from '@repo/infra/experiments';
import { HomePageTemplate } from '@repo/page-templates';
import type { SiteConfig } from '@repo/types';
import siteConfig from '../site.config';

function withHeroVariant(config: SiteConfig, variantId: string | null): SiteConfig {
  if (variantId !== 'variant-b') {
    return config;
  }

  return {
    ...config,
    features: {
      ...config.features,
      hero: 'centered',
    },
  };
}

export default async function HomePage() {
  const heroVariant = await getABVariant('hero-layout-test-v1');
  const config = withHeroVariant(siteConfig, heroVariant);

  return <HomePageTemplate config={config} />;
}
