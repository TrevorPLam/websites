/**
 * @file packages/marketing-components/src/team/TeamGrid.tsx
 * @role component
 * @summary Team member grid layout (2/3/4 columns)
 *
 * Responsive grid of team member cards with Avatar, name, role, bio, social links.
 */

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { Card } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { TeamMember } from './types';

export interface TeamGridProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Team members */
  members: TeamMember[];
  /** Grid columns */
  columns?: 2 | 3 | 4;
  /** Custom CSS class name */
  className?: string;
}

function getImageSrc(member: TeamMember): string | undefined {
  return member.avatar ?? member.photo?.src;
}

function getImageAlt(member: TeamMember): string {
  return member.photo?.alt ?? member.name;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Team grid component with responsive columns.
 *
 * @param props - TeamGridProps
 * @returns Team grid component
 */
export function TeamGrid({
  title,
  description,
  members,
  columns = 3,
  className,
}: TeamGridProps) {
  const gridClasses = cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className={gridClasses}>
          {members.map((member) => (
            <Card key={member.id} variant="service">
              <div className="flex flex-col items-center text-center">
                <Avatar size="lg" shape="circle" className="mb-4">
                  {getImageSrc(member) && (
                    <AvatarImage src={getImageSrc(member)} alt={getImageAlt(member)} />
                  )}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                {member.department && (
                  <p className="mt-1 text-xs text-muted-foreground">{member.department}</p>
                )}
                {member.bio && <p className="mt-3 text-sm">{member.bio}</p>}
                {member.socialLinks && (
                  <div className="mt-4 flex gap-4">
                    {member.socialLinks.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`${member.name} on Twitter`}
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
