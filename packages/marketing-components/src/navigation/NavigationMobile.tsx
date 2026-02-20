'use client';

/**
 * @file packages/marketing-components/src/navigation/NavigationMobile.tsx
 * @role component
 * @summary Mobile drawer nav using Sheet
 */

'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@repo/ui';
import { Menu } from 'lucide-react';
import { useMobileNavigation } from './hooks';
import type { NavigationItem } from './types';

export interface NavigationMobileProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  triggerLabel?: string;
  className?: string;
}

export function NavigationMobile({
  items,
  logo,
  triggerLabel = 'Open menu',
  className,
}: NavigationMobileProps) {
  const { isOpen, open, close } = useMobileNavigation();

  return (
    <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <SheetTrigger asChild aria-label={triggerLabel}>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          onClick={open}
          aria-expanded={isOpen}
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent side="left" size="full" className={className}>
        <SheetHeader>{logo && <SheetTitle>{logo}</SheetTitle>}</SheetHeader>
        <nav className="mt-8 flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={item.href ?? item.id ?? i}>
              <a
                href={item.href ?? '#'}
                className="block rounded-md px-4 py-3 text-base font-medium hover:bg-accent"
                onClick={close}
              >
                {item.label}
              </a>
              {item.children?.map((child, j) => (
                <a
                  key={child.href ?? j}
                  href={child.href ?? '#'}
                  className="ml-6 block rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={close}
                >
                  {child.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
