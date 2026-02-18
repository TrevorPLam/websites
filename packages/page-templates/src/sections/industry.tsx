/**
 * @file packages/page-templates/src/sections/industry.tsx
 * Task: [3.9] Industry section adapters and registration
 *
 * Purpose: Register section components for industry-specific features.
 * Adapters map SiteConfig features to marketing-component props.
 */
import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import {
  LocationSection,
  MenuSection,
  PortfolioGrid,
  CourseGrid,
  ResourceLibrary,
  ComparisonTable,
  FilterSystem,
  SearchBar,
  SocialProof,
  VideoEmbed,
  AudioPlayer,
  InteractiveWidget,
  GenericWidget,
} from '@repo/marketing-components';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function LocationAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.location) return null;
  return React.createElement(LocationSection, {
    address: config.contact.address,
    hours: config.contact.hours,
  });
}

function MenuAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.menu) return null;
  return React.createElement(MenuSection, { name: config.name });
}

function PortfolioAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.portfolio) return null;
  return React.createElement(PortfolioGrid, { title: 'Our Portfolio' });
}

function CourseAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.course) return null;
  return React.createElement(CourseGrid, { title: 'Available Courses' });
}

function ResourceAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.resource) return null;
  return React.createElement(ResourceLibrary, { title: 'Resources' });
}

function ComparisonAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.comparison) return null;
  return React.createElement(ComparisonTable, { title: 'Compare Plans' });
}

function FilterAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.filter) return null;
  return React.createElement(FilterSystem, {});
}

function SearchAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.search) return null;
  return React.createElement(SearchBar, {});
}

function SocialProofAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.socialProof) return null;
  return React.createElement(SocialProof, {});
}

function VideoAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.video) return null;
  return React.createElement(VideoEmbed, {});
}

function AudioAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.audio) return null;
  return React.createElement(AudioPlayer, {});
}

function InteractiveAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.interactive) return null;
  return React.createElement(InteractiveWidget, {});
}

function WidgetAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.widget) return null;
  return React.createElement(GenericWidget, {});
}

/** Register all industry sections. Called once on module load. */
export function registerIndustrySections(): void {
  registerSection('industry-location', LocationAdapter);
  registerSection('industry-menu', MenuAdapter);
  registerSection('industry-portfolio', PortfolioAdapter);
  registerSection('industry-course', CourseAdapter);
  registerSection('industry-resource', ResourceAdapter);
  registerSection('industry-comparison', ComparisonAdapter);
  registerSection('industry-filter', FilterAdapter);
  registerSection('industry-search', SearchAdapter);
  registerSection('industry-social-proof', SocialProofAdapter);
  registerSection('industry-video', VideoAdapter);
  registerSection('industry-audio', AudioAdapter);
  registerSection('industry-interactive', InteractiveAdapter);
  registerSection('industry-widget', WidgetAdapter);
}

// Side-effect: register on module load
registerIndustrySections();
