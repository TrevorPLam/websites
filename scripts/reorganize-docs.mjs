import https from 'https';
import fs from 'fs';
import path from 'path';

// Reorganization Script for docs/guides
// v3: Uses local filesystem (via git checkout) instead of GitHub API
// This avoids API rate limits entirely

const GUIDES_DIR = 'docs/guides';

const CATEGORIES = {
  'ai-automation': [
    'agents-md-patterns.md',
    'per-package-agents-stubs.md',
    'root-agents-master.md',
    'ai-agent-cold-start-checklist.md',
    'claude-code-integration.md',
    'claude-sub-agent-definitions.md',
    'autonomous-janitor-design.md',
    'ai-context-json-proposal.md',
    'ai-context-management.md'
  ],
  'frontend': [
    'nextjs-16-documentation.md',
    'nextjs-middleware-documentation.md',
    'react-19-documentation.md',
    'react-compiler-docs.md',
    'react-hook-form-documentation.md',
    'tailwindcss-v4-documentation.md',
    'css-variables-guide.md',
    'turbopack-documentation.md',
    'storybook-documentation.md',
    'offline-first-forms-pwa.md',
    'core-web-vitals-optimization.md',
    'performance-budgeting.md'
  ],
  'backend-data': [
    'aws-rds-proxy-documentation.md',
    'postgresql-pg-stat-statements.md',
    'postgresql-rls-documentation.md',
    'pglite-documentation.md',
    'clickhouse-documentation.md',
    'electricsql-docs.md',
    'upstash-redis-documentation.md',
    'upstash-ratelimit-documentation.md',
    'supabase-auth-docs.md',
    'tinybird-documentation.md',
    'multi-layer-rate-limiting.md',
    'hubspot-documentation.md'
  ],
  'infrastructure-devops': [
    'deployment-runbook.md',
    'github-actions-docs.md',
    'pnpm-deploy-documentation.md',
    'terraform-aws-provider-docs.md',
    'terraform-supabase-provider-docs.md',
    'terraform-vercel-provider-docs.md',
    'opentofu-documentation.md',
    'nx-cloud-documentation.md',
    'vercel-domains-api-docs.md',
    'vercel-for-platforms-docs.md',
    'launchdarkly-documentation.md'
  ],
  'observability': [
    'opentelemetry-documentation.md',
    'opentelemetry-instrumentation.md',
    'opentelemetry-nextjs-instrumentation.md',
    'vercel-otel-documentation.md',
    'sentry-documentation.md'
  ],
  'testing': [
    'playwright-best-practices.md',
    'playwright-documentation.md',
    'testing-library-documentation.md',
    'vitest-documentation.md',
    'e2e-testing-suite-patterns.md',
    'axe-core-documentation.md'
  ],
  'build-monorepo': [
    'pnpm-vs-yarn-vs-npm-benchmarks.md',
    'pnpm-workspaces-documentation.md',
    'nx-affected-documentation.md',
    'nx-core-team-whitepaper.md',
    'turborepo-documentation.md',
    'turborepo-remote-caching.md',
    'turbo-json-configuration.md',
    'changesets-documentation.md'
  ],
  'accessibility-legal': [
    'ada-title-ii-final-rule.md',
    'wcag-2.2-criteria.md',
    'hhs-section-504-docs.md',
    'gdpr-guide.md',
    'nist-fips-203-204-205.md'
  ],
  'payments-billing': [
    'billing-page-components.md',
    'stripe-checkout-sessions.md',
    'stripe-customer-portal.md',
    'stripe-documentation.md'
  ],
  'cms-content': [
    'sanity-documentation.md',
    'storyblok-documentation.md',
    'blog-content-architecture.md',
    'sanity-cms-draft-mode-2026.md'
  ],
  'seo-metadata': [
    'schema-org-documentation.md',
    'dynamic-og-images.md',
    'dynamic-sitemap-generation.md',
    'metadata-generation-system.md',
    'structured-data-system.md',
    'llms-txt-spec.md',
    'generative-engine-optimization-2026.md',
    'seo-validation-ci-pipeline-2026.md',
    'edge-ab-testing-zero-cls-2026.md',
    'tenant-metadata-factory.md',
    'service-area-pages-engine.md'
  ],
  'standards-specs': [
    'semver-spec.md',
    'cyclonedx-spec.md',
    'spdx-spec.md',
    'slsa-provenance-spec.md',
    'green-software-foundation-sci-spec.md',
    'sci-calculation-examples.md',
    'design-tokens-w3c-cg-report.md',
    'style-dictionary-documentation.md',
    'nist-report-on-hqc.md'
  ],
  'best-practices': [
    'thin-vertical-slice-guide.md',
    'feature-sliced-design-docs.md',
    'reversibility-principles.md',
    'prioritization-framework.md',
    'quality-assurance-checklist.md',
    'independent-release-patterns.md',
    'internal-developer-portal-patterns.md',
    'cli-scaffold-design.md'
  ],
  'email': [
    'resend-documentation.md',
    'postmark-documentation.md',
    'email-package-structure.md',
    'multi-tenant-email-routing.md',
    'unified-email-send.md',
    'lead-notification-template.md'
  ],
  'security': [
    'pqc-migration-strategy.md',
    'noble-post-quantum-documentation.md',
    'github-signing-commits-docs.md',
    'security-headers-system.md',
    'security-middleware-implementation.md',
    'server-action-security-wrapper.md',
    'secrets-manager.md'
  ],
  'architecture': [
    'architecture-decision-record-template.md',
    '000-use-adrs.md',
    '0000-use-adrs.md',
    'white-label-portal-architecture.md',
    'client-portal-configuration.md',
    'monorepo-context-protocol-proposal.md',
    'realtime-lead-feed-implementation.md',
    'report-generation-engine.md',
    'site-config-schema-documentation.md'
  ],
  'scheduling': [
    'acuity-scheduling-documentation.md',
    'calendly-documentation.md',
    'calcom-embed-widget.md',
    'calcom-webhook-handler.md'
  ],
  'linting': [
    'eslint-9-documentation.md',
    'prettier-documentation.md',
    'steiger-documentation.md',
    'steiger-linting-configuration.md'
  ]
};

