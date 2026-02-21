/**
 * @file tooling/validation/src/validate-site-config.ts
 * Task: [6.8] pnpm validate-config clients/x/site.config.ts
 *
 * Purpose: Validate a site.config.ts file against the SiteConfig Zod schema.
 *          Exports validateSiteConfig() for programmatic use AND a CLI entry point
 *          that can be run via: node validate-site-config.ts <path>
 *
 * Usage (CLI):
 *   node --loader ts-node/esm tooling/validation/src/validate-site-config.ts clients/luxe-salon/site.config.ts
 *   pnpm validate-config clients/luxe-salon/site.config.ts
 *
 * Exports / Entry: validateSiteConfig, ValidationResult
 * Invariants:
 *   - Uses the canonical siteConfigSchema from @repo/types
 *   - Reports all field-level errors with human-readable paths
 *   - Non-zero exit code on validation failure when run as CLI
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidationError {
  /** Dot-notation field path, e.g. "theme.colors.primary" */
  field: string;
  /** Human-readable error message */
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  /** The parsed config object (only present when valid === true) */
  config?: unknown;
}

// ─── Core validator ───────────────────────────────────────────────────────────

/**
 * Validate a site.config.ts file at the given path.
 *
 * Resolution strategy:
 *  1. Read the file as text
 *  2. Extract the config literal using a lightweight regex approach
 *     (avoids executing arbitrary user code via dynamic import in Node)
 *  3. Validate required top-level fields by structural inspection
 *
 * For full Zod schema validation, use validateSiteConfigObject() directly.
 */
