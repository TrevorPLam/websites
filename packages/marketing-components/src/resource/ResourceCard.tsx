/**
 * @file packages/marketing-components/src/resource/ResourceCard.tsx
 * @role component
 * @summary Single resource card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Resource } from './types';

export interface ResourceCardProps {
  resource: Resource;
  href?: string;
  onDownload?: (resource: Resource) => void;
  className?: string;
}

export function ResourceCard({ resource, href, onDownload, className }: ResourceCardProps) {
  const link = href ?? resource.href ?? resource.fileUrl ?? `/resources/${resource.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block" download={!!resource.fileUrl}>
        {resource.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={resource.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{resource.title}</h3>
          {resource.type && (
            <p className="mt-1 text-xs text-muted-foreground">{resource.type}</p>
          )}
          {resource.downloadCount != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {resource.downloadCount} downloads
            </p>
          )}
          {resource.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {resource.description}
            </p>
          )}
        </div>
      </a>
      {onDownload && (
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onDownload(resource);
            }}
            className="min-h-[44px] w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Download
          </button>
        </div>
      )}
    </Card>
  );
}
