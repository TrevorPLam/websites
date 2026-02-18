/**
 * @file packages/marketing-components/src/case-study/CaseStudyCard.tsx
 * @role component
 * @summary Single case study card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { CaseStudy } from './types';

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  href?: string;
  className?: string;
}

export function CaseStudyCard({ caseStudy, href, className }: CaseStudyCardProps) {
  const link = href ?? caseStudy.href ?? `/case-studies/${caseStudy.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block">
        {caseStudy.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={caseStudy.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{caseStudy.title}</h3>
          {caseStudy.client && (
            <p className="mt-1 text-sm text-muted-foreground">{caseStudy.client}</p>
          )}
          {caseStudy.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {caseStudy.summary}
            </p>
          )}
        </div>
      </a>
    </Card>
  );
}
