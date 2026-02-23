#!/usr/bin/env node

/**
 * Update task files with documentation references
 * Adds proper documentation location and status to all domain task files
 */

const fs = require('fs');
const path = require('path');

// Documentation inventory mapping
const DOCS_MAP = {
  // Multi-tenant
  'tenant-resolution-implementation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/multi-tenant/',
  },
  'billing-status-validation.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'tenant-suspension-patterns.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'noisy-neighbor-prevention.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'domain-lifecycle-management.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'enterprise-sso-integration.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'routing-strategy-comparison.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'tenant-metadata-factory.md': { status: '✅ COMPLETED', path: 'docs/guides/multi-tenant/' },
  'tenant-resolution-sequence-diagram.md': {
    status: '❌ MISSING (P0)',
    path: 'docs/guides/multi-tenant/',
  },
  'tenant-data-flow-patterns.md': { status: '❌ MISSING (P0)', path: 'docs/guides/multi-tenant/' },

  // Configuration
  'site-config-schema-documentation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/architecture/',
  },
  'zod-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/standards-specs/' },
  'config-validation-ci-pipeline.md': {
    status: '❌ MISSING (P0)',
    path: 'docs/guides/standards-specs/',
  },
  'golden-path-cli-documentation.md': {
    status: '❌ MISSING (P0)',
    path: 'docs/guides/standards-specs/',
  },
  'feature-flags-system.md': { status: '❌ MISSING (P0)', path: 'docs/guides/build-monorepo/' },

  // Database & Data
  'postgresql-rls-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/backend-data/' },
  'aws-rds-proxy-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/backend-data/' },
  'pgbouncer-supavisor-configuration.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/backend-data/',
  },
  'schema-migration-safety.md': { status: '❌ MISSING (P1)', path: 'docs/guides/backend-data/' },

  // CMS & Content
  'sanity-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/cms-content/' },
  'sanity-cms-draft-mode-2026.md': { status: '✅ COMPLETED', path: 'docs/guides/cms-content/' },
  'sanity-schema-definition.md': { status: '❌ MISSING (P1)', path: 'docs/guides/cms-content/' },
  'sanity-client-groq.md': { status: '❌ MISSING (P1)', path: 'docs/guides/cms-content/' },
  'blog-post-page-isr.md': { status: '❌ MISSING (P1)', path: 'docs/guides/cms-content/' },
  'sanity-webhook-isr.md': { status: '❌ MISSING (P1)', path: 'docs/guides/cms-content/' },

  // Accessibility
  'wcag-2.2-criteria.md': { status: '✅ COMPLETED', path: 'docs/guides/accessibility-legal/' },
  'ada-title-ii-final-rule.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/accessibility-legal/',
  },
  'hhs-section-504-docs.md': { status: '✅ COMPLETED', path: 'docs/guides/accessibility-legal/' },
  'axe-core-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/accessibility-legal/' },
  'accessibility-p0-rationale.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/accessibility-legal/',
  },
  'accessibility-component-library.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/accessibility-legal/',
  },
  'accessible-form-components.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/accessibility-legal/',
  },
  'wcag-compliance-checklist.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/accessibility-legal/',
  },
  'automated-accessibility-testing.md': {
    status: '❌ MISSING (P1)',
    path: 'docs/guides/accessibility-legal/',
  },

  // Frontend & Performance
  'nextjs-16-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },
  'react-19-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },
  'core-web-vitals-optimization.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },
  'performance-budgeting.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },
  'bundle-size-budgets.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },
  'rendering-decision-matrix.md': { status: '✅ COMPLETED', path: 'docs/guides/frontend/' },

  // Security
  'security-middleware-implementation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/security/',
  },
  'server-action-security-wrapper.md': { status: '✅ COMPLETED', path: 'docs/guides/security/' },
  'security-headers-system.md': { status: '✅ COMPLETED', path: 'docs/guides/security/' },
  'multi-layer-rate-limiting.md': { status: '✅ COMPLETED', path: 'docs/guides/security/' },
  'secrets-manager.md': { status: '✅ COMPLETED', path: 'docs/guides/security/' },
  'supabase-auth-docs.md': { status: '✅ COMPLETED', path: 'docs/guides/security/' },

  // Build & Monorepo
  'pnpm-workspaces-documentation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/build-monorepo/',
  },
  'turborepo-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/build-monorepo/' },
  'turborepo-remote-caching.md': { status: '✅ COMPLETED', path: 'docs/guides/build-monorepo/' },
  'pnpm-deploy-documentation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/infrastructure-devops/',
  },
  'pnpm-vs-yarn-vs-npm-benchmarks.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/build-monorepo/',
  },
  'renovate-configuration-documentation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/best-practices/',
  },
  'git-branching-strategies.md': { status: '✅ COMPLETED', path: 'docs/guides/best-practices/' },
  'feature-flags-system.md': { status: '❌ MISSING (P0)', path: 'docs/guides/build-monorepo/' },

  // Lead Management
  'realtime-lead-feed-implementation.md': {
    status: '✅ COMPLETED',
    path: 'docs/guides/architecture/',
  },
  'lead-notification-template.md': { status: '✅ COMPLETED', path: 'docs/guides/email/' },
  'session-attribution-store.md': { status: '❌ MISSING (P2)', path: 'docs/guides/multi-tenant/' },
  'lead-scoring-engine.md': { status: '❌ MISSING (P2)', path: 'docs/guides/multi-tenant/' },
  'phone-click-tracker.md': { status: '❌ MISSING (P2)', path: 'docs/guides/multi-tenant/' },
  'lead-notification-system.md': { status: '❌ MISSING (P2)', path: 'docs/guides/multi-tenant/' },

  // Asset Management
  'supabase-storage-configuration.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'supabase-image-loader.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'upload-server-action.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },

  // Background Jobs
  'qstash-client-setup.md': { status: '✅ COMPLETED', path: 'docs/guides/backend-data/' },
  'queue-management-patterns.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'scheduled-tasks-automation.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'qstash-request-verification.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'email-digest-job.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'crm-sync-job.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'booking-reminder-job.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'gdpr-tenant-deletion-job.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },

  // Content Engineering
  'service-area-pages-engine.md': { status: '✅ COMPLETED', path: 'docs/guides/seo-metadata/' },
  'blog-content-architecture.md': { status: '✅ COMPLETED', path: 'docs/guides/cms-content/' },
  'service-area-route.md': { status: '❌ MISSING (P2)', path: 'docs/guides/seo-metadata/' },
  'service-area-hero-component.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/seo-metadata/',
  },
  'service-area-cache-invalidation.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/seo-metadata/',
  },

  // Real-time Systems
  'webhook-architecture-patterns.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'realtime-integration-patterns.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'realtime-dashboard-implementation.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'realtime-supabase-setup.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },
  'realtime-hook-implementation.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/backend-data/',
  },
  'realtime-lead-feed-ui.md': { status: '❌ MISSING (P2)', path: 'docs/guides/backend-data/' },

  // Sustainability
  'sustainability-measurement-patterns.md': {
    status: '❌ MISSING (P3)',
    path: 'docs/guides/standards-specs/',
  },
  'carbon-footprint-optimization.md': {
    status: '❌ MISSING (P3)',
    path: 'docs/guides/standards-specs/',
  },

  // Testing
  'contract-testing-patterns.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },
  'performance-testing-automation.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },

  // Integrations
  'stripe-documentation.md': { status: '✅ COMPLETED', path: 'docs/guides/payments-billing/' },
  'stripe-checkout-sessions.md': { status: '✅ COMPLETED', path: 'docs/guides/payments-billing/' },
  'stripe-customer-portal.md': { status: '✅ COMPLETED', path: 'docs/guides/payments-billing/' },
  'stripe-webhook-handler.md': { status: '✅ COMPLETED', path: 'docs/guides/payments-billing/' },

  // AI Integration
  'ai-content-generation-patterns.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/ai-automation/',
  },
  'automation-workflow-design.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/ai-automation/',
  },
  'ai-chat-api-streaming.md': { status: '❌ MISSING (P2)', path: 'docs/guides/ai-automation/' },

  // GEO & AI Search
  'ai-search-optimization-patterns.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/seo-metadata/',
  },
  'content-embedding-strategies.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/seo-metadata/',
  },

  // Asset Optimization
  'asset-optimization-patterns.md': { status: '❌ MISSING (P2)', path: 'docs/guides/frontend/' },
  'cdn-configuration-strategies.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'image-compression-pipeline.md': { status: '❌ MISSING (P2)', path: 'docs/guides/frontend/' },

  // Client Portal
  'settings-server-actions.md': { status: '❌ MISSING (P2)', path: 'docs/guides/architecture/' },
  'deep-merge-config-sql.md': { status: '❌ MISSING (P2)', path: 'docs/guides/architecture/' },
  'settings-form-complex.md': { status: '❌ MISSING (P2)', path: 'docs/guides/architecture/' },
  'pdf-report-template.md': { status: '❌ MISSING (P2)', path: 'docs/guides/architecture/' },
  'report-generation-job.md': { status: '❌ MISSING (P2)', path: 'docs/guides/architecture/' },

  // Operations
  'production-deployment-strategies.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'operational-excellence-patterns.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'environment-architecture.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'full-cicd-pipeline.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'zero-downtime-migration.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'rollback-procedure.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },
  'fresh-environment-setup.md': {
    status: '❌ MISSING (P2)',
    path: 'docs/guides/infrastructure-devops/',
  },

  // Testing & QA
  'playwright-config-e2e.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },
  'auth-setup-testing.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },
  'test-fixtures-e2e.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },
  'critical-test-suites.md': { status: '❌ MISSING (P2)', path: 'docs/guides/testing/' },
};

