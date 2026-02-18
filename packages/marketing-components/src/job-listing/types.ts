/**
 * @file packages/marketing-components/src/job-listing/types.ts
 * @role types
 * @summary Job listing display types
 */

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  type?: string;
  description?: string;
  href?: string;
}