// Files to delete outright (junk/meta/placeholder files)
const JUNK_FILES = new Set(['ADDTHESE.md', '0000.md', '000.md', 'configuration-migration-guide.md']);

function cleanContent(content) {
  // Remove JSDoc-style block comments added by agentic tools
  let cleaned = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
  // Remove boilerplate AI-generated Table of Contents sections
  cleaned = cleaned.replace(/## Table of Contents[\s\S]*?(?=\n# |\n## [^T]|$)/g, '');
  return cleaned.trim() + '\n';
}

function getCategoryForFile(filename) {
  for (const [category, files] of Object.entries(CATEGORIES)) {
    if (files.includes(filename)) return category;
  }
  return 'uncategorized';
}

async function run() {
  // Read the guides directory - only root-level .md files
  const allEntries = fs.readdirSync(GUIDES_DIR, { withFileTypes: true });
  const mdFiles = allEntries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => e.name);

  console.log(`Found ${mdFiles.length} markdown files at root of ${GUIDES_DIR}`);

  let moved = 0;
  let deleted = 0;
  let skipped = 0;

  for (const filename of mdFiles) {
    const srcPath = path.join(GUIDES_DIR, filename);

    // Delete junk files
    if (JUNK_FILES.has(filename)) {
      console.log(`Deleting junk: ${filename}`);
      fs.unlinkSync(srcPath);
      deleted++;
      continue;
    }

    const category = getCategoryForFile(filename);
    const destDir = path.join(GUIDES_DIR, category);
    const destPath = path.join(destDir, filename);

    // Create subdirectory if needed
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Read, clean, and write content
    const raw = fs.readFileSync(srcPath, 'utf8');
    const cleaned = cleanContent(raw);
    fs.writeFileSync(destPath, cleaned, 'utf8');

    // Remove from root
    fs.unlinkSync(srcPath);

    console.log(`Moved: ${filename} -> ${category}/`);
    moved++;
  }

  console.log(`\nDone! Moved: ${moved}, Deleted: ${deleted}, Skipped: ${skipped}`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
