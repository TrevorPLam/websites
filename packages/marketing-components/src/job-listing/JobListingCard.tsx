'use client';

/**
 * @file packages/marketing-components/src/job-listing/JobListingCard.tsx
 * @role component
 * @summary Single job listing card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { JobListing } from './types';

export interface JobListingCardProps {
  job: JobListing;
  href?: string;
  className?: string;
}

export function JobListingCard({ job, href, className }: JobListingCardProps) {
  const link = href ?? job.href ?? `/careers/${job.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block p-4">
        <h3 className="font-semibold text-foreground">{job.title}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
          {job.department && <span>{job.department}</span>}
          {job.location && <span>• {job.location}</span>}
          {job.type && <span>• {job.type}</span>}
        </div>
        {job.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
        )}
      </a>
    </Card>
  );
}
