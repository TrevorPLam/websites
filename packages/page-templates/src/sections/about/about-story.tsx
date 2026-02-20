/**
 * @file packages/page-templates/src/sections/about/about-story.tsx
 * Purpose: About story section adapter and registration.
 */
import { HeroCentered } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function StoryAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <HeroCentered
      title={`About ${config.name}`}
      subtitle={config.tagline ?? config.description ?? undefined}
    />
  );
}

registerSection('about-story', StoryAdapter);
