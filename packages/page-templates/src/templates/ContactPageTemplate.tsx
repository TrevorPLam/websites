/**
 * @file packages/page-templates/src/templates/ContactPageTemplate.tsx
 * Task: [3.5] Form + business info + optional map + slot-based content injection
 *
 * Purpose: Renders contact page via composePage. Sections: contact-form,
 * contact-info (optional map). Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/contact/index'; // side-effect: register contact sections

export function ContactPageTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  const content = composePage({ page: 'contact', searchParams }, config);

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="ContactPageTemplate" />}
      {slots?.footer}
    </>
  );
}
