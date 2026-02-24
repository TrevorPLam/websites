const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const typoMap = {
  teh: 'the',
  recieve: 'receive',
  seperate: 'separate',
  occured: 'occurred',
  accomodate: 'accommodate',
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'coverage', '.next'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.md')) out.push(full);
  }
  return out;
}

const files = walk(root);
const findings = [];
for (const file of files) {
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [typo, correction] of Object.entries(typoMap)) {
      const re = new RegExp(`\\b${typo}\\b`, 'i');
      if (re.test(line)) findings.push(`${rel}:${i + 1} contains '${typo}' (did you mean '${correction}'?)`);
    }
  });
}

if (findings.length) {
  console.error('Potential spelling issues found:');
  findings.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
}

console.log(`Checked ${files.length} markdown files: no common spelling mistakes detected.`);
