#!/usr/bin/env tsx

/**
 * @file scripts/verify-catalogs.ts
 * @summary Validates that pnpm workspace catalog versions are consistent across all packages.
 * @description Reads the catalog definitions from `pnpm-workspace.yaml` and
 *   walks every `package.json` in the workspace to verify that all
 *   dependency/devDependency/peerDependency entries that reference a cataloged
 *   package either:
 *   (a) use the `catalog:` or `catalog:<name>` protocol, or
 *   (b) specify a version that exactly matches the catalog.
 *
 *   Any version drift (a package pinning a different version than the catalog)
 *   is reported as an error and the script exits with code 1.
 *
 *   Run via: `pnpm verify-catalogs`
 *
 * @security Reads only local filesystem files; no network access.
 * @requirements TASK-CATALOG-001
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { glob } from 'node:fs/promises';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CatalogEntries {
  [packageName: string]: string;
}

interface WorkspaceYaml {
  catalog?: CatalogEntries;
  catalogs?: Record<string, CatalogEntries>;
  packages?: string[];
}

interface DriftReport {
  packageJsonPath: string;
  dependencyType: string;
  packageName: string;
  usedVersion: string;
  catalogVersion: string;
}

// ─── YAML helpers ─────────────────────────────────────────────────────────────

/**
 * Minimal YAML parser sufficient for pnpm-workspace.yaml structure.
 * Handles string scalars, simple objects, and lists.
 * We avoid pulling in a YAML library to keep the script dependency-free.
 */
function parseWorkspaceYaml(content: string): WorkspaceYaml {
  const result: WorkspaceYaml = {};
  const lines = content.split('\n');

  let inCatalog = false;
  let inPackages = false;
  const catalog: CatalogEntries = {};
  const packages: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    if (trimmed === 'catalog:') {
      inCatalog = true;
      inPackages = false;
      continue;
    }

    if (trimmed === 'packages:') {
      inPackages = true;
      inCatalog = false;
      continue;
    }

    // Detect new top-level key
    if (!/^\s/.test(line) && trimmed.endsWith(':')) {
      inCatalog = false;
      inPackages = false;
      continue;
    }

    if (inCatalog && line.startsWith('  ')) {
      // catalog entry: "  'package-name': version"
      const match = trimmed.match(/^['"]?([^'":\s]+(?:\s+[^'":\s]+)*)['"]?\s*:\s*['"]?(.+?)['"]?\s*$/);
      if (match?.[1] && match[2]) {
        catalog[match[1]] = match[2];
      }
      continue;
    }

    if (inPackages && line.startsWith('  ')) {
      // package glob: "  - 'packages/*'"
      const match = trimmed.match(/^-\s+['"]?(.+?)['"]?\s*$/);
      if (match?.[1]) packages.push(match[1]);
      continue;
    }
  }

  if (Object.keys(catalog).length > 0) result.catalog = catalog;
  if (packages.length > 0) result.packages = packages;

  return result;
}

// ─── Logging ──────────────────────────────────────────────────────────────────

type LogLevel = 'info' | 'success' | 'warn' | 'error';

function log(message: string, level: LogLevel = 'info'): void {
  const colors: Record<LogLevel, string> = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
  };
  console.log(`${colors[level]}${message}\x1b[0m`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const root = resolve(import.meta.dirname ?? process.cwd(), '..');
  const workspaceFile = resolve(root, 'pnpm-workspace.yaml');

  if (!existsSync(workspaceFile)) {
    log('pnpm-workspace.yaml not found — skipping catalog validation.', 'warn');
    process.exit(0);
  }

  // Parse catalog definitions
  const workspaceContent = readFileSync(workspaceFile, 'utf8');
  const workspace = parseWorkspaceYaml(workspaceContent);
  const catalog: CatalogEntries = workspace.catalog ?? {};

  if (Object.keys(catalog).length === 0) {
    log('No catalog entries found in pnpm-workspace.yaml.', 'warn');
    process.exit(0);
  }

  log(`Found ${Object.keys(catalog).length} catalog entries.`, 'info');

  // Find all package.json files (exclude node_modules and .git)
  const packageJsonFiles: string[] = [];
  for await (const file of glob('**/package.json', {
    cwd: root,
    exclude: (name) =>
      name === 'node_modules' || name === '.git' || name === '.pnpm-store' || name === 'dist',
  })) {
    packageJsonFiles.push(resolve(root, file));
  }

  log(`Scanning ${packageJsonFiles.length} package.json files...`, 'info');

  // Check each package.json for version drift
  const driftReports: DriftReport[] = [];
  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'] as const;

  for (const pkgPath of packageJsonFiles) {
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>;
    } catch {
      log(`Could not parse ${pkgPath} — skipping.`, 'warn');
      continue;
    }

    for (const depType of depTypes) {
      const deps = pkg[depType] as Record<string, string> | undefined;
      if (!deps) continue;

      for (const [pkgName, version] of Object.entries(deps)) {
        // Skip catalog: references (they're correct by definition)
        if (version === 'catalog:' || version.startsWith('catalog:')) continue;
        // Skip workspace: references
        if (version.startsWith('workspace:')) continue;
        // Skip file: references
        if (version.startsWith('file:')) continue;

        const catalogVersion = catalog[pkgName];
        if (!catalogVersion) continue; // not a cataloged package

        // Check for version drift
        if (version !== catalogVersion) {
          driftReports.push({
            packageJsonPath: pkgPath.replace(root + '/', ''),
            dependencyType: depType,
            packageName: pkgName,
            usedVersion: version,
            catalogVersion,
          });
        }
      }
    }
  }

  // Report results
  console.log('');

  if (driftReports.length === 0) {
    log('✅  No catalog version drift detected. All packages are consistent.', 'success');
    process.exit(0);
  }

  log(`❌  Found ${driftReports.length} catalog version drift(s):\n`, 'error');

  for (const report of driftReports) {
    log(
      `  ${report.packageJsonPath}\n` +
        `    ${report.dependencyType}.${report.packageName}\n` +
        `    used: ${report.usedVersion}  ←→  catalog: ${report.catalogVersion}`,
      'error',
    );
    console.log('');
  }

  log(
    'Fix by using "catalog:" protocol or aligning versions with pnpm-workspace.yaml catalog.',
    'info',
  );
  process.exit(1);
}

main().catch((err: unknown) => {
  console.error('verify-catalogs failed:', err);
  process.exit(1);
});
