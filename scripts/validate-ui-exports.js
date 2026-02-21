#!/usr/bin/env node
/**
 * validate-ui-exports.js — @repo/ui index.ts export validation
 *
 * Purpose: Ensures every export from packages/ui/src/index.ts that targets
 *          ./components/* resolves to an existing file. Prevents broken
 *          component exports after renames or deletions.
 *
 * Usage: node scripts/validate-ui-exports.js
 *        pnpm validate-ui-exports (if added to root package.json)
 *
 * Exit: 0 if all valid, 1 if any missing file.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const UI_INDEX = path.join(ROOT, 'packages/ui/src/index.ts');
const UI_COMPONENTS_DIR = path.join(ROOT, 'packages/ui/src/components');

function main() {
  const indexContent = fs.readFileSync(UI_INDEX, 'utf8');

  // Match: from './components/Foo' or from "./components/Foo"
  const re = /from\s+['"]\.\/components\/([^'"]+)['"]/g;
  const componentFiles = new Set();
  let m;
  while ((m = re.exec(indexContent)) !== null) {
    componentFiles.add(m[1]);
  }

  const missing = [];
  const checked = new Set();

  for (const name of componentFiles) {
    // Export can be ComponentName or ComponentName.tsx (we only have name without extension)
    const base = name.replace(/\.tsx?$/, '');
    if (checked.has(base)) continue;
    checked.add(base);

    const tsxPath = path.join(UI_COMPONENTS_DIR, `${base}.tsx`);
    const tsPath = path.join(UI_COMPONENTS_DIR, `${base}.ts`);
    if (!fs.existsSync(tsxPath) && !fs.existsSync(tsPath)) {
      missing.push(`${base}.tsx (or .ts)`);
    }
  }

  if (missing.length > 0) {
    console.error(
      'validate-ui-exports: ERROR — index.ts exports reference missing component files:\n'
    );
    missing.forEach((f) => console.error('  -', f));
    process.exit(1);
  }

  console.log(
    'validate-ui-exports: OK — all',
    checked.size,
    'component export(s) resolve to existing files.'
  );
  process.exit(0);
}

main();
