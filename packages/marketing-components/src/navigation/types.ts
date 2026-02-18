/**
 * @file packages/marketing-components/src/navigation/types.ts
 * @role types
 * @summary Shared navigation types
 */

import type { ReactNode } from 'react';

/** Single nav item — compatible with @repo/types NavLink, extended for nested menus */
export interface NavigationItem {
  id?: string;
  label: string;
  href?: string;
  children?: NavigationItem[];
  icon?: ReactNode;
  badge?: string;
}

/** Mega menu featured item */
export interface MegaMenuFeatured {
  title: string;
  description: string;
  image?: string;
  link: string;
}
