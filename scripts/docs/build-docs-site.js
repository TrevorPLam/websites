#!/usr/bin/env node

const { mkdirSync, writeFileSync, readdirSync, statSync, readFileSync } = require('node:fs');
const { join, relative } = require('node:path');

const DOCS_DIR = 'docs';
const OUT_DIR = 'docs/dist';

function listMarkdown(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'dist' || entry === 'node_modules') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) listMarkdown(full, files);
    else if (full.endsWith('.md')) files.push(full);
  }
  return files;
}

function escapeHtml(str) {
  return str.replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

mkdirSync(OUT_DIR, { recursive: true });
const files = listMarkdown(DOCS_DIR);
const links = files
  .map(file => {
    const rel = relative('.', file);
    return `<li><a href="https://github.com/${'{owner}'}/${'{repo}'}/blob/main/${rel}">${rel}</a></li>`;
  })
  .join('\n');

const indexHtml = `<!doctype html>
<html><head><meta charset="utf-8"/><title>Documentation Index</title></head>
<body>
<h1>Documentation Index</h1>
<p>Generated static documentation portal.</p>
<ul>${links}</ul>
</body></html>`;

writeFileSync(join(OUT_DIR, 'index.html'), indexHtml);
writeFileSync(join(OUT_DIR, 'README.txt'), `Generated ${new Date().toISOString()}\nFiles: ${files.length}\n`);
console.log(`Built docs site with ${files.length} markdown files.`);
