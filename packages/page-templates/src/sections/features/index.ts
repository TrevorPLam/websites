/**
 * @file packages/page-templates/src/sections/features/index.ts
 * Purpose: Barrel and side-effect registration for feature sections.
 */
import './feature-analytics';
import './feature-chat';
import './feature-ab-testing';

export function registerFeatureSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
