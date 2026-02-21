/**
 * @file packages/page-templates/src/templates/BookingPageTemplate.tsx
 * Task: [3.8] Booking form with pre-fill context + slot-based content injection
 *
 * Purpose: Renders booking page via composePage. Sections: booking-form.
 * Booking config derived from siteConfig.conversionFlow (type: 'booking').
 * searchParams may pre-fill service/date. Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function BookingPageTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  // Dynamically load booking sections only when this template is used
  React.useEffect(() => {
    import('../sections/booking/index').then((mod) => mod.registerBookingSections());
  }, []);

  const content = composePage(
    { page: 'booking', sections: config.pageSections?.booking, searchParams },
    config
  );

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="BookingPageTemplate" />}
      {slots?.footer}
    </>
  );
}
