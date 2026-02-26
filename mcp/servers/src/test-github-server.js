#!/usr/bin/env node

/**
 * @file mcp/servers/src/test-github-server.js
 * @summary Test script for GitHub MCP server functionality
 * @description Validates all TASK 1.2 requirements for github-server.ts
 * @security Requires GITHUB_TOKEN environment variable for authentication testing.
 * @requirements MCP-001, MCP-002
 */

const { spawn } = require('child_process');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  serverPath: path.join(__dirname, 'github-server.ts'),
  testToken: process.env.TEST_GITHUB_TOKEN || 'test',
  timeout: 5000,
};

/**
 * Test GitHub MCP server against TASK 1.2 requirements
 */
async function testGitHubServer() {
  console.log('🧪 Testing GitHub MCP Server...\n');

  const results = {
    fileExists: false,
    startupValidation: false,
    tokenValidation: false,
    toolCount: 0,
    expectedTools: [
      'list-repos',
      'get-repo',
      'create-issue',
      'list-issues',
      'create-pr',
      'get-file-contents',
      'search-code',
    ],
    responseFormat: false,
    esmGuard: false,
    bearerAuth: false,
    zodValidation: false,
    configEntry: false,
  };

  try {
    // Test 1: File exists
    console.log('✅ Test 1: File exists check');
    const fs = require('fs');
    results.fileExists = fs.existsSync(TEST_CONFIG.serverPath);
    console.log(`   File exists: ${results.fileExists}\n`);

    // Test 2: Startup validation (should fail without token)
    console.log('✅ Test 2: Startup validation (no token)');
    try {
      await runServer('', 1000);
      console.log('   ❌ Server should have failed without token');
    } catch (error) {
      if (error.message.includes('GITHUB_TOKEN env var not set')) {
        results.startupValidation = true;
        console.log('   ✅ Correctly failed without GITHUB_TOKEN');
      } else {
        console.log(`   ❌ Unexpected error: ${error.message}`);
      }
    }
    console.log('');

    // Test 3: Token validation (should start with token)
    console.log('✅ Test 3: Startup validation (with token)');
    try {
      await runServer(TEST_CONFIG.testToken, 1000);
      results.tokenValidation = true;
      console.log('   ✅ Server started successfully with token');
    } catch (error) {
      console.log(`   ❌ Server failed with token: ${error.message}`);
    }
    console.log('');

    // Test 4: Tool count and names
    console.log('✅ Test 4: Tool validation');
    const content = fs.readFileSync(TEST_CONFIG.serverPath, 'utf8');
    const toolMatches = content.match(/server\.tool\(\s*'([^']+)'/g);

    if (toolMatches) {
      results.toolCount = toolMatches.length;
      const foundTools = toolMatches.map((match) => match.match(/'([^']+)'/)[1]);

      console.log(`   Found ${results.toolCount} tools:`);
      foundTools.forEach((tool) => {
        const isExpected = results.expectedTools.includes(tool);
        console.log(`   - ${tool} ${isExpected ? '✅' : '❌'}`);
      });

      const missingTools = results.expectedTools.filter((tool) => !foundTools.includes(tool));
      if (missingTools.length === 0) {
        console.log('   ✅ All expected tools present');
      } else {
        console.log(`   ❌ Missing tools: ${missingTools.join(', ')}`);
      }
    }
    console.log('');

    // Test 5: Response format
    console.log('✅ Test 5: Response format validation');
    const responseMatches = content.match(/JSON\.stringify\([^)]+\)/g);
    if (responseMatches && responseMatches.length >= 7) {
      results.responseFormat = true;
      console.log(`   ✅ Found ${responseMatches.length} JSON.stringify calls`);
    } else {
      console.log(
        `   ❌ Expected at least 7 JSON.stringify calls, found ${responseMatches?.length || 0}`
      );
    }
    console.log('');

    // Test 6: ESM CLI guard
    console.log('✅ Test 6: ESM CLI guard validation');
    if (content.includes('import.meta.url') && content.includes('process.argv[1]')) {
      results.esmGuard = true;
      console.log('   ✅ ESM CLI guard present');
    } else {
      console.log('   ❌ ESM CLI guard missing');
    }
    console.log('');

    // Test 7: Bearer token authentication
    console.log('✅ Test 7: Bearer token authentication');
    const bearerMatches = content.match(/Authorization:\s*`Bearer\s*\$\{GITHUB_TOKEN\}`/g);
    if (bearerMatches && bearerMatches.length >= 7) {
      results.bearerAuth = true;
      console.log(`   ✅ Found ${bearerMatches.length} Bearer token usages`);
    } else {
      console.log(
        `   ❌ Expected at least 7 Bearer token usages, found ${bearerMatches?.length || 0}`
      );
    }
    console.log('');

    // Test 8: Zod validation
    console.log('✅ Test 8: Zod validation');
    const zodMatches = content.match(/z\.(string|number|array|enum)\([^)]+\)/g);
    if (zodMatches && zodMatches.length >= 10) {
      results.zodValidation = true;
      console.log(`   ✅ Found ${zodMatches.length} Zod validations`);
    } else {
      console.log(`   ❌ Expected at least 10 Zod validations, found ${zodMatches?.length || 0}`);
    }
    console.log('');

    // Test 9: Config.json entry
    console.log('✅ Test 9: Config.json entry validation');
    const configPath = path.join(__dirname, '..', '..', 'config', 'config.json');
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      if (configContent.includes('github-server.ts')) {
        results.configEntry = true;
        console.log('   ✅ Config.json entry found');
      } else {
        console.log('   ❌ Config.json entry missing');
      }
    } catch (error) {
      console.log(`   ❌ Could not read config.json: ${error.message}`);
    }
    console.log('');
  } catch (error) {
    console.error(`Test execution error: ${error.message}`);
  }

  // Results summary
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('========================');

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase();
    console.log(`${status} ${testName.padEnd(20)}`);
  });

  console.log(`\n🎯 OVERALL: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL TASK 1.2 REQUIREMENTS MET!');
    process.exit(0);
  } else {
    console.log('⚠️  Some requirements not met. Review the failures above.');
    process.exit(1);
  }
}

/**
 * Run the server with optional timeout
 */
async function runServer(token, timeout) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    if (token) {
      env.GITHUB_TOKEN = token;
    }

    const server = spawn('npx', ['tsx', TEST_CONFIG.serverPath], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const timer = setTimeout(() => {
      server.kill('SIGTERM');
      if (token) {
        resolve(); // Server started successfully
      } else {
        reject(new Error('Server should have failed without token'));
      }
    }, timeout);

    server.on('close', (code) => {
      clearTimeout(timer);

      if (!token && code === 1) {
        if (errorOutput.includes('GITHUB_TOKEN env var not set')) {
          reject(new Error('GITHUB_TOKEN env var not set'));
        } else {
          reject(new Error(`Unexpected exit: ${errorOutput}`));
        }
      } else if (token && code === 0) {
        resolve();
      } else {
        reject(new Error(`Unexpected exit code: ${code}`));
      }
    });

    server.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

// Run tests
if (require.main === module) {
  testGitHubServer().catch(console.error);
}

module.exports = { testGitHubServer };
