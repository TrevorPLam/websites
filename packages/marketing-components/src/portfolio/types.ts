/**
 * @file packages/marketing-components/src/portfolio/types.ts
 * @role types
 * @summary Portfolio/work sample display types
 */

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  href?: string;
}
