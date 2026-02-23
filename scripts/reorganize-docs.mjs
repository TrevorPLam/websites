import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";

/**
 * Reorganization Script for docs/guides
 * Performs:
 * 1. Categorization into subfolders
 * 2. Content cleanup (removal of agentic boilerplate)
 * 3. Deduplication and consolidation
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const owner = "TrevorPLam";
const repo = "websites";
const baseDir = "docs/guides";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const CATEGORIES = {
  "ai-automation": [
    "agents-md-patterns.md", "per-package-agents-stubs.md", "root-agents-master.md",
    "ai-agent-cold-start-checklist.md", "claude-code-integration.md",
    "claude-sub-agent-definitions.md", "autonomous-janitor-design.md",
    "ai-context-json-proposal.md", "ai-context-management.md"
  ],
  "frontend": [
    "nextjs-16-documentation.md", "nextjs-middleware-documentation.md",
    "react-19-documentation.md", "react-compiler-docs.md",
    "react-hook-form-documentation.md", "tailwindcss-v4-documentation.md",
    "css-variables-guide.md"
  ],
  "backend-data": [
    "aws-rds-proxy-documentation.md", "postgresql-pg-stat-statements.md",
    "postgresql-rls-documentation.md", "pglite-documentation.md",
    "clickhouse-documentation.md", "electricsql-docs.md",
    "upstash-redis-documentation.md", "upstash-ratelimit-documentation.md"
  ],
  "infrastructure-devops": [
    "deployment-runbook.md", "github-actions-docs.md", "pnpm-deploy-documentation.md",
    "terraform-aws-provider-docs.md", "terraform-supabase-provider-docs.md",
    "terraform-vercel-provider-docs.md", "opentofu-documentation.md",
    "nx-cloud-documentation.md", "vercel-domains-api-docs.md",
    "vercel-for-platforms-docs.md"
  ],
  "observability": [
    "opentelemetry-documentation.md", "opentelemetry-instrumentation.md",
    "opentelemetry-nextjs-instrumentation.md", "vercel-otel-documentation.md",
    "sentry-documentation.md"
  ],
  "testing": [
    "playwright-best-practices.md", "playwright-documentation.md",
    "testing-library-documentation.md", "vitest-documentation.md",
    "e2e-testing-suite-patterns.md"
  ],
  "build-monorepo": [
    "pnpm-vs-yarn-vs-npm-benchmarks.md", "pnpm-workspaces-documentation.md",
    "nx-affected-documentation.md", "nx-core-team-whitepaper.md",
    "turborepo-documentation.md", "turborepo-remote-caching.md",
    "turbo-json-configuration.md", "changesets-documentation.md"
  ],
  "accessibility-legal": [
    "ada-title-ii-final-rule.md", "wcag-2.2-criteria.md", "axe-core-documentation.md",
    "hhs-section-504-docs.md", "gdpr-guide.md"
  ],
  "design-tokens": [
    "design-tokens-w3c-cg-report.md", "style-dictionary-documentation.md"
  ],
  "payments-billing": [
    "billing-page-components.md", "stripe-checkout-sessions.md",
    "stripe-customer-portal.md", "stripe-documentation.md"
  ],
  "cms-content": [
    "sanity-documentation.md", "storyblok-documentation.md", "blog-content-architecture.md"
  ],
  "seo-metadata": [
    "schema-org-documentation.md", "dynamic-og-images.md",
    "dynamic-sitemap-generation.md", "metadata-generation-system.md",
    "structured-data-system.md"
  ],
  "standards-specs": [
    "semver-spec.md", "cyclonedx-spec.md", "spdx-spec.md",
    "slsa-provenance-spec.md", "llms-txt-spec.md",
    "green-software-foundation-sci-spec.md", "sci-calculation-examples.md"
  ],
  "best-practices": [
    "thin-vertical-slice-guide.md", "feature-sliced-design-docs.md",
    "reversibility-principles.md", "prioritization-framework.md",
    "quality-assurance-checklist.md", "independent-release-patterns.md",
    "internal-developer-portal-patterns.md", "cli-scaffold-design.md"
  ],
  "email": [
    "resend-documentation.md", "postmark-documentation.md",
    "email-package-structure.md", "multi-tenant-email-routing.md",
    "unified-email-send.md"
  ],
  "security": [
    "pqc-migration-strategy.md", "nist-fips-203-204-205.md", "nist-report-on-hqc.md",
    "noble-post-quantum-documentation.md", "github-signing-commits-docs.md",
    "security-headers-system.md", "security-middleware-implementation.md",
    "server-action-security-wrapper.md", "secrets-manager.md"
  ],
  "architecture": [
    "architecture-decision-record-template.md", "0000-use-adrs.md", "0000.md",
    "service-area-pages-engine.md", "white-label-portal-architecture.md",
    "client-portal-configuration.md", "monorepo-context-protocol-proposal.md"
  ],
  "scheduling": [
    "acuity-scheduling-documentation.md", "calendly-documentation.md",
    "calcom-embed-widget.md", "calcom-webhook-handler.md"
  ],
  "linting": [
    "eslint-9-documentation.md", "prettier-documentation.md",
    "steiger-documentation.md", "steiger-linting-configuration.md"
  ]
};

async function cleanContent(content) {
  // Remove JSDoc-style headers
  content = content.replace(/\/\*\*[\s\S]*?\*\/
/g, "");
  // Remove fake Table of Contents blocks
  content = content.replace(/## Table of Contents[\s\S]*?(?=# |## )/g, "");
  // Remove HTML comments used for agentic metadata
  content = content.replace(/<!--[\s\S]*?-->/g, "");
  // Trim excessive whitespace
  return content.trim();
}

async function run() {
  const { data: files } = await octokit.repos.getContent({ owner, repo, path: baseDir });

  for (const file of files) {
    if (file.type !== "file" || !file.name.endsWith(".md")) continue;

    let targetCategory = "uncategorized";
    for (const [category, names] of Object.entries(CATEGORIES)) {
      if (names.includes(file.name)) {
        targetCategory = category;
        break;
      }
    }

    console.log(`Processing ${file.name} -> ${targetCategory}`);

    const { data: contentData } = await octokit.repos.getContent({
      owner, repo, path: file.path, mediaType: { format: "raw" }
    });

    const cleaned = await cleanContent(contentData);
    const newPath = `${baseDir}/${targetCategory}/${file.name}`;

    // Create new file in subfolder
    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: newPath,
      message: `reorg: move and clean ${file.name}`,
      content: Buffer.from(cleaned).toString("base64"),
      branch
    });

    // Delete old file
    await octokit.repos.deleteFile({
      owner, repo, path: file.path,
      message: `reorg: remove legacy ${file.name}`,
      sha: file.sha,
      branch
    });
  }
}

run().catch(console.error);
