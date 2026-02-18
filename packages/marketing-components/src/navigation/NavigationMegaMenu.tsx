/**
 * @file packages/marketing-components/src/navigation/NavigationMegaMenu.tsx
 * @role component
 * @summary Mega menu nav with multi-column dropdowns
 */

'use client';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@repo/ui';
import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { NavigationItem, MegaMenuFeatured } from './types';

export interface NavigationMegaMenuProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  featured?: MegaMenuFeatured[];
  columns?: number;
  className?: string;
}

const linkClass =
  'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground';

export function NavigationMegaMenu({
  items,
  logo,
  featured,
  columns = 3,
  className,
}: NavigationMegaMenuProps) {
  return (
    <nav className={cn('border-b border-border bg-background', className)}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {logo && <div className="flex shrink-0 items-center">{logo}</div>}
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {items.map((item, i) => (
                <NavigationMenuItem key={item.id ?? item.href ?? i}>
                  {item.children?.length ? (
                    <>
                      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] gap-4 p-4 md:w-[700px] lg:w-[800px] lg:grid-cols-3">
                          {featured && featured.length > 0 && (
                            <div className="lg:col-span-1 space-y-2">
                              {featured.map((f, j) => (
                                <a
                                  key={j}
                                  href={f.link}
                                  className={cn(linkClass, 'flex flex-col gap-1')}
                                >
                                  <span className="font-semibold">{f.title}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {f.description}
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}
                          <div
                            className={cn(
                              'grid gap-2',
                              featured?.length ? 'lg:col-span-2' : 'lg:col-span-3'
                            )}
                            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                          >
                            {item.children.map((child, j) => (
                              <NavigationMenuLink
                                key={child.href ?? j}
                                href={child.href ?? '#'}
                                className={linkClass}
                              >
                                <div className="text-sm font-medium">{child.label}</div>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      href={item.href ?? '#'}
                      className="inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.label}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </nav>
  );
}
