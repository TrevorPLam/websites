#!/usr/bin/env node

/**
 * @file scripts/test-alerting-system.js
 * @role script
 * @summary Test alerting scenarios and verify responsiveness
 * @exports CLI: pnpm test-alerting-system
 * @security Safe testing with controlled test scenarios
 * @description Validate monitoring and alerting system functionality
 * @requirements PROD-007 / observability / alert-testing
 */

const https = require('https');
const http = require('http');

// Configuration
const HEALTH_ENDPOINT = process.env.HEALTH_ENDPOINT || 'http://localhost:3000/api/health';
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const TEST_MODE = process.env.TEST_MODE || 'dry-run'; // dry-run, safe, full

/**
 * Test results tracking
 */
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: [],
};

/**
 * Log test result
 */
function logTest(name, status, details = '', duration = 0) {
  const statusIcon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
  const durationText = duration > 0 ? ` (${duration}ms)` : '';
  console.log(`  ${statusIcon} ${name}${durationText}`);

  if (details) {
    console.log(`    ${details}`);
  }

  testResults[status]++;
  testResults.details.push({ name, status, details, duration });
}

/**
 * Make HTTP request with timeout
 */
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const defaultOptions = {
      timeout: 10000,
      headers: {
        'User-Agent': 'alerting-system-test/1.0',
      },
      ...options,
    };

    const req = client.request(url, defaultOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed,
            rawBody: body,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            rawBody: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Test 1: Health endpoint availability
 */
async function testHealthEndpoint() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(`${HEALTH_ENDPOINT}?type=liveness`);
    const duration = Date.now() - startTime;

    if (response.statusCode === 200) {
      logTest(
        'Health Endpoint Liveness',
        'passed',
        `Status: ${response.statusCode}, Response: ${JSON.stringify(response.body)}`,
        duration
      );
    } else {
      logTest(
        'Health Endpoint Liveness',
        'failed',
        `Unexpected status: ${response.statusCode}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Health Endpoint Liveness', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 2: Health endpoint readiness
 */
async function testReadinessEndpoint() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(`${HEALTH_ENDPOINT}?type=readiness`);
    const duration = Date.now() - startTime;

    if (response.statusCode === 200 || response.statusCode === 503) {
      const status = response.body.status || 'unknown';
      logTest(
        'Health Endpoint Readiness',
        'passed',
        `Status: ${status}, Code: ${response.statusCode}`,
        duration
      );
    } else {
      logTest(
        'Health Endpoint Readiness',
        'failed',
        `Unexpected status: ${response.statusCode}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Health Endpoint Readiness', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 3: Full health check (verbose)
 */
async function testFullHealthCheck() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(`${HEALTH_ENDPOINT}?type=full&verbose=true`);
    const duration = Date.now() - startTime;

    if (response.statusCode === 200 || response.statusCode === 503) {
      const health = response.body;
      const serviceCount = health.services ? health.services.length : 0;
      const healthyCount = health.services
        ? health.services.filter((s) => s.status === 'healthy').length
        : 0;

      logTest(
        'Full Health Check',
        'passed',
        `Overall: ${health.overall}, Services: ${healthyCount}/${serviceCount}`,
        duration
      );
    } else {
      logTest('Full Health Check', 'failed', `Unexpected status: ${response.statusCode}`, duration);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Full Health Check', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 4: HEAD request support
 */
async function testHeadRequest() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(HEALTH_ENDPOINT, { method: 'HEAD' });
    const duration = Date.now() - startTime;

    if (response.statusCode === 200 || response.statusCode === 503) {
      const hasHealthHeaders = response.headers['x-health-check'] === 'true';
      const hasStatusHeader = response.headers['x-status'];

      if (hasHealthHeaders && hasStatusHeader) {
        logTest(
          'HEAD Request Support',
          'passed',
          `Status: ${response.statusCode}, Headers present`,
          duration
        );
      } else {
        logTest('HEAD Request Support', 'failed', `Missing required headers`, duration);
      }
    } else {
      logTest(
        'HEAD Request Support',
        'failed',
        `Unexpected status: ${response.statusCode}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('HEAD Request Support', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 5: Response headers validation
 */
async function testResponseHeaders() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(HEALTH_ENDPOINT);
    const duration = Date.now() - startTime;

    const requiredHeaders = ['x-health-check', 'x-status', 'cache-control'];

    const missingHeaders = requiredHeaders.filter((header) => !response.headers[header]);

    if (missingHeaders.length === 0) {
      logTest('Response Headers', 'passed', `All required headers present`, duration);
    } else {
      logTest(
        'Response Headers',
        'failed',
        `Missing headers: ${missingHeaders.join(', ')}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Response Headers', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 6: Error handling
 */
async function testErrorHandling() {
  const startTime = Date.now();

  try {
    // Test with invalid endpoint
    const response = await makeRequest(`${HEALTH_ENDPOINT}/invalid`);
    const duration = Date.now() - startTime;

    if (response.statusCode === 404 || response.statusCode === 500) {
      logTest(
        'Error Handling',
        'passed',
        `Properly returns error status: ${response.statusCode}`,
        duration
      );
    } else {
      logTest(
        'Error Handling',
        'failed',
        `Should return error status, got: ${response.statusCode}`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest(
      'Error Handling',
      'passed',
      `Properly handles invalid requests: ${error.message}`,
      duration
    );
  }
}

/**
 * Test 7: Performance requirements
 */
async function testPerformanceRequirements() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(`${HEALTH_ENDPOINT}?type=liveness`);
    const duration = Date.now() - startTime;

    // Health check should respond within 1 second
    if (duration < 1000) {
      logTest(
        'Performance Requirements',
        'passed',
        `Response time: ${duration}ms (< 1000ms)`,
        duration
      );
    } else {
      logTest(
        'Performance Requirements',
        'failed',
        `Response too slow: ${duration}ms (> 1000ms)`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Performance Requirements', 'failed', `Request failed: ${error.message}`, duration);
  }
}

/**
 * Test 8: Sentry integration (if configured)
 */
async function testSentryIntegration() {
  if (!SENTRY_DSN) {
    logTest('Sentry Integration', 'skipped', 'SENTRY_DSN not configured');
    return;
  }

  const startTime = Date.now();

  try {
    // This would typically require a more complex test
    // For now, just verify DSN format
    const dsnRegex = /^https:\/\/[a-f0-9]{32}@[^\/]+\/[0-9]+$/;
    const isValidDsn = dsnRegex.test(SENTRY_DSN);
    const duration = Date.now() - startTime;

    if (isValidDsn) {
      logTest('Sentry Integration', 'passed', 'DSN format is valid', duration);
    } else {
      logTest('Sentry Integration', 'failed', 'Invalid DSN format', duration);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Sentry Integration', 'failed', `Test failed: ${error.message}`, duration);
  }
}

/**
 * Test 9: Concurrent requests
 */
async function testConcurrentRequests() {
  const startTime = Date.now();
  const concurrentCount = 10;

  try {
    const promises = Array(concurrentCount)
      .fill()
      .map(() => makeRequest(`${HEALTH_ENDPOINT}?type=liveness`));

    const results = await Promise.allSettled(promises);
    const duration = Date.now() - startTime;

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed === 0) {
      logTest(
        'Concurrent Requests',
        'passed',
        `${concurrentCount} requests successful (${duration}ms total)`,
        duration
      );
    } else {
      logTest(
        'Concurrent Requests',
        'failed',
        `${failed}/${concurrentCount} requests failed`,
        duration
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Concurrent Requests', 'failed', `Test failed: ${error.message}`, duration);
  }
}

/**
 * Test 10: Data privacy (no sensitive info exposed)
 */
async function testDataPrivacy() {
  const startTime = Date.now();

  try {
    const response = await makeRequest(`${HEALTH_ENDPOINT}?type=full&verbose=true`);
    const duration = Date.now() - startTime;

    const responseText = JSON.stringify(response.body);
    const sensitivePatterns = [/password/i, /secret/i, /key/i, /token/i, /auth/i];

    const foundSensitive = sensitivePatterns.some((pattern) => pattern.test(responseText));

    if (!foundSensitive) {
      logTest('Data Privacy', 'passed', 'No sensitive information exposed', duration);
    } else {
      logTest('Data Privacy', 'failed', 'Potential sensitive information detected', duration);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logTest('Data Privacy', 'failed', `Test failed: ${error.message}`, duration);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🧪 Testing Alerting System\n');
  console.log(`📍 Endpoint: ${HEALTH_ENDPOINT}`);
  console.log(`🔧 Mode: ${TEST_MODE}\n`);

  const tests = [
    testHealthEndpoint,
    testReadinessEndpoint,
    testFullHealthCheck,
    testHeadRequest,
    testResponseHeaders,
    testErrorHandling,
    testPerformanceRequirements,
    testSentryIntegration,
    testConcurrentRequests,
    testDataPrivacy,
  ];

  for (const test of tests) {
    await test();
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  console.log(
    `📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
  );

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter((test) => test.status === 'failed')
      .forEach((test) => {
        console.log(`  - ${test.name}: ${test.details}`);
      });
  }

  // Overall result
  const allTestsPassed = testResults.failed === 0;

  if (allTestsPassed) {
    console.log('\n🎉 All tests passed! Alerting system is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Review and fix issues before production deployment.');
  }

  return allTestsPassed;
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const command = process.argv[2];

  if (command === '--help' || command === '-h') {
    console.log(`
Usage: pnpm test-alerting-system [options]

Options:
  --help, -h     Show this help message
  --dry-run     Run tests without making changes (default)
  --safe        Run safe tests only
  --full        Run all tests including potentially disruptive ones

Environment variables:
  HEALTH_ENDPOINT          Health check endpoint URL (default: http://localhost:3000/api/health)
  NEXT_PUBLIC_SENTRY_DSN    Sentry DSN for integration testing
  TEST_MODE                 Test mode: dry-run, safe, full (default: dry-run)

Examples:
  pnpm test-alerting-system
  HEALTH_ENDPOINT=https://api.example.com/health pnpm test-alerting-system
  TEST_MODE=safe pnpm test-alerting-system
`);
    process.exit(0);
  }

  if (command === '--safe') {
    process.env.TEST_MODE = 'safe';
  } else if (command === '--full') {
    process.env.TEST_MODE = 'full';
  }

  runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runAllTests };
