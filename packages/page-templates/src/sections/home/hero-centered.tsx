/**
 * @file packages/page-templates/src/sections/home/hero-centered.tsx
 * Purpose: Hero centered section adapter and registration.
 */
import { HeroCentered } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function HeroCenteredAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroCentered
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

registerSection('hero-centered', HeroCenteredAdapter);
