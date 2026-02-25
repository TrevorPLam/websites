#!/usr/bin/env node

/**
 * @file scripts/test-mcp-development.js
 * @summary Tests MCP development configuration and workflow.
 * @description Validates development-specific features and relaxed security settings.
 * @security Tests development configuration with relaxed restrictions.
 * @adr none
 * @requirements MCP-006, DEVELOPMENT-TESTING
 */

/**
 * MCP Development Test Suite
 * Tests development-specific MCP configuration and features
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPDevelopmentTester {
  constructor() {
    this.testResults = [];
    this.rootDir = path.join(__dirname, '..');
    this.mcpDir = path.join(this.rootDir, '.mcp');
    this.configPath = path.join(this.mcpDir, 'config.json');
    this.devConfigPath = path.join(this.mcpDir, 'config.development.json');
  }

  async runDevelopmentTests() {
    console.log('🧪 Starting MCP Development Test Suite\n');

    try {
      await this.testDevelopmentConfiguration();
      await this.testRelaxedSecurity();
      await this.testDevelopmentFeatures();
      await this.testWorkflowScripts();
      await this.testEnvironmentFiles();

      this.printResults();
    } catch (error) {
      console.error('❌ Development test suite failed:', error);
      process.exit(1);
    }
  }

  async testDevelopmentConfiguration() {
    console.log('🔧 Testing Development Configuration...');

    try {
      // Check if development config exists
      if (!fs.existsSync(this.devConfigPath)) {
        throw new Error('Development configuration file not found');
      }
      this.addResult('Development Config File', true, 'Development configuration exists');

      // Validate development config structure
      const devConfig = JSON.parse(fs.readFileSync(this.devConfigPath, 'utf8'));

      // Check for required servers
      const requiredServers = ['filesystem', 'git', 'everything', 'memory'];
      const missingServers = requiredServers.filter(server => !devConfig.servers[server]);

      if (missingServers.length === 0) {
        this.addResult('Required Servers', true, 'All required servers present in dev config');
      } else {
        this.addResult('Required Servers', false, `Missing servers: ${missingServers.join(', ')}`);
      }

      // Check memory server configuration
      const memoryConfig = devConfig.servers.memory;
      if (memoryConfig && memoryConfig.env && memoryConfig.env.MEMORY_MODE === 'volatile') {
        this.addResult('Memory Configuration', true, 'Volatile memory configured for development');
      } else {
        this.addResult('Memory Configuration', false, 'Memory not configured for development');
      }

    } catch (error) {
      this.addResult('Development Configuration', false, error.message);
    }
  }

  async testRelaxedSecurity() {
    console.log('\n🔓 Testing Relaxed Security Settings...');

    try {
      const devConfig = JSON.parse(fs.readFileSync(this.devConfigPath, 'utf8'));

      // Test filesystem read-write access
      const filesystemConfig = devConfig.servers.filesystem;
      if (filesystemConfig.env.READ_ONLY_BY_DEFAULT === 'false') {
        this.addResult('Filesystem Read-Write', true, 'Read-write access enabled for development');
      } else {
        this.addResult('Filesystem Read-Write', false, 'Read-write access not enabled');
      }

      // Test git push enabled
      const gitConfig = devConfig.servers.git;
      if (gitConfig.env.ALLOW_PUSH === 'true') {
        this.addResult('Git Push Enabled', true, 'Git push enabled for development');
      } else {
        this.addResult('Git Push Enabled', false, 'Git push not enabled');
      }

      // Test debug logging
      const hasDebugLogging =
        (filesystemConfig.env.LOG_LEVEL === 'debug') &&
        (gitConfig.env.LOG_LEVEL === 'debug');

      if (hasDebugLogging) {
        this.addResult('Debug Logging', true, 'Debug logging enabled');
      } else {
        this.addResult('Debug Logging', false, 'Debug logging not properly enabled');
      }

    } catch (error) {
      this.addResult('Relaxed Security', false, error.message);
    }
  }

  async testDevelopmentFeatures() {
    console.log('\n🚀 Testing Development Features...');

    try {
      // Test development memory file
      const memoryPath = path.join(this.mcpDir, 'memory-dev.json');
      if (fs.existsSync(memoryPath)) {
        this.addResult('Development Memory', true, 'Development memory file exists');
      } else {
        this.addResult('Development Memory', false, 'Development memory file missing');
      }

      // Test development logs directory
      const logDir = path.join(this.mcpDir, 'logs');
      if (fs.existsSync(logDir)) {
        this.addResult('Log Directory', true, 'Development log directory exists');
      } else {
        this.addResult('Log Directory', false, 'Development log directory missing');
      }

      // Test environment files
      const devEnvPath = path.join(this.mcpDir, '.env.development');
      const prodEnvPath = path.join(this.mcpDir, '.env.production');

      const envFilesExist = fs.existsSync(devEnvPath) && fs.existsSync(prodEnvPath);
      if (envFilesExist) {
        this.addResult('Environment Files', true, 'Both development and production env files exist');
      } else {
        this.addResult('Environment Files', false, 'Missing environment files');
      }

    } catch (error) {
      this.addResult('Development Features', false, error.message);
    }
  }

  async testWorkflowScripts() {
    console.log('\n⚙️ Testing Workflow Scripts...');

    try {
      const scripts = [
        'setup-mcp-development.js',
        'mcp-dev-workflow.js',
        'test-mcp-integration.js',
        'test-mcp-ai-integration.js',
        'validate-mcp-production.js'
      ];

      let allScriptsExist = true;
      for (const script of scripts) {
        const scriptPath = path.join(this.rootDir, 'scripts', script);
        if (!fs.existsSync(scriptPath)) {
          allScriptsExist = false;
          break;
        }
      }

      if (allScriptsExist) {
        this.addResult('Workflow Scripts', true, 'All workflow scripts exist');
      } else {
        this.addResult('Workflow Scripts', false, 'Missing workflow scripts');
      }

      // Test setup script functionality
      console.log('  Testing setup script...');
      const setupResult = await this.runScript('setup-mcp-development.js', ['--help']);
      // Help command should work (exit code 1 is fine for help)
      if (setupResult.success || setupResult.output.includes('Usage:')) {
        this.addResult('Setup Script', true, 'Setup script is executable');
      } else {
        this.addResult('Setup Script', false, 'Setup script not working');
      }

      // Test workflow script functionality
      console.log('  Testing workflow script...');
      const workflowResult = await this.runScript('mcp-dev-workflow.js', ['--help']);
      if (workflowResult.success) {
        this.addResult('Workflow Script', true, 'Workflow script is executable');
      } else {
        this.addResult('Workflow Script', false, 'Workflow script not working');
      }

    } catch (error) {
      this.addResult('Workflow Scripts', false, error.message);
    }
  }

  async testEnvironmentFiles() {
    console.log('\n🌍 Testing Environment Files...');

    try {
      // Test development environment
      const devEnvPath = path.join(this.mcpDir, '.env.development');
      if (fs.existsSync(devEnvPath)) {
        const devEnv = fs.readFileSync(devEnvPath, 'utf8');

        // Check for development-specific settings
        const hasDevSettings =
          devEnv.includes('READ_ONLY_BY_DEFAULT=false') &&
          devEnv.includes('ALLOW_PUSH=true') &&
          devEnv.includes('LOG_LEVEL=debug');

        if (hasDevSettings) {
          this.addResult('Dev Environment Settings', true, 'Development environment properly configured');
        } else {
          this.addResult('Dev Environment Settings', false, 'Development environment missing key settings');
        }
      } else {
        this.addResult('Dev Environment Settings', false, 'Development environment file not found');
      }

      // Test production environment
      const prodEnvPath = path.join(this.mcpDir, '.env.production');
      if (fs.existsSync(prodEnvPath)) {
        const prodEnv = fs.readFileSync(prodEnvPath, 'utf8');

        // Check for production-specific settings
        const hasProdSettings =
          prodEnv.includes('READ_ONLY_BY_DEFAULT=true') &&
          prodEnv.includes('ALLOW_PUSH=false') &&
          prodEnv.includes('LOG_LEVEL=info');

        if (hasProdSettings) {
          this.addResult('Prod Environment Settings', true, 'Production environment properly configured');
        } else {
          this.addResult('Prod Environment Settings', false, 'Production environment missing key settings');
        }
      } else {
        this.addResult('Prod Environment Settings', false, 'Production environment file not found');
      }

    } catch (error) {
      this.addResult('Environment Files', false, error.message);
    }
  }

  async runScript(scriptName, args = []) {
    return new Promise((resolve) => {
      const scriptPath = path.join(this.rootDir, 'scripts', scriptName);
      const child = spawn('node', [scriptPath, ...args], {
        stdio: 'pipe',
        cwd: this.rootDir
      });

      let output = '';
      let resolved = false;

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          resolve({ success: code === 0, output });
        }
      });

      child.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: error.message });
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: false, error: 'Script timeout' });
        }
      }, 10000);
    });
  }

  addResult(testName, success, message) {
    this.testResults.push({ testName, success, message });
    const status = success ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${message}`);
  }

  printResults() {
    console.log('\n📊 Development Test Results:');
    console.log('===============================');

    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;

    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.testName}: ${result.message}`);
    });

    console.log(`\nSummary: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log('🎉 All development tests passed!');
      console.log('\n📋 Development Ready:');
      console.log('• MCP configuration optimized for development');
      console.log('• Security settings relaxed for local development');
      console.log('• Workflow scripts functional');
      console.log('• Environment files properly configured');
    } else {
      console.log('⚠️  Some tests failed. Check the configuration and setup.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPDevelopmentTester();
  tester.runDevelopmentTests().catch(console.error);
}

module.exports = MCPDevelopmentTester;
