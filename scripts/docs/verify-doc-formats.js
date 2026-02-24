#!/usr/bin/env node

const { readdirSync, statSync } = require('node:fs');
const { join, extname } = require('node:path');

const allowed = new Set(['.md', '.mdx', '.txt', '.yml', '.yaml', '.sql']);
const roots = ['docs', '.github'];
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else {
      const ext = extname(full);
      if (ext && !allowed.has(ext)) violations.push(full);
    }
  }
}

for (const root of roots) {
  try { walk(root); } catch {}
}

if (violations.length > 0) {
  console.error('Found non-plain-text files in documentation scope:');
  for (const file of violations) console.error(` - ${file}`);
  process.exit(1);
}

console.log('Documentation format validation passed.');
