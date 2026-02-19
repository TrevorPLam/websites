/**
 * @file packages/features/src/team/components/TeamSection.tsx
 * Purpose: Team section that uses marketing-components display variants
 */

import { Container, Section } from '@repo/ui';
import { TeamGrid, TeamCarousel, TeamDetailed } from '@repo/marketing-components';
import type { TeamMember } from '@repo/marketing-components';
import type { TeamFeatureConfig } from '../lib/team-config';

export interface TeamSectionProps extends TeamFeatureConfig {
  /** Pre-loaded members (overrides config.members when provided) */
  members?: TeamMember[];
}

export function TeamSection({
  title,
  description,
  layout = 'grid',
  members = [],
  ...rest
}: TeamSectionProps) {
  if (members.length === 0) return null;

  const common = { title, description, members, ...rest };

  switch (layout) {
    case 'carousel':
      return <TeamCarousel {...common} />;
    case 'detailed':
      return (
        <Section>
          <Container>
            {title && <h2 className="mb-6 text-3xl font-bold">{title}</h2>}
            {description && <p className="mb-8 text-muted-foreground">{description}</p>}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <TeamDetailed key={member.id} members={[member]} />
              ))}
            </div>
          </Container>
        </Section>
      );
    default:
      return <TeamGrid {...common} />;
  }
}
