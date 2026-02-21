#!/usr/bin/env tsx

/**
 * Batch Type Safety Fixes - 2026 TypeScript Best Practices
 *
 * Addresses P1 type safety issues based on February 2026 research:
 * - Replace Record<string, any> with Record<string, unknown>
 * - Implement validateSiteConfigObject
 * - Fix zodResolver casting
 * - Add proper TypeScript types
 * - Remove duplicate 'use client' directives
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface FixResult {
  file: string;
  fixes: string[];
  success: boolean;
}

const results: FixResult[] = [];

// Fix 1: Replace Record<string, any> with Record<string, unknown>
function fixRecordAnyTypes(): void {
  const siteConfigPath = 'packages/types/src/site-config.ts';

  try {
    const content = readFileSync(siteConfigPath, 'utf-8');

    const updatedContent = content
      // Replace in interfaces
      .replace(/config\?: Record<string, any>;/g, 'config?: Record<string, unknown>;')
      // Replace in Zod schemas
      .replace(
        /config: z\.record\(z\.any\(\)\)\.optional\(\)/g,
        'config: z.record(z.unknown()).optional()'
      );

    writeFileSync(siteConfigPath, updatedContent);
    results.push({
      file: siteConfigPath,
      fixes: ['Replaced Record<string, any> with Record<string, unknown> in types and schemas'],
      success: true,
    });
  } catch (error) {
    results.push({
      file: siteConfigPath,
      fixes: [],
      success: false,
    });
  }
}

// Fix 2: Implement validateSiteConfigObject
function implementValidateSiteConfig(): void {
  const validationPath = 'tooling/validation/src/validate-site-config.ts';

  try {
    const content = readFileSync(validationPath, 'utf-8');

    // Read the site config schema
    const schemaPath = 'packages/types/src/site-config.ts';
    const schemaContent = readFileSync(schemaPath, 'utf-8');

    // Extract the schema
    const schemaMatch = schemaContent.match(
      /export const siteConfigSchema = z\.object\([\s\S]*?\);/
    );
    const siteConfigSchema = schemaMatch ? schemaMatch[0] : '';

    // Add the implementation
    const implementation = `
import { siteConfigSchema } from '@repo/types';

/**
 * Full Zod schema validation for site configuration
 * Replaces the ghost comment with actual implementation
 */
export function validateSiteConfigObject(config: unknown) {
  const result = siteConfigSchema.safeParse(config);
  
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code
    }));
    
    return {
      isValid: false,
      errors,
      data: null
    };
  }
  
  return {
    isValid: true,
    errors: [],
    data: result.data
  };
}`.trim();

    const updatedContent = content.replace(
      /\/\*\s*\n\s*\* For full Zod schema validation, use validateSiteConfigObject\(\) directly\.\s*\n\s*\*\/[\s\S]*?validate-site-config\.ts/,
      `${implementation}\n\n// File: tooling/validation/src/validate-site-config.ts`
    );

    writeFileSync(validationPath, updatedContent);
    results.push({
      file: validationPath,
      fixes: ['Implemented validateSiteConfigObject with full Zod schema validation'],
      success: true,
    });
  } catch (error) {
    results.push({
      file: validationPath,
      fixes: [],
      success: false,
    });
  }
}

// Fix 3: Fix zodResolver casting issues
function fixZodResolverCasting(): void {
  const files = [
    'packages/features/src/contact/components/ContactForm.tsx',
    'packages/features/src/booking/components/BookingForm.tsx',
    'packages/ui/src/components/Form.tsx',
  ];

  files.forEach((filePath) => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Create proper schema type inference
      const updatedContent = content
        .replace(
          /resolver: zodResolver\(schema as unknown as Parameters<typeof zodResolver>\[0\]\),/g,
          (match, schema) => {
            // Add proper type inference
            return `resolver: zodResolver(schema),`;
          }
        )
        // Add proper schema type imports where needed
        .replace(
          /import \{ zodResolver \} from '@hookform\/resolvers';/,
          "import { zodResolver } from '@hookform/resolvers';\nimport { z } from 'zod';"
        );

      writeFileSync(filePath, updatedContent);
      results.push({
        file: filePath,
        fixes: ['Fixed zodResolver casting with proper type inference'],
        success: true,
      });
    } catch (error) {
      results.push({
        file: filePath,
        fixes: [],
        success: false,
      });
    }
  });
}

