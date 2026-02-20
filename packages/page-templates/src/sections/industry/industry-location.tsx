/**
 * @file packages/page-templates/src/sections/industry/industry-location.tsx
 * Purpose: Industry location section adapter and registration.
 */
import * as React from 'react';
import { LocationList } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function LocationAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.location) return null;
  return React.createElement(LocationList, { locations: [] });
}

registerSection('industry-location', LocationAdapter);
