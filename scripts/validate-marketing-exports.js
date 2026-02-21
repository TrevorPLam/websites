#!/usr/bin/env node
/**
 * validate-marketing-exports.js — @repo/marketing-components index.ts export validation
 *
 * Purpose: Ensures every export from packages/marketing-components/src/index.ts
 *          that targets ./family resolves to an existing file or directory with index.
 *
 * Usage: node scripts/validate-marketing-exports.js
 *        pnpm validate-marketing-exports
 *
 * Exit: 0 if all valid, 1 if any missing.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MC_INDEX = path.join(ROOT, 'packages/marketing-components/src/index.ts');
const MC_SRC = path.join(ROOT, 'packages/marketing-components/src');

function main() {
  const indexContent = fs.readFileSync(MC_INDEX, 'utf8');

  const re = /from\s+['"]\.\/([^'"]+)['"]/g;
  const families = new Set();
  let m;
  while ((m = re.exec(indexContent)) !== null) {
    families.add(m[1]);
  }

  const missing = [];

  for (const family of families) {
    const basePath = path.join(MC_SRC, family);
    const indexPath = path.join(basePath, 'index.ts');
    const indexTsxPath = path.join(basePath, 'index.tsx');
    const filePath = path.join(MC_SRC, `${family}.ts`);
    const fileTsxPath = path.join(MC_SRC, `${family}.tsx`);

    const exists =
      fs.existsSync(indexPath) ||
      fs.existsSync(indexTsxPath) ||
      fs.existsSync(filePath) ||
      fs.existsSync(fileTsxPath);

    if (!exists) {
      missing.push(family);
    }
  }

  if (missing.length > 0) {
    console.error(
      'validate-marketing-exports: ERROR — index.ts exports reference missing paths:\n'
    );
    missing.forEach((f) => console.error('  -', f));
    process.exit(1);
  }

  console.log('validate-marketing-exports: OK — all', families.size, 'export(s) resolve.');
  process.exit(0);
}

main();
