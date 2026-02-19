/**
 * @file packages/integrations/intercom/src/index.ts
 * Task: [4.3] Intercom chat integration
 */

import type { ChatAdapter, ChatEmbedConfig } from '../../chat/contract';

/**
 * Intercom adapter. Widget script should be loaded only when hasChatConsent() is true.
 */
export class IntercomAdapter implements ChatAdapter {
  id = 'intercom';
  name = 'Intercom';

  constructor(private appId: string) {}

  getEmbedConfig(): ChatEmbedConfig {
    return {
      scriptUrl: `https://widget.intercom.io/widget/${this.appId}`,
      embedId: 'intercom-container',
      config: { appId: this.appId },
    };
  }
}
