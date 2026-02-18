/**
 * @file packages/page-templates/src/templates/BookingPageTemplate.tsx
 * Task: [3.8] Booking form with pre-fill context
 *
 * Purpose: Renders booking page via composePage. Sections: booking-form.
 * Booking config derived from siteConfig.conversionFlow (type: 'booking').
 * searchParams may pre-fill service/date. Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/booking'; // side-effect: register booking sections

export function BookingPageTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage(
    { page: 'booking', searchParams },
    config
  );
  if (result === null) {
    return React.createElement('div', { 'data-template': 'BookingPageTemplate' }, null);
  }
  return result;
}
