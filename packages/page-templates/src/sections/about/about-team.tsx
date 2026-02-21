/**
 * @file packages/page-templates/src/sections/about/about-team.tsx
 * Purpose: About team section adapter and registration.
 */
import { TeamSection } from '@repo/features/client';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function AboutTeamAdapter(_props: SectionProps) {
  return <TeamSection title="Our Team" members={[]} layout="grid" />;
}

registerSection('about-team', AboutTeamAdapter);
