#!/usr/bin/env node
/**
 * @file tooling/create-client/src/index.ts
 * Task: [6.8] pnpm create-client my-client --industry=restaurant
 *
 * Purpose: CLI scaffolder that creates a new client site by copying starter-template,
 *          updating package.json name/port, and pre-filling site.config.ts with
 *          industry-specific defaults.
 *
 * Usage:
 *   pnpm create-client my-client
 *   pnpm create-client my-client --industry=restaurant
 *   pnpm create-client my-client --industry=dental --port=3106
 *   pnpm create-client my-client --dry-run
 *
 * Exports / Entry: main() — invoked directly via node
 * Invariants:
 *   - Refuses to overwrite an existing client directory
 *   - Only modifies package.json, site.config.ts in the copy
 *   - Dry-run prints a plan without writing anything
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg: string) {
  process.stdout.write(msg + '\n');
}
function warn(msg: string) {
  process.stderr.write('[create-client] ' + msg + '\n');
}

function parseArgs(argv: string[]): {
  name: string | null;
  industry: string;
  port: number | null;
  dryRun: boolean;
} {
  const args = argv.slice(2);
  let name: string | null = null;
  let industry = 'salon';
  let port: number | null = null;
  let dryRun = false;

  for (const arg of args) {
    if (arg.startsWith('--industry=')) {
      industry = arg.slice('--industry='.length);
    } else if (arg.startsWith('--port=')) {
      const p = parseInt(arg.slice('--port='.length), 10);
      if (!isNaN(p)) port = p;
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (!arg.startsWith('--')) {
      name = arg;
    }
  }

  return { name, industry, port, dryRun };
}

/** Recursively copy a directory, skipping generated/cache dirs */
function copyDirSync(src: string, dest: string): void {
  const SKIP = new Set(['node_modules', '.next', '.turbo', 'dist', '.env.local']);
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/** Scan existing clients and return the next available port (starting at basePort) */
function nextAvailablePort(clientsDir: string, basePort = 3101): number {
  const used = new Set<number>();
  if (!fs.existsSync(clientsDir)) return basePort;
  for (const name of fs.readdirSync(clientsDir)) {
    const pkgPath = path.join(clientsDir, name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
        scripts?: Record<string, string>;
      };
      for (const script of Object.values(pkg.scripts ?? {})) {
        const m = /--port[= ](\d+)/.exec(script);
        if (m?.[1]) used.add(parseInt(m[1], 10));
      }
    } catch {
      // ignore malformed package.json
    }
  }
  let candidate = basePort;
  while (used.has(candidate)) candidate++;
  return candidate;
}

/** Convert kebab-case slug to Title Case display name */
function toTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Industry defaults ───────────────────────────────────────────────────────

interface IndustryDefaults {
  tagline: string;
  conversionFlowType: 'booking' | 'contact' | 'quote';
  serviceCategories: string[];
}

const INDUSTRY_DEFAULTS: Record<string, IndustryDefaults> = {
  salon: {
    tagline: 'Premium hair & beauty',
    conversionFlowType: 'booking',
    serviceCategories: ['Haircut', 'Color', 'Highlights', 'Styling', 'Treatment'],
  },
  restaurant: {
    tagline: 'Fresh flavors, unforgettable moments',
    conversionFlowType: 'booking',
    serviceCategories: ['Dinner', 'Brunch', 'Private Event', 'Catering'],
  },
  'law-firm': {
    tagline: 'Experienced counsel you can trust',
    conversionFlowType: 'contact',
    serviceCategories: ['Initial Consultation', 'Civil Litigation', 'Corporate Law', 'Family Law'],
  },
  dental: {
    tagline: 'Brighter smiles, healthier lives',
    conversionFlowType: 'booking',
    serviceCategories: ['Cleaning', 'Whitening', 'Filling', 'Orthodontics', 'Emergency Care'],
  },
  medical: {
    tagline: 'Compassionate care, expert medicine',
    conversionFlowType: 'booking',
    serviceCategories: ['General Checkup', 'Specialist Referral', 'Preventive Care', 'Urgent Care'],
  },
  fitness: {
    tagline: 'Train harder. Live better.',
    conversionFlowType: 'booking',
    serviceCategories: ['Personal Training', 'Group Class', 'Nutrition Coaching', 'Assessment'],
  },
  retail: {
    tagline: 'Quality products, exceptional service',
    conversionFlowType: 'contact',
    serviceCategories: ['General Inquiry', 'Order Support', 'Returns', 'Wholesale'],
  },
  consulting: {
    tagline: 'Strategy that drives results',
    conversionFlowType: 'contact',
    serviceCategories: ['Strategy', 'Operations', 'Technology', 'Change Management'],
  },
  realestate: {
    tagline: 'Find your perfect home',
    conversionFlowType: 'contact',
    serviceCategories: ['Buying', 'Selling', 'Renting', 'Investment Properties'],
  },
  construction: {
    tagline: 'Built to last, crafted with care',
    conversionFlowType: 'quote',
    serviceCategories: ['Residential', 'Commercial', 'Renovation', 'Roofing', 'Flooring'],
  },
  automotive: {
    tagline: 'Your trusted auto care partner',
    conversionFlowType: 'booking',
    serviceCategories: ['Oil Change', 'Brake Service', 'Tires', 'Diagnostics', 'Detailing'],
  },
};

