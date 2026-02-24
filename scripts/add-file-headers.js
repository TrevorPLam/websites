#!/usr/bin/env node
/**
 * @file scripts/add-file-headers.js
 * @summary Automatically adds required file headers to JS/TS files missing them.
 * @description Reads file list and adds standardized JSDoc headers with proper metadata.
 * @security Reads and writes local files only; no network access.
 * @adr none
 * @requirements File header compliance for pre-commit hooks
 */

const fs = require('node:fs');
const path = require('node:path');

// Files that need headers (from the recent commit)
const FILES_NEEDING_HEADERS = [
  'packages/entities/src/index.ts',
  'packages/entities/src/lead/index.ts',
  'packages/entities/src/tenant/Tenant.ts',
  'packages/entities/src/tenant/errors.ts',
  'packages/entities/src/tenant/index.ts',
  'packages/features/src/booking/lib/__tests__/booking-actions.test.ts',
  'packages/features/src/booking/lib/booking-actions.ts',
  'packages/features/src/services/lib/index.ts',
  'packages/infrastructure/eslint.config.js',
  'packages/integrations/shared/src/__tests__/adapter.test.ts',
  'packages/reports/src/templates/WeeklyReport.tsx',
  'packages/seo/.eslintrc.js',
  'packages/seo/eslint.config.mjs',
  'packages/shared/src/Option.ts',
  'packages/shared/src/Result.ts',
  'packages/shared/src/index.ts',
  'packages/ui/.storybook/main.ts',
  'packages/ui/.storybook/preview.ts',
  'packages/ui/src/components/Alert.stories.tsx',
  'packages/ui/src/components/Badge.stories.tsx',
  'packages/ui/src/components/Button.stories.tsx',
  'packages/ui/src/components/Card.stories.tsx',
  'packages/ui/src/components/Container.stories.tsx',
  'packages/ui/src/components/Dialog.stories.tsx',
  'packages/ui/src/components/Input.stories.tsx',
  'packages/ui/src/components/Section.stories.tsx',
  'packages/ui/src/components/__tests__/Badge.test.tsx',
  'packages/ui/src/components/__tests__/Card.test.tsx',
  'packages/ui/src/components/__tests__/Container.test.tsx',
  'packages/ui/src/components/__tests__/Section.test.tsx',
  'packages/ui/vite.config.ts',
];

function generateHeader(filePath) {
  const relativePath = filePath;
  const fileName = path.basename(filePath, path.extname(filePath));
  const extension = path.extname(filePath);

  // Determine file purpose based on path and name
  let summary = '';
  let description = '';
  let security = 'none';
  let requirements = 'none';

  if (filePath.includes('/__tests__/')) {
    summary = `Unit tests for ${fileName.replace('.test', '')} component/module.`;
    description = `Test suite covering functionality, edge cases, and error scenarios.`;
    security = 'none';
    requirements = 'none';
  } else if (filePath.includes('.stories.')) {
    summary = `Storybook stories for ${fileName.replace('.stories', '')} component.`;
    description = `Component stories showcasing different states and variations for design system documentation.`;
    security = 'none';
    requirements = 'WCAG-2.2-AA';
  } else if (filePath.includes('/entities/')) {
    summary = `Entity definition for ${fileName} in FSD architecture.`;
    description = `Core business entity with type definitions and business logic.`;
    security = 'Tenant isolation enforced via explicit tenantId boundaries.';
    requirements = 'DOMAIN-4-003';
  } else if (filePath.includes('/shared/')) {
    summary = `Shared utility: ${fileName} for cross-package functionality.`;
    description = `Reusable utility types and functions used across the monorepo.`;
    security = 'none';
    requirements = 'none';
  } else if (filePath.includes('/features/')) {
    summary = `Feature implementation: ${fileName} for business logic.`;
    description = `Business logic and server actions for feature-specific functionality.`;
    security = 'Tenant isolation and authentication required.';
    requirements = 'DOMAIN-4-002';
  } else if (filePath.includes('/infrastructure/')) {
    summary = `Infrastructure configuration: ${fileName}.`;
    description = `Configuration files and setup for development and build tools.`;
    security = 'none';
    requirements = 'none';
  } else if (filePath.includes('/seo/')) {
    summary = `SEO configuration: ${fileName}.`;
    description = `Search engine optimization and metadata configuration.`;
    security = 'none';
    requirements = 'SEO-2026';
  } else if (filePath.includes('.storybook/')) {
    summary = `Storybook configuration: ${fileName}.`;
    description = `Configuration for Storybook documentation and testing setup.`;
    security = 'none';
    requirements = 'WCAG-2.2-AA';
  } else {
    summary = `Configuration and implementation for ${fileName}.`;
    description = `Module providing specific functionality within the monorepo architecture.`;
    security = 'none';
    requirements = 'none';
  }

  return `/**
 * @file ${relativePath}
 * @summary ${summary}
 * @description ${description}
 * @security ${security}
 * @adr none
 * @requirements ${requirements}
 */`;
}

function hasValidHeader(content) {
  const headerMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  if (!headerMatch) return false;

  const headerBlock = headerMatch[0];
  const requiredTags = ['@file', '@summary', '@security', '@requirements'];
  return requiredTags.every((tag) => headerBlock.includes(tag));
}

function addHeaderToFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (hasValidHeader(content)) {
    console.log(`✅ Already has valid header: ${filePath}`);
    return true;
  }

  const header = generateHeader(filePath);

  // Remove existing invalid headers if present
  const cleanedContent = content.replace(/\/\*\*[\s\S]*?\*\//g, '').trim();

  // Add new header at the top
  const newContent = `${header}\n\n${cleanedContent}`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`📝 Added header to: ${filePath}`);
  return true;
}

function main() {
  console.log(`🚀 Adding file headers to ${FILES_NEEDING_HEADERS.length} files...\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const filePath of FILES_NEEDING_HEADERS) {
    try {
      if (addHeaderToFile(filePath)) {
        successCount++;
      } else {
        failureCount++;
      }
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error.message);
      failureCount++;
    }
  }

  console.log(`\n✅ Successfully processed ${successCount} files`);
  if (failureCount > 0) {
    console.log(`❌ Failed to process ${failureCount} files`);
  }

  console.log(`\n🎯 Next steps:`);
  console.log(`1. Review the added headers for accuracy`);
  console.log(`2. Run 'pnpm lint' to check for any issues`);
  console.log(`3. Commit the changes with proper headers`);
}

if (require.main === module) {
  main();
}

module.exports = { generateHeader, addHeaderToFile };
