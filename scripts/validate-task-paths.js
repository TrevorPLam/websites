#!/usr/bin/env node
/**
 * @file scripts/validate-task-paths.js
 * @role tooling
 * @summary Validates that file paths listed in task "Related Files" sections exist
 *          (or are explicitly marked "create" — those may not exist yet).
 *
 * Usage:
 *   node scripts/validate-task-paths.js           # all tasks/*.md
 *   node scripts/validate-task-paths.js --fix     # print suggested fixes
 *   node scripts/validate-task-paths.js tasks/0-1-populate-component-a11y-rubric.md
 *
 * Exit codes:
 *   0  — all "modify" / "verify" paths exist (or no paths found)
 *   1  — one or more "modify" / "verify" paths are missing
 *
 * @invariants
 *   - Lines with intent "create" are skipped (file may not exist yet)
 *   - Only paths under the monorepo root are checked
 *   - Relative paths in task files are resolved from the repo root
 */

'use strict';

const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flagFix = args.includes('--fix');
const taskArgs = args.filter((a) => !a.startsWith('--'));

// ─── Collect task files ───────────────────────────────────────────────────────
const TASKS_DIR = path.join(REPO_ROOT, 'tasks');

function collectTaskFiles() {
  if (taskArgs.length > 0) {
    return taskArgs.map((f) => path.resolve(f));
  }
  return fs
    .readdirSync(TASKS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(TASKS_DIR, f));
}

// ─── Parse Related Files section ─────────────────────────────────────────────
/**
 * Extract file entries from the "Related Files" section of a task markdown file.
 *
 * Expected line format (per tasks/prompt.md):
 *   - `path/to/file.ts` – <intent> – <description>
 *
 * intent is one of: create | modify | verify | delete | read (case-insensitive)
 *
 * Returns Array<{ rawPath: string, intent: string, line: number }>
 */
function parseRelatedFiles(content, filePath) {
  const entries = [];
  const lines = content.split('\n');

  let inRelatedFiles = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect section header (allow varying heading levels)
    if (/^#{1,4}\s+(Related Files|Files)/i.test(trimmed)) {
      inRelatedFiles = true;
      continue;
    }

    // Stop at next section header
    if (inRelatedFiles && /^#{1,4}\s+/.test(trimmed) && trimmed !== '') {
      inRelatedFiles = false;
      continue;
    }

    if (!inRelatedFiles) continue;

    // Match list items: `- \`path\` – intent – desc` or `- path – intent – desc`
    const match = trimmed.match(
      /^[-*]\s+`?([^`\s][^`]*?)`?\s+[–—-]\s+(\w+)/
    );
    if (!match) continue;

    const rawPath = match[1].trim();
    const intent = match[2].toLowerCase();

    // Skip if path looks like a placeholder "(Add file paths)" etc.
    if (rawPath.startsWith('(') || rawPath.includes('Add ')) continue;

    entries.push({ rawPath, intent, line: i + 1, taskFile: filePath });
  }

  return entries;
}

// ─── Resolve path relative to repo root ──────────────────────────────────────
function resolveEntryPath(rawPath) {
  // Already absolute
  if (path.isAbsolute(rawPath)) return rawPath;
  return path.join(REPO_ROOT, rawPath);
}

// ─── Suggest fix ─────────────────────────────────────────────────────────────
/**
 * If a path is missing, try common prefixes (packages/, clients/, scripts/, docs/)
 * and see whether just adding one of them resolves it.
 */
function suggestFix(rawPath) {
  const filename = path.basename(rawPath);
  const prefixes = ['packages/', 'clients/', 'scripts/', 'docs/', 'tooling/'];
  for (const prefix of prefixes) {
    const candidate = path.join(REPO_ROOT, prefix, rawPath);
    if (fs.existsSync(candidate)) {
      return `${prefix}${rawPath}`;
    }
    // Also try with just the filename
    const candidate2 = path.join(REPO_ROOT, prefix, filename);
    if (fs.existsSync(candidate2)) {
      return `${prefix}${filename}`;
    }
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const taskFiles = collectTaskFiles();

  if (taskFiles.length === 0) {
    console.log('No task files found.');
    process.exit(0);
  }

  let totalChecked = 0;
  let totalMissing = 0;
  const missingEntries = [];

  for (const taskFile of taskFiles) {
    let content;
    try {
      content = fs.readFileSync(taskFile, 'utf8');
    } catch {
      console.warn(`⚠  Cannot read ${taskFile}`);
      continue;
    }

    const entries = parseRelatedFiles(content, taskFile);

    for (const entry of entries) {
      const { rawPath, intent, line, taskFile: tf } = entry;

      // "create" intent → file may not exist yet — skip existence check
      if (intent === 'create') continue;

      totalChecked++;
      const resolved = resolveEntryPath(rawPath);
      const exists = fs.existsSync(resolved);

      if (!exists) {
        totalMissing++;
        const suggestion = flagFix ? suggestFix(rawPath) : null;
        missingEntries.push({ rawPath, intent, line, taskFile: tf, suggestion });
      }
    }
  }

  // ─── Report ───────────────────────────────────────────────────────────────
  if (totalMissing === 0) {
    console.log(
      `✔  validate-task-paths: ${totalChecked} paths checked across ${taskFiles.length} task files — all present.`
    );
    process.exit(0);
  }

  console.error(
    `✖  validate-task-paths: ${totalMissing} missing path(s) found (${totalChecked} checked across ${taskFiles.length} task files):\n`
  );

  // Group by task file for readability
  const byTask = {};
  for (const entry of missingEntries) {
    const rel = path.relative(REPO_ROOT, entry.taskFile);
    if (!byTask[rel]) byTask[rel] = [];
    byTask[rel].push(entry);
  }

  for (const [taskRel, entries] of Object.entries(byTask)) {
    console.error(`  ${taskRel}`);
    for (const { rawPath, intent, line, suggestion } of entries) {
      const fix = suggestion ? `  → did you mean: ${suggestion}` : '';
      console.error(`    line ${line}: [${intent}] ${rawPath}${fix}`);
    }
    console.error('');
  }

  process.exit(1);
}

main();
