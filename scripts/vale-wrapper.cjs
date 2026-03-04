#!/usr/bin/env node
/**
 * @file scripts/vale-wrapper.cjs
 * @summary Cross-platform wrapper for the Vale prose linter.
 * @description Invokes Vale when available; silently skips on platforms where
 *   the bundled Windows binary cannot run. This allows lint-staged to include
 *   Vale checks without hard-failing on Linux/macOS CI runners.
 * @security Read-only static analysis; no secrets or runtime data touched.
 * @adr none
 * @requirements none
 */

'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const os = require('node:os');

const args = process.argv.slice(2);
const repoRoot = path.resolve(__dirname, '..');

// On Windows, use the bundled binary; on other platforms try system `vale`.
const isWindows = os.platform() === 'win32';
const valeBin = isWindows
  ? path.join(repoRoot, '.local', 'bin', 'vale.exe')
  : 'vale';

const result = spawnSync(valeBin, args, {
  stdio: 'inherit',
  cwd: repoRoot,
  shell: false,
});

if (result.error) {
  // vale not available on this platform — skip silently so CI doesn't fail.
  if (result.error.code === 'ENOENT') {
    process.exit(0);
  }
  console.error('[vale-wrapper] unexpected error:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
