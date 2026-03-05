#!/usr/bin/env node
/**
 * @file scripts/verify-memory-json.js
 * @summary CI verification: checks that mcp/config/memory.json version strings match
 *   the actual pinned dependency versions in pnpm-workspace.yaml catalog.
 * @description Parses the catalog versions from pnpm-workspace.yaml and compares them
 *   against the "tech_stack" field in mcp/config/memory.json to detect drift.
 *   Exits with code 1 if any version mismatch or malformed version string is found.
 * @requirements TODO.md 5-B: Add CI verification step to keep memory.json synchronized
 */

'use strict';

const { readFileSync } = require('fs');
const { resolve } = require('path');

const ROOT = resolve(__dirname, '..');

/** Parse a simple YAML key: value pair from raw YAML text. */
function parseYamlKeyValue(content, key) {
  // Escape all regex metacharacters in the key to prevent ReDoS
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^\\s+['"]?${escapedKey}['"]?:\\s+['"]?([^'"\\n#]+)['"]?`, 'm');
  const match = regex.exec(content);
  return match ? match[1].trim() : null;
}

function main() {
  const errors = [];

  // ── Read memory.json ─────────────────────────────────────────────────────
  const memoryPath = resolve(ROOT, 'mcp/config/memory.json');
  let memory;
  try {
    memory = JSON.parse(readFileSync(memoryPath, 'utf-8'));
  } catch (err) {
    console.error(`❌ Cannot read ${memoryPath}: ${err.message}`);
    process.exit(1);
  }

  const techStack = memory && memory.memory && memory.memory.key_patterns
    ? memory.memory.key_patterns.tech_stack
    : '';
  if (!techStack) {
    console.error('❌ memory.json is missing memory.key_patterns.tech_stack');
    process.exit(1);
  }

  // ── Read pnpm-workspace.yaml ─────────────────────────────────────────────
  const workspacePath = resolve(ROOT, 'pnpm-workspace.yaml');
  let workspaceContent;
  try {
    workspaceContent = readFileSync(workspacePath, 'utf-8');
  } catch (err) {
    console.error(`❌ Cannot read ${workspacePath}: ${err.message}`);
    process.exit(1);
  }

  // ── Extract catalog versions ──────────────────────────────────────────────
  const catalogVersions = {
    'next': parseYamlKeyValue(workspaceContent, 'next'),
    'react': parseYamlKeyValue(workspaceContent, 'react'),
    'typescript': parseYamlKeyValue(workspaceContent, 'typescript'),
    'turbo': parseYamlKeyValue(workspaceContent, 'turbo'),
  };

  console.log('📋 Catalog versions from pnpm-workspace.yaml:');
  for (const [pkg, ver] of Object.entries(catalogVersions)) {
    console.log(`   ${pkg}: ${ver !== null ? ver : '(not found)'}`);
  }

  console.log('\n📋 tech_stack string from memory.json:');
  console.log(`   ${techStack}`);

  // ── Check Next.js version ─────────────────────────────────────────────────
  if (catalogVersions.next) {
    const catalogNext = catalogVersions.next.replace(/^[^0-9]*/, '');
    const memoryNextMatch = /Next\.js\s+([\d.]+)/i.exec(techStack);
    if (!memoryNextMatch) {
      errors.push('memory.json tech_stack does not mention Next.js version');
    } else {
      const memoryNext = memoryNextMatch[1];
      const catalogMajor = catalogNext.split('.')[0];
      const memoryMajor = memoryNext.split('.')[0];
      if (catalogMajor !== memoryMajor) {
        errors.push(
          `Next.js major version mismatch: catalog=${catalogNext}, memory.json=${memoryNext}`
        );
      }
    }
  }

  // ── Check React version ───────────────────────────────────────────────────
  if (catalogVersions.react) {
    const catalogReact = catalogVersions.react.replace(/^[^0-9]*/, '');
    const memoryReactMatch = /React\s+([\d.]+)/i.exec(techStack);
    if (!memoryReactMatch) {
      errors.push('memory.json tech_stack does not mention React version');
    } else {
      const memoryReact = memoryReactMatch[1];
      const catalogMajor = catalogReact.split('.')[0];
      const memoryMajor = memoryReact.split('.')[0];
      if (catalogMajor !== memoryMajor) {
        errors.push(
          `React major version mismatch: catalog=${catalogReact}, memory.json=${memoryReact}`
        );
      }
    }
  }

  // ── Check TypeScript version ──────────────────────────────────────────────
  if (catalogVersions.typescript) {
    const catalogTs = catalogVersions.typescript.replace(/^[^0-9]*/, '');
    const memoryTsMatch = /TypeScript\s+([\d.]+)/i.exec(techStack);
    if (!memoryTsMatch) {
      errors.push('memory.json tech_stack does not mention TypeScript version');
    } else {
      const memoryTs = memoryTsMatch[1];
      const catalogMajor = catalogTs.split('.')[0];
      const memoryMajor = memoryTs.split('.')[0];
      if (catalogMajor !== memoryMajor) {
        errors.push(
          `TypeScript major version mismatch: catalog=${catalogTs}, memory.json=${memoryTs}`
        );
      }
    }
  }

  // ── Report results ─────────────────────────────────────────────────────────
  if (errors.length > 0) {
    console.error('\n❌ memory.json version drift detected:');
    for (const e of errors) {
      console.error(`   • ${e}`);
    }
    console.error('\nPlease update mcp/config/memory.json to match pnpm-workspace.yaml catalog.');
    process.exit(1);
  }

  console.log('\n✅ memory.json versions are in sync with pnpm-workspace.yaml catalog.');
}

main();
