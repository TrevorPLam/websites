/**
 * @file packages/marketing-components/src/resource/types.ts
 * @role types
 * @summary Downloadable resource display types
 */

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type?: string;
  fileUrl?: string;
  downloadCount?: number;
  image?: string;
  href?: string;
}