// ─── File patchers ───────────────────────────────────────────────────────────

function patchSiteConfig(
  filePath: string,
  opts: { id: string; name: string; port: number; industry: string }
): void {
  let content = fs.readFileSync(filePath, 'utf8');
  const defaults = INDUSTRY_DEFAULTS[opts.industry] ?? INDUSTRY_DEFAULTS['salon'];
  if (!defaults) throw new Error(`No defaults for industry: ${opts.industry}`);

  // Remove the task-comment header line
  content = content.replace(/^\/\/ Task:.*\n/m, '');

  const replace = (pattern: RegExp, replacement: string) => {
    content = content.replace(pattern, replacement);
  };

  replace(/id:\s*'[^']*'/, `id: '${opts.id}'`);
  replace(/name:\s*'[^']*'/, `name: '${opts.name}'`);
  replace(/tagline:\s*'[^']*'/, `tagline: '${defaults.tagline}'`);
  replace(
    /description:\s*'[^']*'/,
    `description: '${opts.name} — industry: ${opts.industry}'`
  );
  replace(
    /url:\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\?\?\s*'[^']*'/,
    `url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:${opts.port}'`
  );
  replace(/industry:\s*'[^']*'/, `industry: '${opts.industry}'`);
  replace(/copyrightTemplate:\s*'[^']*'/, `copyrightTemplate: '© {year} ${opts.name}'`);
  replace(
    /serviceCategories:\s*\[[^\]]*\]/,
    `serviceCategories: ${JSON.stringify(defaults.serviceCategories)}`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

function patchPackageJson(filePath: string, clientName: string, port: number): void {
  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
    name?: string;
    description?: string;
    scripts?: Record<string, string>;
  };
  pkg.name = `@clients/${clientName}`;
  pkg.description = `${toTitle(clientName)} — marketing site`;
  if (pkg.scripts) {
    pkg.scripts['dev'] = `next dev --port ${port}`;
    pkg.scripts['start'] = `next start --port ${port}`;
  }
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { name, industry, port: portArg, dryRun } = parseArgs(process.argv);

  if (!name) {
    warn('Usage: pnpm create-client <client-name> [--industry=<slug>] [--port=<n>] [--dry-run]');
    warn('');
    warn('Industries: ' + Object.keys(INDUSTRY_DEFAULTS).join(', '));
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    warn(`Invalid client name "${name}". Use lowercase letters, numbers, and hyphens only.`);
    process.exit(1);
  }

  // Resolve repo root relative to this compiled file location
  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = path.resolve(path.dirname(__filename), '../../../..');
  const clientsDir = path.join(repoRoot, 'clients');
  const templateDir = path.join(clientsDir, 'starter-template');
  const destDir = path.join(clientsDir, name);

  if (!fs.existsSync(templateDir)) {
    warn(`Starter template not found: ${templateDir}`);
    process.exit(1);
  }

  if (fs.existsSync(destDir)) {
    warn(`Client "${name}" already exists at ${destDir}`);
    process.exit(1);
  }

  const resolvedIndustry = industry in INDUSTRY_DEFAULTS ? industry : 'salon';
  if (resolvedIndustry !== industry) {
    log(`[warn] Unknown industry "${industry}". Defaulting to "salon".`);
    log(`       Valid: ${Object.keys(INDUSTRY_DEFAULTS).join(', ')}`);
  }

  const port = portArg ?? nextAvailablePort(clientsDir);
  const title = toTitle(name);

  log('');
  log('create-client');
  log('─────────────────────────────────');
  log(`  Package:   @clients/${name}`);
  log(`  Title:     ${title}`);
  log(`  Industry:  ${resolvedIndustry}`);
  log(`  Port:      ${port}`);
  log(`  Directory: ${destDir}`);
  log('');

  if (dryRun) {
    log('[dry-run] No files written.');
    return;
  }

  // Confirm in interactive TTY
  if (process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise<void>((resolve) => {
      rl.question('Proceed? (y/N) ', (answer) => {
        rl.close();
        if (answer.trim().toLowerCase() !== 'y') {
          log('Aborted.');
          process.exit(0);
        }
        resolve();
      });
    });
  }

  log('Copying starter-template…');
  copyDirSync(templateDir, destDir);

  log('Patching package.json…');
  patchPackageJson(path.join(destDir, 'package.json'), name, port);

  log('Patching site.config.ts…');
  patchSiteConfig(path.join(destDir, 'site.config.ts'), {
    id: name,
    name: title,
    port,
    industry: resolvedIndustry,
  });

  log('');
  log('Client created successfully.');
  log('');
  log('Next steps:');
  log('  1. pnpm install');
  log(`  2. pnpm --filter @clients/${name} dev`);
  log(`  3. Edit clients/${name}/site.config.ts to customise content`);
  log('');
}

main().catch((e: unknown) => {
  warn(String(e instanceof Error ? e.message : e));
  process.exit(1);
});
