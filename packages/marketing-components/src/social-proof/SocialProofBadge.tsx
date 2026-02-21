/**
 * @file packages/marketing-components/src/social-proof/SocialProofBadge.tsx
 * @role component
 * @summary Trust badge / social proof indicator
 */

import { cn } from '@repo/utils';

export interface SocialProofBadgeProps {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function SocialProofBadge({ label, value, icon, className }: SocialProofBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2',
        className
      )}
    >
      {icon && (
        <span className="shrink-0" aria-hidden>
          {icon}
        </span>
      )}
      <span className="text-sm font-medium">{label}</span>
      {value != null && <span className="text-sm text-muted-foreground">{value}</span>}
    </div>
  );
}
