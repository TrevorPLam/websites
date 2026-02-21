'use client';

/**
 * @file packages/marketing-components/src/filter/FilterBar.tsx
 * @role component
 * @summary Filter bar with category buttons
 */

import { Button } from '@repo/ui';
import { cn } from '@repo/utils';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterBarProps {
  options: FilterOption[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function FilterBar({ options, activeId, onSelect, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filter options">
      {options.map((opt) => (
        <Button
          key={opt.id}
          variant={activeId === opt.id ? 'primary' : 'outline'}
          size="small"
          onClick={() => onSelect?.(opt.id)}
          aria-pressed={activeId === opt.id}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
