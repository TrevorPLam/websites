'use client';

/**
 * @file packages/marketing-components/src/search/SearchBar.tsx
 * @role component
 * @summary Search input with optional submit
 */

import { Input } from '@repo/ui';
import { cn } from '@repo/utils';

export interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current value (controlled) */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Submit handler (Enter key) */
  onSubmit?: (value: string) => void;
  /** Accessible label */
  'aria-label'?: string;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search…',
  value = '',
  onChange,
  onSubmit,
  'aria-label': ariaLabel = 'Search',
  className,
}: SearchBarProps) {
  return (
    <form
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      role="search"
    >
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={ariaLabel}
        className="pr-10"
      />
    </form>
  );
}
