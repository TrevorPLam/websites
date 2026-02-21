/**
 * @file packages/page-templates/src/sections/booking/booking-form.tsx
 * Purpose: Booking form section adapter and registration.
 */
import * as React from 'react';
import { BookingForm, createBookingConfig } from '@repo/features/client';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function BookingFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const flow = config.conversionFlow;
  if (flow.type !== 'booking') {
    return null;
  }
  const bookingConfig = createBookingConfig(flow);
  const searchParams = (props.searchParams ?? {}) as Record<string, string | string[] | undefined>;
  const prefilledService = searchParams['service'] as string | undefined;
  return React.createElement(BookingForm, {
    config: bookingConfig,
    prefilledService,
  });
}

registerSection('booking-form', BookingFormAdapter);
