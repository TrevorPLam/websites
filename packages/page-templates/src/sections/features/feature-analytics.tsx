/**
 * @file packages/page-templates/src/sections/features/feature-analytics.tsx
 * Purpose: Analytics feature section adapter and registration.
 */
import * as React from 'react';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

const AnalyticsScript = () => null;

function AnalyticsAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const analytics = config.integrations?.analytics;
  if (!analytics || analytics.provider === 'none') return null;
  return React.createElement(AnalyticsScript, {
    provider: analytics.provider,
    trackingId: analytics.trackingId,
  });
}
registerSection('feature-analytics', AnalyticsAdapter);
