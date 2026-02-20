/**
 * @file packages/page-templates/src/sections/features/feature-chat.tsx
 * Purpose: Chat feature section adapter and registration.
 */
import * as React from 'react';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

const ChatWidget = () => null;

function ChatAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const chat = config.integrations?.chat;
  if (!chat || chat.provider === 'none') return null;
  return React.createElement(ChatWidget, {
    provider: chat.provider,
    config: chat.config,
  });
}
registerSection('feature-chat', ChatAdapter);
