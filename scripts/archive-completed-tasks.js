#!/usr/bin/env node
/**
 * Archives completed tasks from TODO.md to ARCHIVE.md.
 * - Moves all [x] COMPLETED task blocks to ARCHIVE.md
 * - Rebuilds TODO.md with only open tasks
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODO_PATH = path.join(ROOT, 'TODO.md');
const ARCHIVE_PATH = path.join(ROOT, 'ARCHIVE.md');

const content = fs.readFileSync(TODO_PATH, 'utf8');
const lines = content.split('\n');

// Find Reference Material section (everything from there stays as-is in TODO)
const refMaterialStart = lines.findIndex((l) => l.trim() === '# Reference Material');
const preambleEnd = 155; // Lines 1-154 are preamble (0-indexed: 0-153), 154 is # NOW
const referenceMaterial = refMaterialStart >= 0 ? lines.slice(refMaterialStart).join('\n') : '';

// Split content: preamble (1-154), task section (155 to refMaterialStart-1), reference
const preamble = lines.slice(0, preambleEnd).join('\n');
const taskSection = refMaterialStart >= 0 ? lines.slice(preambleEnd, refMaterialStart) : lines.slice(preambleEnd);

// Parse task blocks - each block starts with #### and goes until next #### or ## or ---
function parseTaskBlocks(sectionLines) {
  const blocks = [];
  let i = 0;
  while (i < sectionLines.length) {
    const line = sectionLines[i];
    if (line.match(/^#### \d|^#### [A-Z]|^#### [D-F]/)) {
      const start = i;
      let end = sectionLines.length;
      for (let j = i + 1; j < sectionLines.length; j++) {
        if (sectionLines[j].match(/^#### |^## [^#]|^# [A-Z]/)) {
          end = j;
          break;
        }
      }
      const blockLines = sectionLines.slice(start, end);
      const blockText = blockLines.join('\n');
      const isCompleted = /\*\*Status:\*\* \[x\] COMPLETED/.test(blockText);
      const taskIdMatch = line.match(/^#### ([\d.]+\s|[A-Z]\.[\d]+\s|[D-F]\.[\d]+\s)/);
      const taskId = taskIdMatch ? taskIdMatch[1].trim() : null;
      blocks.push({ start: start, end: end, lines: blockLines, text: blockText, completed: isCompleted, taskId, rawFirstLine: line });
      i = end;
    } else {
      i++;
    }
  }
  return blocks;
}

// Get structural lines (##, ###, ---, > blockquotes) that are between task blocks
function getStructuralContent(sectionLines, excludeRanges) {
  const result = [];
  const excludeSet = new Set();
  for (const r of excludeRanges) {
    for (let i = r.start; i < r.end; i++) excludeSet.add(i);
  }
  let i = 0;
  while (i < sectionLines.length) {
    if (excludeSet.has(i)) {
      i++;
      continue;
    }
    const line = sectionLines[i];
    if (line.match(/^## |^### |^---$|^> |^>\s*$/) || line.trim() === '' ||
        (line.startsWith('All tasks in') || line.startsWith('These tasks') || line.startsWith('These are'))) {
      result.push(line);
      i++;
    } else {
      result.push(line);
      i++;
    }
  }
  return result;
}

// Parse blocks from task section
const allBlocks = [];
let i = 0;
const taskSectionText = taskSection.join('\n');
const blockRegex = /^#### (.+)$/gm;
let match;
const blockStarts = [];
while ((match = blockRegex.exec(taskSectionText)) !== null) {
  const lineNum = taskSectionText.slice(0, match.index).split('\n').length - 1;
  blockStarts.push({ index: lineNum, title: match[1] });
}

// Build blocks with content
const completedBlocks = [];
const openBlocks = [];
const archivedTaskIds = new Set();

for (let b = 0; b < blockStarts.length; b++) {
  const blockStart = blockStarts[b].index;
  const blockEnd = b + 1 < blockStarts.length ? blockStarts[b + 1].index : taskSection.length;
  const blockLines = taskSection.slice(blockStart, blockEnd);
  const blockText = blockLines.join('\n');
  const isCompleted = /\*\*Status:\*\* \[x\] COMPLETED/.test(blockText);
  const taskIdMatch = blockStarts[b].title.match(/^([\d.]+|[A-Z]\.[\d]+|[D-F]\.[\d]+)/);
  const taskId = taskIdMatch ? taskIdMatch[1] : blockStarts[b].title.split(' ')[0];

  if (isCompleted) {
    if (!archivedTaskIds.has(taskId)) {
      archivedTaskIds.add(taskId);
      completedBlocks.push(blockText);
    }
  } else {
    openBlocks.push({ start: blockStart, end: blockEnd, lines: blockLines, text: blockText });
  }
}

// Build TODO task section: structural headers + open task blocks only
// We need to preserve section structure: ## Wave 0, ### Batch A, etc.
// and only include open tasks. For sections that become empty, add a note.

const sectionHeaders = [];
let lastHeaderLine = -1;
const openRanges = openBlocks.map((b) => ({ start: b.start, end: b.end }));

// Build new task section: iterate through and keep structural elements + open blocks
const newTaskSectionLines = [];
let pos = 0;
const openBlockStarts = new Set(openBlocks.map((b) => b.start));

while (pos < taskSection.length) {
  const line = taskSection[pos];
  const isTaskBlockStart = line.match(/^#### (\d|[A-Z]|[D-F])/);
  const isStruct = line.match(/^# |^---$|^> |^>\s*$/) || (line.trim() !== '' && !isTaskBlockStart && pos < (taskSection.findIndex((l, i) => l.match(/^#### /) && i > pos) ?? taskSection.length));

  if (isTaskBlockStart) {
    const blockStart = pos;
    let blockEnd = pos + 1;
    while (blockEnd < taskSection.length && !taskSection[blockEnd].match(/^#### |^## [^#]|^# [A-Z]/)) blockEnd++;
    const blockText = taskSection.slice(blockStart, blockEnd).join('\n');
    const isCompleted = /\*\*Status:\*\* \[x\] COMPLETED/.test(blockText);
    if (!isCompleted) {
      newTaskSectionLines.push(...taskSection.slice(blockStart, blockEnd));
    }
    pos = blockEnd;
    continue;
  }

  if (line.match(/^## |^### /) || line.match(/^---$/) || (line.trim() === '' && pos > 0 && newTaskSectionLines.length > 0)) {
    newTaskSectionLines.push(line);
    pos++;
    continue;
  }

  if (line.match(/^> /) || line.startsWith('All tasks in') || line.startsWith('These tasks') || line.startsWith('These are') || (line.trim() === '' && pos < taskSection.length)) {
    newTaskSectionLines.push(line);
    pos++;
    continue;
  }

  pos++;
}

// Remove trailing structural content that leads to empty sections
// For Wave 0 and Wave 1 - all tasks completed - replace with a note
const wave0Start = newTaskSectionLines.findIndex((l) => l.includes('Wave 0: Repo Integrity'));
const wave1Start = newTaskSectionLines.findIndex((l) => l.includes('Wave 1: Config + Feature Spine'));

// Simpler: rebuild from scratch based on what we need
// New approach: take the task section, remove completed blocks, collapse empty sections
let rebuiltTaskSection = [];
let inWave0 = false;
let inWave1 = false;
let wave0HasOpen = false;
let wave1HasOpen = false;

pos = 0;
while (pos < taskSection.length) {
  const line = taskSection[pos];
  if (line.includes('Wave 0: Repo Integrity')) inWave0 = true;
  if (line.includes('Wave 1: Config + Feature Spine')) { inWave0 = false; inWave1 = true; }
  if (line.includes('UI Primitives Completion')) inWave1 = false;

  const isTaskBlockStart = line.match(/^#### (\d|[A-Z]|[D-F])/);
  if (isTaskBlockStart) {
    let blockEnd = pos + 1;
    while (blockEnd < taskSection.length && !taskSection[blockEnd].match(/^#### |^## [^#]|^# [A-Z]/)) blockEnd++;
    const blockText = taskSection.slice(pos, blockEnd).join('\n');
    const isCompleted = /\*\*Status:\*\* \[x\] COMPLETED/.test(blockText);
    if (!isCompleted) {
      if (inWave0) wave0HasOpen = true;
      if (inWave1) wave1HasOpen = true;
      rebuiltTaskSection.push(...taskSection.slice(pos, blockEnd));
    }
    pos = blockEnd;
    continue;
  }

  rebuiltTaskSection.push(line);
  pos++;
}

// Add "all completed" notes for Wave 0 and Wave 1
let finalTaskSection = [];
let skipUntilNextSection = false;
pos = 0;
while (pos < rebuiltTaskSection.length) {
  const line = rebuiltTaskSection[pos];
  if (line.match(/^## Wave 0:/)) {
    finalTaskSection.push('## Wave 0: Repo Integrity (Day 0-2) — COMPLETED');
    finalTaskSection.push('');
    finalTaskSection.push('> All Wave 0 tasks completed. See [ARCHIVE.md](ARCHIVE.md) for full records.');
    finalTaskSection.push('');
    finalTaskSection.push('---');
    finalTaskSection.push('');
    skipUntilNextSection = true;
    pos++;
    continue;
  }
  if (line.match(/^## Wave 1:/)) {
    finalTaskSection.push('## Wave 1: Config + Feature Spine (Day 2-6) — COMPLETED');
    finalTaskSection.push('');
    finalTaskSection.push('> All Wave 1 tasks completed. See [ARCHIVE.md](ARCHIVE.md) for full records.');
    finalTaskSection.push('');
    finalTaskSection.push('---');
    finalTaskSection.push('');
    skipUntilNextSection = true;
    pos++;
    continue;
  }
  if (skipUntilNextSection) {
    if (line.match(/^## [^#]/) || line.match(/^# [A-Z]/)) {
      skipUntilNextSection = false;
      finalTaskSection.push(line);
    }
    pos++;
    continue;
  }
  finalTaskSection.push(line);
  pos++;
}

// Remove duplicate empty lines and excessive ---
const cleanedTaskSection = finalTaskSection.join('\n')
  .replace(/\n{4,}/g, '\n\n\n')
  .replace(/(---\n){3,}/g, '---\n\n');

// Build ARCHIVE addition - full task records
const fullTaskRecordsSection = `
## Full Task Records (Moved from TODO 2026-02-17)

Complete task documentation for all 47 completed tasks, moved from TODO.md to maintain historical record.

---

${completedBlocks.join('\n\n---\n\n')}

---

`;

// Read current ARCHIVE
const archiveContent = fs.readFileSync(ARCHIVE_PATH, 'utf8');

// Replace brief summaries with note, then append full records
// Per plan: Append full task records. Update summary.
const updatedArchive = archiveContent
  .replace(/\*\*Total Completed Tasks:\*\* \d+/, '**Total Completed Tasks:** 47')
  .replace(/\*\*Last Updated:\*\* [^\n]+/, '**Last Updated:** February 17, 2026')
  .replace(/\n---\s*\n\s*\*This archive serves/, fullTaskRecordsSection + '\n*This archive serves');

// Write ARCHIVE
fs.writeFileSync(ARCHIVE_PATH, updatedArchive, 'utf8');

// Build new TODO
const newTodo = preamble + '\n\n' + cleanedTaskSection.trim() + '\n\n' + referenceMaterial;
fs.writeFileSync(TODO_PATH, newTodo, 'utf8');

console.log('Archived', completedBlocks.length, 'completed tasks to ARCHIVE.md');
console.log('TODO.md updated with only open tasks');
