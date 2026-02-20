/**
 * @file packages/page-templates/src/sections/services/index.ts
 * Purpose: Barrel and side-effect registration for services sections.
 */
import './services-grid';
import './services-list';
import './services-tabs';
import './services-accordion';

export function registerServicesSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
