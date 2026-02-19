/**
 * @file packages/integrations/crisp/src/index.ts
 * Task: [4.3] Crisp chat integration
 */

import type { ChatAdapter, ChatEmbedConfig } from '../../chat/contract';

/**
 * Crisp adapter. Widget script should be loaded only when hasChatConsent() is true.
 */
export class CrispAdapter implements ChatAdapter {
  id = 'crisp';
  name = 'Crisp';

  constructor(private websiteId: string) {}

  getEmbedConfig(): ChatEmbedConfig {
    return {
      scriptUrl: 'https://client.crisp.chat/l.js',
      embedId: 'crisp-container',
      config: { websiteId: this.websiteId },
    };
  }
}
