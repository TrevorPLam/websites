// File: packages/ui/src/components/Pagination.tsx  [TRACE:FILE=packages.ui.components.Pagination]
// Purpose: Pagination controls with page navigation and ellipsis.
//          Provides accessible pagination with keyboard navigation.
//
// Relationship: Depends on @repo/utils (cn), lucide-react, Button component.
// System role: Navigation primitive (Layer L2 @repo/ui).
// Assumptions: Used for paginated content navigation.
//
// Exports / Entry: Pagination component and sub-components, PaginationProps
// Used by: Data tables, lists, search results
//
// Invariants:
// - Keyboard accessible navigation
// - Ellipsis for many pages
//
// Status: @public
// Features:
// - [FEAT:UI] Page navigation
// - [FEAT:UI] Ellipsis for many pages
// - [FEAT:ACCESSIBILITY] Keyboard navigation

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@repo/utils';
import { Button } from './Button';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of pages to show on each side of current page */
  siblingCount?: number;
}

export type PaginationContentProps = React.ComponentPropsWithoutRef<'ul'>;
export type PaginationItemProps = React.ComponentPropsWithoutRef<'li'>;
export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  isActive?: boolean;
}
export type PaginationPreviousProps = React.ComponentPropsWithoutRef<'button'>;
export type PaginationNextProps = React.ComponentPropsWithoutRef<'button'>;
export type PaginationEllipsisProps = React.ComponentPropsWithoutRef<'span'>;

// ─── Components ──────────────────────────────────────────────────────────────

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, siblingCount = 1, ...props }, ref) => {
    const generatePageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      const totalNumbers = siblingCount * 2 + 5; // siblingCount on each side + current + first + last + 2 ellipsis

      if (totalPages <= totalNumbers) {
        // Show all pages if total is less than calculated number
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Calculate start and end page numbers
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftEllipsis = leftSiblingIndex > 2;
        const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

        if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
          // Show first few pages, ellipsis, and last pages
          for (let i = 1; i <= 3; i++) pages.push(i);
          pages.push('ellipsis');
          for (let i = totalPages - 1; i <= totalPages; i++) pages.push(i);
        } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
          // Show first pages, ellipsis, and last few pages
          for (let i = 1; i <= 2; i++) pages.push(i);
          pages.push('ellipsis');
          for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
        } else {
          // Show first page, ellipsis, middle pages, ellipsis, last page
          pages.push(1);
          pages.push('ellipsis');
          for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i);
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {generatePageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
);
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, children, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      {...props}
    >
      {children || <span className="sr-only">Page {isActive ? '(current)' : ''}</span>}
    </a>
  )
);
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="small"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </Button>
  )
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="small"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
