/**
 * @file packages/marketing-components/src/menu/types.ts
 * @role types
 * @summary Restaurant menu display types
 */

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceUnit?: string;
  dietaryTags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}
