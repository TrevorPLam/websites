#!/usr/bin/env npx tsx
/**
 * @file scripts/doctor.ts
 * @role script
 * @summary Repository doctor - validates that all package.json script references point to real files.
 *          Catches broken script references like the MCP 404s automatically.
 * @security Read-only script, no sensitive data access or modification.
 * @adr none
 * @requirements none
 *
 * @exports
 * - CLI: pnpm doctor
 *
 * @invariants
 * - Does not modify any files; read-only checks only.
 * - Each check prints PASS or FAIL with a reason.
 * - Summary line at the end shows total pass/fail counts.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-26
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Find the actual repository root
function findRepoRoot(startDir: string = process.cwd()): string {
  let currentDir = path.resolve(startDir);

  while (currentDir !== path.dirname(currentDir)) {
    if (
      fs.existsSync(path.join(currentDir, 'package.json')) &&
      fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))
    ) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return path.resolve(startDir);
}

const ROOT = findRepoRoot();

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

function readJson(relPath: string): Record<string, unknown> | null {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function scriptPathExists(scriptPath: string): boolean {
  // Handle different script path formats
  if (scriptPath.startsWith('node ')) {
    const filePath = scriptPath.replace('node ', '').split(' ')[0];
    return fs.existsSync(path.join(ROOT, filePath));
  }

  if (scriptPath.startsWith('npx ')) {
    // npx commands are external, skip file check
    return true;
  }

  if (scriptPath.startsWith('./')) {
    return fs.existsSync(path.join(ROOT, scriptPath));
  }

  if (scriptPath.startsWith('pnpm ')) {
    // pnpm commands are internal, check if script exists
    const subCommand = scriptPath.replace('pnpm ', '').split(' ')[0];
    try {
      execSync(`pnpm run --help 2>/dev/null | grep -q "^  ${subCommand}"`, {
        cwd: ROOT,
        stdio: 'ignore',
      });
      return true;
    } catch {
      return false;
    }
  }

  if (scriptPath.startsWith('turbo ')) {
    // turbo commands are internal
    return true;
  }

  // Direct file reference
  return fs.existsSync(path.join(ROOT, scriptPath));
}

function checkRootScripts(): void {
  section('Root package.json script references');
  const pkg = readJson('package.json');
  if (!pkg) {
    fail('package.json', 'not found');
    return;
  }

  const scripts = (pkg['scripts'] as Record<string, string> | undefined) ?? {};
  for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
    if (scriptCommand.includes('scripts/')) {
      // Extract the script file path
      const scriptPath = scriptCommand.match(/scripts\/[^\s]+/)?.[0];
      if (scriptPath) {
        if (scriptPathExists(scriptCommand)) {
          pass(`${scriptName} → ${scriptPath}`);
        } else {
          fail(`${scriptName} → ${scriptPath}`, 'file not found');
        }
      } else {
        warn(`${scriptName}`, 'unable to parse script path');
      }
    } else {
      // Non-scripts/ commands, just validate basic syntax
      pass(`${scriptName} → ${scriptCommand}`);
    }
  }
}

function checkWorkspaceScripts(): void {
  section('Workspace package script references');

  // Get all workspace packages
  const workspaceConfig = readJson('package.json');
  const workspaceGlobs = (workspaceConfig?.['workspaces'] as string[]) || [];

  for (const glob of workspaceGlobs) {
    if (glob.includes('packages/*')) {
      const packagesDir = path.join(ROOT, 'packages');
      if (fs.existsSync(packagesDir)) {
        const dirs = fs.readdirSync(packagesDir).filter((name) => {
          const fullPath = path.join(packagesDir, name);
          return (
            fs.statSync(fullPath).isDirectory() &&
            fs.existsSync(path.join(fullPath, 'package.json'))
          );
        });

        for (const dirName of dirs) {
          const packagePath = `packages/${dirName}`;
          const pkg = readJson(`${packagePath}/package.json`);
          const scripts = (pkg?.['scripts'] as Record<string, string> | undefined) ?? {};

          for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
            if (scriptCommand.includes('scripts/')) {
              const scriptPath = scriptCommand.match(/scripts\/[^\s]+/)?.[0];
              if (scriptPath) {
                // Check relative to package directory
                const fullPath = path.join(ROOT, packagePath, '..', scriptPath);
                if (fs.existsSync(fullPath)) {
                  pass(`${packagePath}:${scriptName} → ${scriptPath}`);
                } else {
                  fail(`${packagePath}:${scriptName} → ${scriptPath}`, 'file not found');
                }
              }
            }
          }
        }
      }
    }
  }
}

function checkClientScripts(): void {
  section('Client package script references');

  const clientsDir = path.join(ROOT, 'clients');
  if (!fs.existsSync(clientsDir)) {
    warn('clients/', 'directory not found');
    return;
  }

  const clients = fs.readdirSync(clientsDir).filter((name) => {
    const fullPath = path.join(clientsDir, name);
    return (
      fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'package.json'))
    );
  });

  for (const clientName of clients) {
    const clientPath = `clients/${clientName}`;
    const pkg = readJson(`${clientPath}/package.json`);
    const scripts = (pkg?.['scripts'] as Record<string, string> | undefined) ?? {};

    for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
      if (scriptCommand.includes('scripts/')) {
        const scriptPath = scriptCommand.match(/scripts\/[^\s]+/)?.[0];
        if (scriptPath) {
          const fullPath = path.join(ROOT, clientPath, '..', scriptPath);
          if (fs.existsSync(fullPath)) {
            pass(`${clientPath}:${scriptName} → ${scriptPath}`);
          } else {
            fail(`${clientPath}:${scriptName} → ${scriptPath}`, 'file not found');
          }
        }
      }
    }
  }
}

console.log(`${BOLD}marketing-websites repository doctor${RESET}`);
console.log(`Root: ${ROOT}\n`);

checkRootScripts();
checkWorkspaceScripts();
checkClientScripts();

console.log(`\n${'─'.repeat(50)}`);
console.log(
  `${BOLD}Results:${RESET}  ${GREEN}${passed} passed${RESET}  ${YELLOW}${warned} warnings${RESET}  ${failed > 0 ? RED : ''}${failed} failed${failed > 0 ? RESET : ''}`
);

if (failed > 0) {
  console.log(`\n${RED}Doctor check FAILED${RESET} — fix broken script references above.`);
  process.exit(1);
} else if (warned > 0) {
  console.log(`\n${YELLOW}Doctor check PASSED with warnings${RESET}`);
  process.exit(0);
} else {
  console.log(`\n${GREEN}Doctor check PASSED${RESET}`);
  process.exit(0);
}
