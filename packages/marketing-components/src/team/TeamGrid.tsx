// File: packages/marketing-components/src/team/TeamGrid.tsx
// Purpose: Team member photo + name + role cards
// Task: 2.3
// Status: Scaffolded - TODO: Implement

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: {
    src: string;
    alt: string;
  };
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface TeamGridProps {
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TeamGrid({ members, columns: _columns = 3, className }: TeamGridProps) {
  // TODO: Implement team grid layout
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
