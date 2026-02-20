import * as React from 'react';
import { WidgetCard } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function WidgetAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.widget) return null;
  return React.createElement(WidgetCard, { title: '', content: null });
}
registerSection('industry-widget', WidgetAdapter);
