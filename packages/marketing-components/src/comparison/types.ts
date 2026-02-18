/**
 * @file packages/marketing-components/src/comparison/types.ts
 * @role types
 * @summary Comparison table types
 */

export interface ComparisonRow {
  feature: string;
  values: (string | boolean | number | null)[];
}

export interface ComparisonColumn {
  id: string;
  name: string;
  highlight?: boolean;
}