// Domain to documentation mapping
const DOMAIN_DOCS = {
  'domain-2': [
    'site-config-schema-documentation.md',
    'zod-documentation.md',
    'config-validation-ci-pipeline.md',
    'golden-path-cli-documentation.md',
  ],
  'domain-6': [
    'postgresql-rls-documentation.md',
    'aws-rds-proxy-documentation.md',
    'pgbouncer-supavisor-configuration.md',
    'schema-migration-safety.md',
  ],
  'domain-7': [
    'tenant-resolution-implementation.md',
    'billing-status-validation.md',
    'tenant-suspension-patterns.md',
    'noisy-neighbor-prevention.md',
    'domain-lifecycle-management.md',
    'enterprise-sso-integration.md',
    'routing-strategy-comparison.md',
    'tenant-metadata-factory.md',
    'tenant-resolution-sequence-diagram.md',
    'tenant-data-flow-patterns.md',
  ],
  'domain-8': [
    'sanity-documentation.md',
    'sanity-cms-draft-mode-2026.md',
    'sanity-schema-definition.md',
    'sanity-client-groq.md',
    'blog-post-page-isr.md',
    'sanity-webhook-isr.md',
  ],
  'domain-14': [
    'wcag-2.2-criteria.md',
    'ada-title-ii-final-rule.md',
    'hhs-section-504-docs.md',
    'axe-core-documentation.md',
    'accessibility-p0-rationale.md',
    'accessibility-component-library.md',
    'accessible-form-components.md',
    'wcag-compliance-checklist.md',
    'automated-accessibility-testing.md',
  ],
  'domain-5': [
    'nextjs-16-documentation.md',
    'react-19-documentation.md',
    'core-web-vitals-optimization.md',
    'performance-budgeting.md',
    'bundle-size-budgets.md',
    'rendering-decision-matrix.md',
  ],
  'domain-4': [
    'security-middleware-implementation.md',
    'server-action-security-wrapper.md',
    'security-headers-system.md',
    'multi-layer-rate-limiting.md',
    'secrets-manager.md',
    'supabase-auth-docs.md',
  ],
  // NEW DOMAINS TO ADD
  'domain-1': [
    'pnpm-workspaces-documentation.md',
    'turborepo-documentation.md',
    'turborepo-remote-caching.md',
    'pnpm-deploy-documentation.md',
    'pnpm-vs-yarn-vs-npm-benchmarks.md',
    'renovate-configuration-documentation.md',
    'git-branching-strategies.md',
    'feature-flags-system.md',
  ],
  'domain-9': [
    'realtime-lead-feed-implementation.md',
    'lead-notification-template.md',
    'session-attribution-store.md',
    'lead-scoring-engine.md',
    'phone-click-tracker.md',
    'lead-notification-system.md',
  ],
  'domain-10': [
    'supabase-storage-configuration.md',
    'supabase-image-loader.md',
    'upload-server-action.md',
  ],
  'domain-11': [
    'qstash-client-setup.md',
    'queue-management-patterns.md',
    'scheduled-tasks-automation.md',
    'qstash-request-verification.md',
    'email-digest-job.md',
    'crm-sync-job.md',
    'booking-reminder-job.md',
    'gdpr-tenant-deletion-job.md',
  ],
  'domain-12': [
    'service-area-pages-engine.md',
    'blog-content-architecture.md',
    'service-area-route.md',
    'service-area-hero-component.md',
    'service-area-cache-invalidation.md',
  ],
  'domain-13': [
    'realtime-lead-feed-implementation.md',
    'webhook-architecture-patterns.md',
    'realtime-integration-patterns.md',
    'realtime-dashboard-implementation.md',
    'realtime-supabase-setup.md',
    'realtime-hook-implementation.md',
    'realtime-lead-feed-ui.md',
  ],
  'domain-15': [
    'green-software-foundation-sci-spec.md',
    'sci-calculation-examples.md',
    'sustainability-measurement-patterns.md',
    'carbon-footprint-optimization.md',
  ],
  'domain-16': [
    'playwright-best-practices.md',
    'playwright-documentation.md',
    'testing-library-documentation.md',
    'vitest-documentation.md',
    'contract-testing-patterns.md',
    'performance-testing-automation.md',
  ],
  'domain-17': [
    'stripe-documentation.md',
    'stripe-checkout-sessions.md',
    'stripe-customer-portal.md',
    'stripe-webhook-handler.md',
  ],
  'domain-18': [
    'ai-context-json-proposal.md',
    'ai-context-management.md',
    'agents-md-patterns.md',
    'ai-content-generation-patterns.md',
    'automation-workflow-design.md',
    'ai-chat-api-streaming.md',
  ],
  'domain-20': [
    'llms-txt-spec.md',
    'schema-org-documentation.md',
    'generative-engine-optimization-2026.md',
    'ai-search-optimization-patterns.md',
    'content-embedding-strategies.md',
  ],
  'domain-22': [
    'asset-optimization-patterns.md',
    'cdn-configuration-strategies.md',
    'image-compression-pipeline.md',
  ],
  'domain-31': [
    'client-portal-configuration.md',
    'white-label-portal-architecture.md',
    'report-generation-engine.md',
    'settings-server-actions.md',
    'deep-merge-config-sql.md',
    'settings-form-complex.md',
    'pdf-report-template.md',
    'report-generation-job.md',
  ],
  'domain-35': [
    'e2e-testing-suite-patterns.md',
    'deployment-runbook.md',
    'production-deployment-strategies.md',
    'operational-excellence-patterns.md',
    'environment-architecture.md',
    'full-cicd-pipeline.md',
    'zero-downtime-migration.md',
    'rollback-procedure.md',
    'fresh-environment-setup.md',
  ],
  'domain-36': [
    'axe-core-documentation.md',
    'e2e-testing-suite-patterns.md',
    'playwright-config-e2e.md',
    'auth-setup-testing.md',
    'test-fixtures-e2e.md',
    'critical-test-suites.md',
  ],
};

