/**
 * @file packages/features/src/chat/lib/chat-config.ts
 * Purpose: Chat feature configuration
 */

export type ChatProvider = 'intercom' | 'crisp' | 'tidio' | 'none';

export interface ChatFeatureConfig {
  /** Chat provider */
  provider?: ChatProvider;
  /** Whether chat widget is enabled */
  enabled?: boolean;
  /** Position: bottom-right, bottom-left */
  position?: 'bottom-right' | 'bottom-left';
}

export function createChatConfig(overrides: Partial<ChatFeatureConfig> = {}): ChatFeatureConfig {
  return {
    provider: 'none',
    enabled: false,
    position: 'bottom-right',
    ...overrides,
  };
}
