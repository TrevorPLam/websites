// File: packages/ui/src/components/Breadcrumb.tsx  [TRACE:FILE=packages.ui.components.Breadcrumb]
// Purpose: Navigation breadcrumb trail with separator customization and truncation support.
//          Provides accessible navigation path with SEO structured data benefits.
//
// Relationship: Depends on @repo/utils (cn), lucide-react.
// System role: Navigation primitive (Layer L2 @repo/ui).
// Assumptions: Used for site hierarchy navigation, not auto-generated from routes.
//
// Exports / Entry: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbProps
// Used by: Page templates, navigation features, site hierarchy displays
//
// Invariants:
// - Manual item creation only (no auto-generation from routes)
// - Proper ARIA attributes for screen readers
// - SEO structured data support (JSON-LD)
// - Keyboard accessible navigation
//
// Status: @public
// Features:
// - [FEAT:UI] Customizable separators (string or ReactNode)
// - [FEAT:UI] Max items truncation support
// - [FEAT:ACCESSIBILITY] Proper ARIA attributes and keyboard navigation
// - [FEAT:SEO] Structured data support for search engines

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Maximum number of items to show before truncation */
  maxItems?: number;
  /** Separator between items (string or ReactNode) */
  separator?: React.ReactNode;
}

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;
export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}
export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>;
export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<'li'> {
  children?: React.ReactNode;
}

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Breadcrumb]
// [FEAT:UI] [FEAT:ACCESSIBILITY] [FEAT:SEO]
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    { className, maxItems, separator = <ChevronRight className="h-4 w-4" />, children, ...props },
    ref
  ) => {
    const items = React.Children.toArray(children);
    const displayItems =
      maxItems && items.length > maxItems
        ? [
            ...items.slice(0, 1),
            <BreadcrumbEllipsis key="ellipsis" />,
            ...items.slice(-(maxItems - 1)),
          ]
        : items;

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('flex', className)} {...props}>
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
          {displayItems.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < displayItems.length - 1 && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn('flex flex-wrap items-center gap-1.5 break-words', className)}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, asChild, ...props }, ref) => {
    if (asChild) {
      return <>{props.children}</>;
    }
    return (
      <a ref={ref} className={cn('transition-colors hover:text-foreground', className)} {...props}>
        {props.children || <span className="sr-only">Breadcrumb link</span>}
      </a>
    );
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