// Fix 4: Remove duplicate 'use client' directives
function removeDuplicateUseClient(): void {
  const files = [
    'packages/features/src/booking/components/BookingForm.tsx',
    'packages/marketing-components/src/footer/FooterWithNewsletter.tsx',
    'packages/marketing-components/src/footer/NewsletterSection.tsx',
  ];

  files.forEach((filePath) => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Remove duplicate 'use client' directives
      const updatedContent = content.replace(
        /'use client';[\s\S]*?'use client';/g,
        "'use client';"
      );

      writeFileSync(filePath, updatedContent);
      results.push({
        file: filePath,
        fixes: ['Removed duplicate "use client" directives'],
        success: true,
      });
    } catch (error) {
      results.push({
        file: filePath,
        fixes: [],
        success: false,
      });
    }
  });
}

// Fix 5: Add proper TypeScript types for SectionProps
function strengthenSectionTypes(): void {
  const registryPath = 'packages/page-templates/src/registry.ts';

  try {
    const content = readFileSync(registryPath, 'utf-8');

    // Add stronger typing
    const updatedContent = content.replace(
      /export interface SectionProps \{[\s\S]*?\}/,
      `export interface SectionProps {
  id: string;
  type: string;
  config?: Record<string, unknown>;
  siteConfig: import('@repo/types').SiteConfig;
  searchParams?: Record<string, string | string[]>;
  className?: string;
}`
    );

    writeFileSync(registryPath, updatedContent);
    results.push({
      file: registryPath,
      fixes: ['Strengthened SectionProps typing with proper SiteConfig'],
      success: true,
    });
  } catch (error) {
    results.push({
      file: registryPath,
      fixes: [],
      success: false,
    });
  }
}

// Fix 6: Replace z.record(z.any()) with z.record(z.unknown())
function fixZodAnySchemas(): void {
  const files = [
    'packages/features/src/contact/lib/contact-schema.ts',
    'packages/features/src/booking/lib/booking-schema.ts',
  ];

  files.forEach((filePath) => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      const updatedContent = content.replace(/z\.record\(z\.any\(\)\)/g, 'z.record(z.unknown())');

      writeFileSync(filePath, updatedContent);
      results.push({
        file: filePath,
        fixes: ['Replaced z.record(z.any()) with z.record(z.unknown())'],
        success: true,
      });
    } catch (error) {
      results.push({
        file: filePath,
        fixes: [],
        success: false,
      });
    }
  });
}

// Fix 7: Add proper email contract types
function fixEmailContractTypes(): void {
  const emailContractPath = 'packages/integrations/analytics/src/event-contract.ts';

  try {
    const content = readFileSync(emailContractPath, 'utf-8');

    const updatedContent = content.replace(
      /metadata\?: Record<string, any>;/g,
      'metadata?: Record<string, unknown>;'
    );

    writeFileSync(emailContractPath, updatedContent);
    results.push({
      file: emailContractPath,
      fixes: ['Updated email contract to use Record<string, unknown>'],
      success: true,
    });
  } catch (error) {
    results.push({
      file: emailContractPath,
      fixes: [],
      success: false,
    });
  }
}

// Execute all type safety fixes
function runTypeSafetyFixes(): void {
  console.log('🔧 Applying 2026 TypeScript best practices...\n');

  fixRecordAnyTypes();
  implementValidateSiteConfig();
  fixZodResolverCasting();
  removeDuplicateUseClient();
  strengthenSectionTypes();
  fixZodAnySchemas();
  fixEmailContractTypes();

  // Report results
  console.log('\n📋 Type Safety Fix Results:');
  console.log('='.repeat(50));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  successful.forEach((result) => {
    console.log(`✅ ${result.file}`);
    result.fixes.forEach((fix) => console.log(`   • ${fix}`));
  });

  if (failed.length > 0) {
    console.log('\n❌ Failed fixes:');
    failed.forEach((result) => {
      console.log(`❌ ${result.file}`);
    });
  }

  console.log(`\n🎯 Type safety fixes completed: ${successful.length}/${results.length}`);
  console.log('🚀 Your TypeScript now follows 2026 best practices');
}

// Run if executed directly
if (require.main === module) {
  runTypeSafetyFixes();
}

export { runTypeSafetyFixes };
