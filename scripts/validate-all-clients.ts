#!/usr/bin/env npx tsx
/**
 * @file scripts/validate-all-clients.ts
 * @role script
 * @summary Validates all client directories in clients/ via validateClient.
 *
 * @exports
 * - CLI: pnpm validate-all-clients
 *
 * @invariants
 * - Exits 0 if all clients pass, 1 if any fail.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */

import fs from 'fs';
import path from 'path';
import { validateClient } from './validate-client';

const ROOT = path.resolve(process.cwd());
const CLIENTS_DIR = path.join(ROOT, 'clients');

function getClientDirs(): string[] {
  if (!fs.existsSync(CLIENTS_DIR)) return [];
  return fs
    .readdirSync(CLIENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(CLIENTS_DIR, e.name));
}

function main(): number {
  const dirs = getClientDirs();
  if (dirs.length === 0) {
    console.log('No client directories found in clients/');
    return 0;
  }

  let anyFailed = false;
  for (const dir of dirs) {
    const rel = path.relative(ROOT, dir);
    const result = validateClient(rel, ROOT, { silent: false });
    if (!result.ok) {
      anyFailed = true;
    }
  }
  return anyFailed ? 1 : 0;
}

const code = main();
process.exit(code);
