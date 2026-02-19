/**
 * @file packages/integrations/tidio/src/index.ts
 * Task: [4.3] Tidio chat integration
 */

import type { ChatAdapter, ChatEmbedConfig } from '../../chat/contract';

/**
 * Tidio adapter. Widget script should be loaded only when hasChatConsent() is true.
 */
export class TidioAdapter implements ChatAdapter {
  id = 'tidio';
  name = 'Tidio';

  constructor(private publicKey: string) {}

  getEmbedConfig(): ChatEmbedConfig {
    return {
      scriptUrl: 'https://code.tidio.co/embed.js',
      embedId: 'tidio-container',
      config: { publicKey: this.publicKey },
    };
  }
}
