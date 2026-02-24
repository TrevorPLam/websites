/**
 * @file scripts/validate-fsd-architecture.mjs
 * @summary Validates required FSD slice folders across client source trees.
 * @security Read-only structural validation of local repository files.
 * @requirements GAP-CONFIG-002
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const requiredSlices = ['entities', 'features', 'shared'];
const clientsDir = 'clients';
const missing = [];

for (const client of await readdir(clientsDir, { withFileTypes: true })) {
  if (!client.isDirectory()) continue;
  const srcPath = join(clientsDir, client.name, 'src');
  try {
    const entries = await readdir(srcPath);
    for (const slice of requiredSlices) {
      if (!entries.includes(slice)) {
        missing.push(`${client.name}: missing src/${slice}`);
      }
    }
  } catch {
    continue;
  }
}

if (missing.length > 0) {
  console.error('FSD validation failed:\n' + missing.join('\n'));
  process.exit(1);
}

console.log('FSD validation passed for discovered client src slices.');
