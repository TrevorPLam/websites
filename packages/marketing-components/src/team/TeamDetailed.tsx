/**
 * @file packages/marketing-components/src/team/TeamDetailed.tsx
 * @role component
 * @summary Full bio team member card with credentials and social links
 */

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { TeamMember } from './types';

export interface TeamDetailedProps {
  /** Single team member */
  member: TeamMember;
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
 * Detailed team member card with full bio and social links.
 *
 * @param props - TeamDetailedProps
 * @returns Team detailed component
 */
export function TeamDetailed({ member, className }: TeamDetailedProps) {
  const social = member.socialLinks ?? member.social;

  return (
    <Card variant="testimonial" className={cn('', className)}>
      <div className="flex flex-col sm:flex-row sm:gap-6">
        <Avatar size="xl" shape="circle" className="shrink-0">
          {getImageSrc(member) && (
            <AvatarImage src={getImageSrc(member)} alt={getImageAlt(member)} />
          )}
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
        <div className="mt-4 flex-1 sm:mt-0">
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <p className="text-muted-foreground">{member.role}</p>
          {member.department && (
            <p className="mt-1 text-sm text-muted-foreground">{member.department}</p>
          )}
          {member.bio && <p className="mt-4 text-sm leading-relaxed">{member.bio}</p>}
          {social && (
            <div className="mt-4 flex gap-4">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  LinkedIn
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                  aria-label={`${member.name} on Twitter`}
                >
                  Twitter
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="text-sm text-primary hover:underline"
                  aria-label={`Email ${member.name}`}
                >
                  Email
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
