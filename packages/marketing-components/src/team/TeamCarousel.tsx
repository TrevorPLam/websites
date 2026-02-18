// File: packages/marketing-components/src/team/TeamCarousel.tsx
// Purpose: Swipeable team member cards
// Task: 2.3
// Status: Scaffolded - TODO: Implement

import type { TeamMember } from './TeamGrid';

export interface TeamCarouselProps {
  members: TeamMember[];
  className?: string;
}

export function TeamCarousel({ members, className }: TeamCarouselProps) {
  // TODO: Implement swipeable carousel
  return (
    <div className={className}>
      {members.map((member) => (
        <div key={member.id}>
          {member.photo && <img src={member.photo.src} alt={member.photo.alt} />}
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      ))}
    </div>
  );
}
