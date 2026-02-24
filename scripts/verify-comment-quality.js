/**
 * @file scripts/verify-comment-quality.js
 * @summary Validates source comment quality for staged/CI file sets.
 * @description Blocks low-context comments and unresolved task-marker comments that lack ticket references.
 * @security low
 * @adr none
 * @requirements DOMAIN-37
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');

const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts'];
const COMMENT_PREFIXES = ['//', '*', '#'];

function run(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function getChangedFiles() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--staged')) {
      return run('git diff --cached --name-only --diff-filter=ACMRTUXB')
        .split('\n')
        .filter(Boolean);
    }

    if (process.env.CI && process.env.GITHUB_BASE_REF) {
      const baseRef = process.env.GITHUB_BASE_REF;
      try {
        run(`git fetch --no-tags --depth=1 origin ${baseRef}`);
      } catch {
        // best effort fetch for local/emulated CI usage
      }

      return run(`git diff --name-only --diff-filter=ACMRTUXB origin/${baseRef}...HEAD`)
        .split('\n')
        .filter(Boolean);
    }

    return run('git diff --name-only --diff-filter=ACMRTUXB HEAD~1...HEAD')
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isSourceFile(filePath) {
  return SUPPORTED_EXTENSIONS.some((extension) => filePath.endsWith(extension));
}

function isCommentLine(trimmedLine) {
  return COMMENT_PREFIXES.some((prefix) => trimmedLine.startsWith(prefix));
}

function validateComment(trimmedLine) {
  const violations = [];

  const unresolvedMarkerMatch = trimmedLine.match(/\b(TODO|FIXME|HACK)\b/i);

  if (unresolvedMarkerMatch && !trimmedLine.includes('TODO|FIXME|HACK')) {
    const hasReference = /\b(TODO|FIXME|HACK)\(([A-Z]+-\d+|#[0-9]+)\):/i.test(trimmedLine);
    if (!hasReference) {
      violations.push(
        'Unresolved markers must use TODO(<ticket>): / FIXME(<ticket>): / HACK(<ticket>): format'
      );
    }
  }

  if (/\b(temp|temporary|quick fix|fix later|somehow)\b/i.test(trimmedLine)) {
    violations.push(
      'Avoid low-context comments; explain rationale and intended follow-up explicitly'
    );
  }

  return violations;
}

function inspectFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!isCommentLine(trimmed)) {
      return;
    }

    const lineViolations = validateComment(trimmed);
    lineViolations.forEach((violation) => {
      violations.push(`${filePath}:${index + 1} ${violation}`);
    });
  });

  return violations;
}

function main() {
  const changedFiles = getChangedFiles().filter(
    (filePath) => fs.existsSync(filePath) && isSourceFile(filePath)
  );

  if (changedFiles.length === 0) {
    console.log('✅ Comment quality verification skipped (no changed JS/TS files)');
    return;
  }

  const violations = changedFiles.flatMap(inspectFile);

  if (violations.length > 0) {
    console.error('❌ Comment quality verification failed:');
    violations.forEach((violation) => {
      console.error(`  - ${violation}`);
    });
    process.exit(1);
  }

  console.log(`✅ Comment quality verification passed for ${changedFiles.length} changed file(s)`);
}

main();
