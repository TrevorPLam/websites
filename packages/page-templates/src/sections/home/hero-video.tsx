/**
 * @file packages/page-templates/src/sections/home/hero-video.tsx
 * Purpose: Hero video section adapter and registration.
 */
import { HeroVideo } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function HeroVideoAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroVideo title={config.name} subtitle={config.tagline} description={config.description} />
  );
}

registerSection('hero-video', HeroVideoAdapter);
