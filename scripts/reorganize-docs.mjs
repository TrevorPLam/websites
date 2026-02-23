import https from 'https';

// Reorganization Script for docs/guides
// Uses only built-in Node.js modules - no dependencies required

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const owner = 'TrevorPLam';
const repo = 'websites';
const baseDir = 'docs/guides';
const branch = 'main';

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'reorganize-docs-script',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${method} ${path}: ${data}`));
          return;
        }
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const CATEGORIES = {
  'ai-automation': [
    'agents-md-patterns.md', 'per-package-agents-stubs.md', 'root-agents-master.md',
    'ai-agent-cold-start-checklist.md', 'claude-code-integration.md',
    'claude-sub-agent-definitions.md', 'autonomous-janitor-design.md',
    'ai-context-json-proposal.md', 'ai-context-management.md'
  ],
  'frontend': [
    'nextjs-16-documentation.md', 'nextjs-middleware-documentation.md',
    'react-19-documentation.md', 'react-compiler-docs.md',
    'react-hook-form-documentation.md', 'tailwindcss-v4-documentation.md',
    'css-variables-guide.md'
  ],
  'backend-data': [
    'aws-rds-proxy-documentation.md', 'postgresql-pg-stat-statements.md',
    'postgresql-rls-documentation.md', 'pglite-documentation.md',
    'clickhouse-documentation.md', 'electricsql-docs.md',
    'upstash-redis-documentation.md', 'upstash-ratelimit-documentation.md'
  ],
  'infrastructure-devops': [
    'deployment-runbook.md', 'github-actions-docs.md', 'pnpm-deploy-documentation.md',
    'terraform-aws-provider-docs.md', 'terraform-supabase-provider-docs.md',
    'terraform-vercel-provider-docs.md', 'opentofu-documentation.md',
    'nx-cloud-documentation.md', 'vercel-domains-api-docs.md', 'vercel-for-platforms-docs.md'
  ],
  'observability': [
    'opentelemetry-documentation.md', 'opentelemetry-instrumentation.md',
    'opentelemetry-nextjs-instrumentation.md', 'vercel-otel-documentation.md',
    'sentry-documentation.md'
  ],
  'testing': [
    'playwright-best-practices.md', 'playwright-documentation.md',
    'testing-library-documentation.md', 'vitest-documentation.md',
    'e2e-testing-suite-patterns.md'
  ],
  'build-monorepo': [
    'pnpm-vs-yarn-vs-npm-benchmarks.md', 'pnpm-workspaces-documentation.md',
    'nx-affected-documentation.md', 'nx-core-team-whitepaper.md',
    'turborepo-documentation.md', 'turborepo-remote-caching.md',
    'turbo-json-configuration.md', 'changesets-documentation.md'
  ],
  'accessibility-legal': [
    'ada-title-ii-final-rule.md', 'wcag-2.2-criteria.md', 'axe-core-documentation.md',
    'hhs-section-504-docs.md', 'gdpr-guide.md'
  ],
  'design-tokens': [
    'design-tokens-w3c-cg-report.md', 'style-dictionary-documentation.md'
  ],
  'payments-billing': [
    'billing-page-components.md', 'stripe-checkout-sessions.md',
    'stripe-customer-portal.md', 'stripe-documentation.md'
  ],
  'cms-content': [
    'sanity-documentation.md', 'storyblok-documentation.md', 'blog-content-architecture.md'
  ],
  'seo-metadata': [
    'schema-org-documentation.md', 'dynamic-og-images.md', 'dynamic-sitemap-generation.md',
    'metadata-generation-system.md', 'structured-data-system.md'
  ],
  'standards-specs': [
    'semver-spec.md', 'cyclonedx-spec.md', 'spdx-spec.md', 'slsa-provenance-spec.md',
    'llms-txt-spec.md', 'green-software-foundation-sci-spec.md', 'sci-calculation-examples.md'
  ],
  'best-practices': [
    'thin-vertical-slice-guide.md', 'feature-sliced-design-docs.md',
    'reversibility-principles.md', 'prioritization-framework.md',
    'quality-assurance-checklist.md', 'independent-release-patterns.md',
    'internal-developer-portal-patterns.md', 'cli-scaffold-design.md'
  ],
  'email': [
    'resend-documentation.md', 'postmark-documentation.md', 'email-package-structure.md',
    'multi-tenant-email-routing.md', 'unified-email-send.md'
  ],
  'security': [
    'pqc-migration-strategy.md', 'nist-fips-203-204-205.md', 'nist-report-on-hqc.md',
    'noble-post-quantum-documentation.md', 'github-signing-commits-docs.md',
    'security-headers-system.md', 'security-middleware-implementation.md',
    'server-action-security-wrapper.md', 'secrets-manager.md'
  ],
  'architecture': [
    'architecture-decision-record-template.md', '0000-use-adrs.md', '0000.md',
    'service-area-pages-engine.md', 'white-label-portal-architecture.md',
    'client-portal-configuration.md', 'monorepo-context-protocol-proposal.md'
  ],
  'scheduling': [
    'acuity-scheduling-documentation.md', 'calendly-documentation.md',
    'calcom-embed-widget.md', 'calcom-webhook-handler.md'
  ],
  'linting': [
    'eslint-9-documentation.md', 'prettier-documentation.md',
    'steiger-documentation.md', 'steiger-linting-configuration.md'
  ]
};

const JUNK_FILES = ['ADDTHESE.md', '0000.md', '000.md'];

function cleanContent(content) {
  // Remove JSDoc-style block comments added by agentic tools
  let cleaned = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
  // Remove fake auto-generated banners
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  // Remove boilerplate Table of Contents sections
  cleaned = cleaned.replace(/## Table of Contents[\s\S]*?(?=\n# |\n## |$)/g, '');
  return cleaned.trim();
}

async function getFileContent(filePath) {
  const data = await apiRequest('GET', `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

