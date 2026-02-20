import * as React from 'react';
import { AudioPlayer } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function AudioAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.audio) return null;
  return React.createElement(AudioPlayer, { url: '' });
}
registerSection('industry-audio', AudioAdapter);
