/**
 * @file packages/page-templates/src/sections/features.tsx
 * Task: [3.9] Feature section adapters and registration
 *
 * Purpose: Register section components for Analytics, Chat, and A/B Testing.
 * Adapters map SiteConfig integrations to respective component props.
 * These are often "invisible" or widget-based sections.
 */
import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

// Placeholder components for integrations (in reality these would come from @repo/features or @repo/integrations)
const AnalyticsScript = () => null;
const ChatWidget = () => null;
const ABTestBanner = () => null;

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function AnalyticsAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const analytics = config.integrations.analytics;
  if (!analytics || analytics.provider === 'none') return null;
  return React.createElement(AnalyticsScript, {
    provider: analytics.provider,
    trackingId: analytics.trackingId,
  });
}

function ChatAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const chat = config.integrations.chat;
  if (!chat || chat.provider === 'none') return null;
  return React.createElement(ChatWidget, {
    provider: chat.provider,
    config: chat.config,
  });
}

function ABTestingAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const abTesting = config.integrations.abTesting;
  if (!abTesting || abTesting.provider === 'none') return null;
  return React.createElement(ABTestBanner, {
    config: abTesting.config,
  });
}

/** Register all feature sections. Called once on module load. */
export function registerFeatureSections(): void {
  registerSection('feature-analytics', AnalyticsAdapter);
  registerSection('feature-chat', ChatAdapter);
  registerSection('feature-ab-testing', ABTestingAdapter);
}

// Side-effect: register on module load
registerFeatureSections();
