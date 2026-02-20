import * as React from 'react';
import { PortfolioGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function PortfolioAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.portfolio) return null;
  return React.createElement(PortfolioGrid, { items: [] });
}
registerSection('industry-portfolio', PortfolioAdapter);
