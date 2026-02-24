/**
 * @file scripts/track-code-metrics.js
 * @summary Generates repository code-metrics snapshots.
 * @description Collects file, line, comment-density, and unresolved marker metrics for reporting and CI artifacts.
 * @security low
 * @adr none
 * @requirements DOMAIN-37
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const SOURCE_ROOTS = ['clients', 'packages', 'scripts'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function walk(dirPath, collector) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.next', '.turbo', 'coverage'].includes(entry.name)) {
        return;
      }
      walk(fullPath, collector);
      return;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(extension)) {
        collector.push(fullPath);
      }
    }
  });
}

function getSourceFiles() {
  const files = [];

  SOURCE_ROOTS.forEach((root) => {
    if (fs.existsSync(root)) {
      walk(root, files);
    }
  });

  return files;
}

function collectMetrics(files) {
  let totalLines = 0;
  let commentLines = 0;
  let todoCount = 0;

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    totalLines += lines.length;
    commentLines += lines.filter((line) => /^\s*(\/\/|\*|\/\*|#)/.test(line)).length;
    todoCount += lines.filter((line) => /\b(TODO|FIXME|HACK)\b/i.test(line)).length;
  });

  const timestamp = new Date().toISOString();
  let commitSha = 'unknown';

  try {
    commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    // noop for non-git contexts
  }

  return {
    timestamp,
    commitSha,
    sourceFiles: files.length,
    totalLines,
    commentLines,
    commentDensity: totalLines > 0 ? Number((commentLines / totalLines).toFixed(4)) : 0,
    unresolvedMarkerCount: todoCount,
  };
}

function writeOutputs(metrics) {
  const outputDir = path.join('docs', 'quality', 'metrics');
  fs.mkdirSync(outputDir, { recursive: true });

  const baselinePath = path.join(outputDir, 'code-metrics-baseline.json');
  fs.writeFileSync(baselinePath, `${JSON.stringify(metrics, null, 2)}\n`, 'utf8');

  const markdownPath = path.join(outputDir, 'code-metrics-latest.md');
  const markdown = `# Code Metrics Snapshot\n\n- Timestamp: ${metrics.timestamp}\n- Commit: ${metrics.commitSha}\n- Source files: ${metrics.sourceFiles}\n- Total lines: ${metrics.totalLines}\n- Comment lines: ${metrics.commentLines}\n- Comment density: ${metrics.commentDensity}\n- Unresolved markers (TODO/FIXME/HACK): ${metrics.unresolvedMarkerCount}\n`;
  fs.writeFileSync(markdownPath, markdown, 'utf8');

  console.log(`✅ Wrote metrics to ${baselinePath} and ${markdownPath}`);
}

function main() {
  const sourceFiles = getSourceFiles();
  const metrics = collectMetrics(sourceFiles);
  writeOutputs(metrics);
}

main();
