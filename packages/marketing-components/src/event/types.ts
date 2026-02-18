/**
 * @file packages/marketing-components/src/event/types.ts
 * @role types
 * @summary Event display types
 */

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
}
