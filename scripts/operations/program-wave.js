#!/usr/bin/env node
/**
 * @file scripts/operations/program-wave.js
 * @role script
 * @summary Reports the status of tasks in a given development wave (0–3).
 *          Scans tasks/archive/ for completed tasks tagged with the wave
 *          and tasks/ for open tasks in the wave.
 *
 * @exports
 * - CLI: pnpm program:wave0  (--wave 0)
 *        pnpm program:wave1  (--wave 1)
 *        pnpm program:wave2  (--wave 2)
 *        pnpm program:wave3  (--wave 3)
 *
 * @invariants
 * - Read-only — does not modify any files.
 * - Exits 0 always (reporting-only command).
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// ─── Wave definitions ─────────────────────────────────────────────────────────

/**
 * Wave task prefixes / IDs.
 * Tasks are identified by their file name prefix (e.g., "0-" for wave 0).
 * Wave 0: infra/tooling fixes (0-x tasks)
 * Wave 1: Component/feature library (1-x, 2-x, f-x tasks)
 * Wave 2: Integration and client work (4-x, 5-x tasks)
 * Wave 3: Documentation and quality (6-x tasks)
 */
const WAVE_DEFINITIONS = {
  0: {
    name: 'Wave 0 — Infrastructure & Tooling',
    description: 'ESLint, TypeScript errors, CI quality gates, build pipeline fixes',
    prefixes: ['0-'],
  },
  1: {
    name: 'Wave 1 — Component & Feature Library',
    description: 'UI components, marketing components, feature modules, accessibility',
    prefixes: ['1-', '2-', 'f-', '3-'],
  },
  2: {
    name: 'Wave 2 — Integrations & Industry',
    description: 'Analytics, CRM, booking, email, chat integrations; industry schemas',
    prefixes: ['4-'],
  },
  3: {
    name: 'Wave 3 — Client Sites & Documentation',
    description: 'Starter template, client sites, migration guide, docs, CLI tooling',
    prefixes: ['5-', '6-'],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read markdown file content safely */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/** Get all task files in a directory matching wave prefixes */
function getTaskFiles(dir, prefixes) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.md') && prefixes.some((p) => name.startsWith(p)))
    .map((name) => ({
      name,
      path: path.join(dir, name),
      id: name.replace(/\.md$/, ''),
    }));
}

/** Extract task title from markdown (first H1 line) */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '(no title)';
}

/** Detect if a task file appears to be complete */
function isComplete(content) {
  return (
    content.includes('[x] COMPLETED') ||
    content.includes('[x] VERIFIED DONE') ||
    content.includes('**Status:** Completed')
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const waveArg = process.argv.findIndex((a) => a === '--wave');
const waveNum = waveArg >= 0 ? parseInt(process.argv[waveArg + 1] ?? '', 10) : NaN;

if (isNaN(waveNum) || !WAVE_DEFINITIONS[waveNum]) {
  console.error('Usage: pnpm program:wave<N> (where N is 0, 1, 2, or 3)');
  console.error('  or: node scripts/operations/program-wave.js --wave <N>');
  process.exit(1);
}

const wave = WAVE_DEFINITIONS[waveNum];
const { prefixes } = wave;

const tasksDir = path.join(ROOT, 'tasks');
const archiveDir = path.join(ROOT, 'tasks', 'archive');

const openTasks = getTaskFiles(tasksDir, prefixes);
const archivedTasks = getTaskFiles(archiveDir, prefixes);

// Also check ARCHIVE.md for any archived tasks not yet moved to archive/
const archiveMdContent = readFile(path.join(ROOT, 'ARCHIVE.md'));
const archiveMdTaskCount = (archiveMdContent.match(/^#{3,4}\s+/gm) ?? []).length;

console.log(`\n${BOLD}${BLUE}${wave.name}${RESET}`);
console.log(`${DIM}${wave.description}${RESET}\n`);

// ── Open tasks ────────────────────────────────────────────────────────────────

console.log(`${BOLD}Open tasks (${openTasks.length})${RESET}`);

if (openTasks.length === 0) {
  console.log(`  ${GREEN}✓ All tasks in this wave are complete${RESET}`);
} else {
  for (const task of openTasks) {
    const content = readFile(task.path);
    const title = extractTitle(content);
    const complete = isComplete(content);
    if (complete) {
      console.log(`  ${GREEN}✓${RESET} ${task.id}: ${title} ${DIM}(done, not yet archived)${RESET}`);
    } else {
      console.log(`  ${YELLOW}○${RESET} ${task.id}: ${title}`);
    }
  }
}

// ── Archived tasks ────────────────────────────────────────────────────────────

console.log(`\n${BOLD}Archived tasks (${archivedTasks.length} files)${RESET}`);

if (archivedTasks.length === 0 && archiveMdTaskCount === 0) {
  console.log(`  ${DIM}None yet${RESET}`);
} else {
  for (const task of archivedTasks) {
    const content = readFile(task.path);
    const title = extractTitle(content);
    console.log(`  ${GREEN}✓${RESET} ${task.id}: ${title}`);
  }
  if (archiveMdTaskCount > 0) {
    console.log(`  ${DIM}+ ${archiveMdTaskCount} tasks recorded in ARCHIVE.md${RESET}`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

const total = openTasks.length + archivedTasks.length;
const completePct = total > 0 ? Math.round((archivedTasks.length / total) * 100) : 0;

console.log(`\n${'─'.repeat(50)}`);
console.log(`${BOLD}Wave ${waveNum} progress:${RESET} ${archivedTasks.length}/${total} tasks archived (${completePct}%)`);

if (openTasks.length === 0 && archivedTasks.length > 0) {
  console.log(`${GREEN}Wave ${waveNum} COMPLETE${RESET}`);
} else if (openTasks.length > 0) {
  console.log(`${YELLOW}Wave ${waveNum} IN PROGRESS${RESET} — ${openTasks.length} task(s) remaining`);
} else {
  console.log(`${DIM}Wave ${waveNum} — no tasks found matching prefixes: ${prefixes.join(', ')}${RESET}`);
}

console.log();
process.exit(0);
