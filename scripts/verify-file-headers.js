#!/usr/bin/env node
/**
 * @file scripts/verify-file-headers.js
 * @summary Validates staged JS/TS files include required metadata header tags.
 * @description Runs in pre-commit and blocks commits when required file header tags are missing.
 * @security No network access or secret handling; reads staged local files only.
 * @adr none
 * @requirements DOMAIN-37-1-1, DOMAIN-37-1-2
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const HEADER_REQUIRED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const HEADER_TAGS = ['@file', '@summary', '@security', '@requirements'];

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
  });

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((filePath) => HEADER_REQUIRED_EXTENSIONS.has(path.extname(filePath)));
}

function hasRequiredHeader(fileContent) {
  const headerMatch = fileContent.match(/\/\*\*[\s\S]*?\*\//);
  if (!headerMatch) {
    return { ok: false, reason: 'missing JSDoc-style header block at top of file' };
  }

  const headerBlock = headerMatch[0];
  const missingTag = HEADER_TAGS.find((tag) => !headerBlock.includes(tag));
  if (missingTag) {
    return { ok: false, reason: `missing required header tag ${missingTag}` };
  }

  const startsNearTop = fileContent.indexOf(headerBlock) < 200;
  if (!startsNearTop) {
    return { ok: false, reason: 'header exists but is not near file start' };
  }

  return { ok: true };
}

function main() {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log('✅ Header verification skipped (no staged JS/TS files)');
    return;
  }

  const violations = [];

  for (const filePath of stagedFiles) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const result = hasRequiredHeader(content);

    if (!result.ok) {
      violations.push(`${filePath}: ${result.reason}`);
    }
  }

  if (violations.length > 0) {
    console.error('❌ File header verification failed:');
    for (const violation of violations) {
      console.error(`  - ${violation}`);
    }
    console.error('\nUse template: docs/guides/best-practices/file-header-template.md');
    process.exit(1);
  }

  console.log(`✅ Header verification passed for ${stagedFiles.length} staged file(s)`);
}

main();
