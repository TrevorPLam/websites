import { Plugin } from '@measured/puck';
import { headingAnalyzer } from '@measured/puck-plugin-heading-analyzer';

// Built-in plugins for Puck editor
export const puckPlugins: Plugin[] = [
  headingAnalyzer(),
];

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

// Helper function to get enabled plugins
export function getEnabledPlugins(): Plugin[] {
  return puckPlugins.filter((plugin, index) => {
    const pluginName = Object.keys(pluginConfig)[index];
    const config = pluginConfig[pluginName as keyof typeof pluginConfig];
    return config?.enabled !== false;
  });
}

// Export individual plugins for selective use
export { headingAnalyzer };
