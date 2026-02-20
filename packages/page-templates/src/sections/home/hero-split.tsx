/**
 * @file packages/page-templates/src/sections/home/hero-split.tsx
 * Purpose: Hero split section adapter and registration.
 */
import { HeroSplit } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function HeroSplitAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroSplit
      title={config.name}
      subtitle={config.tagline}
      description={config.description}
      cta={
        config.navLinks?.[0]
          ? { label: config.navLinks[0].label, href: config.navLinks[0].href }
          : undefined
      }
    />
  );
}

registerSection('hero-split', HeroSplitAdapter);
