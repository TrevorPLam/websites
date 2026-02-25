#!/usr/bin/env node

/**
 * Simple test script to verify health check system works
 */

const { HealthCheckManager } = require('./packages/infrastructure/src/monitoring/index.ts');

async function testHealthChecks() {
  console.log('🧪 Testing Health Check Manager...\n');
  
  try {
    const manager = new HealthCheckManager();
    
    // Test liveness check
    console.log('Testing liveness check...');
    const liveness = await manager.getLiveness();
    console.log('✅ Liveness:', liveness);
    
    // Test readiness check
    console.log('Testing readiness check...');
    const readiness = await manager.getReadiness();
    console.log('✅ Readiness:', readiness);
    
    // Test full health check
    console.log('Testing full health check...');
    const health = await manager.runAllHealthChecks();
    console.log('✅ Full Health Check:');
    console.log(`  Overall: ${health.overall}`);
    console.log(`  Services: ${health.services.length}`);
    console.log(`  Uptime: ${health.uptime}ms`);
    
    // Test individual services
    console.log('\n📊 Individual Service Status:');
    health.services.forEach(service => {
      const status = service.status === 'healthy' ? '✅' : '❌';
      console.log(`  ${status} ${service.service}: ${service.status} (${service.latency}ms)`);
      if (service.error) {
        console.log(`    Error: ${service.error}`);
      }
    });
    
    console.log('\n🎉 Health Check Manager working correctly!');
    
  } catch (error) {
    console.error('❌ Health Check Manager test failed:', error.message);
    process.exit(1);
  }
}

testHealthChecks();
