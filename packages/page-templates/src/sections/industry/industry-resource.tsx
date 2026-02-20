import * as React from 'react';
import { ResourceGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function ResourceAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.resource) return null;
  return React.createElement(ResourceGrid, { resources: [] });
}
registerSection('industry-resource', ResourceAdapter);
