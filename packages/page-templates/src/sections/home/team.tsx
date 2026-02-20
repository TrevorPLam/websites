/**
 * @file packages/page-templates/src/sections/home/team.tsx
 * Purpose: Team section adapter and registration.
 */
import { TeamSection } from '@repo/features';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function TeamAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return (
    <TeamSection
      title="Our Team"
      description={config.description}
      layout={config.features.team ?? 'grid'}
      members={[]}
    />
  );
}

registerSection('team', TeamAdapter);
