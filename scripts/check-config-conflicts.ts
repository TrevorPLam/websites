#!/usr/bin/env npx tsx
/**
 * @file scripts/check-config-conflicts.ts
 * @summary Detect duplicate tenant identifiers and domains across site config files.
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';

type LoadedConfig = {
  identity?: { tenantId?: string; domain?: { primary?: string; customDomains?: string[] } };
  id?: string;
  url?: string;
};

function normalizeDomain(value: string): string {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

async function loadConfig(filePath: string): Promise<LoadedConfig> {
  const mod = await import(pathToFileURL(filePath).href);
  return (mod.default ?? mod.config ?? mod) as LoadedConfig;
}

async function main() {
  const configPaths = await glob(['clients/*/site.config.ts', 'sites/*/site.config.ts'], {
    cwd: process.cwd(),
    absolute: true,
  });

  if (configPaths.length === 0) {
    console.log('No site.config.ts files found in clients/ or sites/.');
    return;
  }

  const seenTenantIds = new Map<string, string>();
  const seenDomains = new Map<string, string>();
  const errors: string[] = [];

  for (const filePath of configPaths) {
    const config = await loadConfig(filePath);
    const relPath = path.relative(process.cwd(), filePath);

    const tenantId = config.identity?.tenantId ?? config.id;
    if (tenantId) {
      if (seenTenantIds.has(tenantId)) {
        errors.push(
          `Duplicate tenant identifier "${tenantId}" in ${relPath} and ${seenTenantIds.get(tenantId)}`
        );
      } else {
        seenTenantIds.set(tenantId, relPath);
      }
    }

    const domains = new Set<string>();
    if (config.identity?.domain?.primary) domains.add(config.identity.domain.primary);
    for (const d of config.identity?.domain?.customDomains ?? []) domains.add(d);
    if (config.url) domains.add(config.url);

    for (const domain of domains) {
      const normalized = normalizeDomain(domain);
      if (seenDomains.has(normalized)) {
        errors.push(
          `Duplicate domain "${normalized}" in ${relPath} and ${seenDomains.get(normalized)}`
        );
      } else {
        seenDomains.set(normalized, relPath);
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration conflicts found:');
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  console.log(
    `✅ No duplicate tenant identifiers or domains across ${configPaths.length} config file(s).`
  );
}

main().catch((error) => {
  console.error(
    `❌ Failed to check configuration conflicts: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
});
