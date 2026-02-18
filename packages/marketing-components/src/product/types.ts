/**
 * @file packages/marketing-components/src/product/types.ts
 * @role types
 * @summary Product display types for e-commerce
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  tags?: string[];
}
