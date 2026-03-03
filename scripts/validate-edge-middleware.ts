/**
 * @file scripts/validate-edge-middleware.ts
 * @summary Validation script for TASK-EDGE-001 edge middleware implementation
 * @description Validates middleware configuration, imports, and basic functionality
 * @security none
 * @requirements TASK-EDGE-001: Global Edge Middleware with Vercel Platforms
 * @usage pnpm tsx scripts/validate-edge-middleware.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

async function validateEdgeMiddleware() {
  console.log('🔍 Validating TASK-EDGE-001: Global Edge Middleware Implementation\n');

  const results = {
    middlewareFile: false,
    tenantResolver: false,
    edgeConfig: false,
    exports: false,
    imports: false,
    securityHeaders: false,
    tenantResolution: false,
  };

  // 1. Check middleware.ts exists and has required content
  try {
    const middlewarePath = resolve('apps/web/middleware.ts');
    const middlewareContent = readFileSync(middlewarePath, 'utf-8');

    if (middlewareContent.includes('export async function middleware')) {
      results.middlewareFile = true;
      console.log('✅ middleware.ts exists with middleware function');
    }

    if (middlewareContent.includes('resolveTenant')) {
      results.imports = true;
      console.log('✅ Tenant resolver import found');
    }

    if (middlewareContent.includes('addSecurityHeaders')) {
      results.securityHeaders = true;
      console.log('✅ Security headers function implemented');
    }

    if (middlewareContent.includes('x-tenant-id')) {
      results.tenantResolution = true;
      console.log('✅ Tenant header injection implemented');
    }
  } catch (error) {
    console.log('❌ middleware.ts validation failed:', error.message);
  }

  // 2. Check tenant-resolver.ts exists and exports
  try {
    const resolverPath = resolve('packages/infrastructure/edge/tenant-resolver.ts');
    const resolverContent = readFileSync(resolverPath, 'utf-8');

    if (resolverContent.includes('export async function resolveTenant')) {
      results.tenantResolver = true;
      console.log('✅ tenant-resolver.ts exists with resolveTenant function');
    }
  } catch (error) {
    console.log('❌ tenant-resolver.ts validation failed:', error.message);
  }

  // 3. Check edge config.ts exists
  try {
    const configPath = resolve('packages/infrastructure/edge/config.ts');
    const configContent = readFileSync(configPath, 'utf-8');

    if (configContent.includes('EdgeConfigClient')) {
      results.edgeConfig = true;
      console.log('✅ config.ts exists with EdgeConfigClient');
    }
  } catch (error) {
    console.log('❌ config.ts validation failed:', error.message);
  }

  // 4. Check infrastructure exports
  try {
    const indexPath = resolve('packages/infrastructure/index.ts');
    const indexContent = readFileSync(indexPath, 'utf-8');

    if (
      indexContent.includes('./edge/tenant-resolver.ts') &&
      indexContent.includes('./edge/config.ts')
    ) {
      results.exports = true;
      console.log('✅ Edge modules exported from infrastructure package');
    }
  } catch (error) {
    console.log('❌ exports validation failed:', error.message);
  }

  // Summary
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`\n📊 Validation Summary: ${passed}/${total} checks passed`);

  if (passed === total) {
    console.log('🎉 TASK-EDGE-001 implementation is complete and valid!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Configure Vercel Edge Config with tenant data');
    console.log('2. Deploy to Vercel for testing');
    console.log('3. Test wildcard domain routing');
    console.log('4. Validate custom domain support');
  } else {
    console.log('⚠️  Some validations failed. Please check the implementation.');
  }

  return passed === total;
}

// Run validation
validateEdgeMiddleware().catch(console.error);
