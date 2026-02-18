/**
 * @file packages/marketing-components/src/case-study/types.ts
 * @role types
 * @summary Case study / success story display types
 */

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client?: string;
  industry?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  image?: string;
  href?: string;
}
