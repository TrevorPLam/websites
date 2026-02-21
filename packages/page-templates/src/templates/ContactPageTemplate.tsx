/**
 * @file packages/page-templates/src/templates/ContactPageTemplate.tsx
 * Task: [3.5] Form + business info + optional map + slot-based content injection
 *
 * Purpose: Renders contact page via composePage. Sections: contact-form,
 * contact-info (optional map). Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

'use client';

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function ContactPageTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  // Dynamically load contact sections only when this template is used
  React.useEffect(() => {
    import('../sections/contact/index').then((mod) => mod.registerContactSections());
  }, []);
  const content = composePage(
    { page: 'contact', sections: config.pageSections?.contact, searchParams },
    config
  );

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="ContactPageTemplate" />}
      {slots?.footer}
    </>
  );
}
