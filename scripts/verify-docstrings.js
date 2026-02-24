#!/usr/bin/env node
/**
 * @file scripts/verify-docstrings.js
 * @summary Validates staged JS/TS exports include nearby JSDoc/TSDoc docstrings.
 * @description Runs in pre-commit and checks exported symbols for adjacent docstring blocks.
 * @security No network access; reads staged local files only.
 * @adr none
 * @requirements DOMAIN-37-1-7, DOMAIN-37-1-8
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const SUPPORTED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const IGNORED_SEGMENTS = ['/__tests__/', '/tests/', '.test.', '.spec.', '.stories.', '/dist/', '/build/'];

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((filePath) => SUPPORTED_EXTENSIONS.has(path.extname(filePath)))
    .filter((filePath) => !IGNORED_SEGMENTS.some((segment) => filePath.includes(segment)));
}

function findExportLines(lines) {
  const exportMatchers = [
    /^export\s+(async\s+)?function\s+[A-Za-z0-9_$]+/,
    /^export\s+class\s+[A-Za-z0-9_$]+/,
    /^export\s+const\s+[A-Za-z0-9_$]+\s*=\s*(async\s*)?(\(|function)/,
  ];

  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => exportMatchers.some((matcher) => matcher.test(line.trim())));
}

function hasNearbyDocstring(lines, exportIndex) {
  let cursor = exportIndex - 1;
  while (cursor >= 0 && lines[cursor].trim() === '') {
    cursor -= 1;
  }

  if (cursor < 0 || !lines[cursor].trim().endsWith('*/')) {
    return false;
  }

  while (cursor >= 0 && !lines[cursor].includes('/**')) {
    if (lines[cursor].trim() === '') {
      cursor -= 1;
      continue;
    }

    if (!lines[cursor].trim().startsWith('*') && !lines[cursor].trim().endsWith('*/')) {
      return false;
    }
    cursor -= 1;
  }

  return cursor >= 0;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const exports = findExportLines(lines);

  return exports
    .filter(({ index }) => !hasNearbyDocstring(lines, index))
    .map(({ index, line }) => `${filePath}:${index + 1} missing docstring for export \`${line.trim()}\``);
}

function main() {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log('✅ Docstring verification skipped (no staged JS/TS files)');
    return;
  }

  const violations = stagedFiles.flatMap(validateFile);

  if (violations.length > 0) {
    console.error('❌ Docstring verification failed:');
    violations.forEach((violation) => console.error(`  - ${violation}`));
    console.error('\nSee docs/guides/best-practices/docstring-standards.md for required format.');
    process.exit(1);
  }

  console.log(`✅ Docstring verification passed for ${stagedFiles.length} staged file(s)`);
}

main();
