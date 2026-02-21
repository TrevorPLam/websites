#!/usr/bin/env npx tsx
/**
 * @file scripts/health-check.ts
 * @role script
 * @summary Single `pnpm health` command — checks workspace structure, package integrity,
 *          and key invariants. Exits 0 if all checks pass, 1 if any fail.
 *
 * @exports
 * - CLI: pnpm health
 *
 * @invariants
 * - Does not modify any files; read-only checks only.
 * - Each check prints PASS or FAIL with a reason.
 * - Summary line at the end shows total pass/fail counts.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;
let warned = 0;

function pass(label: string): void {
  console.log(`  ${GREEN}✓${RESET} ${label}`);
  passed++;
}

function fail(label: string, reason: string): void {
  console.log(`  ${RED}✗${RESET} ${label}: ${reason}`);
  failed++;
}

function warn(label: string, reason: string): void {
  console.log(`  ${YELLOW}⚠${RESET} ${label}: ${reason}`);
  warned++;
}

function section(title: string): void {
  console.log(`\n${BOLD}${title}${RESET}`);
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(ROOT, relPath));
}

function readJson(relPath: string): Record<string, unknown> | null {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function checkWorkspaceFiles(): void {
  section('Workspace files');
  for (const f of ['package.json', 'pnpm-workspace.yaml', 'turbo.json', 'tsconfig.base.json']) {
    if (fileExists(f)) {
      pass(f);
    } else {
      fail(f, 'not found');
    }
  }
  for (const f of ['jest.config.js', 'jest.setup.js', 'knip.config.ts']) {
    if (fileExists(f)) {
      pass(f);
    } else {
      warn(f, 'not found (optional)');
    }
  }
}

function checkClients(): void {
  section('Client directories');
  const clientsDir = path.join(ROOT, 'clients');
  if (!fs.existsSync(clientsDir)) {
    fail('clients/', 'directory not found');
    return;
  }

  const clients = fs
    .readdirSync(clientsDir)
    .filter((n) => fs.statSync(path.join(clientsDir, n)).isDirectory());
  if (clients.length === 0) {
    warn('clients/', 'no client directories found');
    return;
  }

  for (const client of clients) {
    const cp = `clients/${client}`;
    const pkg = readJson(`${cp}/package.json`);
    if (!pkg) {
      fail(`${cp}/package.json`, 'missing');
      continue;
    }

    const name = pkg['name'] as string | undefined;
    if (!name?.startsWith('@clients/')) {
      fail(cp, `package name must start with @clients/ (got: ${String(name)})`);
    } else {
      pass(`${cp} (${name})`);
    }
    if (!fileExists(`${cp}/site.config.ts`))
      fail(`${cp}/site.config.ts`, 'missing — CaCA requires this file');
    if (!fileExists(`${cp}/next.config.js`) && !fileExists(`${cp}/next.config.ts`))
      fail(`${cp}/next.config`, 'missing');
    if (!fileExists(`${cp}/tsconfig.json`)) fail(`${cp}/tsconfig.json`, 'missing');
  }
}

function checkPackages(): void {
  section('Shared packages');
  const pkgs = [
    'packages/ui',
    'packages/utils',
    'packages/types',
    'packages/infra',
    'packages/features',
    'packages/marketing-components',
  ];
  for (const pkg of pkgs) {
    if (!fileExists(pkg)) {
      fail(pkg, 'directory not found');
      continue;
    }
    if (!readJson(`${pkg}/package.json`)) {
      fail(`${pkg}/package.json`, 'invalid');
      continue;
    }
    if (fileExists(`${pkg}/src/index.ts`) || fileExists(`${pkg}/src/index.tsx`)) {
      pass(pkg);
    } else {
      warn(pkg, 'no src/index.ts found');
    }
  }
}

function checkRootScripts(): void {
  section('Root package.json scripts');
  const pkg = readJson('package.json');
  if (!pkg) {
    fail('package.json', 'not found');
    return;
  }
  const scripts = (pkg['scripts'] as Record<string, string> | undefined) ?? {};
  for (const s of ['build', 'lint', 'type-check', 'test', 'format', 'validate-exports']) {
    if (scripts[s]) {
      pass(`scripts.${s}`);
    } else {
      fail(`scripts.${s}`, 'not defined');
    }
  }
}

function checkDocumentation(): void {
  section('Key documentation');
  const docs = [
    'CLAUDE.md',
    'README.md',
    'docs/architecture/README.md',
    'docs/configuration/site-config-reference.md',
    'docs/migration/template-to-client.md',
  ];
  for (const doc of docs) {
    if (!fileExists(doc)) {
      fail(doc, 'not found');
      continue;
    }
    const content = fs.readFileSync(path.join(ROOT, doc), 'utf-8');
    if (content.includes('# TODO:') && content.length < 100) {
      warn(doc, 'appears to be a stub');
    } else {
      pass(doc);
    }
  }
}

console.log(`${BOLD}marketing-websites health check${RESET}`);
console.log(`Root: ${ROOT}\n`);

checkWorkspaceFiles();
checkClients();
checkPackages();
checkRootScripts();
checkDocumentation();

console.log(`\n${'─'.repeat(50)}`);
console.log(
  `${BOLD}Results:${RESET}  ${GREEN}${passed} passed${RESET}  ${YELLOW}${warned} warnings${RESET}  ${failed > 0 ? RED : ''}${failed} failed${failed > 0 ? RESET : ''}`
);

if (failed > 0) {
  console.log(`\n${RED}Health check FAILED${RESET} — fix errors above and re-run.`);
  process.exit(1);
} else if (warned > 0) {
  console.log(`\n${YELLOW}Health check PASSED with warnings${RESET}`);
  process.exit(0);
} else {
  console.log(`\n${GREEN}Health check PASSED${RESET}`);
  process.exit(0);
}
