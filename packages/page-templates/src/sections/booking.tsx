/**
 * @file packages/page-templates/src/sections/booking.tsx
 * Task: [3.8] Booking page section adapters and registration
 *
 * Purpose: Register section components for booking page. Adapters map SiteConfig
 * conversionFlow (type: 'booking') to BookingForm props via createBookingConfig.
 * searchParams may pre-fill service/date. Registration via import side-effect.
 */
import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import { BookingForm, createBookingConfig } from '@repo/features';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function BookingFormAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const flow = config.conversionFlow;
  if (flow.type !== 'booking') {
    return null;
  }
  const bookingConfig = createBookingConfig(flow);
  const prefilledService = props.searchParams?.service as string | undefined;
  return React.createElement(BookingForm, {
    config: bookingConfig,
    prefilledService,
  });
}

/** Register all booking page sections. Called once on module load. */
export function registerBookingSections(): void {
  registerSection('booking-form', BookingFormAdapter);
}

// Side-effect: register on module load so BookingPageTemplate can use composePage
registerBookingSections();