async function createOrUpdateFile(filePath, content, message, existingSha) {
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  };
  if (existingSha) body.sha = existingSha;
  return apiRequest('PUT', `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`, body);
}

async function deleteFile(filePath, sha, message) {
  return apiRequest('DELETE', `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`, {
    message,
    sha,
    branch,
  });
}

async function run() {
  console.log('Fetching docs/guides directory listing...');
  const files = await apiRequest('GET', `/repos/${owner}/${repo}/contents/${baseDir}?ref=${branch}`);

  if (!Array.isArray(files)) {
    throw new Error('Expected array from directory listing, got: ' + JSON.stringify(files));
  }

  const mdFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.md'));
  console.log(`Found ${mdFiles.length} markdown files to process.`);

  for (const file of mdFiles) {
    // Delete junk files
    if (JUNK_FILES.includes(file.name)) {
      console.log(`Deleting junk file: ${file.name}`);
      try {
        await deleteFile(file.path, file.sha, `cleanup: remove junk file ${file.name}`);
        console.log(`  Deleted: ${file.name}`);
      } catch (e) {
        console.warn(`  Warning: Could not delete ${file.name}: ${e.message}`);
      }
      continue;
    }

    // Determine category
    let targetCategory = 'uncategorized';
    for (const [category, names] of Object.entries(CATEGORIES)) {
      if (names.includes(file.name)) {
        targetCategory = category;
        break;
      }
    }

    console.log(`Processing: ${file.name} -> ${targetCategory}/`);

    try {
      // Get file content
      const { content, sha: fileSha } = await getFileContent(file.path);
      const cleaned = cleanContent(content);
      const newPath = `${baseDir}/${targetCategory}/${file.name}`;

      // Check if target already exists
      let targetSha = undefined;
      try {
        const existing = await apiRequest('GET', `/repos/${owner}/${repo}/contents/${newPath}?ref=${branch}`);
        targetSha = existing.sha;
      } catch (e) {
        // File doesn't exist at target, that's fine
      }

      // Write to new location
      await createOrUpdateFile(newPath, cleaned, `reorg: move and clean ${file.name}`, targetSha);

      // Delete from original location
      await deleteFile(file.path, fileSha, `reorg: remove legacy ${file.name}`);

      console.log(`  Done: ${file.name}`);
    } catch (e) {
      console.error(`  Error processing ${file.name}: ${e.message}`);
    }
  }

  console.log('Reorganization complete!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
