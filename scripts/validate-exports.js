#!/usr/bin/env node
/**
 * @file scripts/validate-exports.js
 * @summary Validates package.json export maps resolve to actual files on disk.
 * @description Prevents broken export paths by verifying every package.json exports entry exists.
 * @security Reads package.json files only; no sensitive data accessed or processed.
 * @adr none
 * @requirements BUILD-VALIDATE-001, export-validation
 */

const fs = require('fs');
const path = require('path');

/**
 * Workspace root directories to scan for package.json files.
 * Aligned with pnpm-workspace.yaml globs. Each root is scanned recursively;
 * packages/config/* and packages/integrations/* are under packages/.
 */
const WORKSPACE_ROOTS = ['packages', 'clients', 'tooling'];

/**
 * Recursively finds all package.json files under a directory, excluding node_modules.
 * @param {string} dir - Directory to scan
 * @returns {string[]} Absolute paths to package.json files
 */
function findPackageJsonFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'package.json') {
        results.push(fullPath);
      }
    }
  }
  walk(dir);
  return results;
}

/**
 * Extracts all file path strings from an exports object.
 * Handles: simple "./path", conditional { "import": "./x", "require": "./y", "default": "./z" }
 * @param {string|object} value - Export target (string or conditional object)
 * @returns {string[]} Resolved path strings
 */
function extractExportPaths(value) {
  if (typeof value === 'string') return [value];
  if (value == null) return [];
  if (typeof value === 'object' && !Array.isArray(value)) {
    const paths = [];
    for (const v of Object.values(value)) {
      paths.push(...extractExportPaths(v));
    }
    return paths;
  }
  return [];
}

/**
 * Validates that all export targets in a package exist on disk.
 * @param {string} pkgJsonPath - Path to package.json
 * @param {object} pkg - Parsed package.json
 * @returns {{ valid: boolean; errors: Array<{ exportKey: string; target: string; resolvedPath: string }> }}
 */
function validatePackageExports(pkgJsonPath, pkg) {
  const errors = [];
  const exportsField = pkg.exports;
  if (!exportsField || typeof exportsField !== 'object' || Array.isArray(exportsField)) {
    return { valid: true, errors: [] };
  }

  const pkgDir = path.dirname(pkgJsonPath);

  for (const [exportKey, target] of Object.entries(exportsField)) {
    const paths = extractExportPaths(target);
    for (const relPath of paths) {
      // Skip non-path values (condition names like "node"/"import" can appear as values in nested structures)
      if (!relPath.startsWith('./')) continue;
      const resolvedPath = path.resolve(pkgDir, relPath);
      const stat = fs.existsSync(resolvedPath) ? fs.statSync(resolvedPath) : null;
      if (!stat) {
        errors.push({ exportKey, target: relPath, resolvedPath });
        continue;
      }
      if (!stat.isFile()) {
        errors.push({
          exportKey,
          target: relPath,
          resolvedPath,
          message: 'is a directory, not a file',
        });
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

function main() {
  const rootDir = process.cwd();
  const allPackageJson = [];
  for (const root of WORKSPACE_ROOTS) {
    const fullPath = path.join(rootDir, root);
    allPackageJson.push(...findPackageJsonFiles(fullPath));
  }

  let hasErrors = false;
  for (const pkgJsonPath of allPackageJson) {
    const content = fs.readFileSync(pkgJsonPath, 'utf8');
    let pkg;
    try {
      pkg = JSON.parse(content);
    } catch (e) {
      console.error(`✗ ${path.relative(rootDir, pkgJsonPath)}: Invalid JSON`);
      hasErrors = true;
      continue;
    }

    const { valid, errors } = validatePackageExports(pkgJsonPath, pkg);
    if (!valid) {
      hasErrors = true;
      const relPkg = path.relative(rootDir, pkgJsonPath);
      console.error(`\n✗ ${relPkg} (${pkg.name || 'unnamed'})`);
      for (const err of errors) {
        const msg = err.message
          ? `  - ${err.exportKey} → ${err.target} (${err.message})`
          : `  - ${err.exportKey} → ${err.target} (file not found)`;
        console.error(msg);
        console.error(`    Resolved: ${err.resolvedPath}`);
      }
    }
  }

  if (hasErrors) {
    console.error('\nExport validation failed. Fix broken export paths and re-run.');
    process.exit(1);
  }

  console.log('✔ All package.json exports resolve to existing files');
}

main();
