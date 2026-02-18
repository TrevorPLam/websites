/**
 * @file packages/page-templates/src/templates/ContactPageTemplate.tsx
 * Task: [3.5] Form + business info + optional map
 *
 * Purpose: Renders contact page via composePage. Sections: contact-form,
 * contact-info (optional map). Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/contact'; // side-effect: register contact sections

export function ContactPageTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage(
    { page: 'contact', searchParams },
    config
  );
  if (result === null) {
    return React.createElement('div', { 'data-template': 'ContactPageTemplate' }, null);
  }
  return result;
}
