/**
 * @file packages/features/src/chat/components/ChatWidget.tsx
 * Purpose: Chat widget placeholder — integrates with provider scripts when enabled
 */

'use client';

import type { ChatFeatureConfig } from '../lib/chat-config';

export interface ChatWidgetProps extends ChatFeatureConfig {
  /** Optional children for custom widget content */
  children?: React.ReactNode;
}

/**
 * Chat widget wrapper. When provider is configured and enabled,
 * the actual widget is loaded by the provider's script (Intercom, Crisp, etc.).
 * This component renders a placeholder or nothing when disabled.
 */
export function ChatWidget({ provider = 'none', enabled = false, children }: ChatWidgetProps) {
  if (!enabled || provider === 'none') return null;

  return (
    <div data-chat-provider={provider} data-chat-enabled={enabled}>
      {children}
    </div>
  );
}
