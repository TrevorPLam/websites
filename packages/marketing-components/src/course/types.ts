/**
 * @file packages/marketing-components/src/course/types.ts
 * @role types
 * @summary Education course display types
 */

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  category?: string;
  duration?: string;
  level?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  href?: string;
}
