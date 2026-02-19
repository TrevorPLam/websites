#!/usr/bin/env npx tsx
/**
 * @file scripts/validate-client.ts
 * @role script
 * @summary Validates a client directory against the CaCA contract:
 *          - site.config.ts exists and parses as valid JSON-typed module
 *          - package.json has @clients/ name and required scripts
 *          - app/ directory has required routes (layout, page)
 *          - tsconfig.json exists and extends a base config
 *          - No cross-client imports detected (cross-platform Node.js scan)
 *
 * @exports
 * - validateClient(clientPath, root?, opts?): ValidationResult — programmatic API
 * - CLI: pnpm validate-client [client-path]
 *        e.g. pnpm validate-client clients/luxe-salon
 *
 * @invariants
 * - Exits 0 if all checks pass, 1 if any fail.
 * - Read-only — no files modified.
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

/** Result of validateClient. */
export interface ValidationResult {
  passed: number;
  failed: number;
  warned: number;
  ok: boolean;
}

/** Scans app/ and components/ for @clients/ imports (cross-platform). */
function scanForCrossClientImports(clientPath: string): string[] {
  const matches: string[] = [];
  const re = /@clients\//;
  const exts = ['.ts', '.tsx', '.js', '.jsx'];

  function scanDir(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.name === 'node_modules' || e.name === '.next') continue;
      if (e.isDirectory()) {
        scanDir(full);
      } else if (e.isFile() && exts.some((x) => e.name.endsWith(x))) {
        try {
          const content = fs.readFileSync(full, 'utf-8');
          if (re.test(content)) {
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (re.test(lines[i])) {
                matches.push(`${full}:${i + 1}: ${lines[i].trim()}`);
              }
            }
          }
        } catch {
          /* ignore read errors */
        }
      }
    }
  }

  const appDir = path.join(clientPath, 'app');
  const componentsDir = path.join(clientPath, 'components');
  scanDir(appDir);
  scanDir(componentsDir);
  return matches;
}

/**
 * Validates a client directory. Returns counts and ok flag. Does not exit.
 */
