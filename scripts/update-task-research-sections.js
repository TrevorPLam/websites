#!/usr/bin/env node
/**
 * One-off: Replace "Derived from Related Research" with dated, resolvable research block.
 * Run from repo root: node scripts/update-task-research-sections.js
 */
const fs = require('fs');
const path = require('path');

const TASKS_DIR = path.join(__dirname, '..', 'tasks');
const SKIP = new Set(['prompt.md', 'c-1-c-18-d-1-d-8.md', '6-10b-health-check.md', '6-10c-program-wave.md', 'RESEARCH-INVENTORY.md', '0-1-populate-component-a11y-rubric.md']);

const REPLACEMENT = `- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.`;

const files = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md') && !SKIP.has(f));
let count = 0;
for (const file of files) {
  const filePath = path.join(TASKS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const pattern = /^- \*\*Derived from Related Research\*\*[^\n]+\n/m;
  if (pattern.test(content)) {
    content = content.replace(pattern, REPLACEMENT + '\n');
    fs.writeFileSync(filePath, content);
    count++;
  }
}
console.log('Updated', count, 'task files.');
