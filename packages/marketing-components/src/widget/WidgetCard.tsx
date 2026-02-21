'use client';

/**
 * @file packages/marketing-components/src/widget/WidgetCard.tsx
 * @role component
 * @summary Generic widget card container
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';

export interface WidgetCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({ title, children, className }: WidgetCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {title && (
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </Card>
  );
}