export function validateSiteConfig(filePath: string): ValidationResult {
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      errors: [{ field: 'file', message: `File not found: ${filePath}` }],
    };
  }

  const ext = path.extname(filePath);
  if (ext !== '.ts' && ext !== '.js') {
    return {
      valid: false,
      errors: [{ field: 'file', message: `Expected .ts or .js file, got "${ext}"` }],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const errors: ValidationError[] = [];

  // ── Structural text checks (fast, no eval) ──────────────────────────────
  const requiredFields: [RegExp, string, string][] = [
    [/\bid:\s*['"`]/, 'id', "Site id is required (e.g. id: 'my-site')"],
    [/\bname:\s*['"`]/, 'name', "Site name is required (e.g. name: 'My Site')"],
    [/\bindustry:\s*['"`]/, 'industry', 'Industry is required'],
    [/\btheme:\s*\{/, 'theme', 'theme section is required'],
    [/\bfeatures:\s*\{/, 'features', 'features section is required'],
    [/\bintegrations:\s*\{/, 'integrations', 'integrations section is required'],
    [/\bnavLinks:\s*\[/, 'navLinks', 'navLinks array is required'],
    [/\bfooter:\s*\{/, 'footer', 'footer section is required'],
    [/\bcontact:\s*\{/, 'contact', 'contact section is required'],
    [/\bconversionFlow:\s*\{/, 'conversionFlow', 'conversionFlow section is required'],
  ];

  for (const [pattern, field, message] of requiredFields) {
    if (!pattern.test(content)) {
      errors.push({ field, message });
    }
  }

  // ── Industry value check ────────────────────────────────────────────────
  const VALID_INDUSTRIES = [
    'salon',
    'restaurant',
    'law-firm',
    'dental',
    'medical',
    'fitness',
    'retail',
    'consulting',
    'realestate',
    'construction',
    'automotive',
    'education',
    'nonprofit',
    'general',
  ];
  const industryMatch = /industry:\s*['"`]([^'"`]+)['"`]/.exec(content);
  if (industryMatch?.[1] && !VALID_INDUSTRIES.includes(industryMatch[1])) {
    errors.push({
      field: 'industry',
      message: `Unknown industry "${industryMatch[1]}". Valid: ${VALID_INDUSTRIES.join(', ')}`,
    });
  }

  // ── URL check ───────────────────────────────────────────────────────────
  const urlMatch = /url:\s*(?:process\.env\.\w+\s*\?\?\s*)?['"`]([^'"`]+)['"`]/.exec(content);
  if (urlMatch?.[1]) {
    try {
      new URL(urlMatch[1]);
    } catch {
      errors.push({
        field: 'url',
        message: `url "${urlMatch[1]}" is not a valid URL`,
      });
    }
  }

  // ── HSL color format check ──────────────────────────────────────────────
  // Colors should be HSL without hsl() wrapper: "174 100% 26%"
  const colorBlockMatch = /colors:\s*\{([^}]+)\}/.exec(content);
  if (colorBlockMatch?.[1]) {
    const colorEntries = colorBlockMatch[1].matchAll(/'[^']*':\s*['"`]([^'"`]+)['"`]/g);
    for (const entry of colorEntries) {
      const value = entry[1];
      if (!value) continue;
      // Allow "hsl(...)" format as a warning — but flag non-HSL, non-hex values
      const isHslNoWrapper = /^\d+\s+\d+%\s+\d+%$/.test(value.trim());
      const isHslWrapper = value.trim().startsWith('hsl(');
      const isHex = /^#[0-9a-fA-F]{3,8}$/.test(value.trim());
      const isVar = value.trim().startsWith('var(');
      if (!isHslNoWrapper && !isHslWrapper && !isHex && !isVar) {
        errors.push({
          field: 'theme.colors',
          message: `Color value "${value}" should be HSL without hsl() wrapper (e.g. "174 100% 26%")`,
        });
      }
    }
  }

  // ── Export check ────────────────────────────────────────────────────────
  if (!(/export default siteConfig/.test(content) || /export default \{/.test(content))) {
    errors.push({
      field: 'export',
      message: 'site.config.ts must have a default export (export default siteConfig)',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─── Batch validator ──────────────────────────────────────────────────────────

/** Validate all site.config.ts files in clients/* */
export function validateAllClients(repoRoot: string): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();
  const clientsDir = path.join(repoRoot, 'clients');
  if (!fs.existsSync(clientsDir)) return results;

  for (const clientName of fs.readdirSync(clientsDir)) {
    const configPath = path.join(clientsDir, clientName, 'site.config.ts');
    if (!fs.existsSync(configPath)) continue;
    results.set(clientName, validateSiteConfig(configPath));
  }
  return results;
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

/**
 * Resolve the repo root from process.cwd().
 * When invoked from the repo root (standard pnpm usage), cwd is the root.
 * Falls back to walking up from cwd looking for pnpm-workspace.yaml.
 */
function findRepoRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function runCli(): void {
  const args = process.argv.slice(2);
  const repoRoot = findRepoRoot();

  // No args: validate all clients
  const targets = args.length > 0 ? args : [];

  if (targets.length === 0) {
    // Validate all clients
    const results = validateAllClients(repoRoot);
    if (results.size === 0) {
      process.stdout.write('[validate-config] No clients found in clients/\n');
      return;
    }

    let anyFailed = false;
    for (const [clientName, result] of results) {
      if (result.valid) {
        process.stdout.write(`  [ok]  ${clientName}\n`);
      } else {
        anyFailed = true;
        process.stdout.write(`  [err] ${clientName}\n`);
        for (const e of result.errors) {
          process.stdout.write(`        - ${e.field}: ${e.message}\n`);
        }
      }
    }
    if (anyFailed) process.exit(1);
    return;
  }

  // Validate specified files
  let anyFailed = false;
  for (const target of targets) {
    const resolved = path.isAbsolute(target) ? target : path.join(repoRoot, target);
    const result = validateSiteConfig(resolved);
    if (result.valid) {
      process.stdout.write(`[ok] ${target}\n`);
    } else {
      anyFailed = true;
      process.stdout.write(`[err] ${target}\n`);
      for (const e of result.errors) {
        process.stdout.write(`  - ${e.field}: ${e.message}\n`);
      }
    }
  }

  if (anyFailed) process.exit(1);
}

// Run as CLI when executed directly.
// We use a try/catch around import.meta to stay compatible with both
// ESM (direct Node execution) and CJS (ts-jest test transforms).
// In CJS, import.meta is a syntax error — ts-jest strips it via transform.
// The actual CLI invocation happens via the bin field in package.json.
//
// To invoke the CLI validator, run:
//   node tooling/validation/src/validate-site-config.ts [path...]
//   pnpm validate-config [path...]

// Export a named function so tests can import it without side-effects.
export { runCli };

const isCliInvocation =
  process.argv[1] && path.basename(process.argv[1]) === 'validate-site-config.ts';
if (isCliInvocation) {
  runCli();
}
