/**
 * @file packages/page-templates/src/sections/contact/index.ts
 * Purpose: Barrel and side-effect registration for contact sections.
 */
import './contact-form';
import './contact-info';

export function registerContactSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
