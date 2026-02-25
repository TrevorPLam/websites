#!/usr/bin/env node

/**
 * @file test-health-direct.js
 * @summary Direct test of health-checks.ts without going through the barrel export.
 * @description Tests health check system by importing directly from source.
 * @security Test utility script for development validation.
 * @adr none
 * @requirements none
 */

// Import the health check system directly
const { HealthCheckManager } = require('./packages/infrastructure/src/monitoring/health-checks.ts');

async function testHealthChecks() {
  console.log('🧪 Testing Health Check Manager (Direct Import)...\n');

  try {
    // Test that the class can be instantiated
    console.log('Creating HealthCheckManager instance...');
    const manager = new HealthCheckManager();
    console.log('✅ HealthCheckManager created successfully');

    // Test that the manager has the expected methods
    console.log('Checking available methods...');
    const methods = ['getLiveness', 'getReadiness', 'runAllHealthChecks'];

    methods.forEach((method) => {
      if (typeof manager[method] === 'function') {
        console.log(`✅ ${method} method exists`);
      } else {
        console.log(`❌ ${method} method missing`);
      }
    });

    // Test liveness check (this should work without external dependencies)
    console.log('\nTesting liveness check...');
    const liveness = await manager.getLiveness();
    console.log('✅ Liveness check result:', liveness);

    console.log('\n🎉 Health Check Manager basic functionality verified!');
    console.log('Note: Full health checks require environment variables for external services');
  } catch (error) {
    console.error('❌ Health Check Manager test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testHealthChecks();