function updateTaskFile(filePath, domain) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has documentation reference
    if (content.includes('**Documentation Reference:**')) {
      console.log(`⏭️  Skipping ${filePath} - already has documentation reference`);
      return;
    }

    // Find the Context section
    const contextMatch = content.match(/^## Context$/m);
    if (!contextMatch) {
      console.log(`⚠️  No Context section found in ${filePath}`);
      return;
    }

    // Get relevant docs for this domain
    const relevantDocs = DOMAIN_DOCS[domain] || [];
    const docLines = relevantDocs
      .map((doc) => {
        const docInfo = DOCS_MAP[doc];
        if (!docInfo) return null;
        return `- ${doc
          .replace('.md', '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())}: \`${docInfo.path + doc}\` ${docInfo.status}`;
      })
      .filter(Boolean);

    if (docLines.length === 0) {
      console.log(`ℹ️  No relevant documentation found for ${domain}`);
      return;
    }

    // Create documentation reference section
    const docSection = `**Documentation Reference:**\n${docLines.join('\n')}\n\n**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.`;

    // Insert after Context section
    const contextIndex = contextMatch.index;
    const insertPoint = content.indexOf('\n', contextIndex) + 1;

    const newContent =
      content.slice(0, insertPoint) + '\n' + docSection + '\n' + content.slice(insertPoint);

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function main() {
  const tasksDir = path.join(__dirname, '../tasks');

  console.log('🔄 Updating task files with documentation references...\n');

  // Process each domain directory
  Object.keys(DOMAIN_DOCS).forEach((domain) => {
    const domainDir = path.join(tasksDir, domain);

    if (!fs.existsSync(domainDir)) {
      console.log(`⚠️  Domain directory not found: ${domainDir}`);
      return;
    }

    // Find all .md files in domain directory
    const files = fs.readdirSync(domainDir).filter((file) => file.endsWith('.md'));

    files.forEach((file) => {
      const filePath = path.join(domainDir, file);
      updateTaskFile(filePath, domain);
    });
  });

  console.log('\n✨ Task documentation update complete!');
}

if (require.main === module) {
  main();
}

module.exports = { updateTaskFile, DOCS_MAP, DOMAIN_DOCS };
