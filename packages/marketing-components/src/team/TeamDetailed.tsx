// File: packages/marketing-components/src/team/TeamDetailed.tsx
// Purpose: Full bio + credentials + social links
// Task: 2.3
// Status: Scaffolded - TODO: Implement

import type { TeamMember } from './TeamGrid';

export interface TeamDetailedProps {
  member: TeamMember;
  className?: string;
}

export function TeamDetailed({ member, className }: TeamDetailedProps) {
  // TODO: Implement detailed team member view
  return (
    <div className={className}>
      {member.photo && <img src={member.photo.src} alt={member.photo.alt} />}
      <h2>{member.name}</h2>
      <p>{member.role}</p>
      {member.bio && <p>{member.bio}</p>}
      {member.social && (
        <div>
          {member.social.linkedin && <a href={member.social.linkedin}>LinkedIn</a>}
          {member.social.twitter && <a href={member.social.twitter}>Twitter</a>}
          {member.social.email && <a href={`mailto:${member.social.email}`}>Email</a>}
        </div>
      )}
    </div>
  );
}
