import * as React from 'react';
import { VideoEmbed } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function VideoAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.video) return null;
  return React.createElement(VideoEmbed, { url: '' });
}
registerSection('industry-video', VideoAdapter);