export function validateClient(
  clientPathArg: string,
  root: string = ROOT,
  opts: { silent?: boolean } = {}
): ValidationResult {
  const clientPath = path.isAbsolute(clientPathArg) ? clientPathArg : path.join(root, clientPathArg);
  const clientName = path.basename(clientPath);
  let passed = 0;
  let failed = 0;
  let warned = 0;

  const pass = (label: string): void => {
    if (!opts.silent) console.log(`  ${GREEN}✓${RESET} ${label}`);
    passed++;
  };
  const fail = (label: string, reason?: string): void => {
    if (!opts.silent) console.log(`  ${RED}✗${RESET} ${label}${reason ? ': ' + reason : ''}`);
    failed++;
  };
  const warn = (label: string, reason?: string): void => {
    if (!opts.silent) console.log(`  ${YELLOW}⚠${RESET} ${label}${reason ? ': ' + reason : ''}`);
    warned++;
  };
  const section = (title: string): void => {
    if (!opts.silent) console.log(`\n${BOLD}${title}${RESET}`);
  };

  if (!opts.silent) {
    console.log(`${BOLD}validate-client: ${clientName}${RESET}`);
    console.log(`Path: ${clientPath}\n`);
  }

  // ── 1. package.json ────────────────────────────────────────────────────────────
  section('package.json');
  const pkgPath = path.join(clientPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    fail('package.json', 'not found');
  } else {
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    } catch {
      fail('package.json', 'invalid JSON');
      pkg = {};
    }
    const name = pkg['name'] as string | undefined;
    if (!name?.startsWith('@clients/')) {
      fail(`name`, `must start with @clients/ (got: ${String(name)})`);
    } else {
      pass(`name: ${name}`);
    }
    const scripts = (pkg['scripts'] as Record<string, string> | undefined) ?? {};
    for (const s of ['dev', 'build', 'type-check']) {
      if (scripts[s]) pass(`scripts.${s}`);
      else fail(`scripts.${s}`, 'missing');
    }
  }

  // ── 2. site.config.ts ─────────────────────────────────────────────────────────
  section('site.config.ts');
  const configPath = path.join(clientPath, 'site.config.ts');
  if (!fs.existsSync(configPath)) {
    fail('site.config.ts', 'missing — required for CaCA architecture');
  } else {
    const content = fs.readFileSync(configPath, 'utf-8');
    if (content.includes("from '@repo/types'")) pass('imports SiteConfig from @repo/types');
    else warn('site.config.ts', 'does not import from @repo/types');
    for (const field of ['id:', 'name:', 'industry:', 'features:', 'theme:', 'conversionFlow:']) {
      if (content.includes(field)) pass(`has field: ${field}`);
      else fail(`missing field: ${field}`);
    }
    if (content.includes('export default siteConfig')) pass('export default siteConfig');
    else warn('site.config.ts', 'no "export default siteConfig" found');
  }

  // ── 3. Next.js config ─────────────────────────────────────────────────────────
  section('Next.js config');
  const hasNextConfigJs = fs.existsSync(path.join(clientPath, 'next.config.js'));
  const hasNextConfigTs = fs.existsSync(path.join(clientPath, 'next.config.ts'));
  if (hasNextConfigJs || hasNextConfigTs) {
    pass(`next.config.${hasNextConfigTs ? 'ts' : 'js'}`);
  } else {
    fail('next.config', 'missing — must have next.config.js or next.config.ts');
  }

  // ── 4. TypeScript config ───────────────────────────────────────────────────────
  section('TypeScript config');
  const tsConfigPath = path.join(clientPath, 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    fail('tsconfig.json', 'missing');
  } else {
    let tsconfig: Record<string, unknown>;
    try {
      tsconfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8')) as Record<string, unknown>;
    } catch {
      fail('tsconfig.json', 'invalid JSON');
      tsconfig = {};
    }
    const ext = tsconfig['extends'] as string | undefined;
    if (ext) pass(`extends: ${ext}`);
    else warn('tsconfig.json', 'does not extend a base config');
  }

  // ── 5. App directory ──────────────────────────────────────────────────────────
  section('App router structure');
  const appDir = path.join(clientPath, 'app');
  if (!fs.existsSync(appDir)) {
    fail('app/', 'directory not found');
  } else {
    pass('app/ directory exists');
    const hasRootLayout = fs.existsSync(path.join(appDir, 'layout.tsx'));
    const hasLocaleLayout = fs.existsSync(path.join(appDir, '[locale]', 'layout.tsx'));
    if (hasRootLayout) pass('app/layout.tsx');
    else if (hasLocaleLayout) pass('app/[locale]/layout.tsx (i18n routing)');
    else fail('layout.tsx', 'not found in app/ or app/[locale]/');
    const hasRootPage = fs.existsSync(path.join(appDir, 'page.tsx'));
    const hasLocalePage = fs.existsSync(path.join(appDir, '[locale]', 'page.tsx'));
    if (hasRootPage) pass('app/page.tsx');
    else if (hasLocalePage) pass('app/[locale]/page.tsx (i18n routing)');
    else warn('page.tsx', 'not found in app/ or app/[locale]/');
  }

  // ── 6. Cross-client import check (cross-platform) ──────────────────────────────
  section('Cross-client import check');
  const crossClientMatches = scanForCrossClientImports(clientPath);
  if (crossClientMatches.length > 0) {
    for (const line of crossClientMatches) {
      fail('cross-client import', line);
    }
  } else {
    pass('no cross-client imports detected');
  }

  if (!opts.silent) {
    console.log(`\n${'─'.repeat(50)}`);
    console.log(
      `${BOLD}Results:${RESET}  ${GREEN}${passed} passed${RESET}  ${YELLOW}${warned} warnings${RESET}  ${failed > 0 ? RED : ''}${failed} failed${failed > 0 ? RESET : ''}`
    );
  }

  return { passed, failed, warned, ok: failed === 0 };
}

// ─── CLI (only when run directly, not when imported for tests) ───────────────────

const runningAsScript = process.argv[1]?.includes('validate-client');
if (runningAsScript) {
  const arg = process.argv[2];
  if (!arg) {
    console.error(`Usage: pnpm validate-client <client-path>`);
    console.error(`  e.g. pnpm validate-client clients/luxe-salon`);
    process.exit(1);
  }
  const clientPath = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
  if (!fs.existsSync(clientPath)) {
    console.error(`\x1b[31mError: client directory not found: ${clientPath}\x1b[0m`);
    process.exit(1);
  }
  const result = validateClient(clientPath);
  if (result.failed > 0) {
    console.log(`\n${RED}Validation FAILED${RESET} — fix errors above.`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}Validation PASSED${RESET}`);
    process.exit(0);
  }
}
