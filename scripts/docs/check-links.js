const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'coverage', '.next'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.md')) out.push(full);
  }
  return out;
}

const mdFiles = walk(root);
const linkRegex = /\[[^\]]+\]\(([^)]+)\)/g;

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(linkRegex)) {
    const link = match[1].trim();
    if (!link || link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('#')) continue;
    const clean = link.split('#')[0].split('?')[0];
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) failures.push(`${path.relative(root, file)} -> ${link}`);
  }
}

if (failures.length) {
  console.error('Broken local markdown links found:');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`Checked ${mdFiles.length} markdown files: no broken local links.`);
