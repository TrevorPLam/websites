declare const process: { cwd: () => string; argv: string[]; exit: (code: number) => never };
import { validateSiteConfig } from './schema';
import { glob } from 'glob';

/**
 * Validates all site.config.ts files in the monorepo
 * Used in CI to prevent invalid configurations from reaching production
 */
export async function validateAllConfigs() {
  const configPaths = await glob(['sites/*/site.config.ts', 'clients/*/site.config.ts'], {
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`Found ${configPaths.length} site config file(s)`);

  const errors: Array<{ path: string; error: string }> = [];
  let validatedCount = 0;
  let skippedCount = 0;

  for (const configPath of configPaths) {
    try {
      const fileUrl = new URL(`file://${configPath}`).href;
      const module = await import(fileUrl);
      const config = module.default || module.config;

      if (!config?.identity) {
        skippedCount += 1;
        console.log(`⚠ Skipping legacy config (no identity block): ${configPath}`);
        continue;
      }

      validateSiteConfig(config);
      validatedCount += 1;
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

  console.log(
    `\n✅ Validation complete: ${validatedCount} validated, ${skippedCount} skipped legacy, ${configPaths.length} total\n`
  );
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAllConfigs();
}
