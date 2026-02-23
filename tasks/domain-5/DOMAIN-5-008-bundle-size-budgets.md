---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-008
title: 'Bundle size budgets with CI enforcement'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-008-bundle-size-budgets
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-008 · Bundle size budgets with CI enforcement

## Objective

Implement bundle size budgets following section 5.8 specification with size-limit configuration, CI enforcement, and automated bundle analysis for optimal performance.

---

## Context

**Codebase area:** Bundle optimization — Size limit configuration and CI enforcement

**Related files:** Build configuration, CI/CD pipeline, package.json files

**Dependencies:** size-limit package, existing build system, CI infrastructure

**Prior work:** Basic build system exists but lacks comprehensive bundle size monitoring

**Constraints:** Must follow section 5.8 specification with automated CI enforcement

---

## Tech Stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Bundling    | size-limit for bundle analysis           |
| CI          | GitHub Actions for automated enforcement |
| Monitoring  | Bundle size tracking and reporting       |
| Performance | Bundle optimization strategies           |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement bundle size budgets following section 5.8 specification
- [ ] **[Agent]** Create size-limit configuration for all packages and sites
- [ ] **[Agent]** Add CI enforcement with GitHub Actions
- [ ] **[Agent]** Implement bundle analysis and reporting
- [ ] **[Agent]** Add bundle size optimization strategies
- [ ] **[Agent]** Test bundle size enforcement with various scenarios
- [ ] **[Human]** Verify budgets follow section 5.8 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.8 specification** — Extract bundle size requirements
- [ ] **[Agent]** **Create size-limit configuration** — Set up budgets for all packages
- [ ] **[Agent]** **Add CI enforcement** — Implement GitHub Actions workflow
- [ ] **[Agent]** **Create bundle analysis** — Add reporting and visualization
- [ ] **[Agent]** **Implement optimization strategies** — Add bundle size reduction techniques
- [ ] **[Agent]** **Test enforcement** — Verify CI blocks oversized bundles
- [ ] **[Agent]** **Add monitoring** — Track bundle size trends over time

> ⚠️ **Agent Question**: Ask human before proceeding if any existing bundles exceed proposed limits.

---

## Commands

```bash
# Test bundle size limits
pnpm build
pnpm dlx size-limit --json > bundle-sizes.json
pnpm dlx size-limit

# Test specific package
pnpm build --filter="@repo/ui"
pnpm dlx size-limit packages/ui/dist/index.js

# Test bundle analysis
pnpm build --analyze
pnpm dlx webpack-bundle-analyzer .next/static/chunks/

# Test CI enforcement
pnpm test:bundle-size
```

---

## Code Style

```json
// ✅ Correct — Bundle size budgets following section 5.8
// .size-limit.json (root)
[
  {
    "name": "Shared UI Package (@repo/ui)",
    "path": "packages/ui/dist/index.js",
    "limit": "50 kB",
    "gzip": true
  },
  {
    "name": "Marketing Site — Homepage JS",
    "path": "sites/*/out/_next/static/chunks/pages/index-*.js",
    "limit": "75 kB",
    "gzip": true
  },
  {
    "name": "Marketing Site — Shared Chunks",
    "path": "sites/*/out/_next/static/chunks/framework-*.js",
    "limit": "130 kB",
    "gzip": true
  },
  {
    "name": "Portal App — Dashboard JS",
    "path": "apps/portal/.next/static/chunks/pages/dashboard-*.js",
    "limit": "120 kB",
    "gzip": true
  },
  {
    "name": "Features Package — Combined",
    "path": "packages/features/dist/index.js",
    "limit": "80 kB",
    "gzip": true
  },
  {
    "name": "Marketing Site — Total JS",
    "path": "sites/*/out/_next/static/**/*.js",
    "limit": "500 kB",
    "gzip": true
  }
]
```

```yaml
# ✅ Correct — CI enforcement following section 5.8
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  bundle-size:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Check bundle sizes
        run: |
          pnpm dlx size-limit --json > bundle-sizes.json

          # Fail CI if any bundle exceeds limit
          pnpm dlx size-limit

      - name: Generate bundle report
        run: |
          pnpm dlx size-limit --json > bundle-report.json

          # Create summary comment
          echo "## Bundle Size Report" > bundle-summary.md
          echo "" >> bundle-summary.md
          echo "| Package | Size | Limit | Status |" >> bundle-summary.md
          echo "|---------|------|-------|--------|" >> bundle-summary.md

          # Parse and format results
          node -e "
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('bundle-report.json', 'utf8'));
            report.forEach(item => {
              const status = item.size <= item.limit ? '✅' : '❌';
              console.log(\`| \${item.name} | \${item.size} | \${item.limit} | \${status} |\`);
            });
          " >> bundle-summary.md

      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = fs.readFileSync('bundle-summary.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

```typescript
// ✅ Correct — Bundle analysis and optimization
// scripts/bundle-analyzer.ts
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';

interface BundleAnalysis {
  path: string;
  size: number;
  gzip: number;
  limit: number;
  status: 'pass' | 'fail';
}

