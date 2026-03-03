/**
 * @file packages/core-engine/src/puck/plugins/index.ts
 * @summary Puck editor plugin exports and configuration.
 * @description Provides plugin definitions and configuration options for Puck editor functionality.
 * @security Plugin configurations; no sensitive data stored.
 * @adr none
 * @requirements DOMAIN-3 / core-engine-implementation
 */
import { Plugin } from '@puckeditor/core';
import { headingAnalyzer } from '@puckeditor/plugin-heading-analyzer';

// Built-in plugins for Puck editor
export const puckPlugins: Plugin[] = [headingAnalyzer()];

// Plugin configuration options
export const pluginConfig = {
  headingAnalyzer: {
    enabled: true,
    options: {
      // Configure heading analyzer behavior
      analyzeOnMount: true,
      analyzeOnChange: true,
      showWarnings: true,
    },
  },
};

/**
 * Get enabled plugins based on configuration settings.
 * @returns Array of enabled Puck plugins.
 */
export function getEnabledPlugins(): Plugin[] {
  return puckPlugins.filter((plugin, index) => {
    const pluginName = Object.keys(pluginConfig)[index];
    const config = pluginConfig[pluginName as keyof typeof pluginConfig];
    return config?.enabled !== false;
  });
}

// Export individual plugins for selective use
export { headingAnalyzer };
