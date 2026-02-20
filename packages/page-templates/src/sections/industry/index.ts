/**
 * @file packages/page-templates/src/sections/industry/index.ts
 * Purpose: Barrel and side-effect registration for industry sections.
 */
import './industry-location';
import './industry-menu';
import './industry-portfolio';
import './industry-course';
import './industry-resource';
import './industry-comparison';
import './industry-filter';
import './industry-search';
import './industry-social-proof';
import './industry-video';
import './industry-audio';
import './industry-interactive';
import './industry-widget';

export function registerIndustrySections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
