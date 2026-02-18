/**
 * @file packages/marketing-components/src/navigation/NavigationHorizontal.tsx
 * @role component
 * @summary Horizontal nav bar using NavigationMenu
 */

'use client';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@repo/ui';
import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { NavigationItem } from './types';

export interface NavigationHorizontalProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  className?: string;
}

const linkClass =
  'inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50';

function NavLinkItem({ item }: { item: NavigationItem }) {
  const hasDropdown = item.children && item.children.length > 0;
  if (!hasDropdown) {
    return (
      <NavigationMenuLink href={item.href ?? '#'} className={linkClass}>
        {item.label}
      </NavigationMenuLink>
    );
  }
  return (
    <>
      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {item.children!.map((child, i) => (
            <li key={child.href ?? i}>
              <NavigationMenuLink
                href={child.href ?? '#'}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-sm font-medium">{child.label}</div>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
}

export function NavigationHorizontal({ items, logo, className }: NavigationHorizontalProps) {
  return (
    <nav className={cn('border-b border-border bg-background', className)}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {logo && <div className="flex shrink-0 items-center">{logo}</div>}
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {items.map((item, i) => (
                <NavigationMenuItem key={item.id ?? item.href ?? i}>
                  <NavLinkItem item={item} />
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </nav>
  );
}