async function analyzeBundles(): Promise<BundleAnalysis[]> {
  const sizeLimitConfig = JSON.parse(readFileSync('.size-limit.json', 'utf8'));
  const results: BundleAnalysis[] = [];

  for (const config of sizeLimitConfig) {
    try {
      // Find actual bundle files matching the pattern
      const files = await glob(config.path, { ignore: ['node_modules/**'] });

      for (const file of files) {
        const stats = await import('fs').then((fs) => fs.statSync(file));
        const size = stats.size;

        // Calculate gzip size (approximation)
        const gzipSize = Math.round(size * 0.3);

        results.push({
          path: file,
          size,
          gzip: gzipSize,
          limit: parseInt(config.limit.replace(/[^0-9]/g, '')) * 1024, // Convert kB to bytes
          status: size <= config.limit ? 'pass' : 'fail',
        });
      }
    } catch (error) {
      console.warn(`Could not analyze ${config.name}:`, error);
    }
  }

  return results;
}

async function generateOptimizationSuggestions(analysis: BundleAnalysis[]): Promise<string[]> {
  const suggestions: string[] = [];

  // Find largest bundles
  const sortedBySize = analysis.sort((a, b) => b.size - a.size);
  const largest = sortedBySize.slice(0, 5);

  suggestions.push('## Top 5 Largest Bundles');
  suggestions.push('| Bundle | Size | Status |');
  suggestions.push('|--------|------|--------|');

  for (const bundle of largest) {
    suggestions.push(
      `| ${bundle.path} | ${formatBytes(bundle.size)} | ${bundle.status === 'pass' ? '✅' : '❌'} |`
    );
  }

  // Add optimization suggestions
  suggestions.push('\n## Optimization Suggestions');

  for (const bundle of analysis.filter((b) => b.status === 'fail')) {
    suggestions.push(`\n### ${bundle.path}`);
    suggestions.push(
      `Current size: ${formatBytes(bundle.size)} (limit: ${formatBytes(bundle.limit)})`
    );

    if (bundle.path.includes('ui')) {
      suggestions.push('- Consider lazy loading heavy components');
      suggestions.push('- Remove unused UI components');
      suggestions.push('- Optimize image imports');
    } else if (bundle.path.includes('features')) {
      suggestions.push('- Split large feature modules');
      suggestions.push('- Use dynamic imports for optional features');
      suggestions.push('- Remove unused dependencies');
    } else if (bundle.path.includes('pages')) {
      suggestions.push('- Implement code splitting at route level');
      suggestions.push('- Use next/dynamic for heavy components');
      suggestions.push('- Optimize third-party library usage');
    }
  }

  return suggestions;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main execution
async function main() {
  const analysis = await analyzeBundles();
  const suggestions = await generateOptimizationSuggestions(analysis);

  // Write report
  const report = [
    '# Bundle Size Analysis Report',
    '',
    ...suggestions,
    '',
    '## Next Steps',
    '1. Review failing bundles and implement optimization suggestions',
    '2. Test bundle size impact of changes',
    '3. Update size limits if necessary (with justification)',
    '4. Monitor bundle size trends over time',
  ].join('\n');

  writeFileSync('bundle-analysis.md', report);
  console.log('Bundle analysis complete! See bundle-analysis.md for details.');
}

if (require.main === module) {
  main().catch(console.error);
}
```

**Bundle size principles:**

- **Automated enforcement**: CI blocks deployments that exceed size limits
- **Comprehensive coverage**: All packages and sites have size limits
- **Gzip optimization**: Limits account for compressed bundle sizes
- **Trend monitoring**: Track bundle size changes over time
- **Optimization guidance**: Provide actionable suggestions for oversized bundles
- **Performance focus**: Balance bundle size with functionality requirements

---

## Boundaries

| Tier             | Scope                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.8 specification; implement CI enforcement; add comprehensive coverage; provide optimization guidance; monitor trends |
| ⚠️ **Ask first** | Changing existing bundle size limits; modifying CI enforcement; updating optimization strategies                                      |
| 🚫 **Never**     | Skip CI enforcement; ignore bundle size trends; allow uncontrolled bundle growth; break functionality for size optimization           |

---

## Success Verification

- [ ] **[Agent]** Test size-limit configuration — All bundles within limits
- [ ] **[Agent]** Verify CI enforcement — CI blocks oversized bundles
- [ ] **[Agent]** Test bundle analysis — Reports generated correctly
- [ ] **[Agent]** Verify optimization suggestions — Actionable guidance provided
- [ ] **[Agent]** Test trend monitoring — Bundle size changes tracked
- [ ] **[Agent]** Test with real builds — Enforcement works in production
- [ ] **[Human]** Test with PR workflow — CI comments work correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Bundle size fluctuations**: Account for normal variations in CI
- **Third-party dependencies**: Monitor external library size changes
- **Build environment**: Ensure consistent bundle sizes across environments
- **Compression ratios**: Account for gzip vs brotli differences
- **Dynamic imports**: Ensure code splitting doesn't break functionality
- **Legacy bundles**: Handle existing oversized bundles with migration plans

---

## Out of Scope

- Core Web Vitals optimization (handled in separate task)
- PPR optimization (handled in separate tasks)
- React Compiler optimization (handled in separate task)
- Lighthouse CI configuration (handled in separate task)

---

## References

- [Section 5.8 Bundle Size Budgets](docs/plan/domain-5/5.8-bundle-size-budgets.md)
- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [size-limit Documentation](https://github.com/ai/size-limit)
- [Next.js Bundle Analysis](https://nextjs.org/docs/advanced-features/bundle-analyzer)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
