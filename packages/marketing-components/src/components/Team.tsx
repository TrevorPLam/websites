// Team components - placeholder implementations
import React from 'react';
import type { TeamMember } from '../types';

interface TeamGridProps {
  members: TeamMember[];
  columns?: 2 | 3 | 4;
}

export const TeamGrid: React.FC<TeamGridProps> = ({ members, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {members.map((member) => (
        <div key={member.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      ))}
    </div>
  );
};

interface TeamCarouselProps {
  members: TeamMember[];
}

export const TeamCarousel: React.FC<TeamCarouselProps> = ({ members }) => {
  return (
    <div className="flex overflow-x-auto space-x-4">
      {members.map((member) => (
        <div key={member.id} className="flex-shrink-0 w-64 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      ))}
    </div>
  );
};

interface TeamDetailedProps {
  members: TeamMember[];
}

export const TeamDetailed: React.FC<TeamDetailedProps> = ({ members }) => {
  return (
    <div className="space-y-8">
      {members.map((member) => (
        <div key={member.id} className="bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold">{member.name}</h3>
          <p className="text-gray-600 mb-2">{member.role}</p>
          {member.bio && <p className="text-gray-700 mb-4">{member.bio}</p>}
          {member.credentials && (
            <div className="flex flex-wrap gap-2 mb-4">
              {member.credentials.map((cred, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {cred}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
