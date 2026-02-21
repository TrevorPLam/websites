#!/usr/bin/env node
/**
 * @file tooling/generate-component/src/index.ts
 * Task: [6.8] pnpm generate-component MyComponent --package=marketing
 *
 * Purpose: Scaffold a new component with the standard header block, TypeScript interface,
 *          and co-located test file. Targets @repo/ui (primitive) or
 *          @repo/marketing-components (marketing family).
 *
 * Usage:
 *   pnpm generate-component MyButton --package=ui
 *   pnpm generate-component HeroSplit --package=marketing --family=hero
 *   pnpm generate-component MyButton --package=ui --dry-run
 *
 * Invariants:
 *   - Never overwrites existing files (exits with error)
 *   - Dry-run prints content without writing
 *   - Component name must be PascalCase
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  process.stdout.write(msg + '\n');
}
function warn(msg: string) {
  process.stderr.write('[generate-component] ' + msg + '\n');
}

function isPascalCase(s: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(s);
}

function toKebabCase(s: string): string {
  return s.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`).replace(/^-/, '');
}

interface CliArgs {
  name: string | null;
  pkg: 'ui' | 'marketing' | null;
  family: string | null;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);
  let name: string | null = null;
  let pkg: 'ui' | 'marketing' | null = null;
  let family: string | null = null;
  let dryRun = false;

  for (const arg of args) {
    if (arg.startsWith('--package=')) {
      const raw = arg.slice('--package='.length);
      if (raw === 'ui' || raw === 'marketing') {
        pkg = raw;
      } else {
        warn(`Unknown --package="${raw}". Use "ui" or "marketing".`);
        process.exit(1);
      }
    } else if (arg.startsWith('--family=')) {
      family = arg.slice('--family='.length);
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (!arg.startsWith('--')) {
      name = arg;
    }
  }
  return { name, pkg, family, dryRun };
}

// ─── Template generators ──────────────────────────────────────────────────────

function generateUiComponent(name: string, relPath: string): string {
  const propsName = `${name}Props`;
  return `/**
 * @file ${relPath}
 * [TRACE:FILE=packages.ui.components.${name}]
 *
 * Purpose: ${name} UI primitive component.
 *
 * Exports / Entry: ${name} component, ${propsName} interface
 * Used by: Applications and features requiring ${name} interactions
 *
 * Invariants:
 *   - Must be fully accessible with proper ARIA attributes
 *   - Must forward refs properly for DOM manipulation
 *
 * Status: @public
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface ${propsName} extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * ${name} component.
 */
export const ${name} = React.forwardRef<HTMLDivElement, ${propsName}>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          '${toKebabCase(name)}',
          variant === 'outline' && '${toKebabCase(name)}--outline',
          variant === 'ghost' && '${toKebabCase(name)}--ghost',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
${name}.displayName = '${name}';
`;
}

function generateMarketingComponent(name: string, family: string, relPath: string): string {
  const propsName = `${name}Props`;
  return `/**
 * @file ${relPath}
 * [TRACE:FILE=packages.marketing-components.${family}.${name}]
 *
 * Purpose: ${name} marketing component — member of the "${family}" family.
 *          Config-driven: all content injected via props, zero industry-specific logic.
 *
 * Exports / Entry: ${name} component, ${propsName} interface
 * Used by: Client apps via @repo/marketing-components
 *
 * Invariants:
 *   - Zero industry-specific logic — all variance via props
 *   - All content passed as props; no hardcoded copy
 *   - Theme values consumed from CSS variables only
 *   - Meets WCAG 2.1 AA
 *
 * Status: @public
 */

import * as React from 'react';
import { cn } from '@repo/utils';

export interface ${propsName} {
  /** Optional CSS class overrides */
  className?: string;
  /** Primary heading */
  heading?: string;
  /** Supporting copy */
  subheading?: string;
}

/**
 * ${name} — "${family}" family.
 */
export function ${name}({ className, heading, subheading }: ${propsName}) {
  return (
    <section className={cn('${toKebabCase(name)}', className)}>
      {heading && <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>}
      {subheading && <p className="mt-4 text-lg text-muted-foreground">{subheading}</p>}
    </section>
  );
}
`;
}

function generateTest(
  name: string,
  pkg: 'ui' | 'marketing',
  family: string | null,
  relPath: string
): string {
  const importPath = pkg === 'ui' ? `../${name}` : `../../${family ?? toKebabCase(name)}/${name}`;

  const variantTests =
    pkg === 'ui'
      ? `  it('applies outline variant', () => {
    const { container } = render(<${name} variant="outline" />);
    const el = container.firstChild as HTMLElement;
    expect(el?.getAttribute('data-variant')).toBe('outline');
  });`
      : `  it('renders heading when provided', () => {
    render(<${name} heading="Test Heading" />);
    expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeDefined();
  });`;

  return `/**
 * @file ${relPath}
 */

