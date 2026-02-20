/**
 * @file packages/page-templates/src/sections/home/hero-carousel.tsx
 * Purpose: Hero carousel section adapter and registration.
 */
import { HeroCarousel } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function HeroCarouselAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroCarousel
      slides={[
        {
          title: config.name,
          subtitle: config.tagline,
          description: config.description,
        },
      ]}
    />
  );
}

registerSection('hero-carousel', HeroCarouselAdapter);
