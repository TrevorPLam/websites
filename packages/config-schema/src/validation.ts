import { validateSiteConfig } from './schema';
import { glob } from 'glob';
import { pathToFileURL } from 'url';

/**
 * Validates all site.config.ts files in the monorepo
 * Used in CI to prevent invalid configurations from reaching production
 */
export async function validateAllConfigs() {
  const configPaths = await glob('sites/*/site.config.ts', {
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`Found ${configPaths.length} site config files`);

  const errors: Array<{ path: string; error: string }> = [];

  for (const configPath of configPaths) {
    try {
      // Dynamic import (handles TypeScript)
      const fileUrl = pathToFileURL(configPath).href;
      const module = await import(fileUrl);
      const config = module.default || module.config;

      // Validate
      validateSiteConfig(config);

      console.log(`✓ ${configPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: configPath, error: message });
      console.error(`✗ ${configPath}: ${message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ ${errors.length} configuration(s) failed validation\n`);
    process.exit(1);
  }

  console.log(`\n✅ All ${configPaths.length} configurations are valid\n`);
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAllConfigs();
}