import * as React from 'react';
import { render${pkg === 'marketing' ? ', screen' : ''} } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ${name} } from '${importPath}';

expect.extend(toHaveNoViolations);

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
  });

${variantTests}

  it('passes accessibility audit', async () => {
    const { container } = render(
      <${name}${pkg === 'marketing' ? ' heading="Accessible heading"' : ''} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const { name, pkg, family, dryRun } = parseArgs(process.argv);

  if (!name || !pkg) {
    warn(
      'Usage: generate-component <ComponentName> --package=<ui|marketing> [--family=<name>] [--dry-run]'
    );
    warn('');
    warn('Examples:');
    warn('  generate-component MyButton --package=ui');
    warn('  generate-component HeroSplit --package=marketing --family=hero');
    process.exit(1);
  }

  if (!isPascalCase(name)) {
    warn(`Component name "${name}" must be PascalCase (e.g. MyComponent).`);
    process.exit(1);
  }

  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = path.resolve(path.dirname(__filename), '../../../..');

  let componentFile: string;
  let testFile: string;
  let componentRel: string;
  let testRel: string;
  let content: string;
  let testContent: string;

  if (pkg === 'ui') {
    const dir = path.join(repoRoot, 'packages', 'ui', 'src', 'components');
    componentRel = `packages/ui/src/components/${name}.tsx`;
    testRel = `packages/ui/src/components/__tests__/${name}.test.tsx`;
    componentFile = path.join(dir, `${name}.tsx`);
    testFile = path.join(dir, '__tests__', `${name}.test.tsx`);
    content = generateUiComponent(name, componentRel);
    testContent = generateTest(name, pkg, family, testRel);
  } else {
    const resolvedFamily = family ?? toKebabCase(name);
    const dir = path.join(repoRoot, 'packages', 'marketing-components', 'src', resolvedFamily);
    componentRel = `packages/marketing-components/src/${resolvedFamily}/${name}.tsx`;
    testRel = `packages/marketing-components/src/${resolvedFamily}/__tests__/${name}.test.tsx`;
    componentFile = path.join(dir, `${name}.tsx`);
    testFile = path.join(dir, '__tests__', `${name}.test.tsx`);
    content = generateMarketingComponent(name, resolvedFamily, componentRel);
    testContent = generateTest(name, pkg, resolvedFamily, testRel);
  }

  if (fs.existsSync(componentFile)) {
    warn(`Component already exists: ${componentRel}`);
    warn('Remove it first or choose a different name.');
    process.exit(1);
  }

  log('');
  log(`generate-component — ${name} (${pkg})`);
  log('─────────────────────────────────────');
  log(`  Component: ${componentRel}`);
  log(`  Test:      ${testRel}`);
  log('');

  if (dryRun) {
    log('─── Component ─────────────────────────────');
    log(content);
    log('─── Test ──────────────────────────────────');
    log(testContent);
    log('[dry-run] No files written.');
    return;
  }

  fs.mkdirSync(path.dirname(componentFile), { recursive: true });
  fs.writeFileSync(componentFile, content, 'utf8');
  log(`Created: ${componentRel}`);

  fs.mkdirSync(path.dirname(testFile), { recursive: true });
  fs.writeFileSync(testFile, testContent, 'utf8');
  log(`Created: ${testRel}`);

  log('');
  if (pkg === 'ui') {
    log('Next steps:');
    log(`  1. Add to packages/ui/src/index.ts:`);
    log(`       export * from './components/${name}';`);
    log('  2. Implement the component logic');
    log('  3. Run: pnpm --filter @repo/ui test');
  } else {
    const resolvedFamily = family ?? toKebabCase(name);
    log('Next steps:');
    log(`  1. Add to packages/marketing-components/src/${resolvedFamily}/index.ts`);
    log('  2. Verify packages/marketing-components/src/index.ts exports the family');
    log('  3. Implement the component layout and logic');
    log('  4. Run: pnpm validate-marketing-exports && pnpm test');
  }
  log('');
}

main();
