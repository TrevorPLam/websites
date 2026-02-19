/**
 * @file packages/integrations/chat/contract.ts
 * Task: [4.3] Chat integration contract
 *
 * Purpose: Defines the shared interface for chat widget adapters.
 * Supports Intercom, Crisp, Tidio. Widget scripts must be loaded only after consent.
 */

/** Configuration for embedding the chat widget (script URL, container id, provider-specific options). */
export interface ChatEmbedConfig {
  /** Optional script URL to load when consent is granted. */
  scriptUrl?: string;
  /** Optional container or element id for the widget. */
  embedId?: string;
  /** Provider-specific config (e.g. appId, websiteId, theme). */
  config?: Record<string, unknown>;
}

export interface ChatAdapter {
  id: string;
  name: string;

  /**
   * Returns the configuration for the chat widget embed.
   * Caller should load script only when consent is granted (hasChatConsent()).
   */
  getEmbedConfig(): ChatEmbedConfig;
}
