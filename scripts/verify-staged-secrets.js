#!/usr/bin/env node

/**
 * @file scripts/verify-staged-secrets.js
 * @summary Blocks commits when staged content includes likely secret literals.
 * @description Scans staged files for high-risk hardcoded secret patterns.
 * @security Prevents accidental credential leakage by detecting suspicious staged content before commit.
 * @adr none
 * @requirements DOMAIN-37-3-8, DOMAIN-37-3-9
 */

const { execSync } = require('node:child_process');

const SECRET_PATTERNS = [
  /api[_-]?key\s*[:=]\s*["'`][^"'`\s]{16,}["'`]/i,
  /secret\s*[:=]\s*["'`][^"'`\s]{12,}["'`]/i,
  /token\s*[:=]\s*["'`][^"'`\s]{16,}["'`]/i,
  /password\s*[:=]\s*["'`][^"'`\s]{8,}["'`]/i,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/,
];

const ALLOWED_PATH_PREFIXES = ['docs/guides/', 'docs/research/'];

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !ALLOWED_PATH_PREFIXES.some((prefix) => file.startsWith(prefix)));
}

function getStagedContent(filePath) {
  try {
    return execSync(`git show :${filePath}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function scan() {
  const files = getStagedFiles();
  const findings = [];

  files.forEach((filePath) => {
    const content = getStagedContent(filePath);
    if (!content) return;

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          findings.push({ filePath, line: index + 1, sample: line.trim().slice(0, 140) });
          break;
        }
      }
    });
  });

  if (findings.length > 0) {
    console.error('❌ Potential secrets detected in staged changes:');
    findings.forEach(({ filePath, line, sample }) => {
      console.error(` - ${filePath}:${line} -> ${sample}`);
    });
    console.error(
      '\nIf this is a false positive, replace the value with a redacted placeholder before committing.'
    );
    process.exit(1);
  }

  console.log('✅ No obvious staged secrets detected.');
}

scan();
